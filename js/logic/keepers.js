// Keeperskaart (pure functies): keepers aanmaken, beoordelingen per thema (1–5), groei, zwakste punten en
// oefeningvoorstellen rond die zwakste punten. Geen opslag of DOM.
import { THEMES, THEME, DEFAULT_PARAMS, MATERIALS } from './constants.js';
import { checkExercise, isUnsuitable } from './load.js';
import { uid, isoDate, structuredCopy } from './session.js';

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;
export const SCORE_LABELS = { 1: 'Werkpunt', 2: 'Zwak', 3: 'Oké', 4: 'Goed', 5: 'Sterk' };

export function createKeeper({ name = '', age = 'senioren', level = 'gevorderd', note = '' } = {}) {
  const now = Date.now();
  return { id: uid(), name: name.trim() || 'Nieuwe keeper', age, level, note, ratings: [], archived: false, createdAt: now, updatedAt: now };
}

/** Enkel gehele scores 1–5 voor bestaande thema's; lege of ongeldige waarden vallen weg. */
export function cleanScores(scores = {}) {
  const out = {};
  for (const t of THEMES) {
    const v = Math.round(Number(scores[t.id]));
    if (Number.isFinite(v) && v >= SCORE_MIN && v <= SCORE_MAX) out[t.id] = v;
  }
  return out;
}

const byDate = (a, b) => (a.date || '').localeCompare(b.date || '') || (a.createdAt || 0) - (b.createdAt || 0);

/** Voegt een beoordeling toe (of vervangt die met hetzelfde id). Lege beoordelingen worden genegeerd. */
export function saveRating(keeper, { id, date = isoDate(), sessionId = null, scores = {}, note = '' } = {}) {
  const k = structuredCopy(keeper);
  const clean = cleanScores(scores);
  const others = (k.ratings || []).filter((r) => r.id !== id);
  if (!Object.keys(clean).length && !note.trim()) { k.ratings = others; return k; }
  const prev = (k.ratings || []).find((r) => r.id === id);
  others.push({ id: id || uid(), date, sessionId, scores: clean, note: note.trim(), createdAt: prev?.createdAt || Date.now() });
  k.ratings = others.sort(byDate);
  k.updatedAt = Date.now();
  return k;
}

export function removeRating(keeper, ratingId) {
  const k = structuredCopy(keeper);
  k.ratings = (k.ratings || []).filter((r) => r.id !== ratingId);
  k.updatedAt = Date.now();
  return k;
}

export const sortedRatings = (keeper) => [...(keeper?.ratings || [])].sort(byDate);

/** Recentste score per thema: { thema: { value, date } }. upto = aantal beoordelingen dat meetelt. */
export function latestScores(keeper, upto = Infinity) {
  const out = {};
  sortedRatings(keeper).slice(0, upto).forEach((r) => {
    for (const [t, v] of Object.entries(r.scores || {})) out[t] = { value: v, date: r.date };
  });
  return out;
}

/** Scores zoals ze stonden vóór de recentste beoordeling (om vooruitgang te tonen). */
export function previousScores(keeper) {
  const n = sortedRatings(keeper).length;
  return n > 1 ? latestScores(keeper, n - 1) : {};
}

/** Reeks van één thema door de tijd: [{ date, value }]. */
export function themeSeries(keeper, theme) {
  return sortedRatings(keeper).filter((r) => r.scores?.[theme]).map((r) => ({ date: r.date, value: r.scores[theme] }));
}

/** Gemiddelde van de recentste score per thema, na elke beoordeling: [{ date, value }]. */
export function overallSeries(keeper) {
  const rs = sortedRatings(keeper);
  const out = [];
  rs.forEach((r, i) => {
    if (!Object.keys(r.scores || {}).length) return;
    const vals = Object.values(latestScores(keeper, i + 1)).map((x) => x.value);
    out.push({ date: r.date, value: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 });
  });
  return out;
}

export function average(scores) {
  const vals = Object.values(scores).map((x) => (typeof x === 'object' ? x.value : x));
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
}

/** Verschil tussen de laatste twee scores van een thema (0 als er maar één is). */
export function trend(keeper, theme) {
  const s = themeSeries(keeper, theme);
  return s.length > 1 ? s[s.length - 1].value - s[s.length - 2].value : 0;
}

/**
 * Zwakste punten: laagste recentste score eerst; bij gelijke stand gaat een dalend thema voor,
 * daarna de vaste volgorde van de thema's. Enkel beoordeelde thema's tellen.
 */
export function weakest(keeper, n = 2) {
  const latest = latestScores(keeper);
  const order = THEMES.map((t) => t.id);
  return Object.entries(latest)
    .map(([theme, { value }]) => ({ theme, value, trend: trend(keeper, theme) }))
    .sort((a, b) => a.value - b.value || a.trend - b.trend || order.indexOf(a.theme) - order.indexOf(b.theme))
    .slice(0, n);
}

export function strongest(keeper, n = 2) {
  const latest = latestScores(keeper);
  return Object.entries(latest).map(([theme, { value }]) => ({ theme, value }))
    .sort((a, b) => b.value - a.value).slice(0, n);
}

/** Trainingsparameters rond de zwakste punten van een keeper (rest uit de standaardparameters). */
export function paramsForKeeper(keeper, defaults = DEFAULT_PARAMS) {
  const weak = weakest(keeper, 2).map((w) => w.theme);
  const main = weak[0] || defaults.mainTheme || 'vangen';
  return {
    ...structuredCopy(DEFAULT_PARAMS), ...structuredCopy(defaults),
    mainTheme: main, themes: [...new Set([main, ...weak])],
    age: keeper.age || defaults.age, level: keeper.level || defaults.level
  };
}

/**
 * Oefeningen die passen bij leeftijd en niveau van de keeper en het thema trainen.
 * Oefeningen met het thema als hoofdthema en zonder niveauwaarschuwing komen eerst.
 */
export function exercisesForTheme(exercises, keeper, theme, limit = 5) {
  const params = {
    ...DEFAULT_PARAMS, mainTheme: theme, themes: [theme], age: keeper.age, level: keeper.level,
    intensity: 'hoog', keepers: 2, trainers: 2, materials: MATERIALS.map((m) => m.id)
  };
  return exercises
    .filter((e) => (e.themes || []).includes(theme))
    .map((e) => ({ e, issues: checkExercise(e, params) }))
    .filter(({ issues }) => !isUnsuitable(issues))
    .map(({ e, issues }) => ({
      e, score: (e.themes[0] === theme ? 2 : 0) + (issues.some((i) => i.code === 'niveau') ? 0 : 1)
    }))
    .sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name, 'nl'))
    .slice(0, limit)
    .map((x) => x.e);
}

/** Korte zin over de evolutie sinds de vorige beoordeling. */
export function progressText(keeper) {
  const latest = latestScores(keeper);
  const prev = previousScores(keeper);
  const ups = [], downs = [];
  for (const [t, { value }] of Object.entries(latest)) {
    const p = prev[t]?.value;
    if (p == null) continue;
    if (value > p) ups.push(THEME[t]?.short || t);
    if (value < p) downs.push(THEME[t]?.short || t);
  }
  const parts = [];
  if (ups.length) parts.push(`vooruit in ${ups.join(', ').toLowerCase()}`);
  if (downs.length) parts.push(`achteruit in ${downs.join(', ').toLowerCase()}`);
  return parts.length ? parts.join('; ') : '';
}
