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

function setupStoreContext(block, product) {
  let prodName; let prodUsers; let prodYears;
  if (product) {
    [prodName, prodUsers, prodYears] = product.split('/');
  }
  block.setAttribute('data-store-context', '');
  block.setAttribute('data-store-id', prodName);
  block.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
  block.setAttribute('data-store-department', 'consumer');
  block.setAttribute('data-store-event', 'product-loaded');
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

function getDiscountPercentageHtml() {
  return '<span class="prod-save" data-store-hide="no-price=discounted"> <span data-store-discount="percentage"></span></span>';
}

function replaceDiscountPercentageVariable(html) {
  return html
    .replace(/<discounted-price-percentage>(.*?)<\/discounted-price-percentage>/gis, `${getDiscountPercentageHtml()}$1`);
}

function getOfferCopy(block) {
  const title = getFirstContent(block, 'h1, h2, h3, h4');
  const bodyHtml = [...block.querySelectorAll('p')]
    .find((paragraph) => !paragraph.closest('.button-container')
      && !paragraph.textContent.includes('{PRICEBOX_V2}'));
  const priceBox = [...block.children]
    .find((child) => child.textContent.includes('{PRICEBOX_V2}'));
  const offerSubtitle = priceBox?.innerHTML.trim() || '';
  const legal = [...block.children]
    .find((child) => child.textContent.includes('{under_price_text}'));

  return {
    title,
    body: bodyHtml,
    offerDiscount: getDiscountPercentageHtml(),
    offerSubtitle: replaceDiscountPercentageVariable(offerSubtitle),
    legal: replaceDiscountPercentageVariable(legal),
  };
}

function dismissModal(block) {
  const wrapper = block.closest('.webview-wrapper') || block;
  wrapper.remove();
}

function decorateDiscountModal(block) {
  const wrapper = block.closest('.webview-wrapper') || block.parentElement;
  wrapper?.classList.add('discount-modal');

  const {
    title,
    body,
    offerDiscount,
    offerSubtitle,
    legal,
  } = getOfferCopy(block);

  const buyLink = block.querySelector('a[href*="#buylink"]');
  const secondaryLink = block.querySelector('a[href*="https://localhost/dynamicupsell?view_action=close"]');

  const primaryText = buyLink?.textContent.trim() || '';
  const secondaryText = secondaryLink?.textContent.trim() || '';
  const primaryHref = buyLink?.getAttribute('href') || '#buylink';
  const primaryAction = buyLink ? `
        <p class="button-container">
          <a class="button" href="${primaryHref}" data-store-buy-link><span class="button-text">${primaryText}</span></a>
        </p>` : '';
  const secondaryAction = secondaryLink ? `
        <p class="button-container webview-modal-dismiss">
          <a class="button secondary" href="#dismiss"><span class="button-text">${secondaryText}</span></a>
        </p>` : '';

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
        ${primaryAction}
        ${secondaryAction}
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
    product, saveText,
  } = section?.dataset || {};

  setupStoreContext(block, product);
  const bundleId = getUrlBundleId();
  if (bundleId) {
    block.setAttribute('data-store-id', bundleId);
  }
  const storeOption = getUrlStoreOption();
  if (storeOption) {
    block.setAttribute('data-store-option', storeOption);
  }

  if (isDiscountModal(block)) {
    decorateDiscountModal(block);
  } else {
    decorateDefaultWebview(block, product, saveText);
  }

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  await checkAndReplacePrivacyPolicyLink(block);
}
