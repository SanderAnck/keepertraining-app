// Automatische trainingsgenerator (pure functies): stelt een volledige training samen uit de bibliotheek op basis van de parameters.
// Regels: leeftijdsgeschikte belasting en duiklimiet, opwarming met mobiliteit + balgewenning + lichte valvorm,
// totale duur binnen de beschikbare tijd (±5 min), van eenvoudig naar complex, geen twee explosieve oefeningen na elkaar.
import { AGE, THEME } from './constants.js';
import { checkExercise, isUnsuitable, itemDives, itemTiming } from './load.js';
import { createItem, uid, structuredCopy } from './session.js';

/** Voorspelbare toevalsgenerator (voor tests en "nieuw voorstel"). */
export function seededRandom(seed = Date.now()) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Aantal kernblokken volgens de beschikbare tijd. */
export const kernCount = (time) => (time <= 45 ? 1 : time <= 80 ? 2 : 3);

/** Tijdsverdeling in minuten: opwarming, kernblokken, afsluiting. */
export function timeBudget(time) {
  const warm = Math.max(8, Math.round(time * 0.2));
  const cool = time >= 40 ? Math.max(5, Math.round(time * 0.1)) : 0;
  const n = kernCount(time);
  const kern = time - warm - cool;
  const per = Array.from({ length: n }, (_, i) => Math.floor(kern / n) + (i < kern % n ? 1 : 0));
  return { warm, cool, kern: per };
}

/** Oefeningen die passen bij de parameters (geen fouten). */
export function candidates(exercises, params) {
  return exercises.filter((e) => !isUnsuitable(checkExercise(e, params)));
}

function themeScore(ex, themes, main) {
  if ((ex.themes || [])[0] === main) return 3;
  if ((ex.themes || []).includes(main)) return 2;
  if ((ex.themes || []).some((t) => themes.includes(t))) return 1;
  return 0;
}

/** Gewogen keuze: hogere score = grotere kans. */
function pick(list, score, rng) {
  const scored = list.map((x) => ({ x, w: Math.max(0.05, score(x)) }));
  const total = scored.reduce((a, b) => a + b.w, 0);
  if (!scored.length) return null;
  let r = rng() * total;
  for (const s of scored) { r -= s.w; if (r <= 0) return s.x; }
  return scored[scored.length - 1].x;
}

const explosive = (ex, item) => !!ex?.explosive && item?.variant !== 'makkelijker';

/**
 * Stelt een training voor. opts: { rng, keep: bestaande sessie (vastgezette items blijven), title }.
 * Geeft een nieuwe sessie terug (zelfde id/titel/datum als keep, indien meegegeven).
 */
