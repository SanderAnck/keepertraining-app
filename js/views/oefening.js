// Scherm "Oefening": detail met diagram en legende, favoriet, dupliceren, toevoegen aan training, en het bewerkformulier.
import state, { getExercise, saveExercise, deleteExercise, toggleFavorite, isSeed, saveSession } from '../state.js';
import { html, raw, themeChip, toast, confirmSheet, sheet, fmtDate } from '../ui.js';
import { setTop, previousPath } from '../app.js';
import { THEMES, AGE_GROUPS, LEVELS, INTENSITIES, MATERIALS, BLOCK_TYPES, FIELD_TYPES, AGE, LEVEL, INTENSITY, MATERIAL, labelOf } from '../logic/constants.js';
import { duplicateExercise } from '../logic/library.js';
import { createItem, addItem, isoDate } from '../logic/session.js';
import { renderDiagram, renderLegend } from '../diagram/render.js';
import { openDiagramEditor } from '../diagram/editor.js';

export async function render(main, [id, mode]) {
  const ex = getExercise(id);
  if (!ex) {
    setTop('Oefening', { back: '#/oefeningen' });
    main.innerHTML = html`<div class="empty"><h2>Oefening niet gevonden</h2><a class="btn primary big" href="#/oefeningen">Naar oefeningen</a></div>`.s;
    return;
  }
  if (mode === 'bewerk') return renderEdit(main, ex);
  return renderDetail(main, ex);
}

