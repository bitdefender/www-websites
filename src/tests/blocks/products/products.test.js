/**
 * Unit tests for the products block.
 *
 * These are characterization tests: they pin down the current rendered output so the
 * block can be refactored safely (DEX-28870). Fixtures are trimmed copies of live pages:
 * - products-plans: /en-us/consumer/antivirus-for-mac (plans variant, device selector)
 * - products-compare: /en-us/consumer/vpn (compare variant, featured card, monthly price)
 * - products-switch: synthetic, covers product switching, dynamic price texts,
 *   trial durations, blue pill, highlight and featured text
 */
import {
  describe, it, expect, beforeAll, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections, decorateIcons, decorateTags,
} from '../../../scripts/lib-franklin.js';
import { checkIfNotProductPage, createNanoBlock } from '../../../scripts/utils/utils.js';
import { parsePlans, updatePriceConditionText } from '../../../blocks/products/products.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    checkIfNotProductPage: vi.fn(() => false),
  };
});

class ResizeObserverMock {
  observe() { return this; }

  unobserve() { return this; }

  disconnect() { return this; }
}

window.ResizeObserver = ResizeObserverMock;
global.ResizeObserver = ResizeObserverMock;
// icons are fetched by decorateIcons, there is no server in tests
global.fetch = vi.fn(async () => ({ ok: false }));

/**
 * Loads a fixture into the document, runs the same decoration as the page pipeline
 * and decorates the products block.
 * @param {string} fixture fixture name, without the `.mock.html` suffix
 * @returns {Promise<{section: HTMLElement, block: HTMLElement}>}
 */
