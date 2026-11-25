// Scherm "Keepers": lijst van keepers en de keeperskaart (profiel, groeicurve, werkpunten met oefeningen,
// beoordelingen). Exporteert ook het beoordelingsvenster dat vanuit een training geopend wordt.
import state, { getKeeper, saveKeeper, deleteKeeper, saveSession, getSession } from '../state.js';
import { html, raw, sheet, confirmSheet, toast, themeIcon, fmtDate } from '../ui.js';
import { setTop } from '../app.js';
import { THEMES, THEME, AGE_GROUPS, LEVELS, AGE, LEVEL } from '../logic/constants.js';
import {
  createKeeper, saveRating, removeRating, sortedRatings, latestScores, previousScores, overallSeries, themeSeries,
  weakest, strongest, average, paramsForKeeper, exercisesForTheme, progressText, SCORE_LABELS
} from '../logic/keepers.js';
import { createSession, isoDate } from '../logic/session.js';
import { generateSession, seededRandom } from '../logic/generator.js';
import { radarChart, lineChart } from './charts.js';

const seg = (name, list, value) => html`<div class="seg" role="radiogroup">${list.map((x) => html`
  <label class="seg-opt"><input type="radio" name="${name}" value="${x.id}" ${x.id === value ? 'checked' : ''}><span>${x.label}</span></label>`)}</div>`;

export async function render(main, [id]) {
  if (id) return renderCard(main, id);
  return renderList(main);
}

// ---------- Lijst ----------
function renderList(main) {
  setTop('Keepers', { actions: html`<button class="btn primary" data-act="new">+ Keeper</button>` });
  const active = state.keepers.filter((k) => !k.archived).sort((a, b) => a.name.localeCompare(b.name, 'nl'));
  const archived = state.keepers.filter((k) => k.archived).sort((a, b) => a.name.localeCompare(b.name, 'nl'));
  const card = (k) => {
    const rs = sortedRatings(k);
    const avg = average(latestScores(k));
    const weak = weakest(k, 1)[0];
    return html`<a class="card keeper-card" href="#/keeper/${k.id}">
      <div class="row between"><h3>${k.name}</h3>${avg != null ? html`<span class="score-pill">${String(avg).replace('.', ',')}</span>` : ''}</div>
      <p class="meta">${AGE[k.age]?.label || ''} · ${LEVEL[k.level]?.label || ''} · ${rs.length ? `laatst beoordeeld ${fmtDate(rs[rs.length - 1].date)}` : 'nog niet beoordeeld'}</p>
      ${weak ? html`<p class="small">Werkpunt: <span class="chip theme" style="--tc:${THEME[weak.theme]?.color}">${THEME[weak.theme]?.short}</span></p>` : ''}
    </a>`;
  };
  main.innerHTML = html`
    ${active.length ? active.map(card) : html`<div class="empty">
      <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
      <h2>Nog geen keepers</h2><p>Voeg je keepers toe en beoordeel ze na een training. Zo zie je per keeper het profiel, de groei en de werkpunten.</p>
      <button class="btn primary huge" data-act="new">Voeg een keeper toe</button></div>`}
    ${archived.length ? html`<details class="card"><summary>Gearchiveerd (${archived.length})</summary>${archived.map(card)}</details>` : ''}`.s;
  const onNew = (e) => { if (e.target.closest('[data-act="new"]')) openKeeperForm(null, (k) => { location.hash = '#/keeper/' + k.id; }); };
  main.onclick = onNew;
  document.querySelector('#topActions').onclick = onNew;
}

