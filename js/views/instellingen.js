// Scherm "Instellingen": geluid, zonlichtmodus, weergave, standaardparameters, cloud-sync, back-up/herstel, opslag en versie.
import state, { saveSettings } from '../state.js';
import { html, toast, confirmSheet, sheet, unlockAudio, signal, flash } from '../ui.js';
import { setTop, applyAppearance, checkForUpdate } from '../app.js';
import { exportBackup, importBackupFile } from '../backup.js';
import { paramsForm, bindParams } from './params.js';
import { paramsChips } from './common.js';
import { DB_VERSION } from '../db.js';
import * as cloud from '../cloud.js';
import { validEmail } from '../logic/sync.js';

let onSynced = null;
const fmt = (t) => new Date(t).toLocaleString('nl-BE', { dateStyle: 'medium', timeStyle: 'short' });

/** Inhoud van de kaart "Cloud-sync", afhankelijk van de toestand (niet ingesteld, uitgelogd, ingelogd). */
async function fillCloud(main) {
  const el = main.querySelector('#cloudCard');
  if (!el) return;
  const st = await cloud.status();
  let body;
  if (!st.configured) {
    body = html`<p>Nog niet ingesteld. Alles staat enkel op dit toestel.</p>
      <p class="hint">Na het koppelen van een Supabase-project kun je hier inloggen, zodat je trainingen, oefeningen en keepers op al je toestellen hetzelfde zijn.</p>`;
  } else if (st.loggedIn) {
    body = html`<p>Ingelogd als <strong>${st.email || 'onbekend'}</strong>.</p>
      <p class="${st.lastError ? 'warn-text' : ''}">${st.lastError ? st.lastError : st.lastSync ? `Laatst gesynchroniseerd: ${fmt(st.lastSync)}` : 'Nog niet gesynchroniseerd.'}</p>
      ${st.pending ? html`<p class="meta">${st.pending} wijziging${st.pending === 1 ? '' : 'en'} wacht${st.pending === 1 ? '' : 'en'} op verbinding.</p>` : ''}
      <div class="grid2"><button class="btn big primary" data-act="sync">Nu synchroniseren</button><button class="btn big" data-act="logout">Uitloggen</button></div>
      <p class="hint">Trainingen, oefeningen en keepers staan in de cloud en op elk toestel waar je inlogt. Instellingen en de veldmodus blijven per toestel. Zonder verbinding werkt alles gewoon verder; wijzigingen gaan mee zodra je weer online bent.</p>`;
  } else {
    body = html`${st.lastError ? html`<p class="warn-text">${st.lastError}</p>` : ''}
      <label class="field"><span class="label">E-mailadres</span><input type="email" name="cloudEmail" autocomplete="username" inputmode="email" autocapitalize="off" value="${st.lastEmail || ''}"></label>
      <label class="field"><span class="label">Wachtwoord</span><input type="password" name="cloudPassword" autocomplete="current-password"></label>
      <button class="btn big primary" data-act="login">Inloggen</button>
      <p class="hint">Gebruik het account dat je in Supabase aanmaakte. Bij de eerste keer gaan je huidige gegevens van dit toestel naar de cloud.</p>`;
  }
  el.innerHTML = html`<h2 class="h">Cloud-sync</h2>${body}`.s;
}

const seg = (name, opts, value) => html`<div class="seg">${opts.map(([v, l]) => html`<label class="seg-opt"><input type="radio" name="${name}" value="${v}" ${String(value) === String(v) ? 'checked' : ''}><span>${l}</span></label>`)}</div>`;

