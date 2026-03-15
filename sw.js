const CACHE_NAME = 'rememberme-v2';
const URLS_TO_CACHE = [
  '/rememberme/RememberMe.html',
  '/rememberme/manifest.webmanifest',
  '/rememberme/icons/icon-192.png',
  '/rememberme/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // AI API 요청은 캐시하지 않음
  if (event.request.url.includes('api.anthropic.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
