import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  createNanoBlock,
  renderNanoBlocks,
  createTag,
  matchHeights,
  checkIfNotProductPage,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

const DISCOUNT_PERCENTAGE = '{{=it.option.discount.percentage}}';
const DISCOUNT_VALUE = '{{=it.option.discount.value}}';
const BILLED_PRICE_PLACEHOLDER = '{BilledPrice}';

// all available text variables
const TEXT_VARIABLES_MAPPING = [
  {
    variable: 'percent',
    storeVariable: DISCOUNT_PERCENTAGE,
  },
];

// elements whose heights are aligned across the product cards
const MATCH_HEIGHTS_SELECTORS = [
  '.price.nanoblock:not(:last-of-type)',
  '.price.condition',
  'h3:nth-of-type(2)',
  'p:nth-of-type(2)',
  'p:nth-of-type(3)',
  'h4',
  'ul:not(.variant-selector)',
  '.featured.nanoblock',
  '.blue-pill',
];

/**
 * @param {*} value nanoblock parameter
 * @returns {boolean} true if the parameter asks for the monthly price
 */
const isMonthly = (value) => typeof value === 'string' && value.toLowerCase() === 'monthly';

/**
 * @param {*} value nanoblock parameter
 * @returns {string} store template of the discount, as a percentage or as a value
 */
const getDiscountTemplate = (value) => (
  typeof value === 'string' && value.toLowerCase() === 'percent' ? DISCOUNT_PERCENTAGE : DISCOUNT_VALUE
);

/**
 * @param {string} text Text of the nanoblock
 * @return {string} Text with variables replaced
 */
const replaceVariablesInText = (text) => TEXT_VARIABLES_MAPPING.reduce(
  (replacedText, { variable, storeVariable }) => replacedText.replaceAll(variable, storeVariable),
  text,
);

/**
 * @param {string} text
 * @return {boolean} whether the text contains variables or not
 */
const checkIfTextContainsVariables = (text) => TEXT_VARIABLES_MAPPING.some(
  ({ variable }) => text.includes(variable),
);

/**
 * Nanoblock representing the plan selectors.
 * If only one plan is declared, the plan selector will not be visible.
 * @param plans The list of plans to display [ labelToDisplay, productCode, variantId, ... ]
 * @param defaultSelection The default selection.
 * @returns Root node of the nanoblock
 */
function renderPlanSelector(plans, defaultSelection) {
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  ul.classList.add('variant-selector');
  root.appendChild(ul);

  if (plans.length === 3) {
    ul.style.display = 'none';
  }

  for (let idx = 0; idx < plans.length - 2; idx += 3) {
    const label = plans[idx];
    const liStoreParameters = { 'data-store-action': '' };

    if (Number(defaultSelection)) {
      // only the number of devices changes
      liStoreParameters['data-store-set-devices'] = label;
    } else {
      // the product changes together with its variant
      const productCode = plans[idx + 1];
      const variation = plans[idx + 2];
      const [devices, subscription] = variation.match(/\d+/g)?.map(Number) ?? [];

      liStoreParameters['data-store-set-id'] = productCode;
      liStoreParameters['data-store-set-devices'] = devices;
      liStoreParameters['data-store-set-subscription'] = subscription;
    }

    const li = createTag('li', liStoreParameters, `<span>${label}</span>`);

    if (defaultSelection === label) {
      li.classList.add('active');
      li.checked = true;
    }

    li.addEventListener('click', () => {
      const previousButtonActive = root.querySelector('.active');
      if (previousButtonActive) {
        previousButtonActive.classList.remove('active');
        previousButtonActive.checked = false;
      }
      li.classList.add('active');
      li.checked = true;
    });

    ul.appendChild(li);
  }

  return root;
}

/**
 * Nanoblock representing the old product price
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderOldPrice(text = '', monthly = '') {
  const priceType = isMonthly(monthly) ? 'full-monthly' : 'full';
  const monthlySuffix = isMonthly(monthly) ? '<sup>/mo</sup>' : '';

  return createTag(
    'div',
    {
      'data-store-hide': '!it.option.price.discounted',
      'data-store-hide-type': 'visibility',
      'data-store-render': '',
      class: 'price await-loader',
    },
    `<span class='old-price'>${text} <del data-store-render data-store-price="${priceType}"></del>${monthlySuffix}</span>`,
  );
}

/**
 * Nanoblock representing the new product price
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @param monthTranslation The translation of the month abbreviation
 * @returns Root node of the nanoblock
 */
