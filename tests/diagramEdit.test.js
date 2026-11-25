// Tests voor de bewerkfuncties van de diagrameditor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyDiagram, normalize, renumberSteps, nextStep, addElement, moveElement, removeElement, rotateElement, setLabel,
  simplifyPath, addLine, removeLine, setLineStep, setLineType, hitElement, hitLine, createHistory, pathLength
} from '../js/logic/diagramEdit.js';
import { renderDiagram } from '../js/diagram/render.js';

test('element toevoegen, verplaatsen binnen 0–100 en verwijderen', () => {
  let d = addElement(emptyDiagram(), 'keeper', 50, 12);
  d = addElement(d, 'pion', 120, -5);
  assert.deepEqual(d.elements[1], { t: 'pion', x: 100, y: 0 });
  d = moveElement(d, 0, 33.333, 44.444);
  assert.deepEqual([d.elements[0].x, d.elements[0].y], [33.3, 44.4]);
  d = removeElement(d, 1);
  assert.equal(d.elements.length, 1);
});

test('origineel blijft ongewijzigd (pure functies)', () => {
  const d = emptyDiagram();
  addElement(d, 'bal', 1, 1);
  assert.equal(d.elements.length, 0);
});

test('draaien kan enkel bij ladder, horde, mini-goal en rebounder', () => {
  let d = addElement(addElement(emptyDiagram(), 'ladder'), 'keeper');
  d = rotateElement(d, 0); d = rotateElement(d, 0);
  assert.equal(d.elements[0].r, 90);
  for (let i = 0; i < 6; i++) d = rotateElement(d, 0);
  assert.equal(d.elements[0].r, undefined, '360° = geen rotatie');
  assert.equal(rotateElement(d, 1).elements[1].r, undefined);
});

test('label wordt ingekort en leeg verwijdert het', () => {
  let d = setLabel(addElement(emptyDiagram(), 'speler'), 0, '  Verdediger ');
  assert.equal(d.elements[0].label, 'Verde');
  d = setLabel(d, 0, '');
  assert.equal('label' in d.elements[0], false);
});

test('vingerspoor wordt vereenvoudigd tot een strakke lijn', () => {
  const pts = Array.from({ length: 50 }, (_, i) => [10 + i, 20 + (i % 2 ? 0.4 : -0.4)]);
  const s = simplifyPath(pts);
  assert.equal(s.length, 2);
  const bend = [...Array.from({ length: 20 }, (_, i) => [10 + i * 2, 20]), ...Array.from({ length: 20 }, (_, i) => [50, 20 + i * 2])];
  assert.equal(simplifyPath(bend).length, 3, 'een bocht blijft');
  const zigzag = Array.from({ length: 60 }, (_, i) => [i, i % 2 ? 0 : 30]);
  assert.ok(simplifyPath(zigzag).length <= 6);
});

test('pijl tekenen: te korte tik wordt genegeerd, stappen lopen op', () => {
  let d = emptyDiagram();
  let r = addLine(d, 'bal', [[50, 50], [50.5, 50.5]]);
  assert.equal(r.added, false);
  r = addLine(d, 'bal', [[50, 50], [50, 20]]);
  assert.ok(r.added);
  d = r.diagram;
  assert.equal(d.lines[0].s, 1);
  d = addLine(d, 'loop', [[50, 10], [60, 10]]).diagram;
  assert.equal(d.lines[1].s, 2);
  d = addLine(d, 'dribbel', [[20, 10], [20, 40]], 2).diagram;
  assert.equal(d.lines[2].s, 2, 'zelfde stap kan');
  d = addLine(d, 'bal', [[20, 10], [20, 40]], 9).diagram;
  assert.equal(d.lines[3].s, 3, 'stap niet hoger dan de volgende');
  assert.equal(nextStep(d), 4);
});

test('pijl verwijderen hernummert de stappen zonder gaten', () => {
  let d = emptyDiagram();
  for (let i = 0; i < 3; i++) d = addLine(d, 'bal', [[10 * i, 10], [10 * i, 40]]).diagram;
  d = removeLine(d, 1);
  assert.deepEqual(d.lines.map((l) => l.s), [1, 2]);
  d = setLineStep(d, 1, 1);
  assert.deepEqual(d.lines.map((l) => l.s), [1, 1]);
  d = setLineType(d, 0, 'dribbel');
  assert.equal(d.lines[0].t, 'dribbel');
  assert.deepEqual(renumberSteps({ elements: [], lines: [{ s: 2, p: [] }, { s: 5, p: [] }] }).lines.map((l) => l.s), [1, 2]);
});

test('hit-tests vinden het dichtste element en de pijl', () => {
  let d = addElement(addElement(emptyDiagram(), 'keeper', 50, 12), 'bal', 54, 12);
  assert.equal(hitElement(d, 53, 12), 1);
  assert.equal(hitElement(d, 49, 13), 0);
  assert.equal(hitElement(d, 80, 80), -1);
  d = addLine(d, 'bal', [[10, 50], [90, 50]]).diagram;
  assert.equal(hitLine(d, 40, 52), 0);
  assert.equal(hitLine(d, 40, 70), -1);
});

test('ongedaan maken en opnieuw', () => {
  const h = createHistory(emptyDiagram());
  h.push(addElement(h.value, 'keeper'));
  h.push(addElement(h.value, 'bal'));
  assert.equal(h.value.elements.length, 2);
  h.undo(); assert.equal(h.value.elements.length, 1);
  h.undo(); assert.equal(h.value.elements.length, 0);
  assert.equal(h.canUndo, false);
  h.redo(); assert.equal(h.value.elements.length, 1);
  h.push(addElement(h.value, 'pion'));
  assert.equal(h.canRedo, false, 'nieuwe actie wist de redo-stapel');
  const before = h.value;
  h.push(h.value);
  assert.equal(h.value, before, 'geen lege stap in de geschiedenis');
});

test('normalize maakt een geldig diagram dat rendert', () => {
  const d = normalize({ elements: [{ t: 'keeper', x: '20', y: 150, label: '' }, { x: 1 }], lines: [{ t: 'bal', p: [[1, 1]] }, { t: 'loop', p: [[0, 0], [10, 10]], s: 4 }] });
  assert.equal(d.field, 'doel');
  assert.deepEqual(d.elements, [{ t: 'keeper', x: 20, y: 100 }]);
  assert.equal(d.lines.length, 1);
  assert.equal(d.lines[0].s, 1);
  assert.match(renderDiagram(d), /^<svg/);
  assert.ok(pathLength(d.lines[0].p) > 14);
});

test('pijlen die bij een element starten, schuiven mee bij verplaatsen', () => {
  let d = addElement(emptyDiagram(), 'keeper', 50, 12);
  d = addLine(d, 'loop', [[50, 13], [60, 13]]).diagram;
  d = addLine(d, 'bal', [[20, 50], [50, 14]]).diagram;
  d = moveElement(d, 0, 40, 30, { withLines: true });
  assert.deepEqual(d.lines[0].p[0], [40, 31]);
  assert.deepEqual(d.lines[1].p[0], [20, 50], 'pijl die elders start blijft');
  assert.deepEqual(moveElement(d, 0, 10, 10).lines[0].p[0], [40, 31], 'zonder optie blijven pijlen staan');
});
