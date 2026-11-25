// Diagrameditor: veldtekening maken met de vinger. Elementen plaatsen en verslepen, pijlen tekenen
// (loopbeweging, baltraject, dribbel) met stapnummers, verwijderen, draaien, labels en ongedaan maken.
// Bewaart als data (JSON, coördinaten 0–100), nooit als afbeelding. Logica in js/logic/diagramEdit.js.
import { html, raw, sheet, confirmSheet } from '../ui.js';
import { DIAGRAM_ELEMENTS, FIELD_TYPES, LINE_TYPES } from '../logic/constants.js';
import { renderDiagram, symbolSvg, VIEW_H } from './render.js';
import {
  normalize, createHistory, addElement, moveElement, removeElement, rotateElement, setLabel, addLine, removeLine,
  setLineStep, setLineType, hitElement, hitLine, nextStep, ROTATABLE, LABELED
} from '../logic/diagramEdit.js';

const MODES = [
  { id: 'move', label: 'Plaatsen' },
  { id: 'draw', label: 'Pijl' },
  { id: 'erase', label: 'Wissen' }
];
const LINE_SHORT = { loop: 'Loop keeper', bal: 'Bal', dribbel: 'Dribbel' };
const DEFAULT_LABEL = { keeper: 'K', trainer: 'T', speler: 'S', aanvaller: 'A' };
const yv = (y) => (y * VIEW_H) / 100;

/**
 * Opent de editor. opts: { title, onSave(diagram) }. Annuleren met wijzigingen vraagt eerst bevestiging.
 */
