// @vitest-environment node
/*
 * Checks the blocker probe against the filter lists real browsers download, fetched at run time
 * so a list change shows up here. When a list can't be fetched the tests skip instead of failing.
 */
import {
  describe, it, expect, beforeAll,
} from 'vitest';
import { FiltersEngine, Request } from '@ghostery/adblocker';
import { PROBE_BAIT_PATH, PROBE_CONTROL_PATH } from '../../scripts/utils/blocker-probe.js';

const UBO_ASSETS = 'https://ublockorigin.github.io/uAssets/filters';
const EASYLIST = 'https://easylist.to/easylist/easylist.txt';

// uBlock Origin's lists enabled by default
const UBO_DEFAULT_LISTS = [
  EASYLIST,
  'https://easylist.to/easylist/easyprivacy.txt',
  `${UBO_ASSETS}/filters.txt`,
  `${UBO_ASSETS}/privacy.txt`,
  `${UBO_ASSETS}/badware.txt`,
  `${UBO_ASSETS}/unbreak.txt`,
  `${UBO_ASSETS}/quick-fixes.txt`,
  'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0&mimetype=plaintext',
];

const ORIGIN = 'https://www.bitdefender.com';
const PAGE = `${ORIGIN}/en-us/consumer/total-security`;

// The probe's own code has to load for the probe to run at all
const PROBE_SCRIPTS = ['/_src/scripts/delayed.js', '/_src/scripts/utils/blocker-probe.js'];

let engines;

const blocks = (engine, path) => engine.match(Request.fromRawDetails({
  url: `${ORIGIN}${path}`,
  sourceUrl: PAGE,
  type: 'xmlhttprequest',
})).match;

beforeAll(async () => {
  try {
    const lists = Object.fromEntries(await Promise.all(UBO_DEFAULT_LISTS.map(async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
      return [url, await response.text()];
    })));
    engines = {
      uboDefaults: FiltersEngine.parse(Object.values(lists).join('\n')),
      easyListOnly: FiltersEngine.parse(lists[EASYLIST]),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Skipping the filter list checks, a list could not be fetched: ${error.message}`);
  }
}, 60000);

describe('blocker probe against the live filter lists', () => {
  it('uBlock Origin defaults block the bait', (context) => {
    if (!engines) context.skip();
    expect(blocks(engines.uboDefaults, PROBE_BAIT_PATH)).toBe(true);
  });

  it('uBlock Origin defaults let the control and the probe scripts through', (context) => {
    if (!engines) context.skip();
    [PROBE_CONTROL_PATH, ...PROBE_SCRIPTS].forEach((path) => {
      expect(blocks(engines.uboDefaults, path), path).toBe(false);
    });
  });

  it('EasyList alone, the Adblock Plus default, lets the bait through', (context) => {
    if (!engines) context.skip();
    expect(blocks(engines.easyListOnly, PROBE_BAIT_PATH)).toBe(false);
  });
});
