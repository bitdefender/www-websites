import { getLanguageCountryFromPath } from '../../scripts/scripts.js';

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
            '<span class="await-loader" data-store-price="discounted||full"></span>',
        )
        .replace(
            /&lt;full-yearly-price&gt;|<full-yearly-price>/gi,
            '<span class="await-loader" data-store-price="full"></span>',
        )
        .replace(
            /&lt;discounted-monthly-price&gt;|<discounted-monthly-price>/gi,
            '<span class="await-loader" data-store-price="discounted-monthly||full-monthly"></span>',
        )
        .replace(
            /&lt;full-monthly-price&gt;|<full-monthly-price>/gi,
            '<span class="await-loader" data-store-price="full-monthly"></span>',
        );
}

function getMonthlyPriceFallback(text) {
    const cleanText = (text || '').replace(/,/g, '');
    const symbolMatch = cleanText.match(/([\u20AC\u00A3$])\s?(\d+(?:\.\d+)?)/);
    const currencyCodeMatch = cleanText.match(/(USD|EUR|GBP)\s?(\d+(?:\.\d+)?)/i);
    const yearlyPriceMatch = symbolMatch || currencyCodeMatch;

    if (!yearlyPriceMatch) {
        return '--';
    }

    const [, rawCurrency, amount] = yearlyPriceMatch;
    const normalizedCurrency = rawCurrency.toUpperCase();
    let currency = rawCurrency;

    if (normalizedCurrency === 'USD') {
        currency = '$';
    } else if (normalizedCurrency === 'EUR') {
        currency = 'EUR ';
    } else if (normalizedCurrency === 'GBP') {
        currency = 'GBP ';
    }

    const monthly = Number(amount) / 12;

    if (!Number.isFinite(monthly) || monthly <= 0) {
        return `${currency}${amount}`;
    }

    return `${currency}${monthly.toFixed(2)}`;
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

function applyStoreContext(block, product) {
    if (!product?.id) {
        block.removeAttribute('data-store-context');
        block.removeAttribute('data-store-id');
        block.removeAttribute('data-store-option');
        block.removeAttribute('data-store-department');
        block.removeAttribute('data-store-event');
        return;
    }

    block.setAttribute('data-store-context', '');
    block.setAttribute('data-store-id', product.id);
    block.setAttribute('data-store-option', `${product.users}-${product.years}`);
    block.setAttribute('data-store-department', 'consumer');
    block.setAttribute('data-store-event', 'product-loaded');
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

export default async function decorate(block) {
    const rows = [...block.children];
    const section = block.closest('.section');

    const headingCell = getMeaningfulCells(rows[0])[0];
    const heading = headingCell?.querySelector('h1, h2, h3');
    const headingMarkup = heading ? heading.outerHTML : '<h1>Upgrade now</h1>';

    const featuresRowCells = getMeaningfulCells(rows[1]);
    const primaryFeatures = [...(featuresRowCells[0]?.querySelectorAll('p') || [])]
        .map((p) => p.textContent.trim())
        .filter(Boolean);
    const secondaryFeatures = [...(featuresRowCells[1]?.querySelectorAll('p') || [])]
        .map((p) => p.textContent.trim())
        .filter(Boolean);

    const planCells = getMeaningfulCells(rows[2]);
    const plans = planCells
        .filter((cell) => cell.querySelector('h2, h3'))
        .map((cell, index) => {
            const title = cell.querySelector('h2, h3');
            const paragraphs = [...cell.querySelectorAll('p')];
            const description = paragraphs[0]?.textContent.trim() || '';
            const billedHtml = paragraphs[1]?.innerHTML.trim() || '';
            const markedChecked = /\[checked\]/i.test(title?.textContent || '');

            return {
                index,
                name: normalizePlanName(title?.textContent || ''),
                description,
                billedHtml: replacePricePlaceholders(billedHtml),
                monthlyFallback: getMonthlyPriceFallback(paragraphs[1]?.textContent || ''),
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

    const products = parseProductList(section);
    const discountLabel = section?.dataset?.discount || '65%';
    const offText = section?.dataset?.saveText || 'OFF';

    block.innerHTML = `
    <div class="webview-plan-selector-layout">
      ${headingMarkup}
      <div class="webview-plan-selector-main">
        <div class="webview-plan-selector-benefits">
          <ul class="webview-plan-selector-feature-list">
            ${primaryFeatures.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
          <ul class="webview-plan-selector-trust-list">
            ${secondaryFeatures.map((feature) => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="webview-plan-selector-plans" role="radiogroup" aria-label="Available plans">
          ${plans.map((plan, index) => `
            <button type="button" class="webview-plan-selector-plan" role="radio" aria-checked="false" data-plan-index="${index}">
              <span class="webview-plan-selector-radio" aria-hidden="true"></span>
              <div class="webview-plan-selector-plan-content">
                <div class="webview-plan-selector-plan-copy">
                  <h2>${plan.name}</h2>
                  <p>${plan.description}</p>
                  <p class="webview-plan-selector-billed">${plan.billedHtml}</p>
                </div>
                <div class="webview-plan-selector-plan-price">
                  <strong><span class="await-loader" data-store-price="discounted-monthly||full-monthly">${plan.monthlyFallback}</span></strong>
                  <span>/ month</span>
                  <em><span data-store-discount="percentage">${discountLabel}</span> ${offText}</em>
                </div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
      <p class="button-container webview-plan-selector-cta">
        <a class="button webview-plan-selector-upgrade" href="${ctaHref}">${ctaText}</a>
      </p>
      <p class="webview-plan-selector-legal">${legalHtml}</p>
    </div>
  `;

    const upgradeLink = block.querySelector('.webview-plan-selector-upgrade');
    if (upgradeLink?.getAttribute('href')?.includes('#buylink')) {
        upgradeLink.setAttribute('data-store-buy-link', '');
    }

    if (upgradeLink?.getAttribute('href')?.includes('#upgrade')) {
        const upgradeUrl = new URL(window.location.href);
        upgradeUrl.searchParams.set('feature', 'main_ui');
        upgradeLink.href = upgradeUrl.toString();
    }

    const planButtons = [...block.querySelectorAll('.webview-plan-selector-plan')];
    const defaultIndex = plans.findIndex((plan) => plan.isDefault);
    let selectedIndex = defaultIndex >= 0 ? defaultIndex : 0;

    function selectPlan(index) {
        selectedIndex = index;

        planButtons.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === selectedIndex;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-checked', `${isSelected}`);
        });

        applyStoreContext(block, products[selectedIndex]);
    }

    planButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.planIndex || 0);
            selectPlan(index);
        });

        button.addEventListener('keydown', (event) => {
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

    if (planButtons.length) {
        selectPlan(selectedIndex);
    }

    await checkAndReplacePrivacyPolicyLink(block);
}
