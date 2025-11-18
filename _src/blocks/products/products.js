import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  createNanoBlock,
  renderNanoBlocks,
  createTag,
  matchHeights,
  checkIfNotProductPage,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

// all avaiable text variables
const TEXT_VARIABLES_MAPPING = [
  {
    variable: 'percent',
    storeVariable: '{{=it.option.discount.percentage}}',
  },
];

/**
 * Nanoblock representing the plan selectors.
 * If only one plan is declared, the plan selector will not be visible.
 * @param plans The list of plans to display [ labelToDisplay, productCode, variantId, ... ]
 * @param defaultSelection The default selection.
 * @returns Root node of the nanoblock
 */
function renderPlanSelector(plans, defaultSelection) {
  // TODO: Remove unecessary div
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  ul.classList.add('variant-selector');
  root.appendChild(ul);

  if (plans.length === 3) {
    ul.style.display = 'none';
  }

  for (let idx = 0; idx < plans.length - 2; idx += 3) {
    const label = plans[idx];
    const liStoreParameters = {};
    liStoreParameters['data-store-action'] = '';

    if (Number(defaultSelection)) {
      liStoreParameters['data-store-set-devices'] = label;
    } else {
      const productCode = plans[idx + 1];
      const variation = plans[idx + 2];
      const [devices, subscription] = variation.match(/\d+/g)?.map(Number) ?? [];

      liStoreParameters['data-store-set-id'] = productCode;
      liStoreParameters['data-store-set-devices'] = devices;
      liStoreParameters['data-store-set-subscription'] = subscription;
    }

    const li = createTag(
      'li',
      liStoreParameters,
      `<span>${label}</span>`,
    );

    // set the default selection
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
  // TODO: simplify CSS
  const oldPrice = document.createElement('del');
  oldPrice.setAttribute('data-store-render', '');
  if (monthly.toLowerCase() === 'monthly') {
    oldPrice.setAttribute('data-store-price', 'full-monthly');
  } else {
    oldPrice.setAttribute('data-store-price', 'full');
  }

  const root = createTag(
    'div',
    {
      'data-store-hide': '!it.option.price.discounted',
      'data-store-hide-type': 'visibility',
      'data-store-render': '',
      class: 'price await-loader',
    },
    `<span class='old-price'>${text} ${oldPrice.outerHTML}</span>`,
  );

  // insert text to mark monthly price
  if (monthly.toLowerCase() === 'monthly') {
    root.querySelector('.old-price').insertAdjacentHTML('beforeend', '<sup>/mo</sup>');
  }

  return root;
}

/**
 * Nanoblock representing the new product price
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderPrice(text = '', monthly = '', monthTranslation = 'mo') {
  // TODO simplify CSS
  const newPrice = document.createElement('strong');
  newPrice.setAttribute('data-store-render', '');
  if (monthly.toLowerCase() === 'monthly') {
    newPrice.setAttribute('data-store-price', 'discounted-monthly||full-monthly');
  } else {
    newPrice.setAttribute('data-store-price', 'discounted||full');
  }

  const root = createTag(
    'div',
    {
      class: 'price await-loader',
    },
    `<strong class='new-price'>${text} ${newPrice.outerHTML}</strong>`,
  );

  // insert text to mark monthly price
  if (monthly.toLowerCase() === 'monthly') {
    root.querySelector('.new-price').insertAdjacentHTML('beforeend', `<sup>/${monthTranslation}</sup>`);
  }

  return root;
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 * @param text Text to display
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderHighlightSavings(text = 'Save', percent = '') {
  const highlighSaving = document.createElement('span');
  highlighSaving.textContent = `${text} ${
    percent?.toLowerCase() === 'percent' ? '{{=it.option.discount.percentage}}' : '{{=it.option.discount.value}}'
  }`;

  const root = createTag(
    'div',
    {
      'data-store-hide': '!it.option.price.discounted',
      'data-store-hide-type': 'visibility',
      'data-store-render': '',
      class: 'highlight await-loader',
      style: 'display=none',
    },
    `${highlighSaving.outerHTML}`,
  );

  return root;
}

/**
 *
 * @param {string} text Text of the featured nanoblock
 * @return {string} Text with variables replaced
 */
const replaceVariablesInText = (text) => {
  let replacedText = text;

  // replace the percent variable with correct percentage of the produc
  TEXT_VARIABLES_MAPPING.forEach((textVariableMapping) => {
    replacedText = replacedText.replaceAll(
      textVariableMapping.variable,
      textVariableMapping.storeVariable,
    );
  });

  return replacedText;
};

/**
 * Nanoblock representing a text to highlight in the product card
 * @param text Text to display
 * @returns Root node of the nanoblock
 */
function renderHighlight(text) {
  const updatedText = replaceVariablesInText(text);
  return createTag(
    'div',
    {
      class: 'highlight',
      'data-store-hide': '!it.option.price.discounted',
      'data-store-render': '',
    },
    `<span>${updatedText}</span>`,
  );
}

function renderBluePill(icon, text) {
  const root = createTag(
    'div',
    {
      class: 'blue-pill-container',
    },

    `<div class= "blue-pill">
      <span class = "icon icon-${icon?.toLowerCase() || ''}"></span>
      <span class = "blue-pill-text">${text ?? ''}</span>
     </div>`,
  );

  return root;
}

/**
 *
 * @param {string} text
 * @return {boolean} wether the text contains variables or not
 */
const checkIfTextContainsVariables = (text) => TEXT_VARIABLES_MAPPING.some(
  (textVariableMapping) => text.includes(textVariableMapping.variable),
);

/**
 * Nanoblock representing a text to Featured
 * @param text Text of the featured nanoblock
 * @returns Root node of the nanoblock
 */
function renderFeatured(text) {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.textContent = text;

  if (checkIfTextContainsVariables(text)) {
    root.classList.add('await-loader');
    root.textContent = replaceVariablesInText(root.textContent);
  }

  return root;
}

/**
 * Nanoblock representing a text to Featured and the corresponding savings
 * @param text Text of the featured nanoblock
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderFeaturedSavings(text = 'Save', percent = '') {
  const featuredSaving = document.createElement('span');
  featuredSaving.textContent = `${text} ${
    percent.toLowerCase() === 'percent' ? '{{=it.option.discount.percentage}}' : '{{=it.option.discount.value}}'
  }`;

  const root = createTag(
    'div',
    {
      'data-store-hide': '!it.option.price.discounted',
      'data-store-hide-type': 'visibility',
      'data-store-render': '',
      class: 'featured',
    },
    `${featuredSaving.outerHTML}`,
  );
  root.classList.add('await-loader');

  return root;
}

/**
 * Nanoblock representing the lowest product price
 * @returns root node of the nanoblock
 */
function renderLowestPrice(...params) {
  const filteredParams = params.filter((paramValue) => paramValue && (typeof paramValue !== 'object')).slice(-2);
  const text = filteredParams.length > 1 ? filteredParams[1] : filteredParams[0];
  const monthly = filteredParams.length > 1 ? filteredParams[0] : '';
  const root = document.createElement('p');
  const textArea = document.createElement('span');
  root.classList.add('await-loader');
  textArea.textContent = text.replace(
    '0',
    monthly.toLowerCase() === 'monthly'
      ? '{{=it.state.price.discounted.monthly.min || it.state.price.full.monthly.min}}'
      : '{{=it.state.price.discounted.min || it.state.price.full.min}}',
  );
  root.appendChild(textArea);
  return root;
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderPriceCondition(text) {
  const updatedText = text.replace('BilledPrice', '<em data-store-render data-store-price="discounted||full" class="await-loader"></em>');
  return createTag(
    'div',
    {
      class: 'price condition',
    },
    `<em>${updatedText}</em>`,
  );
}

// declare nanoblocks
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
/**
 * Main decorate function
 */
export default function decorate(block) {
  const blockWrapperSection = block.closest('.section');
  const metadata = blockWrapperSection.dataset;
  const plans = [];

  Object.entries(metadata).forEach(([key, value]) => {
    if (key.includes('plans')) {
      const allImportantData = value.match(/[^,{}[\]]+/gu).map((importantData) => importantData.trim());
      plans.push({
        productCode: allImportantData[1],
        defaultVariant: `${Number(allImportantData.slice(-1)[0])
          ? allImportantData.slice(-1)[0] : allImportantData[2].match(/[0-9-]+/g)[0]
        }${allImportantData[2].match(/[0-9-]+/g)[1]}`,
      });
    }
  });

  // add bd-context node below the section
  const wrapperSectionContext = document.createElement('bd-context');
  [...blockWrapperSection.children].forEach((child) => {
    wrapperSectionContext.appendChild(child);
  });
  blockWrapperSection.appendChild(wrapperSectionContext);

  let plansCounter = 0;
  [...block.children].forEach((row, idxParent) => {
    [...(row.children)].forEach((col) => {
      // set the store event on the component
      let storeEvent = 'main-product-loaded';
      if (checkIfNotProductPage()) {
        storeEvent = 'product-loaded';
      }

      col.classList.add('product-card');
      const [devices, subscription] = plans[plansCounter]?.defaultVariant?.split('-') || [];
      const productCode = plans[plansCounter]?.productCode;
      if (productCode && devices && subscription) {
        wrapChildrenWithStoreContext(col, {
          productId: productCode,
          devices,
          subscription,
          ignoreEventsParent: true,
          storeEvent,
        });
      }

      const cardButtons = col.querySelectorAll('a');
      let hasBuyButton = false;
      cardButtons?.forEach((button) => {
        if (button.href?.includes('/buy/') || button.href?.includes('#buylink')) {
          hasBuyButton = true;
          button.href = '#';
          button.setAttribute('data-store-buy-link', '');
          button.setAttribute('data-store-render', '');
        }
      });
      block.appendChild(col);
      renderNanoBlocks(col, undefined, idxParent);

      if (hasBuyButton) {
        plansCounter += 1;
      }
    });
    row.remove();
  });

  // render nanoblocks in section's content default wrapper
  const defaultContent = block.parentNode.parentNode.querySelector('.default-content-wrapper');
  if (defaultContent) {
    renderNanoBlocks(defaultContent);
  }

  // style the product card if the author has added a featured card inside
  [...block.querySelectorAll('.product-card .featured')].forEach((featured) => {
    featured.closest('.product-card').classList.add('featured');
  });

  // add class to avoid using :has selector
  block.querySelectorAll('.product-card li').forEach((li) => {
    if (li.querySelector('del')) {
      li.classList.add('with-del');
    } else {
      li.classList.remove('with-del');
    }
  });

  block.querySelectorAll('.product-card ul').forEach((ul) => {
    if (ul.previousElementSibling?.tagName === 'P') {
      ul.previousElementSibling.classList.add('ul-header-text');
    }
  });

  block.querySelectorAll('.product-card ul li u').forEach((li) => {
    li.parentNode.classList.add('icon-important');
  });

  const paragraphs = block.querySelectorAll('.product-card.featured p');

  // Iterate through each paragraph
  paragraphs.forEach((paragraph) => {
    // Check if the paragraph only contains span elements
    const containsOnlySpans = Array.from(paragraph.childNodes).every((node) => node.nodeName === 'SPAN');

    // If the paragraph only contains span elements, add a class
    if (containsOnlySpans) {
      paragraph.classList.add('os-availability');

      if (paragraph.nextElementSibling.nodeName === 'P') {
        paragraph.nextElementSibling.classList.add('os-availability-text');
      }
    }
  });

  // Height matching and Dynamic texts logic
  const cards = block.querySelectorAll('.product-card');
  const featuredCard = block.querySelector('.product-card.featured');
  cards.forEach((card, cardIndex) => {
    const hasImage = card.querySelector('img') !== null;
    if (hasImage && !block.classList.contains('plans') && !block.classList.contains('compact')) {
      // If the image exists, set max-width to the paragraph next to the image
      const firstPElement = card.querySelector('p:not(:has(img, .icon))');
      firstPElement.classList.add('img-adjacent-text');
    }
    const planSelector = card.querySelector('.variant-selector');
    const dynamicPriceTextsKey = `dynamicPriceTexts${cardIndex + 1}`;
    if (metadata[dynamicPriceTextsKey]) {
      const dynamicPriceTexts = [...metadata[dynamicPriceTextsKey].split(',')];
      const priceConditionEl = card.querySelector('.price.condition em');
      planSelector?.querySelectorAll('li')?.forEach((option, idx) => {
        option.addEventListener('click', () => {
          if (option.classList.contains('active') && priceConditionEl && dynamicPriceTexts) {
            const textTemplate = dynamicPriceTexts[idx] || '';
            // in order to preserve the store eventListeners we can't replace the priceElement
            // every time another option is selected therefore we're using a string template
            if (textTemplate.includes('{BilledPrice}')) {
              const [before, after] = textTemplate.split('{BilledPrice}');
              const nodesToRemove = Array.from(priceConditionEl.childNodes).filter(
                (node) => node.nodeType === Node.TEXT_NODE,
              );
              // Clear only non-<em> text nodes (this element contains store events)
              nodesToRemove.forEach((node) => priceConditionEl.removeChild(node));
              // eslint-disable-next-line max-len
              if (before) priceConditionEl.insertBefore(document.createTextNode(before), priceConditionEl.firstChild);
              if (after) priceConditionEl.appendChild(document.createTextNode(after));
            } else {
              priceConditionEl.textContent = textTemplate;
            }
          }
        });
      });
    }
    if (!card.classList.contains('featured')) {
      // If there is no featured card, do nothing
      if (!featuredCard) {
        return;
      }
      let space = card.querySelector('h3');
      space = space.nextElementSibling;
      const emptyDiv = document.createElement('div');
      space.insertAdjacentElement('afterend', emptyDiv);
      emptyDiv.classList.add('featured', 'nanoblock');
      emptyDiv.style.visibility = 'hidden';
    }
  });

  decorateIcons(block);
  matchHeights(block, '.price.nanoblock:not(:last-of-type)');
  matchHeights(block, '.price.condition');
  matchHeights(block, 'h3:nth-of-type(2)');
  matchHeights(block, 'p:nth-of-type(2)');
  matchHeights(block, 'p:nth-of-type(3)');
  matchHeights(block, 'h4');
  matchHeights(block, 'ul:not(.variant-selector)');
  matchHeights(block, '.featured.nanoblock');
  matchHeights(block, '.blue-pill');
}
