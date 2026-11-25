// Pure bewerkfuncties voor veldtekeningen (diagrameditor): elementen toevoegen, verplaatsen, draaien en
// verwijderen, pijlen tekenen (met vereenvoudiging van een vingerspoor), stappen hernummeren, hit-tests en
// een geschiedenis voor ongedaan maken / opnieuw. Geen DOM. Coördinaten zijn relatief: 0–100 op beide assen.
import { structuredCopy } from './session.js';

export const ROTATABLE = ['ladder', 'horde', 'minigoal', 'rebounder'];
export const LABELED = ['keeper', 'trainer', 'speler', 'aanvaller', 'pion'];
export const MAX_ELEMENTS = 40;
export const MAX_LINES = 20;

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const r1 = (v) => Math.round(v * 10) / 10;

export function emptyDiagram(field = 'doel') {
  return { field, elements: [], lines: [] };
}

/** Maakt een diagram geldig: velden aanwezig, coördinaten binnen 0–100, lijnen met minstens 2 punten, stappen 1..n. */
export function normalize(diagram) {
  const d = structuredCopy(diagram || emptyDiagram());
  d.field = d.field || 'doel';
  d.elements = (d.elements || []).filter((e) => e && e.t).map((e) => {
    const o = { ...e, x: r1(clamp(+e.x || 0)), y: r1(clamp(+e.y || 0)) };
    if (!o.label) delete o.label;
    if (!o.r) delete o.r;
    return o;
  });
  d.lines = (d.lines || []).filter((l) => l && Array.isArray(l.p) && l.p.length >= 2)
    .map((l) => ({ ...l, p: l.p.map(([x, y]) => [r1(clamp(+x)), r1(clamp(+y))]), s: Math.max(1, Math.round(+l.s || 1)) }));
  return renumberSteps(d);
}

/** Stappen zonder gaten: 1, 3, 3, 7 wordt 1, 2, 2, 3. */
export function renumberSteps(diagram) {
  const d = structuredCopy(diagram);
  const steps = [...new Set(d.lines.map((l) => l.s))].sort((a, b) => a - b);
  const map = new Map(steps.map((s, i) => [s, i + 1]));
  d.lines = d.lines.map((l) => ({ ...l, s: map.get(l.s) }));
  return d;
}

export const nextStep = (diagram) => Math.max(0, ...(diagram.lines || []).map((l) => l.s || 0)) + 1;

export function addElement(diagram, t, x = 50, y = 50, label) {
  const d = structuredCopy(diagram);
  if (d.elements.length >= MAX_ELEMENTS) return d;
  const el = { t, x: r1(clamp(x)), y: r1(clamp(y)) };
  if (label) el.label = label;
  d.elements.push(el);
  return d;
}

/**
 * Verplaatst een element. Met withLines schuiven pijlen die bij het element starten mee (beginpunt binnen
 * 5 eenheden van de oude plaats), zodat een loopbeweging aan de keeper vast blijft hangen.
 */
export function moveElement(diagram, index, x, y, { withLines = false } = {}) {
  const d = structuredCopy(diagram);
  const old = d.elements[index];
  if (!old) return d;
  const nx = r1(clamp(x)), ny = r1(clamp(y));
  d.elements[index] = { ...old, x: nx, y: ny };
  if (withLines) {
    const dx = nx - old.x, dy = ny - old.y;
    for (const l of d.lines) {
      const [sx, sy] = l.p[0];
      if (Math.hypot(sx - old.x, (sy - old.y) * 0.7) <= 5) l.p[0] = [r1(clamp(sx + dx)), r1(clamp(sy + dy))];
    }
  }
  return d;
}

export function removeElement(diagram, index) {
  const d = structuredCopy(diagram);
  d.elements.splice(index, 1);
  return d;
}

/** Draait een draaibaar element 45° verder (0, 45, … 315). */
export function rotateElement(diagram, index, by = 45) {
  const d = structuredCopy(diagram);
  const el = d.elements[index];
  if (!el || !ROTATABLE.includes(el.t)) return d;
  const r = (((+el.r || 0) + by) % 360 + 360) % 360;
  if (r) el.r = r; else delete el.r;
  return d;
}

export function setLabel(diagram, index, label) {
  const d = structuredCopy(diagram);
  const el = d.elements[index];
  if (!el) return d;
  const v = String(label || '').trim().slice(0, 5);
  if (v) el.label = v; else delete el.label;
  return d;
}

