// Belastingsregels (pure functies): timing per item, geschiktheid van oefeningen, voorgestelde variant en sessietotalen.
import { INTENSITY, AGE, LEVEL, VARIANT, MATERIAL, labelOf, AGE_GROUPS } from './constants.js';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Werk- en rusttijd van één item. duration = totale minuten inclusief rust tussen series. */
export function itemTiming(item) {
  const sets = Math.max(1, Math.round(item.sets || 1));
  const rest = Math.max(0, Math.round(item.rest || 0));
  const totalSec = Math.max(30, Math.round((item.duration || 1) * 60));
  const restTotal = rest * (sets - 1);
  const workSec = Math.max(10, Math.round((totalSec - restTotal) / sets));
  return { sets, workSec, restSec: rest, totalSec: workSec * sets + restTotal };
}

/** RPE (1–10) van een item op basis van de oefening, de variant en de gekozen sessie-intensiteit. */
export function itemRpe(exercise, item) {
  const base = INTENSITY[exercise?.intensity] || INTENSITY.gemiddeld;
  const mid = (base.rpe[0] + base.rpe[1]) / 2;
  const delta = (VARIANT[item?.variant] || VARIANT.basis).rpeDelta;
  return clamp(Math.round(mid + delta), 1, 10);
}

/** Aantal duiken dat een item vraagt (per keeper). */
export function itemDives(exercise, item) {
  if (!exercise || !exercise.divesPerRep) return 0;
  const reps = Math.max(1, item.reps || exercise.reps || 1);
  const sets = Math.max(1, item.sets || exercise.sets || 1);
  const factor = item.variant === 'makkelijker' ? 0.5 : 1;
  return Math.round(exercise.divesPerRep * reps * sets * factor);
}

/**
 * Controleert of een oefening past bij de parameters.
 * Geeft een lijst problemen terug: { code, level: 'fout'|'waarschuwing'|'info', message }.
 */
export function checkExercise(exercise, params) {
  const issues = [];
  if (!exercise || !params) return issues;
  const age = AGE[params.age];
  if (age && Array.isArray(exercise.ages) && !exercise.ages.includes(params.age)) {
    issues.push({ code: 'leeftijd', level: 'fout', message: `Niet geschikt voor ${age.label}` });
  }
  const exInt = INTENSITY[exercise.intensity];
  if (age && exInt && exInt.rank > INTENSITY[age.maxIntensity].rank) {
    issues.push({ code: 'leeftijdsbelasting', level: 'fout', message: `Te intensief voor ${age.label}` });
  }
  if (params.level && Array.isArray(exercise.levels) && !exercise.levels.includes(params.level)) {
    const lv = LEVEL[params.level];
    const ranks = exercise.levels.map((l) => LEVEL[l]?.rank || 0);
    const tooHard = lv && lv.rank < Math.min(...ranks);
    issues.push({
      code: 'niveau', level: 'waarschuwing',
      message: tooHard ? `Moeilijk voor niveau ${lv.label.toLowerCase()}` : `Eenvoudig voor niveau ${lv ? lv.label.toLowerCase() : params.level}`
    });
  }
  const sesInt = INTENSITY[params.intensity];
  if (sesInt && exInt && exInt.rank > sesInt.rank) {
    issues.push({ code: 'intensiteit', level: 'waarschuwing', message: `Intensiever dan gekozen (${sesInt.label.toLowerCase()})` });
  }
  const missing = (exercise.materials || []).filter((m) => !(params.materials || []).includes(m));
  if (missing.length) {
    issues.push({ code: 'materiaal', level: 'fout', message: `Materiaal ontbreekt: ${missing.map((m) => labelOf(Object.values(MATERIAL), m).toLowerCase()).join(', ')}` });
  }
  const k = exercise.keepers || {};
  if (params.keepers && k.min && params.keepers < k.min) {
    issues.push({ code: 'keepers', level: 'fout', message: `Vraagt minstens ${k.min} keepers` });
  } else if (params.keepers && k.max && params.keepers > k.max) {
    issues.push({ code: 'keepers', level: 'info', message: `Max. ${k.max} keepers tegelijk, laat de anderen wisselen` });
  }
  if (params.trainers && exercise.trainers && exercise.trainers > params.trainers) {
    issues.push({ code: 'trainers', level: 'fout', message: `Vraagt ${exercise.trainers} trainers` });
  }
  if (params.surface === 'indoor' && exercise.divesPerRep > 0) {
    issues.push({ code: 'ondergrond', level: 'info', message: 'Indoor: gebruik matten bij duiken' });
  }
  return issues;
}

export const isUnsuitable = (issues) => issues.some((i) => i.level === 'fout');

/**
 * Stelt per oefening een variant voor: regressie (makkelijker), basis of progressie (moeilijker),
 * met de reden erbij. Jonge leeftijd of laag niveau trekt naar makkelijker, elite naar moeilijker.
 */
