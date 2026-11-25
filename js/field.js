// Veldmodus: één oefening per scherm, swipen, grote timer op tijdstempels, geluid en flits, wake lock, zonlichtmodus en herstel na sluiten.
import state, { getSession, saveSession, getExercise, getFieldState, saveFieldState, clearFieldState } from './state.js';
import { html, raw, sheet, toast, signal, flash, unlockAudio } from './ui.js';
import { flattenSession, sessionSummary, itemTiming } from './logic/load.js';
import { createTimer, advance, toggle, reset, skip, view, formatClock } from './logic/timer.js';
import { updateItem } from './logic/session.js';
import { VARIANT } from './logic/constants.js';
import { renderDiagram } from './diagram/render.js';

let fs = null; let session = null; let flat = []; let root = null;
let tickId = null; let wakeLock = null; let summary = null; let noteTimer = null;
let wakeWarned = false;

export async function render(main, [id]) {
  root = main;
  session = getSession(id);
  if (!session) { location.replace('#/trainingen'); return; }
  flat = flattenSession(session);
  if (!flat.length) {
    main.innerHTML = html`<div class="empty field-empty"><h2>Deze training heeft nog geen oefeningen</h2><a class="btn primary huge" href="#/training/${id}">Oefeningen toevoegen</a></div>`.s;
    return;
  }
  summary = sessionSummary(session, getExercise);
  const saved = await getFieldState().catch(() => null);
  if (saved && saved.sessionId === id) {
    fs = saved;
    fs.index = Math.min(fs.index, flat.length - 1);
    if (fs.itemId !== flat[fs.index].item.id) resetTimerFor(fs.index);
  } else {
    fs = { sessionId: id, index: 0, startedAt: Date.now(), sunlight: !!state.settings.sunlight, timer: null, itemId: null };
    resetTimerFor(0);
  }
  catchUp(false);
  draw();
  persist();
  main.onclick = onClick;
  main.oninput = onInput;
  bindSwipe(main);
  requestWakeLock();
  document.addEventListener('visibilitychange', onVisibility);
  tickId = setInterval(tick, 200);
  return cleanup;
}

function cleanup() {
  clearInterval(tickId); tickId = null;
  document.removeEventListener('visibilitychange', onVisibility);
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
  document.querySelector('.fullscreen-dia')?.remove();
}

function resetTimerFor(index) {
  fs.index = index;
  fs.itemId = flat[index].item.id;
  fs.timer = createTimer(flat[index].item);
}

const persist = () => saveFieldState(fs).catch(() => {});

/** Timer bijwerken; signaal alleen voor gebeurtenissen van de laatste seconden (niet na lang op de achtergrond). */
function catchUp(withSignals = true) {
  const now = Date.now();
  const { timer, events } = advance(fs.timer, now, { auto: state.settings.autoContinue !== false });
  if (!events.length) return false;
  fs.timer = timer;
  const recent = events.filter((e) => now - e.at < 3000);
  if (withSignals && recent.length) {
    const last = recent[recent.length - 1];
    const kind = last.type === 'klaar' ? 'klaar' : last.type === 'einde-werk' ? 'rust' : 'werk';
    if (state.settings.sound) signal(kind, state.settings);
    flash(kind);
  }
  persist();
  return true;
}

function tick() {
  const changed = catchUp(true);
  if (changed) drawTimer(true); else drawTimer(false);
}

function onVisibility() {
  if (document.visibilityState === 'visible') {
    catchUp(false);
    drawTimer(true);
    requestWakeLock();
  } else persist();
}

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) {
    if (!wakeWarned) { wakeWarned = true; toast('Scherm blijft niet vanzelf aan op dit toestel. Zet automatische vergrendeling uit.', { duration: 5000 }); }
    return;
  }
  try {
    if (wakeLock && !wakeLock.released) return;
    wakeLock = await navigator.wakeLock.request('screen');
  } catch {
    if (!wakeWarned) { wakeWarned = true; toast('Scherm aan houden lukte niet. Zet automatische vergrendeling uit.', { duration: 5000 }); }
  }
}

function current() {
  const f = flat[fs.index];
  return { f, ex: getExercise(f.item.exerciseId) };
}