export function generateSession(params, exercises, opts = {}) {
  const rng = opts.rng || seededRandom();
  const base = opts.keep ? structuredCopy(opts.keep) : null;
  const pool = candidates(exercises, params);
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const age = AGE[params.age];
  const themes = [params.mainTheme, ...(params.themes || [])];
  const budget = timeBudget(params.time || 60);
  const nKern = budget.kern.length;

  // Vastgezette items per bloktype/kernnummer.
  const locked = { opwarming: [], afsluiting: [], kern: Array.from({ length: nKern }, () => []) };
  if (base) {
    let k = -1;
    for (const b of base.blocks) {
      if (b.type === 'kern') k = Math.min(k + 1, nKern - 1);
      for (const it of b.items) {
        if (!it.locked || !byId.has(it.exerciseId)) continue;
        if (b.type === 'kern') locked.kern[Math.max(0, k)].push(it); else locked[b.type].push(it);
      }
    }
  }
  const used = new Set([...locked.opwarming, ...locked.afsluiting, ...locked.kern.flat()].map((i) => i.exerciseId));
  let dives = [...locked.opwarming, ...locked.afsluiting, ...locked.kern.flat()].reduce((a, it) => a + itemDives(byId.get(it.exerciseId), it), 0);
  const maxDives = age ? age.maxDives : 90;

  const make = (ex) => ({ ...createItem(ex, params), locked: false });
  const fits = (ex) => {
    if (used.has(ex.id)) return false;
    const d = itemDives(ex, make(ex));
    return dives + d <= maxDives;
  };
  const take = (ex) => { used.add(ex.id); const it = make(ex); dives += itemDives(ex, it); return it; };
  const minutes = (items) => items.reduce((a, it) => a + it.duration, 0);

  // ---------- Opwarming: mobiliteit, balgewenning, lichte valvorm ----------
  const warmItems = [...locked.opwarming];
  const warmPool = pool.filter((e) => (e.blockTypes || []).includes('opwarming'));
  for (const tag of ['mobiliteit', 'balgewenning', 'valvorm']) {
    if (warmItems.some((it) => (byId.get(it.exerciseId)?.warmup || []).includes(tag))) continue;
    const ex = pick(warmPool.filter((e) => (e.warmup || []).includes(tag) && fits(e)), (e) => 1 + themeScore(e, themes, params.mainTheme), rng);
    if (ex) warmItems.push(take(ex));
  }

  // ---------- Kern: per blok een thema, van eenvoudig naar complex ----------
  const kernPool = pool.filter((e) => (e.blockTypes || []).includes('kern'));
  const blockThemes = Array.from({ length: nKern }, (_, i) => (i === 0 ? params.mainTheme : themes.filter((t) => t !== params.mainTheme)[i - 1] || params.mainTheme));
  const kernBlocks = locked.kern.map((items, i) => {
    const out = [...items];
    const theme = blockThemes[i];
    const target = budget.kern[i];
    // Latere kernblokken mogen complexer (wedstrijdechter) zijn.
    const prefComplexity = nKern === 1 ? 2 : 1 + Math.round((i / (nKern - 1)) * 2);
    let guard = 0;
    while (minutes(out) < target - 3 && guard++ < 8) {
      const last = out[out.length - 1];
      const lastEx = last && byId.get(last.exerciseId);
      let options = kernPool.filter((e) => fits(e) && !(explosive(e, make(e)) && explosive(lastEx, last)));
      // De eerste oefening van een blok komt altijd uit het thema van het blok (als dat kan).
      const onTheme = options.filter((e) => (e.themes || []).includes(theme));
      if (!out.some((it) => (byId.get(it.exerciseId)?.themes || []).includes(theme)) && onTheme.length) options = onTheme;
      const ex = pick(options, (e) => {
        const ts = (e.themes || [])[0] === theme ? 20 : (e.themes || []).includes(theme) ? 12 : themeScore(e, themes, params.mainTheme) ? 3 : 0.5;
        const cs = 2 - Math.abs((e.complexity || 2) - prefComplexity) * 0.7;
        return ts + cs;
      }, rng);
      if (!ex) break;
      out.push(take(ex));
    }
    return sortBlock(out, byId);
  });

  // Lege kernblokken (te weinig passende oefeningen) vallen weg; hun tijd gaat naar de andere blokken.
  const kernTargets = [...budget.kern];
  for (let i = kernBlocks.length - 1; i >= 0 && kernBlocks.length > 1; i--) {
    if (!kernBlocks[i].length) { const t = kernTargets.splice(i, 1)[0]; kernBlocks.splice(i, 1); kernTargets[kernTargets.length - 1] += t; }
  }

  // ---------- Afsluiting: spelvorm, wedstrijdvorm of cool-down ----------
  const coolItems = [...locked.afsluiting];
  if (budget.cool && minutes(coolItems) < budget.cool - 2) {
    const lastKern = kernBlocks.flat().at(-1);
    const coolPool = pool.filter((e) => (e.blockTypes || []).includes('afsluiting') && fits(e)
      && !(explosive(e, make(e)) && explosive(byId.get(lastKern?.exerciseId), lastKern)));
    const ex = pick(coolPool, (e) => 1 + themeScore(e, themes, params.mainTheme) + ((e.complexity || 1) === 3 ? 1 : 0), rng);
    if (ex) coolItems.push(take(ex));
  }

  // ---------- Geen twee explosieve oefeningen na elkaar, ook niet over blokken heen ----------
  const seq = [warmItems, ...kernBlocks, coolItems];
  let prev = null;
  for (const items of seq) {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (prev && explosive(byId.get(prev.exerciseId), prev) && explosive(byId.get(it.exerciseId), it)) {
        const j = items.findIndex((x, k) => k > i && !explosive(byId.get(x.exerciseId), x));
        if (j > 0) [items[i], items[j]] = [items[j], items[i]];
        else if (!it.locked) { it.variant = 'makkelijker'; it.variantManual = false; }
      }
      prev = items[i];
    }
  }

  // ---------- Duur passend maken ----------
  fitDurations(warmItems, budget.warm);
  kernBlocks.forEach((items, i) => fitDurations(items, kernTargets[i]));
  if (budget.cool) fitDurations(coolItems, budget.cool);
  // Te weinig oefeningen (bv. jongste groep met weinig materiaal): langere oefeningen in plaats van een te korte training.
  const all = [warmItems, ...kernBlocks, coolItems];
  const total = all.reduce((a, items) => a + minutes(items), 0);
  if (total < (params.time || 60) - 4) {
    const short = (params.time || 60) - total;
    const kernMin = kernBlocks.reduce((a, items) => a + minutes(items), 0);
    kernBlocks.forEach((items) => fitDurations(items, minutes(items) + Math.round((short * minutes(items)) / Math.max(1, kernMin)), 30));
  }

  const session = base || {
    id: uid(), title: opts.title || '', date: opts.date || null, status: 'gepland', isTemplate: false,
    notes: { good: '', better: '', perKeeper: '' }, createdAt: Date.now()
  };
  session.parameters = structuredCopy(params);
  session.blocks = [
    { id: uid(), type: 'opwarming', items: warmItems },
    ...kernBlocks.map((items) => ({ id: uid(), type: 'kern', items })),
    { id: uid(), type: 'afsluiting', items: coolItems }
  ];
  if (!session.title || session.title === 'Nieuwe training') session.title = suggestTitle(params);
  session.generatedAt = Date.now();
  return session;
}

