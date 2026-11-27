// Kleine promise-wrapper rond IndexedDB (stores, CRUD, migraties) plus export en import van alle gegevens.
import { BACKUP_STORES } from './logic/backupFormat.js';

export const DB_NAME = 'keepercoach';
export const DB_VERSION = 2;

let dbPromise = null;

/** Migraties per versie. Verhoog DB_VERSION en voeg een case toe bij elke wijziging aan de stores. */
function upgrade(db, oldVersion) {
  if (oldVersion < 1) {
    const sessions = db.createObjectStore('sessions', { keyPath: 'id' });
    sessions.createIndex('date', 'date');
    db.createObjectStore('exercises', { keyPath: 'id' });
    db.createObjectStore('keepers', { keyPath: 'id' });
    db.createObjectStore('settings', { keyPath: 'key' });
    db.createObjectStore('fieldState', { keyPath: 'key' });
  }
  if (oldVersion < 2) {
    // Cloud-sync: wachtrij met lokale wijzigingen die nog naar de server moeten, en sync-gegevens (login, volgnummer).
    db.createObjectStore('outbox', { keyPath: 'key' });
    db.createObjectStore('syncMeta', { keyPath: 'key' });
  }
}

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    let blocked = false;
    // iOS laat het openen soms eindeloos wachten (bv. tijdens een omzetting naar een nieuwe versie terwijl een ander
    // venster de opslag nog openhoudt). Na 8 s geven we een duidelijke melding in plaats van te blijven laden.
    const timer = setTimeout(() => {
      dbPromise = null;
      reject(new Error(blocked
        ? 'De opslag wordt nog gebruikt door een ander venster van KeeperCoach. Sluit de app en andere tabbladen met KeeperCoach volledig af en open opnieuw'
        : 'De opslag reageert niet. Sluit de app volledig af en open ze opnieuw'));
    }, 8000);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => upgrade(req.result, e.oldVersion);
    req.onsuccess = () => {
      clearTimeout(timer);
      const db = req.result;
      db.onversionchange = () => { db.close(); dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => { clearTimeout(timer); dbPromise = null; reject(req.error); };
    // Geblokkeerd: niet meteen opgeven, de omzetting gaat door zodra het andere venster de opslag sluit.
    req.onblocked = () => { blocked = true; };
  });
  return dbPromise;
}

const done = (req) => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

async function store(name, mode = 'readonly') {
  const db = await openDB();
  return db.transaction(name, mode).objectStore(name);
}

export async function get(name, key) { return done((await store(name)).get(key)); }
export async function getAll(name) { return done((await store(name)).getAll()); }
export async function put(name, value) { return done((await store(name, 'readwrite')).put(value)); }
export async function del(name, key) { return done((await store(name, 'readwrite')).delete(key)); }
export async function clear(name) { return done((await store(name, 'readwrite')).clear()); }

/** Alle gegevens als { store: [records] }. */
export async function exportAll() {
  const db = await openDB();
  const tx = db.transaction(BACKUP_STORES, 'readonly');
  const out = {};
  await Promise.all(BACKUP_STORES.map(async (s) => { out[s] = await done(tx.objectStore(s).getAll()); }));
  return out;
}

/** Vervangt alle gegevens in één transactie (alles of niets). */
export async function importAll(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BACKUP_STORES, 'readwrite');
    for (const s of BACKUP_STORES) {
      const os = tx.objectStore(s);
      os.clear();
      for (const rec of data[s] || []) os.put(rec);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Import afgebroken.'));
  });
}

/** Vraagt persistente opslag aan, zodat iOS de gegevens minder snel opruimt. */
export async function requestPersistence() {
  try {
    if (!navigator.storage || !navigator.storage.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch { return null; }
}
