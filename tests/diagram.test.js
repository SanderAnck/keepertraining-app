// Tests voor de SVG-renderer: geldige SVG, schaal van coördinaten, zonlichtmodus, stappen en legende.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDiagram, renderLegend, maxStep } from '../js/diagram/render.js';

const d = { field: 'doel', elements: [{ t: 'keeper', x: 50, y: 10 }, { t: 'trainer', x: 50, y: 60 }, { t: 'bal', x: 50, y: 55 }],
  lines: [{ t: 'bal', p: [[50, 55], [50, 15]], s: 1 }, { t: 'loop', p: [[50, 10], [45, 20]], s: 2 }, { t: 'dribbel', p: [[10, 50], [30, 50]], s: 3 }] };

test('rendert een SVG met viewBox 100 × 70 en alle elementen', () => {
  const svg = renderDiagram(d, { title: 'Test <&>' });
  assert.match(svg, /^<svg[^>]+viewBox="0 0 100 70"/);
  assert.match(svg, /<\/svg>$/);
  assert.ok(svg.includes('Test &lt;&amp;&gt;'), 'titel ge-escaped');
  assert.ok(svg.includes('cy="7"'), 'y=10 wordt 7 in een veld van 70 hoog');
  assert.ok(svg.includes('stroke-dasharray'), 'baltraject is gestippeld');
});

test('stapfilter verbergt latere lijnen', () => {
  const all = renderDiagram(d);
  const one = renderDiagram(d, { step: 1 });
  assert.ok(one.length < all.length);
  assert.equal(maxStep(d), 3);
});

test('zonlichtmodus gebruikt witte achtergrond', () => {
  assert.ok(renderDiagram(d, { sun: true }).includes('fill="#ffffff"/>'));
});

test('legende toont enkel wat in het diagram zit', () => {
  const l = renderLegend(d);
  assert.ok(l.includes('Keeper'));
  assert.ok(l.includes('Dribbel'));
  assert.ok(!l.includes('Rebounder'));
});

test('lege of ontbrekende diagrammen crashen niet', () => {
  assert.match(renderDiagram(null), /<svg/);
  assert.match(renderDiagram({ field: 'vrij', elements: [], lines: [{ t: 'loop', p: [[1, 1]] }] }), /<svg/);
});