function renderPrice(text = '', monthly = '', monthTranslation = 'mo') {
  const priceType = isMonthly(monthly) ? 'discounted-monthly||full-monthly' : 'discounted||full';
  const monthlySuffix = isMonthly(monthly) ? `<sup>/${monthTranslation}</sup>` : '';

  return createTag(
    'div',
    { class: 'price await-loader' },
    `<strong class='new-price'>${text} <strong data-store-render data-store-price="${priceType}"></strong>${monthlySuffix}</strong>`,
  );
}

/**
 * Renders the potential savings, visible only when the product is discounted
 * @param className Class of the nanoblock
 * @param text Text to display
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderSavings(className, text = 'Save', percent = '') {
  const savings = document.createElement('span');
  savings.textContent = `${text} ${getDiscountTemplate(percent)}`;

  return createTag(
    'div',
    {
      'data-store-hide': '!it.option.price.discounted',
      'data-store-hide-type': 'visibility',
      'data-store-render': '',
      class: `${className} await-loader`,
    },
    savings,
  );
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 */
const renderHighlightSavings = (...params) => renderSavings('highlight', ...params);

/**
 * Nanoblock representing a text to Featured and the corresponding savings
 */
const renderFeaturedSavings = (...params) => renderSavings('featured', ...params);

/**
 * Nanoblock representing a text to highlight in the product card
 * @param text Text to display
 * @returns Root node of the nanoblock
 */
function renderHighlight(text) {
  return createTag(
    'div',
    {
      class: 'highlight',
      'data-store-hide': '!it.option.price.discounted',
      'data-store-render': '',
    },
    `<span>${replaceVariablesInText(text)}</span>`,
  );
}

function renderBluePill(icon, text) {
  return createTag(
    'div',
    { class: 'blue-pill-container' },
    `<div class= "blue-pill">
      <span class = "icon icon-${icon?.toLowerCase() || ''}"></span>
      <span class = "blue-pill-text">${text ?? ''}</span>
     </div>`,
  );
}

/**
 * Nanoblock representing a text to Featured
 * @param text Text of the featured nanoblock
 * @returns Root node of the nanoblock
 */
function renderFeatured(text) {
  const root = createTag('div', { class: 'featured' });
  root.textContent = text;

  if (checkIfTextContainsVariables(text)) {
    root.classList.add('await-loader');
    root.textContent = replaceVariablesInText(text);
  }

  return root;
}

/**
 * Nanoblock representing the lowest product price
 * The last two text parameters are used: [monthly], text. In the text, `0` is replaced
 * by the lowest price.
 * @returns root node of the nanoblock
 */
