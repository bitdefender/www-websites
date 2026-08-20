export const PWA_SCOPE = '/en-us/consumer/reverse-phone-lookup';
export const PWA_ROUTES = [
  PWA_SCOPE,
  `${PWA_SCOPE}/might-be-safe`,
  `${PWA_SCOPE}/marked-as-spam-or-scam`,
];

const MANIFEST_PATH = '/pwa.webmanifest';
const SERVICE_WORKER_PATH = '/pwa-sw.js';
const INSTALL_ID = 'bd-rpl-pwa-install';
const COOLDOWN_KEY = 'bd-rpl-pwa-install-cooldown';
const SESSION_KEY = 'bd-rpl-pwa-install-session';
const LOGO_PATH = '/_src/icons/b-logo-red.svg';
const PWA_MODE_PARAM = 'mode';
const PWA_MODE_VALUE = 'PWA';
let inMemoryCooldown = 0;

const safeStorage = (storage) => {
  try {
    const key = '__bd_rpl_pwa_storage_test__';
    storage.setItem(key, '1');
    storage.removeItem(key);
    return storage;
  } catch {
    return null;
  }
};

const getStorage = (win, type) => {
  try {
    return safeStorage(win[type]);
  } catch {
    return null;
  }
};

export function normalizeRoute(pathname = '') {
  const route = pathname.replace(/\/$/, '');
  return route || '/';
}

export function isEligibleRoute(pathname = '') {
  return PWA_ROUTES.includes(normalizeRoute(pathname));
}

export function isStandalonePWA(win = window) {
  const mediaQuery = typeof win.matchMedia === 'function'
    ? win.matchMedia('(display-mode: standalone)').matches
    : false;
  return mediaQuery || win.navigator?.standalone === true;
}

export function getPlatformVariant(navigatorObject = window.navigator) {
  const userAgent = navigatorObject?.userAgent || '';
  const isAppleTouch = /iPhone|iPad|iPod/.test(userAgent)
    || (navigatorObject?.platform === 'MacIntel' && navigatorObject?.maxTouchPoints > 1);
  const isSafari = /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  return isAppleTouch && isSafari ? 'ios' : 'chromium';
}

function setHidden(element, hidden) {
  element.hidden = hidden;
  element.setAttribute('aria-hidden', String(hidden));
  element.inert = hidden;
}

export function consumeInstallSession(win = window) {
  const sessionStorage = getStorage(win, 'sessionStorage');
  const localStorage = getStorage(win, 'localStorage');
  if (!sessionStorage && !localStorage && inMemoryCooldown > 0) return inMemoryCooldown;
  if (sessionStorage?.getItem(SESSION_KEY) === '1') return Number(localStorage?.getItem(COOLDOWN_KEY) || 0);

  sessionStorage?.setItem(SESSION_KEY, '1');
  const remaining = Math.max(0, Number(localStorage?.getItem(COOLDOWN_KEY) || 0) - 1);
  if (localStorage) localStorage.setItem(COOLDOWN_KEY, String(remaining));
  else if (!sessionStorage) inMemoryCooldown = remaining;
  return remaining;
}

export function startInstallCooldown(win = window) {
  const localStorage = getStorage(win, 'localStorage');
  const sessionStorage = getStorage(win, 'sessionStorage');
  if (localStorage) localStorage.setItem(COOLDOWN_KEY, '2');
  else sessionStorage?.setItem(COOLDOWN_KEY, '2');
  if (!localStorage && !sessionStorage) inMemoryCooldown = 2;
}

function canShowInstall(win) {
  const localStorage = getStorage(win, 'localStorage');
  const sessionStorage = getStorage(win, 'sessionStorage');
  if (!localStorage && !sessionStorage && inMemoryCooldown > 0) return false;
  const remaining = Number(
    localStorage?.getItem(COOLDOWN_KEY) || sessionStorage?.getItem(COOLDOWN_KEY) || 0,
  );
  return remaining === 0;
}

function addMetadata(doc) {
  if (!doc.head.querySelector('#bd-rpl-pwa-manifest')) {
    const manifest = doc.createElement('link');
    manifest.id = 'bd-rpl-pwa-manifest';
    manifest.rel = 'manifest';
    manifest.href = MANIFEST_PATH;
    doc.head.append(manifest);
  }
  if (!doc.head.querySelector('#bd-rpl-pwa-apple-icon')) {
    const appleIcon = doc.createElement('link');
    appleIcon.id = 'bd-rpl-pwa-apple-icon';
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.sizes = '180x180';
    appleIcon.href = '/_src/icons/apple-icon-180x180.png';
    doc.head.append(appleIcon);
  }
  if (!doc.head.querySelector('#bd-rpl-pwa-theme-color')) {
    const theme = doc.createElement('meta');
    theme.id = 'bd-rpl-pwa-theme-color';
    theme.name = 'theme-color';
    theme.content = '#ed1c24';
    doc.head.append(theme);
  }
  if (!doc.head.querySelector('#bd-rpl-pwa-mobile-web-app')) {
    const appleMeta = doc.createElement('meta');
    appleMeta.id = 'bd-rpl-pwa-mobile-web-app';
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    doc.head.append(appleMeta);
  }
}

