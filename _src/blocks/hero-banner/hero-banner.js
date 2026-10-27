// Description: Hero Banner block - the product page hero (dex-core "herobanners"),
// the redesign of hero-dropdown, which stays as it is for the pages not yet moved
import { UserAgent } from '@repobit/dex-utils';
import { AdobeDataLayerService, ButtonClickEvent } from '@repobit/dex-data-layer';
import page from '../../scripts/page.js';

import {
  createTag,
  getDsnBase,
  wrapChildrenWithStoreContext,
  generatePageLoadStartedName,
} from '../../scripts/utils/utils.js';

import { openModal } from '../../scripts/scripts.js';

/*
 * Authored content, one cell:
 *   picture                  the media panel
 *   heading before the h1    the product name (e.g. "Bitdefender Ultimate Security")
 *   h1                       the value prop
 *   anything until {Dropdown} the description
 *   {Dropdown}               where the price and the CTAs go
 *   anything after it         the disclaimer
 *   paragraphs of pictures    award marks
 *   paragraphs of a link      extra CTAs (decorateButtons has already made them a.button)
 *
 * Section metadata:
 *   Dropdown          product codes, id/devices/years, comma separated. One product: a price,
 *                     no dropdown. Two or more: a dropdown. None: no price at all
 *   productNames      one per product, "name | details", the details line under the dropdown
 *   signature         "Trusted. Always.", the eyebrow, or over the image in the product look
 *   buyButtonText, discountText, secondButtonText, secondButtonLink, trialDuration,
 *   Hardcoded-link, Microsoft-edge-link, Links-open-in-new-tab   as in hero-dropdown
 *
 * The look follows the content: a product name gives the product look (white, the
 * signature over the image), otherwise it is the card look (grey card, signature as the
 * eyebrow). The block classes `product` and `card` force one.
 *
 * Text, controls and the badge are dex-system-design atoms (bd-h, bd-p, bd-custom-dropdown,
 * bd-button-link, bd-badge); the layout around them is this block's, on the same tokens.
 * The hero is drawn without waiting for them: it is the LCP, and they take a second to
 * download on mobile. The CSS sizes each one as it will render, so the upgrade moves nothing.
 */

const DROPDOWN_MARKER = /^\{\s*dropdown\s*\}$/i;

const ATOMS = ['heading', 'paragraph', 'badge', 'button', 'dropdown'];

// Resolves once the atom is defined and has rendered its shadow root
const whenRendered = (atom) => customElements.whenDefined(atom.localName)
  .then(() => atom.updateComplete);

// the codes look like ps_i/5/1; anything without the three parts is not a product
function parseProducts(raw = '') {
  return raw.split(',')
    .map((code) => code.trim())
    .filter(Boolean)
    .map((code) => {
      const [productId, devices, subscription] = code.split('/').map((part) => part.trim());
      return { productId, devices, subscription };
    })
    .filter(({ productId, devices, subscription }) => productId && devices && subscription);
}

function parseProductNames(raw = '') {
  return raw.split(',').map((entry) => {
    const [name = '', details = ''] = entry.split('|').map((part) => part.trim());
    return { name, details };
  });
}

const isPicturesOnly = (el) => el.tagName === 'P' && el.querySelector('picture')
  && !el.textContent.trim();

// decorateButtons nests the link in strong/em for the primary and secondary looks
const isButtonOnly = (el) => el.tagName === 'P' && el.querySelectorAll('a').length === 1
  && !!el.querySelector('a.button') && el.textContent.trim() === el.querySelector('a').textContent.trim();

// The atom's slot keeps the authored inline markup (links, line breaks, emphasis)
function toAtom(tagName, source, attributes = {}) {
  const atom = createTag(tagName, attributes);
  atom.append(...source.childNodes);
  if (source.id) atom.id = source.id;
  return atom;
}

