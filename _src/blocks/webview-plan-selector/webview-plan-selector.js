import { getLanguageCountryFromPath } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

const PRIVACY_POLICY_FALLBACK = 'https://www.bitdefender.com/en-us/site/view/legal-privacy-policy-for-home-users-solutions.html';

function getLanguage() {
  const langCountry = getLanguageCountryFromPath();
  if (langCountry?.language && langCountry?.country) {
    return `${langCountry.language}-${langCountry.country}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('lang') || 'en-us';
}

function replacePricePlaceholders(html) {
  return html
    .replace(
      /&lt;discounted-yearly-price&gt;|<discounted-yearly-price>/gi,
      '<span class="discounted-yearly-price await-loader" data-store-price="discounted||full"></span>',
    )
    .replace(
      /&lt;full-yearly-price&gt;|<full-yearly-price>/gi,
      '<span class="full-yearly-price await-loader" data-store-price="full"></span>',
    )
    .replace(
      /&lt;discounted-monthly-price&gt;|<discounted-monthly-price>/gi,
      '<span class="discounted-monthly-price await-loader" data-store-price="discounted-monthly||full-monthly"></span>',
    )
    .replace(
      /&lt;full-monthly-price&gt;|<full-monthly-price>/gi,
      '<span class="full-monthly-price await-loader" data-store-price="full-monthly"></span>',
    );
}

function parseProductList(sectionEl) {
  const products = sectionEl?.dataset?.products;
  if (!products) {
    return [];
  }

  return products
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, users, years] = entry.split('/').map((part) => (part || '').trim());
      return {
        id,
        users,
        years,
      };
    });
}

async function checkAndReplacePrivacyPolicyLink(block) {
  const privacyPolicyLink = block.querySelector('.webview-plan-selector-legal a:last-of-type');
  if (!privacyPolicyLink) {
    return;
  }

  privacyPolicyLink.href = privacyPolicyLink.href.replace('locale', getLanguage().toLowerCase());
  privacyPolicyLink.setAttribute('target', '_blank');

  try {
    const response = await fetch(privacyPolicyLink.href);
    if (!response.ok) {
      privacyPolicyLink.href = PRIVACY_POLICY_FALLBACK;
    }
  } catch (error) {
    privacyPolicyLink.href = PRIVACY_POLICY_FALLBACK;
  }
}

function getMeaningfulCells(row) {
  if (!row) {
    return [];
  }

  return [...row.children].filter((cell) => {
    const hasText = cell.textContent.trim().length > 0;
    const hasContentNode = cell.querySelector('a, h1, h2, h3, p, ul, ol, img');
    return hasText || hasContentNode;
  });
}

function normalizePlanName(name) {
  return (name || '').replace(/\[checked\]/gi, '').trim();
}

function normalizeMetadataKey(key) {
  return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseMetadataBooleanList(value) {
  return String(value || '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .map((token) => {
      if (['true', '1', 'yes', 'y'].includes(token)) {
        return true;
      }

      if (['false', '0', 'no', 'n'].includes(token)) {
        return false;
      }

      return null;
    });
}

function parseBenefitsByProduct(sectionEl) {
  const benefitStatesByProduct = {};
  const entries = Object.entries(sectionEl?.dataset || {});

  entries.forEach(([key, value]) => {
    const normalizedKey = normalizeMetadataKey(key);
    const match = normalizedKey.match(/^benefitsproduct(\d+)$/);

    if (!match) {
      return;
    }

    const productIndex = Number(match[1]) - 1;
    if (!Number.isInteger(productIndex) || productIndex < 0) {
      return;
    }

    benefitStatesByProduct[productIndex] = parseMetadataBooleanList(value);
  });

  return benefitStatesByProduct;
}

const NR_OF_DEVICES_TOKEN_REGEX = /&lt;nr-of-devices&gt;|<nr-of-devices\s*\/?>(?:<\/nr-of-devices>)?/gi;

function registerDevicePlaceholders(block) {
  const placeholders = [];

  block.querySelectorAll('h1, h2, h3, p, li, span, strong, em, a').forEach((element) => {
    const template = element.innerHTML;
    NR_OF_DEVICES_TOKEN_REGEX.lastIndex = 0;
    if (!NR_OF_DEVICES_TOKEN_REGEX.test(template)) {
      return;
    }

    placeholders.push({ element, template });
    NR_OF_DEVICES_TOKEN_REGEX.lastIndex = 0;
  });

  return placeholders;
}

function updateDevicePlaceholders(placeholders, products, selectedPlanIndex) {
  const devicesValue = products?.[selectedPlanIndex]?.users || '';

  placeholders.forEach(({ element, template }) => {
    element.innerHTML = template.replace(NR_OF_DEVICES_TOKEN_REGEX, devicesValue);
    NR_OF_DEVICES_TOKEN_REGEX.lastIndex = 0;
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const section = block.closest('.section');
  const products = parseProductList(section);

  const headingCell = getMeaningfulCells(rows[0])[0];
  const heading = headingCell?.querySelector('h1, h2, h3');
  const headingMarkup = heading ? heading.outerHTML : '<h1>Upgrade now at an exclusive in-app price</h1>';

  const featuresRowCells = getMeaningfulCells(rows[1]);
  const primaryFeatures = [...(featuresRowCells[0]?.querySelectorAll('p') || [])]
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  const secondaryFeatures = [...(featuresRowCells[1]?.querySelectorAll('p') || [])]
    .map((p) => ({
      html: p.innerHTML.trim(),
      text: p.textContent.trim(),
    }))
    .filter((feature) => feature.text);
  const benefitStatesByProduct = parseBenefitsByProduct(section);

  const planCells = getMeaningfulCells(rows[2]);
  const plans = planCells
    .filter((cell) => cell.querySelector('h2, h3'))
    .map((cell, index) => {
      const product = products[index] || {};
      const productOption = product.users && product.years ? `${product.users}-${product.years}` : '';
      const title = cell.querySelector('h2, h3');
      const paragraphs = [...cell.querySelectorAll('p')];
      const description = paragraphs[0]?.textContent.trim() || '';
      const billedHtml = paragraphs[1]?.innerHTML.trim() || '';
      const markedChecked = /\[checked\]/i.test(title?.textContent || '');

      return {
        index,
        productId: product.id || '',
        productOption,
        name: normalizePlanName(title?.textContent || ''),
        description,
        billedHtml: replacePricePlaceholders(billedHtml),
        isDefault: markedChecked,
      };
    });

  const ctaCell = getMeaningfulCells(rows[3])[0];
  const ctaFragment = document.createElement('div');
  ctaFragment.innerHTML = ctaCell?.innerHTML || '';

  const ctaLink = ctaFragment.querySelector('a');
  const ctaHref = ctaLink?.getAttribute('href') || '#';
  const ctaText = (ctaLink?.textContent || 'Upgrade').trim();

  ctaLink?.remove();
  ctaFragment.querySelector('br')?.remove();
  const legalHtml = ctaFragment.innerHTML
    .replace(/&lt;privacy-policy-text&gt;|<privacy-policy-text>/gi, '')
    .trim();

  const discountLabel = section?.dataset?.discount || '';
  const offText = section?.dataset?.saveText || '';

  block.innerHTML = `
    <div class="webview-plan-selector-layout">
      ${headingMarkup}
      <div class="webview-plan-selector-main">
        <div class="webview-plan-selector-benefits">
          <ul class="webview-plan-selector-feature-list">
            ${primaryFeatures.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
          <ul class="webview-plan-selector-trust-list">
            ${secondaryFeatures.map((feature) => `<li>${feature.html}</li>`).join('')}
          </ul>
        </div>
        <div class="webview-plan-selector-plans" role="radiogroup" aria-label="Available plans">
          ${plans.map((plan, index) => `
            <div
              class="webview-plan-selector-plan"
              role="radio"
              aria-checked="false"
              tabindex="-1"
              data-plan-index="${index}"
              data-store-context
              data-store-id="${plan.productId}"
              data-store-option="${plan.productOption}"
              data-store-department="consumer"
              data-store-event="product-loaded"
            >
              <span class="webview-plan-selector-radio" aria-hidden="true"></span>
              <div class="webview-plan-selector-plan-content">
                <div class="webview-plan-selector-plan-copy">
                  <h2>${plan.name}</h2>
                  <p>${plan.description}</p>
                  <p class="webview-plan-selector-billed">${plan.billedHtml}</p>
                </div>
                <div class="webview-plan-selector-plan-price">
                  <strong><span class="billed-price await-loader" data-store-price="discounted-monthly||full-monthly"></span></strong>
                  <span>/ month</span>
                  <em><span class="discount-percentage await-loader" data-store-discount="percentage">${discountLabel}</span> ${offText}</em>
                </div>
              </div>
                <a class="button webview-plan-selector-plan-buy-link" href="${ctaHref}" data-store-buy-link aria-hidden="true" tabindex="-1">${ctaText}</a>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="webview-plan-selector-footer">
        <p class="button-container webview-plan-selector-cta">
          <a class="button webview-plan-selector-upgrade" href="${ctaHref}">${ctaText}</a>
        </p>
        <p class="webview-plan-selector-legal">${legalHtml}</p>
      </div>
    </div>
  `;

  const upgradeLink = block.querySelector('.webview-plan-selector-upgrade');
  const devicePlaceholders = registerDevicePlaceholders(block);

  decorateIcons(block);

  if (upgradeLink?.getAttribute('href')?.includes('#upgrade')) {
    const upgradeUrl = new URL(window.location.href);
    upgradeUrl.searchParams.set('feature', 'main_ui');
    upgradeLink.href = upgradeUrl.toString();
  }

  const planButtons = [...block.querySelectorAll('.webview-plan-selector-plan')];
  const planBuyLinks = [...block.querySelectorAll('.webview-plan-selector-plan-buy-link')];
  const featureItems = [...block.querySelectorAll('.webview-plan-selector-feature-list li')];
  const defaultIndex = plans.findIndex((plan) => plan.isDefault);
  let selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;

  function syncUpgradeLinkFromSelectedPlan(planIndex) {
    const selectedBuyLink = planBuyLinks[planIndex];
    if (!selectedBuyLink || !upgradeLink) {
      return;
    }

    const selectedHref = selectedBuyLink.getAttribute('href');
    if (selectedHref) {
      upgradeLink.href = selectedHref;
    }

    ['data-product', 'data-buy-price', 'data-old-price', 'data-currency', 'data-variation'].forEach((attr) => {
      const value = selectedBuyLink.getAttribute(attr);
      if (value) {
        upgradeLink.setAttribute(attr, value);
      } else {
        upgradeLink.removeAttribute(attr);
      }
    });
  }

  function updateFeatureState(planIndex) {
    const states = benefitStatesByProduct[planIndex];

    featureItems.forEach((item, featureIndex) => {
      const state = states?.[featureIndex];
      const isAvailable = typeof state === 'boolean' ? state : true;

      item.classList.toggle('is-not-available', !isAvailable);
      item.classList.toggle('is-available', isAvailable);
      item.classList.remove('is-unavailable');
    });
  }

  function selectPlan(index) {
    selectedIndex = index;

    planButtons.forEach((button, buttonIndex) => {
      const isSelected = buttonIndex === selectedIndex;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-checked', `${isSelected}`);
      button.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    updateFeatureState(selectedIndex);
    updateDevicePlaceholders(devicePlaceholders, products, selectedIndex);
    syncUpgradeLinkFromSelectedPlan(selectedIndex);
  }

  planButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.planIndex || 0);
      selectPlan(index);
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectPlan(Number(button.dataset.planIndex || 0));
        return;
      }

      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
        return;
      }

      event.preventDefault();
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (selectedIndex + direction + planButtons.length) % planButtons.length;
      planButtons[nextIndex].focus();
      selectPlan(nextIndex);
    });
  });

  planBuyLinks.forEach((buyLink, buyLinkIndex) => {
    const observer = new MutationObserver(() => {
      if (buyLinkIndex === selectedIndex) {
        syncUpgradeLinkFromSelectedPlan(selectedIndex);
      }
    });

    observer.observe(buyLink, {
      attributes: true,
      attributeFilter: ['href', 'data-product', 'data-buy-price', 'data-old-price', 'data-currency', 'data-variation'],
    });
  });

  if (planButtons.length) {
    selectPlan(selectedIndex);
  }

  await checkAndReplacePrivacyPolicyLink(block);
}
