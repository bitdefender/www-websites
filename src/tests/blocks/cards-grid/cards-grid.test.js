/**
 * Unit tests for the cards-grid block: the card variations Columns drew,
 * authored as Columns was (a cell a card) and picked by the section's Section
 * Metadata style, text over image without one (DEX-29440). The fixture holds
 * one section per variation. The design system modules are replaced by an
 * empty module, so these tests check the markup the block builds, not the
 * components' rendering.
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

vi.mock('../../../scripts/scripts.js', () => ({ openModal: vi.fn() }));

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let blocks;

beforeAll(async () => {
  const html = await readFile(path.join(__dirname, 'cards-grid.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');
  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const { default: decorate } = await import('../../../blocks/cards-grid/cards-grid.js');
  blocks = [...main.querySelectorAll('.cards-grid')];
  // one at a time, as the page loads them
  // eslint-disable-next-line no-restricted-syntax
  for (const block of blocks) await decorate(block); // eslint-disable-line no-await-in-loop
});

const gridOf = (block) => block.querySelector(':scope > bd-grid');
const cardsOf = (block) => [...gridOf(block).children];
const buttonsOf = (card) => [...card.querySelectorAll('bd-button[slot="actions"]')]
  .map((button) => [button.getAttribute('appearance'), button.textContent]);

describe('cards-grid block', () => {
  it('reads the variation from the section style, text over image without one', () => {
    expect(blocks.map((block) => block.dataset.variant))
      .toEqual(['media', 'responsible-ai', 'benefits', 'anchor', 'logo']);
  });

  it('lays every row out on the page column, each card a subgrid of the row', () => {
    blocks.forEach((block) => {
      const grid = gridOf(block);
      expect(grid.classList.contains('ds-page-column')).toBe(true);
      expect(grid.getAttribute('cols')).toBe('1');
      expect(grid.getAttribute('gap')).toBe('md');
      expect(Number(grid.getAttribute('item-rows'))).toBeGreaterThan(0);
      // the authored table is gone
      expect(block.querySelector(':scope > div')).toBeNull();
    });
  });

  it('text over image: the picture is the card\'s ground, its size kept', () => {
    const [block] = blocks;
    const cards = cardsOf(block);
    expect(cards).toHaveLength(3);
    expect(gridOf(block).getAttribute('cols-lg')).toBe('3');
    expect(gridOf(block).getAttribute('item-rows')).toBe('4');
    const [first] = cards;
    expect(first.localName).toBe('bd-card');
    expect(first.getAttribute('appearance')).toBe('media');
    const media = first.querySelector('bd-img[slot="media"]');
    expect(media.getAttribute('src')).toContain('media_encryption.png');
    expect([media.getAttribute('width'), media.getAttribute('height')]).toEqual(['410', '614']);
    const title = first.querySelector('bd-h[slot="title"]');
    expect(title.getAttribute('as')).toBe('h3');
    // the bold authors give a heading is the title role's to set
    expect(title.innerHTML).toBe('Gold-standard encryption from anywhere in the world');
    expect(first.querySelector('bd-p').textContent).toContain('4,000 servers');
    // the buttons are no copy
    expect(first.querySelectorAll('bd-p')).toHaveLength(1);
  });

  it('a link on its own line is a button: plain the red one, bold the black, a fragment the text one', async () => {
    const { openModal } = await import('../../../scripts/scripts.js');
    const [buy, learn, trial] = cardsOf(blocks[0]);
    expect(buttonsOf(buy)).toEqual([['accent', 'Buy now']]);
    expect(buttonsOf(learn)).toEqual([['secondary', 'Learn more']]);
    expect(buttonsOf(trial)).toEqual([['plain', 'Download free 30-day trial']]);
    // on the picture's dark ground
    expect(buy.querySelector('bd-button').getAttribute('surface')).toBe('dark');
    expect(buy.querySelector('bd-button').getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/vpn');
    // a fragment opens as a modal
    const download = trial.querySelector('bd-button');
    expect(download.hasAttribute('href')).toBe(false);
    download.click();
    expect(openModal).toHaveBeenCalledWith('/en-us/consumer/fragments/thank-you-for-downloading', false);
  });

  it('a card keeps every button authored, in order', () => {
    const middle = cardsOf(blocks[1])[1];
    expect(buttonsOf(middle)).toEqual([['secondary', 'Test'], ['accent', 'Shield Your Business']]);
    expect(middle.querySelector('bd-button').getAttribute('surface')).toBe('light');
    const [, gasa] = cardsOf(blocks[4]);
    expect(buttonsOf(gasa)).toEqual([['secondary', 'Learn more']]);
  });

  it('responsible-ai: an icon, a brand title and copy on the tint, under a centred header', () => {
    const block = blocks[1];
    const cards = cardsOf(block);
    expect(cards).toHaveLength(3);
    cards.forEach((card) => expect(card.getAttribute('background')).toBe('tint'));
    const icon = cards[1].querySelector('bd-img[slot="icon"]');
    expect(icon.getAttribute('src')).toBe('/common/icons/shield-eye.svg');
    expect(icon.getAttribute('fit')).toBe('contain');
    const title = cards[1].querySelector('bd-h[slot="title"]');
    expect([title.getAttribute('color'), title.getAttribute('font-weight')]).toEqual(['primary', 'semibold']);
    expect(title.textContent).toBe('Privacy by Design');

    const header = block.closest('.section').querySelector('bd-section-header');
    expect(header.getAttribute('layout')).toBe('centered');
    expect(header.querySelector('bd-h[slot="title"]').textContent).toBe('Trusted For The AI Era');
    expect(header.querySelector('bd-p[slot="description"]').textContent).toBe('Pioneering AI in Cybersecurity since 2008.');
  });

  it('benefits: a figure, a title and a line, each a content row; five cards wrap three to a row', () => {
    const block = blocks[2];
    const cards = cardsOf(block);
    expect(cards).toHaveLength(5);
    expect(gridOf(block).getAttribute('cols-lg')).toBe('3');
    expect(gridOf(block).getAttribute('item-rows')).toBe('6');
    const [card] = cards;
    expect([...card.children].map((child) => child.localName)).toEqual(['bd-display', 'bd-h', 'bd-p']);
    expect(card.querySelector('bd-display').textContent).toBe('60M+');
    const title = card.querySelector('bd-h');
    expect(title.hasAttribute('slot')).toBe(false);
    expect([title.getAttribute('visual-level'), title.getAttribute('font-weight')]).toEqual(['h5', 'bold']);
    expect(card.querySelector('bd-p').getAttribute('appearance')).toBe('small');
    expect(card.querySelector('bd-p').hasAttribute('padding-top')).toBe(false);
    // the figure is no heading of the page's
    expect(block.querySelector('h1')).toBeNull();
  });

  it('benefits: without a title the line keeps the 24 under the figure; buttons at the foot', () => {
    const last = cardsOf(blocks[2])[4];
    expect([...last.children].map((child) => child.localName)).toEqual(['bd-display', 'bd-p', 'bd-button']);
    expect(last.querySelector('bd-p').getAttribute('padding-top')).toBe('24');
    expect(buttonsOf(last)).toEqual([['secondary', 'Learn more']]);
  });

  it('anchor: an outline audience card to the cell\'s link, with or without an eyebrow', () => {
    const block = blocks[3];
    const cards = cardsOf(block);
    expect(gridOf(block).getAttribute('cols-md')).toBe('2');
    // three on one line from lg
    expect(gridOf(block).getAttribute('cols-lg')).toBe('3');
    expect(cards.map((card) => card.localName)).toEqual(['bd-audience-card', 'bd-audience-card', 'bd-audience-card']);
    const [home, business, small] = cards;
    expect(home.getAttribute('appearance')).toBe('outline');
    expect(home.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/ai-in-cybersecurity/');
    expect(home.querySelector('[slot="eyebrow"]').textContent).toBe('FOR HOME');
    expect(home.querySelector('bd-h[slot="title"]').textContent).toBe('How we use AI to stop scams');
    expect(business.querySelector('[slot="eyebrow"]')).toBeNull();
    expect(business.querySelector('bd-h[slot="title"]').textContent).toBe('Our AI advantage in enterprise security');
    // an h4 alone is the eyebrow still, not the title
    expect(small.querySelector('[slot="eyebrow"]').textContent).toBe('FOR SMALL BUSINESS');
    expect(small.querySelector('bd-h[slot="title"]')).toBeNull();
    expect(small.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/small-business/');
  });

  it('logo: the logo at its own proportions, an h3-role title keeping its line break, a row per paragraph', () => {
    const block = blocks[4];
    const cards = cardsOf(block);
    // the most paragraphs any card has, two, between the logo and title rows and the actions'
    expect(gridOf(block).getAttribute('item-rows')).toBe('5');
    const [cga, gasa] = cards;
    const logo = gasa.querySelector('bd-img[slot="media"]');
    expect(logo.getAttribute('src')).toContain('media_gasa.png');
    expect(logo.hasAttribute('width')).toBe(false);
    expect(logo.hasAttribute('height')).toBe(false);
    const title = cga.querySelector('bd-h[slot="title"]');
    expect([title.getAttribute('visual-level'), title.getAttribute('padding-bottom')]).toEqual(['h3', '8']);
    expect(title.innerHTML).toBe('Partner of<br>Creators Guild of America');
    expect(cga.querySelectorAll('bd-p')).toHaveLength(2);
    expect(gasa.querySelectorAll('bd-p')).toHaveLength(1);
  });
});