async function renderFixture(fixture) {
  const html = await readFile(path.join(__dirname, `${fixture}.mock.html`), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateIcons(main);
  decorateTags(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.products');
  const { default: decorate } = await import('../../../blocks/products/products.js');
  decorate(block);

  return { section: main.querySelector('.section'), block };
}

const getCards = (block) => [...block.querySelectorAll(':scope > .product-card')];

describe('products block - plans variant (antivirus-for-mac)', () => {
  let section;
  let block;

  beforeAll(async () => {
    vi.mocked(checkIfNotProductPage).mockReturnValue(false);
    ({ section, block } = await renderFixture('products-plans'));
  });

  it('matches the rendered snapshot', () => {
    expect(block).toMatchSnapshot();
  });

  it('wraps the section content in a section store context', () => {
    const sectionContext = section.querySelector(':scope > bd-context.store-section-context');
    expect(sectionContext).toBeTruthy();
    expect(section.children).toHaveLength(1);
    [...sectionContext.children].forEach((child) => {
      expect(child.classList.contains('store-section-content')).toBe(true);
    });
  });

  it('turns every row into a product card', () => {
    expect(getCards(block)).toHaveLength(3);
  });

  it('wraps each card in a store context built from the PlansN metadata', () => {
    const expected = [
      { productId: 'mac', devices: '1', subscription: '1' },
      { productId: 'mac', devices: '1', subscription: '2' },
      { productId: 'mac', devices: '1', subscription: '3' },
    ];
    getCards(block).forEach((card, idx) => {
      const product = card.querySelector(':scope > bd-context > bd-product');
      const option = product.querySelector(':scope > bd-option');
      expect(product.getAttribute('product-id')).toBe(expected[idx].productId);
      expect(option.getAttribute('devices')).toBe(expected[idx].devices);
      expect(option.getAttribute('subscription')).toBe(expected[idx].subscription);
      expect(option.dataset.layerEvent).toBe('info');
      expect(option.querySelector(':scope > .store-option-content')).toBeTruthy();
    });
  });

  it('renders a device selector with the default selection active', () => {
    getCards(block).forEach((card) => {
      const items = [...card.querySelectorAll('.variant-selector li')];
      expect(items.map((li) => li.textContent)).toEqual(['1', '3']);
      expect(items.map((li) => li.dataset.storeSetDevices)).toEqual(['1', '3']);
      expect(items[0].classList.contains('active')).toBe(true);
      expect(items[1].classList.contains('active')).toBe(false);
      // device-only selectors do not switch the product
      items.forEach((li) => expect(li.dataset.storeSetId).toBeUndefined());
      expect(card.querySelector('.variant-selector').style.display).toBe('');
    });
  });

  it('hoists the plan selector above bd-option and keeps its authored position', () => {
    const [card] = getCards(block);
    const product = card.querySelector('bd-product');
    const selector = product.querySelector(':scope > .plan-selector-hoisted');
    expect(selector).toBeTruthy();
    expect(selector.nextElementSibling.tagName).toBe('BD-OPTION');

    // authored as the 5th child: h3, highlight, hr, "Number of devices", {Plans}
    expect(selector.style.order).toBe('5');
    const content = card.querySelector('.store-option-content');
    const orders = [...content.children].map((child) => Number(child.style.order));
    expect(orders).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 11]);
  });

  it('moves the selection to the clicked plan', () => {
    const [card] = getCards(block);
    const [first, second] = card.querySelectorAll('.variant-selector li');
    second.click();
    expect(second.classList.contains('active')).toBe(true);
    expect(first.classList.contains('active')).toBe(false);
    first.click();
    expect(first.classList.contains('active')).toBe(true);
  });

  it('renders new and old prices bound to the store', () => {
    getCards(block).forEach((card) => {
      const newPrice = card.querySelector('.price .new-price [data-store-price]');
      expect(newPrice.getAttribute('data-store-price')).toBe('discounted||full');
      expect(card.querySelector('.new-price sup')).toBeNull();

      const oldPriceWrapper = card.querySelector('.price[data-store-hide]');
      expect(oldPriceWrapper.getAttribute('data-store-hide')).toBe('!it.option.price.discounted');
      expect(oldPriceWrapper.getAttribute('data-store-hide-type')).toBe('visibility');
      expect(oldPriceWrapper.querySelector('.old-price').textContent.trim()).toBe('Old Price');
      expect(oldPriceWrapper.querySelector('del').getAttribute('data-store-price')).toBe('full');
    });
  });

  it('renders the savings highlight as a percentage', () => {
    const [card] = getCards(block);
    const highlight = card.querySelector('.highlight.nanoblock');
    expect(highlight.textContent).toBe('Save {{=it.option.discount.percentage}}');
    expect(highlight.classList.contains('await-loader')).toBe(true);
  });

  it('renders featured savings as a value and falls back to an empty label', () => {
    const texts = getCards(block).map((card) => card.querySelector('.featured.nanoblock').textContent);
    expect(texts).toEqual([
      'Save {{=it.option.discount.value}}',
      ' {{=it.option.discount.value}}',
      ' {{=it.option.discount.value}}',
    ]);
  });

  it('marks cards holding a featured nanoblock as featured', () => {
    // FeaturedSavings renders a .featured element, so every card here is featured
    getCards(block).forEach((card) => expect(card.classList.contains('featured')).toBe(true));
  });

  it('renders the price conditions per card', () => {
    const texts = getCards(block).map((card) => card.querySelector('.price.condition').textContent);
    expect(texts).toEqual(['*For the first year', '*For the first 2 years', '*For the first 3 years']);
  });

  it('rewrites #buylink anchors into store buy links', () => {
    getCards(block).forEach((card) => {
      const buyLink = card.querySelector('[data-store-buy-link]');
      expect(buyLink.getAttribute('href')).toBe('#');
      expect(buyLink.dataset.storeBuyLink).toBe('');
      expect(buyLink.hasAttribute('data-store-render')).toBe(true);
    });
    // other links are left untouched
    const terms = block.querySelectorAll('a[href$="#terms-of-use"]');
    expect(terms).toHaveLength(3);
    terms.forEach((link) => expect(link.hasAttribute('data-store-buy-link')).toBe(false));
  });

  it('renders nanoblocks in the section default content', () => {
    const lowestPrice = section.querySelector('.default-content-wrapper .nanoblock');
    expect(lowestPrice.tagName).toBe('P');
    expect(lowestPrice.classList.contains('await-loader')).toBe(true);
    expect(lowestPrice.textContent).toBe(
      'Start today for as low as {{=it.state.price.discounted.monthly.min || it.state.price.full.monthly.min}}/mo',
    );
  });
});

