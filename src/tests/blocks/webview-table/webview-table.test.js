import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

vi.mock('@repobit/dex-utils', () => ({
  debounce: (callback) => callback,
}));

vi.mock('../../../scripts/scripts.js', () => ({
  getLanguageCountryFromPath: vi.fn(() => {
    const [language, country] = window.location.pathname.split('/')[1].split('-');
    return { language, country };
  }),
}));

vi.mock('../../../scripts/utils/utils.js', () => ({
  matchHeights: vi.fn(),
}));

const PRICE_ROWS = [
  {
    Country: 'Germany',
    'Country Code': 'DE',
    Currency: 'EUR',
    'Basic MSRP Monthly Prices': '4.99',
    'PRO MSRP Monthly Prices': '12.99',
  },
  {
    Country: 'United States',
    'Country Code': 'US',
    Currency: 'USD',
    'Basic MSRP Monthly Prices': '4.99',
    'PRO MSRP Monthly Prices': '12.99',
  },
  {
    Country: 'Japan',
    'Country Code': 'JP',
    Currency: 'JPY',
    'Basic MSRP Monthly Prices': '499',
    'PRO MSRP Monthly Prices': '1999',
  },
];
let warnSpy;

function mockPriceResponse(data = PRICE_ROWS) {
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ data }),
  });
}

function createTable({ placeholders = true } = {}) {
  const section = document.createElement('div');
  section.className = 'section';
  section.innerHTML = `
    <div class="webview-table fixed-font-size">
      <div><div></div></div>
      <div>
        <div></div>
        <div><p>Basic</p></div>
        <div><p>PRO</p></div>
      </div>
      <div>
        <div><p>Monthly price</p></div>
        <div>
          <h4><strong>${placeholders ? '{realcheck_price}/month' : 'Authored price'}</strong></h4>
        </div>
        <div>
          <h4><strong>${placeholders ? '{realcheck_price} /month' : 'Authored price'}</strong></h4>
        </div>
      </div>
    </div>`;
  document.body.append(section);
  return section.querySelector('.webview-table');
}

async function loadDecorate() {
  return (await import('../../../blocks/webview-table/webview-table.js')).default;
}

describe('webview-table RealCheck prices', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.stubGlobal('fetch', vi.fn());
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    document.body.innerHTML = '';
    window.history.replaceState({}, '', '/de-de/consumer/realcheck');
  });

  it('maps Germany Basic and PRO prices by placeholder order', async () => {
    mockPriceResponse();
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    const prices = [...block.querySelectorAll('h4')];
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith('/common/realcheck-prices.json');
    expect(prices[0].textContent).toBe('4,99\u00a0€/month');
    expect(prices[1].textContent).toBe('12,99\u00a0€ /month');
    expect(prices.every((price) => !price.hidden)).toBe(true);
  });

  it.each([
    ['en-us', 'USD', 4.99, 12.99],
    ['ja-jp', 'JPY', 499, 1999],
  ])('formats %s prices using the sheet currency', async (locale, currency, basic, pro) => {
    window.history.replaceState({}, '', `/${locale}/consumer/realcheck`);
    mockPriceResponse();
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    const prices = [...block.querySelectorAll('h4')];
    expect(prices[0].textContent).toBe(`${formatter.format(basic)}/month`);
    expect(prices[1].textContent).toBe(`${formatter.format(pro)} /month`);
  });

  it('preserves authored markup and surrounding text', async () => {
    mockPriceResponse();
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    expect(block.querySelector('h4 strong')).toBeTruthy();
    expect(block.querySelector('h4 strong').textContent).toContain('/month');
    expect(block.textContent).not.toContain('{realcheck_price}');
  });

  it('does not request the feed when no placeholder is authored', async () => {
    const decorate = await loadDecorate();
    const block = createTable({ placeholders: false });

    await decorate(block);

    expect(fetch).not.toHaveBeenCalled();
    expect(block.querySelector('h4').hidden).toBe(false);
  });

  it('shares one feed request between matching blocks', async () => {
    mockPriceResponse();
    const decorate = await loadDecorate();
    const firstBlock = createTable();
    const secondBlock = createTable();

    await Promise.all([decorate(firstBlock), decorate(secondBlock)]);

    expect(fetch).toHaveBeenCalledOnce();
    expect(secondBlock.textContent).toContain('12,99\u00a0€');
  });

  it.each([
    ['an HTTP error', () => fetch.mockResolvedValue({ ok: false, status: 500 })],
    ['malformed JSON', () => fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
    })],
    ['a response without data', () => fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ total: 0 }),
    })],
    ['an unknown country', () => mockPriceResponse(PRICE_ROWS.filter((row) => row['Country Code'] !== 'DE'))],
  ])('keeps price headings hidden for %s', async (description, setupResponse) => {
    setupResponse();
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    expect([...block.querySelectorAll('h4')].every((price) => price.hidden)).toBe(true);
    expect(block.querySelectorAll('h4')[0].textContent).toContain('{realcheck_price}');
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('keeps both headings hidden for an invalid currency', async () => {
    mockPriceResponse([{ ...PRICE_ROWS[0], Currency: 'EURO' }]);
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    expect([...block.querySelectorAll('h4')].every((price) => price.hidden)).toBe(true);
  });

  it('reveals valid prices while keeping a missing individual price hidden', async () => {
    mockPriceResponse([{
      ...PRICE_ROWS[0],
      'PRO MSRP Monthly Prices': '',
    }]);
    const decorate = await loadDecorate();
    const block = createTable();

    await decorate(block);

    const prices = [...block.querySelectorAll('h4')];
    expect(prices[0].hidden).toBe(false);
    expect(prices[0].textContent).toBe('4,99\u00a0€/month');
    expect(prices[1].hidden).toBe(true);
  });
});
