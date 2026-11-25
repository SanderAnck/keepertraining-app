// Tests voor trainingen: aanmaken, items toevoegen en herschikken, varianten herberekenen, dupliceren en groeperen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, createItem, addItem, moveItem, removeItem, addKernBlock, removeBlock, duplicateSession, groupSessions, reapplyVariants, placeItem } from '../js/logic/session.js';
import { DEFAULT_PARAMS } from '../js/logic/constants.js';

const ex = { id: 'e1', intensity: 'gemiddeld', levels: ['gevorderd'], ages: ['u13_15', 'u16_19'], duration: 8, sets: 3, reps: 6, rest: 40 };
const get = () => ex;

function withItems() {
  let s = createSession({ params: DEFAULT_PARAMS, date: '2026-01-10' });
  const [w, k, c] = s.blocks;
  s = addItem(s, w.id, { ...createItem(ex, s.parameters), id: 'i1' });
  s = addItem(s, k.id, { ...createItem(ex, s.parameters), id: 'i2' });
  s = addItem(s, k.id, { ...createItem(ex, s.parameters), id: 'i3' });
  s = addItem(s, c.id, { ...createItem(ex, s.parameters), id: 'i4' });
  return s;
}
const order = (s) => s.blocks.map((b) => b.items.map((i) => i.id));

test('nieuwe training heeft opwarming, kern en afsluiting', () => {
  const s = createSession();
  assert.deepEqual(s.blocks.map((b) => b.type), ['opwarming', 'kern', 'afsluiting']);
});

test('omhoog/omlaag binnen en over blokken', () => {
  let s = withItems();
  s = moveItem(s, 'i3', -1);
  assert.deepEqual(order(s), [['i1'], ['i3', 'i2'], ['i4']]);
  s = moveItem(s, 'i3', -1);
  assert.deepEqual(order(s), [['i1', 'i3'], ['i2'], ['i4']]);
  s = moveItem(s, 'i2', 1);
  assert.deepEqual(order(s), [['i1', 'i3'], [], ['i2', 'i4']]);
  const same = moveItem(s, 'i1', -1);
  assert.deepEqual(order(same), order(s), 'eerste item blijft staan');
});

test('slepen naar een positie', () => {
  const s = withItems();
  const moved = placeItem(s, 'i4', s.blocks[1].id, 0);
  assert.deepEqual(order(moved), [['i1'], ['i4', 'i2', 'i3'], []]);
});

test('maximaal 3 kernblokken en laatste kern blijft', () => {
  let s = createSession();
  s = addKernBlock(addKernBlock(addKernBlock(s)));
  assert.equal(s.blocks.filter((b) => b.type === 'kern').length, 3);
  assert.equal(s.blocks.at(-1).type, 'afsluiting');
  let one = createSession();
  one = removeBlock(one, one.blocks[1].id);
  assert.equal(one.blocks.filter((b) => b.type === 'kern').length, 1);
});

test('functies wijzigen het origineel niet', () => {
  const s = withItems();
  const before = JSON.stringify(s);
  removeItem(s, 'i2'); moveItem(s, 'i3', -1); addKernBlock(s);
  assert.equal(JSON.stringify(s), before);
});

test('dupliceren en sjabloon geven nieuwe id\'s', () => {
  const s = withItems();
  const copy = duplicateSession(s, { date: '2026-02-01' });
  assert.notEqual(copy.id, s.id);
  assert.notEqual(copy.blocks[0].items[0].id, 'i1');
  assert.equal(copy.date, '2026-02-01');
  const tpl = duplicateSession({ ...s, status: 'gegeven' }, { asTemplate: true });
  assert.equal(tpl.isTemplate, true);
  assert.equal(tpl.status, 'gepland');
  assert.equal(tpl.date, null);
});

test('varianten herberekend na parameterwijziging, manuele keuze blijft', () => {
  let s = withItems();
  s.blocks[0].items[0].variantManual = true;
  s.blocks[0].items[0].variant = 'moeilijker';
  s = reapplyVariants({ ...s, parameters: { ...s.parameters, level: 'beginner' } }, get);
  assert.equal(s.blocks[0].items[0].variant, 'moeilijker');
  assert.equal(s.blocks[1].items[0].variant, 'makkelijker');
});

test('groeperen: vandaag bovenaan, gepland oplopend, eerder aflopend, sjablonen apart', () => {
  const mk = (id, date, isTemplate = false) => ({ id, date, isTemplate, title: id, createdAt: 1 });
  const g = groupSessions([mk('a', '2026-03-01'), mk('b', '2026-03-05'), mk('c', '2026-03-03'), mk('d', '2026-02-01'), mk('e', '2026-01-01'), mk('t', null, true)], '2026-03-01');
  assert.deepEqual(g.today.map((s) => s.id), ['a']);
  assert.deepEqual(g.upcoming.map((s) => s.id), ['c', 'b']);
  assert.deepEqual(g.past.map((s) => s.id), ['d', 'e']);
  assert.deepEqual(g.templates.map((s) => s.id), ['t']);
});
