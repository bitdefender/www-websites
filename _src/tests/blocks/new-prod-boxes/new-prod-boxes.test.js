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
vi.mock('../../../scripts/utils/utils.js', () => ({
  checkIfNotProductPage: vi.fn(() => true),
  generatePageLoadStartedName: vi.fn(() => 'test:page'),
}));

// Load mock HTML once
const mockHtml = await readFile(path.join(__dirname, 'new-prod-boxes.mock.html'), 'utf-8');

describe('new-prod-boxes', () => {
  beforeAll(async () => {
    // Setup window mocks
    window.hj = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:3000/en-us/consumer/', hostname: 'localhost:3000' },
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
    const greenTags = document.querySelectorAll('.greenTag2');
    expect(greenTags.length).toBe(2);

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
    const storeContextBoxes = document.querySelectorAll('[data-store-context]');
    expect(storeContextBoxes.length).toBe(8);

    storeContextBoxes.forEach((box) => {
      expect(box.dataset.storeDepartment).toBe('consumer');
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

  it('sets correct data-store-option values', () => {
    const prodBoxes = document.querySelectorAll('.prod_box[data-store-option]');
    expect(prodBoxes.length).toBe(8);

    // Individual products have 5 users, 1 year (ts_i/5/1, ps_i/5/1, etc.)
    const individualBoxes = document.querySelectorAll('.individual-box[data-store-option]');
    individualBoxes.forEach((box) => {
      expect(box.dataset.storeOption).toBe('5-1');
    });

    // Family products have 25 users, 1 year (ts_f/25/1, ps_f/25/1, etc.)
    const familyBoxes = document.querySelectorAll('.family-box[data-store-option]');
    familyBoxes.forEach((box) => {
      expect(box.dataset.storeOption).toBe('25-1');
    });
  });
});
