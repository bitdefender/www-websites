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

// icons are fetched by decorateIcons, there is no server in tests
global.fetch = vi.fn(async () => ({ ok: false }));

// what a component's named slot holds, among its own children
const inSlot = (host, slot) => host.querySelector(`:scope > [slot="${slot}"]`);

async function renderFixture(prepare = () => {}) {
  const html = await readFile(path.join(__dirname, 'brand-hero.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');
  prepare(main);

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
    // the authored <br> stays a line break in the slotted eyebrow
    const eyebrow = inSlot(hero, 'eyebrow');
    expect(eyebrow.localName).toBe('span');
    expect(eyebrow.innerHTML).toBe('25 Years.<br>Trusted. Always.');
    const title = inSlot(hero, 'title');
    expect(title.localName).toBe('bd-h');
    expect(title.getAttribute('as')).toBe('h1');
    expect(title.textContent).toBe('Cybersecurity for the AI Era.');
    const lead = inSlot(hero, 'description');
    expect(lead.localName).toBe('bd-p');
    expect(lead.textContent).toMatch(/^Bitdefender protects consumers, .* tested and proven\.$/);
  });

  it('keeps only the inset below the hero on its section', () => {
    const section = block.closest('bd-section');
    expect(section.hasAttribute('without-padding-top')).toBe(true);
    expect(section.hasAttribute('without-padding-bottom')).toBe(false);
  });

  it('slots the brand sphere as the media', () => {
    const art = hero.querySelector(':scope > bd-motion-art[slot="media"]');
    expect(art?.getAttribute('object')).toBe('brand-surface');
  });

  it('builds an audience card per remaining row, in a three-column grid', () => {
    // the cards are the hero's default slot
    const grid = hero.querySelector(':scope > bd-grid:not([slot])');
    expect(grid.getAttribute('cols')).toBe('1');
    expect(grid.getAttribute('cols-lg')).toBe('3');

    const cards = [...grid.querySelectorAll(':scope > bd-audience-card')];
    expect(cards.map((c) => inSlot(c, 'title').getAttribute('as'))).toEqual(['h2', 'h2', 'h2']);
    expect(cards.map((c) => inSlot(c, 'title').textContent)).toEqual([
      'Protect Your Digital Life',
      'Protect What You’ve Built',
      'Defend Your Organization',
    ]);
    expect(cards.map((c) => inSlot(c, 'eyebrow').textContent)).toEqual([
      'For home', 'For small business', 'For enterprise',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      'https://www.bitdefender.com/en-us/consumer/',
      'https://www.bitdefender.com/en-us/small-business/',
      'https://www.bitdefender.com/en-us/business/',
    ]);
    expect(cards[0].getAttribute('label')).toBe('For home');
    expect(inSlot(cards[0], 'description').localName).toBe('bd-p');
    expect(inSlot(cards[0], 'description').textContent).toMatch(/^AI-powered protection against scams/);
  });

  it('draws the authored audience icons with the design system icons', () => {
    const icons = [...hero.querySelectorAll('bd-audience-card > [slot="icon"]')];
    expect(icons.map((i) => i.tagName.toLowerCase())).toEqual(['bd-icon', 'bd-icon', 'bd-icon']);
    expect(icons.map((i) => i.getAttribute('name'))).toEqual([
      'home', 'small-business', 'enterprise',
    ]);
  });
});

// DEX-29311 case 3: the author leaves the h1 out
describe('brand-hero block without a heading', () => {
  it('still reads the first paragraph as the eyebrow and the next as the lead', async () => {
    const block = await renderFixture((main) => main.querySelector('.brand-hero h1').remove());
    const hero = block.querySelector('bd-hero');

    expect(inSlot(hero, 'title')).toBeNull();
    expect(inSlot(hero, 'eyebrow').textContent).toMatch(/25 Years/);
    expect(inSlot(hero, 'description').textContent).not.toMatch(/25 Years/);
  });
});

// DEX-29311 cases 6 and 8: a fourth card, and cards whose parts must line up
describe('brand-hero block with four cards', () => {
  it('sets every card in one row from lg, on rows the cards share', async () => {
    const block = await renderFixture((main) => {
      const rows = main.querySelector('.brand-hero').children;
      rows[0].parentElement.append(rows[rows.length - 1].cloneNode(true));
    });
    const grid = block.querySelector('bd-grid');

    expect(grid.querySelectorAll('bd-audience-card')).toHaveLength(4);
    expect(grid.getAttribute('cols-lg')).toBe('4');
    expect(grid.getAttribute('item-rows')).toBe('4');
  });
});
