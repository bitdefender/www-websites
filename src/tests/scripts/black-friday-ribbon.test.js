import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';

// TODO(DEX-29605): remove after CyberSales 2026, with scripts/black-friday/

// the ribbon's stylesheet: jsdom never loads it
vi.mock('../../scripts/lib-franklin.js', async (importOriginal) => ({
  ...(await importOriginal()),
  loadCSS: vi.fn(async () => {}),
}));

const DURING = new Date('2026-11-20T12:00:00+02:00');

// page.js reads the URL once, when it is imported, so each test loads a fresh copy
const loadRibbon = async (path, now = DURING) => {
  window.history.replaceState({}, '', path);
  vi.setSystemTime(now);
  vi.resetModules();
  return import('../../scripts/black-friday/ribbon.js');
};

// a decorated main from authored sections, as scripts.js hands it to addBlackFridayRibbon
const decoratedMain = async (...sections) => {
  const { decorateBlocks, decorateSections } = await import('../../scripts/lib-franklin.js');
  document.body.innerHTML = `<main>${sections.map((section) => `<div>${section}</div>`).join('')}</main>`;
  const main = document.querySelector('main');
  decorateSections(main);
  decorateBlocks(main);
  return main;
};

const NEWS_BAR = '<div class="news-bar"><div><div>Authored</div></div></div>';
const TOP_BLUE = '<p>Blue ribbon</p><div class="section-metadata"><div><div>style</div><div>top_blue</div></div></div>';
const HERO = '<div class="hero"><div><div>Hero</div></div></div>';

const topRibbon = async (path) => {
  const ribbon = await loadRibbon(path);
  const main = await decoratedMain(NEWS_BAR, HERO);
  ribbon.addBlackFridayRibbon(main);
  return { ...ribbon, block: main.querySelector('.news-bar') };
};

describe('getBlackFridayRibbon', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState({}, '', '/');
  });

  it('shows a static ribbon on the pages with a discount of their own', async () => {
    const { getBlackFridayRibbon } = await loadRibbon('/en-us/consumer/vpn');
    expect(getBlackFridayRibbon()).toEqual({ linked: false });
  });

  it('links the ribbon to the Solutions page on the other campaign pages', async () => {
    const { getBlackFridayRibbon } = await loadRibbon('/de-de/consumer/antivirus');
    expect(getBlackFridayRibbon()).toEqual({ linked: true });
  });

  it('links Small Office Security only on en-us and en-gb', async () => {
    expect((await loadRibbon('/en-gb/consumer/small-office-security')).getBlackFridayRibbon()).toEqual({ linked: true });
    expect((await loadRibbon('/fr-fr/consumer/small-office-security')).getBlackFridayRibbon()).toEqual({ linked: false });
  });

  it('shows nothing on pages outside the campaign, or in a language it has no copy for', async () => {
    expect((await loadRibbon('/en-us/consumer/deals')).getBlackFridayRibbon()).toBeNull();
    expect((await loadRibbon('/ja-jp/consumer/vpn')).getBlackFridayRibbon()).toBeNull();
  });

  it('keeps showing the ribbon after Black Friday, since CyberSales has no end date yet', async () => {
    const path = '/en-us/consumer/vpn';
    expect((await loadRibbon(path, new Date('2026-12-02T11:00:00+02:00'))).getBlackFridayRibbon()).not.toBeNull();
    expect((await loadRibbon(path, new Date('2027-01-15T12:00:00+02:00'))).getBlackFridayRibbon()).not.toBeNull();
  });
});