function makeButton(doc, label, className) {
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  return button;
}

function createInstallBanner(doc, variant, deferredPrompt, win) {
  const existing = doc.getElementById(INSTALL_ID);
  if (existing) return existing;

  const banner = doc.createElement('aside');
  banner.id = INSTALL_ID;
  banner.className = `bd-rpl-pwa-install bd-rpl-pwa-install--${variant}`;
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Install Phone Lookup');
  setHidden(banner, true);

  const logo = doc.createElement('img');
  logo.className = 'bd-rpl-pwa-install__logo';
  logo.src = LOGO_PATH;
  logo.alt = 'Bitdefender';
  logo.width = 40;
  logo.height = 40;
  const topRow = doc.createElement('div');
  topRow.className = 'bd-rpl-pwa-install__toprow';
  topRow.append(logo);

  const content = doc.createElement('div');
  content.className = 'bd-rpl-pwa-install__content';
  const text = doc.createElement('div');
  text.className = 'bd-rpl-pwa-install__text';
  const title = doc.createElement('strong');
  title.className = 'bd-rpl-pwa-install__title';
  title.textContent = 'Install Phone Lookup';
  text.append(title);
  if (variant === 'ios') {
    const instructions = doc.createElement('p');
    instructions.className = 'bd-rpl-pwa-install__ios';
    instructions.textContent = 'Tap ••• near address bar → Share → More → Add to Home Screen → Add';
    text.append(instructions);
    content.append(text);
  } else {
    const subtitle = doc.createElement('p');
    subtitle.className = 'bd-rpl-pwa-install__subtitle';
    subtitle.textContent = win.innerWidth >= 900
      ? 'Quick access to this page, one click away'
      : 'Quick access to this page, one tap away';
    text.append(subtitle);
    content.append(text);
    const install = makeButton(doc, 'Install', 'bd-rpl-pwa-install__button');
    install.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome !== 'accepted') startInstallCooldown(win);
      setHidden(banner, true);
      win.bdRplDeferredPrompt = null;
    });
    content.append(install);
  }
  const close = makeButton(doc, '×', 'bd-rpl-pwa-install__close');
  close.setAttribute('aria-label', 'Close install prompt');
  close.addEventListener('click', () => {
    startInstallCooldown(win);
    setHidden(banner, true);
  });
  topRow.append(close);
  banner.append(topRow, content);
  doc.body.append(banner);
  return banner;
}

function showInstallBanner(doc, variant, deferredPrompt, win) {
  if (isStandalonePWA(win) || !canShowInstall(win)) return;
  const banner = createInstallBanner(doc, variant, deferredPrompt, win);
  if (!banner.hidden) return;
  setHidden(banner, false);
}

function ensurePwaModeParameter(win) {
  const url = new URL(win.location.href);
  if (url.searchParams.get(PWA_MODE_PARAM) === PWA_MODE_VALUE) return;
  url.searchParams.set(PWA_MODE_PARAM, PWA_MODE_VALUE);
  win.history.replaceState(win.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export function initializeReversePhoneLookupPWA(doc = document, win = window) {
  if (!isEligibleRoute(win.location.pathname)) return false;
  const standalone = isStandalonePWA(win);
  if (standalone) ensurePwaModeParameter(win);
  addMetadata(doc);
  doc.body?.classList.toggle('bd-rpl-pwa-standalone', standalone);
  if (standalone) {
    const header = doc.querySelector('header');
    if (header) header.style.display = 'none';
  }

  if (win.navigator?.serviceWorker) {
    // eslint-disable-next-line max-len
    win.navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: PWA_SCOPE }).catch(() => { });
  }

  const style = doc.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/_src/scripts/utils/pwa/pwa.css';
  doc.head.append(style);

  if (standalone) return true;
  const sessionCooldown = consumeInstallSession(win);
  const variant = getPlatformVariant(win.navigator);
  let deferredPrompt = null;
  const reveal = () => {
    if (sessionCooldown > 0) return;
    showInstallBanner(doc, variant, deferredPrompt, win);
  };

  if (variant === 'ios') {
    win.setTimeout(reveal, 0);
  }
  win.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    win.bdRplDeferredPrompt = event;
    reveal();
  });
  win.addEventListener('appinstalled', () => {
    const banner = doc.getElementById(INSTALL_ID);
    if (banner) setHidden(banner, true);
    deferredPrompt = null;
    win.bdRplDeferredPrompt = null;
  });
  return true;
}
