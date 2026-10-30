/**
 * Unit Tests for new-prod-boxes block
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

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock the external dependencies
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    checkIfNotProductPage: vi.fn(() => true),
    generatePageLoadStartedName: vi.fn(() => 'test:page'),
  };
});

// Load mock HTML once
const mockHtml = await readFile(path.join(__dirname, 'new-prod-boxes.mock.html'), 'utf-8');

describe('new-prod-boxes', () => {
  beforeAll(async () => {
    // Setup window mocks
    class ResizeObserverMock {
      constructor(callback) {
        this.callback = callback;
      }

      observe() {
        return this;
      }

      unobserve() {
        return this;
      }

      disconnect() {
        return this;
      }
    }

    window.ResizeObserver = ResizeObserverMock;
    global.ResizeObserver = ResizeObserverMock;

    window.hj = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:3000/en-us/consumer/',
        origin: 'http://localhost:3000',
        protocol: 'http:',
        host: 'localhost:3000',
        hostname: 'localhost',
        pathname: '/en-us/consumer/',
        search: '',
        hash: '',
      },
      writable: true,
    });

    document.body.innerHTML = mockHtml;

    const main = document.createElement('main');
    const sectionDiv = document.createElement('div');
    while (document.body.firstChild) {
      sectionDiv.appendChild(document.body.firstChild);
    }
    main.appendChild(sectionDiv);
    document.body.appendChild(main);

    decorateButtons(main);
    decorateIcons(main);
    decorateTags(main);
    decorateSections(main);
    decorateBlocks(main);

    const block = main.querySelector('.new-prod-boxes');
    const { default: decorate } = await import('../../../blocks/new-prod-boxes/new-prod-boxes.js');
    await decorate(block);
  });

  it('decorates the block', () => {
    const block = document.querySelector('.new-prod-boxes-container');
    const wrapper = block.querySelector('.new-prod-boxes-wrapper');
    expect(block).toBeTruthy();
    expect(wrapper).toBeTruthy();
  });

  it('creates product boxes', () => {
    const prodBoxes = document.querySelectorAll('.prod_box');
    expect(prodBoxes.length).toBe(8);
  });

  it('creates individual and family boxes', () => {
    const individualBoxes = document.querySelectorAll('.individual-box');
    const familyBoxes = document.querySelectorAll('.family-box');

    expect(individualBoxes.length).toBe(4);
    expect(familyBoxes.length).toBe(4);
  });

  it('creates green tags for "Most Popular" products', () => {
    const greenTags = document.querySelectorAll('.greenTag2:not(.empty)');

    expect(greenTags.length).toBe(2);

    greenTags.forEach((tag) => {
      expect(tag.textContent).toBe('Most Popular');
    });

    greenTags.forEach((tag) => {
      expect(tag.textContent).toBe('Most Popular');
    });
  });

  it('creates price containers', () => {
    const priceContainers = document.querySelectorAll('.hero-aem__price');
    expect(priceContainers.length).toBe(8);
  });

  it('creates buy buttons with store attributes', () => {
    const buyButtons = document.querySelectorAll('[data-store-buy-link]');
    expect(buyButtons.length).toBe(8);
  });

  it('creates benefits lists', () => {
    const benefitsLists = document.querySelectorAll('.benefitsLists');
    expect(benefitsLists.length).toBe(8);
  });

  it('sets store context on product boxes', () => {
    const prodBoxes = document.querySelectorAll('.prod_box');
    expect(prodBoxes.length).toBe(8);

    const expectedProductIds = ['ts_i', 'ps_i', 'us_i', 'us_pi', 'ts_f', 'ps_f', 'us_f', 'us_pf'];

    prodBoxes.forEach((box, index) => {
      const product = box.querySelector(':scope > bd-context > bd-product');
      expect(product).toBeTruthy();
      expect(product.getAttribute('product-id')).toBe(expectedProductIds[index]);
      const innerProductBox = product.querySelector(':scope > .inner_prod_box');
      const planSwitcher = innerProductBox.querySelector(':scope > .plan-switcher');
      const option = innerProductBox.querySelector(':scope > bd-option');
      expect(option).toBeTruthy();
      if (planSwitcher) {
        expect(planSwitcher.nextElementSibling).toBe(option);
      }
      expect(option.querySelector(':scope > .hero-aem__prices')).toBeTruthy();
    });
  });

  it('creates titles with links', () => {
    const titles = document.querySelectorAll('.prod_box h4 a');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('creates old price and new price elements', () => {
    const oldPrices = document.querySelectorAll('.prod-oldprice');
    const newPrices = document.querySelectorAll('.prod-newprice');

    expect(oldPrices.length).toBe(8);
    expect(newPrices.length).toBe(8);
  });

  it('creates save discount spans', () => {
    const saveSpans = document.querySelectorAll('.prod-save');
    expect(saveSpans.length).toBe(8);
  });

  it('adds section class to parent', () => {
    const section = document.querySelector('.section');
    expect(section.classList.contains('we-container')).toBe(true);
  });

  it('sets correct store option values', () => {
    const prodOptions = document.querySelectorAll('.prod_box > bd-context > bd-product > .inner_prod_box > bd-option');
    expect(prodOptions.length).toBe(8);

    // Individual products have 5 users, 1 year (ts_i/5/1, ps_i/5/1, etc.)
    const individualOptions = document.querySelectorAll('.individual-box > bd-context > bd-product > .inner_prod_box > bd-option');
    individualOptions.forEach((option) => {
      expect(option.getAttribute('devices')).toBe('5');
      expect(option.getAttribute('subscription')).toBe('1');
    });

    // Family products have 25 users, 1 year (ts_f/25/1, ps_f/25/1, etc.)
    const familyOptions = document.querySelectorAll('.family-box > bd-context > bd-product > .inner_prod_box > bd-option');
    familyOptions.forEach((option) => {
      expect(option.getAttribute('devices')).toBe('25');
      expect(option.getAttribute('subscription')).toBe('1');
    });
  });
});
