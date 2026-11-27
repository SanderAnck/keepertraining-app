// Scherm "Oefeningen": bibliotheek met zoeken, filters (thema, leeftijd, niveau, intensiteit, materiaal), favorieten en eigen oefeningen.
import state from '../state.js';
import { html, raw, themeChip } from '../ui.js';
import { setTop } from '../app.js';
import { THEMES, AGE_GROUPS, LEVELS, INTENSITIES, MATERIALS, INTENSITY } from '../logic/constants.js';
import { filterExercises, emptyExercise } from '../logic/library.js';
import { renderDiagram } from '../diagram/render.js';
import { saveExercise } from '../state.js';

// Filters blijven bewaard zolang de app open is.
const filters = { q: '', theme: '', age: '', level: '', intensity: '', materials: [], favorites: false, own: false };

const select = (name, label, list) => html`<label class="select"><span class="sr-only">${label}</span>
  <select name="${name}" aria-label="${label}"><option value="">${label}</option>${list.map((x) => html`<option value="${x.id}" ${filters[name] === x.id ? 'selected' : ''}>${x.label}</option>`)}</select></label>`;

export async function render(main) {
  setTop('Oefeningen', { actions: html`<button class="btn primary" data-act="new">+ Nieuw</button>` });
  main.innerHTML = html`
    <div class="filters">
      <input type="search" name="q" value="${filters.q}" placeholder="Zoek op naam of coachingspunt" aria-label="Zoek oefening" autocomplete="off">
      <div class="chips scroll" role="group" aria-label="Thema">
        <button class="chip toggle${filters.favorites ? ' on' : ''}" data-fav>★ Favorieten</button>
        <button class="chip toggle${filters.own ? ' on' : ''}" data-own>Eigen</button>
        ${THEMES.map((t) => html`<button class="chip toggle theme${filters.theme === t.id ? ' on' : ''}" style="--tc:${t.color}" data-th="${t.id}">${t.short}</button>`)}
      </div>
      <div class="selects">
        ${select('age', 'Leeftijd', AGE_GROUPS)}${select('level', 'Niveau', LEVELS)}${select('intensity', 'Intensiteit', INTENSITIES)}
      </div>
      <details class="mat"${filters.materials.length ? ' open' : ''}><summary>Enkel met dit materiaal${filters.materials.length ? ` (${filters.materials.length})` : ''}</summary>
        <div class="checks">${MATERIALS.map((m) => html`<label class="check"><input type="checkbox" name="materials" value="${m.id}" ${filters.materials.includes(m.id) ? 'checked' : ''}><span>${m.label}</span></label>`)}</div>
      </details>
    </div>
    <p class="meta" id="count"></p>
    <ul class="ex-list" id="list"></ul>`.s;
  const list = main.querySelector('#list');
  const fill = () => {
    const favs = state.settings.favorites || [];
    const res = filterExercises(state.exercises, filters, favs);
    main.querySelector('#count').textContent = `${res.length} van ${state.exercises.length} oefeningen`;
    list.innerHTML = res.length ? res.map((ex) => html`<li><a class="card ex" href="#/oefening/${ex.id}">
      <span class="ex-dia">${raw(renderDiagram(ex.diagram, { title: ex.name }))}</span>
      <span class="ex-text">
        <span class="ex-title"><strong>${ex.name}</strong>${favs.includes(ex.id) ? html`<span class="fav" aria-label="Favoriet">★</span>` : ''}${ex.origin !== 'seed' ? html`<span class="badge">${ex.origin === 'aangepast' ? 'Aangepast' : 'Eigen'}</span>` : ''}</span>
        <span class="chips">${(ex.themes || []).slice(0, 2).map((t, i) => themeChip(t, i === 0))}<span class="chip int-${ex.intensity}">${INTENSITY[ex.intensity]?.label}</span></span>
        <span class="meta">${ex.summary}</span>
      </span></a></li>`).join('')
      : html`<li class="empty small"><p>Geen oefeningen gevonden met deze filters.</p><button class="btn big" data-act="reset">Filters wissen</button></li>`.s;
  };
  fill();
  main.oninput = (e) => { if (e.target.name === 'q') { filters.q = e.target.value; fill(); } };
  main.onchange = (e) => {
    const t = e.target;
    if (['age', 'level', 'intensity'].includes(t.name)) filters[t.name] = t.value;
    if (t.name === 'materials') filters.materials = [...main.querySelectorAll('input[name="materials"]:checked')].map((c) => c.value);
    fill();
  };
  main.onclick = (e) => {
    // Eigen attribuut data-th: closest('[data-theme]') zou anders tot <html data-theme="auto"> klimmen (licht/donker)
    // en bij elke klik elders (bv. het materiaalblok dichtklappen) een onzichtbare themafilter zetten.
    const th = e.target.closest('[data-th]');
    if (th) {
      filters.theme = filters.theme === th.dataset.th ? '' : th.dataset.th;
      main.querySelectorAll('[data-th]').forEach((c) => c.classList.toggle('on', c.dataset.th === filters.theme));
      fill();
    }
    if (e.target.closest('[data-fav]')) {
      filters.favorites = !filters.favorites;
      e.target.closest('[data-fav]').classList.toggle('on', filters.favorites);
      fill();
    }
    if (e.target.closest('[data-own]')) {
      filters.own = !filters.own;
      e.target.closest('[data-own]').classList.toggle('on', filters.own);
      fill();
    }
    if (e.target.closest('[data-act="reset"]')) {
      Object.assign(filters, { q: '', theme: '', age: '', level: '', intensity: '', materials: [], favorites: false, own: false });
      render(main);
    }
  };
  document.querySelector('#topActions').onclick = async (e) => {
    if (!e.target.closest('[data-act="new"]')) return;
    const ex = emptyExercise();
    ex.name = 'Nieuwe oefening';
    await saveExercise(ex);
    location.hash = `#/oefening/${ex.id}/bewerk`;
  };
}
