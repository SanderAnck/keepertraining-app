// Service worker: precachet de volledige app-shell (cachenaam bevat de versie), serveert offline en wacht op "vernieuwen".
// Versie van dit bestand: 0.3.1 (moet gelijk zijn aan js/version.js, zodat de browser elke update ziet).
importScripts('js/version.js');

const CACHE = 'keepercoach-' + self.KEEPER_VERSION;

// Elk nieuw bestand hier toevoegen, anders werkt het niet offline (tests/precache.test.js controleert dit).
const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/version.js',
  'js/app.js',
  'js/db.js',
  'js/state.js',
  'js/backup.js',
  'js/ui.js',
  'js/field.js',
  'js/views/common.js',
  'js/views/params.js',
  'js/views/trainingen.js',
  'js/views/training.js',
  'js/views/oefeningen.js',
  'js/views/oefening.js',
  'js/views/keepers.js',
  'js/views/instellingen.js',
  'js/logic/constants.js',
  'js/logic/load.js',
  'js/logic/timer.js',
  'js/logic/session.js',
  'js/logic/library.js',
  'js/logic/backupFormat.js',
  'js/logic/generator.js',
  'js/diagram/render.js',
  'data/exercises.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-64.png'
];

self.addEventListener('install', (event) => {
  // cache: 'reload' omzeilt de HTTP-cache van GitHub Pages, zodat we echt de nieuwe bestanden krijgen.
  event.waitUntil(caches.open(CACHE).then((cache) =>
    cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('keepercoach-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Versiecontrole vanuit de app: altijd naar het netwerk, nooit uit de cache.
  if (url.searchParams.has('check')) { event.respondWith(fetch(req, { cache: 'no-store' })); return; }
  if (req.mode === 'navigate') {
    event.respondWith(caches.match('index.html', { cacheName: CACHE }).then((r) => r || fetch(req)));
    return;
  }
  event.respondWith(caches.match(req, { cacheName: CACHE, ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
