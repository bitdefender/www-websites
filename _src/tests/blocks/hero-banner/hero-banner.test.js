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

vi.mock('../../../scripts/scripts.js', () => ({ detectModalButtons: vi.fn() }));

// the store context is the store's business: a marker wrapper is enough to see it applied
vi.mock('../../../scripts/utils/utils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    wrapChildrenWithStoreContext: vi.fn((element, { productId, devices, subscription }) => {
      const context = document.createElement('bd-context');
      context.dataset.product = `${productId}/${devices}/${subscription}`;
      context.append(...element.childNodes);
      element.append(context);
    }),
    generatePageLoadStartedName: vi.fn(() => 'test:page'),
  };
});

const { default: decorate } = await import('../../../blocks/hero-banner/hero-banner.js');
const { detectModalButtons } = await import('../../../scripts/scripts.js');

const PICTURE = '<p><picture><img src="./hero.jpg" alt="" loading="lazy"></picture></p>';

/**
 * Builds the section + block markup the backend serves, as decorateSections leaves it:
 * section metadata on the section's dataset, the block as one row with one cell.
 */
function setup(cellHtml, metadata = {}, blockClasses = '') {
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
  decorate(block);
  return block;
}

const visibleOffer = (block) => [...block.querySelectorAll('.hero-banner__offer')]
  .find((offer) => !offer.hidden);

