const PWA_ENABLED_PATHS = [
  '/en-us/consumer/link-checker',
  '/en-us/consumer/password-generator',
];

export function isPWAEnabledPage(pathname) {
  const normalizedPath = pathname.replace(/\/$/, '');
  return PWA_ENABLED_PATHS.includes(normalizedPath);
}

export function isStandalonePWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
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