/** Binnen een blok: van eenvoudig naar complex, en explosieve oefeningen niet na elkaar. */
function sortBlock(items, byId) {
  const sorted = [...items].sort((a, b) => (byId.get(a.exerciseId)?.complexity || 2) - (byId.get(b.exerciseId)?.complexity || 2));
  for (let i = 1; i < sorted.length; i++) {
    const e1 = byId.get(sorted[i - 1].exerciseId); const e2 = byId.get(sorted[i].exerciseId);
    if (explosive(e1, sorted[i - 1]) && explosive(e2, sorted[i])) {
      const j = sorted.findIndex((it, k) => k > i && !explosive(byId.get(it.exerciseId), it));
      if (j > 0) [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
    }
  }
  return sorted;
}

/**
 * Past de duur van niet-vastgezette items aan zodat het blok de doelduur haalt.
 * Minimum 3 min, maximum maxPer (standaard 20) min per oefening, hele minuten.
 */
export function fitDurations(items, target, maxPer = 20) {
  const free = items.filter((it) => !it.locked);
  if (!free.length) return items;
  const fixed = items.filter((it) => it.locked).reduce((a, it) => a + it.duration, 0);
  const goal = Math.max(free.length * 3, target - fixed);
  const sum = free.reduce((a, it) => a + it.duration, 0) || 1;
  for (const it of free) it.duration = Math.min(maxPer, Math.max(3, Math.round((it.duration * goal) / sum)));
  let diff = goal - free.reduce((a, it) => a + it.duration, 0);
  let guard = 0;
  while (diff !== 0 && guard++ < 60) {
    const step = diff > 0 ? 1 : -1;
    const cand = free.filter((it) => (step > 0 ? it.duration < maxPer : it.duration > 3));
    if (!cand.length) break;
    const it = cand.sort((a, b) => (step > 0 ? a.duration - b.duration : b.duration - a.duration))[0];
    it.duration += step; diff -= step;
  }
  // Rust mag de werktijd niet opslorpen bij korte oefeningen.
  for (const it of free) {
    const t = itemTiming(it);
    if (t.workSec < 20 && it.sets > 1) it.sets = Math.max(1, Math.floor((it.duration * 60) / (30 + it.rest)));
  }
  return items;
}

/**
 * "Andere oefening": vervangt één item door een passend alternatief uit hetzelfde bloktype,
 * met een gelijkaardig thema, dat nog niet in de training zit. Duur blijft behouden.
 */
export function swapItem(session, itemId, exercises, rng = seededRandom()) {
  const s = structuredCopy(session);
  const params = s.parameters;
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const block = s.blocks.find((b) => b.items.some((i) => i.id === itemId));
  if (!block) return { session: s, swapped: false };
  const idx = block.items.findIndex((i) => i.id === itemId);
  const old = block.items[idx];
  const oldEx = byId.get(old.exerciseId);
  const inUse = new Set(s.blocks.flatMap((b) => b.items.map((i) => i.exerciseId)));
  const prev = block.items[idx - 1]; const next = block.items[idx + 1];
  let options = candidates(exercises, params).filter((e) => !inUse.has(e.id) && (e.blockTypes || []).includes(block.type)
    && !(e.explosive && ((prev && explosive(byId.get(prev.exerciseId), prev)) || (next && explosive(byId.get(next.exerciseId), next)))));
  // In de opwarming blijft de rol behouden (mobiliteit, balgewenning of valvorm).
  if (block.type === 'opwarming' && (oldEx?.warmup || []).length) {
    const same = options.filter((e) => (oldEx.warmup || []).some((w) => (e.warmup || []).includes(w)));
    options = same;
  }
  const oldThemes = oldEx?.themes || [params.mainTheme];
  const ex = pick(options, (e) => {
    let sc = (e.themes || []).filter((t) => oldThemes.includes(t)).length * 3 + themeScore(e, [params.mainTheme, ...params.themes], params.mainTheme);
    if (block.type === 'opwarming' && (oldEx?.warmup || []).some((w) => (e.warmup || []).includes(w))) sc += 6;
    return sc;
  }, rng);
  if (!ex) return { session: s, swapped: false };
  block.items[idx] = { ...createItem(ex, params), id: old.id, duration: old.duration, locked: false };
  return { session: s, swapped: true, exercise: ex };
}

export function suggestTitle(params) {
  const t = THEME[params.mainTheme]?.short || 'Training';
  const a = AGE[params.age]?.label || '';
  return `${t}${a ? ' · ' + a : ''}`;
}
