// Tests voor de trainingsgenerator: regels over duur, opwarming, leeftijd, duiken, explosiviteit, vastzetten en wisselen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateSession, swapItem, seededRandom, timeBudget, fitDurations } from '../js/logic/generator.js';
import { sessionSummary, checkExercise, isUnsuitable, flattenSession } from '../js/logic/load.js';
import { AGE_GROUPS, LEVELS, INTENSITIES, THEMES, DEFAULT_PARAMS, AGE } from '../js/logic/constants.js';

const { exercises } = JSON.parse(readFileSync(new URL('../data/exercises.json', import.meta.url), 'utf8'));
const byId = new Map(exercises.map((e) => [e.id, e]));
const get = (id) => byId.get(id);
const ALL_MAT = ['ballen', 'pionnen', 'hoepels', 'ladders', 'hordes', 'rebounder', 'minigoals'];

const combos = [];
for (const age of AGE_GROUPS) for (const level of LEVELS) for (const intensity of INTENSITIES) for (const time of [30, 60, 90, 120]) {
  const theme = THEMES[(combos.length * 7) % THEMES.length].id;
  combos.push({ ...DEFAULT_PARAMS, age: age.id, level: level.id, intensity: intensity.id, time, mainTheme: theme, themes: [theme], keepers: 2, materials: combos.length % 2 ? ALL_MAT : DEFAULT_PARAMS.materials });
}

test(`regels gelden voor ${combos.length} combinaties van parameters`, () => {
  combos.forEach((p, n) => {
    const s = generateSession(p, exercises, { rng: seededRandom(n + 1) });
    const sum = sessionSummary(s, get);
    const label = `${p.age} ${p.level} ${p.intensity} ${p.time} min`;
    assert.ok(Math.abs(sum.minutes - p.time) <= 5, `${label}: ${sum.minutes} min`);
    for (const f of flattenSession(s)) assert.ok(!isUnsuitable(checkExercise(get(f.item.exerciseId), p)), `${label}: ongeschikt ${f.item.exerciseId}`);
    assert.ok(sum.dives <= AGE[p.age].maxDives, `${label}: ${sum.dives} duiken`);
    assert.ok(!sum.warnings.some((w) => w.code === 'explosief'), `${label}: explosief na elkaar`);
    const warm = s.blocks.find((b) => b.type === 'opwarming').items.map((i) => get(i.exerciseId));
    for (const tag of ['mobiliteit', 'balgewenning', 'valvorm']) assert.ok(warm.some((e) => (e.warmup || []).includes(tag)), `${label}: opwarming mist ${tag}`);
    const ids = flattenSession(s).map((f) => f.item.exerciseId);
    assert.equal(new Set(ids).size, ids.length, `${label}: dubbele oefening`);
    assert.ok(s.blocks.filter((b) => b.type === 'kern').every((b) => b.items.length), `${label}: leeg kernblok`);
  });
});

test('kern van eenvoudig naar complex', () => {
  const s = generateSession({ ...DEFAULT_PARAMS, time: 90, age: 'senioren', level: 'elite', materials: ALL_MAT }, exercises, { rng: seededRandom(3) });
  for (const b of s.blocks.filter((x) => x.type === 'kern')) {
    const c = b.items.map((i) => get(i.exerciseId).complexity);
    const explosiveSwap = b.items.some((i) => get(i.exerciseId).explosive);
    if (!explosiveSwap) assert.deepEqual(c, [...c].sort((a, b) => a - b));
  }
});

test('hoofdthema komt terug in de kern', () => {
  for (const t of THEMES) {
    const p = { ...DEFAULT_PARAMS, mainTheme: t.id, themes: [t.id], age: 'u16_19', level: 'gevorderd', materials: ALL_MAT, keepers: 3 };
    const s = generateSession(p, exercises, { rng: seededRandom(9) });
    const kern = s.blocks.find((b) => b.type === 'kern').items.map((i) => get(i.exerciseId));
    assert.ok(kern.some((e) => e.themes.includes(t.id)), t.id);
  }
});

test('vastgezette oefeningen blijven bij een nieuw voorstel, de rest wisselt', () => {
  const p = { ...DEFAULT_PARAMS, time: 75, materials: ALL_MAT };
  const s1 = generateSession(p, exercises, { rng: seededRandom(1) });
  const kern = s1.blocks.find((b) => b.type === 'kern');
  kern.items[0].locked = true; kern.items[0].duration = 11;
  const lockedId = kern.items[0].id;
  const s2 = generateSession(p, exercises, { rng: seededRandom(2), keep: s1 });
  const all = flattenSession(s2).map((f) => f.item);
  const kept = all.find((i) => i.id === lockedId);
  assert.ok(kept && kept.locked && kept.duration === 11);
  assert.equal(s2.id, s1.id, 'zelfde training');
  assert.ok(Math.abs(sessionSummary(s2, get).minutes - 75) <= 5);
});

test('andere oefening wisselt één item binnen hetzelfde blok en behoudt de duur', () => {
  const p = { ...DEFAULT_PARAMS, materials: ALL_MAT };
  const s = generateSession(p, exercises, { rng: seededRandom(5) });
  const item = s.blocks.find((b) => b.type === 'kern').items[0];
  const { session, swapped } = swapItem(s, item.id, exercises, seededRandom(6));
  assert.ok(swapped);
  const now = session.blocks.find((b) => b.type === 'kern').items[0];
  assert.equal(now.id, item.id);
  assert.notEqual(now.exerciseId, item.exerciseId);
  assert.equal(now.duration, item.duration);
  assert.ok((get(now.exerciseId).blockTypes).includes('kern'));
});

test('tijdsverdeling en duur passend maken', () => {
  const b = timeBudget(60);
  assert.equal(b.warm + b.cool + b.kern.reduce((a, x) => a + x, 0), 60);
  assert.equal(timeBudget(30).kern.length, 1);
  assert.equal(timeBudget(120).kern.length, 3);
  const items = [{ duration: 8, sets: 2, rest: 30 }, { duration: 8, sets: 2, rest: 30 }, { duration: 6, sets: 1, rest: 0, locked: true }];
  fitDurations(items, 30);
  assert.equal(items.reduce((a, i) => a + i.duration, 0), 30);
  assert.equal(items[2].duration, 6);
});

test('wisselen in de opwarming behoudt de valvorm', () => {
  const p = { ...DEFAULT_PARAMS, age: 'u10_12', materials: ALL_MAT };
  for (let n = 1; n < 15; n++) {
    const s = generateSession(p, exercises, { rng: seededRandom(n) });
    const warm = s.blocks.find((b) => b.type === 'opwarming');
    const fall = warm.items.find((i) => (get(i.exerciseId).warmup || []).includes('valvorm'));
    const { session } = swapItem(s, fall.id, exercises, seededRandom(n + 100));
    const now = session.blocks.find((b) => b.type === 'opwarming').items.find((i) => i.id === fall.id);
    if (now.exerciseId !== fall.exerciseId) assert.ok((get(now.exerciseId).warmup || []).includes('valvorm'));
  }
});
