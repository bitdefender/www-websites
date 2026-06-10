import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

import decorate from '../../../blocks/webview/webview.js';

vi.mock('../../../scripts/scripts.js', () => ({
  getLanguageCountryFromPath: vi.fn(() => ({
    language: 'en',
    country: 'us',
  })),
}));

function setupWebview({
  sectionClass = '',
  blockClass = '',
  content = '',
  sectionAttributes = '',
} = {}) {
  document.body.innerHTML = `
    <main>
      <div class="section ${sectionClass}" data-product="ps_i/5/1" data-save-text="off" ${sectionAttributes}>
        <div class="webview-wrapper">
          <div class="webview ${blockClass}">
            ${content}
          </div>
        </div>
      </div>
    </main>`;

  return document.querySelector('.webview');
}

describe('webview', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/en-us/consumer/webview/churn-flow');
  });

  it('preserves the default price box decoration', async () => {
    const block = setupWebview({
      content: `
        <div><p>{PRICE_BOX}</p></div>
        <div><p><a href="#buylink">Buy now</a></p></div>
      `,
    });

    await decorate(block);

    expect(block.querySelector('.price-box')).toBeTruthy();
    expect(block.querySelector('.prod-percent').textContent).toContain('off');
    expect(block.querySelector('.prod-oldprice').dataset.storePrice).toBe('full');
    expect(block.querySelector('.prod-newprice span').dataset.storePrice).toBe('discounted||full');
    expect(block.querySelector('a[href*="#buylink"]').hasAttribute('data-store-buy-link')).toBe(true);
    expect(block.querySelector('.webview-modal-offer')).toBeFalsy();
  });

  it('uses slots and billing_cycle url parameters for store option context', async () => {
    window.history.pushState(
      {},
      '',
      '/en-us/consumer/webview/churn-flow?slots=5&billing_cycle=730',
    );
    const block = setupWebview({
      content: `
        <div><p>{PRICE_BOX}</p></div>
      `,
    });

    await decorate(block);

    expect(block.dataset.storeId).toBe('ps_i');
    expect(block.dataset.storeOption).toBe('5-2');
  });

  it('keeps the authored store option when slots or billing_cycle are invalid', async () => {
    window.history.pushState(
      {},
      '',
      '/en-us/consumer/webview/churn-flow?slots=5&billing_cycle=400',
    );
    const block = setupWebview({
      content: `
        <div><p>{PRICE_BOX}</p></div>
      `,
    });

    await decorate(block);

    expect(block.dataset.storeOption).toBe('5-1');
  });

  it('replaces the renewal date marker with the formatted renewal-date timestamp', async () => {
    window.history.pushState(
      {},
      '',
      '/en-us/consumer/webview/churn-flow?renewal-date=1811492795',
    );
    const block = setupWebview({
      content: `
        <div><p>Your subscription renews on &lt;renewal-date&gt;.</p></div>
      `,
    });
    const expectedRenewalDate = new Intl.DateTimeFormat('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(1811492795 * 1000));

    await decorate(block);

    expect(block.textContent).toContain(`Your subscription renews on ${expectedRenewalDate}.`);
    expect(block.textContent).not.toContain('<renewal-date>');
  });

  it('creates the discount modal only when the variation class is present', async () => {
    const block = setupWebview({
      sectionClass: 'discount-modal',
      content: `
        <div><h2>Thank you for your feedback!</h2></div>
        <div><p>It really helps. As a sign of gratitude, here’s a special offer for you:</p></div>
        <div><p>&lt;discounted-price-percentage&gt; {PRICEBOX_V2} applied on your next renewal</p></div>
        <div><p>{under_price_text}</p><p>The offer is available if you choose to keep auto-renewal on.</p></div>
        <div><p><a href="#buylink">I take the offer</a></p></div>
        <div><p><a href="https://localhost/dynamicupsell?view_action=close">End auto renewal</a></p></div>
      `,
    });

    await decorate(block);

    expect(document.querySelector('.webview-wrapper').classList.contains('discount-modal')).toBe(true);
    expect(block.querySelector('.webview-modal-offer')).toBeTruthy();
    expect(block.querySelector('.webview-modal-product')).toBeFalsy();
    expect(block.querySelector('.prod-oldprice')).toBeFalsy();
    expect(block.querySelector('.prod-newprice')).toBeFalsy();
    expect(block.querySelector('[data-store-buy-link]').textContent).toContain('I take the offer');
    expect(block.querySelector('.webview-modal-dismiss').textContent).toContain('End auto renewal');
    expect(block.querySelector('.prod-save').dataset.storeHide).toBe('no-price=discounted');
    expect(block.querySelector('.prod-save [data-store-discount="percentage"]')).toBeTruthy();
  });

  it('uses hardcoded discount text in the discount modal when authored', async () => {
    const block = setupWebview({
      sectionClass: 'discount-modal',
      sectionAttributes: 'data-hardcoded-discount="20%"',
      content: `
        <div><h2>Thank you for your feedback!</h2></div>
        <div><p>It really helps. As a sign of gratitude, here’s a special offer for you:</p></div>
        <div><p>&lt;discounted-price-percentage&gt; {PRICEBOX_V2} applied on your next renewal</p></div>
        <div><p>{under_price_text}</p><p>The offer is available if you choose to keep auto-renewal on.</p></div>
        <div><p><a href="#buylink">I take the offer</a></p></div>
      `,
    });

    await decorate(block);

    const discount = block.querySelector('.prod-save');
    expect(discount.textContent).toBe('20%');
    expect(discount.hasAttribute('data-store-hide')).toBe(false);
    expect(discount.querySelector('[data-store-discount="percentage"]')).toBeFalsy();
  });
});
