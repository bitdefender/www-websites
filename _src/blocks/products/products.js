import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  createTag,
  generateProductBuyLink,
  matchHeights,
  setDataOnBuyLinks, formatPrice, adobeMcAppendVisitorId, trackProduct, getDomain,
} from '../../scripts/utils/utils.js';

// all avaiable text variables
const TEXT_VARIABLES_MAPPING = [
  {
    variable: 'percent',
    getValue: (mv) => `${mv.model.discountRate}%`,
  },
];

/**
 * Utility function to round prices and percentages
 * @param  value value to round
 * @returns rounded value
 */
function customRound(value) {
  const numValue = parseFloat(value);

  if (Number.isNaN(numValue)) {
    return value;
  }

  // Convert to a fixed number of decimal places then back to a number to deal with precision issues
  const roundedValue = Number(numValue.toFixed(2));

  // If it's a whole number, return it as an integer
  return (roundedValue % 1 === 0) ? Math.round(roundedValue) : roundedValue;
}

/**
 * Convert a product variant returned by the remote service into a model
 * @param productCode product code
 * @param variantId variant identifier
 * @param v variant
 * @returns a model
 */
function toModel(productCode, variantId, v) {
  const currentDomain = getDomain();
  const formattedPriceParams = [v.currency_iso, null, currentDomain];
  return {
    productId: v.product_id,
    productName: v.product_name,
    productCode,
    variantId,
    regionId: v.region_id,
    platformProductId: v.platform_product_id,
    devices: +v.variation.dimension_value,
    subscription: v.variation.years * 12,
    version: v.variation.years ? '12' : '1',
    basePrice: +v.price,
    // eslint-disable-next-line max-len
    actualPrice: v.discount ? +v.discount.discounted_price : +v.price,
    monthlyBasePrice: customRound(v.price / 12),
    discountedPrice: v.discount?.discounted_price,
    discountedMonthlyPrice: v.discount ? customRound(v.discount.discounted_price / 12) : 0,
    // eslint-disable-next-line max-len
    discount: formatPrice(v.discount ? customRound((v.price - v.discount.discounted_price) * 100) / 100 : 0, ...formattedPriceParams),
    // eslint-disable-next-line max-len
    discountRate: v.discount ? Math.floor(((v.price - v.discount.discounted_price) / v.price) * 100) : 0,
    currencyIso: v.currency_iso,
    url: generateProductBuyLink(v, productCode),
    test: {},
  };
}

/**
 * Represents the current state of a product card.
 * The state is exposed by the _model_ attribute.
 * Views can react to state change by subscribing with a listener
 * This class is also repsonsible for fetching the product variants
 * from the remote service and presenting them to the view.
 */
class ProductCard {
  constructor(root) {
    this.root = root;
    this.listeners = [];
    this.model = {};
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.model));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Fetch a product variant from the remote service and update the model state
   * @param productCode
   * @param variantId
   */
  async selectProductVariant(productCode, variantId) {
    const p = await fetchProduct(productCode, variantId);

    this.model = toModel(productCode, variantId, p);

    this.notify();
  }
}

/**
 * Nanoblock representing the plan selectors.
 * If only one plan is declared, the plan selector will not be visible.
 * @param mv The modelview holding the state of the view
 * @param plans The list of plans to display [ labelToDisplay, productCode, variantId, ... ]
 * @param defaultSelection The default selection.
 * @returns Root node of the nanoblock
 */
function renderPlanSelector(mv, plans, defaultSelection) {
  // TODO: Remove unecessary div
  const root = document.createElement('div');
  const ul = document.createElement('ul');
  ul.classList.add('variant-selector');
  root.appendChild(ul);

  mv.subscribe(() => {
    const { model: { productCode: code, variantId: variant } } = mv;

    ul.querySelector('.active')?.classList.remove('active');
    const li = ul.querySelector(`[data-product-code="${code}"][data-product-variant="${variant}"]`);
    li.classList.add('active');
  });

  for (let idx = 0; idx < plans.length - 2; idx += 3) {
    const label = plans[idx];
    const code = plans[idx + 1];
    const variant = plans[idx + 2];

    const li = createTag(
      'li',
      {
        'data-product-code': code,
        'data-product-variant': variant,
      },
      `<span>${label}</span>`,
    );

    if (plans.length === 3) {
      ul.style.display = 'none';
    }

    li.addEventListener('click', () => {
      mv.selectProductVariant(code, variant);
    });

    // activate default selection
    if (label === defaultSelection) {
      li.click();
    }

    ul.appendChild(li);
  }

  return root;
}