// ---------- Keeperskaart ----------
let chartTheme = '';
function renderCard(main, id) {
  const k = getKeeper(id);
  if (!k) {
    setTop('Keeper', { back: '#/keepers' });
    main.innerHTML = html`<div class="empty"><h2>Keeper niet gevonden</h2><a class="btn primary big" href="#/keepers">Naar keepers</a></div>`.s;
    return;
  }
  setTop(k.name, { back: '#/keepers', actions: html`<button class="btn" data-act="edit">Bewerk</button>` });
  const rs = sortedRatings(k);
  const now = latestScores(k);
  const prev = previousScores(k);
  const rated = THEMES.filter((t) => now[t.id]);
  const weak = weakest(k, 2);
  const strong = strongest(k, 2).filter((s) => !weak.some((w) => w.theme === s.theme) && s.value >= 4);
  const prog = progressText(k);
  if (chartTheme && !now[chartTheme]) chartTheme = '';
  const series = chartTheme ? themeSeries(k, chartTheme) : overallSeries(k);
  const seriesLabel = chartTheme ? THEME[chartTheme].short : 'Gemiddelde';
  const avg = average(now);
  const delta = (t) => {
    const p = prev[t]?.value, v = now[t]?.value;
    if (p == null || v == null || p === v) return '';
    return v > p ? html`<span class="delta up" title="Vooruit sinds vorige beoordeling">▲ +${v - p}</span>` : html`<span class="delta down" title="Achteruit sinds vorige beoordeling">▼ ${v - p}</span>`;
  };

  main.innerHTML = html`
    <section class="card">
      <div class="chips"><span class="chip">${AGE[k.age]?.label}</span><span class="chip">${LEVEL[k.level]?.label}</span>${k.archived ? html`<span class="badge">Gearchiveerd</span>` : ''}</div>
      ${k.note ? html`<p>${k.note}</p>` : ''}
      <button class="btn primary huge" data-act="rate">Beoordeel ${k.name}</button>
    </section>

    ${!rs.length ? html`<section class="card soft"><p>Nog geen beoordelingen. Geef na een training per onderdeel een score van 1 tot 5; dan verschijnen hier het profiel, de groeicurve en de werkpunten.</p></section>` : html`
    <section class="card">
      <div class="row between"><h2 class="h">Profiel</h2>${avg != null ? html`<span class="score-pill" title="Gemiddelde van de recentste scores">${String(avg).replace('.', ',')}</span>` : ''}</div>
      ${rated.length >= 3 ? html`<div class="chart-wrap">${raw(radarChart(now, prev))}</div>
        <p class="legend-row"><span class="key now"></span>Nu${Object.keys(prev).length ? html`<span class="key prev"></span>Vorige beoordeling` : ''}</p>` : ''}
      ${prog ? html`<p class="hint">Sinds vorige keer: ${prog}.</p>` : ''}
      <ul class="scores">${rated.map((t) => html`<li>
        <span class="s-name">${raw(themeIcon(t.id, 16))}${t.short}</span>
        <span class="s-bar" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => html`<i class="${i <= now[t.id].value ? 'on' : ''}"></i>`)}</span>
        <span class="s-val">${now[t.id].value}</span>${delta(t.id)}</li>`)}</ul>
    </section>

    <section class="card">
      <h2 class="h">Groei: ${seriesLabel}</h2>
      <div class="chips scroll">
        <button class="chip toggle ${chartTheme ? '' : 'on'}" data-act="series" data-v="">Gemiddelde</button>
        ${rated.map((t) => html`<button class="chip toggle ${chartTheme === t.id ? 'on' : ''}" data-act="series" data-v="${t.id}">${t.short}</button>`)}
      </div>
      ${series.length ? html`<div class="chart-wrap">${raw(lineChart(series, { label: seriesLabel }))}</div>
        <p class="hint chart-tip" aria-live="polite">${series.length > 1 ? 'Tik op een punt voor de score.' : 'Na een volgende beoordeling zie je hier de evolutie.'}</p>` : ''}
    </section>

    <section class="card">
      <h2 class="h">Werkpunten</h2>
      ${weak.map((w) => {
        const exs = exercisesForTheme(state.exercises, k, w.theme, 4);
        return html`<div class="workpoint">
          <p><span class="chip theme main" style="--tc:${THEME[w.theme]?.color}">${THEME[w.theme]?.short}</span> <strong>${w.value}/5</strong> <span class="muted">${SCORE_LABELS[w.value]?.toLowerCase()}</span></p>
          ${exs.length ? html`<ul class="plain">${exs.map((e) => html`<li><a href="#/oefening/${e.id}">${e.name}</a> <span class="muted small">${e.summary}</span></li>`)}</ul>` : html`<p class="muted small">Geen passende oefeningen gevonden voor deze leeftijd.</p>`}
        </div>`;
      })}
      ${strong.length ? html`<p class="hint">Sterk in ${strong.map((s) => THEME[s.theme]?.short.toLowerCase()).join(' en ')}.</p>` : ''}
      <button class="btn primary big" data-act="plan">Plan training rond werkpunten</button>
    </section>

    <section class="card">
      <h2 class="h">Beoordelingen</h2>
      <ul class="plain ratings">${[...rs].reverse().map((r) => {
        const s = r.sessionId ? getSession(r.sessionId) : null;
        const a = average(r.scores);
        return html`<li><button class="rating-row" data-act="editRating" data-id="${r.id}">
          <span><strong>${fmtDate(r.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>${s ? html` · ${s.title}` : ''}<br>
          <span class="muted small">${Object.entries(r.scores).map(([t, v]) => `${THEME[t]?.short} ${v}`).join(' · ')}</span>
          ${r.note ? html`<br><span class="small">${r.note}</span>` : ''}</span>
          ${a != null ? html`<span class="score-pill small">${String(a).replace('.', ',')}</span>` : ''}</button></li>`;
      })}</ul>
    </section>`}`.s;

  main.onclick = async (e) => {
    const pt = e.target.closest('.l-pt');
    if (pt) { main.querySelector('.chart-tip').textContent = pt.dataset.tip; main.querySelectorAll('.l-pt').forEach((g) => g.classList.toggle('sel', g === pt)); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'rate') openRating(k, { onSaved: () => renderCard(main, id) });
    if (act === 'series') { chartTheme = b.dataset.v; renderCard(main, id); }
    if (act === 'editRating') openRating(k, { rating: k.ratings.find((r) => r.id === b.dataset.id), onSaved: () => renderCard(main, id) });
    if (act === 'plan') {
      const params = paramsForKeeper(k, state.settings.defaults);
      params.keepers = Math.max(1, params.keepers || 1);
      const base = createSession({ params, date: isoDate(), title: `Werkpunten ${k.name}` });
      const s = generateSession(params, state.exercises, { keep: base, rng: seededRandom(Date.now()) });
      await saveSession(s);
      toast('Training rond de werkpunten voorgesteld');
      location.hash = '#/training/' + s.id;
    }
  };
  document.querySelector('#topActions').onclick = (e) => {
    if (e.target.closest('[data-act="edit"]')) openKeeperForm(k, () => renderCard(main, id), () => { location.hash = '#/keepers'; });
  };
}

