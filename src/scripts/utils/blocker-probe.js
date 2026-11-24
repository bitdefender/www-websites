/*
 * Blocker probe (DEX-29579): measures the share of page views whose browser blocks like
 * uBlock Origin's default lists, with no cookies, storage or third parties.
 *
 * Each probed page view requests two tiny files from our own domain at the same moment. The
 * control path matches no filter list, so it always reaches Cloudflare. The bait path matches
 * EasyPrivacy's generic `/adobe-analytics.js` rule, so uBlock Origin (and Brave, AdGuard or
 * Ghostery with tracker lists) cancels it inside the browser, while EasyList alone, the Adblock
 * Plus default, lets it through. Cloudflare counts both paths, and the blocked share is
 * (control - bait) / control. The page never reads the outcome.
 *
 * tests/scripts/blocker-probe-lists.test.js checks both paths against the live filter lists: when
 * it fails, a list changed and the bait needs a new name.
 */

export const PROBE_CONTROL_PATH = '/_src/scripts/probe/control.js';
export const PROBE_BAIT_PATH = '/_src/scripts/probe/adobe-analytics.js';

const PROBE_REQUEST = {
  // Skips the browser cache, so every probe reaches Cloudflare; Cloudflare still answers from its
  // edge cache. A cache-busting query string would send every probe on to the origin instead.
  cache: 'no-store',
  // The probe sends no cookies, so the two requests carry nothing about the visitor.
  credentials: 'omit',
  // Lets both requests finish when the visitor leaves the page, so neither count loses them.
  keepalive: true,
  priority: 'low',
};

/**
 * Requests the control and bait files together. Fire and forget: a blocked bait rejects inside
 * the browser and is swallowed, so nothing reaches the console or the page.
 */
export default function probeBlocker() {
  [PROBE_CONTROL_PATH, PROBE_BAIT_PATH].forEach((path) => {
    try {
      window.fetch(path, PROBE_REQUEST).catch(() => {});
    } catch { /* fetch unavailable */ }
  });
}
