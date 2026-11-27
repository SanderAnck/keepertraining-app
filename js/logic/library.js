// Pure functies voor de oefeningenbibliotheek: seed en eigen oefeningen samenvoegen, filteren, zoeken en dupliceren.
import { uid, structuredCopy } from './session.js';

/**
 * Voegt de meegeleverde seed en de eigen oefeningen samen. Een eigen record met dezelfde id als een
 * seedoefening (een aanpassing) wint altijd, zodat een update van de seedlijst niets overschrijft.
 */
export function mergeExercises(seed, own) {
  const map = new Map();
  for (const ex of seed || []) map.set(ex.id, { ...ex, origin: 'seed' });
  for (const ex of own || []) {
    if (ex.deleted) { map.delete(ex.id); continue; }
    const isSeedEdit = map.has(ex.id);
    map.set(ex.id, { ...ex, origin: isSeedEdit ? 'aangepast' : 'eigen' });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'nl'));
}

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Filtert op zoekterm en filters. filters: { q, theme, age, level, intensity, materials: [] (alleen dit materiaal),
 * favorites: bool, own: bool (enkel eigen en aangepaste oefeningen) }, favs: lijst id's.
 */
export function filterExercises(list, filters = {}, favs = []) {
  const q = norm(filters.q).trim();
  return list.filter((ex) => {
    if (filters.favorites && !favs.includes(ex.id)) return false;
    if (filters.own && ex.origin !== 'eigen' && ex.origin !== 'aangepast') return false;
    if (filters.theme && !(ex.themes || []).includes(filters.theme)) return false;
    if (filters.age && !(ex.ages || []).includes(filters.age)) return false;
    if (filters.level && !(ex.levels || []).includes(filters.level)) return false;
    if (filters.intensity && ex.intensity !== filters.intensity) return false;
    if (filters.materials && filters.materials.length && !(ex.materials || []).every((m) => filters.materials.includes(m))) return false;
    if (q) {
      const hay = norm([ex.name, ex.summary, ex.description, ...(ex.coaching || [])].join(' '));
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
}

/** Kopie als eigen oefening. */
export function duplicateExercise(ex) {
  const c = structuredCopy(ex);
  c.id = 'eigen-' + uid();
  c.name = `${ex.name} (kopie)`;
  delete c.origin;
  c.createdAt = Date.now();
  return c;
}

export function emptyExercise() {
  return {
    id: 'eigen-' + uid(),
    name: '', summary: '', description: '',
    themes: ['vangen'], ages: ['u10_12', 'u13_15', 'u16_19', 'senioren'], levels: ['beginner', 'gevorderd', 'elite'],
    intensity: 'gemiddeld', materials: ['ballen'], keepers: { min: 1, max: 2 }, trainers: 1, zone: '',
    duration: 8, sets: 2, reps: 8, rest: 30, divesPerRep: 0, explosive: false, blockTypes: ['kern'],
    coaching: [], mistakes: [], variants: { easier: '', harder: '' },
    diagram: { field: 'doel', elements: [{ t: 'keeper', x: 50, y: 12 }, { t: 'trainer', x: 50, y: 55 }], lines: [{ t: 'bal', p: [[50, 52], [50, 16]], s: 1 }] },
    createdAt: Date.now()
  };
}
