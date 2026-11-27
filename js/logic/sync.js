// Pure logica voor cloud-sync (geen opslag, netwerk of DOM): wachtrij-items, rijen voor de server en beslissen
// wat er met een binnenkomende wijziging gebeurt. Regel: de laatste wijziging (updatedAt) wint.

/** Stores die naar de cloud gaan. Instellingen en de veldmodus blijven lokaal op elk toestel. */
export const SYNC_STORES = ['sessions', 'exercises', 'keepers'];

/** Tijdstip van de laatste wijziging van een record (oudere records hebben soms enkel createdAt). */
export const stamp = (rec) => (rec && (rec.updatedAt || rec.createdAt)) || 0;

export const outboxKey = (kind, id) => `${kind}:${id}`;

/** Wachtrij-item voor een bewaard record, of voor een verwijdering als rec null is. */
export function outboxEntry(kind, id, rec, now = Date.now()) {
  return { key: outboxKey(kind, id), kind, id, updatedAt: rec ? stamp(rec) || now : now, deleted: !rec };
}

/** Rij voor de tabel public.records. Het record zelf komt uit IndexedDB (null als het verwijderd is). */
export function toRow(entry, rec, userId) {
  const gone = entry.deleted || !rec;
  return { user_id: userId, kind: entry.kind, id: entry.id, data: gone ? null : rec, updated_at: entry.updatedAt, deleted: gone };
}

/**
 * Wat doen we met een rij van de server?
 * local: het lokale record (of undefined), pending: het wachtrij-item voor dit record (of undefined).
 * Geeft 'put', 'delete' of 'skip'.
 */
export function decide(row, local, pending) {
  if (!row || !SYNC_STORES.includes(row.kind)) return 'skip';
  const remote = Number(row.updated_at) || 0;
  // Een lokale wijziging die nog verstuurd moet worden en nieuwer is, wint.
  if (pending && pending.updatedAt > remote) return 'skip';
  if (row.deleted || !row.data) return local ? (stamp(local) > remote ? 'skip' : 'delete') : 'skip';
  if (local && stamp(local) > remote) return 'skip';
  if (local && stamp(local) === remote && JSON.stringify(local) === JSON.stringify(row.data)) return 'skip';
  return 'put';
}

/** Hoogste volgnummer in een reeks rijen (om de volgende keer enkel nieuwere op te halen). */
export const maxSeq = (rows, from = 0) => rows.reduce((m, r) => Math.max(m, Number(r.seq) || 0), from);

/** Een e-mailadres dat ruwweg klopt. */
export const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

/** De code uit de e-mail: 6 tot 10 cijfers, spaties worden genegeerd. Geeft de code of null. */
export function cleanCode(s) {
  const c = String(s || '').replace(/\s+/g, '');
  return /^\d{6,10}$/.test(c) ? c : null;
}

/** Moet het toegangstoken vernieuwd worden? expiresAt in seconden (zoals Supabase het geeft). */
export const needsRefresh = (auth, nowMs = Date.now()) => !auth || !auth.expires_at || auth.expires_at * 1000 - 60000 < nowMs;