function draw() {
  const { f, ex } = current();
  const sun = fs.sunlight;
  const name = ex ? ex.name : 'Onbekende oefening';
  const t = itemTiming(f.item);
  const variantText = f.item.variant === 'makkelijker' ? ex?.variants?.easier : f.item.variant === 'moeilijker' ? ex?.variants?.harder : '';
  const last = fs.index === flat.length - 1;
  document.title = `${name} · Veldmodus`;
  root.innerHTML = html`<div class="fieldmode${sun ? ' sun' : ''}">
    <header class="f-top">
      <div class="f-row">
        <span class="f-block">${f.blockLabel} · ${f.posInBlock}/${f.blockSize}</span>
        <span class="f-clock" id="fClock" aria-label="Verstreken tijd versus gepland"></span>
      </div>
      <h1 class="f-name">${name}</h1>
      <div class="f-tools">
        <button class="btn f-btn" data-act="sun" aria-pressed="${sun}">${sun ? 'Normaal' : 'Zonlicht'}</button>
        <button class="btn f-btn" data-act="note">Notitie${f.item.note ? ' ✓' : ''}</button>
        <button class="btn f-btn danger" data-act="stop">Stoppen</button>
      </div>
    </header>
    <div class="f-body" id="fSwipe">
      <button class="f-dia" data-act="full" aria-label="Tekening op volledig scherm">${raw(renderDiagram(ex?.diagram, { sun, title: name }))}</button>
      <ul class="f-coach">${(ex?.coaching || []).slice(0, 3).map((c) => html`<li>${c}</li>`)}</ul>
      <p class="f-dose">${t.sets} × ${f.item.reps > 1 ? `${f.item.reps} herh.` : formatClock(t.workSec * 1000)} · rust ${f.item.rest} s</p>
      ${f.item.variant !== 'basis' && variantText ? html`<p class="f-variant"><strong>${VARIANT[f.item.variant].label}:</strong> ${variantText}</p>` : ''}
      <div class="f-note" id="fNote" hidden><label><span class="sr-only">Notitie bij deze oefening</span>
        <textarea name="note" rows="3" placeholder="Snelle notitie (dicteren kan)">${f.item.note || ''}</textarea></label></div>
    </div>
    <div class="f-timerzone">
      <button class="f-timer" data-act="toggle" id="fTimer" aria-live="off">
        <span class="f-phase" id="fPhase"></span><span class="f-time" id="fTime"></span><span class="f-hint" id="fHint"></span>
      </button>
      <div class="f-timer-tools">
        <button class="btn f-btn" data-act="reset">Opnieuw</button>
        <button class="btn f-btn" data-act="skip">Overslaan</button>
      </div>
    </div>
    <nav class="f-nav" aria-label="Oefeningen">
      <button class="btn f-navbtn" data-act="prev" ${fs.index === 0 ? 'disabled' : ''}>◀ Vorige</button>
      <span class="f-count">${fs.index + 1}/${flat.length}</span>
      <button class="btn f-navbtn primary" data-act="${last ? 'finish' : 'next'}">${last ? 'Afronden ✓' : 'Volgende ▶'}</button>
    </nav>
  </div>`.s;
  drawTimer(true);
}

let lastText = '';
function drawTimer(force) {
  if (!root || !fs) return;
  const now = Date.now();
  const v = view(fs.timer, now);
  const time = formatClock(v.remaining);
  const clock = `${formatClock(now - fs.startedAt)} / ${formatClock(summary.totalSec * 1000)}`;
  const key = time + clock + v.running + v.index + v.done;
  if (!force && key === lastText) return;
  lastText = key;
  const el = (id) => root.querySelector('#' + id);
  if (!el('fTime')) return;
  el('fTime').textContent = time;
  el('fClock').textContent = clock;
  el('fPhase').textContent = v.done ? 'KLAAR' : v.phase.kind === 'werk' ? `WERK · serie ${v.phase.set}/${v.phase.sets}` : `RUST · na serie ${v.phase.set}`;
  el('fHint').textContent = v.done ? 'Tik om opnieuw te starten, swipe voor de volgende' : v.running ? 'Tik om te pauzeren' : v.index === 0 && v.remaining === v.phase.ms ? 'Tik om te starten' : 'Gepauzeerd · tik om verder te gaan';
  const timer = el('fTimer');
  timer.className = `f-timer ${v.done ? 'done' : v.phase.kind}${v.running ? ' running' : ''}`;
  timer.setAttribute('aria-label', `${el('fPhase').textContent}, nog ${time}. ${el('fHint').textContent}`);
}

