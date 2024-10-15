import {
  createNanoBlock,
  renderNanoBlocks,
  createTag,
  matchHeights,
} from '../../scripts/utils/utils.js';

// all avaiable text variables
const TEXT_VARIABLES_MAPPING = [
  {
    variable: 'percent',
    storeVariable: '{DISCOUNT_PERCENTAGE}',
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
    const variant = plans[idx + 2];
    const devices = variant?.split('-')[0]?.split('u')[0];

    const li = createTag(
      'li',
      {
        'data-store-click-set-devices': devices,
      },
      `<span>${label}</span>`,
    );

    // set the
    if (defaultSelection === devices) {
      li.classList.add('active');
    }

    li.addEventListener('click', () => {
      root.querySelectorAll('.active').forEach((option) => option.classList.remove('active'));
      li.classList.add('active');
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
  if (monthly.toLowerCase() === 'monthly') {
    oldPrice.setAttribute('data-store-price', 'full-monthly');
  } else {
    oldPrice.setAttribute('data-store-price', 'full');
  }

  const root = createTag(
    'div',
    {
      'data-store-hide': 'no-price=discounted;type=visibility',
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
  highlighSaving.setAttribute('data-store-text-variable', '');
  highlighSaving.textContent = `${text} ${
    percent.toLowerCase() === 'percent' ? '{DISCOUNT_PERCENTAGE}' : '{DISCOUNT_VALUE}'
  }`;

  const root = createTag(
    'div',
    {
      'data-store-hide': 'no-price=discounted;type=visibility',
      class: 'highlight',
      style: 'display=none',
    },
    `${highlighSaving.outerHTML}`,
  );

  return root;
}

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
      style: 'visibility:hidden',
    },
    `<span>${text}</span>`,
  );
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
  featuredSaving.setAttribute('data-store-text-variable', '');
  featuredSaving.textContent = `${text} ${
    percent.toLowerCase() === 'percent' ? '{DISCOUNT_PERCENTAGE}' : '{DISCOUNT_VALUE}'
  }`;

  const root = createTag(
    'div',
    {
      'data-store-hide': 'no-price=discounted;type=visibility',
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
function renderLowestPrice(monthly = '', text = '') {
  const root = document.createElement('p');
  root.setAttribute('data-store-text-variable', '');
  root.textContent = text.replace('0', monthly.toLowerCase() === 'monthly' ? '{SMALLEST_PRICE_PER_MONTH}' : '{SMALLEST_PRICE}');

  return root;
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderPriceCondition(text) {
  return createTag(
    'div',
    {
      class: 'price test-123',
    },
    `<em>${text}</em>`,
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

/**
 * Main decorate function
 */
export default function decorate(block) {
  const metadata = block.closest('.section').dataset;
  const plans = [];

  Object.entries(metadata).forEach(([key, value]) => {
    if (key.includes('plans')) {
      const allImportantData = value.match(/[a-zA-Z0-9-]+/g);
      plans.push({
        productCode: allImportantData[1],
        variant: allImportantData[2].match(/[0-9-]+/g).join(''),
        defaultVariant: `${allImportantData[3]}${allImportantData[2].match(/[0-9-]+/g)[1]}`,
      });
    }
  });

  block.setAttribute('data-store-context', '');
  [...block.children].forEach((row, idxParent) => {
    [...(row.children)].forEach((col, idxCol) => {
      const plansIndex = idxParent * row.children.length + idxCol;
      col.classList.add('product-card');
      col.setAttribute('data-store-context', '');
      col.setAttribute('data-store-id', plans[plansIndex].productCode);
      col.setAttribute('data-store-option', plans[plansIndex].defaultVariant);
      col.setAttribute('data-store-department', 'consumer');
      col.setAttribute('data-store-event', 'main-product-loaded');
      col.querySelector('.button-container a').setAttribute('data-store-buy-link', '');

      block.appendChild(col);
      renderNanoBlocks(col, undefined, idxParent);
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

  // Height matching logic
  const cards = block.querySelectorAll('.product-card');
  const featuredCard = block.querySelector('.product-card.featured');
  cards.forEach((card) => {
    const priceElements = card.querySelectorAll('.price.nanoblock');
    if (priceElements.length >= 2) {
      const secondToLastPrice = priceElements[priceElements.length - 2];
      const previousElement = secondToLastPrice.previousElementSibling;
      if (previousElement && previousElement.tagName.toLowerCase() === 'p') {
        previousElement.classList.add('first-year-price-text');
      } else {
        const newP = document.createElement('p');
        newP.classList.add('first-year-price-text');
        secondToLastPrice.before(newP);
      }
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
  matchHeights(block, '.first-year-price-text');
  matchHeights(block, '.price.nanoblock:not(:last-of-type)');
  matchHeights(block, 'h3:nth-of-type(2)');
  matchHeights(block, 'p:nth-of-type(2)');
  matchHeights(block, 'p:nth-of-type(3)');
  matchHeights(block, 'h4');
  matchHeights(block, 'ul:not(.variant-selector)');
  matchHeights(block, '.featured.nanoblock');
}
