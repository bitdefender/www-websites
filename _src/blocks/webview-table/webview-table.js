import { getLanguageCountryFromPath } from '../../scripts/scripts.js';
import { matchHeights, wrapChildrenWithStoreContext } from '../../scripts/utils/utils.js';

function replaceTableTextToProperCheckmars(block) {
  block.querySelectorAll('div')
    .forEach(async (div) => {
      if (div.textContent.match(/^yes/i)) {
        div.textContent = '';
        const icon = document.createElement('div');
        icon.classList.add('yes-check');
        div.appendChild(icon);
      } else if (div.textContent.match(/^no/i)) {
        div.textContent = '';
        const icon = document.createElement('div');
        icon.classList.add('no-check');
        div.appendChild(icon);
      }
    });
}

function buildTableHeader(block) {
  const header = block.querySelector('div:nth-of-type(2)');

  // Ensure the header exists before trying to modify it
  if (header) {
    header.classList.add('webview-comparison-header');
  }
}

function addAccesibilityRoles(block) {
  block.setAttribute('role', 'table');
  const firstDiv = block.querySelector('div:first-of-type');
  [...block.querySelectorAll('div')].filter((div) => !firstDiv.contains(div))
    .forEach((div) => {
      if (div.childElementCount > 1 && div.parentElement.getAttribute('role') === 'table') {
        div.setAttribute('role', 'row');
      } else if (div.childElementCount === 1 && div.innerHTML.indexOf('&lt;privacy-policy-text&gt;') !== -1) {
        div.setAttribute('role', 'privacy-policy');
        div.innerHTML = div.innerHTML.replace('&lt;privacy-policy-text&gt;', '');
      } else if (!div.hasAttribute('role')) {
        div.setAttribute('role', 'cell');
      }
    });

  const header = block.querySelector('div:not(:first-child)');
  [...header.children].forEach((headerColumns) => {
    headerColumns.setAttribute('role', 'columnheader');
  });
}

/**
 * Creates a plan switcher with radio buttons for product selection
 * @param {string|null} radioButtons - Pipe-separated string of radio button labels
 * @param {Array<string>|null} prodsNames - Array of product names
 * @param {Array<string>|null} prodsUsers - Array of user counts for products
 * @param {Array<string>|null} prodsYears - Array of year durations for products
 * @param {boolean} [blockLevel=false] - Whether this is a block-level switcher
 * @returns {HTMLElement} The created plan switcher element
 */
function createPlanSwitcher(radioButtons, prodsNames, prodsUsers, prodsYears, blockLevel = false) {
  const planSwitcher = document.createElement('div');
  planSwitcher.classList.add('plan-switcher');

  // If any of the product arrays are null, use radioButtons only
  if (!prodsNames || !prodsUsers || !prodsYears) {
    const radioArray = radioButtons ? radioButtons.split('|').map((item) => item.trim()) : [];
    radioArray.forEach((radio, idx) => {
      let checked = idx === 0 ? 'checked' : '';
      const defaultCheck = radio.match(/\[checked\]/g);
      if (defaultCheck) {
        // eslint-disable-next-line no-param-reassign
        radio = radio.replace('[checked]', '').trim();
        checked = 'checked';
      }

      planSwitcher.innerHTML += `
      <input
      type="radio" 
      id="${idx}-${radio}"
      name="switcher"
      value="${radio}" 
      ${checked}>
      <label for="${idx}-${radio}" class="radio-label">${radio}</label>
    `;
    });
    return planSwitcher;
  }

  if (radioButtons === null) {
    // eslint-disable-next-line no-param-reassign
    radioButtons = 'Annual Plan | Monthly Plan';
    planSwitcher.classList.add('global-display-none');
  }

  const radioArray = radioButtons.split('|').map((item) => item.trim());
  radioArray.forEach((radio, idx) => {
    const prodName = prodsNames[idx];
    const prodUser = prodsUsers[idx];
    const prodYear = prodsYears[idx];
    let checked = idx === 0 ? 'checked' : '';
    const defaultCheck = radio.match(/\[checked\]/g);
    if (defaultCheck) {
      // eslint-disable-next-line no-param-reassign
      radio = radio.replace('[checked]', '').trim();
      checked = 'checked';
    }

    if (prodName) {
      planSwitcher.innerHTML += `
        <input data-store-action
              data-store-set-id="${prodName}" 
        data-store-set-devices="${prodUser}"
        data-store-set-subscription="${prodYear}" 
        type="radio" 
        id="${blockLevel ? 'block-' : ''}${idx}-${prodName.trim()}"
        name="${blockLevel ? 'block-' : ''}${prodName.trim()}"
        value="${radio}-${prodName.trim()}" 
        ${checked}>
        <label for="${blockLevel ? 'block-' : ''}${idx}-${prodName.trim()}" class="radio-label">${radio}</label><br>
      `;
    }
  });

  return planSwitcher;
}