/** Afstand van punt p tot segment a–b. */
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 ? clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2, 0, 1) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

export const pathLength = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/**
 * Vereenvoudigt een vingerspoor tot een paar punten (Ramer–Douglas–Peucker) zodat de pijl strak oogt.
 * tol in eenheden; maximaal maxPts punten.
 */
export function simplifyPath(points, tol = 2.5, maxPts = 6) {
  const pts = points.filter((p, i) => i === 0 || Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) > 0.3);
  if (pts.length <= 2) return pts.map(([x, y]) => [r1(x), r1(y)]);
  const rdp = (arr, t) => {
    let max = 0, idx = 0;
    for (let i = 1; i < arr.length - 1; i++) {
      const dd = segDist(arr[i], arr[0], arr[arr.length - 1]);
      if (dd > max) { max = dd; idx = i; }
    }
    if (max <= t) return [arr[0], arr[arr.length - 1]];
    return [...rdp(arr.slice(0, idx + 1), t).slice(0, -1), ...rdp(arr.slice(idx), t)];
  };
  let out = rdp(pts, tol);
  let t = tol;
  while (out.length > maxPts) { t *= 1.5; out = rdp(pts, t); }
  return out.map(([x, y]) => [r1(clamp(x)), r1(clamp(y))]);
}

/** Voegt een pijl toe. Te korte sporen (een tik) worden genegeerd. Geeft { diagram, added }. */
export function addLine(diagram, t, points, step) {
  const d = structuredCopy(diagram);
  const p = simplifyPath(points);
  if (p.length < 2 || pathLength(p) < 4 || d.lines.length >= MAX_LINES) return { diagram: d, added: false };
  d.lines.push({ t, p, s: Math.max(1, Math.min(step || nextStep(d), nextStep(d))) });
  return { diagram: renumberSteps(d), added: true };
}

export function removeLine(diagram, index) {
  const d = structuredCopy(diagram);
  d.lines.splice(index, 1);
  return renumberSteps(d);
}

/** Zet een pijl in een andere stap (1..volgende stap). */
export function setLineStep(diagram, index, step) {
  const d = structuredCopy(diagram);
  if (!d.lines[index]) return d;
  d.lines[index].s = Math.max(1, Math.min(step, nextStep(d)));
  return renumberSteps(d);
}

export function setLineType(diagram, index, t) {
  const d = structuredCopy(diagram);
  if (d.lines[index]) d.lines[index].t = t;
  return d;
}

/**
 * Element onder een punt (bovenste eerst), binnen radius eenheden. yScale corrigeert voor het veld van
 * 100 × 70: een verschil in y telt 0,7 keer zo zwaar. Geeft de index of -1.
 */
export function hitElement(diagram, x, y, radius = 5, yScale = 0.7) {
  let best = -1, bestD = radius;
  diagram.elements.forEach((e, i) => {
    const dd = Math.hypot(e.x - x, (e.y - y) * yScale);
    if (dd <= bestD) { best = i; bestD = dd; }
  });
  return best;
}

/** Pijl onder een punt, binnen tol eenheden. Geeft de index of -1. */
export function hitLine(diagram, x, y, tol = 3, yScale = 0.7) {
  let best = -1, bestD = tol;
  const s = ([px, py]) => [px, py * yScale];
  diagram.lines.forEach((l, i) => {
    for (let k = 1; k < l.p.length; k++) {
      const dd = segDist(s([x, y]), s(l.p[k - 1]), s(l.p[k]));
      if (dd <= bestD) { best = i; bestD = dd; }
    }
  });
  return best;
}

/** Geschiedenis met ongedaan maken en opnieuw. */
export function createHistory(initial, limit = 60) {
  let past = [];
  let future = [];
  let present = structuredCopy(initial);
  return {
    get value() { return present; },
    get canUndo() { return past.length > 0; },
    get canRedo() { return future.length > 0; },
    push(next) {
      if (JSON.stringify(next) === JSON.stringify(present)) return present;
      past.push(present);
      if (past.length > limit) past.shift();
      present = structuredCopy(next);
      future = [];
      return present;
    },
    undo() { if (past.length) { future.push(present); present = past.pop(); } return present; },
    redo() { if (future.length) { past.push(present); present = future.pop(); } return present; },
    get dirty() { return past.length > 0; }
  };
}