describe('hero-banner', () => {
  beforeEach(() => {
    userAgent.browser = 'chrome';
    vi.mocked(detectModalButtons).mockClear();
  });

  describe('plan look: two or more products', () => {
    let block;

    beforeEach(() => {
      block = setup(`
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

    it('renders a native select with one option per product, named by the description', () => {
      const select = block.querySelector('select.hero-banner__select');
      expect([...select.options].map((o) => o.text))
        .toEqual(['Premium Security', 'Total Security', 'Ultimate Security']);
      const labelledBy = select.getAttribute('aria-labelledby');
      expect(document.getElementById(labelledBy).textContent).toContain('Explore and select');
    });

    it('builds one offer per product in its own store context, and shows the first', () => {
      const offers = block.querySelectorAll('.hero-banner__offer');
      expect(offers).toHaveLength(3);
      expect([...offers].map((o) => o.querySelector('bd-context').dataset.product))
        .toEqual(['ps_i/5/1', 'ts_i/5/1', 'us_i/5/1']);
      expect([...offers].map((o) => o.hidden)).toEqual([false, true, true]);
      expect(visibleOffer(block).querySelector('.hero-banner__details').textContent)
        .toBe('1 Member & 5 Devices');
    });

    it('shows the chosen product\'s offer when the select changes', () => {
      const select = block.querySelector('select');
      select.value = '2';
      select.dispatchEvent(new Event('change'));
      const offers = [...block.querySelectorAll('.hero-banner__offer')];
      expect(offers.map((o) => o.hidden)).toEqual([true, true, false]);
    });

    it('renders the store price zones and the discount text', () => {
      const offer = visibleOffer(block);
      expect(offer.querySelector('[data-store-price="full"]')).not.toBeNull();
      expect(offer.querySelector('[data-store-price="discounted||full"]')).not.toBeNull();
      expect(offer.querySelector('.hero-banner__badge').textContent.trim()).toBe('OFF');
      expect(offer.querySelector('.hero-banner__was').dataset.storeHide).toBe('!it.option.price.discounted');
    });

    it('makes the primary CTA a store buy link and keeps the second button', () => {
      const [buy, second] = visibleOffer(block).querySelectorAll('a.hero-banner__cta');
      expect(buy.textContent).toBe('Get it now');
      expect(buy.classList.contains('hero-banner__cta--primary')).toBe(true);
      expect(buy.hasAttribute('data-store-buy-link')).toBe(true);
      expect(second.textContent).toBe('Compare plans');
      expect(second.getAttribute('href')).toBe('#new-prod-boxes');
    });

    it('keeps the authored headings and moves the rest into description and disclaimer', () => {
      expect(block.querySelector('h1.hero-banner__title').textContent).toBe('Personalized protection');
      expect(block.querySelector('.hero-banner__description h2')).not.toBeNull();
      expect(block.querySelector('.hero-banner__disclaimer').textContent.trim()).toBe('*First year price.');
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

    beforeEach(() => {
      block = setup(`
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
      expect(block.querySelector('.hero-banner__product').textContent).toContain('Ultimate Small Business Security');
      expect(block.querySelector('.hero-banner__media .hero-banner__scrim')).not.toBeNull();
      expect(block.querySelector('.hero-banner__media .hero-banner__signature').textContent).toBe('Trusted. Always.');
      expect(block.querySelector('.hero-banner__eyebrow')).toBeNull();
    });

    it('shows the price without a dropdown', () => {
      expect(block.querySelector('select')).toBeNull();
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
      expect(visibleOffer(block).querySelector('.hero-banner__details').textContent).toBe('5 team members');
    });

    it('passes the trial duration to the store buy link', () => {
      expect(block.querySelector('.hero-banner__cta--primary').dataset.storeBuyLink).toBe('30');
    });

    it('makes a fragment second button a modal and binds it', () => {
      const second = block.querySelector('.hero-banner__cta--secondary');
      expect(second.classList.contains('button')).toBe(true);
      expect(second.classList.contains('modal')).toBe(true);
      expect(detectModalButtons).toHaveBeenCalled();
    });

    it('can be forced to the card look', () => {
      const card = setup(`${PICTURE}<h2>Bitdefender</h2><h1>Title</h1><p>{Dropdown}</p>`, { dropdown: 'vsb/5/1' }, 'card');
      expect(card.classList.contains('hero-banner--card')).toBe(true);
    });
  });

  describe('no product', () => {
    it('renders the hardcoded links as CTAs and no price', () => {
      const block = setup(`
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
      const ctas = [...block.querySelectorAll('a.hero-banner__cta')];
      expect(ctas.map((a) => a.getAttribute('href')))
        .toEqual(['https://chromewebstore.google.com/detail/web-sage', '#plans']);
      expect(ctas[0].hasAttribute('data-store-buy-link')).toBe(false);
    });

    it('sends Edge to the Edge add-on store', () => {
      userAgent.browser = 'edge';
      const block = setup(`${PICTURE}<h1>Secure your browser</h1><p>{Dropdown}</p>`, {
        buybuttontext: 'Get it free',
        hardcodedLink: 'https://chromewebstore.google.com/detail/web-sage',
        microsoftEdgeLink: 'https://microsoftedge.microsoft.com/addons/detail/web-sage',
      });
      expect(block.querySelector('.hero-banner__cta--primary').getAttribute('href'))
        .toBe('https://microsoftedge.microsoft.com/addons/detail/web-sage');
    });

    it('renders no buy button when there is nothing to buy and no link', () => {
      const block = setup(`${PICTURE}<h1>Digital Safety</h1>`, { signature: 'Trusted. Always.' });
      expect(block.querySelector('.hero-banner__cta--primary')).toBeNull();
    });
  });

  describe('awards look: authored CTAs and marks', () => {
    let block;

    beforeEach(() => {
      block = setup(`
        ${PICTURE}
        <h1>Digital Safety, Built Around You</h1>
        <p><a href="/en-us/consumer/individual" class="button">Compare Individual Plans</a></p>
        <p><strong><a href="/en-us/consumer/family" class="button primary">Compare Family Plans</a></strong></p>
        <p><picture><img src="./best-brands.png" alt="PCMag Best Brands"></picture><picture><img src="./editors-choice.png" alt="PCMag Editors' Choice"></picture></p>`, {
        signature: 'Trusted. Always.',
      });
    });

    it('moves the authored button paragraphs into the CTA row', () => {
      const authored = block.querySelector('.hero-banner__ctas--authored');
      const links = [...authored.querySelectorAll('a')];
      expect(links.map((a) => a.textContent)).toEqual(['Compare Individual Plans', 'Compare Family Plans']);
      expect(links[0].classList.contains('hero-banner__cta--secondary')).toBe(true);
      expect(links[1].classList.contains('hero-banner__cta--primary')).toBe(true);
      expect(block.querySelector('.hero-banner__description')).toBeNull();
    });

    it('collects the picture-only paragraph as award marks, not as the hero image', () => {
      const marks = [...block.querySelectorAll('.hero-banner__marks img')];
      expect(marks.map((img) => img.alt)).toEqual(['PCMag Best Brands', "PCMag Editors' Choice"]);
      expect(block.querySelector('.hero-banner__media img').getAttribute('src')).toBe('./hero.jpg');
    });

    it('does not bind the authored links again: the page already did', () => {
      expect(detectModalButtons).not.toHaveBeenCalled();
    });
  });

  describe('defensive decoration', () => {
    it('renders without a picture, as one column', () => {
      const block = setup('<h1>Title</h1><p>Text</p>', {});
      expect(block.classList.contains('hero-banner--no-media')).toBe(true);
      expect(block.querySelector('.hero-banner__title').textContent).toBe('Title');
    });

    it('treats the content after the h1 as the description when {Dropdown} is missing', () => {
      const block = setup(`${PICTURE}<h1>Title</h1><p>One</p><p>Two</p>`, { dropdown: 'ps_i/5/1' });
      expect(block.querySelectorAll('.hero-banner__description p')).toHaveLength(2);
      expect(block.querySelector('.hero-banner__disclaimer')).toBeNull();
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
    });

    it('ignores malformed product codes', () => {
      const block = setup(`${PICTURE}<h1>Title</h1><p>{Dropdown}</p>`, { dropdown: 'ps_i/5/1, nonsense, , ts_i/5' });
      expect(block.querySelectorAll('.hero-banner__offer')).toHaveLength(1);
      expect(block.querySelector('select')).toBeNull();
    });

    it('opens external CTAs in a new tab when asked, and leaves anchors alone', () => {
      const block = setup(`${PICTURE}<h1>Title</h1><p>{Dropdown}</p>`, {
        buybuttontext: 'Get it free',
        hardcodedLink: 'https://chromewebstore.google.com/detail/web-sage',
        secondbuttontext: 'Plans',
        secondbuttonlink: '#plans',
        linksOpenInNewTab: 'true',
      });
      const [external, anchor] = block.querySelectorAll('a.hero-banner__cta');
      expect(external.target).toBe('_blank');
      expect(external.rel).toBe('noopener noreferrer');
      expect(anchor.target).toBe('');
    });
  });
});
