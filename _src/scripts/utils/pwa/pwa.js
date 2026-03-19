const PWA_ENABLED_PATHS = [
  '/en-us/consumer/link-checker',
  '/en-us/consumer/password-generator',
];
const PWA_MANIFEST_PATH = '/manifest.webmanifest';
const PWA_MANIFEST_LINK_ID = 'pwa-manifest-link';

export function isPWAEnabledPage(pathname) {
  const normalizedPath = pathname.replace(/\/$/, '');
  return PWA_ENABLED_PATHS.includes(normalizedPath);
}

export function isStandalonePWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
}

export function syncPWAManifestExposure() {
  const pageIsPWAEnabled = isPWAEnabledPage(window.location.pathname);

  const existingDynamicLink = document.getElementById(PWA_MANIFEST_LINK_ID);
  if (!pageIsPWAEnabled) {
    existingDynamicLink?.remove();
    return;
  }

  if (existingDynamicLink) {
    existingDynamicLink.setAttribute('href', PWA_MANIFEST_PATH);
    return;
  }

  const manifestLink = document.createElement('link');
  manifestLink.id = PWA_MANIFEST_LINK_ID;
  manifestLink.setAttribute('rel', 'manifest');
  manifestLink.setAttribute('href', PWA_MANIFEST_PATH);
  document.head.append(manifestLink);
}

export async function registerPWA() {
  if (!('serviceWorker' in navigator) || !isPWAEnabledPage(window.location.pathname)) {
    return;
  }

  try {
    // Keep the initial rollout limited to the consumer tools section.
    await navigator.serviceWorker.register('/sw.js', { scope: '/en-us/consumer/' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PWA service worker registration failed:', error);
  }
}