/*
 * A CTA is a bd-button-link: accent (red) for the buy button, tertiary (blue outline)
 * for the other. Its anchor is in the shadow root, so:
 *  - the store only fills a buy link in when the host carries data-bd-watch-shadow, and
 *    only looks into a shadow root when the host is added to the page. The host is usually
 *    added before the atom has upgraded, so it is put back in place once it has rendered;
 *  - a fragment link opens a modal from a click on the host, as detectModalButtons
 *    does for a light-DOM a.button.modal.
 */
function createCta({
  text, href, primary, buyLink, trialDuration, keepModal = false,
}) {
  const cta = createTag('bd-button-link', {
    class: `hero-banner__cta hero-banner__cta--${primary ? 'primary' : 'secondary'}`,
    variant: primary ? 'accent' : 'tertiary',
    size: 'lg',
    fullwidth: '',
  });
  cta.textContent = text;

  if (buyLink) {
    cta.buyLink = true;
    cta.setAttribute('data-bd-watch-shadow', '');
    whenRendered(cta).then(() => {
      // the atom marks its anchor as a buy link with no value; a trial needs the duration on it
      const anchor = cta.shadowRoot?.querySelector('a');
      if (anchor && trialDuration) anchor.dataset.storeBuyLink = trialDuration;
      if (cta.isConnected) cta.parentNode.insertBefore(cta, cta.nextSibling);
    });
  } else if (href?.includes('/fragments/')) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(href, keepModal);
    });
  } else if (href) {
    cta.href = href;
  }
  return cta;
}

function buildCtas(settings) {
  const {
    buybuttontext = 'Buy Now', secondbuttontext, secondbuttonlink,
    hardcodedLink, microsoftEdgeLink, trialDuration, hasProduct,
  } = settings;
  const ctas = createTag('div', { class: 'hero-banner__ctas' });

  let primaryHref = hardcodedLink;
  if (hardcodedLink && microsoftEdgeLink && UserAgent.browser === 'edge') primaryHref = microsoftEdgeLink;
  // without a product the store has no buy link to give, so only a hardcoded one makes a button
  if (primaryHref || hasProduct) {
    ctas.append(createCta({
      text: buybuttontext,
      href: primaryHref,
      primary: true,
      buyLink: !primaryHref,
      trialDuration,
    }));
  }

  if (secondbuttontext && secondbuttonlink) {
    ctas.append(createCta({ text: secondbuttontext, href: secondbuttonlink }));
  }

  return ctas;
}

function buildPriceBox(product, details, settings) {
  const box = createTag('div', { class: 'hero-banner__offer await-loader' });

  if (details) box.append(createTag('bd-p', { class: 'hero-banner__details', variant: 'small' }, details));

  // the store renders into light-DOM nodes, which the atoms slot
  box.insertAdjacentHTML('beforeend', `
    <div class="hero-banner__price">
      <div class="hero-banner__was" data-store-render data-store-hide="!it.option.price.discounted" data-store-hide-type="visibility">
        <bd-p class="hero-banner__full" variant="regular" font-weight="medium" color="muted"><s data-store-render data-store-price="full"></s></bd-p>
        <bd-badge class="hero-banner__badge" tone="success" variant="fill" size="lg"><span data-store-render data-store-discount="percentage"></span> ${settings.discounttext || 'OFF'}</bd-badge>
      </div>
      <p class="hero-banner__final"><span data-store-render data-store-price="discounted||full"></span></p>
    </div>
  `);

  box.append(buildCtas({ ...settings, hasProduct: true }));

  wrapChildrenWithStoreContext(box, {
    productId: product.productId,
    devices: product.devices,
    subscription: product.subscription,
    storeEvent: 'all',
  });

  return box;
}

/*
 * bd-custom-dropdown takes its options as text and reports the chosen text, so the
 * labels have to be unique to map back to a product. It has no way to be named from
 * outside its shadow root, and Figma draws no visible label, so the select inside is
 * given the description (or the h1) as its aria-label once it has rendered.
 */