describe('addBlackFridayRibbon', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState({}, '', '/');
  });

  it('picks only the news bar at the top of the page', async () => {
    const { addBlackFridayRibbon, isBlackFridayRibbon } = await loadRibbon('/en-us/consumer/');
    const main = await decoratedMain(NEWS_BAR, HERO, NEWS_BAR);
    addBlackFridayRibbon(main);

    const [top, lower] = main.querySelectorAll('.news-bar');
    expect(main.querySelectorAll(':scope > .section')).toHaveLength(3);
    expect(isBlackFridayRibbon(top)).toBe(true);
    expect(isBlackFridayRibbon(lower)).toBe(false);
  });

  it('adds a ribbon at the top in place of the blue top ribbon, leaving news bars further down', async () => {
    const { addBlackFridayRibbon, isBlackFridayRibbon } = await loadRibbon('/en-us/consumer/vpn');
    const main = await decoratedMain(TOP_BLUE, HERO, NEWS_BAR);
    addBlackFridayRibbon(main);

    const sections = main.querySelectorAll(':scope > .section');
    expect(main.querySelector('.top_blue')).toBeNull();
    expect(sections).toHaveLength(3);
    expect(sections[0].classList).toContain('news-bar-container');
    const [added, authored] = main.querySelectorAll('.news-bar');
    expect(isBlackFridayRibbon(added)).toBe(true);
    expect(isBlackFridayRibbon(authored)).toBe(false);
  });

  it('adds a ribbon at the top of a page without one', async () => {
    const { addBlackFridayRibbon, isBlackFridayRibbon } = await loadRibbon('/en-us/consumer/individual');
    const main = await decoratedMain(HERO);
    addBlackFridayRibbon(main);

    const first = main.querySelector(':scope > .section');
    expect(first.querySelector('.news-bar.block')).not.toBeNull();
    expect(isBlackFridayRibbon(first.querySelector('.news-bar'))).toBe(true);
    expect(main.querySelector('.hero')).not.toBeNull();
  });

  it('leaves pages outside the campaign as they are', async () => {
    const { addBlackFridayRibbon, isBlackFridayRibbon } = await loadRibbon('/en-us/consumer/deals');
    const main = await decoratedMain(TOP_BLUE, NEWS_BAR);
    addBlackFridayRibbon(main);

    expect(main.querySelector('.top_blue')).not.toBeNull();
    expect(main.querySelectorAll('.news-bar')).toHaveLength(1);
    expect(isBlackFridayRibbon(main.querySelector('.news-bar'))).toBe(false);
  });
});

describe('renderBlackFridayRibbon', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    window.hlx = { codeBasePath: '/_src' };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.hlx;
    window.history.replaceState({}, '', '/');
  });

  it('replaces the news bar with the translated ribbon, showing the page\'s biggest discount', async () => {
    const { renderBlackFridayRibbon, block } = await topRibbon('/de-de/consumer/vpn');
    await renderBlackFridayRibbon(block);

    expect(block.closest('.section').classList).toContain('bf-25');
    expect(block.textContent).not.toContain('Authored');
    expect(block.querySelector('strong').textContent).toBe('Zeitlich begrenzte Angebote zum CyberSales!');
    expect(block.querySelector('.bf-subtext [data-store-context-discount="max-percentage"]')).not.toBeNull();
    expect(block.querySelector('img').getAttribute('src')).toBe('/_src/scripts/black-friday/images/ribbon-tag-blue.png');
    expect(block.querySelector('a, bd-context')).toBeNull();
  });

  it('links to the locale\'s Solutions page, with the Solutions plans in their own store context', async () => {
    const { renderBlackFridayRibbon, block } = await topRibbon('/en-us/consumer/antivirus');
    await renderBlackFridayRibbon(block);

    expect(block.querySelector('a').getAttribute('href')).toBe('/en-us/consumer/');
    const context = block.querySelector('a > bd-context');
    expect([...context.querySelectorAll('bd-product')].map((p) => p.getAttribute('product-id')))
      .toEqual(['ts_f', 'ps_f', 'us_f', 'us_pf']);
    expect(context.querySelector('[data-store-context-discount]')).not.toBeNull();
  });

  it('leaves Ultimate Security Plus Family out outside en-us', async () => {
    const { renderBlackFridayRibbon, block } = await topRibbon('/en-gb/consumer/antivirus');
    await renderBlackFridayRibbon(block);

    expect(block.querySelector('a').getAttribute('href')).toBe('/en-gb/consumer/');
    expect(block.querySelector('bd-product[product-id="us_pf"]')).toBeNull();
  });
});
