/**
 * Unit tests for the link-columns block: the solution splitter, a bold arrow
 * bd-link over a small bd-p per column, under the section header. The fixture
 * is section 8 as authored on /en-us/. The design system modules are replaced
 * by an empty module, so these tests check the markup the block builds, not
 * the components' rendering.
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

async function renderFixture(prepare = () => {}) {
  const html = await readFile(path.join(__dirname, 'link-columns.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');
  prepare(main);

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.link-columns');
  const { default: decorate } = await import('../../../blocks/link-columns/link-columns.js');
  await decorate(block);
  return block;
}

describe('link-columns block', () => {
  let block;
  let grid;
  let columns;

  beforeAll(async () => {
    block = await renderFixture();
    grid = block.querySelector(':scope > bd-grid');
    columns = [...grid.querySelectorAll(':scope > .link-columns-item')];
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('lays the columns out on the page column: one, two from md, four from lg', () => {
    expect(grid.classList.contains('ds-page-column')).toBe(true);
    expect(grid.getAttribute('cols')).toBe('1');
    expect(grid.getAttribute('cols-md')).toBe('2');
    expect(grid.getAttribute('cols-lg')).toBe('4');
  });

  it('builds a bold arrow link over a small paragraph per row', () => {
    expect(columns.map((column) => column.querySelector('bd-link').textContent)).toEqual([
      'For Individuals', 'For Small Business', 'For Enterprise', 'For MSPs',
    ]);
    const [individuals] = columns;
    const link = individuals.querySelector('bd-link');
    expect(link.getAttribute('appearance')).toBe('bold');
    expect(link.hasAttribute('variant')).toBe(false);
    expect(link.hasAttribute('arrow')).toBe(true);
    expect(link.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/');
    const body = individuals.querySelector('bd-p');
    expect(body.getAttribute('appearance')).toBe('small');
    expect(body.hasAttribute('variant')).toBe(false);
    expect(body.textContent).toBe('AI-Powered security, privacy, and scam protection for everyday digital life.');
  });

  it('lifts the section header with its lead', () => {
    const header = block.closest('.section').querySelector('bd-section-header');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Find the Bitdefender solution built for you');
    expect(title.getAttribute('as')).toBe('h2');
    expect(header.querySelector(':scope > bd-p[slot="description"]').textContent).toMatch(/^Whether you are protecting personal devices/);
  });
});

// DEX-29311 cases 7 and 9: fewer links than a row holds, and links that wrap
describe('link-columns block with two links', () => {
  it('lets the links share the row, on rows the columns share', async () => {
    const block = await renderFixture((main) => {
      [...main.querySelector('.link-columns').children].slice(2).forEach((row) => row.remove());
    });
    const grid = block.querySelector('bd-grid');

    expect(grid.children).toHaveLength(2);
    expect(grid.getAttribute('cols-lg')).toBe('2');
    expect(grid.getAttribute('cols-md')).toBe('2');
    expect(grid.getAttribute('item-rows')).toBe('2');
  });
});