/**
 * Nanoblock representing the old product price
 * @param mv The modelview holding the state of the view
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderOldPrice(mv, text = '', monthly = '') {
  // TODO: simplify CSS
  const root = createTag(
    'div',
    {
      class: 'price await-loader',
    },
    `<span class='old-price ${!mv.model.basePrice ? 'no-old-price' : ''}'>${text} <del>${mv.model.basePrice ?? ''}</del>`,
  );

  const oldPriceElt = root.querySelector('span');

  mv.subscribe(() => {
    const currentDomain = getDomain();
    const formattedPriceParams = [mv.model.currencyIso, null, currentDomain];

    let oldPrice = 0;
    if (mv.model.discountedPrice && mv.model.discountRate !== 0) {
      if (monthly.toLowerCase() === 'monthly') {
        oldPrice = mv.model.monthlyBasePrice;
        oldPriceElt.innerHTML = `${text} <del>${formatPrice(mv.model.monthlyBasePrice, ...formattedPriceParams)} <sup>/mo</sup></del>`;
      } else {
        oldPrice = mv.model.basePrice;
        oldPriceElt.innerHTML = `${text} <del>${formatPrice(mv.model.basePrice, ...formattedPriceParams)}</del>`;
      }
      oldPriceElt.style.visibility = 'visible';
    } else {
      oldPriceElt.style.visibility = 'hidden';
    }

    root.classList.remove('await-loader');
    mv.model.test.oldPrice = oldPrice;
  });

  return root;
}

/**
 * Nanoblock representing the new product price
 * @param mv The modelview holding the state of the view
 * @param text The text located before the price
 * @param monthly Show the monthly price if equal to 'monthly'
 * @returns Root node of the nanoblock
 */
function renderPrice(mv, text = '', monthly = '', monthTranslation = 'mo') {
  // TODO simplify CSS
  const root = createTag(
    'div',
    {
      class: 'price await-loader',
    },
    `<strong>${mv.model.basePrice}</strong>`,
  );

  const priceElt = root.querySelector('strong');

  mv.subscribe(() => {
    const currentDomain = getDomain();
    const formattedPriceParams = [mv.model.currencyIso, null, currentDomain];

    let price;
    if (monthly.toLowerCase() === 'monthly') {
      if (mv.model.discountedPrice) {
        price = mv.model.discountedMonthlyPrice;
        priceElt.innerHTML = `${text} ${formatPrice(mv.model.discountedMonthlyPrice, ...formattedPriceParams)} <sup>/${monthTranslation}</sup>`;
      } else {
        price = mv.model.monthlyBasePrice;
        priceElt.innerHTML = `${text} ${formatPrice(mv.model.monthlyBasePrice, ...formattedPriceParams)} <sup>/${monthTranslation}</sup>`;
      }
    } else if (mv.model.discountedPrice) {
      price = mv.model.discountedPrice;
      priceElt.innerHTML = `${text} ${formatPrice(mv.model.discountedPrice, ...formattedPriceParams)}`;
    } else {
      price = mv.model.basePrice;
      priceElt.innerHTML = `${text} ${formatPrice(mv.model.basePrice, ...formattedPriceParams)}`;
    }

    mv.model.test.price = price;
    root.classList.remove('await-loader');
    trackProduct(mv.model);
  });

  return root;
}

/**
 * Renders the green section on top of the product card highlighting the potential savings
 * @param mv The modelview holding the state of the view
 * @param text Text to display
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderHighlightSavings(mv, text = 'Save', percent = '') {
  const root = createTag(
    'div',
    {
      class: 'highlight',
      style: 'display=none',
    },
    '<span></span>',
  );
  mv.subscribe(() => {
    if (mv.model.discountRate) {
      root.querySelector('span').innerText = (percent.toLowerCase() === 'percent')
        ? `${text} ${mv.model.discountRate}%`
        : `${text} ${mv.model.discount}`;
      root.style.visibility = 'visible';
    } else {
      root.style.visibility = 'hidden';
    }
  });

  return root;
}

/**
 * Nanoblock representing a text to highlight in the product card
 * @param mv The modelview holding the state of the view
 * @param text Text to display
 * @returns Root node of the nanoblock
 */
