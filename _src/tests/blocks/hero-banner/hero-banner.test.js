/* eslint-disable max-classes-per-file -- stand-ins for the design-system atoms */
/**
 * Unit tests for the hero-banner block
 */
import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';

const userAgent = vi.hoisted(() => ({ browser: 'chrome' }));

vi.mock('@repobit/dex-utils', () => ({ UserAgent: userAgent }));

vi.mock('@repobit/dex-data-layer', () => ({
  AdobeDataLayerService: { push: vi.fn() },
  ButtonClickEvent: class {},
}));

vi.mock('../../../scripts/page.js', () => ({ default: { name: 'individual' } }));

vi.mock('../../../scripts/scripts.js', () => ({ openModal: vi.fn() }));

// the store context is the store's business: a marker wrapper is enough to see it applied.
// The design-system imports fail here; the stand-ins below take the atoms' place
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getDsnBase: vi.fn(() => '/no-dsn-in-tests/'),
    wrapChildrenWithStoreContext: vi.fn((element, { productId, devices, subscription }) => {
      const context = document.createElement('bd-context');
      context.dataset.product = `${productId}/${devices}/${subscription}`;
      context.append(...element.childNodes);
      element.append(context);
    }),
    generatePageLoadStartedName: vi.fn(() => 'test:page'),
  };
});

/*
 * Stand-ins for the two atoms whose shadow roots the block reaches into: like Lit, they
 * render once the properties set right after construction are in, and expose updateComplete.
 */
class FakeAtom extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.updateComplete = new Promise((resolve) => {
      queueMicrotask(() => {
        this.render();
        resolve(true);
      });
    });
  }
}

customElements.define('bd-button-link', class extends FakeAtom {
  render() {
    const anchor = document.createElement('a');
    if (this.href) anchor.setAttribute('href', this.href);
    if (this.buyLink) {
      anchor.dataset.storeRender = '';
      anchor.dataset.storeBuyLink = '';
    }
    this.shadowRoot.replaceChildren(anchor);
  }
});

customElements.define('bd-custom-dropdown', class extends FakeAtom {
  render() {
    const select = document.createElement('select');
    select.append(...this.options.map((option) => new Option(option, option)));
    select.addEventListener('change', () => {
      this.value = select.value;
      this.dispatchEvent(new CustomEvent('bd-change', { detail: { value: select.value }, bubbles: true, composed: true }));
    });
    this.shadowRoot.replaceChildren(select);
  }
});

vi.spyOn(console, 'warn').mockImplementation(() => {});

const { default: decorate } = await import('../../../blocks/hero-banner/hero-banner.js');
const { openModal } = await import('../../../scripts/scripts.js');

const PICTURE = '<p><picture><img src="./hero.jpg" alt="" loading="lazy"></picture></p>';

/**
 * Builds the section + block markup the backend serves, as decorateSections leaves it:
 * section metadata on the section's dataset, the block as one row with one cell.
 * Resolves once the atoms have rendered.
 */
async function setup(cellHtml, metadata = {}, blockClasses = '') {
  document.body.innerHTML = `
    <main>
      <div class="section">
        <div class="hero-banner-wrapper">
          <div class="hero-banner block ${blockClasses}"><div><div>${cellHtml}</div></div></div>
        </div>
      </div>
    </main>`;
  const section = document.querySelector('.section');
  Object.assign(section.dataset, metadata);
  const block = document.querySelector('.hero-banner');
  await decorate(block);
  await Promise.all([...block.querySelectorAll('bd-button-link, bd-custom-dropdown')]
    .map((atom) => atom.updateComplete));
  await Promise.resolve();
  return block;
}

const visibleOffer = (block) => [...block.querySelectorAll('.hero-banner__offer')]
  .find((offer) => !offer.hidden);

const anchorOf = (cta) => cta.shadowRoot.querySelector('a');

