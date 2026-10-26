// Description: Hero Banner block - the product page hero (dex-core "herobanners"),
// the redesign of hero-dropdown, which stays as it is for the pages not yet moved
import { UserAgent } from '@repobit/dex-utils';
import { AdobeDataLayerService, ButtonClickEvent } from '@repobit/dex-data-layer';
import page from '../../scripts/page.js';

import {
  createTag,
  wrapChildrenWithStoreContext,
  generatePageLoadStartedName,
} from '../../scripts/utils/utils.js';

import { detectModalButtons } from '../../scripts/scripts.js';

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
 */

const DROPDOWN_MARKER = /^\{\s*dropdown\s*\}$/i;

// the dropdown is labelled by the description, which needs an id unique on the page
let instanceCount = 0;

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

function createCta({
  text, href, primary, buyLink, trialDuration,
}) {
  const cta = createTag('a', {
    class: `hero-banner__cta hero-banner__cta--${primary ? 'primary' : 'secondary'}`,
    href: href || '#',
  });
  if (buyLink) {
    cta.dataset.storeRender = '';
    cta.dataset.storeBuyLink = trialDuration || '';
  }
  // detectModalButtons only binds a.button.modal
  if (href?.includes('/fragments/')) cta.classList.add('button', 'modal');
  cta.textContent = text;
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

  if (details) box.append(createTag('p', { class: 'hero-banner__details' }, details));

  box.insertAdjacentHTML('beforeend', `
    <div class="hero-banner__price">
      <div class="hero-banner__was" data-store-render data-store-hide="!it.option.price.discounted" data-store-hide-type="visibility">
        <s class="hero-banner__full" data-store-render data-store-price="full"></s>
        <span class="hero-banner__badge"><span data-store-render data-store-discount="percentage"></span> ${settings.discounttext || 'OFF'}</span>
      </div>
      <p class="hero-banner__final"><span data-store-render data-store-price="discounted||full"></span></p>
    </div>
  `);

  const ctas = buildCtas({ ...settings, hasProduct: true });
  box.append(ctas);
  detectModalButtons(ctas);

  wrapChildrenWithStoreContext(box, {
    productId: product.productId,
    devices: product.devices,
    subscription: product.subscription,
    storeEvent: 'all',
  });

  return box;
}

function buildSelector(products, names, labelledBy, boxes) {
  const select = createTag('select', { class: 'hero-banner__select', name: 'hero-banner-product' });
  if (labelledBy) select.setAttribute('aria-labelledby', labelledBy);

  products.forEach((product, index) => {
    const option = createTag('option', { value: String(index) }, names[index]?.name || product.productId);
    select.append(option);
  });

  select.addEventListener('change', () => {
    boxes.forEach((box, index) => {
      box.hidden = String(index) !== select.value;
    });
  });

  const selector = createTag('div', { class: 'hero-banner__selector' });
  selector.append(select);
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
    content.productName.classList.add('hero-banner__product');
    copy.append(content.productName);
  }
  if (content.h1) {
    content.h1.classList.add('hero-banner__title');
    copy.append(content.h1);
  }

  let descriptionId = '';
  if (content.description.length) {
    instanceCount += 1;
    descriptionId = `hero-banner-description-${instanceCount}`;
    const description = createTag('div', { class: 'hero-banner__description', id: descriptionId });
    description.append(...content.description);
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
      copy.append(buildSelector(products, names, descriptionId || content.h1?.id, boxes));
    }
    copy.append(...boxes);
  } else {
    const ctas = buildCtas({ ...settings, hasProduct: false });
    if (ctas.children.length) {
      copy.append(ctas);
      detectModalButtons(ctas);
    }
  }

  if (content.ctas.length) {
    const authored = createTag('div', { class: 'hero-banner__ctas hero-banner__ctas--authored' });
    content.ctas.forEach((paragraph) => {
      const link = paragraph.querySelector('a');
      link.classList.add('hero-banner__cta', `hero-banner__cta--${link.classList.contains('primary') ? 'primary' : 'secondary'}`);
      authored.append(link);
    });
    copy.append(authored);
  }

  if (content.disclaimer.length) {
    const disclaimer = createTag('div', { class: 'hero-banner__disclaimer' });
    disclaimer.append(...content.disclaimer);
    copy.append(disclaimer);
  }

  if (content.marks.length) {
    const marks = createTag('div', { class: 'hero-banner__marks' });
    content.marks.forEach((paragraph) => marks.append(...paragraph.querySelectorAll('picture')));
    copy.append(marks);
  }

  block.replaceChildren(copy, buildMedia(content.picture, signature, isProductLook));

  if (hardcodedLink && page.name === 'web-sage') {
    block.addEventListener('click', (e) => {
      if (!e.target.closest('.hero-banner__cta--primary')) return;
      const clickEvent = new ButtonClickEvent('click', { asset: 'get it free' });
      clickEvent.eventInfo = { page: generatePageLoadStartedName() };
      AdobeDataLayerService.push(clickEvent);
    });
  }

  if (linksOpenInNewTab) {
    block.querySelectorAll('a.hero-banner__cta').forEach((link) => {
      // leave anchors as they are
      if (!link.href.includes('#')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }
}
