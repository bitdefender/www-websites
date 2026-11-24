/**
 * Unit tests for the hero-aem block's price box. The fixture is the hero
 * section as authored on /en-us/consumer/ultimate-security-new: it has a
 * `product` and an <insert-prices> paragraph, but no buylink. Each test edits
 * that markup to cover one placement case.
 */
import { describe, expect, it } from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections,
} from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockHtml = await readFile(path.join(__dirname, 'hero-aem.mock.html'), 'utf-8');

/**
 * Renders the fixture and decorates the hero-aem block.
 * @param {(main: HTMLElement) => void} [edit] changes the authored markup first
 * @returns {Promise<HTMLElement>} the decorated block
 */
async function renderFixture(edit = () => {}) {
  document.body.innerHTML = `<main>${mockHtml}</main>`;
  const main = document.querySelector('main');
  edit(main);

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.hero-aem');
  const { default: decorate } = await import('../../../blocks/hero-aem/hero-aem.js');
  await decorate(block);
  return block;
}

const findParagraph = (main, text) => [...main.querySelectorAll('p')]
  .find((p) => p.textContent.includes(text));

const removeInsertPrices = (main) => findParagraph(main, '<insert-prices>').remove();

const makeCtaBuyLink = (main) => {
  main.querySelector('a[href*="#new-prod-boxes"]')
    .setAttribute('href', 'https://www.bitdefender.com/buy/#buylink');
};

describe('hero-aem block', () => {
  it('replaces <insert-prices> with the price box when there is no buylink', async () => {
    const block = await renderFixture();
    const prices = block.querySelector('.hero-aem__prices');

    expect(prices).toBeTruthy();
    expect(block.textContent).not.toContain('<insert-prices>');
    expect(prices.nextElementSibling.querySelector('a').textContent)
      .toBe('Choose your own protection');
    expect(prices.closest('.hero-aem__card-text')).toBeTruthy();
  });

  it('finishes decorating after the price box when there is no buylink', async () => {
    const block = await renderFixture((main) => {
      main.querySelector('.hero-aem p:last-child').insertAdjacentHTML(
        'afterend',
        '<table><tr><td>benefit_list</td></tr><tr><td>One</td></tr></table>',
      );
    });

    const table = block.querySelector('table');
    expect(table.classList.contains('benefit_list')).toBe(true);
    expect(table.rows).toHaveLength(1);
  });

  it('puts the price box before the CTA when there is neither buylink nor <insert-prices>', async () => {
    const block = await renderFixture(removeInsertPrices);
    const prices = block.querySelector('.hero-aem__prices');

    expect(prices).toBeTruthy();
    expect(prices.nextElementSibling.querySelector('a').textContent)
      .toBe('Choose your own protection');
  });

  it('appends the price box to the card text when there is no CTA either', async () => {
    const block = await renderFixture((main) => {
      removeInsertPrices(main);
      findParagraph(main, 'Choose your own protection').remove();
    });
    const prices = block.querySelector('.hero-aem__prices');

    expect(prices).toBeTruthy();
    expect(prices.parentElement.classList.contains('hero-aem__card-text')).toBe(true);
    expect(prices.nextElementSibling).toBeNull();
  });

  it('puts the price box before the buylink and marks the link for the store', async () => {
    const block = await renderFixture((main) => {
      removeInsertPrices(main);
      makeCtaBuyLink(main);
    });
    const prices = block.querySelector('.hero-aem__prices');
    const buyLink = block.querySelector('a[href*="buylink"]');

    expect(prices.nextElementSibling).toBe(buyLink.parentElement);
    expect(buyLink.getAttribute('data-store-buy-link')).toBe('');
    expect(buyLink.hasAttribute('data-store-render')).toBe(true);
  });

  it('prefers <insert-prices> over the buylink', async () => {
    const block = await renderFixture(makeCtaBuyLink);
    const prices = block.querySelector('.hero-aem__prices');

    expect(block.textContent).not.toContain('<insert-prices>');
    expect(prices.nextElementSibling.querySelector('a[href*="buylink"]')).toBeTruthy();
  });

  it('leaves an <insert-prices> paragraph outside the block alone', async () => {
    const block = await renderFixture((main) => {
      removeInsertPrices(main);
      main.insertAdjacentHTML('afterbegin', '<div><p>&lt;insert-prices></p></div>');
    });

    expect(block.querySelector('.hero-aem__prices')).toBeTruthy();
    expect(findParagraph(document, '<insert-prices>')).toBeTruthy();
  });
});
