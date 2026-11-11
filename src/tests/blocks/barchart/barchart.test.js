/**
 * Unit tests for the barchart block: score comparisons on the design system's
 * bd-bar-chart-grid, in a section on bd-section's rhythm under its
 * bd-section-header. The fixture is the comparison on
 * /en-us/consumer/antivirus-for-mac, one bar given a scale. The design system
 * modules are an empty stub in tests (vitest.config.js), so these tests check
 * the markup the block builds, not the components' rendering.
 */
import {
  afterAll, beforeAll, describe, expect, it, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { decorateBlocks, decorateButtons, decorateSections } from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// the bars animate once the grid scrolls into view, which never happens here
const observed = [];
vi.stubGlobal('IntersectionObserver', function IntersectionObserver() {
  this.observe = (el) => observed.push(el);
  this.disconnect = () => {};
});

async function renderFixture(transform = (html) => html) {
  const html = await readFile(path.join(__dirname, 'barchart.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.barchart');
  const { default: decorate } = await import('../../../blocks/barchart/barchart.js');
  await decorate(block);
  return block;
}

describe('barchart block', () => {
  let block;
  let grid;
  let charts;

  beforeAll(async () => {
    block = await renderFixture();
    grid = block.querySelector('bd-bar-chart-grid');
    charts = [...grid.querySelectorAll(':scope > bd-bar-chart')];
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
  });

  it('lifts the section title into a centred bd-section-header at the author\'s level', () => {
    const header = block.closest('bd-section')
      .querySelector(':scope > .default-content-wrapper > bd-section-header');
    expect(header.getAttribute('layout')).toBe('centered');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Absolute Protection. Designed for Mac.');
    expect(title.getAttribute('as')).toBe('h2');
    // the header sets the title's size
    expect(title.hasAttribute('visual-level')).toBe(false);
  });

  it('puts the charts in a region named by the section title', () => {
    const region = block.querySelector(':scope > section');
    const title = block.closest('bd-section').querySelector('bd-section-header > bd-h[slot="title"]');
    expect(region.getAttribute('aria-labelledby')).toBe(title.id);
    expect(region.firstElementChild).toBe(grid);
    expect(observed).toContain(grid);
  });

  it('builds a chart per row, its title an h3 under the section h2', () => {
    expect(charts).toHaveLength(2);
    charts.forEach((chart) => {
      expect(chart.getAttribute('bars-label')).toBe('Scores by brand');
      expect(chart.getAttribute('scale-note')).toMatch(/scale is out of 6\.$/);
      expect(chart.hasAttribute('orientation')).toBe(false);
    });
    const title = charts[0].querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Best Protection Against Infections');
    expect(title.getAttribute('as')).toBe('h3');
    expect(title.hasAttribute('visual-level')).toBe(false);
    expect(charts[0].querySelector(':scope > bd-p[slot="description"]').textContent)
      .toBe('(On a scale of 0 to 6, with 6 as the highest level of protection)');
  });

  it('slots the icon for the chart to size', () => {
    const icon = charts[0].querySelector(':scope > bd-img[slot="icon"]');
    expect(icon.getAttribute('src')).toBe('/common/icons/bestav.svg');
    expect(icon.getAttribute('alt')).toBe('');
    ['width', 'height', 'loading'].forEach((name) => expect(icon.hasAttribute(name)).toBe(false));
  });

  it('turns the list into bars, the brand bar primary and an authored scale kept', () => {
    const bars = [...charts[1].querySelectorAll(':scope > bd-bar-chart-item')];
    expect(bars.map((bar) => bar.textContent)).toEqual(['Bitdefender', 'Avast', 'Avira', 'F-Secure']);
    expect(bars.map((bar) => bar.getAttribute('appearance')))
      .toEqual(['primary', 'secondary', 'secondary', 'secondary']);
    // a comma decimal is read as a point
    expect(bars[3].getAttribute('score')).toBe('5.67');
    expect(bars[3].getAttribute('scale')).toBe('0.85');
    expect(charts[1].hasAttribute('without-stretch')).toBe(true);
  });

  it('keeps the footnote as authored, its link an inline underlined bd-link', () => {
    const footer = charts[0].querySelector(':scope > bd-p[slot="footer"]');
    expect(footer.getAttribute('appearance')).toBe('xsmall');
    expect(footer.textContent).toBe('Overall Score. JUNE 2017 - MARCH 2023. AV TEST.');
    const link = footer.querySelector(':scope > bd-link');
    expect(link.textContent).toBe('AV TEST.');
    expect(link.getAttribute('href')).toBe('https://www.av-test.org/en/antivirus/home-users/');
    expect(link.hasAttribute('inline')).toBe(true);
    expect(link.hasAttribute('underline')).toBe(true);
    // the footnote's size and ink are the paragraph's
    ['font-size', 'color'].forEach((name) => expect(link.hasAttribute(name)).toBe(false));
  });
});

describe('barchart block without a section title', () => {
  it('renders the grid alone, with no region to name', async () => {
    const block = await renderFixture((html) => html.replace(/<h2[^>]*>.*<\/h2>/, ''));
    expect(block.firstElementChild.tagName).toBe('BD-BAR-CHART-GRID');
    expect(block.closest('bd-section').querySelector('bd-section-header')).toBeNull();
  });
});
