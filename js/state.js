// Gedeelde app-toestand: instellingen, oefeningenbibliotheek (seed + eigen) en trainingen, met opslag in IndexedDB.
import * as db from './db.js';
import { DEFAULT_PARAMS } from './logic/constants.js';
import { mergeExercises } from './logic/library.js';
import { structuredCopy } from './logic/session.js';

export const DEFAULT_SETTINGS = {
  key: 'me',
  sound: true,
  volume: 0.8,
  tone: 'fluit',
  sunlight: false,
  theme: 'auto',
  autoContinue: true,
  defaults: DEFAULT_PARAMS,
  favorites: [],
  lastBackup: null,
  backupReminderAt: null
};

const state = { settings: null, seed: [], own: [], exercises: [], byId: new Map(), sessions: [] };
export default state;

export async function loadAll() {
  const [settings, own, sessions, seed] = await Promise.all([
    db.get('settings', 'me'), db.getAll('exercises'), db.getAll('sessions'), loadSeed()
  ]);
  state.settings = { ...structuredCopy(DEFAULT_SETTINGS), ...(settings || {}) };
  state.settings.defaults = { ...DEFAULT_PARAMS, ...(state.settings.defaults || {}) };
  state.seed = seed;
  state.own = own;
  state.sessions = sessions;
  rebuildLibrary();
}

async function loadSeed() {
  try {
    const res = await fetch('data/exercises.json');
    const json = await res.json();
    return json.exercises || [];
  } catch (e) {
    console.warn('Seedoefeningen niet geladen', e);
    return [];
  }
}

function rebuildLibrary() {
  state.exercises = mergeExercises(state.seed, state.own);
  state.byId = new Map(state.exercises.map((e) => [e.id, e]));
  // Verwijderde of onbekende oefeningen blijven zichtbaar in oude trainingen via de seed.
  for (const e of state.seed) if (!state.byId.has(e.id)) state.byId.set(e.id, e);
}

export const getExercise = (id) => state.byId.get(id);
export const isSeed = (id) => state.seed.some((e) => e.id === id);

export async function saveSettings(patch) {
  state.settings = { ...state.settings, ...patch, key: 'me' };
  await db.put('settings', state.settings);
  return state.settings;
}

export async function saveExercise(ex) {
  const rec = structuredCopy(ex);
  delete rec.origin;
  rec.updatedAt = Date.now();
  await db.put('exercises', rec);
  state.own = state.own.filter((e) => e.id !== rec.id).concat(rec);
  rebuildLibrary();
  return getExercise(rec.id);
}

/** Eigen oefening wissen, of een aanpassing van een seedoefening ongedaan maken. */
export async function deleteExercise(id) {
  await db.del('exercises', id);
  state.own = state.own.filter((e) => e.id !== id);
  rebuildLibrary();
}

export async function toggleFavorite(id) {
  const favs = new Set(state.settings.favorites || []);
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  await saveSettings({ favorites: [...favs] });
  return favs.has(id);
}

export const getSession = (id) => state.sessions.find((s) => s.id === id);

export async function saveSession(session) {
  const rec = { ...structuredCopy(session), updatedAt: Date.now() };
  await db.put('sessions', rec);
  state.sessions = state.sessions.filter((s) => s.id !== rec.id).concat(rec);
  return rec;
}

export async function deleteSession(id) {
  await db.del('sessions', id);
  state.sessions = state.sessions.filter((s) => s.id !== id);
}

export const getFieldState = () => db.get('fieldState', 'active');
export const saveFieldState = (fs) => db.put('fieldState', { ...fs, key: 'active' });
export const clearFieldState = () => db.del('fieldState', 'active');
