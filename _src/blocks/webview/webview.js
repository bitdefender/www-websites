import { getLanguageCountryFromPath } from '../../scripts/scripts.js';

export const BUNDLE_ID_MAPPING = {
  bundleIds: {
    'com.bitdefender.cl.av': 'av',
    'com.bitdefender.cl.is': 'is',
    'com.bitdefender.cl.tsmd': 'tsmd',
    'com.bitdefender.fp': 'fp',
    'com.bitdefender.premiumsecurity': 'ps',
    'com.bitdefender.premiumsecurityplus': 'psp',
    'com.bitdefender.soho': 'soho',
    'com.bitdefender.avformac': 'mac',
    'com.bitdefender.vpn': 'vpn',
    'com.bitdefender.passwordmanager': 'pass',
    'com.bitdefender.bms': 'bms',
    'com.bitdefender.iosprotection': 'ios',
    'com.bitdefender.dataprivacy': 'dip',
    'com.bitdefender.tsmd.v2': 'ts_i',
    'com.bitdefender.premiumsecurity.v2': 'ps_i',
    'com.bitdefender.ultimatesecurityeu.v2': 'us_i',
    'com.bitdefender.ultimatesecurityus.v2': 'us_pi',
    'com.bitdefender.ultimatesecurityplusus.v2': 'us_pie',
    'com.bitdefender.cl.avplus.v2': 'avpm',
    'com.bitdefender.ultimatesecurityus': 'ultsec',
    'com.bitdefender.securepass': 'secpass',
    'com.bitdefender.vsb': 'vsb',
    'com.bitdefender.ccp': 'sc',
    'com.bitdefender.idtheftpremium': 'idtheftp',
    'com.bitdefender.idtheftstandard': 'idthefts',
  },
};

function getLanguage() {
  // Try to get the language from the path
  const langCountry = getLanguageCountryFromPath();
  if (langCountry && langCountry.language && langCountry.country) {
    return `${langCountry.language}-${langCountry.country}`;
  }

  // Try to get the language from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const langFromQuery = urlParams.get('lang');
  if (langFromQuery) {
    return langFromQuery;
  }

  // Default to "en-us"
  return 'en-us';
}

async function checkAndReplacePrivacyPolicyLink(block) {
  // Select the privacy-policy tag
  const privacyPolicyTag = block.querySelector('.privacy-policy-text');
  if (privacyPolicyTag) {
    // Select the link inside the privacy-policy tag
    const privacyPolicyLink = privacyPolicyTag.querySelector('a');
    const locale = getLanguage().toLowerCase();
    if (privacyPolicyLink) {
      privacyPolicyLink.href = privacyPolicyLink.href.replace('locale', locale);
      privacyPolicyLink.setAttribute('target', '_blank');
      const response = await fetch(privacyPolicyLink.href);
      if (response.status === 404) {
        // Replace the link with the en-us version
        privacyPolicyLink.href = 'https://www.bitdefender.com/en-us/site/view/legal-privacy-policy-for-home-users-solutions.html';
      }
    }
  }
}

function getUrlBundleId() {
  const urlParams = new URLSearchParams(window.location.search);
  const bundleId = urlParams.get('bundle_id')?.trim().toLowerCase();
  return bundleId ? BUNDLE_ID_MAPPING.bundleIds[bundleId] : null;
}

function getUrlStoreOption() {
  const urlParams = new URLSearchParams(window.location.search);
  const slots = urlParams.get('slots')?.trim();
  const billingCycle = Number(urlParams.get('billing_cycle'));
  const years = billingCycle / 365;

  if (!slots || !Number.isInteger(years) || years <= 0) {
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
 * @param {string} [options.bundleId]
 * @param {string} [options.urlStoreOption]
 */
function setupStoreContext(
  block,
  product,
  {
    bundleId = getUrlBundleId(),
    urlStoreOption = getUrlStoreOption(),
  } = {},
) {
  const [productId, productUsers, productYears] = product?.split('/') ?? [];

  const productStoreOption = productUsers && productYears ? `${productUsers}-${productYears}` : undefined;

  const attributes = {
    'data-store-context': '',
    'data-store-id': bundleId || productId,
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

function getUrlRemainingDays() {
  const urlParams = new URLSearchParams(window.location.search);
  const remainingDays = urlParams.get('remaining_days')?.trim();

  if (!remainingDays || !/^\d+$/.test(remainingDays)) {
    return null;
  }

  return Number(remainingDays);
}

function getRenewalDate() {
  const remainingDays = getUrlRemainingDays();

  if (remainingDays === null) {
    return '';
  }

  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + remainingDays);

  return new Intl.DateTimeFormat(getLanguage(), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(renewalDate);
}

function replaceRenewalDateMarker(block) {
  const renewalDatePattern = /(?:&#x3C;|&lt;|<)renewal-date(?:&gt;|>)/gi;

  if (!renewalDatePattern.test(block.innerHTML)) {
    return false;
  }

  block.innerHTML = block.innerHTML.replaceAll(renewalDatePattern, getRenewalDate());
  return true;
}

function isWebviewSectionVariant(block, variantClass) {
  const section = block.closest('.section');
  return section?.classList.contains(variantClass);
}

function getDiscountPercentageHtml() {
  return '<span class="prod-save" data-store-hide="no-price=discounted"> <span data-store-discount="percentage"></span></span>';
}

function replaceDiscountPercentageVariable(html = '') {
  const discountPercentageTagPattern = /(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)(.*?)(?:&#x3C;|&lt;|<)\/discounted-price-percentage(?:&gt;|>)/gis;
  const discountPercentageMarkerPattern = /(?:&#x3C;|&lt;|<)discounted-price-percentage(?:&gt;|>)/gi;
  const discountPercentageHtml = getDiscountPercentageHtml();

  return html.replaceAll(
    discountPercentageTagPattern,
    `${discountPercentageHtml}$1`,
  ).replaceAll(discountPercentageMarkerPattern, discountPercentageHtml);
}

function decorateDiscountModal(block) {
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  wrapper?.classList.add('discount-modal');

  const firstRow = [...block.children][0].innerHTML.trim();

  let priceBox = [...block.children]
    .find((child) => child.textContent.includes('{PRICEBOX_V2}'));

  priceBox?.querySelector('h2')?.classList.add('webview-modal-discount');
  priceBox = priceBox?.innerHTML.replaceAll('<p>{PRICEBOX_V2}</p>', '');

  priceBox = replaceDiscountPercentageVariable(priceBox);
  const supportText = [...block.children][2].innerHTML;

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
        ${priceBox}
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

function decorateWebviewSection(block, product, saveText) {
  if (isWebviewSectionVariant(block, 'discount-modal')) {
    return decorateDiscountModal(block);
  }

  if (isWebviewSectionVariant(block, 'churn-thank-you-v1')) {
    return decorateChurnThankYouV1(block);
  }

  return decorateDefaultWebview(block, product, saveText);
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const {
    product, saveText,
  } = section?.dataset || {};

  setupStoreContext(block, product);

  decorateWebviewSection(block, product, saveText);

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  replaceRenewalDateMarker(block);
  await checkAndReplacePrivacyPolicyLink(block);
}
