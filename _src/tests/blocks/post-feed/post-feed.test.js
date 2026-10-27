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

// every `${base}<module>` the block imports resolves to an empty module: the
// module name lands in a comment after `export {}`
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getDsnBase: vi.fn(() => 'data:text/javascript,export {}//'),
}));

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
    // liftSectionHeader imports from esm.sh, which a test cannot reach
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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

  it('builds a card per row: category badge, heading and the heading link', () => {
    expect(cards.map((card) => card.getAttribute('badge'))).toEqual([
      'Consumer Insights', 'Business Insights', 'Labs',
    ]);
    expect(cards[0].getAttribute('heading')).toBe('They Wear Our Faces: How Scammers Are Using AI to Swindle American Families');
    expect(cards[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/blog/hotforsecurity/');
    expect(cards[0].getAttribute('as')).toBe('h3');
  });

  it('slots each cover as decorative', () => {
    const covers = cards.map((card) => card.querySelector(':scope > picture[slot="image"] img'));
    expect(covers.every((img) => img && img.getAttribute('alt') === '')).toBe(true);
  });

  it('lifts the section header', () => {
    const header = block.closest('.section').querySelector('bd-section-header');
    expect(header.getAttribute('heading')).toBe('Latest cybersecurity insights');
  });
});
