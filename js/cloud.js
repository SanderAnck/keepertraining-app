// Cloud-sync met Supabase, zonder bibliotheek (gewone fetch naar de REST-API van Supabase).
// Local-first: de app werkt altijd met IndexedDB. Wijzigingen staan in de wachtrij 'outbox' en gaan naar de server zodra
// er verbinding is; nieuwe wijzigingen van andere toestellen worden opgehaald via het volgnummer 'seq'.
// Inloggen gebeurt met e-mail en wachtwoord: werkt binnen de beginscherm-app op iOS en vraagt geen eigen mailserver.
// Het account maak je zelf aan in het Supabase-dashboard (zie supabase/README.md).
import * as db from './db.js';
import { SUPABASE_URL, SUPABASE_KEY } from './cloud-config.js';
import { SYNC_STORES, outboxEntry, outboxKey, toRow, decide, maxSeq, needsRefresh } from './logic/sync.js';
import { loadAll } from './state.js';

const PAGE = 500;
const CHUNK = 100;

export const configured = () => Boolean(SUPABASE_URL && SUPABASE_KEY);
const base = () => SUPABASE_URL.replace(/\/+$/, '');

const meta = async (key) => { const r = await db.get('syncMeta', key); return r ? r.value : null; };
const setMeta = (key, value) => db.put('syncMeta', { key, value });

function niceError(status, msg) {
  if (status === 429) return 'Te veel pogingen. Wacht even en probeer opnieuw.';
  if (/invalid login credentials/i.test(msg || '')) return 'E-mailadres of wachtwoord klopt niet.';
  if (/email not confirmed/i.test(msg || '')) return 'Dit account is nog niet bevestigd. Vink "Auto Confirm User" aan of bevestig het in Supabase.';
  if (/signups? not allowed/i.test(msg || '')) return 'Nieuwe accounts zijn uitgeschakeld in Supabase.';
  return msg || `Serverfout (${status})`;
}

async function api(path, { method = 'GET', body, token, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(base() + path, {
      method,
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    const err = new Error('Geen verbinding met de cloud.');
    err.offline = true;
    throw err;
  }
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* geen JSON */ }
  if (!res.ok) {
    const raw = json && (json.msg || json.message || json.error_description || json.error);
    const err = new Error(niceError(res.status, raw));
    err.status = res.status;
    throw err;
  }
  return json;
}

// ---------- Inloggen ----------

async function saveAuth(r) {
  const expires_at = r.expires_at || Math.floor(Date.now() / 1000) + (r.expires_in || 3600);
  const user = r.user ? { id: r.user.id, email: r.user.email } : (await meta('auth'))?.user;
  await setMeta('auth', { access_token: r.access_token, refresh_token: r.refresh_token, expires_at, user });
}

/** Logt in met e-mail en wachtwoord en zet alle lokale gegevens klaar voor de eerste sync. */
export async function signIn(email, password) {
  await setMeta('lastEmail', email.trim());
  const r = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email.trim(), password } });
  const prev = await meta('auth');
  await saveAuth(r);
  // Ander account dan vorige keer: alles opnieuw ophalen.
  if (!prev || !prev.user || prev.user.id !== r.user?.id) await setMeta('cursor', 0);
  await setMeta('lastError', null);
  await queueAll();
  return syncNow();
}

