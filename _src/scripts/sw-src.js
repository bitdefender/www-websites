/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */

import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

const VERSION = 'bd-tools-v1';
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;
const IMAGE_CACHE = `${VERSION}-images`;

const TOOL_PAGES = [
  '/en-us/consumer/link-checker',
  '/en-us/consumer/password-generator',
];

const OFFLINE_FALLBACK = '/pwa-offline.html';

self.skipWaiting();
clientsClaim();

const navigationStrategy = new NetworkFirst({
  cacheName: PAGE_CACHE,
  networkTimeoutSeconds: 4,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll([...TOOL_PAGES, OFFLINE_FALLBACK])),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => ![PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE].includes(key))
        .map((key) => caches.delete(key)),
    )),
  );
});

registerRoute(
  new NavigationRoute(async (context) => {
    try {
      return await navigationStrategy.handle(context);
    } catch {
      const requestPath = new URL(context.request.url).pathname.replace(/\/$/, '');
      const cachedPage = await caches.match(context.request);
      if (cachedPage) {
        return cachedPage;
      }

      if (TOOL_PAGES.includes(requestPath)) {
        const fallbackToolPage = await caches.match(TOOL_PAGES[0]);
        if (fallbackToolPage) {
          return fallbackToolPage;
        }
      }

      return caches.match(OFFLINE_FALLBACK);
    }
  }),
);

registerRoute(
  ({ request, url }) => url.origin === self.location.origin && ['script', 'style', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: ASSET_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ request, url }) => url.origin === self.location.origin && request.destination === 'image',
  new CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 60 * 24 * 60 * 60,
      }),
    ],
  }),
);