/**
 * Renders price boxes and product information in table cells
 * @param {HTMLElement} block - The container block element
 * @param {Object} metadata - Configuration object containing product data
 * @param {string} metadata.products - Comma-separated list of products
 * @param {string} metadata.secondaryProducts - Comma-separated list of secondary products
 * @param {string} metadata.firstYearText - Text to display under price
 * @param {string} metadata.featuredProduct - Index of featured product
 * @param {string} metadata.currentProduct - Index of current product
 * @param {string} metadata.saveText - Text for savings tag
 */
function renderPrices(block, metadata) {
  const {
    products, firstYearText, featuredProduct, currentProduct, saveText,
  } = metadata;

  const productsAsList = Array.from(products?.split(','));
  const cells = block.querySelectorAll('div[role="cell"]');
  let index = 0; // Manual index increment

  cells.forEach((cell) => {
    // Only process cells that contain the {PRICEBOX} variable
    if (cell.textContent.includes('{PRICEBOX}')) {
      cell.parentElement.classList.add('price-row');
      cell.querySelector('p')?.remove();
      const [prodName, prodUsers, prodYears] = productsAsList[index]?.split('/') || [];

      const buyBox = document.createElement('div');
      buyBox.classList.add('buy-box', 'await-loader');

      const savingsTag = document.createElement('div');
      savingsTag.style.visibility = 'hidden';
      savingsTag.classList.add('savings-tag-container');

      // Determine if current product or featured product
      const isFeatured = index + 1 === Number(featuredProduct);
      const isCurrent = Number(currentProduct) === index + 1;

      // Populate buy box for non-current products
      if (!isCurrent) {
        buyBox.innerHTML = `
          <div class="price-box">
            <div data-store-hide="!it.option.price.discounted">
              <span class="prod-oldprice" data-store-render data-store-price="full"></span>
            </div>
            <div class="newprice-container mt-2">
              <span class="prod-newprice"><span data-store-render data-store-price="discounted||full"></span></span>
            </div>
          </div>
          <span class="under-price-text">${firstYearText}</span>
        `;
        const buyLink = cell.querySelector('a[href*="#buylink"]');
        buyLink?.setAttribute('data-store-buy-link', '');
        buyLink?.setAttribute('data-store-render', '');
      } else {
        cell.classList.add('current');
      }
      cell.insertAdjacentElement('afterbegin', buyBox);

      if (prodName && !isCurrent) {
        wrapChildrenWithStoreContext(cell, {
          productId: prodName,
          devices: prodUsers,
          subscription: prodYears,
          ignoreEventsParent: true,
          storeEvent: 'all',
        });

        if (secondaryProdName) {
          const prodsNames = [prodName, secondaryProdName];
          const prodsUsers = [prodUsers, secondaryProdUsers];
          const prodsYears = [prodYears, secondaryProdYears];
          const planSwitcher = createPlanSwitcher(null, prodsNames, prodsUsers, prodsYears);
          cell.appendChild(planSwitcher);
        }
      }
      // Add featured logic if applicable
      if (featuredProduct && isFeatured) {
        block.querySelector(`div[role="columnheader"]:nth-of-type(${Number(featuredProduct) + 1})`).classList.add('featured');
        block.querySelectorAll('div[role="row"]').forEach((row) => {
          const featuredCell = row.querySelector(`div[role="cell"]:nth-of-type(${Number(featuredProduct) + 1})`);
          if (featuredCell) {
            featuredCell.classList.add('featured');
          }
        });
        wrapChildrenWithStoreContext(block, {
          productId: prodName,
          devices: prodUsers,
          subscription: prodYears,
          ignoreEventsParent: true,
          storeEvent: 'all',
        });

        if (secondaryProdName) {
          const prodsNames = [prodName, secondaryProdName];
          const prodsUsers = [prodUsers, secondaryProdUsers];
          const prodsYears = [prodYears, secondaryProdYears];
          const planSwitcher = createPlanSwitcher(null, prodsNames, prodsUsers, prodsYears, true);
          block.prepend(planSwitcher);
        }
        savingsTag.innerHTML = `
          <span class="saving-tag-text" data-store-hide="!it.option.price.discounted">
            <span data-store-render data-store-discount="percentage"></span> ${saveText || ''} 
          </span>
        `;
        savingsTag.style.visibility = 'visible';
      }

      const tagCell = block.querySelector(`div[role="columnheader"]:nth-of-type(${index + 2})`);
      tagCell.insertAdjacentElement('afterbegin', savingsTag);

      // eslint-disable-next-line no-plusplus
      index++; // Increment index manually
    }
  });
}

