// Tests voor de keeperskaart: beoordelingen, groei, zwakste punten en oefeningvoorstellen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createKeeper, cleanScores, saveRating, removeRating, latestScores, previousScores, themeSeries, overallSeries,
  weakest, trend, paramsForKeeper, exercisesForTheme, progressText, average
} from '../js/logic/keepers.js';
import { checkExercise, isUnsuitable } from '../js/logic/load.js';

const exercises = JSON.parse(readFileSync(new URL('../data/exercises.json', import.meta.url))).exercises;

function sample() {
  let k = createKeeper({ name: ' Lotte ', age: 'senioren', level: 'gevorderd' });
  k = saveRating(k, { date: '2026-09-01', scores: { vangen: 3, duiken: 2, hogeballen: 4 } });
  k = saveRating(k, { date: '2026-10-01', scores: { vangen: 4, duiken: 2, voetenwerk: 3 } });
  k = saveRating(k, { date: '2026-11-01', scores: { duiken: 3, hogeballen: 2 }, note: 'Kruisballen moeilijk' });
  return k;
}

test('nieuwe keeper krijgt een getrimde naam en lege beoordelingen', () => {
  const k = createKeeper({ name: '  Tom ' });
  assert.equal(k.name, 'Tom');
  assert.deepEqual(k.ratings, []);
  assert.ok(k.id);
});

test('scores worden opgeschoond tot gehele getallen 1–5 voor bestaande thema\'s', () => {
  assert.deepEqual(cleanScores({ vangen: '4', duiken: 0, reflexen: 6, foo: 3, opbouw: '', distributie: 2.4 }), { vangen: 4, distributie: 2 });
});

test('lege beoordeling wordt niet bewaard', () => {
  const k = saveRating(createKeeper({ name: 'A' }), { scores: { vangen: '' } });
  assert.equal(k.ratings.length, 0);
});

test('beoordelingen staan op datum, ook als ze in andere volgorde ingevoerd worden', () => {
  let k = createKeeper({ name: 'A' });
  k = saveRating(k, { date: '2026-11-01', scores: { vangen: 4 } });
  k = saveRating(k, { date: '2026-09-01', scores: { vangen: 2 } });
  assert.deepEqual(k.ratings.map((r) => r.date), ['2026-09-01', '2026-11-01']);
  assert.equal(latestScores(k).vangen.value, 4);
});

test('bewerken vervangt de bestaande beoordeling met hetzelfde id', () => {
  let k = sample();
  const r = k.ratings[2];
  k = saveRating(k, { id: r.id, date: r.date, scores: { duiken: 5 } });
  assert.equal(k.ratings.length, 3);
  assert.equal(latestScores(k).duiken.value, 5);
  assert.equal(latestScores(k).hogeballen.value, 4, 'oude score van hoge ballen telt weer');
  k = removeRating(k, r.id);
  assert.equal(k.ratings.length, 2);
});

test('recentste en vorige scores per thema', () => {
  const k = sample();
  const now = latestScores(k);
  assert.deepEqual(Object.fromEntries(Object.entries(now).map(([t, v]) => [t, v.value])), { vangen: 4, duiken: 3, hogeballen: 2, voetenwerk: 3 });
  const prev = previousScores(k);
  assert.equal(prev.duiken.value, 2);
  assert.equal(prev.hogeballen.value, 4);
  assert.equal(trend(k, 'hogeballen'), -2);
  assert.equal(trend(k, 'vangen'), 1);
});

test('groeicurves per thema en gemiddeld', () => {
  const k = sample();
  assert.deepEqual(themeSeries(k, 'duiken').map((p) => p.value), [2, 2, 3]);
  const o = overallSeries(k);
  assert.equal(o.length, 3);
  assert.equal(o[0].value, 3);           // (3+2+4)/3
  assert.equal(o[1].value, 3.3);         // vangen 4, duiken 2, hoge 4, voetenwerk 3
  assert.equal(o[2].value, 3);           // vangen 4, duiken 3, hoge 2, voetenwerk 3
  assert.equal(average(latestScores(k)), 3);
});

test('zwakste punten: laagste score, bij gelijke stand het dalende thema eerst', () => {
  const k = sample();
  const w = weakest(k, 3);
  assert.equal(w[0].theme, 'hogeballen');
  assert.equal(w[0].value, 2);
  assert.equal(weakest(createKeeper({ name: 'x' })).length, 0);
  let k2 = createKeeper({ name: 'B' });
  k2 = saveRating(k2, { date: '2026-01-01', scores: { vangen: 4, reflexen: 2 } });
  k2 = saveRating(k2, { date: '2026-02-01', scores: { vangen: 2, reflexen: 2 } });
  assert.equal(weakest(k2, 1)[0].theme, 'vangen', 'gedaald thema gaat voor bij gelijke score');
});

test('vooruitgangszin noemt stijgers en dalers', () => {
  const t = progressText(sample());
  assert.match(t, /vooruit in duiken/);
  assert.match(t, /achteruit in hoge ballen/);
});

test('trainingsparameters rond de werkpunten nemen leeftijd en niveau van de keeper over', () => {
  const p = paramsForKeeper(sample(), { time: 75, age: 'u13_15', level: 'beginner', materials: ['ballen'] });
  assert.equal(p.mainTheme, 'hogeballen');
  assert.ok(p.themes.includes('hogeballen') && p.themes.length === 2);
  assert.equal(p.age, 'senioren');
  assert.equal(p.level, 'gevorderd');
  assert.equal(p.time, 75);
});

test('oefeningvoorstellen trainen het thema en passen bij de leeftijd', () => {
  const k = sample();
  for (const theme of ['vangen', 'duiken', 'hogeballen', 'opbouw', 'communicatie']) {
    const list = exercisesForTheme(exercises, k, theme, 5);
    assert.ok(list.length >= 3, `te weinig voorstellen voor ${theme}`);
    for (const e of list) {
      assert.ok(e.themes.includes(theme));
      assert.ok(!isUnsuitable(checkExercise(e, { age: k.age, level: k.level, intensity: 'hoog', keepers: 2, trainers: 2, materials: e.materials })));
    }
    assert.equal(list[0].themes[0], theme, 'hoofdthema komt eerst');
  }
  const young = { ...k, age: 'u6_9', level: 'beginner' };
  for (const e of exercisesForTheme(exercises, young, 'duiken', 10)) assert.ok(e.ages.includes('u6_9'));
});
