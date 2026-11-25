// Scherm "Keepers": voorlopig een aankondiging; keepersbeheer, aanwezigheid en evaluaties volgen in fase 3.
import { html } from '../ui.js';
import { setTop } from '../app.js';

export async function render(main) {
  setTop('Keepers');
  main.innerHTML = html`<div class="empty">
    <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
    <h2>Keepers komt binnenkort</h2>
    <p>Een lijst van je keepers met aandachtspunten, aanwezigheid per training en evaluaties per thema volgen in een volgende versie.</p>
    <p class="muted">Tot dan kun je per training notities per keeper bijhouden.</p>
    <a class="btn primary big" href="#/trainingen">Naar trainingen</a></div>`.s;
}
