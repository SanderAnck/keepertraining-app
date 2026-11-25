// Timer op basis van tijdstempels (pure functies): fases werk/rust per oefening, starten, pauzeren en inhalen na de achtergrond.
// De status is gewone JSON, zodat hij in IndexedDB bewaard kan worden en na heropenen correct verder loopt.
import { itemTiming } from './load.js';

/** Fases voor één item: werk, rust, werk, ... (geen rust na de laatste serie). */
export function buildPhases(item) {
  const t = itemTiming(item);
  const phases = [];
  for (let s = 1; s <= t.sets; s++) {
    phases.push({ kind: 'werk', set: s, sets: t.sets, ms: t.workSec * 1000 });
    if (s < t.sets && t.restSec > 0) phases.push({ kind: 'rust', set: s, sets: t.sets, ms: t.restSec * 1000 });
  }
  return phases;
}

export function createTimer(item) {
  return { phases: buildPhases(item), index: 0, running: false, startedAt: null, banked: 0, done: false };
}

/** Verstreken tijd in de huidige fase (ms). */
export function phaseElapsed(timer, now) {
  return timer.banked + (timer.running && timer.startedAt != null ? now - timer.startedAt : 0);
}

/**
 * Haalt de timer bij tot 'now': fases die intussen afgelopen zijn worden overgeslagen.
 * Met auto=false pauzeert de timer aan het begin van de volgende fase.
 * Geeft { timer, events } terug; events = [{ type: 'einde-werk'|'einde-rust'|'klaar', at }].
 */
export function advance(timer, now, { auto = true } = {}) {
  let t = { ...timer };
  const events = [];
  while (t.running && !t.done) {
    const phase = t.phases[t.index];
    if (!phase) { t = { ...t, running: false, done: true }; break; }
    const left = phase.ms - t.banked;
    const end = t.startedAt + left;
    if (now < end) break;
    const last = t.index >= t.phases.length - 1;
    events.push({ type: last ? 'klaar' : phase.kind === 'werk' ? 'einde-werk' : 'einde-rust', at: end });
    if (last) t = { ...t, running: false, done: true, banked: phase.ms, startedAt: null };
    else if (auto) t = { ...t, index: t.index + 1, banked: 0, startedAt: end };
    else { t = { ...t, index: t.index + 1, banked: 0, startedAt: null, running: false }; break; }
  }
  return { timer: t, events };
}

export function start(timer, now) {
  if (timer.running || timer.done) return timer;
  return { ...timer, running: true, startedAt: now };
}

export function pause(timer, now) {
  if (!timer.running) return timer;
  return { ...timer, running: false, banked: phaseElapsed(timer, now), startedAt: null };
}

export function toggle(timer, now) {
  if (timer.done) return start(reset(timer), now);
  return timer.running ? pause(timer, now) : start(timer, now);
}

export function reset(timer) {
  return { ...timer, index: 0, running: false, startedAt: null, banked: 0, done: false };
}

/** Sla de huidige fase over (blijft lopen als hij liep). */
export function skip(timer, now) {
  if (timer.done) return timer;
  if (timer.index >= timer.phases.length - 1) {
    const phase = timer.phases[timer.index];
    return { ...timer, running: false, done: true, banked: phase ? phase.ms : 0, startedAt: null };
  }
  return { ...timer, index: timer.index + 1, banked: 0, startedAt: timer.running ? now : null };
}

/** Wat het scherm moet tonen. */
export function view(timer, now) {
  const phase = timer.phases[timer.index] || { kind: 'werk', set: 1, sets: 1, ms: 0 };
  const remaining = timer.done ? 0 : Math.max(0, phase.ms - phaseElapsed(timer, now));
  return { phase, remaining, running: timer.running, done: timer.done, index: timer.index, count: timer.phases.length };
}

/** mm:ss, naar boven afgerond zodat 0:00 pas verschijnt op het einde. */
export function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
