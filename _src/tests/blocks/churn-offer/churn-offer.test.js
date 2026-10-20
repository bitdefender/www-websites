import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import decorate from '../../../blocks/churn-offer/churn-offer.js';

const CLOSE_URL = 'https://localhost/dynamicupsell?view_action=close';

// same rows as the churn-flow-20 fragment
const CHURN_FLOW_CONTENT = `
  <div><div data-align="center">
    <h2 id="thank-you-for-your-feedback">Thank you for your feedback!</h2>
    <p><strong>It really helps. As a sign of gratitude, here’s a special offer for you:</strong></p>
  </div></div>
  <div><div data-align="center">
    <p>{PRICEBOX_V2}</p>
    <h2 id="discounted-price-percentage">&#x3C;discounted-price-percentage></h2>
    <p>applied on your next renewal</p>
  </div></div>
  <div><div data-align="center">The offer is available if you choose to keep auto-renewal on.</div></div>
  <div><div data-align="center">
    <p><strong><a href="https://#buylink">I Take the offer</a></strong></p>
    <p><em><strong><a href="${CLOSE_URL}">End auto-renewal</a></strong></em></p>
  </div></div>`;

function setupChurnOffer({ content = CHURN_FLOW_CONTENT, discount = '20%' } = {}) {
  document.body.innerHTML = `
    <div class="section churn-offer-container" ${discount ? `data-hardcoded-discount="${discount}"` : ''}>
      <div class="churn-offer-wrapper">
        <div class="churn-offer block">${content}</div>
      </div>
    </div>`;

  return document.querySelector('.churn-offer');
}