describe('hero-banner', () => {
  beforeEach(() => {
    userAgent.browser = 'chrome';
    vi.mocked(openModal).mockClear();
  });

  describe('plan look: two or more products', () => {
    let block;

    beforeEach(async () => {
      block = await setup(`
        ${PICTURE}
        <h1 id="title">Personalized protection</h1>
        <h2 id="sub"><strong>Explore and select the Individual plan</strong></h2>
        <p>{Dropdown}</p>
        <p>*First year price.</p>`, {
        dropdown: 'ps_i/5/1, ts_i/5/1, us_i/5/1',
        productnames: 'Premium Security | 1 Member & 5 Devices, Total Security | 1 Member & 5 Devices, Ultimate Security | 1 Member & 5 Devices',
        buybuttontext: 'Get it now',
        secondbuttontext: 'Compare plans',
        secondbuttonlink: '#new-prod-boxes',
        signature: 'Trusted. Always.',
        discounttext: 'OFF',
      });
    });

    it('uses the card look, with the signature as the eyebrow', () => {
      expect(block.classList.contains('hero-banner--card')).toBe(true);
      expect(block.querySelector('.hero-banner__eyebrow').textContent).toBe('Trusted. Always.');
      expect(block.querySelector('.hero-banner__signature')).toBeNull();
    });

    it('renders the dropdown atom with one option per product, named by the description', () => {
      const dropdown = block.querySelector('bd-custom-dropdown.hero-banner__select');
      expect(dropdown.options).toEqual(['Premium Security', 'Total Security', 'Ultimate Security']);
      expect(dropdown.value).toBe('Premium Security');
      expect(dropdown.shadowRoot.querySelector('select').getAttribute('aria-label'))
        .toBe('Explore and select the Individual plan');
    });

    it('builds one offer per product in its own store context, and shows the first', () => {
      const offers = block.querySelectorAll('.hero-banner__offer');
      expect(offers).toHaveLength(3);
      expect([...offers].map((o) => o.querySelector('bd-context').dataset.product))
        .toEqual(['ps_i/5/1', 'ts_i/5/1', 'us_i/5/1']);
      expect([...offers].map((o) => o.hidden)).toEqual([false, true, true]);
      expect(visibleOffer(block).querySelector('bd-p.hero-banner__details').textContent)
        .toBe('1 Member & 5 Devices');
    });

    it('shows the chosen product\'s offer when the dropdown changes', () => {
      const select = block.querySelector('bd-custom-dropdown').shadowRoot.querySelector('select');
      select.value = 'Ultimate Security';
      select.dispatchEvent(new Event('change'));
      const offers = [...block.querySelectorAll('.hero-banner__offer')];
      expect(offers.map((o) => o.hidden)).toEqual([true, true, false]);
    });

    it('renders the store price zones in light DOM, and the discount in the badge atom', () => {
      const offer = visibleOffer(block);
      expect(offer.querySelector('bd-p.hero-banner__full [data-store-price="full"]')).not.toBeNull();
      expect(offer.querySelector('[data-store-price="discounted||full"]')).not.toBeNull();
      const badge = offer.querySelector('bd-badge.hero-banner__badge');
      expect(badge.getAttribute('tone')).toBe('success');
      expect(badge.getAttribute('variant')).toBe('fill');
      expect(badge.querySelector('[data-store-discount="percentage"]')).not.toBeNull();
      expect(badge.textContent.trim()).toBe('OFF');
      expect(offer.querySelector('.hero-banner__was').dataset.storeHide).toBe('!it.option.price.discounted');
    });

    it('makes the primary CTA an accent store buy link the store can see, and keeps the second button', () => {
      const [buy, second] = visibleOffer(block).querySelectorAll('bd-button-link.hero-banner__cta');
      expect(buy.textContent).toBe('Get it now');
      expect(buy.getAttribute('variant')).toBe('accent');
      expect(buy.hasAttribute('data-bd-watch-shadow')).toBe(true);
      expect(anchorOf(buy).dataset.storeBuyLink).toBe('');
      expect(second.textContent).toBe('Compare plans');
      expect(second.getAttribute('variant')).toBe('tertiary');
      expect(anchorOf(second).getAttribute('href')).toBe('#new-prod-boxes');
    });

    it('makes the h1 a heading atom and the description and disclaimer paragraph atoms', () => {
      const title = block.querySelector('bd-h.hero-banner__title');
      expect(title.getAttribute('as')).toBe('h1');
      expect(title.id).toBe('title');
      expect(title.textContent).toBe('Personalized protection');
      const description = block.querySelector('.hero-banner__description bd-p');
      expect(description.dataset.authoredAs).toBe('heading');
      expect(description.querySelector('strong').textContent).toBe('Explore and select the Individual plan');
      expect(block.querySelector('.hero-banner__disclaimer bd-p').textContent.trim()).toBe('*First year price.');
      expect(block.textContent).not.toContain('{Dropdown}');
    });

    it('makes the hero image the LCP candidate', () => {
      const img = block.querySelector('.hero-banner__media img');
      expect(img.loading).toBe('eager');
      expect(img.getAttribute('fetchpriority')).toBe('high');
    });
  });

  describe('product look: one product', () => {
    let block;

    beforeEach(async () => {
      block = await setup(`
        ${PICTURE}
        <h2><strong>Bitdefender</strong><br><strong>Ultimate Small Business Security</strong></h2>
        <h1>Small business security done right</h1>
        <p>Covers the real risks</p>
        <p>{Dropdown}</p>
        <p>Works on: Windows®</p>`, {
        dropdown: 'vsb/5/1',
        productnames: 'Ultimate Small Business Security | 5 team members',
        buybuttontext: 'Buy now',
        secondbuttontext: 'Watch the demo',
        secondbuttonlink: 'https://www.bitdefender.com/en-us/consumer/fragments/demo',
        signature: 'Trusted. Always.',
        trialDuration: '30',
      });
    });

    it('uses the product look, with the product name and the signature over the image', () => {
      expect(block.classList.contains('hero-banner--product')).toBe(true);
      const product = block.querySelector('bd-h.hero-banner__product');
      expect(product.getAttribute('as')).toBe('h2');
      expect(product.getAttribute('visual-level')).toBe('h4');
      expect(product.textContent).toContain('Ultimate Small Business Security');
      expect(block.querySelector('.hero-banner__media .hero-banner__scrim')).not.toBeNull();
      expect(block.querySelector('.hero-banner__media .hero-banner__signature').textContent).toBe('Trusted. Always.');
      expect(block.querySelector('.hero-banner__eyebrow')).toBeNull();
    });

    it('shows the price without a dropdown', () => {
      expect(block.querySelector('bd-custom-dropdown')).toBeNull();
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
      expect(visibleOffer(block).querySelector('.hero-banner__details').textContent).toBe('5 team members');
    });

    it('passes the trial duration to the store buy link', () => {
      expect(anchorOf(block.querySelector('.hero-banner__cta--primary')).dataset.storeBuyLink).toBe('30');
    });

    it('opens a fragment second button as a modal', () => {
      const second = block.querySelector('.hero-banner__cta--secondary');
      expect(anchorOf(second).hasAttribute('href')).toBe(false);
      second.click();
      expect(openModal).toHaveBeenCalledWith('https://www.bitdefender.com/en-us/consumer/fragments/demo', false);
    });

    it('can be forced to the card look', async () => {
      const card = await setup(`${PICTURE}<h2>Bitdefender</h2><h1>Title</h1><p>{Dropdown}</p>`, { dropdown: 'vsb/5/1' }, 'card');
      expect(card.classList.contains('hero-banner--card')).toBe(true);
    });
  });

  describe('no product', () => {
    it('renders the hardcoded links as CTAs and no price', async () => {
      const block = await setup(`
        ${PICTURE}
        <h2>Bitdefender Web Sage</h2>
        <h1>Secure your browser</h1>
        <p>{Dropdown}</p>`, {
        buybuttontext: 'Get it free',
        hardcodedLink: 'https://chromewebstore.google.com/detail/web-sage',
        microsoftEdgeLink: 'https://microsoftedge.microsoft.com/addons/detail/web-sage',
        secondbuttontext: 'Unlock premium protection',
        secondbuttonlink: '#plans',
      });
      expect(block.querySelector('.hero-banner__offer')).toBeNull();
      const anchors = [...block.querySelectorAll('bd-button-link.hero-banner__cta')].map(anchorOf);
      expect(anchors.map((a) => a.getAttribute('href')))
        .toEqual(['https://chromewebstore.google.com/detail/web-sage', '#plans']);
      expect(anchors[0].hasAttribute('data-store-buy-link')).toBe(false);
    });

    it('sends Edge to the Edge add-on store', async () => {
      userAgent.browser = 'edge';
      const block = await setup(`${PICTURE}<h1>Secure your browser</h1><p>{Dropdown}</p>`, {
        buybuttontext: 'Get it free',
        hardcodedLink: 'https://chromewebstore.google.com/detail/web-sage',
        microsoftEdgeLink: 'https://microsoftedge.microsoft.com/addons/detail/web-sage',
      });
      expect(anchorOf(block.querySelector('.hero-banner__cta--primary')).getAttribute('href'))
        .toBe('https://microsoftedge.microsoft.com/addons/detail/web-sage');
    });

    it('renders no buy button when there is nothing to buy and no link', async () => {
      const block = await setup(`${PICTURE}<h1>Digital Safety</h1>`, { signature: 'Trusted. Always.' });
      expect(block.querySelector('.hero-banner__cta--primary')).toBeNull();
    });
  });

  describe('awards look: authored CTAs and marks', () => {
    let block;

    beforeEach(async () => {
      block = await setup(`
        ${PICTURE}
        <h1>Digital Safety, Built Around You</h1>
        <p><a href="/en-us/consumer/individual" class="button">Compare Individual Plans</a></p>
        <p><strong><a href="/en-us/consumer/family" class="button primary">Compare Family Plans</a></strong></p>
        <p><a class="button modal" location="/en-us/consumer/fragments/plans" data-stop-automatic-modal-refresh="true">See all plans</a></p>
        <p><picture><img src="./best-brands.png" alt="PCMag Best Brands"></picture><picture><img src="./editors-choice.png" alt="PCMag Editors' Choice"></picture></p>`, {
        signature: 'Trusted. Always.',
      });
    });

    it('turns the authored button paragraphs into button atoms in the CTA row', () => {
      const authored = block.querySelector('.hero-banner__ctas--authored');
      const ctas = [...authored.querySelectorAll('bd-button-link')];
      expect(ctas.map((cta) => cta.textContent))
        .toEqual(['Compare Individual Plans', 'Compare Family Plans', 'See all plans']);
      expect(ctas.map((cta) => cta.getAttribute('variant'))).toEqual(['tertiary', 'accent', 'tertiary']);
      expect(anchorOf(ctas[1]).getAttribute('href')).toBe('/en-us/consumer/family');
      expect(authored.querySelector('a')).toBeNull();
      expect(block.querySelector('.hero-banner__description')).toBeNull();
    });

    it('keeps a modal link the page already bound working, from its stored location', () => {
      block.querySelectorAll('.hero-banner__ctas--authored bd-button-link')[2].click();
      expect(openModal).toHaveBeenCalledWith('/en-us/consumer/fragments/plans', true);
    });

    it('collects the picture-only paragraph as award marks, not as the hero image', () => {
      const marks = [...block.querySelectorAll('.hero-banner__marks img')];
      expect(marks.map((img) => img.alt)).toEqual(['PCMag Best Brands', "PCMag Editors' Choice"]);
      expect(block.querySelector('.hero-banner__media img').getAttribute('src')).toBe('./hero.jpg');
    });
  });

  describe('defensive decoration', () => {
    it('renders without a picture, as one column', async () => {
      const block = await setup('<h1>Title</h1><p>Text</p>', {});
      expect(block.classList.contains('hero-banner--no-media')).toBe(true);
      expect(block.querySelector('.hero-banner__title').textContent).toBe('Title');
    });

    it('treats the content after the h1 as the description when {Dropdown} is missing', async () => {
      const block = await setup(`${PICTURE}<h1>Title</h1><p>One</p><p>Two</p>`, { dropdown: 'ps_i/5/1' });
      expect(block.querySelectorAll('.hero-banner__description bd-p')).toHaveLength(2);
      expect(block.querySelector('.hero-banner__disclaimer')).toBeNull();
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
    });

    it('ignores malformed product codes', async () => {
      const block = await setup(`${PICTURE}<h1>Title</h1><p>{Dropdown}</p>`, { dropdown: 'ps_i/5/1, nonsense, , ts_i/5' });
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
      expect(block.querySelector('bd-custom-dropdown')).toBeNull();
    });

    it('keeps the dropdown labels unique, so each maps back to its product', async () => {
      const block = await setup(`${PICTURE}<h1>Title</h1><p>{Dropdown}</p>`, {
        dropdown: 'ps_i/5/1, ps_i/10/1',
        productnames: 'Premium Security | 5 Devices, Premium Security | 10 Devices',
      });
      expect(block.querySelector('bd-custom-dropdown').options)
        .toEqual(['Premium Security', 'Premium Security - 10 Devices']);
    });

    it('opens external CTAs in a new tab when asked, and leaves anchors alone', async () => {
      const block = await setup(`${PICTURE}<h1>Title</h1><p>{Dropdown}</p>`, {
        buybuttontext: 'Get it free',
        hardcodedLink: 'https://chromewebstore.google.com/detail/web-sage',
        secondbuttontext: 'Plans',
        secondbuttonlink: '#plans',
        linksOpenInNewTab: 'true',
      });
      const [external, anchor] = block.querySelectorAll('bd-button-link.hero-banner__cta');
      expect(external.target).toBe('_blank');
      expect(anchor.target).toBeUndefined();
    });
  });
});
