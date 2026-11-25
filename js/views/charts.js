// Grafieken van de keeperskaart als inline SVG: spinnenweb (profiel per thema) en groeicurve (score door de tijd).
// Kleuren via CSS-variabelen, zodat licht en donker thema vanzelf kloppen.
import { esc, fmtDate } from '../ui.js';
import { THEMES } from '../logic/constants.js';

const MAX = 5;

/** Spinnenweb. now/prev: { thema: { value } }. Enkel beoordeelde thema's krijgen een punt. */
export function radarChart(now, prev = {}) {
  const axes = THEMES;
  const R = 96;
  const n = axes.length;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, v) => [Math.cos(ang(i)) * (R * v) / MAX, Math.sin(ang(i)) * (R * v) / MAX];
  const f = (x) => x.toFixed(1);
  const rings = [1, 2, 3, 4, 5].map((v) => `<polygon class="r-grid" points="${axes.map((_, i) => pt(i, v).map(f).join(',')).join(' ')}"/>`).join('');
  const spokes = axes.map((_, i) => { const [x, y] = pt(i, MAX); return `<line class="r-grid" x1="0" y1="0" x2="${f(x)}" y2="${f(y)}"/>`; }).join('');
  const poly = (scores, cls) => {
    const pts = axes.map((a, i) => (scores[a.id] ? pt(i, scores[a.id].value) : null)).filter(Boolean);
    return pts.length >= 3 ? `<polygon class="${cls}" points="${pts.map((p) => p.map(f).join(',')).join(' ')}"/>` : '';
  };
  const dots = axes.map((a, i) => {
    if (!now[a.id]) return '';
    const [x, y] = pt(i, now[a.id].value);
    return `<circle class="r-dot" cx="${f(x)}" cy="${f(y)}" r="4.5"><title>${esc(a.short)}: ${now[a.id].value}/5</title></circle>`;
  }).join('');
  const labels = axes.map((a, i) => {
    const [x, y] = pt(i, MAX + 0.9);
    const anchor = Math.abs(x) < 8 ? 'middle' : x > 0 ? 'start' : 'end';
    const v = now[a.id]?.value;
    return `<text class="r-label${v ? '' : ' off'}" x="${f(x)}" y="${f(y + 4)}" text-anchor="${anchor}">${esc(a.short)}${v ? ' ' + v : ''}</text>`;
  }).join('');
  return `<svg class="chart radar" viewBox="-185 -128 370 252" role="img" aria-label="Profiel per thema, schaal 1 tot 5">
    ${rings}${spokes}${poly(prev, 'r-prev')}${poly(now, 'r-now')}${dots}${labels}</svg>`;
}

/** Groeicurve van één reeks [{ date, value }] op een vaste schaal 1–5. */
export function lineChart(series, { label = 'Score' } = {}) {
  const W = 340, H = 170, L = 26, Rr = 12, T = 12, B = 30;
  const iw = W - L - Rr, ih = H - T - B;
  const n = series.length;
  const x = (i) => L + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = (v) => T + ih - ((v - 1) / (MAX - 1)) * ih;
  const grid = [1, 2, 3, 4, 5].map((v) => `<line class="l-grid" x1="${L}" x2="${W - Rr}" y1="${y(v)}" y2="${y(v)}"/><text class="l-axis" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join('');
  const path = series.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const pts = series.map((p, i) => `<g class="l-pt" data-tip="${esc(fmtDate(p.date, { day: 'numeric', month: 'short', year: 'numeric' }))}: ${esc(label.toLowerCase())} ${String(p.value).replace('.', ',')}">
      <circle class="l-hit" cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="16"/>
      <circle class="l-dot" cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4.5"/></g>`).join('');
  const last = series[n - 1];
  const lastLabel = last ? `<text class="l-val" x="${Math.min(x(n - 1), W - Rr - 4).toFixed(1)}" y="${(y(last.value) - 10).toFixed(1)}" text-anchor="${n === 1 ? 'middle' : 'end'}">${String(last.value).replace('.', ',')}</text>` : '';
  const dl = (i, anchor) => `<text class="l-axis" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="${anchor}">${esc(fmtDate(series[i].date, { day: 'numeric', month: 'short' }))}</text>`;
  const dates = n === 1 ? dl(0, 'middle') : dl(0, 'start') + dl(n - 1, 'end');
  return `<svg class="chart line" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} door de tijd, schaal 1 tot 5">
    ${grid}<path class="l-line" d="${path}"/>${pts}${lastLabel}${dates}</svg>`;
}