// ---------- Keeper toevoegen of bewerken ----------
function openKeeperForm(keeper, onSaved, onDeleted) {
  const k = keeper || createKeeper({ age: state.settings.defaults?.age || 'senioren', level: state.settings.defaults?.level || 'gevorderd' });
  const d = sheet(keeper ? 'Keeper bewerken' : 'Nieuwe keeper', html`<form class="keeper-form" onsubmit="return false">
    <label class="field"><span class="label">Naam</span><input name="name" value="${keeper ? k.name : ''}" autocomplete="off" required enterkeyhint="done"></label>
    <fieldset><legend>Leeftijdsgroep</legend>${seg('age', AGE_GROUPS, k.age)}</fieldset>
    <fieldset><legend>Niveau</legend>${seg('level', LEVELS, k.level)}</fieldset>
    <label class="field"><span class="label">Notitie</span><textarea name="note" rows="2" placeholder="Bv. sterk op de lijn, linkervoet oefenen">${k.note || ''}</textarea></label>
    <button class="btn primary huge" data-save>Bewaren</button>
    ${keeper ? html`<div class="grid2">
      <button type="button" class="btn big" data-archive>${k.archived ? 'Terugzetten' : 'Archiveren'}</button>
      <button type="button" class="btn big danger" data-del>Verwijderen</button></div>` : ''}
  </form>`, { wide: true });
  const form = d.querySelector('form');
  if (!keeper) setTimeout(() => form.name.focus(), 50);
  d.querySelector('[data-save]').addEventListener('click', async () => {
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    if (!name) { form.name.focus(); toast('Geef een naam in'); return; }
    const rec = await saveKeeper({ ...k, name, age: fd.get('age'), level: fd.get('level'), note: String(fd.get('note') || '').trim() });
    d.closeSheet();
    toast(keeper ? 'Keeper bewaard' : `${name} toegevoegd`);
    onSaved && onSaved(rec);
  });
  d.querySelector('[data-archive]')?.addEventListener('click', async () => {
    await saveKeeper({ ...k, archived: !k.archived });
    d.closeSheet();
    onSaved && onSaved();
  });
  d.querySelector('[data-del]')?.addEventListener('click', async () => {
    if (!(await confirmSheet('Keeper verwijderen', `${k.name} en alle beoordelingen definitief verwijderen?`, 'Verwijderen', true))) return;
    await deleteKeeper(k.id);
    d.closeSheet();
    toast('Keeper verwijderd');
    onDeleted && onDeleted();
  });
}

