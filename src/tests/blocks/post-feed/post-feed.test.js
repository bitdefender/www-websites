/**
 * Unit tests for the post-feed block: Latest insights on the design system's
 * bd-post-card, under the section header. The fixture is section 7 as
 * authored on /en-us/. The design system modules are replaced by an empty
 * module, so these tests check the markup the block builds, not the
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

async function renderFixture() {
  const html = await readFile(path.join(__dirname, 'post-feed.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.post-feed');
  const { default: decorate } = await import('../../../blocks/post-feed/post-feed.js');
  await decorate(block);
  return block;
}

describe('post-feed block', () => {
  let block;
  let grid;
  let cards;

  beforeAll(async () => {
    block = await renderFixture();
    grid = block.querySelector(':scope > bd-grid');
    cards = [...grid.querySelectorAll(':scope > bd-post-card')];
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('lays the posts out on the page column, three across from lg', () => {
    expect(block.children).toHaveLength(1);
    expect(grid.classList.contains('ds-page-column')).toBe(true);
    expect(grid.getAttribute('cols')).toBe('1');
    expect(grid.getAttribute('cols-md')).toBe('1');
    expect(grid.getAttribute('cols-lg')).toBe('3');
  });

  it('spaces the cards by the grid\'s md gap at every width', () => {
    expect(grid.getAttribute('gap')).toBe('md');
    ['gap-sm', 'gap-md', 'gap-lg'].forEach((name) => expect(grid.hasAttribute(name)).toBe(false));
  });

  it('joins the section to the design system\'s rhythm', () => {
    const section = block.closest('.section');
    expect(section.querySelector(':scope > bd-section')).not.toBeNull();
    expect(block.closest('bd-section')).not.toBeNull();
  });

  it('builds a card per row: category badge, heading and the heading link', () => {
    const badges = cards.map((card) => card.querySelector(':scope > bd-badge[slot="badge"]'));
    expect(badges.map((badge) => badge.textContent)).toEqual([
      'Consumer Insights', 'Business Insights', 'Labs',
    ]);
    // the category in the card's badge look: info, shade, small
    badges.forEach((badge) => {
      expect(badge.getAttribute('variant')).toBe('info');
      expect(badge.getAttribute('appearance')).toBe('shade');
      expect(badge.getAttribute('size')).toBe('sm');
    });
    const title = cards[0].querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('They Wear Our Faces: How Scammers Are Using AI to Swindle American Families');
    expect(cards[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/blog/hotforsecurity/');
    expect(title.getAttribute('as')).toBe('h3');
    // the copy is in the card's slots; the card carries only its link
    cards.forEach((card) => {
      expect(card.getAttributeNames()).toEqual(['href']);
    });
  });

  it('writes the read-more cue on a linked card', () => {
    expect(cards.map((card) => card.querySelector(':scope > span[slot="read-more"]')?.textContent))
      .toEqual(['Read more', 'Read more', 'Read more']);
  });

  it('slots each cover as a decorative bd-img', () => {
    const covers = cards.map((card) => card.querySelector(':scope > bd-img[slot="media"]'));
    expect(covers.every(Boolean)).toBe(true);
    // the picture's webp, at the width the card shows it
    expect(covers[0].getAttribute('src')).toBe('./media_157d690b013dc21e37092408680aec8b567468d8f.png?width=750&format=webply&optimize=medium');
    expect(covers[0].getAttribute('width')).toBe('366');
    expect(covers[0].getAttribute('height')).toBe('148');
    covers.forEach((cover) => {
      expect(cover.getAttribute('alt')).toBe('');
      expect(cover.getAttribute('loading')).toBe('lazy');
    });
    // no authored picture is slotted
    expect(block.querySelector('bd-post-card > picture')).toBeNull();
  });

  it('lifts the section header', () => {
    const header = block.closest('.section').querySelector('bd-section-header');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Latest cybersecurity insights');
    expect(title.getAttribute('as')).toBe('h2');
  });
});
