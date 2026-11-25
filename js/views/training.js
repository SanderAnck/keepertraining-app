// Scherm "Training": parameters, blokken met oefeningen (toevoegen, herschikken, doseren), totalen, acties en notities.
import state, { getSession, saveSession, deleteSession, getExercise } from '../state.js';
import { html, raw, sheet, confirmSheet, toast, themeChip, fmtMin, esc } from '../ui.js';
import { setTop } from '../app.js';
import { VARIANTS, VARIANT, INTENSITY, AGE, THEME } from '../logic/constants.js';
import { sessionSummary, checkExercise, isUnsuitable, suggestVariant, itemTiming, loadLabel, flattenSession, itemDives } from '../logic/load.js';
import { createItem, reapplyVariants, addKernBlock, removeBlock, addItem, removeItem, updateItem, moveItem, duplicateSession, isoDate } from '../logic/session.js';
import { filterExercises } from '../logic/library.js';
import { paramsChips, issueList } from './common.js';
import { paramsForm, bindParams } from './params.js';
import { renderDiagram } from '../diagram/render.js';

let session = null;
let main = null;

async function commit(next, { rerender = true } = {}) {
  session = await saveSession(next);
  if (rerender) draw();
}

export async function render(root, [id]) {
  main = root;
  session = getSession(id);
  if (!session) {
    setTop('Training', { back: '#/trainingen' });
    main.innerHTML = html`<div class="empty"><h2>Training niet gevonden</h2><a class="btn primary big" href="#/trainingen">Naar trainingen</a></div>`.s;
    return;
  }
  draw();
  main.onclick = onClick;
  main.onchange = onChange;
  main.oninput = onInput;
}

function blockLabels() {
  const kerns = session.blocks.filter((b) => b.type === 'kern').length;
  let k = 0;
  return session.blocks.map((b) => {
    if (b.type === 'kern') { k += 1; return kerns > 1 ? `Kern ${k}` : 'Kern'; }
    return b.type === 'opwarming' ? 'Opwarming' : 'Afsluiting';
  });
}

function itemRow(item, block, first, last) {
  const ex = getExercise(item.exerciseId);
  if (!ex) {
    return html`<li class="item missing"><div class="item-main"><strong>Oefening niet gevonden</strong><p class="meta">Ze werd verwijderd uit de bibliotheek.</p></div>
      <div class="item-actions"><button class="btn" data-act="remove" data-id="${item.id}">Verwijder</button></div></li>`;
  }
  const issues = checkExercise(ex, session.parameters);
  const sug = suggestVariant(ex, session.parameters);
  const t = itemTiming(item);
  const bad = isUnsuitable(issues);
  const dives = itemDives(ex, item);
  const color = THEME[ex.themes?.[0]]?.color || '#888';
  return html`<li class="item${bad ? ' bad' : ''}" style="--tc:${color}">
    <div class="item-main" data-act="edit" data-id="${item.id}" role="button" tabindex="0" aria-label="${ex.name} bewerken">
      <div class="item-title"><strong>${ex.name}</strong>
        <span class="chip variant v-${item.variant}">${VARIANT[item.variant]?.label}</span>
        ${item.variant !== sug.variant ? html`<span class="chip hint-chip" title="${sug.reason}">Voorstel: ${VARIANT[sug.variant].label.toLowerCase()}</span>` : ''}
      </div>
      <p class="meta">${t.sets} × ${item.reps > 1 ? item.reps + ' herh.' : fmtSec(t.workSec)} · rust ${item.rest} s · ${fmtMin(t.totalSec)}${dives ? ` · ${dives} duiken` : ''}</p>
      ${issueList(issues)}
    </div>
    <div class="item-actions">
      <button class="btn icon" data-act="up" data-id="${item.id}" ${first ? 'disabled' : ''} aria-label="Omhoog">▲</button>
      <button class="btn icon" data-act="down" data-id="${item.id}" ${last ? 'disabled' : ''} aria-label="Omlaag">▼</button>
    </div>
  </li>`;
}

