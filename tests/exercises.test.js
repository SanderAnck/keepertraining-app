// Kwaliteitscontrole van de seedbibliotheek: minstens 30 volledige oefeningen, alle thema's gedekt, geldige diagrammen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { THEMES, AGE_GROUPS, LEVELS, INTENSITIES, MATERIALS, BLOCK_TYPES, FIELD_TYPES, DIAGRAM_ELEMENTS, LINE_TYPES } from '../js/logic/constants.js';
import { renderDiagram } from '../js/diagram/render.js';

const { exercises } = JSON.parse(readFileSync(new URL('../data/exercises.json', import.meta.url), 'utf8'));
const ids = (l) => new Set(l.map((x) => x.id));
const themeIds = ids(THEMES); const ageIds = ids(AGE_GROUPS); const levelIds = ids(LEVELS); const intIds = ids(INTENSITIES);
const matIds = ids(MATERIALS); const blockIds = ids(BLOCK_TYPES); const fieldIds = ids(FIELD_TYPES);
const elIds = new Set([...ids(DIAGRAM_ELEMENTS), 'doel']); const lineIds = ids(LINE_TYPES);

test('minstens 30 oefeningen met unieke id', () => {
  assert.ok(exercises.length >= 30, `${exercises.length} oefeningen`);
  assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
});

test('elk thema heeft minstens 3 oefeningen', () => {
  for (const t of THEMES) {
    const n = exercises.filter((e) => e.themes.includes(t.id)).length;
    assert.ok(n >= 3, `${t.label}: ${n}`);
  }
});

test('opwarming bevat mobiliteit, balgewenning en lichte valvormen', () => {
  for (const tag of ['mobiliteit', 'balgewenning', 'valvorm']) {
    assert.ok(exercises.some((e) => e.blockTypes.includes('opwarming') && (e.warmup || []).includes(tag)), tag);
  }
});

test('genoeg aanbod voor U6–U9 (spelvormen, niet te intensief)', () => {
  const young = exercises.filter((e) => e.ages.includes('u6_9') && e.intensity !== 'hoog');
  assert.ok(young.length >= 8, `${young.length}`);
});

for (const e of exercises) {
  test(`oefening "${e.name}" is volledig en geldig`, () => {
    for (const f of ['name', 'summary', 'description', 'zone']) assert.ok(e[f] && e[f].length > 3, f);
    assert.ok(e.summary.split(/[.!?](\s|$)/).filter((s) => s && s.trim()).length <= 2, 'max. 2 zinnen');
    assert.ok(e.themes.length && e.themes.every((t) => themeIds.has(t)), 'thema');
    assert.ok(e.ages.length && e.ages.every((t) => ageIds.has(t)), 'leeftijd');
    assert.ok(e.levels.length && e.levels.every((t) => levelIds.has(t)), 'niveau');
    assert.ok(intIds.has(e.intensity), 'intensiteit');
    assert.ok(e.materials.every((t) => matIds.has(t)), 'materiaal');
    assert.ok(e.blockTypes.length && e.blockTypes.every((t) => blockIds.has(t)), 'bloktype');
    assert.ok(e.keepers.min >= 1 && e.keepers.max <= 6 && e.keepers.min <= e.keepers.max, 'keepers');
    assert.ok(e.trainers >= 1 && e.trainers <= 2, 'trainers');
    assert.ok(e.duration > 0 && e.sets > 0 && e.reps > 0 && e.rest >= 0, 'dosering');
    assert.ok(e.coaching.length >= 2 && e.coaching.length <= 4, 'coachingspunten 2–4');
    assert.ok(e.coaching.every((c) => c.length <= 45), 'coachingspunten kort');
    assert.ok(e.mistakes.length >= 1 && e.mistakes.every((m) => m.fault && m.fix), 'fouten met correctie');
    assert.ok(e.variants.easier && e.variants.harder, 'varianten');
    if (e.ages.includes('u6_9')) assert.notEqual(e.intensity, 'hoog', 'U6–U9 niet hoog');
    // diagram
    const d = e.diagram;
    assert.ok(fieldIds.has(d.field), 'veldtype');
    assert.ok(d.elements.some((x) => x.t === 'keeper'), 'keeper aanwezig');
    assert.ok(d.lines.length >= 1, 'minstens één lijn');
    for (const el of d.elements) {
      assert.ok(elIds.has(el.t), 'element ' + el.t);
      assert.ok(el.x >= 0 && el.x <= 100 && el.y >= 0 && el.y <= 100, `coördinaat ${el.t} ${el.x},${el.y}`);
    }
    for (const l of d.lines) {
      assert.ok(lineIds.has(l.t), 'lijn ' + l.t);
      assert.ok(l.p.length >= 2 && l.p.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100), 'lijnpunten');
      assert.ok(Number.isInteger(l.s) && l.s >= 1, 'stapnummer');
    }
    const steps = [...new Set(d.lines.map((l) => l.s))].sort((a, b) => a - b);
    assert.deepEqual(steps, steps.map((_, i) => i + 1), 'stappen 1, 2, 3 zonder gaten');
    for (const m of e.materials) {
      const needs = { pionnen: 'pion', hoepels: 'hoepel', ladders: 'ladder', hordes: 'horde', rebounder: 'rebounder', minigoals: 'minigoal' }[m];
      if (needs) assert.ok(d.elements.some((x) => x.t === needs), `materiaal ${m} staat in het diagram`);
    }
    assert.match(renderDiagram(d), /^<svg/);
  });
}
