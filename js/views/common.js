// Gedeelde schermonderdelen: samenvatting van parameters, trainingskaart en meldingen van de belastingsregels.
import { html, themeChip, fmtDate, fmtMin } from '../ui.js';
import { AGE, LEVEL, INTENSITY } from '../logic/constants.js';
import { sessionSummary, loadLabel } from '../logic/load.js';
import { getExercise } from '../state.js';

export function paramsChips(p = {}) {
  const themes = [p.mainTheme, ...(p.themes || []).filter((t) => t !== p.mainTheme)].filter(Boolean);
  return html`${themes.map((t) => themeChip(t, t === p.mainTheme))}
    ${p.age ? html`<span class="chip">${AGE[p.age]?.label}</span>` : ''}
    ${p.level ? html`<span class="chip">${LEVEL[p.level]?.label}</span>` : ''}
    ${p.intensity ? html`<span class="chip int-${p.intensity}">${INTENSITY[p.intensity]?.label}</span>` : ''}`;
}

export function sessionCard(s, { start = false, today = false, del = false } = {}) {
  const sum = sessionSummary(s, getExercise);
  const status = s.status === 'gegeven' ? html`<span class="badge ok">Gegeven</span>` : '';
  return html`<article class="card session${today ? ' today' : ''}${del ? ' has-del' : ''}">
    <a class="card-link" href="#/training/${s.id}">
      <div class="card-top"><span class="date">${s.isTemplate ? 'Sjabloon' : fmtDate(s.date)}</span>${status}</div>
      <h3>${s.title}</h3>
      <div class="chips">${paramsChips(s.parameters)}</div>
      <p class="meta">${sum.count} oefening${sum.count === 1 ? '' : 'en'} · ${fmtMin(sum.totalSec)} van ${s.parameters?.time || '–'} min · belasting ${loadLabel(sum.load, sum.minutes).toLowerCase()}</p>
    </a>
    ${del ? html`<button class="btn ghost danger icon card-del" data-act="del" data-id="${s.id}" aria-label="${s.isTemplate ? 'Sjabloon' : 'Training'} ${s.title} verwijderen" title="Verwijderen">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button>` : ''}
    ${start ? html`<a class="btn primary huge" href="#/veld/${s.id}">Start training</a>` : ''}
  </article>`;
}

export function issueList(issues) {
  if (!issues.length) return '';
  return html`<ul class="issues">${issues.map((i) => html`<li class="${i.level}">${i.message}</li>`)}</ul>`;
}