describe('products block - compare variant (vpn)', () => {
  let block;

  beforeAll(async () => {
    vi.mocked(checkIfNotProductPage).mockReturnValue(false);
    ({ block } = await renderFixture('products-compare'));
  });

  it('matches the rendered snapshot', () => {
    expect(block).toMatchSnapshot();
  });

  it('only wraps cards that have plans in a store context', () => {
    const [free, premium, other] = getCards(block);
    expect(free.querySelector('bd-context')).toBeNull();
    expect(other.querySelector('bd-context')).toBeNull();
    expect(premium.querySelector('bd-product').getAttribute('product-id')).toBe('vpn');
    const option = premium.querySelector('bd-option');
    expect(option.getAttribute('devices')).toBe('10');
    expect(option.getAttribute('subscription')).toBe('1');
  });

  it('marks only the card with a featured nanoblock as featured', () => {
    const featured = getCards(block).map((card) => card.classList.contains('featured'));
    expect(featured).toEqual([false, true, false]);
  });

  it('adds a hidden featured placeholder after the heading of non-featured cards', () => {
    const [free, , other] = getCards(block);
    [free, other].forEach((card) => {
      const placeholder = card.querySelector('.featured.nanoblock');
      expect(placeholder).toBeTruthy();
      expect(placeholder.style.visibility).toBe('hidden');
      expect(placeholder.previousElementSibling.tagName).toBe('HR');
      expect(placeholder.previousElementSibling.previousElementSibling.tagName).toBe('H3');
    });
  });

  it('replaces {percent} in featured savings with the discount percentage', () => {
    const [, premium] = getCards(block);
    expect(premium.querySelector('.featured.nanoblock').textContent)
      .toBe('Best Value! Go Annual & Save {{=it.option.discount.percentage}}');
  });

  it('hides the plan selector when there is a single plan', () => {
    const [, premium] = getCards(block);
    const selector = premium.querySelector('.variant-selector');
    expect(selector.style.display).toBe('none');
    expect(selector.querySelectorAll('li')).toHaveLength(1);
  });

  it('renders the monthly price with the default /mo suffix', () => {
    const [, premium] = getCards(block);
    const newPrice = premium.querySelector('.new-price');
    expect(newPrice.querySelector('[data-store-price]').getAttribute('data-store-price'))
      .toBe('discounted-monthly||full-monthly');
    expect(newPrice.querySelector('sup').textContent).toBe('/mo');
  });

  it('replaces {BilledPrice} in the price condition with a store price', () => {
    const [, premium] = getCards(block);
    const condition = premium.querySelector('.price.condition > em');
    expect(condition.textContent).toBe('Billed  for the first year');
    const billed = condition.querySelector('em');
    expect(billed.getAttribute('data-store-price')).toBe('discounted||full');
    expect(billed.hasAttribute('data-store-render')).toBe(true);
  });

  it('flags list items with underlined text as important', () => {
    const [free, premium] = getCards(block);
    free.querySelectorAll('li').forEach((li) => expect(li.classList.contains('icon-important')).toBe(true));
    premium.querySelectorAll('ul:not(.variant-selector) li').forEach((li) => {
      expect(li.classList.contains('icon-important')).toBe(false);
    });
  });

  it('marks icon-only paragraphs in featured cards as OS availability', () => {
    const [, premium] = getCards(block);
    const icons = premium.querySelector('.os-availability');
    expect(icons.querySelectorAll('.icon')).toHaveLength(4);
    expect(icons.nextElementSibling.classList.contains('os-availability-text')).toBe(true);
    expect(icons.nextElementSibling.textContent).toBe('Works on all major platforms');
  });
});