let backFromDetail = '#/oefeningen';
function renderDetail(main, ex) {
  const fav = (state.settings.favorites || []).includes(ex.id);
  // Kom je vanuit een training, dan brengt de terugknop je daar weer naartoe.
  const fromTraining = previousPath && previousPath.startsWith('/training/');
  if (fromTraining) backFromDetail = '#' + previousPath;
  else if (!previousPath || previousPath === '/oefeningen') backFromDetail = '#/oefeningen';
  setTop('Oefening', { back: backFromDetail });
  const list = (arr, m) => (arr || []).map((x) => labelOf(Object.values(m), x)).join(', ');
  main.innerHTML = html`
    <article class="ex-detail">
      <h2 class="title">${ex.name}</h2>
      <div class="chips">${(ex.themes || []).map((t, i) => themeChip(t, i === 0))}<span class="chip int-${ex.intensity}">${INTENSITY[ex.intensity]?.label}</span>
        ${ex.origin !== 'seed' ? html`<span class="badge">${ex.origin === 'aangepast' ? 'Aangepast' : 'Eigen oefening'}</span>` : ''}</div>
      <p class="lead">${ex.summary}</p>
      <figure class="dia-wrap big">${raw(renderDiagram(ex.diagram, { title: ex.name }))}</figure>
      <button class="btn wide-solid" data-act="drawing">Tekening aanpassen</button>
      <details class="legend-box"><summary>Legende</summary>${raw(renderLegend(ex.diagram))}</details>
      <div class="row gap wrap">
        <button class="btn big${fav ? ' on' : ''}" data-act="fav" aria-pressed="${fav}">${fav ? '★ Favoriet' : '☆ Favoriet'}</button>
        <button class="btn big primary" data-act="addTo">Aan training toevoegen</button>
      </div>
      <section class="card"><h3 class="h">Coachingspunten</h3><ol class="coach">${(ex.coaching || []).map((c) => html`<li>${c}</li>`)}</ol></section>
      <section class="card"><h3 class="h">Uitleg</h3><p>${ex.description}</p>
        <dl class="facts">
          <dt>Duur</dt><dd>${ex.duration} min · ${ex.sets} × ${ex.reps > 1 ? ex.reps + ' herhalingen' : 'doorlopend'} · rust ${ex.rest} s</dd>
          <dt>Leeftijd</dt><dd>${list(ex.ages, AGE)}</dd>
          <dt>Niveau</dt><dd>${list(ex.levels, LEVEL)}</dd>
          <dt>Materiaal</dt><dd>${list(ex.materials, MATERIAL) || 'Geen'}</dd>
          <dt>Keepers</dt><dd>${ex.keepers?.min}${ex.keepers?.max !== ex.keepers?.min ? '–' + ex.keepers?.max : ''} · ${ex.trainers} trainer${ex.trainers > 1 ? 's' : ''}</dd>
          <dt>Zone</dt><dd>${ex.zone || '–'}</dd>
          ${ex.divesPerRep ? html`<dt>Duiken</dt><dd>${ex.divesPerRep} per herhaling</dd>` : ''}
        </dl></section>
      ${(ex.mistakes || []).length ? html`<section class="card"><h3 class="h">Veelgemaakte fouten</h3><ul class="mistakes">${ex.mistakes.map((m) => html`<li><strong>${m.fault}</strong><span>→ ${m.fix}</span></li>`)}</ul></section>` : ''}
      <section class="card"><h3 class="h">Varianten</h3>
        <p><span class="chip variant v-makkelijker">Makkelijker</span> ${ex.variants?.easier || '–'}</p>
        <p><span class="chip variant v-moeilijker">Moeilijker</span> ${ex.variants?.harder || '–'}</p></section>
      <div class="grid2 actions">
        <a class="btn big" href="#/oefening/${ex.id}/bewerk">Bewerken</a>
        <button class="btn big" data-act="dup">Dupliceren</button>
        ${ex.origin === 'aangepast' ? html`<button class="btn big" data-act="restore">Origineel herstellen</button>` : ''}
        ${ex.origin === 'eigen' ? html`<button class="btn big danger" data-act="delete">Verwijderen</button>` : ''}
      </div>
    </article>`.s;
  main.onclick = async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'fav') { const on = await toggleFavorite(ex.id); toast(on ? 'Toegevoegd aan favorieten' : 'Uit favorieten'); renderDetail(main, getExercise(ex.id)); }
    if (b.dataset.act === 'drawing') {
      openDiagramEditor(ex.diagram, {
        title: ex.name,
        onSave: async (diagram) => {
          const rec = await saveExercise({ ...ex, diagram });
          toast(isSeed(ex.id) ? 'Tekening bewaard als jouw aanpassing' : 'Tekening bewaard');
          renderDetail(main, rec);
        }
      });
    }
    if (b.dataset.act === 'dup') { const c = duplicateExercise(ex); await saveExercise(c); toast('Gedupliceerd'); location.hash = `#/oefening/${c.id}/bewerk`; }
    if (b.dataset.act === 'restore') {
      if (!(await confirmSheet('Origineel herstellen', 'Je aanpassingen aan deze oefening worden gewist.', 'Herstellen', true))) return;
      await deleteExercise(ex.id); toast('Origineel hersteld'); renderDetail(main, getExercise(ex.id));
    }
    if (b.dataset.act === 'delete') {
      if (!(await confirmSheet('Oefening verwijderen', `"${ex.name}" definitief verwijderen?`, 'Verwijderen', true))) return;
      await deleteExercise(ex.id); toast('Oefening verwijderd'); location.hash = '#/oefeningen';
    }
    if (b.dataset.act === 'addTo') addToSession(ex);
  };
}

function addToSession(ex) {
  const today = isoDate();
  const sessions = state.sessions.filter((s) => !s.isTemplate && (s.date || '') >= today).sort((a, b) => a.date.localeCompare(b.date));
  const d = sheet('Aan training toevoegen', sessions.length
    ? html`<ul class="plain pick-sessions">${sessions.map((s) => html`<li><p><strong>${s.title}</strong> · ${fmtDate(s.date)}</p><div class="row gap wrap">${s.blocks.map((b, i) => html`<button class="btn" data-s="${s.id}" data-b="${b.id}">${b.type === 'kern' ? 'Kern' + (s.blocks.filter((x) => x.type === 'kern').length > 1 ? ' ' + (s.blocks.slice(0, i + 1).filter((x) => x.type === 'kern').length) : '') : labelOf(BLOCK_TYPES, b.type)}</button>`)}</div></li>`)}</ul>`
    : html`<p>Er zijn geen geplande trainingen. Maak eerst een training aan.</p><a class="btn primary big" href="#/trainingen" data-close>Naar trainingen</a>`);
  d.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    const s = state.sessions.find((x) => x.id === b.dataset.s);
    await saveSession(addItem(s, b.dataset.b, createItem(ex, s.parameters)));
    d.closeSheet();
    toast(`Toegevoegd aan ${s.title}`, { action: 'Open', onAction: () => { location.hash = '#/training/' + s.id; } });
  });
}