// ---------- Beoordelen ----------
/**
 * Beoordelingsvenster: per thema een score 1–5. opts: { rating (bestaande), sessionId, date, focus: [thema's
 * van de training, eerst getoond], onSaved }. Bestaat er al een beoordeling voor deze training, dan wordt die bewerkt.
 */
export function openRating(keeper, opts = {}) {
  const existing = opts.rating || (opts.sessionId ? keeper.ratings?.find((r) => r.sessionId === opts.sessionId) : null);
  const r = existing || { date: opts.date || isoDate(), sessionId: opts.sessionId || null, scores: {}, note: '' };
  const last = latestScores(keeper);
  const focus = opts.focus?.length ? opts.focus : [];
  const first = THEMES.filter((t) => focus.includes(t.id) || (!focus.length && last[t.id]));
  const rest = THEMES.filter((t) => !first.includes(t));
  const row = (t) => html`<fieldset class="rate-row"><legend>${raw(themeIcon(t.id, 16))}${t.short}${last[t.id] && !existing ? html` <span class="muted small">vorige: ${last[t.id].value}</span>` : ''}</legend>
    <div class="seg rate" role="radiogroup">
      ${[1, 2, 3, 4, 5].map((v) => html`<label class="seg-opt"><input type="radio" name="${t.id}" value="${v}" ${r.scores[t.id] === v ? 'checked' : ''}><span title="${SCORE_LABELS[v]}">${v}</span></label>`)}
      <label class="seg-opt none"><input type="radio" name="${t.id}" value="" ${r.scores[t.id] ? '' : 'checked'}><span>–</span></label>
    </div></fieldset>`;
  const openRest = !first.length || rest.some((t) => r.scores[t.id]);
  const d = sheet(`Beoordeel ${keeper.name}`, html`<form class="rating-form" onsubmit="return false">
    <p class="hint">1 = werkpunt · 3 = oké · 5 = sterk. Laat "–" staan voor wat je vandaag niet zag.</p>
    <label class="field"><span class="label">Datum</span><input type="date" name="date" value="${r.date}"></label>
    ${first.map(row)}
    ${rest.length ? html`<details ${openRest ? 'open' : ''}><summary>${first.length ? 'Andere onderdelen' : 'Onderdelen'}</summary>${rest.map(row)}</details>` : ''}
    <label class="field"><span class="label">Notitie</span><textarea name="note" rows="2" placeholder="Bv. sneller uitkomen bij 1-tegen-1">${r.note || ''}</textarea></label>
    <button class="btn primary huge" data-save>Bewaren</button>
    ${existing ? html`<button type="button" class="btn big danger wide-solid" data-del>Beoordeling verwijderen</button>` : ''}
  </form>`, { wide: true });
  const form = d.querySelector('form');
  d.querySelector('[data-save]').addEventListener('click', async () => {
    const fd = new FormData(form);
    const scores = Object.fromEntries(THEMES.map((t) => [t.id, fd.get(t.id)]));
    const next = saveRating(keeper, { id: existing?.id, date: fd.get('date') || isoDate(), sessionId: r.sessionId, scores, note: String(fd.get('note') || '') });
    if (!existing && next.ratings.length === (keeper.ratings || []).length) { toast('Geef minstens één score'); return; }
    const rec = await saveKeeper(next);
    d.closeSheet();
    toast(`Beoordeling van ${keeper.name} bewaard`);
    opts.onSaved && opts.onSaved(rec);
  });
  d.querySelector('[data-del]')?.addEventListener('click', async () => {
    if (!(await confirmSheet('Beoordeling verwijderen', 'Deze beoordeling verwijderen?', 'Verwijderen', true))) return;
    const rec = await saveKeeper(removeRating(keeper, existing.id));
    d.closeSheet();
    opts.onSaved && opts.onSaved(rec);
  });
}
