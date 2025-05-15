import { getLanguageCountryFromPath } from '../../scripts/scripts.js';

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

async function decorate(block) {
  const {
    product, saveText,
  } = block.closest('.section').dataset;

  let prodName; let prodUsers; let prodYears;
  if (product) {
    [prodName, prodUsers, prodYears] = product.split('/');
  }
  block.setAttribute('data-store-context', '');
  block.setAttribute('data-store-id', prodName);
  block.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
  block.setAttribute('data-store-department', 'consumer');
  block.setAttribute('data-store-event', 'product-loaded');

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

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.parentElement.classList.add('dark-mode');
  }

  await checkAndReplacePrivacyPolicyLink(block);

  // Select the link with the #upgrade href
  const upgradeLink = block.querySelector('a[href*="#upgrade"]');
  if (upgradeLink) {
    // Modify the URL to set the feature parameter to main_ui
    const upgradeUrl = new URL(window.location.href);
    upgradeUrl.searchParams.set('feature', 'main_ui');
    upgradeLink.href = upgradeUrl.toString();
  }
}

export { decorate as default };
//# sourceMappingURL=webview.js.map
