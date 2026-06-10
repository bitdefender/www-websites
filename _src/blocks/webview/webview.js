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

function isWebviewSectionVariant(block, variantClass) {
  const section = block.closest('.section');
  return section?.classList.contains(variantClass);
}

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function getDiscountPercentageHtml(hardcodedDiscount) {
  const discount = hardcodedDiscount?.trim();
  if (discount) {
    return `<span class="prod-save">${escapeHtml(discount)}</span>`;
  }

  return '<span class="prod-save" data-store-hide="no-price=discounted"> <span data-store-discount="percentage"></span></span>';
}

function replaceDiscountPercentageVariable(html, hardcodedDiscount) {
  const discountPercentageTagPattern = /(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)(.*?)(?:&#x3C;|&lt;|<)\/discounted-price-percentage(?:&gt;|>)/gis;
  const discountPercentageMarkerPattern = /(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)/gi;
  const discountPercentageHtml = getDiscountPercentageHtml(hardcodedDiscount);

  return html.replaceAll(
    discountPercentageTagPattern,
    `${discountPercentageHtml}$1`,
  ).replaceAll(discountPercentageMarkerPattern, discountPercentageHtml);
}

function decorateDiscountModal(block, hardcodedDiscount) {
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  wrapper?.classList.add('discount-modal');

  const children = [...block.children];

  const firstRow = children[0]?.innerHTML.trim() ?? '';
  const supportText = children[2]?.innerHTML ?? '';

  const priceBoxElement = children.find((child) => child.textContent?.includes('{PRICEBOX_V2}'));
  priceBoxElement?.querySelector('h2')?.classList.add('webview-modal-discount');

  priceBoxElement?.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.textContent.trim() === '{PRICEBOX_V2}') {
      paragraph.remove();
    }
  });

  const priceBoxHtml = replaceDiscountPercentageVariable(
    priceBoxElement?.innerHTML ?? '',
    hardcodedDiscount,
  );

  const buyLink = block.querySelector('a[href*="#buylink"]');
  const secondaryLink = block.querySelector('a[href*="https://localhost/dynamicupsell?view_action=close"]');

  const primaryText = buyLink?.textContent.trim() || '';
  const secondaryText = secondaryLink?.textContent.trim() || '';
  const secondaryHref = secondaryLink?.getAttribute('href');
  const primaryHref = buyLink?.getAttribute('href') || '#buylink';
  const primaryAction = buyLink ? `
        <p class="button-container">
          <a class="button" href="${primaryHref}" data-store-buy-link><span class="button-text">${primaryText}</span></a>
        </p>` : '';
  const secondaryAction = secondaryLink ? `
        <p class="button-container webview-modal-dismiss">
          <a class="button secondary" href="${secondaryHref}""><span class="button-text">${secondaryText}</span></a>
        </p>` : '';

  block.innerHTML = `
    <a href="https://localhost/dynamicupsell?view_action=close" class="webview-modal-close" type="button" aria-label="Close"></a>
    <div class="webview-modal-content">
      <div class="webview-modal-copy">${firstRow}</div>
      <div class="webview-modal-offer">
        ${priceBoxHtml}
      </div>
      <div class="webview-modal-text-bottom">${supportText}</div>
      <div class="webview-modal-actions">
        ${primaryAction}
        ${secondaryAction}
      </div>
    </div>`;
}

function decorateChurnThankYouV1(block) {
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  wrapper?.classList.add('churn-thank-you-v1');

  const media = block.querySelector('picture, img');
  const title = block.querySelector('h1, h2, h3, h4, h5, h6');
  const ctaLink = block.querySelector('a');
  const ctaHref = ctaLink?.getAttribute('href');
  const paragraphs = [...block.querySelectorAll('p')]
    .filter((paragraph) => !paragraph.querySelector('img, a') && paragraph.textContent.trim());
  const body = paragraphs.map((paragraph) => paragraph.outerHTML).join('');
  const ctaText = ctaLink?.textContent.trim();

  block.innerHTML = `
    <a href="https://localhost/dynamicupsell?view_action=close" class="webview-modal-close" type="button" aria-label="Close"></a>
    <div class="webview-thank-you-modal-content">
      ${media ? `<div class="webview-thank-you-modal-image">${media.outerHTML}</div>` : ''}
      <h2 class="webview-thank-you-modal-title">${title?.innerHTML.trim()}</h2>
      <div class="webview-thank-you-modal-copy">${body}</div>
      <p class="button-container webview-thank-you-modal-action">
        <a class="button" href="${ctaHref}"><span class="button-text">${ctaText}</span></a>
      </p>
    </div>`;
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

function decorateWebviewSection(block, product, saveText, hardcodedDiscount) {
  if (isWebviewSectionVariant(block, 'discount-modal')) {
    return decorateDiscountModal(block, hardcodedDiscount);
  }

  if (isWebviewSectionVariant(block, 'churn-thank-you-v1')) {
    return decorateChurnThankYouV1(block);
  }

  return decorateDefaultWebview(block, product, saveText);
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const {
    product, saveText, hardcodedDiscount,
  } = section?.dataset || {};

  setupStoreContext(block, product);

  decorateWebviewSection(block, product, saveText, hardcodedDiscount);

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  replaceRenewalDateMarker(block);
  await checkAndReplacePrivacyPolicyLink(block);
}
