// Opstart van de app: hash-router, tabbalk, topbalk, registratie van de service worker en de update-toast.
import { loadAll, getFieldState } from './state.js';
import state from './state.js';
import { requestPersistence } from './db.js';
import { toast, unlockAudio, html, $ } from './ui.js';
import { maybeRemind } from './backup.js';
import * as trainingen from './views/trainingen.js';
import * as training from './views/training.js';
import * as oefeningen from './views/oefeningen.js';
import * as oefening from './views/oefening.js';
import * as keepers from './views/keepers.js';
import * as instellingen from './views/instellingen.js';
import * as field from './field.js';

const routes = [
  [/^\/trainingen$/, trainingen, 'trainingen'],
  [/^\/training\/([^/]+)$/, training, 'trainingen'],
  [/^\/oefeningen$/, oefeningen, 'oefeningen'],
  [/^\/oefening\/([^/]+)$/, oefening, 'oefeningen'],
  [/^\/oefening\/([^/]+)\/(bewerk)$/, oefening, 'oefeningen'],
  [/^\/keepers$/, keepers, 'keepers'],
  [/^\/instellingen$/, instellingen, 'instellingen'],
  [/^\/veld\/([^/]+)$/, field, null]
];

let cleanup = null;

/** Topbalk invullen. opts: { back: '#/route', actions: Safe html } */
export function setTop(title, opts = {}) {
  $('#topTitle').textContent = title;
  document.title = title === 'KeeperCoach' ? title : `${title} · KeeperCoach`;
  const back = $('#topBack');
  back.hidden = !opts.back;
  if (opts.back) back.setAttribute('href', opts.back);
  $('#topActions').innerHTML = opts.actions ? String(opts.actions) : '';
}

async function route() {
  const path = (location.hash || '#/trainingen').slice(1) || '/trainingen';
  const match = routes.map(([re, view, tab]) => ({ m: path.match(re), view, tab })).find((r) => r.m);
  if (!match) { location.replace('#/trainingen'); return; }
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  document.body.classList.toggle('in-field', match.view === field);
  document.querySelectorAll('.tabbar a').forEach((a) => {
    const on = a.dataset.tab === match.tab;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const main = $('#main');
  main.innerHTML = '';
  main.onclick = main.oninput = main.onchange = null;
  $('#topActions').onclick = null;
  main.scrollTop = 0; window.scrollTo(0, 0);
  try {
    cleanup = (await match.view.render(main, match.m.slice(1))) || null;
  } catch (e) {
    console.error(e);
    main.innerHTML = html`<div class="empty"><h2>Er ging iets mis</h2><p>${e.message}</p><a class="btn primary big" href="#/trainingen">Naar trainingen</a></div>`.s;
  }
}

export const rerender = () => route();

export function applyAppearance() {
  const s = state.settings || {};
  document.documentElement.dataset.theme = s.theme || 'auto';
}

// ---------- Service worker en updates ----------
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  // Alleen herladen als de gebruiker zelf op de update-toast tikte (niet bij de eerste installatie).
  let wantsReload = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!wantsReload) return;
    wantsReload = false;
    location.reload();
  });
  const swUrl = (v) => 'sw.js?v=' + encodeURIComponent(v);
  navigator.serviceWorker.register(swUrl(self.KEEPER_VERSION), { updateViaCache: 'none' }).then((reg) => {
    swReg = reg;
    const offer = (worker) => {
      if (!worker || !navigator.serviceWorker.controller) return;
      toast('Nieuwe versie beschikbaar, tik om te vernieuwen', {
        duration: 0,
        onAction: () => { wantsReload = true; worker.postMessage({ type: 'SKIP_WAITING' }); }
      });
    };
    if (reg.waiting) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w && w.addEventListener('statechange', () => { if (w.state === 'installed') offer(w); });
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdate(); });
    setInterval(checkForUpdate, 30 * 60 * 1000);
    checkForUpdate();
  }).catch((e) => console.warn('Service worker niet geregistreerd', e));
}

let swReg = null;
// Vraagt de versie rechtstreeks aan de server (zonder cache). Is die nieuwer, dan registreren we de
// service worker met een nieuwe URL, zodat de browser hem zeker opnieuw ophaalt (Safari mist dat anders).
// Geeft de serverversie terug, of null als de server niet bereikbaar is.
export async function checkForUpdate() {
  if (!('serviceWorker' in navigator)) return null;
  const reg = swReg || await navigator.serviceWorker.getRegistration();
  let remote = null;
  try {
    const res = await fetch('js/version.js?check=' + Date.now(), { cache: 'no-store' });
    const m = res.ok && (await res.text()).match(/KEEPER_VERSION\s*=\s*'([^']+)'/);
    remote = m ? m[1] : null;
  } catch { /* offline */ }
  try {
    if (remote && remote !== self.KEEPER_VERSION) {
      swReg = await navigator.serviceWorker.register('sw.js?v=' + encodeURIComponent(remote), { updateViaCache: 'none' });
    } else if (reg) {
      await reg.update();
    }
  } catch { /* offline of geen toegang */ }
  return remote;
}

async function boot() {
  document.addEventListener('pointerdown', unlockAudio, { passive: true });
  $('#version').textContent = 'v' + self.KEEPER_VERSION;
  try {
    await loadAll();
  } catch (e) {
    $('#main').innerHTML = html`<div class="empty"><h2>Opslag niet beschikbaar</h2><p>${e.message}. In een privévenster werkt de opslag niet.</p></div>`.s;
    return;
  }
  applyAppearance();
  requestPersistence();
  // Na per ongeluk sluiten terug naar de veldmodus, dezelfde oefening en timerstand.
  const fs = await getFieldState().catch(() => null);
  if (fs && fs.sessionId && !location.hash.startsWith('#/veld/') && state.sessions.some((s) => s.id === fs.sessionId)) {
    location.replace('#/veld/' + fs.sessionId);
  }
  window.addEventListener('hashchange', route);
  await route();
  registerSW();
  setTimeout(() => { if (!location.hash.startsWith('#/veld/')) maybeRemind(() => { location.hash = '#/instellingen'; }); }, 1500);
}

boot();
