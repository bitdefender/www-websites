import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  PWA_SCOPE,
  PWA_ROUTES,
  consumeInstallSession,
  getPlatformVariant,
  isEligibleRoute,
  isStandalonePWA,
  initializeReversePhoneLookupPWA,
  startInstallCooldown,
} from '../../scripts/utils/pwa/pwa.js';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDirectory, '../../..');
const manifest = readFileSync(path.join(root, 'pwa.webmanifest'), 'utf8');
const serviceWorker = readFileSync(path.join(root, 'pwa-sw.js'), 'utf8');

describe('Reverse Phone Lookup PWA route and display gating', () => {
  it('keeps the manifest and worker limited to the online PWA scope', () => {
    const parsedManifest = JSON.parse(manifest);
    expect(parsedManifest.scope).toBe(PWA_SCOPE);
    expect(parsedManifest.start_url).toBe(`${PWA_SCOPE}?mode=PWA`);
    expect(parsedManifest.icons).toHaveLength(3);
    expect(serviceWorker).not.toMatch(/fetch|caches|workbox/i);
  });

  it('includes the base and verdict routes, but no other consumer route', () => {
    expect(PWA_ROUTES).toEqual([
      PWA_SCOPE,
      `${PWA_SCOPE}/might-be-safe`,
      `${PWA_SCOPE}/marked-as-spam-or-scam`,
    ]);
    expect(isEligibleRoute(PWA_SCOPE)).toBe(true);
    expect(isEligibleRoute(`${PWA_SCOPE}/`)).toBe(true);
    expect(isEligibleRoute(`${PWA_SCOPE}/might-be-safe`)).toBe(true);
    expect(isEligibleRoute(`${PWA_SCOPE}/marked-as-spam-or-scam/`)).toBe(true);
    expect(isEligibleRoute('/en-us/consumer/free-tools')).toBe(false);
  });

  it('adds mode=PWA to standalone eligible route URLs', () => {
    const originalPath = window.location.pathname;
    const originalSearch = window.location.search;
    const originalMatchMedia = window.matchMedia;
    window.history.replaceState({}, '', `${PWA_SCOPE}/might-be-safe?cid=test`);
    window.matchMedia = () => ({ matches: true });
    document.body.replaceChildren();

    initializeReversePhoneLookupPWA(document, window);

    expect(window.location.pathname).toBe(`${PWA_SCOPE}/might-be-safe`);
    expect(window.location.search).toBe('?cid=test&mode=PWA');

    window.history.replaceState({}, '', `${originalPath}${originalSearch}`);
    window.matchMedia = originalMatchMedia;
  });

  it('detects standalone mode through display-mode and Apple standalone', () => {
    expect(isStandalonePWA({
      navigator: {},
      matchMedia: () => ({ matches: true }),
    })).toBe(true);
    expect(isStandalonePWA({
      navigator: { standalone: true },
      matchMedia: () => ({ matches: false }),
    })).toBe(true);
    expect(isStandalonePWA({
      navigator: {},
      matchMedia: () => ({ matches: false }),
    })).toBe(false);
  });

  it('selects the iOS Safari instructional variant only for Apple Safari', () => {
    expect(getPlatformVariant({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    })).toBe('ios');
    expect(getPlatformVariant({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120.0 Mobile/15E148 Safari/604.1',
    })).toBe('chromium');
  });

  it('captures beforeinstallprompt, prevents the browser default, and consumes it on Install', async () => {
    const originalPath = window.location.pathname;
    const originalMatchMedia = window.matchMedia;
    window.history.replaceState({}, '', PWA_SCOPE);
    window.matchMedia = () => ({ matches: false });
    document.body.replaceChildren();
    localStorage.clear();
    sessionStorage.clear();
    initializeReversePhoneLookupPWA(document, window);
    const prevented = vi.fn();
    const prompt = vi.fn();
    const beforeInstallPrompt = new Event('beforeinstallprompt');
    beforeInstallPrompt.preventDefault = prevented;
    beforeInstallPrompt.prompt = prompt;
    beforeInstallPrompt.userChoice = Promise.resolve({ outcome: 'accepted' });
    window.dispatchEvent(beforeInstallPrompt);
    const install = document.querySelector('.bd-rpl-pwa-install__button');
    expect(prevented).toHaveBeenCalledTimes(1);
    expect(install).not.toBeNull();
    install.focus();
    expect(document.activeElement).toBe(install);
    install.click();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(document.getElementById('bd-rpl-pwa-install').hidden).toBe(true);
    expect(document.activeElement).not.toBe(install);
    expect(document.getElementById('bd-rpl-pwa-install').hasAttribute('aria-hidden')).toBe(false);
    window.history.replaceState({}, '', originalPath);
    window.matchMedia = originalMatchMedia;
    localStorage.clear();
    sessionStorage.clear();
  });

  it('shows the install banner without consent infrastructure', () => {
    const originalPath = window.location.pathname;
    const originalMatchMedia = window.matchMedia;
    const originalDataLayer = window.adobeDataLayer;
    window.history.replaceState({}, '', PWA_SCOPE);
    window.matchMedia = () => ({ matches: false });
    window.adobeDataLayer = undefined;
    document.body.replaceChildren();
    localStorage.clear();
    sessionStorage.clear();
    initializeReversePhoneLookupPWA(document, window);

    const beforeInstallPrompt = new Event('beforeinstallprompt');
    beforeInstallPrompt.prompt = vi.fn();
    beforeInstallPrompt.userChoice = Promise.resolve({ outcome: 'accepted' });
    window.dispatchEvent(beforeInstallPrompt);
    expect(document.getElementById('bd-rpl-pwa-install')).not.toBeNull();

    window.history.replaceState({}, '', originalPath);
    window.matchMedia = originalMatchMedia;
    window.adobeDataLayer = originalDataLayer;
    localStorage.clear();
    sessionStorage.clear();
  });
});

describe('Reverse Phone Lookup PWA install cooldown', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('consumes one hidden session at most once per tab session', () => {
    localStorage.setItem('bd-rpl-pwa-install-cooldown', '2');
    expect(consumeInstallSession(window)).toBe(1);
    expect(consumeInstallSession(window)).toBe(1);
    sessionStorage.clear();
    expect(consumeInstallSession(window)).toBe(0);
  });

  it('resets the remaining hidden sessions after a dismissal', () => {
    startInstallCooldown(window);
    expect(localStorage.getItem('bd-rpl-pwa-install-cooldown')).toBe('2');
    sessionStorage.clear();
    expect(consumeInstallSession(window)).toBe(1);
    sessionStorage.clear();
    expect(consumeInstallSession(window)).toBe(0);
  });
});
