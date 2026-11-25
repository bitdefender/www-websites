/**
 * Unit tests for the product-comparison-table block. The fixture is the table of
 * /en-us/consumer/premium-security, trimmed to two feature rows.
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

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(path.join(__dirname, 'product-comparison-table.mock.html'), 'utf-8');

class ResizeObserverMock {
  observe() { return this; }

  unobserve() { return this; }

  disconnect() { return this; }
}
global.ResizeObserver = ResizeObserverMock;
global.fetch = vi.fn(async () => ({ ok: false }));

const { default: decorate } = await import('../../../blocks/product-comparison-table/product-comparison-table.js');

/**
 * Puts each {PriceComparison} the way locale-router sends it to clients that don't run
 * JS: its value in a span that keeps the placeholder in `data-edge-nanoblock`. The value
 * has no <strong> or <em>: the block picks its marked columns by those before it renders.
 * @param {HTMLElement} block
 */
function renderPlaceholdersAtTheEdge(block) {
  block.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.textContent.trim() !== '{PriceComparison}') return;
    paragraph.innerHTML = '<span data-edge-nanoblock="{PriceComparison}">Old price <s>$189.99</s> $79.99 For the first year</span>';
  });
}

/**
 * @param {boolean} [atTheEdge] render the placeholders the way locale-router does first
 * @returns {HTMLElement} the decorated block
 */
function renderFixture(atTheEdge = false) {
  document.body.innerHTML = `<main>${fixture}</main>`;
  const main = document.querySelector('main');
  if (atTheEdge) {
    renderPlaceholdersAtTheEdge(main.querySelector('div.product-comparison-table'));
  }
  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);
  const block = main.querySelector('.product-comparison-table');
  decorate(block);
  return block;
}

describe('product-comparison-table block', () => {
  let block;
  let columns;

  beforeAll(() => {
    block = renderFixture();
    columns = [...block.querySelectorAll('.product-comparison-header > div')].slice(1);
  });

  it('groups the paragraphs between each product title and its price', () => {
    columns.forEach((column) => {
      const group = column.querySelector('.paragraph-group');
      expect([...group.children].map((paragraph) => paragraph.textContent)).toEqual([
        expect.stringContaining('Individual'),
        '1 member - up to 5 devices',
      ]);
    });
  });

  it('renders each column\'s price for its product', () => {
    const products = columns.map((column) => column.querySelector('.store-product')?.getAttribute('product-id'));
    expect(products).toEqual(['us_pi', 'us_i', 'ps_i']);
    columns.forEach((column) => {
      expect(column.querySelector('.product-comparison-price [data-store-price="discounted||full"]')).not.toBeNull();
      expect(column.querySelector('.price-applied-on-time').textContent).toBe('For the first year');
      expect(column.querySelector('.old-price-box span').textContent).toContain('Old price');
    });
  });

  it('turns a buy link into the store\'s', () => {
    const buyLink = columns[2].querySelector('a[data-store-buy-link]');
    expect(buyLink).not.toBeNull();
    expect(buyLink.getAttribute('href')).toBe('#');
  });

  it('decorates exactly as from the authored placeholders when they come rendered by locale-router', () => {
    const authoredHtml = block.outerHTML;

    const atTheEdge = renderFixture(true);

    expect(atTheEdge.outerHTML).toBe(authoredHtml);
    expect(atTheEdge.querySelector('[data-edge-nanoblock]')).toBeNull();
  });
});
