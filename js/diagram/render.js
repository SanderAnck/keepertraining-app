// Rendert een oefeningsdiagram (JSON met relatieve coördinaten 0–100) als inline SVG-tekst, plus de legende.
// Puur: geen DOM nodig, zodat het ook in tests werkt. y-coördinaten worden geschaald naar een veld van 100 × 70.

export const VIEW_W = 100;
export const VIEW_H = 70;
const Y = (y) => +(y * VIEW_H / 100).toFixed(2);
const X = (x) => +(+x).toFixed(2);

const PALETTES = {
  normal: {
    bg: '#3b7a45', stripe: '#428650', line: 'rgba(255,255,255,0.9)', lineW: 0.45, net: 'rgba(255,255,255,0.45)',
    keeper: '#d4ff1e', keeperInk: '#111', ink: '#111', trainer: '#16213e', trainerInk: '#fff', speler: '#ffffff',
    spelerStroke: '#1d4ed8', spelerInk: '#1d4ed8', aanvaller: '#e53935', aanvallerInk: '#fff', outline: '#111',
    run: '#d4ff1e', pass: '#ffffff', dribble: '#ffb199', cone: '#ff8a00', hoop: '#ffd400', ladder: '#ffd400',
    hurdle: '#ff5a36', goal: '#ffffff', rebounder: '#cfd8dc', badge: '#111', badgeInk: '#fff', w: 0.9
  },
  sun: {
    bg: '#ffffff', stripe: '#ffffff', line: '#000000', lineW: 0.7, net: 'rgba(0,0,0,0.35)',
    keeper: '#c8f000', keeperInk: '#000', ink: '#000', trainer: '#000000', trainerInk: '#fff', speler: '#ffffff',
    spelerStroke: '#000', spelerInk: '#000', aanvaller: '#d10000', aanvallerInk: '#fff', outline: '#000',
    run: '#000000', pass: '#000000', dribble: '#d10000', cone: '#ff7a00', hoop: '#000000', ladder: '#000000',
    hurdle: '#d10000', goal: '#000000', rebounder: '#555555', badge: '#000', badgeInk: '#fff', w: 1.3
  }
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function goal(x1, x2, y, depth, c) {
  const w = x2 - x1;
  let net = '';
  for (let i = 1; i < 6; i++) net += `<line x1="${X(x1 + (w * i) / 6)}" y1="${y - depth}" x2="${X(x1 + (w * i) / 6)}" y2="${y}" stroke="${c.net}" stroke-width="0.25"/>`;
  net += `<line x1="${x1}" y1="${y - depth / 2}" x2="${x2}" y2="${y - depth / 2}" stroke="${c.net}" stroke-width="0.25"/>`;
  return `${net}<path d="M${x1} ${y}V${y - depth}H${x2}V${y}" fill="none" stroke="${c.goal}" stroke-width="${c.lineW * 2.2}" stroke-linejoin="round"/>`;
}

function stripes(c) {
  if (c.stripe === c.bg) return '';
  let s = '';
  for (let i = 0; i < VIEW_H; i += 10) s += `<rect x="0" y="${i}" width="${VIEW_W}" height="5" fill="${c.stripe}"/>`;
  return s;
}

function fieldMarkup(field, c) {
  const L = (d) => `<path d="${d}" fill="none" stroke="${c.line}" stroke-width="${c.lineW}"/>`;
  switch (field) {
    case 'doel': // 1 eenheid = 0,3 m
      return L('M0 4H100') + L('M19.5 4V22.3H80.5V4') + L('M0 59H100') +
        `<circle cx="50" cy="40.7" r="0.7" fill="${c.line}"/>` + L('M25.6 59A30.5 30.5 0 0 0 74.4 59') +
        goal(37.8, 62.2, 4, 3.4, c);
    case 'zestien': // 1 eenheid = 0,5 m
      return L('M0 4H100') + L('M31.68 4V15H68.32V4') + L('M9.68 4V37H90.32V4') +
        `<circle cx="50" cy="26" r="0.6" fill="${c.line}"/>` + L('M35.37 37A18.3 18.3 0 0 0 64.63 37') +
        goal(42.68, 57.32, 4, 2.4, c);
    case 'halfveld': // 1 eenheid = 0,75 m
      return L('M4.67 2H95.33V69.5H4.67Z') + L('M37.8 2V9.3H62.2V2') + L('M23.1 2V24H76.9V2') +
        `<circle cx="50" cy="16.7" r="0.5" fill="${c.line}"/>` + L('M40.25 24A12.2 12.2 0 0 0 59.75 24') +
        L('M37.8 69.5A12.2 12.2 0 0 1 62.2 69.5') + goal(45.1, 54.9, 2, 1.6, c);
    default:
      return `<rect x="1.5" y="1.5" width="97" height="${VIEW_H - 3}" fill="none" stroke="${c.line}" stroke-width="${c.lineW}" stroke-dasharray="2 1.5" rx="1"/>`;
  }
}

function person(x, y, fill, stroke, ink, label, c, big = false) {
  const r = big ? 3.6 : 3.2;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${c.w * 0.8}"/>` +
    (label ? `<text x="${x}" y="${y + 1.25}" text-anchor="middle" font-size="${label.length > 1 ? 2.8 : 3.6}" font-weight="800" fill="${ink}" font-family="-apple-system,system-ui,sans-serif">${esc(label)}</text>` : '');
}

function element(el, c) {
  const x = X(el.x); const y = Y(el.y);
  const rot = el.r ? ` transform="rotate(${+el.r} ${x} ${y})"` : '';
  const g = (inner) => `<g${rot}>${inner}</g>`;
  switch (el.t) {
    case 'keeper': return person(x, y, c.keeper, c.outline, c.keeperInk, el.label ?? 'K', c, true);
    case 'trainer': return person(x, y, c.trainer, c.trainerInk === '#fff' ? '#fff' : c.outline, c.trainerInk, el.label ?? 'T', c);
    case 'speler': return person(x, y, c.speler, c.spelerStroke, c.spelerInk, el.label ?? 'S', c);
    case 'aanvaller': return person(x, y, c.aanvaller, c.outline, c.aanvallerInk, el.label ?? 'A', c);
    case 'bal': return `<circle cx="${x}" cy="${y}" r="1.5" fill="#fff" stroke="#000" stroke-width="0.45"/><circle cx="${x}" cy="${y}" r="0.55" fill="#000"/>`;
    case 'pion': return `<path d="M${x} ${y - 2}L${x + 1.8} ${y + 1.4}H${x - 1.8}Z" fill="${c.cone}" stroke="${c.outline}" stroke-width="0.35" stroke-linejoin="round"/>` +
      (el.label ? `<text x="${x}" y="${y + 4.4}" text-anchor="middle" font-size="2.6" font-weight="700" fill="${c.line}" font-family="-apple-system,system-ui,sans-serif">${esc(el.label)}</text>` : '');
    case 'hoepel': return `<circle cx="${x}" cy="${y}" r="3.2" fill="none" stroke="${c.hoop}" stroke-width="${c.w}"/>`;
    case 'ladder': {
      let rungs = '';
      for (let i = 1; i < 6; i++) rungs += `<line x1="${x - 8 + i * 16 / 6}" y1="${y - 2}" x2="${x - 8 + i * 16 / 6}" y2="${y + 2}" stroke="${c.ladder}" stroke-width="0.5"/>`;
      return g(`<rect x="${x - 8}" y="${y - 2}" width="16" height="4" fill="none" stroke="${c.ladder}" stroke-width="0.6"/>${rungs}`);
    }
    case 'horde': return g(`<path d="M${x - 3} ${y + 1}V${y - 0.6}H${x + 3}V${y + 1}" fill="none" stroke="${c.hurdle}" stroke-width="${c.w}" stroke-linejoin="round"/>`);
    case 'minigoal': return g(`<path d="M${x - 4} ${y + 1.2}V${y - 1.2}H${x + 4}V${y + 1.2}" fill="none" stroke="${c.goal}" stroke-width="${c.w}"/><path d="M${x - 4} ${y - 1.2}L${x - 3} ${y + 0.6}H${x + 3}L${x + 4} ${y - 1.2}" fill="none" stroke="${c.net}" stroke-width="0.3"/>`);
    case 'doel': return g(goal(x - 6, x + 6, y, 2, c));
    case 'rebounder': return g(`<path d="M${x - 3.5} ${y - 1.5}H${x + 3.5}L${x + 2.5} ${y + 1.5}H${x - 2.5}Z" fill="${c.rebounder}" fill-opacity="0.35" stroke="${c.rebounder}" stroke-width="0.7"/><path d="M${x - 2} ${y - 1.5}L${x - 1.4} ${y + 1.5}M${x} ${y - 1.5}V${y + 1.5}M${x + 2} ${y - 1.5}L${x + 1.4} ${y + 1.5}" stroke="${c.rebounder}" stroke-width="0.3"/>`);
    default: return '';
  }
}

function arrowHead(p1, p2, color, size) {
  const dx = p2[0] - p1[0]; const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len; const uy = dy / len;
  const bx = p2[0] - ux * size; const by = p2[1] - uy * size;
  const px = -uy * size * 0.55; const py = ux * size * 0.55;
  return `<path d="M${X(p2[0])} ${X(p2[1])}L${X(bx + px)} ${X(by + py)}L${X(bx - px)} ${X(by - py)}Z" fill="${color}"/>`;
}

function wavy(pts) {
  let d = `M${X(pts[0][0])} ${X(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1]; const [x2, y2] = pts[i];
    const len = Math.hypot(x2 - x1, y2 - y1); const n = Math.max(2, Math.round(len / 2.2));
    const ux = (x2 - x1) / len; const uy = (y2 - y1) / len;
    for (let k = 1; k <= n * 4; k++) {
      const f = k / (n * 4); const off = Math.sin(f * n * Math.PI * 2) * 0.9 * (k === n * 4 ? 0 : 1);
      d += `L${X(x1 + (x2 - x1) * f - uy * off)} ${X(y1 + (y2 - y1) * f + ux * off)}`;
    }
  }
  return d;
}

/** Inkort de laatste punt zodat de pijlpunt niet in het doelelement verdwijnt. */
function shorten(pts, by) {
  if (pts.length < 2) return pts;
  const out = pts.map((p) => [...p]);
  const a = out[out.length - 2]; const b = out[out.length - 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len > by * 2) { b[0] -= (b[0] - a[0]) / len * by; b[1] -= (b[1] - a[1]) / len * by; }
  return out;
}

function line(ln, c) {
  const raw = (ln.p || []).map(([x, y]) => [+x, Y(y)]);
  if (raw.length < 2) return '';
  const pts = shorten(raw, 1.2);
  const color = ln.t === 'loop' ? c.run : ln.t === 'dribbel' ? c.dribble : c.pass;
  const width = ln.t === 'loop' ? c.w * 1.05 : c.w * 0.75;
  const d = ln.t === 'dribbel' ? wavy(pts) : 'M' + pts.map(([x, y]) => `${X(x)} ${X(y)}`).join('L');
  const dash = ln.t === 'bal' ? ` stroke-dasharray="${(width * 2.2).toFixed(2)} ${(width * 1.6).toFixed(2)}"` : '';
  const under = c.bg === '#ffffff' ? '' : `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="${width + 0.6}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
  let out = under + `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
  out += arrowHead(pts[pts.length - 2], pts[pts.length - 1], color, ln.t === 'loop' ? 2.6 : 2.2);
  if (ln.s) {
    const a = raw[0]; const b = raw[1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const f = Math.min(0.5, 6 / len);
    const mx = a[0] + (b[0] - a[0]) * f; const my = a[1] + (b[1] - a[1]) * f;
    const nx = -(b[1] - a[1]) / len * 2.6; const ny = (b[0] - a[0]) / len * 2.6;
    const bx = Math.min(97.5, Math.max(2.5, mx + nx)); const by = Math.min(VIEW_H - 2.5, Math.max(2.5, my + ny));
    out += `<circle cx="${X(bx)}" cy="${X(by)}" r="2" fill="${c.badge}" stroke="${color}" stroke-width="0.35"/><text x="${X(bx)}" y="${X(by + 0.95)}" text-anchor="middle" font-size="2.7" font-weight="800" fill="${c.badgeInk}" font-family="-apple-system,system-ui,sans-serif">${+ln.s}</text>`;
  }
  return out;
}

/**
 * SVG-tekst voor een diagram. opts: { sun: bool (zonlichtmodus), title: string, step: getal (toon enkel lijnen t.e.m. deze stap) }.
 */
export function renderDiagram(diagram, opts = {}) {
  const c = opts.sun ? PALETTES.sun : PALETTES.normal;
  const d = diagram || { field: 'vrij', elements: [], lines: [] };
  const lines = (d.lines || []).filter((l) => opts.step == null || !l.s || l.s <= opts.step);
  const sorted = [...(d.elements || [])].sort((a, b) => order(a.t) - order(b.t));
  return `<svg class="diagram" viewBox="0 0 ${VIEW_W} ${VIEW_H}" role="img" aria-label="${esc(opts.title || 'Veldtekening')}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">` +
    `<title>${esc(opts.title || 'Veldtekening')}</title>` +
    `<rect width="${VIEW_W}" height="${VIEW_H}" fill="${c.bg}"/>${stripes(c)}${fieldMarkup(d.field, c)}` +
    sorted.filter((e) => order(e.t) < 5).map((e) => element(e, c)).join('') +
    lines.map((l) => line(l, c)).join('') +
    sorted.filter((e) => order(e.t) >= 5).map((e) => element(e, c)).join('') +
    '</svg>';
}

function order(t) {
  return { ladder: 0, hoepel: 1, horde: 2, minigoal: 2, doel: 2, rebounder: 2, pion: 3, bal: 6, speler: 7, aanvaller: 7, trainer: 8, keeper: 9 }[t] ?? 4;
}

/** Hoogste stapnummer in een diagram. */
export const maxStep = (diagram) => Math.max(0, ...((diagram?.lines || []).map((l) => +l.s || 0)));

/** Legende als HTML-tekst met mini-SVG's per symbool. Toont enkel wat in het diagram voorkomt als diagram meegegeven wordt. */
export function renderLegend(diagram, opts = {}) {
  const c = opts.sun ? PALETTES.sun : PALETTES.normal;
  const present = diagram ? new Set([...(diagram.elements || []).map((e) => e.t), ...(diagram.lines || []).map((l) => 'line-' + l.t)]) : null;
  const items = [
    ['keeper', 'Keeper'], ['trainer', 'Trainer / schutter'], ['speler', 'Medespeler'], ['aanvaller', 'Aanvaller'], ['bal', 'Bal'],
    ['pion', 'Pion'], ['hoepel', 'Hoepel'], ['ladder', 'Ladder'], ['horde', 'Horde'], ['minigoal', 'Mini-goal'], ['rebounder', 'Rebounder'],
    ['line-loop', 'Loopbeweging keeper'], ['line-bal', 'Baltraject (pass of schot)'], ['line-dribbel', 'Dribbel']
  ].filter(([k]) => !present || present.has(k));
  const sw = (k) => symbolSvg(k, opts);
  return `<ul class="legend">${items.map(([k, l]) => `<li>${sw(k)}<span>${l}</span></li>`).join('')}</ul>`;
}

/** Klein symbool (element of lijntype 'line-loop' enz.) als SVG-tekst, voor legende en editorpalet. */
export function symbolSvg(k, opts = {}) {
  const c = opts.sun ? PALETTES.sun : PALETTES.normal;
  let inner;
  if (k.startsWith('line-')) inner = line({ t: k.slice(5), p: [[2, 50], [22, 50]] }, { ...c, bg: c.bg });
  else inner = element({ t: k, x: 12, y: 50, label: k === 'keeper' ? 'K' : undefined }, c);
  return `<svg viewBox="0 0 24 70" width="36" height="22" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="20" width="24" height="30" fill="${c.bg}" rx="3"/><g transform="translate(0 0)">${inner}</g></svg>`;
}