function renderHighlight(mv, text) {
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
 * @param mv The modelview holding the state of the view
 * @param {string} text Text of the featured nanoblock
 * @return {string} Text with variables replaced
 */
const replaceVariablesInText = (mv, text) => {
  let replacedText = text;

  // replace the percent variable with correct percentage of the produc
  TEXT_VARIABLES_MAPPING.forEach((textVariableMapping) => {
    replacedText = replacedText.replaceAll(
      textVariableMapping.variable,
      textVariableMapping.getValue(mv),
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
 * @param mv The modelview holding the state of the view
 * @param text Text of the featured nanoblock
 * @returns Root node of the nanoblock
 */
function renderFeatured(mv, text) {
  const root = document.createElement('div');
  root.classList.add('featured');
  root.innerText = text;

  if (checkIfTextContainsVariables(text)) {
    root.classList.add('global-display-none');
    mv.subscribe(() => {
      root.innerText = replaceVariablesInText(mv, root.innerText);
      root.classList.remove('global-display-none');
    });
  }

  return root;
}

/**
 * Nanoblock representing a text to Featured and the corresponding savings
 * @param mv The modelview holding the state of the view
 * @param text Text of the featured nanoblock
 * @param percent Show the saving in percentage if equals to `percent`
 * @returns Root node of the nanoblock
 */
function renderFeaturedSavings(mv, text = 'Save', percent = '') {
  const root = createTag(
    'div',
    {
      class: 'featured',
      style: 'visibility=hidden',
    },
    `<span>${text}</span>`,
  );
  root.classList.add('await-loader');

  mv.subscribe(() => {
    if (mv.model.discountRate) {
      root.innerText = (percent.toLowerCase() === 'percent')
        ? `${text} ${mv.model.discountRate}%`
        : `${text} ${mv.model.discount}`;
      root.style.visibility = 'visible';
    } else {
      root.style.visibility = 'hidden';
      root.classList.add('no-save-price');
    }
    root.classList.remove('await-loader');
  });

  return root;
}

/**
 * Nanoblock representing the lowest product price
 * @param code Product code
 * @param variant Product variant
 * @returns root node of the nanoblock
 */
function renderLowestPrice(code, variant, monthly = '', text = '') {
  const root = document.createElement('p');
  fetchProduct(code, variant).then((product) => {
    const currentDomain = getDomain();
    const formattedPriceParams = [product.currency_iso, null, currentDomain];
    const m = toModel(code, variant, product);
    const isMonthly = monthly.toLowerCase() === 'monthly';
    // eslint-disable-next-line max-len
    const price = formatPrice(isMonthly ? customRound(m.actualPrice / 12) : m.actualPrice, ...formattedPriceParams);
    root.innerHTML = `${text.replace('0', `${price}`)}`;
  });

  return root;
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param mv The modelview holding the state of the view
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderPriceCondition(mv, text) {
  return createTag(
    'div',
    {
      class: 'price',
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
  [...block.children].forEach((row, idxParent) => {
    [...(row.children)].forEach((col) => {
      col.classList.add('product-card');
      block.appendChild(col);

      const mv = new ProductCard(col);

      renderNanoBlocks(col, mv, idxParent);

      // listen to ProductCard change and update the buttons pointing to the store url
      mv.subscribe((card) => {
        col.querySelectorAll('.button-container a').forEach((link) => {
          if (link && (link.href.includes('/site/Store/buy/') || link.href.includes('checkout.bitdefender.com'))) {
            link.href = card.url;

            const dataInfo = {
              productId: card.productCode,
              variation: {
                price: card.test.price,
                oldPrice: card.test.oldPrice,
                variation_name: card.variantId,
                currency_label: card.currency,
                region_id: card.regionId,
              },
            };
            setDataOnBuyLinks(link, dataInfo);
          }
        });

        adobeMcAppendVisitorId(block);
      });
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
