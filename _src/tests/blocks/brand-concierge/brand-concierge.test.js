import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import decorate, { getFragmentUrl } from '../../../blocks/brand-concierge/brand-concierge.js';

const ORIGIN = 'https://www.bitdefender.com';
const CSS = '/etc.clientlibs/bitdefender/clientlibs/clientlib-brand-concierge.lc-1-lc.min.css';
const JS = '/etc.clientlibs/bitdefender/clientlibs/clientlib-brand-concierge.lc-2-lc.min.js';
const RUNTIME = '/etc.clientlibs/bitdefender/clientlibs/clientlib-runtime.lc-3-lc.min.js';

const FRAGMENT = `
  <link rel="stylesheet" href="${CSS}" type="text/css">
  <script src="${JS}" defer></script>
  <script src="${RUNTIME}" defer></script>
  <section class="brand-concierge__container" data-brand-concierge-root></section>`;

function setupBlock() {
  document.body.innerHTML = '<main><div class="brand-concierge"><div><div>brand concierge</div></div></div></main>';
  return document.querySelector('.brand-concierge');
}

// jsdom loads no stylesheets, so the block's wait for its CSS is ended by hand
async function decorateWithLoadedCss(block) {
  const decorated = decorate(block);
  await vi.waitFor(() => expect(block.querySelector('div')?.shadowRoot).toBeTruthy());
  block.querySelector('div').shadowRoot.querySelectorAll('link')
    .forEach((link) => link.dispatchEvent(new Event('load')));
  await decorated;
  return block.querySelector('div').shadowRoot;
}

describe('brand-concierge', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/ro-ro/consumer/');
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve(FRAGMENT),
    }));
  });

  afterEach(() => {
    delete window.brandConcierge;
    vi.restoreAllMocks();
  });

  it('fetches the experience fragment for the page locale', async () => {
    await decorateWithLoadedCss(setupBlock());

    expect(global.fetch).toHaveBeenCalledWith(
      `${ORIGIN}/content/experience-fragments/bitdefender/language_master/ro_ro/brand-concierge/master/jcr:content/root.html`,
    );
    expect(getFragmentUrl('en')).toContain('/language_master/en/brand-concierge/master/');
  });

  it('renders the fragment in a shadow root with absolute CSS and script URLs', async () => {
    const block = setupBlock();
    const shadowRoot = await decorateWithLoadedCss(block);

    expect(block.textContent).toBe('');
    expect(shadowRoot.querySelector('[data-brand-concierge-root]')).toBeTruthy();
    expect(shadowRoot.querySelector('link').getAttribute('href')).toBe(`${ORIGIN}${CSS}`);
    expect([...shadowRoot.querySelectorAll('script')].map((script) => script.getAttribute('src')))
      .toEqual([`${ORIGIN}${JS}`]);
    expect(shadowRoot.querySelector('div').style.display).toBe('');
  });

  it('hands the shadow root to the AEM script once it announces itself', async () => {
    const shadowRoot = await decorateWithLoadedCss(setupBlock());
    window.brandConcierge = vi.fn();

    window.dispatchEvent(new CustomEvent('brandConcierge'));

    expect(window.brandConcierge).toHaveBeenCalledWith(shadowRoot);
  });

  it('hands the shadow root straight over when the AEM script is already loaded', async () => {
    window.brandConcierge = vi.fn();

    const shadowRoot = await decorateWithLoadedCss(setupBlock());

    expect(window.brandConcierge).toHaveBeenCalledWith(shadowRoot);
  });

  it('leaves the block empty when the fragment cannot be fetched', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    const block = setupBlock();

    await decorate(block);

    expect(block.innerHTML).toBe('');
  });
});
