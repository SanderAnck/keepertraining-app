// Formaat van een back-upbestand (pure functies): opbouwen, valideren en bestandsnaam. Geen opslag of DOM.

export const BACKUP_APP = 'KeeperCoach';
export const BACKUP_FORMAT = 1;
export const BACKUP_STORES = ['sessions', 'exercises', 'keepers', 'settings', 'fieldState'];

export function buildBackup(data, { version, dbVersion, now = new Date() } = {}) {
  const out = {};
  for (const s of BACKUP_STORES) out[s] = Array.isArray(data[s]) ? data[s] : [];
  return { app: BACKUP_APP, format: BACKUP_FORMAT, version, dbVersion, exportedAt: now.toISOString(), data: out };
}

/** Controleert een ingelezen back-up. Gooit een Error met een Nederlandse uitleg als het niet klopt. */
export function parseBackup(text) {
  let obj;
  try { obj = typeof text === 'string' ? JSON.parse(text) : text; } catch { throw new Error('Dit is geen geldig JSON-bestand.'); }
  if (!obj || obj.app !== BACKUP_APP || !obj.data) throw new Error('Dit is geen KeeperCoach-back-up.');
  if (obj.format > BACKUP_FORMAT) throw new Error('Deze back-up komt uit een nieuwere versie van de app. Werk de app eerst bij.');
  const data = {};
  for (const s of BACKUP_STORES) {
    const v = obj.data[s] ?? [];
    if (!Array.isArray(v)) throw new Error(`Onderdeel "${s}" is ongeldig.`);
    data[s] = v;
  }
  return { ...obj, data };
}

export function backupFileName(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `keepercoach-backup-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.json`;
}

export function backupStats(data) {
  return {
    sessions: (data.sessions || []).length,
    exercises: (data.exercises || []).length,
    keepers: (data.keepers || []).length
  };
}