describe('products block - product switching (synthetic)', () => {
  let section;
  let block;

  beforeAll(async () => {
    vi.mocked(checkIfNotProductPage).mockReturnValue(true);
    ({ section, block } = await renderFixture('products-switch'));
  });

  it('matches the rendered snapshot', () => {
    expect(block).toMatchSnapshot();
  });

  it('uses the "all" store event on non-product pages', () => {
    getCards(block).forEach((card) => {
      expect(card.querySelector('bd-option').dataset.layerEvent).toBe('all');
    });
  });

  it('renders a product selector that switches product, devices and subscription', () => {
    const [card] = getCards(block);
    expect(card.querySelector('bd-product').getAttribute('product-id')).toBe('ts_i');
    const items = [...card.querySelectorAll('.variant-selector li')];
    expect(items.map((li) => li.textContent)).toEqual(['Individual', 'Family']);
    expect(items.map((li) => ({ ...li.dataset }))).toEqual([
      {
        storeAction: '', storeSetId: 'ts_i', storeSetDevices: '5', storeSetSubscription: '1',
      },
      {
        storeAction: '', storeSetId: 'ts_f', storeSetDevices: '25', storeSetSubscription: '1',
      },
    ]);
    expect(items[0].classList.contains('active')).toBe(true);
  });

  it('applies the per-card trial duration to buy links', () => {
    const buyLinks = getCards(block).map((card) => card.querySelector('[data-store-buy-link]'));
    expect(buyLinks.map((link) => link.dataset.storeBuyLink)).toEqual(['30', '60']);
  });

  it('rewrites /buy/ links into store buy links and keeps other links', () => {
    const [first, second] = getCards(block);
    expect(first.querySelector('[data-store-buy-link]').getAttribute('href')).toBe('#');
    const findOutMore = second.querySelector('a[href="/en-us/consumer/premium-security"]');
    expect(findOutMore).toBeTruthy();
    expect(findOutMore.hasAttribute('data-store-buy-link')).toBe(false);
  });

  it('uses the translated month suffix for the new price only', () => {
    const [card] = getCards(block);
    expect(card.querySelector('.new-price sup').textContent).toBe('/lună');
    // the old price suffix is not translatable today
    expect(card.querySelector('.old-price sup').textContent).toBe('/mo');
    expect(card.querySelector('.old-price del').getAttribute('data-store-price')).toBe('full-monthly');
    expect(card.querySelector('.old-price').textContent.trim()).toBe('Was /mo');
  });

  it('updates the price condition when switching plans and keeps the store price element', () => {
    const [card] = getCards(block);
    const condition = card.querySelector('.price.condition em');
    const billed = condition.querySelector('em[data-store-price]');
    const [individual, family] = card.querySelectorAll('.variant-selector li');

    family.click();
    expect(condition.textContent).toBe(' Family plan billed  yearly');
    expect(condition.querySelector('em[data-store-price]')).toBe(billed);

    individual.click();
    expect(condition.textContent).toBe('Billed  yearly');
    expect(condition.querySelector('em[data-store-price]')).toBe(billed);
  });

  it('renders the blue pill with its icon', () => {
    const [card] = getCards(block);
    const pill = card.querySelector('.blue-pill-container.nanoblock .blue-pill');
    expect(pill.querySelector('.icon').classList.contains('icon-star')).toBe(true);
    expect(pill.querySelector('.blue-pill-text').textContent).toBe('Most popular');
  });

  it('replaces the percent variable in highlight and featured texts', () => {
    const [first, second] = getCards(block);
    const highlight = first.querySelector('.highlight.nanoblock');
    expect(highlight.textContent).toBe('Save {{=it.option.discount.percentage}} today');
    expect(highlight.getAttribute('data-store-hide')).toBe('!it.option.price.discounted');

    const featured = second.querySelector('.featured.nanoblock');
    expect(featured.textContent).toBe('Best value - save {{=it.option.discount.percentage}}');
    expect(featured.classList.contains('await-loader')).toBe(true);
    expect(second.classList.contains('featured')).toBe(true);
    expect(first.classList.contains('featured')).toBe(false);
  });

  it('marks the text next to the product image', () => {
    getCards(block).forEach((card) => {
      const text = card.querySelector('.img-adjacent-text');
      expect(text).toBeTruthy();
      expect(text.previousElementSibling.querySelector('img')).toBeTruthy();
    });
  });

  it('marks the paragraph introducing a list', () => {
    const [card] = getCards(block);
    const header = card.querySelector('.ul-header-text');
    expect(header.textContent).toBe('Includes:');
    expect(header.nextElementSibling.tagName).toBe('UL');
  });

  it('renders the lowest yearly price in the section default content', () => {
    const lowestPrice = section.querySelector('.default-content-wrapper .nanoblock');
    expect(lowestPrice.textContent).toBe(
      'Starting at {{=it.state.price.discounted.min || it.state.price.full.min}}',
    );
  });
});

