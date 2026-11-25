// Pure functies voor trainingen: aanmaken, blokken en items beheren, dupliceren, sjablonen en sorteren.
import { DEFAULT_PARAMS } from './constants.js';
import { defaultDosage, suggestVariant } from './load.js';

export const uid = () => (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID()
  : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));

/** Datum als 'YYYY-MM-DD' in lokale tijd. */
export function isoDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function createSession({ params = DEFAULT_PARAMS, date = isoDate(), title = '' } = {}) {
  const now = Date.now();
  return {
    id: uid(),
    title: title || 'Nieuwe training',
    date,
    parameters: structuredCopy(params),
    blocks: [
      { id: uid(), type: 'opwarming', items: [] },
      { id: uid(), type: 'kern', items: [] },
      { id: uid(), type: 'afsluiting', items: [] }
    ],
    status: 'gepland',
    isTemplate: false,
    notes: { good: '', better: '', perKeeper: '' },
    createdAt: now,
    updatedAt: now
  };
}

export function structuredCopy(v) {
  return v == null ? v : JSON.parse(JSON.stringify(v));
}

/** Nieuw item voor een oefening, gedoseerd volgens de parameters en met voorgestelde variant. */
export function createItem(exercise, params) {
  const d = defaultDosage(exercise, params);
  const v = suggestVariant(exercise, params);
  return { id: uid(), exerciseId: exercise.id, variant: v.variant, variantManual: false, ...d, note: '' };
}

/** Na een parameterwijziging: varianten die niet manueel gekozen werden opnieuw voorstellen. */
export function reapplyVariants(session, getExercise) {
  const s = structuredCopy(session);
  for (const b of s.blocks) {
    for (const it of b.items) {
      if (it.variantManual) continue;
      const ex = getExercise(it.exerciseId);
      if (ex) it.variant = suggestVariant(ex, s.parameters).variant;
    }
  }
  return s;
}

/** Volgorde van blokken: opwarming, kern(en), afsluiting. Max. 3 kernblokken. */
export function addKernBlock(session) {
  const s = structuredCopy(session);
  const kerns = s.blocks.filter((b) => b.type === 'kern').length;
  if (kerns >= 3) return s;
  const lastKern = s.blocks.map((b) => b.type).lastIndexOf('kern');
  const at = lastKern >= 0 ? lastKern + 1 : s.blocks.findIndex((b) => b.type === 'afsluiting');
  s.blocks.splice(at < 0 ? s.blocks.length : at, 0, { id: uid(), type: 'kern', items: [] });
  return s;
}

export function removeBlock(session, blockId) {
  const s = structuredCopy(session);
  const b = s.blocks.find((x) => x.id === blockId);
  if (!b || (b.type === 'kern' && s.blocks.filter((x) => x.type === 'kern').length <= 1)) return s;
  s.blocks = s.blocks.filter((x) => x.id !== blockId);
  return s;
}

export function addItem(session, blockId, item) {
  const s = structuredCopy(session);
  const b = s.blocks.find((x) => x.id === blockId);
  if (b) b.items.push(item);
  return s;
}

export function removeItem(session, itemId) {
  const s = structuredCopy(session);
  for (const b of s.blocks) b.items = b.items.filter((i) => i.id !== itemId);
  return s;
}

export function updateItem(session, itemId, patch) {
  const s = structuredCopy(session);
  for (const b of s.blocks) {
    const it = b.items.find((i) => i.id === itemId);
    if (it) Object.assign(it, patch);
  }
  return s;
}

/**
 * Schuift een item één plaats omhoog (-1) of omlaag (+1). Over de grens van een blok
 * gaat het naar het einde van het vorige of het begin van het volgende blok.
 */
export function moveItem(session, itemId, dir) {
  const s = structuredCopy(session);
  const bi = s.blocks.findIndex((b) => b.items.some((i) => i.id === itemId));
  if (bi < 0) return s;
  const items = s.blocks[bi].items;
  const ii = items.findIndex((i) => i.id === itemId);
  const target = ii + dir;
  if (target >= 0 && target < items.length) {
    [items[ii], items[target]] = [items[target], items[ii]];
  } else {
    const nb = bi + dir;
    if (nb < 0 || nb >= s.blocks.length) return s;
    const [it] = items.splice(ii, 1);
    if (dir < 0) s.blocks[nb].items.push(it); else s.blocks[nb].items.unshift(it);
  }
  return s;
}

/** Verplaatst een item naar een blok en positie (voor slepen). */
export function placeItem(session, itemId, blockId, position) {
  const s = structuredCopy(session);
  let moving = null;
  for (const b of s.blocks) {
    const i = b.items.findIndex((x) => x.id === itemId);
    if (i >= 0) { moving = b.items.splice(i, 1)[0]; break; }
  }
  const target = s.blocks.find((b) => b.id === blockId);
  if (!moving || !target) return session;
  target.items.splice(Math.max(0, Math.min(position, target.items.length)), 0, moving);
  return s;
}

/** Kopie met nieuwe id's. asTemplate maakt er een sjabloon van, anders een geplande training. */
export function duplicateSession(session, { asTemplate = false, date = isoDate(), title } = {}) {
  const s = structuredCopy(session);
  const now = Date.now();
  s.id = uid();
  s.blocks = s.blocks.map((b) => ({ ...b, id: uid(), items: b.items.map((i) => ({ ...i, id: uid(), note: '' })) }));
  s.status = 'gepland';
  s.isTemplate = asTemplate;
  s.date = asTemplate ? null : date;
  s.notes = { good: '', better: '', perKeeper: '' };
  s.title = title || (asTemplate ? s.title : `${s.title} (kopie)`);
  delete s.givenAt;
  s.createdAt = now; s.updatedAt = now;
  return s;
}

/** Groepeert trainingen: vandaag, gepland (oplopend) en eerder (aflopend). Sjablonen apart. */
export function groupSessions(sessions, today = isoDate()) {
  const real = sessions.filter((s) => !s.isTemplate);
  const byTitle = (a, b) => (a.createdAt || 0) - (b.createdAt || 0);
  return {
    today: real.filter((s) => s.date === today).sort(byTitle),
    upcoming: real.filter((s) => s.date > today).sort((a, b) => a.date.localeCompare(b.date) || byTitle(a, b)),
    past: real.filter((s) => !s.date || s.date < today).sort((a, b) => (b.date || '').localeCompare(a.date || '')),
    templates: sessions.filter((s) => s.isTemplate).sort((a, b) => a.title.localeCompare(b.title, 'nl'))
  };
}
