/**
 * Unit tests for the brand-hero block: the homepage hero, rendered by the design
 * system's bd-hero. The fixture is the block as authored on /en-us/. The design
 * system modules are replaced by an empty module, so these tests check the
 * markup the block builds, not the components' rendering.
 */
import {
  describe, it, expect, beforeAll, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections, decorateIcons,
} from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// every `${base}<module>` the block imports resolves to an empty module: the
// module name lands in a comment after `export {}`
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getDsnBase: vi.fn(() => 'data:text/javascript,export {}//'),
}));

// icons are fetched by decorateIcons, there is no server in tests
global.fetch = vi.fn(async () => ({ ok: false }));

async function renderFixture() {
  const html = await readFile(path.join(__dirname, 'brand-hero.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.brand-hero');
  const { default: decorate } = await import('../../../blocks/brand-hero/brand-hero.js');
  await decorate(block);
  return block;
}

describe('brand-hero block', () => {
  let block;
  let hero;

  beforeAll(async () => {
    block = await renderFixture();
    hero = block.querySelector(':scope > bd-hero');
  });

  it('replaces the authored rows with one bd-hero', () => {
    expect(block.children).toHaveLength(1);
    expect(hero).toBeTruthy();
  });

  it('takes the eyebrow, h1 and lead from the first row', () => {
    // the authored <br> arrives as a newline, which bd-hero renders as a break
    expect(hero.getAttribute('eyebrow')).toBe('25 Years.\nTrusted. Always.');
    expect(hero.getAttribute('heading')).toBe('Cybersecurity for the AI Era.');
    expect(hero.getAttribute('lead')).toMatch(/^Bitdefender protects consumers, .* tested and proven\.$/);
  });

  it('slots the brand sphere as the media', () => {
    const art = hero.querySelector(':scope > bd-motion-art[slot="media"]');
    expect(art?.getAttribute('object')).toBe('brand-surface');
  });

  it('builds an audience card per remaining row, in a three-column grid', () => {
    const grid = hero.querySelector(':scope > bd-grid[slot="cards"]');
    expect(grid.getAttribute('cols')).toBe('1');
    expect(grid.getAttribute('cols-lg')).toBe('3');

    const cards = [...grid.querySelectorAll(':scope > bd-audience-card')];
    expect(cards.map((c) => c.getAttribute('heading'))).toEqual([
      'Protect Your Digital Life',
      'Protect What You’ve Built',
      'Defend Your Organization',
    ]);
    expect(cards.map((c) => c.getAttribute('eyebrow'))).toEqual([
      'For home', 'For small business', 'For enterprise',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      'https://www.bitdefender.com/en-us/consumer/',
      'https://www.bitdefender.com/en-us/small-business/',
      'https://www.bitdefender.com/en-us/business/',
    ]);
    expect(cards[0].getAttribute('label')).toBe('For home');
    expect(cards[0].getAttribute('description')).toMatch(/^AI-powered protection against scams/);
  });

  it('draws the authored audience icons with the design system icons', () => {
    const icons = [...hero.querySelectorAll('bd-audience-card > [slot="icon"]')];
    expect(icons.map((i) => i.tagName.toLowerCase())).toEqual([
      'bd-home-icon', 'bd-small-business-icon', 'bd-enterprise-icon',
    ]);
  });
});
