/* eslint-disable no-restricted-globals */
/* A narrow, online-only service worker for the Reverse Phone Lookup PWA. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
