import {
  loadCSS,
} from '../../lib-franklin.js';

const PWA_HEADER_STYLE_ID = 'pwa-header-styles';
const PWA_SHELL_CLASS = 'pwa-shell';
const PWA_COLLAPSED_CLASS = 'pwa-shell-collapsed';
const PWA_HEADER_COLLAPSE_KEY = 'bd-pwa-nav-collapsed-v1';
const PWA_DESKTOP_MEDIA_QUERY = '(min-width: 992px)';

const PWA_ACTIONS = [
  {
    id: 'home',
    label: 'Home',
    href: '/en-us/consumer/free-tools',
  },
  {
    id: 'link-checker',
    label: 'Link Checker',
    href: '/en-us/consumer/link-checker',
  },
  {
    id: 'password-generator',
    label: 'Password Generator',
    href: '/en-us/consumer/password-generator',
  },
  {
    id: 'refresh',
    label: 'Refresh',
    action: 'refresh',
  },
];

function normalizePath(pathname) {
  return pathname.replace(/\/$/, '');
}

function ensurePWAHeaderStyles() {
  if (document.getElementById(PWA_HEADER_STYLE_ID)) {
    return;
  }

  loadCSS(`${window.hlx.codeBasePath}/scripts/utils/pwa/pwa-header.css`);
}

function isDesktopViewport() {
  return window.matchMedia(PWA_DESKTOP_MEDIA_QUERY).matches;
}

function getStoredCollapsedState() {
  try {
    return window.localStorage.getItem(PWA_HEADER_COLLAPSE_KEY) === 'true';
  } catch {
    return false;
  }
}

function storeCollapsedState(isCollapsed) {
  try {
    window.localStorage.setItem(PWA_HEADER_COLLAPSE_KEY, String(isCollapsed));
  } catch {
    // No-op when storage is unavailable.
  }
}

function updateShellClasses(isCollapsed) {
  document.body.classList.add(PWA_SHELL_CLASS);
  document.body.classList.toggle(PWA_COLLAPSED_CLASS, isCollapsed && isDesktopViewport());
}

function getIsActiveAction(action, currentPath) {
  if (!action.href) {
    return false;
  }

  if (action.href === '/en-us/consumer/free-tools') {
    return currentPath === '/en-us/consumer/free-tools' || currentPath === '/en-us/consumer/free-tools/';
  }

  return normalizePath(action.href) === currentPath;
}

function createPWAActionElement(action, currentPath) {
  const isActive = getIsActiveAction(action, currentPath);
  const element = action.action === 'refresh'
    ? document.createElement('button')
    : document.createElement('a');

  if (action.action === 'refresh') {
    element.type = 'button';
    element.addEventListener('click', () => window.location.reload());
  } else {
    element.href = action.href;
  }

  element.className = 'pwa-app-nav__action';
  element.setAttribute('aria-label', action.label);
  if (isActive) {
    element.setAttribute('aria-current', 'page');
  }

  const label = document.createElement('span');
  label.className = 'pwa-app-nav__label';
  label.textContent = action.label;
  element.append(label);

  return element;
}

function createCollapseToggle(initialCollapsed) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'pwa-app-nav__toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation rail');
  toggle.setAttribute('aria-expanded', String(!initialCollapsed));
  toggle.textContent = initialCollapsed ? 'Expand' : 'Collapse';
  return toggle;
}

export default function mountPWAHeader(header) {
  if (!header) {
    return;
  }

  ensurePWAHeaderStyles();

  const currentPath = normalizePath(window.location.pathname);
  const initialCollapsed = getStoredCollapsedState();

  header.textContent = '';
  header.classList.add('pwa-header-mounted');

  const nav = document.createElement('nav');
  nav.className = 'pwa-app-nav';
  nav.setAttribute('aria-label', 'PWA navigation');

  const toggle = createCollapseToggle(initialCollapsed);
  const actionsList = document.createElement('ul');
  actionsList.className = 'pwa-app-nav__list';

  PWA_ACTIONS.forEach((action) => {
    const item = document.createElement('li');
    item.className = 'pwa-app-nav__item';
    item.append(createPWAActionElement(action, currentPath));
    actionsList.append(item);
  });

  nav.append(toggle, actionsList);
  header.append(nav);

  const syncCollapsedState = (isCollapsed) => {
    updateShellClasses(isCollapsed);
    toggle.setAttribute('aria-expanded', String(!isCollapsed));
    toggle.textContent = isCollapsed ? 'Expand' : 'Collapse';
    storeCollapsedState(isCollapsed);
  };

  syncCollapsedState(initialCollapsed);

  toggle.addEventListener('click', () => {
    const isCollapsed = !document.body.classList.contains(PWA_COLLAPSED_CLASS);
    syncCollapsedState(isCollapsed);
  });

  if (!window.BD_PWA_HEADER_RESIZE_BOUND) {
    window.BD_PWA_HEADER_RESIZE_BOUND = true;
    window.addEventListener('resize', () => {
      const isCollapsed = getStoredCollapsedState();
      updateShellClasses(isCollapsed);
    });
  }
}
