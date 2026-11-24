/**
 * Unit tests for the awards-search block's year filter. The block fetches
 * awards.json without waiting for it, and the accordion block builds the
 * filter's bd-accordion-item on its own schedule, so either can finish first.
 * Each test runs one order and checks that the year checkboxes end up in the
 * item and filter the awards. The design system modules are an empty stub in
 * tests (vitest.config.js).
 */
import {
  afterEach, describe, expect, it, vi,
} from 'vitest';
import { decorateBlocks, decorateSections } from '../../../scripts/lib-franklin.js';

const AWARDS = [
  { Year: '2022', Title: 'AV-Test', Description: 'Top product' },
  { Year: '2023', Title: 'AV-Comparatives', Description: 'Product of the year' },
  { Year: '2022', Title: 'SE Labs', Description: 'AAA' },
];

// the authored section: the awards-search block, then the filter's accordion
const PAGE = `
  <div>
    <div class="awards-search">
      <div><div><a href="/awards.json">/awards.json</a></div></div>
    </div>
    <div class="accordion action-only-on-header">
      <div><div>Year</div></div>
    </div>
  </div>`;

const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });

/** The page decorated up to its blocks, and awards.json held until the test lets it arrive. */
async function setUp() {
  vi.resetModules();
  document.body.innerHTML = `<main>${PAGE}</main>`;
  const main = document.querySelector('main');
  decorateSections(main);
  decorateBlocks(main);

  let arrive;
  const response = new Promise((resolve) => { arrive = resolve; });
  vi.stubGlobal('fetch', vi.fn(() => response));

  const { default: decorateSearch } = await import('../../../blocks/awards-search/awards-search.js');
  const { default: decorateAccordion } = await import('../../../blocks/accordion/accordion.js');
  const search = main.querySelector('.awards-search');
  const accordion = main.querySelector('.accordion');
  return {
    search,
    // lib-franklin decorates the blocks in page order: the search first
    decorateSearch: () => decorateSearch(search),
    decorateAccordion: () => decorateAccordion(accordion),
    dataArrives: async () => {
      arrive({ json: async () => ({ data: AWARDS }) });
      await flush();
    },
  };
}

const yearInputs = (search) => [...search.querySelectorAll('bd-accordion-item input[type="checkbox"]')];
const results = (search) => search.querySelectorAll('.awards-results-container .award-item-container');

describe('awards-search year filter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fills the filter when the accordion is built before the data arrives', async () => {
    const page = await setUp();
    await page.decorateSearch();
    await page.decorateAccordion();
    await page.dataArrives();

    expect(yearInputs(page.search).map((input) => input.value)).toEqual(['2022', '2023']);
    expect(page.search.querySelector('bd-accordion').hasAttribute('without-padding')).toBe(true);
  });

  it('fills the filter when the data arrives before the accordion is built', async () => {
    const page = await setUp();
    await page.decorateSearch();
    await page.dataArrives();
    expect(results(page.search)).toHaveLength(3);

    await page.decorateAccordion();
    await flush();

    expect(yearInputs(page.search).map((input) => input.value)).toEqual(['2022', '2023']);
    expect(page.search.querySelector('bd-accordion').hasAttribute('without-padding')).toBe(true);
  });

  it('fills the filter when the data arrives while the accordion is being built', async () => {
    const page = await setUp();
    await page.decorateSearch();
    const building = page.decorateAccordion();
    await page.dataArrives();
    await building;
    await flush();

    expect(yearInputs(page.search)).toHaveLength(2);
  });

  it('filters the awards by the years ticked, and shows them all again when none is', async () => {
    const page = await setUp();
    await page.decorateSearch();
    await page.decorateAccordion();
    await page.dataArrives();

    const [y2022] = yearInputs(page.search);
    y2022.click();
    expect(results(page.search)).toHaveLength(2);
    y2022.click();
    expect(results(page.search)).toHaveLength(3);
  });
});
