/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

const VERSION = 'bd-tools-v1';
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;

const TOOL_PAGES = [
  '/en-us/consumer/link-checker',
  '/en-us/consumer/password-generator',
];

const OFFLINE_FALLBACK = '/pwa-offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll([...TOOL_PAGES, OFFLINE_FALLBACK]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => ![PAGE_CACHE, ASSET_CACHE].includes(key))
        .map((key) => caches.delete(key)),
    )).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }

          if (TOOL_PAGES.includes(url.pathname.replace(/\/$/, ''))) {
            const fallbackToolPage = await caches.match(TOOL_PAGES[0]);
            if (fallbackToolPage) {
              return fallbackToolPage;
            }
          }

          return caches.match(OFFLINE_FALLBACK);
        }),
    );
    return;
  }

  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put(request, responseClone));
          return response;
        });
      }),
    );
  }
});