export function openDiagramEditor(diagram, opts = {}) {
  const hist = createHistory(normalize(diagram));
  const st = { mode: 'move', lineType: 'loop', step: null, armed: null, sel: null, drag: null, draft: null, work: null };
  let saved = false;

  const d = sheet(opts.title ? `Tekening: ${opts.title}` : 'Tekening', html`<div class="dia-editor">
    <div class="ed-bar">
      <div class="seg ed-modes" role="radiogroup" aria-label="Werkwijze">${MODES.map((m) => html`<label class="seg-opt"><input type="radio" name="mode" value="${m.id}" ${m.id === 'move' ? 'checked' : ''}><span>${m.label}</span></label>`)}</div>
      <div class="ed-hist"><button type="button" class="btn" data-ed="undo" aria-label="Ongedaan maken">↶</button><button type="button" class="btn" data-ed="redo" aria-label="Opnieuw">↷</button></div>
    </div>
    <div class="ed-canvas dia-wrap" id="edCanvas" aria-label="Tekenveld"></div>
    <div class="ed-tools" id="edTools"></div>
    <p class="hint ed-hint" id="edHint" aria-live="polite"></p>
    <div class="ed-sel" id="edSel"></div>
    <fieldset><legend>Veld</legend><div class="seg">${FIELD_TYPES.map((f) => html`<label class="seg-opt"><input type="radio" name="field" value="${f.id}" ${hist.value.field === f.id ? 'checked' : ''}><span>${f.label}</span></label>`)}</div></fieldset>
    <button type="button" class="btn primary huge" data-ed="save">Tekening bewaren</button>
  </div>`, {
    wide: true,
    onClose: () => {}
  });
  d.classList.add('editor-sheet');
  const $ = (s) => d.querySelector(s);
  const canvas = $('#edCanvas');

  // Sluiten met niet-bewaarde wijzigingen: eerst bevestigen.
  const closeBtn = d.querySelector('[data-close]');
  closeBtn.removeAttribute('data-close');
  const tryClose = async () => {
    if (!saved && hist.dirty && !(await confirmSheet('Tekening sluiten', 'Je wijzigingen aan de tekening gaan verloren.', 'Niet bewaren', true))) return;
    d.closeSheet();
  };
  closeBtn.addEventListener('click', tryClose);
  d.addEventListener('cancel', (e) => { e.preventDefault(); tryClose(); });

  const cur = () => st.work || hist.value;

  // ---------- Tekenen ----------
  function overlay(dg) {
    let o = '';
    if (st.sel?.kind === 'el' && dg.elements[st.sel.i]) {
      const e = dg.elements[st.sel.i];
      o += `<circle cx="${e.x}" cy="${yv(e.y)}" r="5.2" fill="none" stroke="#fff" stroke-width="0.7" stroke-dasharray="1.6 1.2"/>`;
    }
    if (st.sel?.kind === 'line' && dg.lines[st.sel.i]) {
      const pts = dg.lines[st.sel.i].p.map(([x, y]) => `${x},${yv(y)}`).join(' ');
      o += `<polyline points="${pts}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (st.draft && st.draft.length > 1) {
      o += `<polyline points="${st.draft.map(([x, y]) => `${x},${yv(y)}`).join(' ')}" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="1.5 1" stroke-linecap="round"/>`;
    }
    return o;
  }
  let raf = 0;
  function drawCanvas() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const dg = cur();
      canvas.innerHTML = renderDiagram(dg, { title: 'Tekenveld' }).replace('</svg>', overlay(dg) + '</svg>');
    });
  }

  function tools() {
    if (st.mode === 'move') {
      return html`<div class="chips scroll ed-palette" role="group" aria-label="Element toevoegen">${DIAGRAM_ELEMENTS.map((el) => html`<button type="button" class="chip toggle ed-pal ${st.armed === el.id ? 'on' : ''}" data-ed="arm" data-v="${el.id}">${raw(symbolSvg(el.id))}<span>${el.label.split(' /')[0]}</span></button>`)}</div>`;
    }
    if (st.mode === 'draw') {
      const ns = nextStep(hist.value);
      const step = st.step ?? ns;
      return html`<div class="ed-draw">
        <div class="seg" role="radiogroup" aria-label="Soort pijl">${LINE_TYPES.map((l) => html`<label class="seg-opt"><input type="radio" name="lineType" value="${l.id}" ${st.lineType === l.id ? 'checked' : ''}><span>${LINE_SHORT[l.id]}</span></label>`)}</div>
        <div class="stepper ed-step"><button type="button" class="btn" data-ed="stepDown" aria-label="Vorige stap">−</button><output>Stap ${step}${step === ns ? ' (nieuw)' : ''}</output><button type="button" class="btn" data-ed="stepUp" aria-label="Volgende stap">+</button></div>
      </div>`;
    }
    return '';
  }
  function hint() {
    if (st.mode === 'move') return st.armed ? 'Tik op het veld om het element te plaatsen.' : 'Kies een element hierboven, of sleep een element op het veld. Tik op iets om het te selecteren.';
    if (st.mode === 'draw') return 'Trek met je vinger een pijl van start naar einde. Een bocht mag; de lijn wordt vanzelf strak getrokken.';
    return 'Tik op een element of pijl om het te verwijderen. Ongedaan maken kan altijd met ↶.';
  }
  function selPanel() {
    const dg = hist.value;
    if (st.sel?.kind === 'el') {
      const e = dg.elements[st.sel.i];
      if (!e) return '';
      const name = DIAGRAM_ELEMENTS.find((x) => x.id === e.t)?.label || e.t;
      return html`<div class="card ed-card"><div class="row between"><strong>${name}</strong>
        <button type="button" class="btn danger" data-ed="delSel">Verwijder</button></div>
        <div class="row gap ed-sel-row">
          ${LABELED.includes(e.t) ? html`<label class="field ed-label"><span class="label">Label</span><input name="elLabel" maxlength="5" value="${e.label || ''}" placeholder="${DEFAULT_LABEL[e.t] || ''}" autocomplete="off" enterkeyhint="done"></label>` : ''}
          ${ROTATABLE.includes(e.t) ? html`<button type="button" class="btn big" data-ed="rotate">Draai 45°</button>` : ''}
          <button type="button" class="btn big" data-ed="dupSel">Dupliceer</button>
        </div></div>`;
    }
    if (st.sel?.kind === 'line') {
      const l = dg.lines[st.sel.i];
      if (!l) return '';
      return html`<div class="card ed-card"><div class="row between"><strong>Pijl · stap ${l.s}</strong>
        <button type="button" class="btn danger" data-ed="delSel">Verwijder</button></div>
        <div class="seg">${LINE_TYPES.map((t) => html`<label class="seg-opt"><input type="radio" name="selLineType" value="${t.id}" ${l.t === t.id ? 'checked' : ''}><span>${LINE_SHORT[t.id]}</span></label>`)}</div>
        <div class="stepper ed-step"><button type="button" class="btn" data-ed="lineStepDown" aria-label="Eerdere stap">−</button><output>Stap ${l.s}</output><button type="button" class="btn" data-ed="lineStepUp" aria-label="Latere stap">+</button></div></div>`;
    }
    return '';
  }

  function refresh({ panels = true } = {}) {
    drawCanvas();
    $('[data-ed="undo"]').disabled = !hist.canUndo;
    $('[data-ed="redo"]').disabled = !hist.canRedo;
    if (panels) {
      $('#edTools').innerHTML = String(tools());
      $('#edSel').innerHTML = String(selPanel());
      $('#edHint').textContent = hint();
    }
  }
  const commit = (next, sel = st.sel) => { hist.push(next); st.sel = sel; st.work = null; refresh(); };

  // ---------- Aanwijzer (vinger, muis, pen) ----------
  const toPt = (ev) => {
    const r = canvas.querySelector('svg').getBoundingClientRect();
    return [((ev.clientX - r.left) / r.width) * 100, ((ev.clientY - r.top) / r.height) * 100];
  };
  canvas.addEventListener('pointerdown', (ev) => {
    if (!canvas.querySelector('svg')) return;
    ev.preventDefault();
    const [x, y] = toPt(ev);
    const dg = hist.value;
    canvas.setPointerCapture(ev.pointerId);
    if (st.mode === 'move') {
      if (st.armed) {
        const t = st.armed;
        st.armed = null;
        const next = addElement(dg, t, x, y);
        commit(next, { kind: 'el', i: next.elements.length - 1 });
        return;
      }
      const i = hitElement(dg, x, y);
      if (i >= 0) {
        st.drag = { i, dx: dg.elements[i].x - x, dy: dg.elements[i].y - y, moved: false, id: ev.pointerId };
        const changed = st.sel?.kind !== 'el' || st.sel.i !== i;
        st.sel = { kind: 'el', i };
        refresh({ panels: changed });
        return;
      }
      const li = hitLine(dg, x, y);
      st.sel = li >= 0 ? { kind: 'line', i: li } : null;
      refresh();
    } else if (st.mode === 'draw') {
      st.draft = [[x, y]];
      st.sel = null;
      drawCanvas();
    } else {
      const i = hitElement(dg, x, y);
      if (i >= 0) { commit(removeElement(dg, i), null); return; }
      const li = hitLine(dg, x, y);
      if (li >= 0) commit(removeLine(dg, li), null);
    }
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (st.drag && ev.pointerId === st.drag.id) {
      const [x, y] = toPt(ev);
      st.drag.moved = true;
      st.work = moveElement(hist.value, st.drag.i, x + st.drag.dx, y + st.drag.dy, { withLines: true });
      drawCanvas();
    } else if (st.draft) {
      const [x, y] = toPt(ev);
      const last = st.draft[st.draft.length - 1];
      if (Math.hypot(x - last[0], y - last[1]) > 0.8) { st.draft.push([x, y]); drawCanvas(); }
    }
  });
  const end = () => {
    if (st.drag) {
      const { moved } = st.drag;
      st.drag = null;
      if (moved && st.work) commit(st.work); else { st.work = null; refresh({ panels: false }); }
    } else if (st.draft) {
      const pts = st.draft;
      st.draft = null;
      const r = addLine(hist.value, st.lineType, pts, st.step ?? nextStep(hist.value));
      if (r.added) { st.step = null; commit(r.diagram, null); } else drawCanvas();
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  // ---------- Knoppen en velden ----------
  d.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'mode') { st.mode = t.value; st.armed = null; st.sel = null; st.step = null; refresh(); }
    if (t.name === 'lineType') st.lineType = t.value;
    if (t.name === 'field') commit({ ...hist.value, field: t.value });
    if (t.name === 'selLineType' && st.sel?.kind === 'line') commit(setLineType(hist.value, st.sel.i, t.value));
    if (t.name === 'elLabel' && st.sel?.kind === 'el') commit(setLabel(hist.value, st.sel.i, t.value));
  });
  d.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ed]');
    if (!b) return;
    const dg = hist.value;
    const sel = st.sel;
    switch (b.dataset.ed) {
      case 'undo': hist.undo(); st.sel = null; refresh(); break;
      case 'redo': hist.redo(); st.sel = null; refresh(); break;
      case 'arm': st.armed = st.armed === b.dataset.v ? null : b.dataset.v; st.sel = null; refresh(); break;
      case 'stepDown': st.step = Math.max(1, (st.step ?? nextStep(dg)) - 1); refresh(); break;
      case 'stepUp': st.step = Math.min(nextStep(dg), (st.step ?? nextStep(dg)) + 1); refresh(); break;
      case 'delSel':
        if (sel?.kind === 'el') commit(removeElement(dg, sel.i), null);
        if (sel?.kind === 'line') commit(removeLine(dg, sel.i), null);
        break;
      case 'rotate': if (sel?.kind === 'el') commit(rotateElement(dg, sel.i)); break;
      case 'dupSel': if (sel?.kind === 'el') {
        const e0 = dg.elements[sel.i];
        const next = addElement(dg, e0.t, e0.x + 6, e0.y + 6, e0.label);
        if (e0.r) next.elements[next.elements.length - 1].r = e0.r;
        commit(next, { kind: 'el', i: next.elements.length - 1 });
      } break;
      case 'lineStepDown': if (sel?.kind === 'line') commit(setLineStep(dg, sel.i, dg.lines[sel.i].s - 1)); break;
      case 'lineStepUp': if (sel?.kind === 'line') commit(setLineStep(dg, sel.i, dg.lines[sel.i].s + 1)); break;
      case 'save':
        saved = true;
        opts.onSave && opts.onSave(normalize(hist.value));
        d.closeSheet();
        break;
    }
  });
  d.addEventListener('keydown', (e) => {
    if (e.target.name === 'elLabel' && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });

  refresh();
  return d;
}

