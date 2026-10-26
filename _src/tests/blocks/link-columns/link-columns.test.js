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

// every `${base}<module>` the block imports resolves to an empty module: the
// module name lands in a comment after `export {}`
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => ({
  ...(await importOriginal()),
  getDsnBase: vi.fn(() => 'data:text/javascript,export {}//'),
}));

async function renderFixture() {
  const html = await readFile(path.join(__dirname, 'link-columns.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

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
    // liftSectionHeader imports from esm.sh, which a test cannot reach
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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
    expect(link.getAttribute('variant')).toBe('bold');
    expect(link.hasAttribute('arrow')).toBe(true);
    expect(link.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/');
    const body = individuals.querySelector('bd-p');
    expect(body.getAttribute('variant')).toBe('small');
    expect(body.textContent).toBe('AI-Powered security, privacy, and scam protection for everyday digital life.');
  });

  it('lifts the section header with its lead', () => {
    const header = block.closest('.section').querySelector('bd-section-header');
    expect(header.getAttribute('heading')).toBe('Find the Bitdefender solution built for you');
    expect(header.querySelector('[slot="lead"]').textContent).toMatch(/^Whether you are protecting personal devices/);
  });
});
