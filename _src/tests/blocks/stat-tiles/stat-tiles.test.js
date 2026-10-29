/**
 * Unit tests for the stat-tiles block: the homepage's Why-trust figures,
 * rendered by the design system's bd-stat-highlight and bd-stat-tile, under the
 * section's header. The fixture is section 4 as authored on /en-us/: the header
 * as default content above the block, without Section Metadata yet. The design
 * system modules are
 * replaced by an empty module, so these tests check the markup the block
 * builds, not the components' rendering.
 */
import {
  afterAll, beforeAll, describe, expect, it, vi,
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

// Section Metadata, as an author adds it under the block
const withMetadata = (key, value) => (html) => html.replace(/<\/div>\s*$/, `
  <div class="section-metadata"><div><div>${key}</div><div>${value}</div></div></div>
</div>`);

async function renderFixture(transform = (html) => html) {
  const html = await readFile(path.join(__dirname, 'stat-tiles.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.stat-tiles');
  const { default: decorate } = await import('../../../blocks/stat-tiles/stat-tiles.js');
  await decorate(block);
  return block;
}

describe('stat-tiles block', () => {
  let block;
  let layout;

  beforeAll(async () => {
    // liftSectionHeader imports from esm.sh, which a test cannot reach
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    block = await renderFixture();
    layout = block.querySelector(':scope > bd-grid.stat-tiles-column');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    expect(block.closest('bd-section')).toBe(section.firstElementChild);
  });

  it('lifts the section header above the figures', () => {
    const section = block.closest('.section');
    const header = section.querySelector(':scope > bd-section > .default-content-wrapper > bd-section-header');
    expect(header.getAttribute('eyebrow')).toBe('25 years of Cybersecurity Excellence');
    expect(header.getAttribute('heading')).toBe('Why Millions Trust Bitdefender');
    expect(header.id).toBe('why-millions-trust-bitdefender');
    expect(header.querySelector('[slot="lead"] bd-link').getAttribute('href'))
      .toBe('https://www.bitdefender.com/en-us/company/');
    // no Section Metadata yet: the helper's default
    expect(header.getAttribute('layout')).toBe('stacked');
  });

  it('takes the header layout from Section Metadata, split as Figma draws it', async () => {
    const split = await renderFixture(withMetadata('Header', 'split'));
    const header = split.closest('.section').querySelector('bd-section-header');
    expect(header.getAttribute('layout')).toBe('split');
  });

  it('replaces the authored rows with the column grid: the lead beside the tiles from lg', () => {
    expect(block.children).toHaveLength(1);
    expect(layout.getAttribute('cols')).toBe('1');
    expect(layout.getAttribute('cols-md')).toBe('1');
    expect(layout.getAttribute('cols-lg')).toBe('2');
  });

  it('leads with the highlight, named by its spoken form', () => {
    const highlight = layout.querySelector('.stat-tiles-lead > bd-stat-highlight');
    expect(highlight.getAttribute('value')).toBe('$1.5B+');
    expect(highlight.getAttribute('label')).toBe('$1.5 billion plus');
  });

  it('keeps the lead copy and turns its link into the primary CTA', () => {
    const lead = layout.querySelector('.stat-tiles-lead');
    const copy = lead.querySelector('bd-p');
    expect(copy.textContent).toMatch(/^Through global ransomware operations/);

    const cta = lead.querySelector('bd-button-link');
    expect(cta.getAttribute('variant')).toBe('primary');
    expect(cta.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/company/');
    expect(cta.textContent).toBe('Learn Why Millions Trust Us');
  });

  it('builds a tile per remaining row, two across from md', () => {
    const tiles = layout.querySelector(':scope > bd-grid:not(.stat-tiles-column)');
    expect(tiles.getAttribute('cols')).toBe('1');
    expect(tiles.getAttribute('cols-md')).toBe('2');

    const items = [...tiles.querySelectorAll(':scope > bd-stat-tile')];
    expect(items.map((t) => t.getAttribute('value'))).toEqual([
      '580+', '30+', '50%+', '30+', '50B+', '487+',
    ]);
    expect(items[0].getAttribute('caption')).toMatch(/^Patents filed/);
  });

  it('names a tile by its spoken form only where one is authored', () => {
    const items = [...block.querySelectorAll('bd-stat-tile')];
    expect(items[4].getAttribute('label')).toBe('50 billion plus');
    expect(items[0].hasAttribute('label')).toBe(false);
  });
});
