/**
 * Unit tests for the awards-spotlight block: the Proven section's carousel on
 * the design system's bd-awards-spotlight, under the section header, with the
 * section's two button links as primary bd-button-links. The fixture is
 * section 5 as authored on /en-us/. The design system modules are replaced by
 * an empty module, so these tests check the markup the block builds, not the
 * components' rendering.
 */
import {
  afterAll, beforeAll, describe, expect, it, vi,
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
  const html = await readFile(path.join(__dirname, 'awards-spotlight.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.awards-spotlight');
  const { default: decorate } = await import('../../../blocks/awards-spotlight/awards-spotlight.js');
  await decorate(block);
  return block;
}

describe('awards-spotlight block', () => {
  let block;
  let section;
  let spotlight;

  beforeAll(async () => {
    // liftSectionHeader imports from esm.sh, which a test cannot reach
    vi.spyOn(console, 'warn').mockImplementation(() => { });
    block = await renderFixture();
    section = block.closest('.section');
    spotlight = block.querySelector(':scope > bd-awards-spotlight');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('replaces the authored rows with one autoplaying bd-awards-spotlight', () => {
    expect(block.children).toHaveLength(1);
    expect(spotlight.hasAttribute('autoplay')).toBe(true);
  });

  it('builds an award per row: title, body and its mark at the drawn size', () => {
    expect(spotlight.awards.map((award) => award.title)).toEqual([
      'A Visionary',
      'Among PCMag’s 25 Best Tech Brands for 2026',
      'A Major Player in MDR',
      'Leadership in Best Protection & Performance',
      'An industry record for cybersecurity Product of the Year',
    ]);
    const [gartner] = spotlight.awards;
    expect(gartner.body).toMatch(/^Bitdefender received a dual recognition from Gartner/);
    expect(gartner.logo).toContain('media_1e3210734fd12b3efe349f02aa23bbc7476b2bf79');
    // exported at 240 x 202, drawn at 160 wide
    expect([gartner.logoWidth, gartner.logoHeight]).toEqual([160, 135]);
  });

  it('lifts the section header, centred as every frame draws it', () => {
    const header = section.querySelector(':scope > bd-section > .default-content-wrapper > bd-section-header');
    expect(header.getAttribute('layout')).toBe('centered');
    expect(header.getAttribute('heading')).toBe('Proven by Independent Testing and Industry Analysts');
    expect(header.querySelector('[slot="lead"]').textContent).toMatch(/^Independent analysts/);
  });

  it('turns the section button links into primary DS buttons under the header', () => {
    const wrapper = section.querySelector(':scope > bd-section > .default-content-wrapper');
    const actions = wrapper.querySelector(':scope > bd-section-header + .awards-spotlight-actions');
    const buttons = [...actions.querySelectorAll('bd-button-link')];
    expect(buttons.map((button) => [button.textContent, button.getAttribute('variant')])).toEqual([
      ['Consumer Recognition', 'primary'],
      ['Enterprise Recognition', 'primary'],
    ]);
    expect(buttons[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/awards/');
    expect(wrapper.querySelector('.button-container')).toBeNull();
  });
});