function go(index) {
  if (index < 0 || index >= flat.length || index === fs.index) return;
  resetTimerFor(index);
  persist();
  draw();
  root.querySelector('.f-body')?.scrollTo(0, 0);
}

async function finish(markGiven) {
  cleanup();
  await clearFieldState();
  if (markGiven) {
    session = await saveSession({ ...getSession(session.id), status: 'gegeven', givenAt: Date.now() });
    toast('Training afgerond. Noteer hoe het ging.');
  }
  location.hash = '#/training/' + session.id;
  if (markGiven) setTimeout(() => document.getElementById('notes')?.scrollIntoView(), 300);
}

function onClick(e) {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  unlockAudio();
  const now = Date.now();
  switch (b.dataset.act) {
    case 'toggle': fs.timer = toggle(fs.timer, now); persist(); drawTimer(true); break;
    case 'reset': fs.timer = reset(fs.timer); persist(); drawTimer(true); break;
    case 'skip': fs.timer = skip(fs.timer, now); persist(); drawTimer(true); break;
    case 'prev': go(fs.index - 1); break;
    case 'next': go(fs.index + 1); break;
    case 'finish': finish(true); break;
    case 'sun': fs.sunlight = !fs.sunlight; persist(); draw(); break;
    case 'note': {
      const n = root.querySelector('#fNote');
      n.hidden = !n.hidden;
      if (!n.hidden) n.querySelector('textarea').focus();
      break;
    }
    case 'full': openFull(); break;
    case 'stop': confirmStop(); break;
  }
}

function onInput(e) {
  if (e.target.name !== 'note') return;
  const { f } = current();
  const value = e.target.value;
  f.item.note = value;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(async () => {
    session = await saveSession(updateItem(getSession(session.id), f.item.id, { note: value }));
  }, 500);
}

function openFull() {
  const { ex } = current();
  const d = document.createElement('div');
  d.className = 'fullscreen-dia' + (fs.sunlight ? ' sun' : '');
  d.setAttribute('role', 'dialog');
  d.setAttribute('aria-label', 'Tekening op volledig scherm, tik om te sluiten');
  d.innerHTML = renderDiagram(ex?.diagram, { sun: fs.sunlight, title: ex?.name }) + '<span class="fs-close">Tik om te sluiten</span>';
  d.addEventListener('click', () => d.remove());
  document.body.append(d);
}

function confirmStop() {
  const d = sheet('Training stoppen?', html`<p class="lead">Je kunt de training afronden als gegeven, of stoppen zonder ze te markeren.</p>
    <div class="col gap"><button class="btn huge primary" data-r="given">Afronden als gegeven</button>
    <button class="btn huge danger" data-r="stop">Stoppen zonder markeren</button>
    <button class="btn huge" data-close>Verder trainen</button></div>`);
  d.addEventListener('click', (e) => {
    const r = e.target.closest('[data-r]');
    if (!r) return;
    d.closeSheet();
    finish(r.dataset.r === 'given');
  });
}

function bindSwipe(el) {
  let sx = 0; let sy = 0; let st = 0; let active = false;
  el.onpointerdown = (e) => {
    if (e.target.closest('textarea, .f-timer, .f-tools, .f-nav')) { active = false; return; }
    active = true; sx = e.clientX; sy = e.clientY; st = Date.now();
  };
  el.onpointerup = (e) => {
    if (!active) return;
    active = false;
    const dx = e.clientX - sx; const dy = e.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - st < 800) {
      e.preventDefault();
      swallowClick();
      go(fs.index + (dx < 0 ? 1 : -1));
    }
  };
  el.onpointercancel = () => { active = false; };
}

/** Voorkomt dat het einde van een swipe als tik op de tekening telt. */
function swallowClick() {
  const stop = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
  window.addEventListener('click', stop, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 350);
}