export async function render(main) {
  setTop('Instellingen');
  const s = state.settings;
  const persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted().catch(() => null) : null;
  const last = s.lastBackup ? new Date(s.lastBackup) : null;
  const days = last ? Math.floor((Date.now() - last) / 86400000) : null;
  main.innerHTML = html`
    <section class="card"><h2 class="h">Geluid op het veld</h2>
      <label class="check big"><input type="checkbox" name="sound" ${s.sound ? 'checked' : ''}><span>Geluidssignaal bij einde werk en rust</span></label>
      <span class="label">Toon</span>${seg('tone', [['fluit', 'Fluitje'], ['piep', 'Piep']], s.tone)}
      <label class="field"><span class="label">Volume</span><input type="range" name="volume" min="0.1" max="1" step="0.1" value="${s.volume}"></label>
      <button class="btn big" data-act="test">Test signaal</button>
      <p class="hint">iPhones kunnen niet trillen vanuit een webapp. Daarom geeft de app een geluid én een flits over het hele scherm. Zet het belsignaal van je iPhone aan.</p>
    </section>
    <section class="card"><h2 class="h">Weergave</h2>
      <span class="label">Thema</span>${seg('theme', [['auto', 'Automatisch'], ['light', 'Licht'], ['dark', 'Donker']], s.theme)}
      <label class="check big"><input type="checkbox" name="sunlight" ${s.sunlight ? 'checked' : ''}><span>Veldmodus standaard in zonlichtmodus</span></label>
      <label class="check big"><input type="checkbox" name="autoContinue" ${s.autoContinue ? 'checked' : ''}><span>Timer loopt automatisch door naar rust en volgende serie</span></label>
    </section>
    <section class="card"><div class="row between"><h2 class="h">Standaardparameters</h2><button class="btn" data-act="defaults">Wijzigen</button></div>
      <div class="chips">${paramsChips(s.defaults)}</div>
      <p class="meta">Gebruikt bij elke nieuwe training: ${s.defaults.keepers} keepers · ${s.defaults.time} min.</p>
    </section>
    <section class="card" id="cloudCard"><h2 class="h">Cloud-sync</h2></section>
    <section class="card"><h2 class="h">Back-up en herstel</h2>
      <p class="${!last || days > 14 ? 'warn-text' : ''}">${last ? `Laatste back-up: ${last.toLocaleString('nl-BE', { dateStyle: 'medium', timeStyle: 'short' })}${days > 0 ? ` (${days} dag${days === 1 ? '' : 'en'} geleden)` : ''}` : 'Nog geen back-up gemaakt.'}</p>
      <p class="hint">Gegevens in een webapp kunnen verloren gaan als iOS opslag opruimt. Bewaar de back-up in Bestanden of iCloud Drive.</p>
      <div class="grid2"><button class="btn big primary" data-act="export">Back-up maken</button>
      <label class="btn big file-btn">Back-up terugzetten<input type="file" name="import" accept="application/json,.json" hidden></label></div>
    </section>
    <section class="card"><h2 class="h">Over</h2>
      <dl class="facts"><dt>Versie</dt><dd>${self.KEEPER_VERSION}</dd><dt>Database</dt><dd>v${DB_VERSION}</dd>
      <dt>Opslag</dt><dd>${persisted === true ? 'Persistent (beschermd)' : persisted === false ? 'Niet persistent: maak regelmatig een back-up' : 'Onbekend'}</dd>
      <dt>Oefeningen</dt><dd>${state.exercises.length} (${state.own.length} eigen of aangepast)</dd><dt>Trainingen</dt><dd>${state.sessions.length}</dd></dl>
      <button class="btn big" data-act="update">Zoek naar update</button>
      <p class="hint">KeeperCoach werkt volledig offline en zonder tracking. Met cloud-sync gaan trainingen, oefeningen en keepers ook naar je eigen Supabase-project (EU).</p>
    </section>`.s;
  await fillCloud(main);
  if (onSynced) removeEventListener('keeper:synced', onSynced);
  onSynced = () => fillCloud(main);
  addEventListener('keeper:synced', onSynced);

  main.onchange = async (e) => {
    const t = e.target;
    if (['sound', 'sunlight', 'autoContinue'].includes(t.name)) await saveSettings({ [t.name]: t.checked });
    if (t.name === 'tone') await saveSettings({ tone: t.value });
    if (t.name === 'volume') await saveSettings({ volume: +t.value });
    if (t.name === 'theme') { await saveSettings({ theme: t.value }); applyAppearance(); }
    if (t.name === 'import' && t.files[0]) {
      const file = t.files[0];
      t.value = '';
      if (!(await confirmSheet('Back-up terugzetten', 'Alle huidige gegevens op dit toestel worden vervangen door de back-up.', 'Terugzetten', true))) return;
      try {
        const st = await importBackupFile(file);
        applyAppearance();
        toast(`Hersteld: ${st.sessions} trainingen, ${st.exercises} eigen oefeningen`);
        render(main);
      } catch (err) { toast(err.message, { duration: 6000 }); }
    }
  };
  main.onclick = async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'test') { unlockAudio(); setTimeout(() => { signal('rust', state.settings); flash('rust'); }, 60); }
    if (b.dataset.act === 'export') {
      try {
        const r = await exportBackup();
        toast(r === 'geannuleerd' ? 'Back-up geannuleerd' : 'Back-up gemaakt');
        render(main);
      } catch (err) { toast('Back-up mislukt: ' + err.message, { duration: 6000 }); }
    }
    if (b.dataset.act === 'login') {
      const email = main.querySelector('[name=cloudEmail]').value.trim();
      const password = main.querySelector('[name=cloudPassword]').value;
      if (!validEmail(email)) { toast('Vul een geldig e-mailadres in'); return; }
      if (!password) { toast('Vul je wachtwoord in'); return; }
      b.disabled = true;
      toast('Inloggen en synchroniseren…');
      try {
        const r = await cloud.signIn(email, password);
        toast(r && r.changed ? `Ingelogd, ${r.changed} gegevens opgehaald uit de cloud` : 'Ingelogd en gesynchroniseerd');
      } catch (err) { toast(err.message, { duration: 6000 }); }
      await fillCloud(main);
    }
    if (b.dataset.act === 'sync') {
      b.disabled = true;
      try {
        const r = await cloud.syncNow();
        toast(r && r.changed ? `Gesynchroniseerd, ${r.changed} wijziging${r.changed === 1 ? '' : 'en'} opgehaald` : 'Alles is gesynchroniseerd');
      } catch (err) { toast(err.message, { duration: 6000 }); }
      await fillCloud(main);
    }
    if (b.dataset.act === 'logout') {
      if (!(await confirmSheet('Uitloggen', 'Je gegevens blijven op dit toestel staan, maar worden niet meer gesynchroniseerd tot je opnieuw inlogt.', 'Uitloggen'))) return;
      await cloud.signOut();
      await fillCloud(main);
    }
    if (b.dataset.act === 'defaults') {
      const d = sheet('Standaardparameters', paramsForm(state.settings.defaults), { wide: true, onClose: () => render(main) });
      bindParams(d, state.settings.defaults, (p) => saveSettings({ defaults: p }));
    }
    if (b.dataset.act === 'update') {
      if (!('serviceWorker' in navigator)) { toast('Updates worden niet ondersteund in deze browser'); return; }
      toast('Zoeken naar update…');
      const remote = await checkForUpdate();
      if (!remote) toast('Geen verbinding, probeer later opnieuw');
      else if (remote === self.KEEPER_VERSION) toast(`Je hebt de nieuwste versie (${self.KEEPER_VERSION})`);
      else toast(`Versie ${remote} wordt geladen, even geduld…`);
    }
  };
  return () => { removeEventListener('keeper:synced', onSynced); onSynced = null; };
}