function buildSelector(products, names, accessibleName, boxes) {
  const labels = [];
  products.forEach((product, index) => {
    const { name, details } = names[index] || {};
    let label = name || product.productId;
    if (labels.includes(label) && details) label = `${label} - ${details}`;
    if (labels.includes(label)) label = `${label} (${index + 1})`;
    labels.push(label);
  });

  const dropdown = createTag('bd-custom-dropdown', {
    class: 'hero-banner__select',
    name: 'hero-banner-product',
    size: 'md',
  });
  dropdown.options = labels;
  [dropdown.value] = labels;
  // shown until the atom renders, which has no slot and hides it
  [dropdown.textContent] = labels;

  dropdown.addEventListener('bd-change', (e) => {
    const chosen = labels.indexOf(e.detail.value);
    boxes.forEach((box, index) => {
      box.hidden = index !== chosen;
    });
  });

  if (accessibleName) {
    whenRendered(dropdown).then(() => {
      dropdown.shadowRoot?.querySelector('select')?.setAttribute('aria-label', accessibleName);
    });
  }

  const selector = createTag('div', { class: 'hero-banner__selector' });
  selector.append(dropdown);
  return selector;
}

// The authored cell, split into the parts the design places
function readContent(cell) {
  const nodes = [...cell.children];
  const h1 = cell.querySelector('h1');
  const picture = cell.querySelector('picture');
  const h1Index = nodes.indexOf(h1);

  const productName = h1Index > 0
    ? nodes.slice(0, h1Index).reverse().find((el) => /^H[2-6]$/.test(el.tagName))
    : null;

  const after = h1Index >= 0 ? nodes.slice(h1Index + 1) : nodes;
  const markerIndex = after.findIndex((el) => DROPDOWN_MARKER.test(el.textContent.trim()));
  const body = markerIndex >= 0 ? after.slice(0, markerIndex) : after;
  const tail = markerIndex >= 0 ? after.slice(markerIndex + 1) : [];

  const isHeroPicture = (el) => picture && el.contains(picture);
  const marks = [...body, ...tail].filter((el) => isPicturesOnly(el) && !isHeroPicture(el));
  const ctas = [...body, ...tail].filter(isButtonOnly);
  const rest = (list) => list.filter((el) => !marks.includes(el) && !ctas.includes(el)
    && !isHeroPicture(el));

  return {
    h1,
    picture,
    productName,
    description: rest(body),
    disclaimer: rest(tail),
    marks,
    ctas,
  };
}

function buildMedia(picture, signature, isProductLook) {
  const media = createTag('div', { class: 'hero-banner__media' });
  if (!picture) return media;

  const img = picture.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }
  media.append(picture);

  // the product look puts the signature over the image, on a brand scrim
  if (isProductLook && signature) {
    media.append(
      createTag('div', { class: 'hero-banner__scrim', 'aria-hidden': 'true' }),
      createTag('p', { class: 'hero-banner__signature' }, signature),
    );
  }
  return media;
}

// The authored button paragraphs: bold is the red one, plain the outline one
function authoredCta(paragraph) {
  const link = paragraph.querySelector('a');
  // detectModalButtons has already moved a fragment link's href to `location`
  const href = link.getAttribute('href') || link.getAttribute('location');
  return createCta({
    text: link.textContent.trim(),
    href,
    primary: link.classList.contains('primary'),
    keepModal: link.dataset.stopAutomaticModalRefresh === 'true',
  });
}

async function loadAtoms() {
  const base = getDsnBase();
  try {
    await Promise.all(ATOMS.map((atom) => import(`${base}${atom}`)));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('hero-banner: DSN import failed, continuing with native rendering', err);
  }
}

