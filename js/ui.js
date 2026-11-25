// Gedeelde UI-helpers: veilige HTML-templates, toast, onderste sheets, bevestiging, thema-chips, geluid en schermflits.
import { THEME } from './logic/constants.js';

class Safe { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Safe(String(s));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = (v) => (v instanceof Safe ? v.s : Array.isArray(v) ? v.map(val).join('') : v == null || v === false ? '' : esc(v));

/** Tagged template dat ingevoegde waarden escapet; gebruik raw() of html`` voor geneste HTML. */
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += val(v) + strings[i + 1]; });
  return new Safe(out);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function themeIcon(id, size = 18) {
  const t = THEME[id];
  if (!t) return raw('');
  return raw(`<svg class="ticon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t.icon}</svg>`);
}

export function themeChip(id, main = false) {
  const t = THEME[id];
  if (!t) return raw('');
  return html`<span class="chip theme${main ? ' main' : ''}" style="--tc:${t.color}">${themeIcon(id, 14)}${t.short}</span>`;
}

let toastTimer = null;
/** Korte melding onderaan. opts: { action: 'Tekst', onAction: fn, duration: ms } */
export function toast(message, opts = {}) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.append(el); }
  el.innerHTML = '';
  const span = document.createElement(opts.onAction && !opts.action ? 'button' : 'span');
  span.textContent = message;
  el.append(span);
  if (opts.onAction) {
    const target = opts.action ? document.createElement('button') : span;
    if (opts.action) { target.textContent = opts.action; target.className = 'toast-action'; el.append(target); }
    target.addEventListener('click', () => { hideToast(); opts.onAction(); }, { once: true });
  }
  el.className = 'show';
  clearTimeout(toastTimer);
  if (opts.duration !== 0) toastTimer = setTimeout(hideToast, opts.duration || 3200);
}
export function hideToast() { const el = $('#toast'); if (el) el.className = ''; }

/**
 * Onderste sheet (modale dialoog). content: Safe html. Geeft het dialog-element terug.
 * opts.onClose wordt opgeroepen bij sluiten.
 */
export function sheet(title, content, opts = {}) {
  const d = document.createElement('dialog');
  d.className = 'sheet' + (opts.wide ? ' wide' : '');
  d.setAttribute('aria-label', title);
  d.innerHTML = html`<div class="sheet-head"><h2>${title}</h2><button class="btn ghost" data-close>Sluiten</button></div><div class="sheet-body">${content}</div>`.s;
  document.body.append(d);
  const close = () => { if (d.open) d.close(); };
  d.addEventListener('close', () => { d.remove(); opts.onClose && opts.onClose(); });
  d.addEventListener('click', (e) => {
    if (e.target === d) close();
    if (e.target.closest('[data-close]')) close();
  });
  d.showModal();
  d.closeSheet = close;
  return d;
}

/** Bevestiging via sheet. Resolve true/false. */
export function confirmSheet(title, message, okLabel = 'Ja', danger = false) {
  return new Promise((resolve) => {
    let result = false;
    const d = sheet(title, html`<p class="lead">${message}</p><div class="row gap"><button class="btn big ${danger ? 'danger' : 'primary'}" data-ok>${okLabel}</button><button class="btn big" data-close>Annuleren</button></div>`,
      { onClose: () => resolve(result) });
    d.querySelector('[data-ok]').addEventListener('click', () => { result = true; d.closeSheet(); });
  });
}

// ---------- Geluid (Web Audio; ontgrendeld bij de eerste tik, want iOS kent geen trilfunctie) ----------
let ctx = null;
export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const b = ctx.createBuffer(1, 1, 22050); const s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
  } catch { /* geen audio */ }
}

/** Speelt een signaal. kind: 'werk' (einde werk), 'rust' (einde rust), 'klaar'. tone: 'fluit' | 'piep'. */
export function signal(kind, { tone = 'fluit', volume = 0.8 } = {}) {
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime;
  const pattern = kind === 'klaar' ? [0, 0.28, 0.56] : kind === 'rust' ? [0, 0.22] : [0];
  const len = kind === 'klaar' ? 0.22 : 0.45;
  for (const t0 of pattern) {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = tone === 'piep' ? 'square' : 'sine';
    const f = tone === 'piep' ? 1320 : 2900;
    osc.frequency.setValueAtTime(f, now + t0);
    if (tone === 'fluit') {
      const lfo = ctx.createOscillator(); const lg = ctx.createGain();
      lfo.frequency.value = 28; lg.gain.value = 140; lfo.connect(lg); lg.connect(osc.frequency);
      lfo.start(now + t0); lfo.stop(now + t0 + len);
    }
    gain.gain.setValueAtTime(0.0001, now + t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * (tone === 'piep' ? 0.25 : 0.5)), now + t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + t0 + len);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now + t0); osc.stop(now + t0 + len + 0.02);
  }
}

/** Visuele flits over het hele scherm (ook als het geluid uit staat). */
export function flash(kind = 'werk') {
  const el = document.createElement('div');
  el.className = 'flash ' + kind;
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
  setTimeout(() => el.remove(), 900);
}

export function fmtDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
  if (!iso) return 'Geen datum';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('nl-BE', opts);
}

export function fmtMin(sec) {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} u ${String(m % 60).padStart(2, '0')}` : `${m} min`;
}
