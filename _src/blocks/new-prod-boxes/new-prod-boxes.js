import { formatPrice, checkIfNotProductPage } from '../../scripts/utils/utils.js';
import { Store, ProductInfo } from '../../scripts/libs/store/index.js';

// Constants for store department and price attributes
const STORE_DEPARTMENT = 'consumer';
const PRICE_ATTRIBUTES = {
  default: 'discounted||full',
  monthly: 'discounted-monthly||full-monthly',
  monthlyNoDecimal: 'discounted-monthly-no-decimal||full-monthly',
  noDecimal: 'discounted-no-decimal||full-no-decimal',
  full: 'full',
  fullNoDecimal: 'full-no-decimal',
};

/**
 * Determines the appropriate price attribute based on billing type and decimal settings
 * @param {string} type - Billing type ('monthly' or default)
 * @param {string} hideDecimals - Whether to hide decimals ('true' or 'false')
 * @param {string} prodName - Product name
 * @returns {string} Price attribute string
 */
function getDiscountedPriceAttribute(type, hideDecimals, prodName) {
  if (type !== 'monthly') {
    return PRICE_ATTRIBUTES.default;
  }

  // Monthly products ending with 'm' use default pricing
  if (prodName.endsWith('m')) {
    return hideDecimals === 'true' ? PRICE_ATTRIBUTES.noDecimal : PRICE_ATTRIBUTES.default;
  }

  return hideDecimals === 'true' ? PRICE_ATTRIBUTES.monthlyNoDecimal : PRICE_ATTRIBUTES.monthly;
}

/**
 * Creates a price element with old price, discount, new price, and buy button
 * @param {Object} options - Price configuration options
 * @returns {HTMLElement} Price container element
 */
function createPriceElement(options) {
  const {
    prodName,
    saveText,
    buyLinkSelector,
    billedText,
    type,
    hideDecimals,
    perPrice,
  } = options;

  const priceAttribute = getDiscountedPriceAttribute(type, hideDecimals, prodName);
  const oldPriceAttr = hideDecimals === 'true' ? PRICE_ATTRIBUTES.fullNoDecimal : PRICE_ATTRIBUTES.full;
  const billedPriceAttr = hideDecimals === 'true' ? PRICE_ATTRIBUTES.noDecimal : PRICE_ATTRIBUTES.default;

  const container = document.createElement('div');
  container.className = 'hero-aem__price mt-3';

  // Old price container
  const oldPriceContainer = document.createElement('div');
  oldPriceContainer.className = 'oldprice-container';
  oldPriceContainer.innerHTML = `
    <span class="prod-oldprice" data-store-price="${oldPriceAttr}" data-store-hide="no-price=discounted"></span>
    <span class="prod-save" data-store-hide="no-price=discounted">${saveText} <span data-store-discount="percentage"></span></span>
  `;

  // New price container
  const newPriceContainer = document.createElement('div');
  newPriceContainer.className = 'newprice-container mt-2';

  const perPriceText = perPrice?.textContent?.replace('0', '') || '';
  const perPriceSup = perPriceText ? `<sup class="per-m">${perPriceText}</sup>` : '';
  newPriceContainer.innerHTML = `
    <span class="prod-newprice">
      <span data-store-price="${priceAttribute}"></span>${perPriceSup}
    </span>
  `;

  container.appendChild(oldPriceContainer);
  container.appendChild(newPriceContainer);

  // Billed text
  if (billedText) {
    const billedDiv = document.createElement('div');
    billedDiv.className = 'billed';
    billedDiv.innerHTML = billedText.innerHTML.replace(
      '0',
      `<span class="newprice-2" data-store-price="${billedPriceAttr}"></span>`,
    );
    container.appendChild(billedDiv);
  }

  // Buy button
  if (buyLinkSelector) {
    const buyLink = document.createElement('a');
    buyLink.href = '#';
    buyLink.className = 'button primary no-arrow';
    buyLink.setAttribute('data-store-buy-link', '');
    buyLink.textContent = buyLinkSelector.innerText;
    container.appendChild(buyLink);
  }

  const wrapper = document.createElement('div');
  wrapper.appendChild(container);
  return wrapper;
}

/**
 * Creates a plan switcher with radio buttons for different pricing options
 * @param {HTMLElement} radioButtons - Container with radio button labels
 * @param {number} cardNumber - Card index for unique naming
 * @param {Array} prodsNames - Array of product names
 * @param {Array} prodsUsers - Array of user counts
 * @param {Array} prodsYears - Array of year counts
 * @param {string} variant - Variant type ('default' or 'addon')
 * @returns {HTMLElement} Plan switcher element
 */
