/**
 * Unit tests for the four-cards block: cards on the design system's
 * bd-card-grid, in a section on bd-section's rhythm under its
 * bd-section-header. The fixture is /en-us/consumer/family's cards, with an
 * opening header and a CTA after the block added. The design system modules
 * are an empty stub in tests (vitest.config.js), so these tests check the
 * markup the block builds, not the components' rendering.
 */
import {
  beforeAll, describe, expect, it,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { decorateBlocks, decorateButtons, decorateSections } from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function renderFixture(transform = (html) => html) {
  const html = await readFile(path.join(__dirname, 'four-cards.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.four-cards');
  const { default: decorate } = await import('../../../blocks/four-cards/four-cards.js');
  await decorate(block);
  return block;
}

describe('four-cards block', () => {
  let block;
  let grid;
  let cards;

  beforeAll(async () => {
    block = await renderFixture();
    grid = block.querySelector(':scope > bd-card-grid');
    cards = [...grid.querySelectorAll(':scope > bd-card')];
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
  });

  it('lifts the opening copy into the section header, leaving the grid untitled', () => {
    const header = block.closest('bd-section')
      .querySelector(':scope > .default-content-wrapper > bd-section-header');
    expect(header.querySelector(':scope > [slot="eyebrow"]').textContent).toBe('Built for every member');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Keeping your family safe online');
    expect(title.getAttribute('as')).toBe('h2');
    expect(header.querySelector(':scope > bd-p[slot="description"]').textContent).toMatch(/^Protect up to 5 people/);
    expect(grid.querySelector(':scope > [slot="title"], :scope > [slot="description"]')).toBeNull();
  });

  it('builds a card per row, its title an h3 under the section h2', () => {
    expect(cards).toHaveLength(3);
    const titles = cards.map((card) => card.querySelector(':scope > bd-h[slot="title"]'));
    titles.forEach((title) => {
      expect(title.getAttribute('as')).toBe('h3');
      // the card sets its title's size, weight and ink
      ['visual-level', 'color', 'font-weight'].forEach((name) => expect(title.hasAttribute(name)).toBe(false));
    });
    // two authored headings stay two lines
    expect(titles[0].innerHTML).toBe('Complete protection,<br>built for families.');
  });

  it('slots each icon as a bd-img the card sizes', () => {
    const [picture, named] = cards.map((card) => card.querySelector(':scope > bd-img[slot="icon"]'));
    expect(picture.getAttribute('src')).toMatch(/^\.\/media_179fb208/);
    expect(picture.getAttribute('width')).toBe('48');
    expect(named.getAttribute('src')).toBe('/common/icons/rocket-launch.svg');
    expect(named.getAttribute('alt')).toBe('');
    cards.forEach((card) => {
      const icon = card.querySelector(':scope > [slot="icon"]');
      ['fit', 'style'].forEach((name) => expect(icon.hasAttribute(name)).toBe(false));
    });
  });

  it('writes the copy as bd-p, the pictures as bd-img and a linked picture inside a bd-link', () => {
    const copy = cards[0].querySelector(':scope > bd-p:not([slot])');
    expect(copy.textContent).toMatch(/^Protect up to 5 people and 25 devices/);
    expect(copy.hasAttribute('appearance')).toBe(false);

    const image = cards[1].querySelector(':scope > bd-img:not([slot])');
    expect(image.getAttribute('alt')).toBe('Threats blocked last year');

    const link = cards[2].querySelector(':scope > bd-link');
    expect(link.getAttribute('href')).toBe('https://apps.apple.com/app/bitdefender-mobile-security/id1255066429');
    expect(link.querySelector(':scope > bd-img[slot="start"]').getAttribute('alt')).toBe('Download on the App Store');

    // nothing authored is slotted raw
    expect(grid.querySelector('picture, .card-media, a')).toBeNull();
  });

  it('turns a card\'s link into its CTA, at the button\'s own size', () => {
    const cta = cards[1].querySelector(':scope > bd-button[slot="actions"]');
    expect(cta.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/ai/');
    expect(cta.textContent).toBe('Learn more');
    expect(cta.getAttribute('appearance')).toBe('accent');
    // the card places its actions: no size or alignment of the block's
    ['size', 'align'].forEach((name) => expect(cta.hasAttribute(name)).toBe(false));
  });

  it('moves the section\'s CTA under the cards and drops the wrapper it leaves empty', () => {
    const [cta] = block.querySelectorAll(':scope > bd-button');
    expect(cta.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/family/');
    expect(cta.getAttribute('align')).toBe('center');
    expect(cta.textContent).toBe('See family plans');
    const wrappers = block.closest('bd-section').querySelectorAll(':scope > .default-content-wrapper');
    expect(wrappers).toHaveLength(1);
  });
});

describe('four-cards block with a title row and section styles', () => {
  it('slots a heading-only first row as the grid\'s h2', async () => {
    const block = await renderFixture((html) => html
      .replace(/<p>Built for every member<\/p>[\s\S]*?(<div class="four-cards">)/, '$1<div><div><h3>Why families choose us</h3></div></div>'));
    const grid = block.querySelector('bd-card-grid');
    const title = grid.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Why families choose us');
    expect(title.getAttribute('as')).toBe('h2');
    expect(grid.querySelectorAll(':scope > bd-card')).toHaveLength(3);
  });

  it('centres the cards and puts them on the brand wash, with rounded CTAs', async () => {
    const block = await renderFixture((html) => html.replace(/<\/div>\s*$/, `
      <div class="section-metadata">
        <div><div>Style</div><div>centered, blue</div></div>
        <div><div>shape</div><div>rounded</div></div>
        <div><div>margintop</div><div>40</div></div>
      </div>
    </div>`));
    // the section's spacing is bd-section's alone
    expect(block.closest('.section').style.marginTop).toBe('');
    const cards = [...block.querySelectorAll('bd-card')];
    cards.forEach((card) => {
      expect(card.getAttribute('align')).toBe('center');
      expect(card.getAttribute('background')).toBe('tint');
    });
    block.querySelectorAll('bd-button').forEach((button) => expect(button.getAttribute('shape')).toBe('rounded'));
  });
});
