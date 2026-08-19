import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { AdobeDataLayerService } from '@repobit/dex-data-layer';
import {
  PWA_SCOPE,
  PWA_ROUTES,
  PWA_ASSET_IDS,
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
    expect(parsedManifest.start_url).toBe(PWA_SCOPE);
    expect(parsedManifest.icons).toHaveLength(3);
    expect(serviceWorker).not.toMatch(/fetch|caches|workbox/i);
  });

  it('exposes the stable analytics asset IDs', () => {
    expect(Object.values(PWA_ASSET_IDS)).toEqual([
      'rpl-pwa-install-banner-shown',
      'rpl-pwa-install-banner-dismissed',
      'rpl-pwa-install-prompt-accepted',
      'rpl-pwa-install-prompt-dismissed',
      'rpl-pwa-app-installed',
      'rpl-pwa-app-opened',
    ]);
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

  it('offers notifications on the second standalone session and only after clicking Enable', () => {
    const push = vi.spyOn(AdobeDataLayerService, 'push').mockImplementation(() => {});
    const originalPath = window.location.pathname;
    const originalMatchMedia = window.matchMedia;
    const originalNotification = window.Notification;
    window.history.replaceState({}, '', PWA_SCOPE);
    window.matchMedia = () => ({ matches: true });
    window.Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    };
    document.body.replaceChildren(document.createElement('header'));
    initializeReversePhoneLookupPWA(document, window);
    expect(document.querySelector('header').style.display).toBe('none');
    expect(document.getElementById('bd-rpl-pwa-notifications')).toBeNull();
    sessionStorage.clear();
    initializeReversePhoneLookupPWA(document, window);
    const enable = document.querySelector('.bd-rpl-pwa-notifications__button');
    expect(enable).not.toBeNull();
    expect(window.Notification.requestPermission).not.toHaveBeenCalled();
    enable.click();
    expect(window.Notification.requestPermission).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalled();
    push.mockRestore();
    window.history.replaceState({}, '', originalPath);
    window.matchMedia = originalMatchMedia;
    window.Notification = originalNotification;
  });

  it('captures beforeinstallprompt, prevents the browser default, and consumes it on Install', async () => {
    const originalPath = window.location.pathname;
    const originalMatchMedia = window.matchMedia;
    window.history.replaceState({}, '', PWA_SCOPE);
    window.matchMedia = () => ({ matches: false });
    window.adobeDataLayer = { getState: () => true, push: vi.fn() };
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
    install.click();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(document.getElementById('bd-rpl-pwa-install').hidden).toBe(true);
    window.history.replaceState({}, '', originalPath);
    window.matchMedia = originalMatchMedia;
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
