// Tests voor de bibliotheek: seed en eigen oefeningen samenvoegen (aanpassingen winnen) en filteren.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeExercises, filterExercises, duplicateExercise } from '../js/logic/library.js';

const seed = [
  { id: 's1', name: 'Hoge bal', themes: ['hogeballen'], ages: ['u13_15'], levels: ['gevorderd'], intensity: 'gemiddeld', materials: ['ballen'], summary: '', coaching: ['Knie omhoog'] },
  { id: 's2', name: 'Ladder', themes: ['voetenwerk'], ages: ['u6_9'], levels: ['beginner'], intensity: 'laag', materials: ['ballen', 'ladders'], summary: '', coaching: [] }
];

test('aanpassing van een seedoefening wint en blijft bij een nieuwe seedversie', () => {
  const own = [{ ...seed[0], name: 'Mijn hoge bal' }];
  const newSeed = [{ ...seed[0], name: 'Hoge bal v2' }, seed[1]];
  const merged = mergeExercises(newSeed, own);
  const s1 = merged.find((e) => e.id === 's1');
  assert.equal(s1.name, 'Mijn hoge bal');
  assert.equal(s1.origin, 'aangepast');
  assert.equal(merged.find((e) => e.id === 's2').origin, 'seed');
});

test('eigen oefening wordt toegevoegd', () => {
  const merged = mergeExercises(seed, [{ id: 'eigen-1', name: 'Aaa eigen', themes: [] }]);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].origin, 'eigen');
});

test('filteren op thema, leeftijd, materiaal, favorieten en zoekterm (zonder accenten)', () => {
  const all = mergeExercises(seed, []);
  assert.deepEqual(filterExercises(all, { theme: 'voetenwerk' }).map((e) => e.id), ['s2']);
  assert.deepEqual(filterExercises(all, { age: 'u13_15' }).map((e) => e.id), ['s1']);
  assert.deepEqual(filterExercises(all, { materials: ['ballen'] }).map((e) => e.id), ['s1']);
  assert.deepEqual(filterExercises(all, { favorites: true }, ['s2']).map((e) => e.id), ['s2']);
  assert.deepEqual(filterExercises(all, { q: 'knié' }).map((e) => e.id), ['s1']);
});

test('dupliceren geeft een eigen id', () => {
  const c = duplicateExercise(seed[0]);
  assert.ok(c.id.startsWith('eigen-'));
  assert.notEqual(c.name, seed[0].name);
});