function createPlanSwitcher(radioButtons, cardNumber, prodsNames, prodsUsers, prodsYears, variant = 'default') {
  const planSwitcher = document.createElement('div');
  planSwitcher.className = 'plan-switcher';

  if (variant === 'addon') {
    planSwitcher.classList.add('addon');
  }

  const radioIds = variant === 'addon'
    ? ['add-on-yearly', 'add-on-monthly']
    : ['yearly', 'monthly', '3-rd-button'];

  Array.from(radioButtons.children).forEach((radio, idx) => {
    const productName = prodsNames[idx];
    if (!productName) return;

    const prodUser = prodsUsers[idx];
    const prodYear = prodsYears[idx];
    const plan = radioIds[idx];

    let radioText = radio.textContent;
    const isChecked = radioText.includes('[checked]');
    if (isChecked) {
      radioText = radioText.replace('[checked]', '');
    }

    const inputId = `${plan}-${productName.trim()}`;
    const inputName = `${cardNumber}-${variant}`;
    const inputValue = `${cardNumber}-${plan}-${productName.trim()}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = inputId;
    input.name = inputName;
    input.value = inputValue;
    input.setAttribute('data-store-click-set-product', '');
    input.setAttribute('data-store-product-id', productName);
    input.setAttribute('data-store-product-option', `${prodUser}-${prodYear}`);
    input.setAttribute('data-store-product-department', STORE_DEPARTMENT);
    if (isChecked) {
      input.setAttribute('checked', '');
    }

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.className = 'radio-label';
    label.textContent = radioText;

    planSwitcher.appendChild(input);
    planSwitcher.appendChild(label);
    planSwitcher.appendChild(document.createElement('br'));
  });

  // Ensure at least one radio is checked
  const firstInput = planSwitcher.querySelector('input');
  if (firstInput && !planSwitcher.querySelector('input[checked]')) {
    firstInput.setAttribute('checked', 'true');
  }

  return planSwitcher;
}

/**
 * Processes feature content text with special markers
 * @param {string} content - Raw content string
 * @param {HTMLElement} tdElement - Source TD element for icon extraction
 * @returns {Object} Processed content and CSS class
 */
function processFeatureContent(content, tdElement) {
  let processedContent = content;
  let liClass = '';

  if (!processedContent) {
    return { content: '', liClass: 'd-none' };
  }

  // Handle pill markers
  const pillMatch = processedContent.match(/\?pill (\w+)/);
  if (pillMatch) {
    const icon = tdElement?.querySelector('span');
    const iconHtml = icon?.outerHTML || '';

    const pillElement = document.createElement('span');
    pillElement.className = 'blue-pill';
    pillElement.innerHTML = `${pillMatch[1]}${iconHtml}`;

    processedContent = processedContent.replace(pillMatch[0], pillElement.outerHTML);

    // Remove duplicate icon if present
    if (icon) {
      let iconCount = 0;
      processedContent = processedContent.replace(new RegExp(icon.outerHTML, 'g'), (match) => {
        iconCount += 1;
        return iconCount === 2 ? '' : match;
      });
    }
  }

  // Handle arrow markers
  if (processedContent.includes('&lt;pill') || processedContent.includes('&lt;')) {
    liClass += ' has_arrow';
    processedContent = processedContent.replace('&lt;-', '');
  }

  if (processedContent.includes('-&gt;') || processedContent.includes('&gt;')) {
    liClass += ' has_arrow_right';
    processedContent = processedContent.replace('-&gt;', '<span class="arrow-right"></span>');
  }

  // Handle special markers using replaceAll for consistency
  const replacements = [
    ['[checkmark]', '<span class="checkmark"></span>'],
    ['[add-on]', ''],
    ['&lt;&lt;add-on-newprice&gt;&gt;', '<span class="add-on-newprice"></span>'],
    ['&lt;&lt;add-on-oldprice&gt;&gt;', '<span class="add-on-oldprice"></span>'],
    ['&lt;&lt;add-on-percent-save&gt;&gt;', '<span class="add-on-percent-save"></span>'],
    ['[[', '('],
    [']]', ')'],
  ];

  replacements.forEach(([marker, replacement]) => {
    processedContent = processedContent.replaceAll(marker, replacement);
  });

  return { content: processedContent, liClass: liClass.trim() };
}

/**
 * Creates feature list HTML from table data
 * @param {NodeList} featuresSet - Set of feature tables
 * @returns {Array} Array of HTML list strings
 */
function createFeatureList(featuresSet) {
  return Array.from(featuresSet).map((table) => {
    const rows = Array.from(table.querySelectorAll('tr'));

    const listItems = rows.map((tr) => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const firstCell = cells[0];
      const secondCell = cells[1];

      const firstCellContent = firstCell?.textContent.trim() ? firstCell.innerHTML : '';
      const processed = processFeatureContent(firstCellContent, firstCell);
      const { content: processedContent, liClass } = processed;

      const secondCellContent = secondCell?.textContent.trim()
        ? `<span class="white-pill-content">${secondCell.innerHTML}</span>`
        : '';

      return `<li class="${liClass}">${processedContent}${secondCellContent}</li>`;
    }).join(' ');

    return `<ul>${listItems}</ul>`;
  });
}

/**
 * Checks if features contain add-on markers
 * @param {NodeList} featuresSet - Set of feature tables
 * @returns {boolean} Whether add-on content exists
 */
function hasAddOnFeatures(featuresSet) {
  return Array.from(featuresSet).some((table) => {
    const cells = table.querySelectorAll('td');
    return Array.from(cells).some((td) => td.innerHTML.includes('[add-on]'));
  });
}

/**
 * Parses product list string into array
 * @param {string} productString - Comma-separated product string
 * @returns {Array} Array of product identifiers
 */
function parseProductList(productString) {
  return productString ? productString.replaceAll(' ', '').split(',') : [];
}

/**
 * Parses slider text from default content
 * @param {HTMLElement} defaultContentWrapper - Default content wrapper element
 * @returns {Object} Individual and family switch text
 */
function parseSliderText(defaultContentWrapper) {
  let individualSwitchText = null;
  let familySwitchText = null;

  if (!defaultContentWrapper) {
    return { individualSwitchText, familySwitchText };
  }

  const elements = Array.from(defaultContentWrapper.children);
  elements.forEach((element) => {
    if (element.innerHTML.includes('&lt;slider-1 ')) {
      element.innerHTML = element.innerHTML.replace('&lt;slider-1 ', '');
      individualSwitchText = element.innerHTML;
      element.remove();
    }
    if (element.innerHTML.includes('&lt;slider-2 ')) {
      element.innerHTML = element.innerHTML.replace('&lt;slider-2 ', '');
      familySwitchText = element.innerHTML;
      element.remove();
    }
  });

  return { individualSwitchText, familySwitchText };
}

/**
 * Creates the individual/family toggle switch
 * @param {string} individualText - Label for individual products
 * @param {string} familyText - Label for family products
 * @returns {HTMLElement} Switch container element
 */
function createToggleSwitch(individualText, familyText) {
  const switchBox = document.createElement('div');
  switchBox.className = 'switchBox';
  switchBox.innerHTML = `
    <label class="switch">
      <input type="checkbox" id="switchCheckbox">
      <span class="slider round"></span>
      <span class="label right">${individualText}</span>
      <span class="label left">${familyText}</span>
    </label>
  `;
  return switchBox;
}

/**
 * Handles toggle switch change events
 * @param {HTMLElement} block - Block element
 * @param {HTMLInputElement} checkbox - Switch checkbox
 */
function setupToggleSwitchHandler(block, checkbox) {
  checkbox.addEventListener('change', () => {
    const familyBoxes = block.querySelectorAll('.family-box');
    const individualBoxes = block.querySelectorAll('.individual-box');
    const isChecked = checkbox.checked;

    familyBoxes.forEach((box) => {
      box.style.display = isChecked ? 'grid' : 'none';
    });

    individualBoxes.forEach((box) => {
      box.style.display = isChecked ? 'none' : 'grid';
    });
  });
}

/**
 * Creates blue tag elements from content
 * @param {HTMLElement} blueTagRow - Row containing blue tag content
 * @returns {HTMLElement} Container with blue tags
 */
function createBlueTags(blueTagRow) {
  const container = document.createElement('div');
  if (!blueTagRow || !blueTagRow.textContent.trim()) return container;

  Array.from(blueTagRow.children).forEach((child) => {
    // Only create blueTag if the child has actual content
    if (child.innerHTML.trim()) {
      const tag = document.createElement('div');
      tag.className = 'blueTag';
      tag.innerHTML = child.innerHTML;
      container.appendChild(tag);
    }
  });

  return container;
}

/**
 * Creates the title HTML for a product box
 * @param {HTMLElement} titleRow - Row containing title
 * @returns {string} Title HTML string
 */
function createTitleHTML(titleRow) {
  if (!titleRow?.textContent.trim()) return '';

  const anchor = titleRow.querySelector('a');
  if (anchor) {
    const href = anchor.getAttribute('href');
    const refactoredTitle = titleRow.textContent.replace(/(Bitdefender)(?!\s*<br>)/i, '$1<br>');
    return `<h4><a href="${href}" title="${titleRow.textContent}">${refactoredTitle}</a></h4>`;
  }

  return `<h4>${titleRow.innerHTML}</h4>`;
}

/**
 * Creates subtitle HTML with optional visibility handling
 * @param {HTMLElement} subtitleRow - Row containing subtitle
 * @returns {string} Subtitle HTML string
 */
function createSubtitleHTML(subtitleRow) {
  const text = subtitleRow?.textContent.trim();
  if (!text) return '';

  const wordCount = text.split(/\s+/).length;
  const fixedClass = wordCount > 8 ? ' fixed_height' : '';

  const invisibleTagPattern = /<span[^>]*class="[^"]*\btag\b[^"]*\btag-dark-blue\b[^"]*"[^>]*>\s*Invisible\s*<\/span>/i;
  const hasInvisibleTag = invisibleTagPattern.test(subtitleRow.innerHTML);

  const extraAttrs = hasInvisibleTag
    ? ' style="min-height:18px;visibility:hidden;pointer-events:none;" aria-hidden="true"'
    : '';

  return `<p class="subtitle${fixedClass}"${extraAttrs}>${subtitleRow.innerHTML}</p>`;
}

/**
 * Creates demo button HTML if applicable
 * @param {HTMLElement} undeBuyLinkRow - Row containing under-buy-link content
 * @returns {Object} Demo button HTML and raw content
 */
function createDemoButton(undeBuyLinkRow) {
  const content = undeBuyLinkRow?.innerText?.trim() || '';
  if (!content) return { demoBtn: '', content: '' };

  const [alias, selector, btnText] = content.split('|');

  if (alias?.trim() === 'popup' && selector && btnText) {
    const cleanSelector = selector.replace(/\s+/g, '');
    const demoBtn = `<span class="demoBtn" data-show="${selector}" onclick="document.querySelector('.${cleanSelector}').style.display = 'block'">${btnText}</span>`;
    return { demoBtn, content };
  }

  return { demoBtn: '', content };
}

/**
 * Gets checked product info from plan switcher
 * @param {HTMLElement} planSwitcher - Plan switcher element
 * @param {string} defaultName - Default product name
 * @param {string} defaultUsers - Default users count
 * @param {string} defaultYears - Default years count
 * @returns {Object} Product info object
 */
function getCheckedProductInfo(planSwitcher, defaultName, defaultUsers, defaultYears) {
  const checkedPlan = planSwitcher.querySelector('input[checked]');
  if (!checkedPlan) {
    return { name: defaultName, users: defaultUsers, years: defaultYears };
  }

  const name = checkedPlan.dataset.storeProductId || defaultName;
  const option = checkedPlan.dataset.storeProductOption || `${defaultUsers}-${defaultYears}`;
  const [users, years] = option.split('-');

  return { name, users, years };
}

/**
 * Sets up show more/less functionality for benefits lists
 * @param {HTMLElement} block - Block element
 * @param {HTMLElement} blockParent - Parent section element
 */
function setupShowMoreLess(block, blockParent) {
  const benefitsLists = block.querySelectorAll('.benefitsLists');
  const buttons = [];

  benefitsLists.forEach((benefits) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'show-more-btn-wrapper';

    const btn = document.createElement('button');
    btn.className = 'show-more-btn';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = blockParent.getAttribute('data-show-more');

    wrapper.appendChild(btn);
    benefits.insertAdjacentElement('beforebegin', wrapper);
    buttons.push(btn);
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const shouldExpand = !benefitsLists[0]?.classList.contains('expanded');

      benefitsLists.forEach((benefits) => {
        benefits.classList.toggle('expanded', shouldExpand);
      });

      buttons.forEach((button) => {
        button.textContent = shouldExpand
          ? blockParent.getAttribute('data-show-less')
          : blockParent.getAttribute('data-show-more');
        button.className = shouldExpand ? 'show-less-btn' : 'show-more-btn';
        button.setAttribute('aria-expanded', String(shouldExpand));
      });
    });
  });
}

/**
 * Sets up synchronized plan switching across cards
 * @param {HTMLElement} block - Block element
 */
function setupSynchronizedPlanSwitching(block) {
  const allPlanSwitchers = block.querySelectorAll('.plan-switcher');

  allPlanSwitchers.forEach((switcher) => {
    const inputs = switcher.querySelectorAll('input');

    inputs.forEach((input, idx) => {
      input.addEventListener('change', () => {
        if (!input.checked) return;

        const box = switcher.closest('.prod_box');
        const isIndividual = box.classList.contains('individual-box');
        const isFamily = box.classList.contains('family-box');

        allPlanSwitchers.forEach((otherSwitcher) => {
          const otherBox = otherSwitcher.closest('.prod_box');
          const shouldSync = (isIndividual && otherBox.classList.contains('individual-box'))
            || (isFamily && otherBox.classList.contains('family-box'));

          if (shouldSync) {
            const otherInputs = otherSwitcher.querySelectorAll('input');
            const targetInput = otherInputs[idx];

            if (targetInput && !targetInput.checked) {
              targetInput.checked = true;
              targetInput.dispatchEvent(new Event('change', { bubbles: true }));
              targetInput.dispatchEvent(new Event('click', { bubbles: true }));
            }
          }
        });
      });
    });
  });
}

/**
 * Sets up family box anchor button handlers
 * @param {HTMLElement} block - Block element
 */
function setupFamilyBoxHandlers(block) {
  const anchorButtons = document.querySelectorAll('.tabs-component .button');
  const switchCheckbox = document.getElementById('switchCheckbox');

  anchorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (switchCheckbox) {
        switchCheckbox.checked = true;
      }

      block.querySelectorAll('.family-box').forEach((box) => {
        box.style.display = 'block';
      });

      block.querySelectorAll('.individual-box').forEach((box) => {
        box.style.display = 'none';
      });
    });
  });
}

/**
 * Sets up add-on checkbox functionality
 * @param {HTMLElement} boxElement - Product box element
 * @param {HTMLElement} checkmarkList - Checkmark list element
 * @param {HTMLElement} newLi - New list item element
 * @param {Object} addOnInfo - Add-on product information
 * @param {HTMLElement} addOnPriceBox - Add-on price box element
 * @param {Object} productInfo - Main product information
 */
async function setupAddOnCheckbox(
  boxElement,
  checkmarkList,
  newLi,
  addOnInfo,
  addOnPriceBox,
  productInfo,
) {
  const { name: addOnProdName, users: addOnProdUsers, years: addOnProdYears } = addOnInfo;
  const { name: prodName, users: prodUsers, years: prodYears } = productInfo;

  const addOnProductElement = boxElement.querySelector('.add-on-product');
  if (!addOnProductElement) return;

  addOnProductElement.setAttribute('data-store-context', '');
  addOnProductElement.setAttribute('data-store-id', addOnProdName);
  addOnProductElement.setAttribute('data-store-option', `${addOnProdUsers}-${addOnProdYears}`);
  addOnProductElement.setAttribute('data-store-department', STORE_DEPARTMENT);

  try {
    const productObject = await Store.getProducts([
      new ProductInfo(prodName),
      new ProductInfo(addOnProdName),
    ]);

    const product = productObject[prodName];
    const addOnProduct = productObject[addOnProdName];

    if (!addOnProduct || !product) return;

    const productOption = product.getOption(prodUsers, prodYears);
    const addOnOption = addOnProduct.getOption(addOnProdUsers, addOnProdYears);

    const addOnCost = addOnOption.getDiscountedPrice('value') - productOption.getDiscountedPrice('value');
    const formattedAddOnCost = formatPrice(addOnCost, product.getCurrency());

    const addOnNewPrice = newLi.querySelector('.add-on-newprice');
    if (addOnNewPrice) {
      addOnNewPrice.textContent = formattedAddOnCost;
    }

    const addOnOldPrice = newLi.querySelector('.add-on-oldprice');
    if (addOnOldPrice) {
      addOnOldPrice.textContent = formatPrice(addOnOption.getPrice('value'), addOnProduct.getCurrency());
    }

    const addOnPercentSave = newLi.querySelector('.add-on-percent-save');
    if (addOnPercentSave && addOnPriceBox) {
      const saveText = addOnPriceBox.querySelector('.prod-save')?.textContent || '';
      const discountPercent = addOnOption.getDiscount('percentageWithProcent');
      addOnPercentSave.textContent = `${saveText} ${discountPercent}`;
    }

    const checkboxSelector = newLi.querySelector('.checkmark');
    if (checkboxSelector) {
      checkboxSelector.addEventListener('change', () => {
        checkmarkList.classList.toggle('checked', checkboxSelector.checked);
        addOnProductElement.style.display = checkboxSelector.checked ? 'block' : 'none';
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error setting up add-on checkbox:', error);
  }
}

/**
 * Builds a single product box HTML
 * @param {Object} config - Product box configuration
 * @returns {string} Product box HTML string
 */
function buildProductBoxHTML(config) {
  const {
    greenTagText, titleHTML, blueTagsHTML, subtitleHTML, subtitle2HTML, planSwitcherHTML,
    secondButtonHTML, undeBuyLinkHTML, featureListHTML, planSwitcher2HTML, addonProductName,
    hasBilled2, prodName, prodUsers, prodYears, isIndividual, storeEvent, productsAsList,
  } = config;

  const hasGreenTag = greenTagText && greenTagText !== 'demo-box';
  const isDemoBox = greenTagText === 'demo-box';
  const boxClasses = [
    'prod_box',
    greenTagText ? 'hasGreenTag' : '',
    isDemoBox ? 'demo-box' : '',
    isIndividual ? 'individual-box' : 'family-box',
  ].filter(Boolean).join(' ');

  const shouldAddStoreEvent = productsAsList.some((entry) => entry.includes(prodName));
  const storeEventAttr = shouldAddStoreEvent ? `data-store-event="${storeEvent}"` : '';

  return `
    <div class="${boxClasses}"
      data-store-context
      data-store-id="${prodName}"
      data-store-option="${prodUsers}-${prodYears}"
      data-store-department="${STORE_DEPARTMENT}"
      ${storeEventAttr}>
      <div class="inner_prod_box">
        ${hasGreenTag ? `<div class="greenTag2">${greenTagText}</div>` : ''}
        ${titleHTML}
        <div class="blueTagsWrapper">${blueTagsHTML}</div>
        ${subtitleHTML}
        <hr />
        ${subtitle2HTML ? `<p class="subtitle-2">${subtitle2HTML}</p>` : ''}
        ${planSwitcherHTML}
        <div class="hero-aem__prices await-loader"></div>
        ${secondButtonHTML}
        ${undeBuyLinkHTML ? `<div class="undeBuyLink">${undeBuyLinkHTML}</div>` : ''}
        <hr />
        <div class="benefitsLists">${featureListHTML}</div>
        <div class="add-on-product" style="display: none;">
          ${hasBilled2 ? '<hr>' : ''}
          ${planSwitcher2HTML}
          ${addonProductName ? `<h4>${addonProductName}</h4>` : ''}
          <div class="hero-aem__prices__addon"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Main block decoration function
 * @param {HTMLElement} block - Block element to decorate
 */
export default async function decorate(block) {
  const section = block.closest('.section');
  const {
    products,
    familyProducts,
    monthlyProducts,
    addOnProducts,
    addOnMonthlyProducts,
    type,
    hideDecimals,
    thirdRadioButtonProducts,
    saveText,
    addonProductName,
  } = section.dataset;

  section.classList.add('we-container');

  // Parse product lists
  const productsAsList = parseProductList(products);
  const familyProductsAsList = parseProductList(familyProducts);
  const combinedProducts = [...productsAsList, ...familyProductsAsList];
  const monthlyPricesAsList = parseProductList(monthlyProducts);
  const thirdRadioButtonProductsAsList = parseProductList(thirdRadioButtonProducts);
  const addOnProductsAsList = parseProductList(addOnProducts);
  const addOnMonthlyProductsAsList = parseProductList(addOnMonthlyProducts);
  const addOnProductsInitial = addOnProductsAsList?.slice(0, productsAsList.length);

  // Parse slider text for toggle switch
  const defaultContentWrapper = section.querySelector('.default-content-wrapper');
  const { individualSwitchText, familySwitchText } = parseSliderText(defaultContentWrapper);

  // Create toggle switch if both labels exist
  let switchBox = null;
  let switchCheckbox = null;
  if (individualSwitchText && familySwitchText) {
    switchBox = createToggleSwitch(individualSwitchText, familySwitchText);
    switchCheckbox = switchBox.querySelector('#switchCheckbox');
    setupToggleSwitchHandler(block, switchCheckbox);
  }

  // Add five-cards class if needed
  if (productsAsList.length >= 5) {
    block.classList.add('five-cards');
  }

  // Store billed texts for later use
  const billedTexts = [];

  // Determine store event type
  const storeEvent = checkIfNotProductPage() ? 'product-loaded' : 'main-product-loaded';

  // Process each product card
  if (combinedProducts.length) {
    const productCards = Array.from(block.children);

    for (let key = 0; key < productCards.length; key += 1) {
      const prod = productCards[key];
      const mainTable = prod.querySelector('tbody');

      if (mainTable) {
        const rows = Array.from(mainTable.querySelectorAll(':scope > tr'));
        const [
          greenTag,
          title,
          blueTag,
          subtitle,
          radioButtons,
          perPrice,
          billed,
          buyLink,
          undeBuyLink,
          benefitsLists,
          billed2,
          buyLink2,
          subtitle2,
        ] = rows;

        // Parse product info
        const [baseProdName, baseProdUsers, baseProdYears] = (combinedProducts[key] || '').split('/');
        const monthlyInfo = monthlyPricesAsList[key]?.split('/') || [];
        const thirdButtonInfo = thirdRadioButtonProductsAsList[key]?.split('/') || [];
        const addOnInfo = addOnProductsAsList[key]?.split('/') || [];
        const addOnMonthlyInfo = addOnMonthlyProductsAsList[key]?.split('/') || [];

        // Store billed text
        billedTexts.push(billed);

        // Check for add-on features
        const featuresSet = benefitsLists?.querySelectorAll('table') || [];
        const featureList = createFeatureList(featuresSet);
        const hasAddOn = hasAddOnFeatures(featuresSet);

        // Get buy link selector
        let buyLinkSelector = prod.querySelector('a[href*="#buylink"]');
        if (buyLinkSelector) {
          buyLinkSelector.classList.add('button', 'primary');
        } else {
          buyLinkSelector = buyLink?.querySelector('a');
        }

        // Create plan switchers
        let planSwitcher = document.createElement('div');
        if (radioButtons && monthlyProducts) {
          planSwitcher = createPlanSwitcher(
            radioButtons,
            key,
            [baseProdName, monthlyInfo[0], thirdButtonInfo[0]],
            [baseProdUsers, monthlyInfo[1], thirdButtonInfo[1]],
            [baseProdYears, monthlyInfo[2], thirdButtonInfo[2]],
          );
        }

        let planSwitcher2 = document.createElement('div');
        if (hasAddOn && addOnProducts && addOnMonthlyProducts) {
          planSwitcher2 = createPlanSwitcher(
            radioButtons,
            key,
            [addOnInfo[0], addOnMonthlyInfo[0]],
            [addOnInfo[1], addOnMonthlyInfo[1]],
            [addOnInfo[2], addOnMonthlyInfo[2]],
            'addon',
          );
        }

        // Get checked product info
        const productInfo = getCheckedProductInfo(
          planSwitcher,
          baseProdName,
          baseProdUsers,
          baseProdYears,
        );
        const addOnProductInfo = getCheckedProductInfo(
          planSwitcher2,
          addOnInfo[0],
          addOnInfo[1],
          addOnInfo[2],
        );

        // Get billed text based on checked radio
        let billedText = billed?.children[0];
        if (radioButtons) {
          Array.from(radioButtons.children).forEach((radio, idx) => {
            if (radio.textContent.includes('[checked]') && billed?.children[idx]) {
              billedText = billed.children[idx];
            }
          });
        }

        // Create UI elements
        const blueTagsContainer = createBlueTags(blueTag);
        const titleHTML = createTitleHTML(title);
        const subtitleHTML = createSubtitleHTML(subtitle);
        const { demoBtn, content: undeBuyLinkContent } = createDemoButton(undeBuyLink);

        // Handle second button
        const secondButton = buyLink?.querySelectorAll('a')[1];
        if (secondButton) {
          secondButton.classList.add('button', 'secondary', 'no-arrow');
        }

        // Build product box HTML
        const prodBoxHTML = buildProductBoxHTML({
          greenTagText: greenTag?.textContent.trim(),
          titleHTML,
          blueTagsHTML: blueTagsContainer.innerHTML,
          subtitleHTML,
          subtitle2HTML: subtitle2?.textContent.trim() || '',
          planSwitcherHTML: radioButtons ? planSwitcher.outerHTML : '',
          secondButtonHTML: secondButton?.outerHTML || '',
          undeBuyLinkHTML: undeBuyLinkContent ? (demoBtn || undeBuyLink.innerHTML.trim()) : '',
          featureListHTML: benefitsLists?.textContent.trim() ? featureList.join('') : '',
          planSwitcher2HTML: planSwitcher2.outerHTML || '',
          addonProductName,
          hasBilled2: Boolean(billed2),
          prodName: productInfo.name,
          prodUsers: productInfo.users,
          prodYears: productInfo.years,
          isIndividual: key < productsAsList.length,
          storeEvent,
          productsAsList,
        });

        // Replace original content
        block.children[key].outerHTML = prodBoxHTML;

        // Add price box
        const priceBox = createPriceElement({
          prodName: productInfo.name,
          saveText,
          buyLinkSelector: buyLink?.querySelector('a'),
          billedText,
          type,
          hideDecimals,
          perPrice,
        });
        block.children[key].querySelector('.hero-aem__prices')?.appendChild(priceBox);

        // Add add-on price box if needed
        let addOnPriceBox = null;
        if (hasAddOn && addOnProducts) {
          addOnPriceBox = createPriceElement({
            prodName: addOnProductInfo.name,
            saveText,
            buyLinkSelector: buyLink2?.querySelector('a'),
            billedText: billed2,
            type,
            hideDecimals,
            perPrice,
          });
          block.children[key].querySelector('.hero-aem__prices__addon')?.appendChild(addOnPriceBox);
        }

        // Setup checkmark/add-on functionality
        const checkmark = block.children[key].querySelector('.checkmark');
        if (checkmark) {
          const checkmarkList = checkmark.closest('ul');
          checkmarkList?.classList.add('checkmark-list');

          const li = checkmark.closest('li');
          if (li) {
            li.removeChild(checkmark);

            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.className = 'checkmark';

            const newLi = document.createElement('li');
            newLi.innerHTML = `${checkBox.outerHTML}<div>${li.innerHTML}</div>`;
            li.replaceWith(newLi);

            // Set store event for add-on products
            if (addOnProductsInitial?.some((entry) => entry.includes(addOnProductInfo.name))) {
              block.children[key].querySelector('.add-on-product')?.setAttribute('data-store-event', storeEvent);
            }

            // Setup add-on checkbox async
            // eslint-disable-next-line no-await-in-loop
            await setupAddOnCheckbox(
              block.children[key],
              checkmarkList,
              newLi,
              addOnProductInfo,
              addOnPriceBox,
              productInfo,
            );
          }
        }
      }
    }
  }

  // Setup show more/less if enabled
  if (section.classList.contains('show-more-show-less')) {
    setupShowMoreLess(block, section);
    setupFamilyBoxHandlers(block);
    setupSynchronizedPlanSwitching(block);
  }

  // Insert toggle switch if created
  if (switchBox) {
    block.parentNode.insertBefore(switchBox, block);
  }

  // Setup billed text updates on plan switch
  Array.from(block.children).forEach((box, key) => {
    box.querySelectorAll('.plan-switcher input').forEach((radio, idx) => {
      radio.addEventListener('change', () => {
        const newBilledText = billedTexts[key]?.children[idx]?.innerHTML;
        if (newBilledText) {
          const billedElement = box.querySelector('.billed');
          if (billedElement) {
            billedElement.innerHTML = newBilledText;
          }
        }
      });
    });
  });

  // Hotjar tracking
  window.hj = window.hj || function initHotjar(...args) {
    (window.hj.q = window.hj.q || []).push(...args);
  };
  window.hj('event', 'new-prod-boxes');

  // Decorate icons for www-websites
  const isInLandingPages = window.location.href.includes('www-landing-pages')
    || window.location.href.includes('bitdefender.com/pages');

  if (!isInLandingPages) {
    try {
      const { decorateIcons } = await import('../../scripts/lib-franklin.js');
      decorateIcons(section);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error decorating icons:', error);
    }
  }

  // Trigger initial toggle state only if switch exists
  if (switchCheckbox) {
    switchCheckbox.dispatchEvent(new Event('change'));
  }
}
