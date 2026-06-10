import { getLanguageCountryFromPath } from '../../scripts/scripts.js';

const URL_PARAMS = {
  slots: 'slots',
  billingCycle: 'billing_cycle',
  renewalDate: 'renewal-date',
  lang: 'lang',
};

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Get locale from path, query-params or default to en-us
 * @returns {string} Locale in language-country format
 */
function getLanguage() {
  const langCountry = getLanguageCountryFromPath();
  if (langCountry && langCountry.language && langCountry.country) {
    return `${langCountry.language}-${langCountry.country}`;
  }

  const langFromQuery = getUrlParam(URL_PARAMS.lang);
  if (langFromQuery) {
    return langFromQuery;
  }

  return 'en-us';
}

async function checkAndReplacePrivacyPolicyLink(block) {
  const privacyPolicyLink = block.querySelector('.privacy-policy-text a');

  if (!privacyPolicyLink) {
    return;
  }

  const locale = getLanguage().toLowerCase();
  privacyPolicyLink.href = privacyPolicyLink.href.replace('locale', locale);
  privacyPolicyLink.setAttribute('target', '_blank');
  privacyPolicyLink.setAttribute('rel', 'noopener noreferrer');

  try {
    const response = await fetch(privacyPolicyLink.href, { method: 'HEAD' });

    if (response.status === 404) {
      privacyPolicyLink.href = 'https://www.bitdefender.com/en-us/site/view/legal-privacy-policy-for-home-users-solutions.html';
    }
  } catch {
    privacyPolicyLink.href = 'https://www.bitdefender.com/en-us/site/view/legal-privacy-policy-for-home-users-solutions.html';
  }
}

function getUrlStoreOption() {
  const slots = getUrlParam(URL_PARAMS.slots);
  const billingCycle = Number(getUrlParam(URL_PARAMS.billingCycle));

  const VALID_BILLING_CYCLES = new Map([
    [365, 1],
    [730, 2],
    [1095, 3],
  ]);

  if (!slots || !/^\d+$/.test(slots)) {
    return null;
  }

  const years = VALID_BILLING_CYCLES.get(billingCycle);
  if (!years) {
    return null;
  }

  return `${slots}-${years}`;
}

/**
 * Sets store context attributes on the block.
 * URL-provided values override values derived from the product string.
 *
 * @param {HTMLElement} block
 * @param {string} [product] Product string in the format "id/users/years".
 * @param {Object} [options]
 * @param {string} [options.urlStoreOption]
 */
function setupStoreContext(block, product, options = {}) {
  const urlStoreOption = options.urlStoreOption ?? getUrlStoreOption();
  const [productId, productUsers, productYears] = product?.split('/') ?? [];

  const productStoreOption = productUsers && productYears ? `${productUsers}-${productYears}` : undefined;

  const attributes = {
    'data-store-context': '',
    'data-store-id': productId,
    'data-store-option': urlStoreOption || productStoreOption,
    'data-store-department': 'consumer',
    'data-store-event': 'product-loaded',
  };

  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== undefined && value !== null) {
      block.setAttribute(name, value);
    }
  });
}

