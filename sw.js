const CACHE = 'rechnungapp-v3';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './img/placeholder.svg',
  './icons/icon.svg',
  './js/vendor/qrcode.min.js',
  './js/data.js',
  './js/ui.js',
  './js/page-main.js',
  './js/page-menu.js',
  './js/page-orders.js',
  './js/page-config.js',
  './js/page-qr.js',
  './js/app.js',
];

// Beim ersten Laden alle Assets cachen
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Alte Caches beim Update entfernen
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: zuerst aus dem Cache, sonst Netzwerk
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