const checks = (name, list, values) => html`<div class="checks">${list.map((x) => html`<label class="check"><input type="checkbox" name="${name}" value="${x.id}" ${(values || []).includes(x.id) ? 'checked' : ''}><span>${x.short || x.label}</span></label>`)}</div>`;
const num = (name, label, value, min, max, step = 1) => html`<label class="field"><span class="label">${label}</span><input type="number" inputmode="numeric" name="${name}" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;

function renderEdit(main, ex) {
  const seed = isSeed(ex.id);
  setTop('Oefening bewerken', { back: `#/oefening/${ex.id}` });
  main.innerHTML = html`<form class="ex-form" onsubmit="return false">
    ${seed ? html`<p class="notice">Dit is een meegeleverde oefening. Je aanpassing wordt apart bewaard en blijft behouden bij updates. Je kunt altijd het origineel herstellen.</p>` : ''}
    <label class="field"><span class="label">Naam</span><input name="name" value="${ex.name}" required></label>
    <label class="field"><span class="label">Korte beschrijving (max. 2 zinnen)</span><textarea name="summary" rows="2">${ex.summary}</textarea></label>
    <label class="field"><span class="label">Uitgebreide uitleg</span><textarea name="description" rows="5">${ex.description}</textarea></label>
    <fieldset><legend>Thema's (eerste = hoofdthema)</legend>${checks('themes', THEMES, ex.themes)}</fieldset>
    <fieldset><legend>Leeftijdsgroepen</legend>${checks('ages', AGE_GROUPS, ex.ages)}</fieldset>
    <fieldset><legend>Niveaus</legend>${checks('levels', LEVELS, ex.levels)}</fieldset>
    <fieldset><legend>Intensiteit</legend><div class="seg">${INTENSITIES.map((i) => html`<label class="seg-opt"><input type="radio" name="intensity" value="${i.id}" ${ex.intensity === i.id ? 'checked' : ''}><span>${i.label}</span></label>`)}</div></fieldset>
    <fieldset><legend>Materiaal</legend>${checks('materials', MATERIALS, ex.materials)}</fieldset>
    <fieldset><legend>Geschikt als blok</legend>${checks('blockTypes', BLOCK_TYPES, ex.blockTypes)}</fieldset>
    <div class="grid2">
      ${num('kmin', 'Keepers min.', ex.keepers?.min ?? 1, 1, 6)}${num('kmax', 'Keepers max.', ex.keepers?.max ?? 2, 1, 6)}
      ${num('trainers', 'Trainers', ex.trainers ?? 1, 1, 2)}
      <label class="field"><span class="label">Zone</span><input name="zone" value="${ex.zone || ''}" placeholder="bv. 16 × 20 m"></label>
      ${num('duration', 'Duur (min)', ex.duration, 1, 60)}${num('sets', 'Series', ex.sets, 1, 12)}
      ${num('reps', 'Herhalingen', ex.reps, 1, 40)}${num('rest', 'Rust (s)', ex.rest, 0, 600, 5)}
      ${num('divesPerRep', 'Duiken per herhaling', ex.divesPerRep || 0, 0, 4)}
      <label class="check big"><input type="checkbox" name="explosive" ${ex.explosive ? 'checked' : ''}><span>Zeer explosief</span></label>
    </div>
    <label class="field"><span class="label">Coachingspunten (één per regel, max. 4)</span><textarea name="coaching" rows="4">${(ex.coaching || []).join('\n')}</textarea></label>
    <label class="field"><span class="label">Veelgemaakte fouten (per regel: fout — correctie)</span><textarea name="mistakes" rows="4">${(ex.mistakes || []).map((m) => `${m.fault} — ${m.fix}`).join('\n')}</textarea></label>
    <label class="field"><span class="label">Variant makkelijker</span><textarea name="easier" rows="2">${ex.variants?.easier || ''}</textarea></label>
    <label class="field"><span class="label">Variant moeilijker</span><textarea name="harder" rows="2">${ex.variants?.harder || ''}</textarea></label>
    <fieldset><legend>Veldtekening</legend>
      <button type="button" class="dia-wrap dia-edit" id="preview" data-act="diagram" aria-label="Tekening bewerken">${raw(renderDiagram(ex.diagram))}</button>
      <button type="button" class="btn big wide-solid" data-act="diagram">Tekening bewerken</button>
      <p class="hint">Plaats en versleep elementen, teken pijlen met je vinger en kies het veld. Wordt bewaard samen met de oefening.</p>
    </fieldset>
    <div class="row gap sticky-actions"><button class="btn primary huge" data-act="save">Opslaan</button></div>
  </form>`.s;
  const form = main.querySelector('form');
  let diagram = ex.diagram || { field: 'doel', elements: [], lines: [] };
  const read = () => {
    const fd = new FormData(form);
    const all = (n) => fd.getAll(n);
    const order = (n, list) => list.map((x) => x.id).filter((id) => all(n).includes(id));
    const themes = ex.themes?.filter((t) => all('themes').includes(t)).concat(all('themes').filter((t) => !ex.themes?.includes(t))) || all('themes');
    return {
      ...ex,
      name: (fd.get('name') || '').trim() || 'Naamloze oefening',
      summary: fd.get('summary').trim(), description: fd.get('description').trim(),
      themes: themes.length ? themes : ['vangen'],
      ages: order('ages', AGE_GROUPS), levels: order('levels', LEVELS), intensity: fd.get('intensity') || 'gemiddeld',
      materials: order('materials', MATERIALS), blockTypes: order('blockTypes', BLOCK_TYPES),
      keepers: { min: +fd.get('kmin') || 1, max: Math.max(+fd.get('kmin') || 1, +fd.get('kmax') || 1) },
      trainers: +fd.get('trainers') || 1, zone: fd.get('zone').trim(),
      duration: +fd.get('duration') || 5, sets: +fd.get('sets') || 1, reps: +fd.get('reps') || 1, rest: +fd.get('rest') || 0,
      divesPerRep: +fd.get('divesPerRep') || 0, explosive: fd.get('explosive') === 'on',
      coaching: fd.get('coaching').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 4),
      mistakes: fd.get('mistakes').split('\n').map((s) => s.trim()).filter(Boolean).map((l) => {
        const [fault, ...fix] = l.split(/\s+[—–-]\s+/); return { fault: fault.trim(), fix: fix.join(' – ').trim() };
      }),
      variants: { easier: fd.get('easier').trim(), harder: fd.get('harder').trim() },
      diagram
    };
  };
  main.onclick = async (e) => {
    if (e.target.closest('[data-act="diagram"]')) {
      openDiagramEditor(diagram, {
        title: form.name.value || ex.name || 'Nieuwe oefening',
        onSave: (dg) => {
          diagram = dg;
          main.querySelector('#preview').innerHTML = renderDiagram(diagram);
          toast('Tekening aangepast. Vergeet niet de oefening op te slaan.', { duration: 4000 });
        }
      });
      return;
    }
    if (!e.target.closest('[data-act="save"]')) return;
    const rec = read();
    await saveExercise(rec);
    toast('Oefening opgeslagen');
    location.hash = `#/oefening/${rec.id}`;
  };
}