function getRenewalDate() {
  const renewalTimestamp = getUrlParam(URL_PARAMS.renewalDate)?.trim();

  if (!renewalTimestamp || !/^\d+$/.test(renewalTimestamp)) {
    return null;
  }

  const renewalDate = new Date(Number(renewalTimestamp) * 1000);
  if (Number.isNaN(renewalDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(getLanguage(), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(renewalDate);
}

function replaceRenewalDateMarker(block) {
  const renewalDatePattern = /(?:&#x3C;|&lt;|<)renewal-date(?:&gt;|>)/gi;
  const renewalDate = getRenewalDate();

  if (!renewalDate) {
    return false;
  }

  if (!renewalDatePattern.test(block.innerHTML)) {
    return false;
  }

  block.innerHTML = block.innerHTML.replaceAll(renewalDatePattern, renewalDate);
  return true;
}

function isDiscountModal(block) {
  const section = block.closest('.section');
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  return block.classList.contains('discount-modal')
    || wrapper?.classList.contains('discount-modal')
    || section?.classList.contains('discount-modal');
}

function getFirstContent(block, selector, fallback = '') {
  const element = block.querySelector(selector);
  return element?.innerHTML.trim() || fallback;
}

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function getDiscountPercentageHtml(saveText, hardcodedDiscount) {
  const discount = hardcodedDiscount?.trim();
  if (discount) {
    return `<span class="prod-save">${escapeHtml(discount)}</span>`;
  }

  return `<span class="prod-save" data-store-hide="no-price=discounted">${saveText ?? ''} <span data-store-discount="percentage"></span></span>`;
}

function replaceDiscountPercentageVariable(html, saveText, hardcodedDiscount) {
  const discountPercentageHtml = getDiscountPercentageHtml(saveText, hardcodedDiscount);

  return html
    .replace(/(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)(.*?)(?:&#x3C;|&lt;|<)\/discounted-price-percentage(?:&gt;|>)/gis, `${discountPercentageHtml}$1`)
    .replace(/(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)/gi, discountPercentageHtml);
}

function removeDiscountPercentageVariable(html) {
  return html
    .replace(/(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)(.*?)(?:&#x3C;|&lt;|<)\/discounted-price-percentage(?:&gt;|>)/gis, '$1')
    .replace(/(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)/gi, '');
}

function getOfferCopy(block, saveText, hardcodedDiscount) {
  const title = getFirstContent(block, 'h1, h2, h3, h4', 'Thank you for your feedback!');
  const bodyHtml = [...block.querySelectorAll('p')]
    .find((paragraph) => !paragraph.closest('.button-container')
      && !paragraph.textContent.includes('{PRICE_BOX}')
      && !paragraph.textContent.includes('{PRICEBOX_V2}')
      && !paragraph.textContent.includes('{under_price_text}'))?.innerHTML.trim()
    || 'It really helps. As a sign of gratitude, here’s a special offer for you:';
  const priceBox = [...block.children]
    .find((child) => child.textContent.includes('{PRICE_BOX}')
      || child.textContent.includes('{PRICEBOX_V2}'));
  const offerSubtitle = removeDiscountPercentageVariable(priceBox?.innerHTML || '')
    .replaceAll('{PRICE_BOX}', '')
    .replaceAll('{PRICEBOX_V2}', '')
    .replace(/<\/?p>/g, '')
    .trim()
    || 'applied on your next renewal';
  const legal = [...block.children]
    .find((child) => child.textContent.includes('{under_price_text}'))?.innerHTML
    .replaceAll('{under_price_text}', '').trim()
    || '<p>The offer is available if you choose to keep auto-renewal on.</p>';

  return {
    title,
    body: removeDiscountPercentageVariable(bodyHtml),
    offerDiscount: getDiscountPercentageHtml(saveText, hardcodedDiscount),
    offerSubtitle: replaceDiscountPercentageVariable(offerSubtitle, saveText, hardcodedDiscount),
    legal: replaceDiscountPercentageVariable(legal, saveText, hardcodedDiscount),
  };
}

function dismissModal(block) {
  const wrapper = block.closest('.webview-wrapper') || block;
  wrapper.remove();
}

function getSecondaryLink(block, buyLink) {
  const links = [...block.querySelectorAll('a')].filter((link) => link !== buyLink);
  return links.find((link) => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.trim().toLowerCase();
    return href.includes('#dismiss')
      || href.includes('#end-auto-renewal')
      || text.includes('end auto renewal');
  }) || links.filter((link) => link.closest('.button-container')).at(-1) || links.at(-1);
}

function decorateDiscountModal(block, saveText, hardcodedDiscount) {
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  wrapper?.classList.add('discount-modal');

  const {
    title,
    body,
    offerDiscount,
    offerSubtitle,
    legal,
  } = getOfferCopy(block, saveText, hardcodedDiscount);

  const buyLink = block.querySelector('a[href*="#buylink"]');
  const secondaryLink = getSecondaryLink(block, buyLink);
  const primaryText = buyLink?.textContent.trim() || 'I take the offer';
  const secondaryText = secondaryLink?.textContent.trim() || 'End auto renewal';
  const primaryHref = buyLink?.getAttribute('href') || '#buylink';

  block.innerHTML = `
    <button class="webview-modal-close" type="button" aria-label="Close"></button>
    <div class="webview-modal-content">
      <h2>${title}</h2>
      <div class="webview-modal-copy">${body}</div>
      <div class="webview-modal-offer">
        <div class="webview-modal-discount">${offerDiscount}</div>
        <div class="webview-modal-offer-subtitle">${offerSubtitle}</div>
      </div>
      <div class="webview-modal-legal">${legal}</div>
      <div class="webview-modal-actions">
        <p class="button-container">
          <a class="button" href="${primaryHref}" data-store-buy-link><span class="button-text">${primaryText}</span></a>
        </p>
        <p class="button-container webview-modal-dismiss">
          <a class="button secondary" href="#dismiss"><span class="button-text">${secondaryText}</span></a>
        </p>
      </div>
    </div>`;

  block.querySelector('.webview-modal-close')
    ?.addEventListener('click', () => dismissModal(block));
  block.querySelector('.webview-modal-dismiss a')
    ?.addEventListener('click', (event) => {
      event.preventDefault();
      dismissModal(block);
    });
}

function decorateDefaultWebview(block, product, saveText) {
  const buyLink = block.querySelector('a[href*="#buylink"]');
  buyLink?.setAttribute('data-store-buy-link', '');

  [...block.children].forEach((child) => {
    if (child.textContent.includes('{PRICE_BOX}') && product) {
      child.innerHTML = child.innerHTML.replace('{PRICE_BOX}', '<div class="price-box">Price box</div>');
      child.innerHTML = `
      <div class="price-box">
        <div>
          <span class="prod-oldprice" data-store-price="full" data-store-hide="no-price=discounted"></span>
          <span class="prod-percent" data-store-hide="no-price=discounted"> <span data-store-discount="percentage"></span> ${saveText || ''} </span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice"> <span data-store-price="discounted||full"> </span></span>
        </div>
      </div>`;
    }
    if (child.textContent.includes('{under_price_text}')) {
      // remove the p tag that is wrapping the text {under_price_text}
      child.querySelector('p')?.remove();

      child.classList.add('under-price-text');
    }

    if (child.textContent.includes('<privacy-policy-text>')) {
      // remove the p tag that is wrapping the text {under_price_text}
      child.querySelector('p')?.remove();

      child.classList.add('privacy-policy-text');
    }
  });

  // Select the link with the #upgrade href
  const upgradeLink = block.querySelector('a[href*="#upgrade"]');
  if (upgradeLink) {
    // Modify the URL to set the feature parameter to main_ui
    const upgradeUrl = new URL(window.location.href);
    upgradeUrl.searchParams.set('feature', 'main_ui');
    upgradeLink.href = upgradeUrl.toString();
  }
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const {
    product, saveText, hardcodedDiscount,
  } = section?.dataset || {};

  setupStoreContext(block, product);

  if (isDiscountModal(block)) {
    decorateDiscountModal(block, saveText, hardcodedDiscount);
  } else {
    decorateDefaultWebview(block, product, saveText);
  }

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  replaceRenewalDateMarker(block);
  await checkAndReplacePrivacyPolicyLink(block);
}