export function suggestVariant(exercise, params) {
  if (!exercise || !params) return { variant: 'basis', reason: '' };
  const lv = LEVEL[params.level]?.rank || 2;
  const ranks = (exercise.levels || ['gevorderd']).map((l) => LEVEL[l]?.rank || 2);
  const base = Math.floor(ranks.reduce((a, b) => a + b, 0) / ranks.length);
  let target = lv;
  const age = AGE[params.age];
  const ageRanks = (exercise.ages || []).map((a) => AGE[a]?.rank || 0).filter(Boolean);
  if (age && ageRanks.length) {
    if (age.rank <= Math.min(...ageRanks)) target -= 1;
    if (age.rank > Math.max(...ageRanks)) target += 1;
  }
  if (INTENSITY[params.intensity]?.rank === 1 && INTENSITY[exercise.intensity]?.rank >= 2) target -= 1;
  if (target < base) {
    return { variant: 'makkelijker', reason: age && age.rank <= Math.min(...ageRanks, 99) ? `Jongste groep (${age.label})` : 'Lager niveau of intensiteit' };
  }
  if (target > base) return { variant: 'moeilijker', reason: 'Hoger niveau dan de basisoefening' };
  return { variant: 'basis', reason: '' };
}

/**
 * Standaard dosering van een oefening voor deze parameters (series, herhalingen, rust, duur).
 * Rust schaalt met de werk-rustverhouding: laag ×1,5, gemiddeld ×1, hoog ×0,5. Herhalingen volgen het
 * aantal acties per serie van de intensiteit; de jongste groep krijgt korte series (max. 6 herhalingen).
 */
export function defaultDosage(exercise, params) {
  const intensity = INTENSITY[params?.intensity] || INTENSITY.gemiddeld;
  const age = AGE[params?.age] || AGE_GROUPS[2];
  const sets = clamp(exercise.sets || 1, 1, 10);
  let reps = exercise.reps || 1;
  if (reps > 1) {
    reps = clamp(reps, intensity.actions[0], intensity.actions[1]);
    if (age.rank === 1) reps = Math.min(reps, 6);
  }
  const rest = clamp(Math.round(((exercise.rest ?? 30) * intensity.restFactor / 2) / 5) * 5, 0, 300);
  const duration = clamp(exercise.duration || 8, 2, 45);
  return { sets, reps, rest, duration };
}

/** Alle items van een sessie, in volgorde, met blokinfo. */
export function flattenSession(session) {
  const out = [];
  const blocks = [...(session?.blocks || [])];
  const kernCount = blocks.filter((b) => b.type === 'kern').length;
  let kernNr = 0;
  blocks.forEach((block, bi) => {
    if (block.type === 'kern') kernNr += 1;
    const label = block.type === 'opwarming' ? 'Opwarming' : block.type === 'afsluiting' ? 'Afsluiting'
      : kernCount > 1 ? `Kern ${kernNr}` : 'Kern';
    (block.items || []).forEach((item, ii) => {
      out.push({ item, block, blockIndex: bi, itemIndex: ii, blockLabel: label, posInBlock: ii + 1, blockSize: block.items.length });
    });
  });
  return out;
}

/**
 * Totalen en waarschuwingen voor een hele sessie.
 * getExercise: functie id → oefening.
 */
export function sessionSummary(session, getExercise) {
  const params = session?.parameters || {};
  const flat = flattenSession(session);
  let totalSec = 0; let load = 0; let dives = 0; let unsuitable = 0;
  const warnings = [];
  let prevExplosive = null;
  for (const f of flat) {
    const ex = getExercise(f.item.exerciseId);
    const t = itemTiming(f.item);
    totalSec += t.totalSec;
    if (!ex) continue;
    load += (t.totalSec / 60) * itemRpe(ex, f.item);
    dives += itemDives(ex, f.item);
    if (isUnsuitable(checkExercise(ex, params))) unsuitable += 1;
    const explosive = !!ex.explosive && f.item.variant !== 'makkelijker';
    if (explosive && prevExplosive) {
      warnings.push({ code: 'explosief', level: 'waarschuwing', message: `Twee explosieve oefeningen na elkaar: ${prevExplosive.name} en ${ex.name}. Voorzie herstel.` });
    }
    prevExplosive = explosive ? ex : null;
  }
  const minutes = Math.round(totalSec / 60);
  if (params.time) {
    if (minutes > params.time + 5) warnings.push({ code: 'tijd', level: 'waarschuwing', message: `${minutes - params.time} min langer dan de beschikbare ${params.time} min` });
    else if (flat.length && minutes < params.time - 5) warnings.push({ code: 'tijd', level: 'info', message: `${params.time - minutes} min korter dan de beschikbare ${params.time} min` });
  }
  const age = AGE[params.age];
  if (age && dives > age.maxDives) {
    warnings.push({ code: 'duiken', level: 'waarschuwing', message: `${dives} duiken per keeper, richtwaarde voor ${age.label} is max. ${age.maxDives}` });
  }
  if (unsuitable) warnings.push({ code: 'ongeschikt', level: 'waarschuwing', message: `${unsuitable} oefening${unsuitable > 1 ? 'en passen' : ' past'} niet bij de parameters` });
  const blocksTypes = (session?.blocks || []).map((b) => b.type);
  if (flat.length && !blocksTypes.includes('opwarming')) warnings.push({ code: 'opwarming', level: 'info', message: 'Geen opwarming voorzien' });
  return { totalSec, minutes, load: Math.round(load), dives, unsuitable, warnings, count: flat.length };
}

/** Belastingsniveau in woorden op basis van de gemiddelde RPE. */
export function loadLabel(load, minutes) {
  if (!minutes) return '–';
  const avg = load / minutes;
  if (avg < 4.5) return 'Licht';
  if (avg < 6) return 'Gemiddeld';
  return 'Zwaar';
}
