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
} = {}) {
  document.body.innerHTML = `
    <main>
      <div class="section ${sectionClass}" data-product="ps_i/5/1" data-save-text="off">
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

  it('uses mapped bundle_id, slots, and billing_cycle url parameters for store context', async () => {
    window.history.pushState(
      {},
      '',
      '/en-us/consumer/webview/churn-flow?bundle_id=com.bitdefender.premiumsecurity.v2&slots=5&billing_cycle=730',
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

  it('dismisses the modal from the secondary action and close button', async () => {
    let block = setupWebview({
      sectionClass: 'discount-modal',
      content: `
        <div><h2>Thank you for your feedback!</h2></div>
        <div><p>Offer copy</p></div>
        <div><p>Bitdefender Premium Security Individual {PRICE_BOX}</p></div>
        <div><p><a href="#buylink">Take the offer</a></p></div>
        <div><p><a href="https://localhost/dynamicupsell?view_action=close">No thanks</a></p></div>
      `,
    });

    await decorate(block);
    block.querySelector('.webview-modal-dismiss a').click();

    expect(document.querySelector('.webview-wrapper')).toBeFalsy();

    block = setupWebview({
      sectionClass: 'discount-modal',
      content: `
        <div><h2>Thank you for your feedback!</h2></div>
        <div><p>Offer copy</p></div>
        <div><p>Bitdefender Premium Security Individual {PRICE_BOX}</p></div>
        <div><p><a href="#buylink">Take the offer</a></p></div>
      `,
    });

    await decorate(block);
    block.querySelector('.webview-modal-close').click();

    expect(document.querySelector('.webview-wrapper')).toBeFalsy();
  });
});
