/**
 * Unit tests for the partner-banner block: the Ferrari section on the design
 * system's bd-partner-banner. The fixture is section 6 as authored on /en-us/.
 * The design system modules are replaced by an empty module, so these tests
 * check the markup the block builds, not the components' rendering.
 */
import {
  beforeAll, describe, expect, it, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections,
} from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// every `${base}<module>` the block imports resolves to an empty module: the
// module name lands in a comment after `export {}`
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getDsnBase: vi.fn(() => 'data:text/javascript,export {}//'),
}));

async function renderFixture() {
  const html = await readFile(path.join(__dirname, 'partner-banner.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  // as on the page: decorateButtons turns the bold link into a.button.primary
  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.partner-banner');
  const { default: decorate } = await import('../../../blocks/partner-banner/partner-banner.js');
  await decorate(block);
  return block;
}

describe('partner-banner block', () => {
  let block;
  let banner;

  beforeAll(async () => {
    block = await renderFixture();
    banner = block.querySelector(':scope > bd-partner-banner');
  });

  it('replaces the authored rows with one bd-partner-banner', () => {
    expect(block.children).toHaveLength(1);
    expect(banner).toBeTruthy();
  });

  it('reads the heading, quote, attribution and lead by role', () => {
    expect(banner.getAttribute('heading')).toBe('Trusted by Ferrari as their Exclusive Cybersecurity Partner.');
    expect(banner.getAttribute('as')).toBe('h2');
    expect(banner.getAttribute('quote')).toBe('“I’m proud to have Bitdefender riding with me in 2026.”');
    expect(banner.getAttribute('attribution')).toBe('Lewis Hamilton, Scuderia Ferrari HP Driver');
    expect(banner.getAttribute('lead')).toMatch(/^The same intelligence trusted by Ferrari/);
  });

  it('slots the photo, and the picture beside the heading as the lockup', () => {
    const photo = banner.querySelector(':scope > picture[slot="photo"] img');
    const lockup = banner.querySelector(':scope > picture[slot="lockup"] img');
    expect(photo.getAttribute('src')).toContain('media_128904cd1012fa400a2922b5e441accfa51aec3a7');
    expect(lockup.getAttribute('src')).toContain('media_120424e57c3116faae453028e2872507c0818174b');
  });

  it('makes the bold link the white button and the plain one outline-white', () => {
    const buttons = [...banner.querySelectorAll(':scope > bd-button-link[slot="actions"]')];
    expect(buttons.map((button) => [button.textContent, button.getAttribute('variant')])).toEqual([
      ['Read more', 'white'],
      ['Watch the Ferrari story', 'outline-white'],
    ]);
    expect(buttons[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/ferrari/');
  });
});