/** Geldig toegangstoken, of null als je (opnieuw) moet inloggen. */
async function getToken() {
  const auth = await meta('auth');
  if (!auth) return null;
  if (!needsRefresh(auth)) return auth.access_token;
  try {
    const r = await api('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: auth.refresh_token } });
    await saveAuth(r);
    return r.access_token;
  } catch (e) {
    if (e.offline) throw e;
    await setMeta('auth', null);
    await setMeta('lastError', 'Je bent uitgelogd. Log opnieuw in om te synchroniseren.');
    return null;
  }
}

/** Uitloggen op dit toestel. De lokale gegevens blijven staan. */
export async function signOut() {
  const auth = await meta('auth');
  if (auth) { try { await api('/auth/v1/logout', { method: 'POST', token: auth.access_token }); } catch { /* lokaal toch uitloggen */ } }
  await setMeta('auth', null);
  await setMeta('lastError', null);
  notify(0);
}

// ---------- Synchroniseren ----------

/** Zet alle lokale trainingen, oefeningen en keepers in de wachtrij (eerste sync, na herstel van een back-up). */
export async function queueAll() {
  if (!configured()) return;
  for (const kind of SYNC_STORES) {
    for (const rec of await db.getAll(kind)) await db.put('outbox', outboxEntry(kind, rec.id, rec));
  }
}

async function push(token, userId) {
  const entries = await db.getAll('outbox');
  for (let i = 0; i < entries.length; i += CHUNK) {
    const chunk = entries.slice(i, i + CHUNK);
    const rows = await Promise.all(chunk.map(async (e) => toRow(e, e.deleted ? null : await db.get(e.kind, e.id), userId)));
    await api('/rest/v1/records?on_conflict=user_id,kind,id', {
      method: 'POST', token, body: rows, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }
    });
    // Alleen wissen uit de wachtrij als er intussen geen nieuwere wijziging bijkwam.
    for (const e of chunk) {
      const cur = await db.get('outbox', e.key);
      if (cur && cur.updatedAt === e.updatedAt && cur.deleted === e.deleted) await db.del('outbox', e.key);
    }
  }
}

async function pull(token, userId) {
  let cursor = (await meta('cursor')) || 0;
  let changed = 0;
  for (;;) {
    const rows = await api(`/rest/v1/records?select=kind,id,data,updated_at,deleted,seq&user_id=eq.${userId}&seq=gt.${cursor}&order=seq.asc&limit=${PAGE}`, { token });
    for (const row of rows) {
      const local = await db.get(row.kind, row.id);
      const pending = await db.get('outbox', outboxKey(row.kind, row.id));
      const action = decide(row, local, pending);
      if (action === 'put') { await db.put(row.kind, row.data); changed++; }
      if (action === 'delete') { await db.del(row.kind, row.id); changed++; }
    }
    cursor = maxSeq(rows, cursor);
    await setMeta('cursor', cursor);
    if (rows.length < PAGE) return changed;
  }
}

function notify(changed) {
  globalThis.dispatchEvent?.(new CustomEvent('keeper:synced', { detail: { changed } }));
}

let running = null;
let again = false;

async function syncOnce() {
  if (!configured()) return { skipped: true };
  const token = await getToken();
  if (!token) return { skipped: true };
  const { user } = await meta('auth');
  try {
    await push(token, user.id);
    const changed = await pull(token, user.id);
    await setMeta('lastSync', Date.now());
    await setMeta('lastError', null);
    if (changed) await loadAll();
    notify(changed);
    return { changed };
  } catch (e) {
    await setMeta('lastError', e.message);
    notify(0);
    throw e;
  }
}

/** Synchroniseert nu (wachtrij versturen, dan nieuwe wijzigingen ophalen). Eén sync tegelijk. */
export function syncNow() {
  if (running) { again = true; return running; }
  running = (async () => {
    try {
      let result;
      do { again = false; result = await syncOnce(); } while (again);
      return result;
    } finally { running = null; }
  })();
  return running;
}

let timer = null;
export function scheduleSync(delay = 2000) {
  if (!configured()) return;
  clearTimeout(timer);
  timer = setTimeout(() => { syncNow().catch((e) => console.warn('Sync mislukt:', e.message)); }, delay);
}

/** Start automatische sync: bij openen, bij elke wijziging, bij terugkeren naar de app, bij verbinding en elke 5 min. */
export function startSync() {
  if (!configured()) return;
  addEventListener('keeper:changed', () => scheduleSync(2000));
  addEventListener('online', () => scheduleSync(0));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') scheduleSync(0); });
  setInterval(() => { if (document.visibilityState === 'visible') scheduleSync(0); }, 5 * 60 * 1000);
  scheduleSync(500);
}

/** Toestand voor het scherm Instellingen. */
export async function status() {
  if (!configured()) return { configured: false };
  const [auth, lastSync, lastError, lastEmail, outbox] = await Promise.all([
    meta('auth'), meta('lastSync'), meta('lastError'), meta('lastEmail'), db.getAll('outbox')
  ]);
  return { configured: true, email: auth?.user?.email || null, loggedIn: Boolean(auth), lastSync, lastError, lastEmail, pending: outbox.length, busy: Boolean(running) };
}