const fmtSec = (s) => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} min` : `${s} s`);

function draw() {
  const sum = sessionSummary(session, getExercise);
  const p = session.parameters;
  const labels = blockLabels();
  const allItems = flattenSession(session).map((f) => f.item.id);
  const pct = Math.min(100, Math.round((sum.minutes / (p.time || 60)) * 100));
  const kerns = session.blocks.filter((b) => b.type === 'kern').length;
  const age = AGE[p.age];
  setTop(session.isTemplate ? 'Sjabloon' : 'Training', {
    back: '#/trainingen',
    actions: session.isTemplate ? '' : html`<a class="btn primary" href="#/veld/${session.id}">Start</a>`
  });
  main.innerHTML = html`
    <section class="card">
      <label class="field"><span class="label">Titel</span><input name="title" value="${session.title}" autocomplete="off" enterkeyhint="done"></label>
      ${session.isTemplate ? '' : html`<label class="field"><span class="label">Datum</span><input type="date" name="date" value="${session.date || ''}"></label>`}
      ${session.status === 'gegeven' ? html`<p><span class="badge ok">Gegeven</span></p>` : ''}
    </section>

    <section class="card">
      <div class="row between"><h2 class="h">Parameters</h2><button class="btn" data-act="params">Wijzigen</button></div>
      <div class="chips">${paramsChips(p)}</div>
      <p class="meta">${p.keepers} keeper${p.keepers > 1 ? 's' : ''} · ${p.trainers} trainer${p.trainers > 1 ? 's' : ''} · ${p.time} min · ${INTENSITY[p.intensity]?.workRest} werk-rust · ${esc(p.surface)}</p>
    </section>

    <section class="card summary" aria-live="polite">
      <div class="stats">
        <div><span class="big-num">${sum.minutes}</span><span class="unit">/ ${p.time} min</span></div>
        <div><span class="big-num">${sum.load}</span><span class="unit">belasting (${loadLabel(sum.load, sum.minutes).toLowerCase()})</span></div>
        <div><span class="big-num">${sum.dives}</span><span class="unit">/ ${age?.maxDives ?? '–'} duiken</span></div>
      </div>
      <div class="bar" role="progressbar" aria-valuenow="${sum.minutes}" aria-valuemin="0" aria-valuemax="${p.time}"><span style="width:${pct}%" class="${sum.minutes > p.time + 5 ? 'over' : ''}"></span></div>
      ${issueList(sum.warnings)}
    </section>

    ${session.blocks.map((b, bi) => {
      const bt = b.items.reduce((a, it) => a + itemTiming(it).totalSec, 0);
      return html`<section class="block" data-block="${b.id}">
        <div class="block-head"><h2 class="h">${labels[bi]}</h2><span class="meta">${fmtMin(bt)}</span>
          ${b.type === 'kern' && kerns > 1 ? html`<button class="btn ghost" data-act="removeBlock" data-id="${b.id}">Blok verwijderen</button>` : ''}</div>
        ${b.items.length ? html`<ol class="items">${b.items.map((it) => itemRow(it, b, allItems[0] === it.id, allItems[allItems.length - 1] === it.id))}</ol>`
          : html`<p class="muted small">${b.type === 'opwarming' ? 'Tip: mobiliteit, balgewenning en lichte valvormen.' : b.type === 'afsluiting' ? 'Tip: een wedstrijdvorm of rustige cool-down.' : 'Nog geen oefeningen.'}</p>`}
        <button class="btn add" data-act="add" data-id="${b.id}">+ Oefening</button>
      </section>`;
    })}
    ${kerns < 3 ? html`<button class="btn wide" data-act="addKern">+ Extra kernblok</button>` : ''}

    <section class="actions">
      ${session.isTemplate ? '' : html`<a class="btn primary huge" href="#/veld/${session.id}">Start training</a>`}
      <div class="grid2">
        <button class="btn big" data-act="duplicate">Dupliceren</button>
        ${session.isTemplate ? html`<button class="btn big" data-act="useTemplate">Gebruik voor vandaag</button>` : html`<button class="btn big" data-act="template">Als sjabloon</button>`}
        ${session.isTemplate ? '' : html`<button class="btn big" data-act="given">${session.status === 'gegeven' ? 'Terug naar gepland' : 'Markeer als gegeven'}</button>`}
        <button class="btn big danger" data-act="delete">Verwijderen</button>
      </div>
    </section>

    ${session.isTemplate ? '' : html`<section class="card notes" id="notes">
      <h2 class="h">Notities achteraf</h2>
      <label class="field"><span class="label">Wat ging goed?</span><textarea name="good" rows="3">${session.notes?.good || ''}</textarea></label>
      <label class="field"><span class="label">Wat kan beter?</span><textarea name="better" rows="3">${session.notes?.better || ''}</textarea></label>
      <label class="field"><span class="label">Per keeper</span><textarea name="perKeeper" rows="3" placeholder="Bv. Lotte: mooi uitgekomen. Tom: handen te laat.">${session.notes?.perKeeper || ''}</textarea></label>
      ${fieldNotes()}
    </section>`}`.s;
}

function fieldNotes() {
  const notes = flattenSession(session).filter((f) => f.item.note);
  if (!notes.length) return '';
  return html`<h3 class="h small">Notities van op het veld</h3><ul class="plain">${notes.map((f) => html`<li><strong>${getExercise(f.item.exerciseId)?.name || 'Oefening'}:</strong> ${f.item.note}</li>`)}</ul>`;
}

let inputTimer = null;
function onInput(e) {
  const t = e.target;
  if (['good', 'better', 'perKeeper'].includes(t.name)) {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => commit({ ...session, notes: { ...session.notes, [t.name]: t.value } }, { rerender: false }), 400);
  } else if (t.name === 'title') {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => commit({ ...session, title: t.value || 'Training' }, { rerender: false }), 400);
  }
}

function onChange(e) {
  const t = e.target;
  if (t.name === 'date' && t.value) commit({ ...session, date: t.value });
}

async function onClick(e) {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const id = b.dataset.id;
  switch (b.dataset.act) {
    case 'params': return openParams();
    case 'add': return openPicker(id);
    case 'edit': return openItem(id);
    case 'up': return commit(moveItem(session, id, -1));
    case 'down': return commit(moveItem(session, id, 1));
    case 'remove': return commit(removeItem(session, id));
    case 'addKern': return commit(addKernBlock(session));
    case 'removeBlock': {
      const blk = session.blocks.find((x) => x.id === id);
      if (blk.items.length && !(await confirmSheet('Blok verwijderen', 'Dit kernblok en zijn oefeningen verwijderen?', 'Verwijderen', true))) return;
      return commit(removeBlock(session, id));
    }
    case 'duplicate': {
      const copy = duplicateSession(session, { asTemplate: false, date: isoDate() });
      await saveSession(copy);
      toast('Training gedupliceerd');
      location.hash = '#/training/' + copy.id;
      return;
    }
    case 'template': {
      const tpl = duplicateSession(session, { asTemplate: true, title: session.title });
      await saveSession(tpl);
      toast('Opgeslagen als sjabloon', { action: 'Bekijk', onAction: () => { location.hash = '#/training/' + tpl.id; } });
      return;
    }
    case 'useTemplate': {
      const copy = duplicateSession(session, { asTemplate: false, date: isoDate(), title: session.title });
      await saveSession(copy);
      location.hash = '#/training/' + copy.id;
      return;
    }
    case 'given': {
      const given = session.status !== 'gegeven';
      await commit({ ...session, status: given ? 'gegeven' : 'gepland', givenAt: given ? Date.now() : null });
      if (given) document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    case 'delete': {
      if (!(await confirmSheet('Training verwijderen', `"${session.title}" definitief verwijderen?`, 'Verwijderen', true))) return;
      await deleteSession(session.id);
      toast('Training verwijderd');
      location.hash = '#/trainingen';
    }
  }
}

function openParams() {
  const d = sheet('Parameters', paramsForm(session.parameters), { wide: true });
  bindParams(d, session.parameters, (p) => {
    const next = reapplyVariants({ ...session, parameters: p }, getExercise);
    commit(next);
  });
}

function openPicker(blockId) {
  const block = session.blocks.find((b) => b.id === blockId);
  const filters = { q: '', theme: '', onlyFit: true };
  const d = sheet('Oefening toevoegen', html`<div class="picker">
    <input type="search" name="q" placeholder="Zoek oefening" aria-label="Zoek oefening" autocomplete="off">
    <div class="chips scroll"><button class="chip toggle on" data-f="fit">Alleen passend</button>
      ${[...new Set([session.parameters.mainTheme, ...session.parameters.themes])].map((t) => html`<button class="chip toggle theme" style="--tc:${THEME[t]?.color}" data-f="theme" data-v="${t}">${THEME[t]?.short}</button>`)}</div>
    <ul class="pick-list"></ul></div>`, { wide: true });
  const list = d.querySelector('.pick-list');
  const fill = () => {
    const params = session.parameters;
    let exs = filterExercises(state.exercises, { q: filters.q, theme: filters.theme });
    const scored = exs.map((ex) => {
      const issues = checkExercise(ex, params);
      const themeHit = (ex.themes || []).some((t) => params.themes.includes(t)) ? 0 : 1;
      const blockHit = (ex.blockTypes || []).includes(block.type) ? 0 : 1;
      return { ex, issues, bad: isUnsuitable(issues), rank: (isUnsuitable(issues) ? 10 : 0) + blockHit * 2 + themeHit };
    }).filter((x) => !filters.onlyFit || !x.bad).sort((a, b) => a.rank - b.rank || a.ex.name.localeCompare(b.ex.name, 'nl'));
    list.innerHTML = scored.length ? scored.map(({ ex, issues, bad }) => html`<li><button class="pick${bad ? ' bad' : ''}" data-ex="${ex.id}">
      <span class="pick-dia">${raw(renderDiagram(ex.diagram, { title: ex.name }))}</span>
      <span class="pick-text"><strong>${ex.name}</strong><span class="chips">${(ex.themes || []).map((t) => themeChip(t))}</span>
      <span class="meta">${ex.summary}</span>${issueList(issues)}</span></button></li>`).join('')
      : html`<li class="muted">Geen oefeningen gevonden. Zet "Alleen passend" uit of pas de parameters aan.</li>`.s;
  };
  fill();
  d.addEventListener('input', (e) => { if (e.target.name === 'q') { filters.q = e.target.value; fill(); } });
  d.addEventListener('click', async (e) => {
    const f = e.target.closest('[data-f]');
    if (f) {
      if (f.dataset.f === 'fit') { filters.onlyFit = !filters.onlyFit; f.classList.toggle('on', filters.onlyFit); }
      if (f.dataset.f === 'theme') {
        const on = filters.theme !== f.dataset.v;
        filters.theme = on ? f.dataset.v : '';
        d.querySelectorAll('[data-f="theme"]').forEach((c) => c.classList.toggle('on', c === f && on));
      }
      fill();
      return;
    }
    const pick = e.target.closest('[data-ex]');
    if (pick) {
      const ex = getExercise(pick.dataset.ex);
      await commit(addItem(session, blockId, createItem(ex, session.parameters)));
      d.closeSheet();
      toast(`${ex.name} toegevoegd`);
    }
  });
}

function openItem(itemId) {
  const item = flattenSession(session).find((f) => f.item.id === itemId)?.item;
  if (!item) return;
  const ex = getExercise(item.exerciseId);
  if (!ex) return;
  const sug = suggestVariant(ex, session.parameters);
  const variantText = (v) => v === 'makkelijker' ? ex.variants?.easier : v === 'moeilijker' ? ex.variants?.harder : ex.summary;
  const d = sheet(ex.name, html`<form class="item-form" onsubmit="return false">
    <div class="dia-wrap">${raw(renderDiagram(ex.diagram, { title: ex.name }))}</div>
    <fieldset><legend>Variant</legend>
      <div class="seg">${VARIANTS.map((v) => html`<label class="seg-opt"><input type="radio" name="variant" value="${v.id}" ${v.id === item.variant ? 'checked' : ''}><span>${v.label}${v.id === sug.variant ? ' ★' : ''}</span></label>`)}</div>
      <p class="hint" id="vtext">${variantText(item.variant)}</p>
      <p class="hint">★ = voorstel${sug.reason ? ': ' + sug.reason.toLowerCase() : ''}</p>
    </fieldset>
    <div class="grid2">
      <label class="field"><span class="label">Duur (min)</span><input type="number" inputmode="numeric" name="duration" min="1" max="60" value="${item.duration}"></label>
      <label class="field"><span class="label">Series</span><input type="number" inputmode="numeric" name="sets" min="1" max="12" value="${item.sets}"></label>
      <label class="field"><span class="label">Herhalingen</span><input type="number" inputmode="numeric" name="reps" min="1" max="40" value="${item.reps}"></label>
      <label class="field"><span class="label">Rust (s)</span><input type="number" inputmode="numeric" name="rest" min="0" max="600" step="5" value="${item.rest}"></label>
    </div>
    <p class="hint" id="timing"></p>
    <label class="field"><span class="label">Notitie</span><textarea name="note" rows="2">${item.note || ''}</textarea></label>
    <div class="row gap"><a class="btn big" href="#/oefening/${ex.id}">Oefening bekijken</a><button type="button" class="btn big danger" data-del>Uit training halen</button></div>
  </form>`, { wide: true });
  const form = d.querySelector('form');
  const showTiming = (it) => {
    const t = itemTiming(it);
    d.querySelector('#timing').textContent = `${t.sets} × ${fmtSec(t.workSec)} werk${t.sets > 1 ? `, ${t.restSec} s rust ertussen` : ''} = ${fmtMin(t.totalSec)}`;
  };
  showTiming(item);
  form.addEventListener('input', () => {
    const fd = new FormData(form);
    const patch = {
      variant: fd.get('variant'),
      variantManual: fd.get('variant') !== sug.variant ? true : item.variantManual && fd.get('variant') !== sug.variant,
      duration: Math.max(1, +fd.get('duration') || item.duration),
      sets: Math.max(1, +fd.get('sets') || 1),
      reps: Math.max(1, +fd.get('reps') || 1),
      rest: Math.max(0, +fd.get('rest') || 0),
      note: fd.get('note') || ''
    };
    d.querySelector('#vtext').textContent = variantText(patch.variant) || '';
    showTiming(patch);
    session = updateItem(session, itemId, patch);
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => commit(session), 300);
  });
  d.querySelector('[data-del]').addEventListener('click', async () => { d.closeSheet(); await commit(removeItem(session, itemId)); toast('Oefening verwijderd'); });
}
