// Scherm "Trainingen": training van vandaag bovenaan met startknop, geplande en eerdere trainingen, sjablonen.
// Elke kaart heeft een prullenbakknop om de training (na bevestiging) meteen te verwijderen.
import state, { saveSession, deleteSession } from '../state.js';
import { html, raw, confirmSheet, toast } from '../ui.js';
import { setTop } from '../app.js';
import { groupSessions, createSession, duplicateSession, isoDate } from '../logic/session.js';
import { sessionCard } from './common.js';
import { markNew } from './training.js';

export async function newSession() {
  const s = createSession({ params: state.settings.defaults, date: isoDate() });
  await saveSession(s);
  markNew(s.id);
  location.hash = '#/training/' + s.id;
}

export async function render(main) {
  setTop('Trainingen', { actions: html`<button class="btn primary" data-act="new">+ Nieuw</button>` });
  const g = groupSessions(state.sessions);
  const empty = !state.sessions.length;
  main.innerHTML = html`
    ${empty ? html`<div class="empty">
      <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 20V6h18v14M3 6l3 3h12l3-3M6 9v11M18 9v11"/></svg>
      <h2>Nog geen trainingen</h2><p>Stel je eerste keepertraining samen uit de oefeningenbibliotheek.</p>
      <button class="btn primary huge" data-act="new">Maak je eerste training</button></div>` : ''}
    ${g.today.length ? html`<section><h2 class="section">Vandaag</h2>${g.today.map((s) => sessionCard(s, { start: true, today: true, del: true }))}</section>` : ''}
    ${!empty && !g.today.length ? html`<section class="card soft"><p>Geen training gepland voor vandaag.</p><button class="btn primary big" data-act="new">Training voor vandaag</button></section>` : ''}
    ${g.upcoming.length ? html`<section><h2 class="section">Gepland</h2>${g.upcoming.map((s) => sessionCard(s, { del: true }))}</section>` : ''}
    ${g.past.length ? html`<section><h2 class="section">Eerder</h2>${g.past.map((s) => sessionCard(s, { del: true }))}</section>` : ''}
    <section><h2 class="section">Sjablonen</h2>
      ${g.templates.length ? g.templates.map((s) => html`<div class="tpl">${sessionCard(s, { del: true })}<button class="btn big" data-act="use" data-id="${s.id}">Gebruik voor vandaag</button></div>`)
        : html`<p class="muted">Bewaar een training als sjabloon om ze snel opnieuw te gebruiken.</p>`}
    </section>
    ${raw('')}`.s;
  main.onclick = async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'del') {
      const s = state.sessions.find((x) => x.id === b.dataset.id);
      if (!s) return;
      const what = s.isTemplate ? 'Sjabloon' : 'Training';
      if (!(await confirmSheet(what + ' verwijderen', `"${s.title}" definitief verwijderen?`, 'Verwijderen', true))) return;
      await deleteSession(s.id);
      toast(what + ' verwijderd');
      render(main);
      return;
    }
    if (b.dataset.act === 'use') {
      const tpl = state.sessions.find((x) => x.id === b.dataset.id);
      const copy = duplicateSession(tpl, { asTemplate: false, date: isoDate(), title: tpl.title });
      await saveSession(copy);
      location.hash = '#/training/' + copy.id;
    }
  };
  document.querySelector('#topActions').onclick = (e) => { if (e.target.closest('[data-act="new"]')) newSession(); };
  main.querySelectorAll('[data-act="new"]').forEach((b) => b.addEventListener('click', newSession));
}
