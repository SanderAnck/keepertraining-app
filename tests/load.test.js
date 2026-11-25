// Tests voor de belastingsregels: timing, geschiktheid, variantvoorstel, dosering en sessietotalen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { itemTiming, checkExercise, isUnsuitable, suggestVariant, defaultDosage, sessionSummary, itemDives, flattenSession } from '../js/logic/load.js';
import { DEFAULT_PARAMS } from '../js/logic/constants.js';

const base = {
  id: 'x', name: 'Test', intensity: 'gemiddeld', ages: ['u10_12', 'u13_15', 'u16_19', 'senioren'], levels: ['gevorderd', 'elite'],
  materials: ['ballen'], keepers: { min: 1, max: 3 }, trainers: 1, duration: 8, sets: 3, reps: 6, rest: 60, divesPerRep: 1
};
const P = (o = {}) => ({ ...DEFAULT_PARAMS, ...o });

test('itemTiming verdeelt de duur over werk en rust', () => {
  assert.deepEqual(itemTiming({ duration: 8, sets: 3, rest: 60 }), { sets: 3, workSec: 120, restSec: 60, totalSec: 480 });
  assert.equal(itemTiming({ duration: 1, sets: 10, rest: 60 }).workSec, 10, 'minstens 10 s werk');
});

test('te intensief en niet voor de leeftijd wordt gemarkeerd (bv. U8)', () => {
  const issues = checkExercise({ ...base, intensity: 'hoog' }, P({ age: 'u6_9' }));
  const codes = issues.map((i) => i.code);
  assert.ok(codes.includes('leeftijd'));
  assert.ok(codes.includes('leeftijdsbelasting'));
  assert.ok(isUnsuitable(issues));
});

test('ontbrekend materiaal en te weinig keepers of trainers', () => {
  const issues = checkExercise({ ...base, materials: ['ballen', 'rebounder'], keepers: { min: 2, max: 4 }, trainers: 2 }, P({ keepers: 1, trainers: 1, age: 'u13_15' }));
  const codes = issues.map((i) => i.code);
  assert.ok(codes.includes('materiaal'));
  assert.ok(codes.includes('keepers'));
  assert.ok(codes.includes('trainers'));
});

test('passende oefening heeft geen fouten', () => {
  assert.equal(isUnsuitable(checkExercise(base, P({ age: 'u13_15', level: 'gevorderd', intensity: 'hoog' }))), false);
});

test('intensiever dan gekozen intensiteit is een waarschuwing', () => {
  const i = checkExercise({ ...base, intensity: 'hoog' }, P({ intensity: 'laag', age: 'u16_19' }));
  assert.ok(i.some((x) => x.code === 'intensiteit' && x.level === 'waarschuwing'));
});

test('variantvoorstel volgt niveau en leeftijd', () => {
  assert.equal(suggestVariant(base, P({ level: 'beginner', age: 'u13_15' })).variant, 'makkelijker');
  assert.equal(suggestVariant(base, P({ level: 'elite', age: 'senioren' })).variant, 'moeilijker');
  assert.equal(suggestVariant({ ...base, levels: ['beginner', 'gevorderd', 'elite'] }, P({ level: 'gevorderd', age: 'u13_15' })).variant, 'basis');
  assert.equal(suggestVariant({ ...base, levels: ['beginner', 'gevorderd', 'elite'] }, P({ level: 'gevorderd', age: 'u10_12' })).variant, 'makkelijker', 'jongste geschikte groep');
});

test('dosering: rust volgt de werk-rustverhouding en jongste groep krijgt korte series', () => {
  const low = defaultDosage(base, P({ intensity: 'laag' }));
  const high = defaultDosage(base, P({ intensity: 'hoog' }));
  assert.ok(low.rest > high.rest);
  assert.ok(defaultDosage({ ...base, reps: 10 }, P({ age: 'u6_9', intensity: 'hoog' })).reps <= 6);
});

test('makkelijker variant halveert de duiken', () => {
  assert.equal(itemDives(base, { sets: 3, reps: 6, variant: 'basis' }), 18);
  assert.equal(itemDives(base, { sets: 3, reps: 6, variant: 'makkelijker' }), 9);
});

const lib = {
  a: { ...base, id: 'a', name: 'A', explosive: true },
  b: { ...base, id: 'b', name: 'B', explosive: true },
  c: { ...base, id: 'c', name: 'C', explosive: false }
};
const it = (exerciseId, o = {}) => ({ id: exerciseId + Math.random(), exerciseId, variant: 'basis', duration: 10, sets: 2, reps: 6, rest: 30, ...o });

test('sessietotalen: duur, waarschuwing bij tijd, duiken en explosief na elkaar', () => {
  const s = { parameters: P({ time: 30, age: 'u10_12' }), blocks: [
    { type: 'opwarming', items: [it('c')] },
    { type: 'kern', items: [it('a'), it('b')] },
    { type: 'afsluiting', items: [it('c')] }
  ] };
  const sum = sessionSummary(s, (id) => lib[id]);
  assert.equal(sum.minutes, 40);
  assert.equal(sum.count, 4);
  assert.equal(sum.dives, 48);
  const codes = sum.warnings.map((w) => w.code);
  assert.ok(codes.includes('tijd'));
  assert.ok(codes.includes('explosief'));
  assert.ok(codes.includes('duiken'), 'U10–U12 max 30 duiken');
});

test('geen waarschuwing als de duur binnen ±5 min valt', () => {
  const s = { parameters: P({ time: 40, age: 'senioren' }), blocks: [{ type: 'opwarming', items: [it('c')] }, { type: 'kern', items: [it('a'), it('c'), it('b')] }] };
  const codes = sessionSummary(s, (id) => lib[id]).warnings.map((w) => w.code);
  assert.ok(!codes.includes('tijd'));
  assert.ok(!codes.includes('explosief'), 'herstel ertussen');
});

test('flattenSession nummert kernblokken', () => {
  const s = { blocks: [{ type: 'opwarming', items: [it('c')] }, { type: 'kern', items: [it('a')] }, { type: 'kern', items: [it('b'), it('c')] }] };
  const f = flattenSession(s);
  assert.deepEqual(f.map((x) => x.blockLabel), ['Opwarming', 'Kern 1', 'Kern 2', 'Kern 2']);
  assert.equal(f[3].posInBlock, 2);
  assert.equal(f[3].blockSize, 2);
});