describe('products block - nanoblock registry', () => {
  it('renders its own price nanoblock when another block registered the same name', async () => {
    vi.mocked(checkIfNotProductPage).mockReturnValue(false);
    // e.g. products-sideview registers its own `price` nanoblock
    createNanoBlock('price', () => {
      const otherPrice = document.createElement('div');
      otherPrice.classList.add('other-price');
      return otherPrice;
    });

    const { block } = await renderFixture('products-plans');
    expect(block.querySelector('.other-price')).toBeNull();
    expect(block.querySelectorAll('.price .new-price')).toHaveLength(3);
  });
});

describe('parsePlans', () => {
  it('reads product, devices and subscription for every card', () => {
    expect(parsePlans({
      plans1: '{[ 1, mac, 1u-1y, 3, mac, 3u-1y], 1}',
      plans2: '{[ 1, mac, 1u-2y, 3, mac, 3u-2y], 3}',
    })).toEqual([
      { productCode: 'mac', devices: '1', subscription: '1' },
      { productCode: 'mac', devices: '3', subscription: '2' },
    ]);
  });

  it('uses the devices of the first variant when the default selection is a label', () => {
    expect(parsePlans({
      plans1: '{[Individual, ts_i, 5u-1y, Family, ts_f, 25u-1y], Individual}',
    })).toEqual([{ productCode: 'ts_i', devices: '5', subscription: '1' }]);
  });

  it('places plans by their suffix and appends plans without one', () => {
    const plans = parsePlans({
      plans3: '{[10, vpn, 10u-2y], 10}',
      plans: '{[10, vpn, 10u-1y], 10}',
    });
    expect(plans[2]).toEqual({ productCode: 'vpn', devices: '10', subscription: '2' });
    expect(plans[3]).toEqual({ productCode: 'vpn', devices: '10', subscription: '1' });
  });

  it('ignores other metadata and malformed plans', () => {
    expect(parsePlans({
      style: 'wide',
      plans1: '',
      plans3: '{[10, vpn, unlimited], 10}',
    })).toEqual([]);
  });

  it('leaves the subscription empty when the variant has none', () => {
    expect(parsePlans({ plans1: '{[10, vpn, 10u], 10}' }))
      .toEqual([{ productCode: 'vpn', devices: '10', subscription: undefined }]);
  });
});

describe('updatePriceConditionText', () => {
  const createCondition = () => {
    const condition = document.createElement('em');
    condition.innerHTML = 'Billed <em data-store-price="discounted||full"></em> for the first year';
    return condition;
  };

  it('replaces the text around the store price and keeps the store price element', () => {
    const condition = createCondition();
    const storePrice = condition.querySelector('em');
    updatePriceConditionText(condition, 'Pay {BilledPrice} every 2 years');
    expect(condition.textContent).toBe('Pay  every 2 years');
    expect(condition.querySelector('em')).toBe(storePrice);
    expect(condition.firstChild.textContent).toBe('Pay ');
  });

  it('supports texts with only a prefix or only a suffix', () => {
    const condition = createCondition();
    updatePriceConditionText(condition, '{BilledPrice} per year');
    expect(condition.innerHTML).toBe('<em data-store-price="discounted||full"></em> per year');
    updatePriceConditionText(condition, 'Billed {BilledPrice}');
    expect(condition.innerHTML).toBe('Billed <em data-store-price="discounted||full"></em>');
  });

  it('replaces the whole content when there is no store price', () => {
    const condition = createCondition();
    updatePriceConditionText(condition, 'Free for 30 days');
    expect(condition.innerHTML).toBe('Free for 30 days');
  });
});
