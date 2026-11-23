import {
  describe, it, expect, beforeEach, afterEach,
} from 'vitest';
import { watchPendingBuyLinks } from '../../scripts/utils/utils.js';

const CHECKOUT = 'https://checkout.bitdefender.com/index.html:step=login?product_id=com.bitdefender.tsmd.v2&payment_period=5d1y';
// MutationObserver callbacks run as microtasks
const flush = () => new Promise((resolve) => { setTimeout(resolve, 0); });

describe('watchPendingBuyLinks', () => {
  let observer;
  let root;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <a id="store" href="#" data-store-buy-link>Buy Now</a>
        <a id="authored" href="https://www.bitdefender.com/#buylink">Buy now</a>
        <a id="empty" href="" data-store-buy-link>Buy now</a>
        <a id="resolved" href="${CHECKOUT}" data-store-buy-link>Buy now</a>
        <a id="page" href="/en-us/consumer/total-security">Learn more</a>
      </div>`;
    root = document.getElementById('root');
    observer = watchPendingBuyLinks(root);
  });

  afterEach(() => observer.disconnect());

  const disabled = (id) => document.getElementById(id).getAttribute('aria-disabled');

  it('flags buy links without a checkout URL, and nothing else', () => {
    expect(disabled('store')).toBe('true');
    expect(disabled('authored')).toBe('true');
    expect(disabled('empty')).toBe('true');
    expect(disabled('resolved')).toBeNull();
    expect(disabled('page')).toBeNull();
  });

  it('clears the flag once the store sets the checkout URL, and sets it again if it goes', async () => {
    const link = document.getElementById('store');
    link.href = CHECKOUT;
    await flush();
    expect(disabled('store')).toBeNull();
    expect(link.hasAttribute('data-buy-link-pending')).toBe(false);

    link.setAttribute('href', '');
    await flush();
    expect(disabled('store')).toBe('true');
  });

  it('flags buy links added later, alone or inside a block', async () => {
    const box = document.createElement('div');
    box.innerHTML = '<p><a id="late" href="#" data-store-buy-link>Buy Now</a></p>';
    const single = document.createElement('a');
    single.id = 'single';
    single.href = '#buylink';
    root.append(box, single);
    await flush();

    expect(disabled('late')).toBe('true');
    expect(disabled('single')).toBe('true');
  });

  it('leaves alone an aria-disabled it did not set', async () => {
    const link = document.createElement('a');
    link.id = 'blocked';
    link.href = '#';
    link.dataset.storeBuyLink = '';
    link.setAttribute('aria-disabled', 'true');
    root.append(link);
    await flush();
    link.href = CHECKOUT;
    await flush();

    expect(disabled('blocked')).toBe('true');
  });
});