function renderLowestPrice(...params) {
  const textParams = params.filter((param) => param && typeof param !== 'object').slice(-2);
  const text = textParams.at(-1);
  const monthly = textParams.length > 1 ? textParams[0] : '';

  const textArea = document.createElement('span');
  textArea.textContent = text.replace(
    '0',
    isMonthly(monthly)
      ? '{{=it.state.price.discounted.monthly.min || it.state.price.full.monthly.min}}'
      : '{{=it.state.price.discounted.min || it.state.price.full.min}}',
  );

  return createTag('p', { class: 'await-loader' }, textArea);
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderPriceCondition(text) {
  const updatedText = text.replace('BilledPrice', '<em data-store-render data-store-price="discounted||full" class="await-loader"></em>');
  return createTag('div', { class: 'price condition' }, `<em>${updatedText}</em>`);
}

/**
 * Registers the nanoblocks of this block.
 * Nanoblocks share one registry and other blocks register some of the same names
 * (e.g. products-sideview registers `price`), so they are registered again before
 * every render to make sure this block uses its own renderers.
 */
function registerNanoBlocks() {
  createNanoBlock('plans', renderPlanSelector);
  createNanoBlock('price', renderPrice);
  createNanoBlock('oldPrice', renderOldPrice);
  createNanoBlock('priceCondition', renderPriceCondition);
  createNanoBlock('featured', renderFeatured);
  createNanoBlock('featuredSavings', renderFeaturedSavings);
  createNanoBlock('highlightSavings', renderHighlightSavings);
  createNanoBlock('highlight', renderHighlight);
  createNanoBlock('lowestPrice', renderLowestPrice);
  createNanoBlock('bluePill', renderBluePill);
}

// other blocks (e.g. columns) render these nanoblocks too, keep them available on import
registerNanoBlocks();

/**
 * Reads the default plan of every card from the `PlansN` section metadata.
 * The metadata looks like `{[label, productCode, 5u-1y, ...], defaultSelection}`. When the
 * default selection is a number it overrides the number of devices of the first variant.
 * @param {DOMStringMap|object} metadata section metadata
 * @returns {Array<{productCode: string, devices: string, subscription: string}>} plans by card
 */
export function parsePlans(metadata) {
  const plans = [];

  Object.entries(metadata).forEach(([key, value]) => {
    if (!key.includes('plans')) return;

    const values = value.match(/[^,{}[\]]+/gu)?.map((data) => data.trim());
    const [variantDevices, variantSubscription] = values?.[2]?.match(/[0-9-]+/g) ?? [];
    if (!variantDevices) return;

    const defaultSelection = values.at(-1);
    const suffix = parseInt(key.replace('plans', ''), 10);
    const index = Number.isNaN(suffix) ? plans.length : suffix - 1;

    plans[index] = {
      productCode: values[1],
      devices: Number(defaultSelection) ? defaultSelection : variantDevices,
      subscription: variantSubscription?.replace(/^-/, ''),
    };
  });

  return plans;
}

/**
 * Replaces the text of the price condition, keeping the store price element in place.
 * The store price element holds store listeners, so it can't be re-created.
 * @param {HTMLElement} priceConditionEl the price condition element
 * @param {string} template text to display, `{BilledPrice}` marks the store price
 */
export function updatePriceConditionText(priceConditionEl, template) {
  if (!template.includes(BILLED_PRICE_PLACEHOLDER)) {
    priceConditionEl.textContent = template;
    return;
  }

  const [before, after] = template.split(BILLED_PRICE_PLACEHOLDER);
  [...priceConditionEl.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .forEach((node) => node.remove());
  if (before) priceConditionEl.prepend(before);
  if (after) priceConditionEl.append(after);
}

/**
 * Moves the section content inside a store context, keeping the section wrappers addressable.
 * @param {HTMLElement} section
 */
function wrapSectionInStoreContext(section) {
  const sectionContext = document.createElement('bd-context');
  sectionContext.classList.add('store-context', 'store-section-context');
  [...section.children].forEach((child) => {
    child.classList.add('store-section-content');
    sectionContext.appendChild(child);
  });
  section.appendChild(sectionContext);
}

/**
 * Turns the buy links of the card into store buy links.
 * @param {HTMLElement} card
 * @param {string} trialDuration
 */
function decorateBuyLinks(card, trialDuration) {
  card.querySelectorAll('a').forEach((button) => {
    if (button.href?.includes('/buy/') || button.href?.includes('#buylink')) {
      button.href = '#';
      button.setAttribute('data-store-buy-link', trialDuration);
      button.setAttribute('data-store-render', '');
    }
  });
}

/**
 * The plan selector switches the product id (data-store-set-id). The nearest
 * bd-* ancestor catches the bd-action-request, and bd-option only applies
 * devices/subscription — it ignores the product id. So the selector must sit
 * above bd-option (as a direct child of bd-product) for the product switch to
 * cascade down. Hoist it out of bd-option, mirroring products-sideview.
 * Preserve its authored visual position via flex `order` (the store wrappers
 * are flattened with `display: contents` in CSS, so all card content shares
 * one flex context).
 * @param {HTMLElement} card
 */
function hoistPlanSelector(card) {
  const storeProduct = card.querySelector('.store-product');
  const storeOption = storeProduct?.querySelector('.store-option');
  const planSelector = storeOption?.querySelector('.variant-selector');
  if (!storeProduct || !storeOption || !planSelector) return;

  const planSelectorContainer = planSelector.closest('.nanoblock') || planSelector;
  const activePlan = planSelector.querySelector('li.active');
  if (activePlan) {
    const { storeSetId, storeSetDevices, storeSetSubscription } = activePlan.dataset;
    if (storeSetId) {
      storeProduct.setAttribute('product-id', storeSetId);
    }
    if (storeSetDevices) {
      storeOption.setAttribute('devices', storeSetDevices);
    }
    if (storeSetSubscription) {
      storeOption.setAttribute('subscription', storeSetSubscription);
    }
  }

  // remember the authored position among the option's content children
  const contentRoot = planSelectorContainer.parentElement;
  const authoredIndex = [...contentRoot.children].indexOf(planSelectorContainer);
  planSelectorContainer.classList.add('plan-selector-hoisted');
  storeProduct.insertBefore(planSelectorContainer, storeOption);
  // shift every option child at/after the authored position down by one,
  // and place the selector at its original index
  storeOption.querySelectorAll(':scope > .store-option-content > *').forEach((child, i) => {
    child.style.order = i >= authoredIndex ? i + 2 : i + 1;
  });
  planSelectorContainer.style.order = authoredIndex + 1;
}

/**
 * Adds the classes used to style the card lists, to avoid using :has selectors.
 * @param {HTMLElement} block
 */
function decorateLists(block) {
  block.querySelectorAll('.product-card li').forEach((li) => {
    if (li.querySelector('del')) {
      li.classList.add('with-del');
    }
  });

  block.querySelectorAll('.product-card ul').forEach((ul) => {
    if (ul.previousElementSibling?.tagName === 'P') {
      ul.previousElementSibling.classList.add('ul-header-text');
    }
  });

  block.querySelectorAll('.product-card ul li u').forEach((underline) => {
    underline.parentNode.classList.add('icon-important');
  });
}

/**
 * Marks the icon only paragraphs of the featured cards (OS icons) and their caption.
 * @param {HTMLElement} block
 */
function decorateOsAvailability(block) {
  block.querySelectorAll('.product-card.featured p').forEach((paragraph) => {
    const containsOnlySpans = [...paragraph.childNodes].every((node) => node.nodeName === 'SPAN');
    if (!containsOnlySpans) return;

    paragraph.classList.add('os-availability');
    if (paragraph.nextElementSibling?.nodeName === 'P') {
      paragraph.nextElementSibling.classList.add('os-availability-text');
    }
  });
}

/**
 * Updates the price condition of the card with the `DynamicPriceTextsN` text of the
 * selected plan.
 * @param {HTMLElement} card
 * @param {string} dynamicPriceTexts comma separated texts, one per plan
 */
function setupDynamicPriceTexts(card, dynamicPriceTexts) {
  const priceConditionEl = card.querySelector('.price.condition em');
  if (!priceConditionEl) return;

  const texts = dynamicPriceTexts.split(',');
  card.querySelectorAll('.variant-selector li').forEach((option, idx) => {
    option.addEventListener('click', () => {
      if (option.classList.contains('active')) {
        updatePriceConditionText(priceConditionEl, texts[idx] || '');
      }
    });
  });
}

/**
 * Adds an invisible featured element after the first element following the heading,
 * so the content of the card lines up with the featured card.
 * @param {HTMLElement} card
 */
function addFeaturedPlaceholder(card) {
  const space = card.querySelector('h3')?.nextElementSibling;
  if (!space) return;

  const placeholder = document.createElement('div');
  space.insertAdjacentElement('afterend', placeholder);
  placeholder.classList.add('featured', 'nanoblock');
  placeholder.style.visibility = 'hidden';
  // The store wrapper assigns inline orders to authored content. This
  // placeholder is added afterwards, so preserve its position after h3.
  if (space.style.order) {
    placeholder.style.order = `${Number(space.style.order) + 1}`;
  }
}

/**
 * Main decorate function
 */
export default function decorate(block) {
  registerNanoBlocks();

  const section = block.closest('.section');
  const metadata = section.dataset;
  const trialDurations = metadata.trialDuration?.split(',').map((t) => t.trim()) || [];
  const plans = parsePlans(metadata);
  const storeEvent = checkIfNotProductPage() ? 'all' : 'info';

  wrapSectionInStoreContext(section);

  [...block.children].forEach((card, idx) => {
    card.classList.add('product-card');

    const { productCode, devices, subscription } = plans[idx] || {};
    if (productCode && devices && subscription) {
      wrapChildrenWithStoreContext(card, {
        productId: productCode,
        devices,
        subscription,
        storeEvent,
      });
    }
    card.querySelector('.store-option > div')?.classList.add('store-option-content');

    decorateBuyLinks(card, trialDurations[idx] || '');
    renderNanoBlocks(card, undefined, idx);
    hoistPlanSelector(card);
  });

  // render nanoblocks in section's content default wrapper
  const defaultContent = block.parentNode.parentNode.querySelector('.default-content-wrapper');
  if (defaultContent) {
    renderNanoBlocks(defaultContent);
  }

  // style the product card if the author has added a featured card inside
  block.querySelectorAll('.product-card .featured').forEach((featured) => {
    featured.closest('.product-card').classList.add('featured');
  });

  decorateLists(block);
  decorateOsAvailability(block);

  const hasFeaturedCard = !!block.querySelector('.product-card.featured');
  const hasImageAdjacentText = !block.classList.contains('plans') && !block.classList.contains('compact');
  block.querySelectorAll('.product-card').forEach((card, idx) => {
    if (hasImageAdjacentText && card.querySelector('img')) {
      card.querySelector('p:not(:has(img, .icon))')?.classList.add('img-adjacent-text');
    }

    const dynamicPriceTexts = metadata[`dynamicPriceTexts${idx + 1}`];
    if (dynamicPriceTexts) {
      setupDynamicPriceTexts(card, dynamicPriceTexts);
    }

    if (hasFeaturedCard && !card.classList.contains('featured')) {
      addFeaturedPlaceholder(card);
    }
  });

  decorateIcons(block);
  MATCH_HEIGHTS_SELECTORS.forEach((selector) => matchHeights(block, selector));
}