describe('churn-offer', () => {
  afterEach(() => {
    delete window.acceptDiscountedOffer;
  });

  it('has no imports, so it loads on hosts without the www-websites import map', () => {
    const source = readFileSync(resolve('_src/blocks/churn-offer/churn-offer.js'), 'utf8');

    expect(source).not.toMatch(/^\s*import\b|\bimport\(/m);
  });

  it('renders the churn modal with the hardcoded discount', () => {
    const block = setupChurnOffer();

    decorate(block);

    expect(block.querySelector('.churn-offer-copy h2').textContent).toBe('Thank you for your feedback!');
    expect(block.querySelector('.churn-offer-offer .churn-offer-discount').textContent).toBe('20%');
    expect(block.querySelector('.churn-offer-offer .prod-save').textContent).toBe('20%');
    expect(block.querySelector('.churn-offer-offer').textContent).not.toContain('{PRICEBOX_V2}');
    expect(block.querySelector('.churn-offer-offer').textContent).toContain('applied on your next renewal');
    expect(block.querySelector('.churn-offer-text-bottom').textContent).toContain('keep auto-renewal on');
    expect(block.querySelector('button[data-churn-offer-action="accept"]').textContent).toBe('I Take the offer');
    expect(block.querySelector('.churn-offer-dismiss a').href).toBe(CLOSE_URL);
    expect(block.querySelector('.churn-offer-dismiss a').textContent).toBe('End auto-renewal');
    expect(block.querySelector('.churn-offer-close').href).toBe(CLOSE_URL);
  });

  it('does not render markup from the discount metadata', () => {
    const block = setupChurnOffer({ discount: '&lt;img src=x onerror=alert(1)&gt;' });

    decorate(block);

    expect(block.querySelector('img')).toBeNull();
    expect(block.querySelector('.prod-save').textContent).toBe('<img src=x onerror=alert(1)>');
  });

  it('removes the discount marker when there is no hardcoded discount', () => {
    const block = setupChurnOffer({ discount: '' });

    decorate(block);

    expect(block.querySelector('.churn-offer-discount').textContent).toBe('');
    expect(block.textContent).not.toContain('discounted-price-percentage');
  });

  it('keeps the text around a paired discount marker', () => {
    const block = setupChurnOffer({
      content: '<div><div><p>&lt;discounted-price-percentage&gt; off&lt;/discounted-price-percentage&gt; your renewal</p></div></div>',
    });

    decorate(block);

    expect(block.querySelector('.churn-offer-offer p').textContent).toBe('20% off your renewal');
  });

  it('formats the renewal date in options.lang', () => {
    const block = setupChurnOffer({
      content: '<div><div><p>Your plan renews on &lt;renewal-date&gt;.</p></div></div>',
    });

    decorate(block, { lang: 'fr-fr', renewalDate: Date.UTC(2026, 11, 15, 12) / 1000 });

    expect(block.querySelector('.churn-offer-copy p').textContent).toBe('Your plan renews on 15 décembre 2026.');
  });

  it('removes the renewal date marker without a valid date', () => {
    const block = setupChurnOffer({
      content: '<div><div><p>Renews on &lt;renewal-date&gt;</p></div></div>',
    });

    decorate(block, { renewalDate: 'not a date' });

    expect(block.querySelector('.churn-offer-copy p').textContent).toBe('Renews on ');
  });

  it('survives missing rows', () => {
    const block = setupChurnOffer({ content: '<div><div><h2>Only a title</h2></div></div>' });

    decorate(block);

    expect(block.querySelector('.churn-offer-copy h2').textContent).toBe('Only a title');
    expect(block.querySelector('.churn-offer-offer')).toBeNull();
    expect(block.querySelector('.churn-offer-actions')).toBeNull();
    expect(block.querySelector('.churn-offer-close')).toBeTruthy();
  });

  it('uses the link next to the decline link as accept when #buylink is missing', () => {
    const block = setupChurnOffer({
      content: `
        <div><div><p>Copy with a <a href="https://www.bitdefender.com/">link</a></p></div></div>
        <div><div><p><a href="https://www.bitdefender.com/offer">Keep it</a></p><p><a href="${CLOSE_URL}">End auto-renewal</a></p></div></div>`,
    });

    decorate(block);

    expect(block.querySelector('[data-churn-offer-action="accept"]').textContent).toBe('Keep it');
    expect(block.querySelector('.churn-offer-copy a').textContent).toBe('link');
  });

  it('calls onAccept and dispatches a composed accept event', () => {
    const block = setupChurnOffer();
    const onAccept = vi.fn();
    const listener = vi.fn();
    document.addEventListener('churn-offer:accept', listener);
    window.acceptDiscountedOffer = vi.fn();

    decorate(block, { lang: 'en-us', promotion: 'CHURN20', onAccept });
    block.querySelector('[data-churn-offer-action="accept"]').click();

    const detail = {
      action: 'accept', discount: '20%', lang: 'en-us', promotion: 'CHURN20',
    };
    expect(onAccept).toHaveBeenCalledWith(detail);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual(detail);
    expect(listener.mock.calls[0][0].composed).toBe(true);
    expect(window.acceptDiscountedOffer).not.toHaveBeenCalled();

    document.removeEventListener('churn-offer:accept', listener);
  });

  it('falls back to window.acceptDiscountedOffer without onAccept', () => {
    const block = setupChurnOffer();
    window.acceptDiscountedOffer = vi.fn();

    decorate(block, { promotion: 'CHURN20' });
    block.querySelector('[data-churn-offer-action="accept"]').click();

    expect(window.acceptDiscountedOffer).toHaveBeenCalledWith('CHURN20');
  });

  it('prevents the close url navigation when the host handles decline or close', () => {
    const block = setupChurnOffer();
    const onDecline = vi.fn();
    const closeListener = (event) => event.preventDefault();
    block.addEventListener('churn-offer:close', closeListener);

    decorate(block, { onDecline });
    const decline = new MouseEvent('click', { bubbles: true, cancelable: true });
    block.querySelector('[data-churn-offer-action="decline"]').dispatchEvent(decline);
    const close = new MouseEvent('click', { bubbles: true, cancelable: true });
    block.querySelector('[data-churn-offer-action="close"]').dispatchEvent(close);

    expect(onDecline).toHaveBeenCalledWith(expect.objectContaining({ action: 'decline' }));
    expect(decline.defaultPrevented).toBe(true);
    expect(close.defaultPrevented).toBe(true);
  });

  it('keeps the close url navigation for the in-product webview', () => {
    const block = setupChurnOffer();

    let navigates;
    // runs after the block's handler; jsdom cannot navigate
    const stopNavigation = (event) => {
      navigates = !event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', stopNavigation);

    decorate(block);
    block.querySelector('[data-churn-offer-action="decline"]').click();

    expect(navigates).toBe(true);
    document.removeEventListener('click', stopNavigation);
  });
});
