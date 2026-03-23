const PWA_ENABLED_PATHS = [
  '/en-us/consumer/free-tools',
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

export function getPWADisplayMode() {
  if (document.referrer.startsWith('android-app://')) return 'twa';
  if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: window-controls-overlay)').matches) return 'window-controls-overlay';

  return 'unknown';
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

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing on mobile.
    event.preventDefault();
    console.log('👍', 'beforeinstallprompt', event);
    // Stash the event so it can be triggered later.
    window.deferredPrompt = event;

    const { firstChild } = document.querySelector('main');
    const divInstall = document.createElement('div');
    divInstall.id = 'pwa-install-container';
    divInstall.className = 'hidden';
    divInstall.innerHTML = `
      <button id="pwa-install-button" type="button">Install App</button>
    `;

    firstChild.before(divInstall);
    // Remove the 'hidden' class from the install button container.
    divInstall.classList.toggle('hidden', false);

    const butInstall = document.getElementById('pwa-install-button');
    butInstall.addEventListener('click', async () => {
      console.log('👍', 'butInstall-clicked');
      const promptEvent = window.deferredPrompt;
      if (!promptEvent) {
        // The deferred prompt isn't available.
        return;
      }
      // Show the install prompt.
      promptEvent.prompt();
      // Log the result
      const result = await promptEvent.userChoice;
      console.log('👍', 'userChoice', result);
      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
      window.deferredPrompt = null;
      // Hide the install button.
      divInstall.classList.toggle('hidden', true);
    });
  });

  window.addEventListener('appinstalled', async (event) => {
    console.log('👍', 'appinstalled', event);
    // Clear the deferredPrompt so it can be garbage collected
    window.deferredPrompt = null;
    const { default: mountPWAHeader } = await import('./pwa-header.js');
    const header = document.querySelector('header');
    mountPWAHeader(header);
  });
}
