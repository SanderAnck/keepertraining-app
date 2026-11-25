// Tests voor de timer op tijdstempels: fases, pauzeren, inhalen na de achtergrond en weergave.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPhases, createTimer, start, pause, advance, view, skip, reset, toggle, formatClock } from '../js/logic/timer.js';

const item = { duration: 3, sets: 3, rest: 30 }; // 3 min: 3 × 40 s werk + 2 × 30 s rust

test('fases: werk en rust, geen rust na de laatste serie', () => {
  const p = buildPhases(item);
  assert.deepEqual(p.map((x) => x.kind), ['werk', 'rust', 'werk', 'rust', 'werk']);
  assert.equal(p[0].ms, 40000);
  assert.equal(p[1].ms, 30000);
});

test('resterende tijd klopt op basis van tijdstempels', () => {
  let t = start(createTimer(item), 1000);
  assert.equal(view(t, 11000).remaining, 30000);
  t = pause(t, 11000);
  assert.equal(view(t, 999999).remaining, 30000, 'gepauzeerd blijft staan');
  t = start(t, 20000);
  assert.equal(view(t, 25000).remaining, 25000);
});

test('inhalen na lange tijd op de achtergrond springt over afgelopen fases', () => {
  const t = start(createTimer(item), 0);
  const { timer, events } = advance(t, 75000); // 40 werk + 30 rust voorbij, 5 s in serie 2
  assert.equal(timer.index, 2);
  assert.equal(view(timer, 75000).remaining, 35000);
  assert.deepEqual(events.map((e) => e.type), ['einde-werk', 'einde-rust']);
  assert.equal(events[0].at, 40000);
});

test('na het einde is de timer klaar en loopt niet meer', () => {
  const t = start(createTimer(item), 0);
  const { timer, events } = advance(t, 10 * 60000);
  assert.equal(timer.done, true);
  assert.equal(timer.running, false);
  assert.equal(events.at(-1).type, 'klaar');
  assert.equal(view(timer, 10 * 60000).remaining, 0);
});

test('zonder automatisch doorlopen pauzeert de timer bij een nieuwe fase', () => {
  const t = start(createTimer(item), 0);
  const { timer } = advance(t, 100000, { auto: false });
  assert.equal(timer.index, 1);
  assert.equal(timer.running, false);
  assert.equal(view(timer, 200000).remaining, 30000);
});

test('overslaan, resetten en toggle', () => {
  let t = start(createTimer(item), 0);
  t = skip(t, 5000);
  assert.equal(t.index, 1);
  assert.equal(view(t, 6000).remaining, 29000);
  t = reset(t);
  assert.equal(t.index, 0);
  assert.equal(t.running, false);
  t = toggle(t, 0);
  assert.equal(t.running, true);
  t = toggle(t, 1000);
  assert.equal(t.running, false);
});

test('status is JSON-veilig (bewaren in IndexedDB)', () => {
  const t = start(createTimer(item), 123);
  assert.deepEqual(JSON.parse(JSON.stringify(t)), t);
});

test('formatClock rondt naar boven af', () => {
  assert.equal(formatClock(0), '0:00');
  assert.equal(formatClock(59001), '1:00');
  assert.equal(formatClock(61000), '1:01');
  assert.equal(formatClock(600000), '10:00');
});