export default function decorate(block) {
  const section = block.closest('.section');
  const settings = { ...(section?.dataset || {}) };
  const {
    signature, hardcodedLink, linksOpenInNewTab,
  } = settings;

  const cell = block.querySelector(':scope > div > div') || block;
  const content = readContent(cell);
  const products = parseProducts(settings.dropdown);
  const names = parseProductNames(settings.productnames);

  const isProductLook = block.classList.contains('product')
    || (!block.classList.contains('card') && !!content.productName);
  block.classList.add(isProductLook ? 'hero-banner--product' : 'hero-banner--card');
  if (!content.picture) block.classList.add('hero-banner--no-media');

  const copy = createTag('div', { class: 'hero-banner__content' });

  if (!isProductLook && signature) {
    copy.append(createTag('p', { class: 'hero-banner__eyebrow' }, signature));
  }
  if (content.productName) {
    // the authored level stays: the page owns the outline, the design the size
    copy.append(toAtom('bd-h', content.productName, {
      class: 'hero-banner__product',
      as: content.productName.tagName.toLowerCase(),
      'visual-level': 'h4',
      color: 'primary',
    }));
  }
  if (content.h1) {
    copy.append(toAtom('bd-h', content.h1, { class: 'hero-banner__title', as: 'h1', 'visual-level': 'h1' }));
  }

  if (content.description.length) {
    const description = createTag('div', { class: 'hero-banner__description' });
    // Figma draws the description as body text, so a heading used as one becomes a paragraph
    description.append(...content.description.map((el) => {
      const paragraph = toAtom('bd-p', el, { variant: 'regular' });
      // Word bolds such a heading whole; the CSS takes that weight off
      if (/^H[1-6]$/.test(el.tagName)) paragraph.dataset.authoredAs = 'heading';
      return paragraph;
    }));
    copy.append(description);
  }

  if (products.length) {
    const boxes = products.map((product, index) => {
      const box = buildPriceBox(product, names[index]?.details, settings);
      box.hidden = index > 0;
      return box;
    });

    if (products.length > 1) {
      // the dropdown is named by what the hero asks the visitor to pick
      const accessibleName = (content.description.length
        ? copy.querySelector('.hero-banner__description')
        : copy.querySelector('.hero-banner__title'))?.textContent.trim();
      copy.append(buildSelector(products, names, accessibleName, boxes));
    }
    copy.append(...boxes);
  } else {
    const ctas = buildCtas({ ...settings, hasProduct: false });
    if (ctas.children.length) copy.append(ctas);
  }

  if (content.ctas.length) {
    const authored = createTag('div', { class: 'hero-banner__ctas hero-banner__ctas--authored' });
    authored.append(...content.ctas.map(authoredCta));
    copy.append(authored);
  }

  if (content.disclaimer.length) {
    const disclaimer = createTag('div', { class: 'hero-banner__disclaimer' });
    disclaimer.append(...content.disclaimer.map((el) => toAtom('bd-p', el, { variant: 'xsmall', color: 'muted' })));
    copy.append(disclaimer);
  }

  if (content.marks.length) {
    const marks = createTag('div', { class: 'hero-banner__marks' });
    content.marks.forEach((paragraph) => marks.append(...paragraph.querySelectorAll('picture')));
    copy.append(marks);
  }

  block.replaceChildren(copy, buildMedia(content.picture, signature, isProductLook));

  // the image is the LCP: on a slow connection the atoms would share its bandwidth, so they
  // load once it has, and until then the CSS draws them
  const img = block.querySelector('.hero-banner__media img');
  if (img && !img.complete) {
    img.addEventListener('load', loadAtoms, { once: true });
    img.addEventListener('error', loadAtoms, { once: true });
  } else loadAtoms();

  if (hardcodedLink && page.name === 'web-sage') {
    block.addEventListener('click', (e) => {
      if (!e.target.closest('.hero-banner__cta--primary')) return;
      const clickEvent = new ButtonClickEvent('click', { asset: 'get it free' });
      clickEvent.eventInfo = { page: generatePageLoadStartedName() };
      AdobeDataLayerService.push(clickEvent);
    });
  }

  if (linksOpenInNewTab) {
    block.querySelectorAll('bd-button-link.hero-banner__cta').forEach((cta) => {
      // leave anchors and store buy links as they are
      if (cta.href && !cta.href.includes('#')) cta.target = '_blank';
    });
  }
}
