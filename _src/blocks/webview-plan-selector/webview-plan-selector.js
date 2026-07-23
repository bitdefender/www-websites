import { getLanguageCountryFromPath } from '../../scripts/scripts.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

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

function parseProductList(sectionEl, datasetKey = 'products') {
  const products = sectionEl?.dataset?.[datasetKey];
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

async function checkAndReplacePrivacyPolicyLink(block, skipLocalValidation = false) {
  const privacyPolicyLink = block.querySelector('.webview-plan-selector-legal a:last-of-type');
  if (!privacyPolicyLink) {
    return;
  }

  privacyPolicyLink.href = privacyPolicyLink.href.replace('locale', getLanguage().toLowerCase());
  privacyPolicyLink.setAttribute('target', '_blank');

  if (skipLocalValidation && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return;
  }

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

async function runDefaultWebviewPlanSelectorLogic(block) {
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

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.classList.add('dark-mode');
  }

  await checkAndReplacePrivacyPolicyLink(block);
}

const STORE_LINK_ATTRIBUTES = [
  'data-product',
  'data-buy-price',
  'data-old-price',
  'data-currency',
  'data-variation',
];

let v2InstanceCount = 0;

function isCompleteProductList(products, planCount) {
  return products.length === planCount
    && products.every(({ id, users, years }) => id && users && years);
}

function decorateAuthoredPills(element) {
  element.querySelectorAll('li').forEach((item) => {
    item.innerHTML = item.innerHTML.replace(
      /\[blue-pill\s+([\s\S]*?)\s+blue-pill\]/gi,
      '<span class="webview-plan-selector-v2-pill">$1</span>',
    );
  });
}

function createV2StoreContext({
  section,
  product,
  planIndex,
  toggleIndex,
  pricePeriod,
  ctaHref,
  ctaText,
}) {
  const context = document.createElement('div');
  context.className = 'webview-plan-selector-v2-store-context';
  context.dataset.planIndex = planIndex;
  context.dataset.toggleIndex = toggleIndex;
  context.setAttribute('data-store-context', '');
  context.setAttribute('data-store-id', product?.id || '');
  context.setAttribute(
    'data-store-option',
    product?.users && product?.years ? `${product.users}-${product.years}` : '',
  );
  context.setAttribute('data-store-department', 'consumer');
  context.setAttribute('data-store-event', 'product-loaded');
  context.hidden = toggleIndex !== 0;

  const originalPrice = document.createElement('span');
  originalPrice.className = 'webview-plan-selector-v2-price-original await-loader';
  originalPrice.setAttribute('data-store-price', 'full');
  originalPrice.setAttribute('data-store-hide', 'no-price=discounted');

  const promotionalPrice = document.createElement('strong');
  promotionalPrice.className = 'webview-plan-selector-v2-price-promotional await-loader';
  promotionalPrice.setAttribute('data-store-price', 'discounted||full');

  const period = document.createElement('span');
  period.className = 'webview-plan-selector-v2-price-period';
  period.textContent = pricePeriod;

  const discountLabelText = document.createElement('span');
  discountLabelText.className = 'webview-plan-selector-v2-price-discount await-loader';
  discountLabelText.textContent = section?.dataset?.discountLabelText || '';
  const discount = document.createElement('span');
  discount.setAttribute('data-store-discount', 'percentage');
  discount.setAttribute('data-store-hide', 'no-price=discounted');
  discountLabelText.append(discount);

  const buyLink = document.createElement('a');
  buyLink.className = 'webview-plan-selector-v2-store-buy-link';
  buyLink.href = ctaHref;
  buyLink.textContent = ctaText;
  buyLink.setAttribute('data-store-buy-link', '');
  buyLink.setAttribute('aria-hidden', 'true');
  buyLink.setAttribute('tabindex', '-1');

  context.append(originalPrice, promotionalPrice, period, discountLabelText, buyLink);
  return context;
}

function getWebviewUpgradeHref(href) {
  if (!href?.includes('#upgrade')) {
    return href;
  }

  const upgradeUrl = new URL(window.location.href);
  upgradeUrl.searchParams.set('feature', 'main_ui');
  return upgradeUrl.toString();
}

async function runV2WebviewPlanSelectorLogic(block) {
  const rows = [...block.children];
  const section = block.closest('.section');
  const heading = getMeaningfulCells(rows[0])[0]?.querySelector('h1, h2, h3');
  const contentRows = rows.slice(1, 3);
  const featureCells = contentRows.map((row) => getMeaningfulCells(row)[0]).filter(Boolean);
  const planCells = contentRows.map((row) => getMeaningfulCells(row)[1]).filter(Boolean);
  const products = parseProductList(section);
  const secondToggleProducts = parseProductList(section, 'secondToggleProducts');
  const firstToggleLabel = section?.dataset?.firstToggleLabel || '';
  const secondToggleLabel = section?.dataset?.secondToggleLabel || '';
  const pricePeriod = section?.dataset?.pricePeriod || '';

  const plans = planCells.map((cell, index) => {
    const title = cell.querySelector('h2, h3');
    const badge = cell.querySelector('h4');
    const description = cell.querySelector('p');

    return {
      index,
      title: normalizePlanName(title?.textContent || ''),
      badge: badge?.cloneNode(true),
      description: description?.cloneNode(true),
      isDefault: /\[checked\]/i.test(title?.textContent || ''),
    };
  });

  const actionCell = getMeaningfulCells(rows[3])[0];
  const authoredCta = actionCell?.querySelector('a');
  const ctaHref = authoredCta?.getAttribute('href') || '';
  const ctaText = authoredCta?.textContent.trim() || '';
  const trustItems = [...(actionCell?.querySelectorAll('p') || [])]
    .filter((paragraph) => !paragraph.querySelector('a'))
    .map((paragraph) => paragraph.cloneNode(true));

  const legalCell = getMeaningfulCells(rows[4])[0];
  const legal = document.createElement('p');
  legal.className = 'webview-plan-selector-legal';
  legal.innerHTML = (legalCell?.innerHTML || '')
    .replace(/&lt;privacy-policy-text&gt;|<privacy-policy-text>/gi, '')
    .trim();

  const layout = document.createElement('div');
  layout.className = 'webview-plan-selector-v2-layout';
  if (heading) {
    const title = heading.cloneNode(true);
    title.classList.add('webview-plan-selector-v2-title');
    layout.append(title);
  }

  const main = document.createElement('div');
  main.className = 'webview-plan-selector-v2-main';
  const features = document.createElement('div');
  features.className = 'webview-plan-selector-v2-features';

  featureCells.forEach((cell, index) => {
    const group = document.createElement('section');
    group.className = 'webview-plan-selector-v2-feature-group';
    if (index === 1) {
      group.classList.add('is-highlighted');
    }

    const groupTitle = cell.querySelector('p');
    const list = cell.querySelector('ul, ol');
    if (groupTitle) {
      const title = groupTitle.cloneNode(true);
      title.classList.add('webview-plan-selector-v2-feature-title');
      group.append(title);
    }
    if (list) {
      const featureList = list.cloneNode(true);
      featureList.classList.add('webview-plan-selector-v2-feature-list');
      decorateAuthoredPills(featureList);
      group.append(featureList);
    }
    features.append(group);
  });

  const selector = document.createElement('div');
  selector.className = 'webview-plan-selector-v2-selector';
  const hasSecondToggle = Boolean(
    firstToggleLabel
    && secondToggleLabel
    && isCompleteProductList(secondToggleProducts, plans.length),
  );
  const toggleLabels = hasSecondToggle
    ? [firstToggleLabel, secondToggleLabel]
    : [firstToggleLabel].filter(Boolean);
  const productLists = hasSecondToggle ? [products, secondToggleProducts] : [products];
  const instanceId = v2InstanceCount;
  v2InstanceCount += 1;

  let activeToggleIndex = 0;
  if (toggleLabels.length > 1) {
    const toggleFieldset = document.createElement('fieldset');
    toggleFieldset.className = 'webview-plan-selector-v2-toggle-fieldset';
    const toggleLegend = document.createElement('legend');
    toggleLegend.className = 'webview-plan-selector-v2-visually-hidden';
    toggleLegend.textContent = toggleLabels.join(' ');
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'webview-plan-selector-v2-toggle-group';

    toggleLabels.forEach((labelText, toggleIndex) => {
      const label = document.createElement('label');
      label.className = 'webview-plan-selector-v2-toggle-option';
      const input = document.createElement('input');
      input.className = 'webview-plan-selector-v2-toggle-input';
      input.type = 'radio';
      input.name = `webview-plan-selector-toggle-${instanceId}`;
      input.value = `${toggleIndex}`;
      input.checked = toggleIndex === 0;
      const labelContent = document.createElement('span');
      labelContent.textContent = labelText;
      label.append(input, labelContent);
      toggleGroup.append(label);
    });

    toggleFieldset.append(toggleLegend, toggleGroup);
    selector.append(toggleFieldset);
  }

  const plansFieldset = document.createElement('fieldset');
  plansFieldset.className = 'webview-plan-selector-v2-plans';
  const plansLegend = document.createElement('legend');
  plansLegend.className = 'webview-plan-selector-v2-visually-hidden';
  plansLegend.textContent = heading?.textContent.trim() || '';
  plansFieldset.append(plansLegend);

  const defaultPlanIndex = plans.findIndex((plan) => plan.isDefault);
  let selectedPlanIndex = defaultPlanIndex >= 0 ? defaultPlanIndex : 0;
  const contexts = [];

  plans.forEach((plan) => {
    const option = document.createElement('div');
    option.className = 'webview-plan-selector-v2-plan-option';
    option.dataset.planIndex = plan.index;

    const input = document.createElement('input');
    input.className = 'webview-plan-selector-v2-plan-input';
    input.type = 'radio';
    input.name = `webview-plan-selector-plan-${instanceId}`;
    input.id = `webview-plan-selector-plan-${instanceId}-${plan.index}`;
    input.value = `${plan.index}`;
    input.checked = plan.index === selectedPlanIndex;

    const label = document.createElement('label');
    label.className = 'webview-plan-selector-v2-plan-label';
    label.htmlFor = input.id;
    const radio = document.createElement('span');
    radio.className = 'webview-plan-selector-v2-radio';
    radio.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    copy.className = 'webview-plan-selector-v2-plan-copy';
    if (plan.badge) {
      plan.badge.classList.add('webview-plan-selector-v2-plan-badge');
      copy.append(plan.badge);
    }
    const planTitle = document.createElement('strong');
    planTitle.className = 'webview-plan-selector-v2-plan-name';
    planTitle.textContent = plan.title;
    copy.append(planTitle);
    if (plan.description) {
      plan.description.classList.add('webview-plan-selector-v2-plan-description');
      copy.append(plan.description);
    }
    label.append(radio, copy);

    const priceStack = document.createElement('div');
    priceStack.className = 'webview-plan-selector-v2-price-stack';
    productLists.forEach((productList, toggleIndex) => {
      const context = createV2StoreContext({
        section,
        product: productList[plan.index],
        planIndex: plan.index,
        toggleIndex,
        pricePeriod,
        ctaHref,
        ctaText,
      });
      contexts.push(context);
      priceStack.append(context);
    });

    option.append(input, label, priceStack);
    plansFieldset.append(option);
  });

  selector.append(plansFieldset);
  main.append(features, selector);
  layout.append(main);

  const footer = document.createElement('div');
  footer.className = 'webview-plan-selector-v2-footer';
  const actionRow = document.createElement('div');
  actionRow.className = 'webview-plan-selector-v2-action-row';
  const trust = document.createElement('div');
  trust.className = 'webview-plan-selector-v2-trust';
  trustItems.forEach((item) => {
    item.classList.add('webview-plan-selector-v2-trust-item');
    trust.append(item);
  });
  const cta = document.createElement('a');
  cta.className = 'button webview-plan-selector-upgrade webview-plan-selector-v2-cta';
  cta.href = getWebviewUpgradeHref(ctaHref);
  cta.textContent = ctaText;
  actionRow.append(trust, cta);
  footer.append(actionRow, legal);
  layout.append(footer);

  block.classList.add('v2');
  block.replaceChildren(layout);
  decorateIcons(block);

  function getActiveContext() {
    return contexts.find((context) => (
      Number(context.dataset.planIndex) === selectedPlanIndex
      && Number(context.dataset.toggleIndex) === activeToggleIndex
    ));
  }

  function syncFooterCta() {
    const buyLink = getActiveContext()?.querySelector('[data-store-buy-link]');
    if (!buyLink) {
      return;
    }

    cta.textContent = buyLink.textContent;
    cta.href = getWebviewUpgradeHref(buyLink.getAttribute('href'));
    STORE_LINK_ATTRIBUTES.forEach((attribute) => {
      const value = buyLink.getAttribute(attribute);
      if (value) {
        cta.setAttribute(attribute, value);
      } else {
        cta.removeAttribute(attribute);
      }
    });
  }

  function selectPlan(planIndex) {
    selectedPlanIndex = planIndex;
    plansFieldset.querySelectorAll('.webview-plan-selector-v2-plan-option').forEach((option) => {
      option.classList.toggle(
        'is-selected',
        Number(option.dataset.planIndex) === selectedPlanIndex,
      );
    });
    syncFooterCta();
  }

  function selectToggle(toggleIndex) {
    activeToggleIndex = toggleIndex;
    contexts.forEach((context) => {
      context.hidden = Number(context.dataset.toggleIndex) !== activeToggleIndex;
    });
    syncFooterCta();
  }

  plansFieldset.querySelectorAll('.webview-plan-selector-v2-plan-input').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) {
        selectPlan(Number(input.value));
      }
    });
  });

  selector.querySelectorAll('.webview-plan-selector-v2-toggle-input').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) {
        selectToggle(Number(input.value));
      }
    });
  });

  contexts.forEach((context) => {
    const buyLink = context.querySelector('[data-store-buy-link]');
    const observer = new MutationObserver(() => {
      if (context === getActiveContext()) {
        syncFooterCta();
      }
    });
    observer.observe(buyLink, {
      attributes: true,
      attributeFilter: ['href', ...STORE_LINK_ATTRIBUTES],
      childList: true,
      characterData: true,
      subtree: true,
    });
  });

  selectPlan(selectedPlanIndex);
  selectToggle(activeToggleIndex);
  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'dark') {
    block.classList.add('dark-mode');
  }
  await checkAndReplacePrivacyPolicyLink(block, true);
}

/**
 * Applies the webview plan selector factory based on its page metadata variation.
 * @param {string} planSelectorMetadata The webview plan selector variation.
 * @param {Element} block The webview plan selector block element.
 */
async function applyWebviewPlanSelectorFactorySetup(planSelectorMetadata, block) {
  switch (planSelectorMetadata) {
    case 'v2':
      await runV2WebviewPlanSelectorLogic(block);
      break;
    default:
      await runDefaultWebviewPlanSelectorLogic(block);
      break;
  }
}

/**
 * Loads and decorates the webview plan selector.
 * @param {Element} block The webview plan selector block element.
 */
export default async function decorate(block) {
  const planSelectorMetadata = getMetadata('webview-plan-selector-type');
  block.parentNode.classList.add(planSelectorMetadata || 'default');

  await applyWebviewPlanSelectorFactorySetup(planSelectorMetadata, block);
}