// eslint-disable-next-line max-len
function adjustFontSizeUntilTargetHeight(elementsSelector, targetElement, targetHeight, maxSize = 100, minSize = 10, step = 1, interval = 50) {
  const elements = document.querySelectorAll(elementsSelector);

  // Invalid selector or target element not found.
  if (!elements.length || !targetElement) {
    return;
  }

  let previousHeight = targetElement.offsetHeight;

  function adjustSize() {
    const currentHeight = targetElement.offsetHeight;

    if (Math.abs(currentHeight - targetHeight) < 2) {
      return; // Stop when the target height is reached
    }

    let fontChanged = false;

    elements.forEach((el) => {
      const currentSize = parseInt(window.getComputedStyle(el).fontSize, 10);

      if (currentHeight < targetHeight && currentSize < maxSize) {
        el.style.fontSize = `${currentSize + step}px`; // Increase size
        fontChanged = true;
      } else if (currentHeight > targetHeight && currentSize > minSize) {
        el.style.fontSize = `${currentSize - step}px`; // Decrease size
        fontChanged = true;
      }
    });

    // Continue adjusting only if font size was changed
    if (fontChanged) {
      setTimeout(adjustSize, interval); // Slight delay for smooth adjustment
    }
  }

  // Use MutationObserver to track height changes efficiently
  const observer = new MutationObserver(() => {
    const newHeight = targetElement.offsetHeight;
    if (newHeight !== previousHeight) {
      previousHeight = newHeight;
      adjustSize();
    }
  });

  observer.observe(targetElement, { attributes: true, childList: true, subtree: true });

  adjustSize();
}

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
  const privacyPolicyTag = block.querySelector('[role="privacy-policy"]');

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

export default async function decorate(block) {
  const metadata = block.closest('.section').dataset;
  buildTableHeader(block);
  addAccesibilityRoles(block);
  replaceTableTextToProperCheckmars(block);
  renderPrices(block, metadata);
  matchHeights(block, '.savings-tag-container');
  matchHeights(block, '.buy-box');

  const url = new URL(window.location.href);
  if (url.searchParams.has('theme') && url.searchParams.get('theme') === 'light') {
    block.classList.add('light-mode');
  }

  // Check and replace privacy-policy link if it gives a 404
  await checkAndReplacePrivacyPolicyLink(block);

  const targetElement = document.querySelector('.webview-table');
  adjustFontSizeUntilTargetHeight('.webview-table > div[role="row"] > div:nth-child(1)', targetElement, 512);
}
