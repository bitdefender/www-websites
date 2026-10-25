/**
 * Unit tests for the awards-spotlight block: the homepage's Proven carousel,
 * rendered by the design system's bd-awards-spotlight, under the section's
 * header and its two buttons. The fixture is section 5 as authored on /en-us/
 * (the header as default content, without Section Metadata yet), plus a row
 * with the mark in a cell of its own and an empty row. The design system
 * modules are replaced by an empty module, so these tests check what the
 * block builds, not the components' rendering.
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
  const html = await readFile(path.join(__dirname, 'awards-spotlight.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.awards-spotlight');
  const { default: decorate } = await import('../../../blocks/awards-spotlight/awards-spotlight.js');
  await decorate(block);
  return block;
}

describe('awards-spotlight block', () => {
  let block;
  let spotlight;

  beforeAll(async () => {
    // liftSectionHeader imports from esm.sh, which a test cannot reach
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    block = await renderFixture();
    spotlight = block.querySelector(':scope > bd-awards-spotlight');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('lifts the section header, centred as Figma draws Proven', () => {
    const header = block.closest('.section')
      .querySelector(':scope > .default-content-wrapper > bd-section-header');
    expect(header.getAttribute('heading')).toBe('Proven by Independent Testing and Industry Analysts');
    expect(header.getAttribute('layout')).toBe('centered');
    expect(header.querySelector('[slot="lead"]').textContent).toMatch(/^Independent analysts/);
  });

  it('lets Section Metadata choose another header layout', async () => {
    const stacked = await renderFixture(withMetadata('Header', 'stacked'));
    const header = stacked.closest('.section').querySelector('bd-section-header');
    expect(header.getAttribute('layout')).toBe('stacked');
    // later tests read the default fixture
    block = await renderFixture();
    spotlight = block.querySelector(':scope > bd-awards-spotlight');
  });

  it('turns the header\'s button links into two primary buttons under it', () => {
    const wrapper = block.closest('.section').querySelector(':scope > .default-content-wrapper');
    expect(wrapper.querySelectorAll('p.button-container')).toHaveLength(0);

    const actions = wrapper.querySelector(':scope > bd-section-header + .awards-spotlight-actions');
    const buttons = [...actions.querySelectorAll(':scope > bd-button-link')];
    expect(buttons.map((b) => b.textContent)).toEqual(['Consumer Recognition', 'Enterprise Recognition']);
    expect(buttons.map((b) => b.getAttribute('href'))).toEqual([
      'https://www.bitdefender.com/en-us/consumer/awards/',
      'https://www.bitdefender.com/en-us/business/awards/',
    ]);
    buttons.forEach((b) => {
      expect(b.getAttribute('variant')).toBe('primary');
      expect(b.hasAttribute('fullwidth')).toBe(true);
    });
  });

  it('replaces the rows with one autoplaying carousel, named after the section', () => {
    expect(block.children).toHaveLength(1);
    expect(spotlight.hasAttribute('autoplay')).toBe(true);
    expect(spotlight.getAttribute('as')).toBe('h3');
    expect(spotlight.getAttribute('label')).toBe('Proven by Independent Testing and Industry Analysts');
  });

  it('builds an award per authored row and skips an empty one', () => {
    expect(spotlight.awards.map((a) => a.title)).toEqual([
      'A Visionary',
      'A Major Player in MDR',
      'Leadership in Best Protection & Performance',
    ]);
    expect(spotlight.awards[0].body).toMatch(/^Bitdefender received a dual recognition/);
  });

  it('draws each mark at two thirds of its exported size, keeping its alt', () => {
    const [gartner, idc, avTest] = spotlight.awards;
    expect([gartner.logoWidth, gartner.logoHeight]).toEqual([160, 135]);
    expect([idc.logoWidth, idc.logoHeight, idc.logoAlt]).toEqual([160, 97, 'IDC']);
    // the mark in a cell of its own, before the copy
    expect([avTest.logoWidth, avTest.logoHeight, avTest.logoAlt]).toEqual([160, 80, 'AV-TEST Top Product']);
  });

  it('asks for the mark at twice its drawn width, as webp', () => {
    const url = new URL(spotlight.awards[0].logo);
    expect(url.pathname).toMatch(/media_1e3210734fd12b3efe349f02aa23bbc7476b2bf79\.png$/);
    expect(url.searchParams.get('width')).toBe('320');
    expect(url.searchParams.get('format')).toBe('webply');
  });
});
