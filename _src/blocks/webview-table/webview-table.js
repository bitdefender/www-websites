import { matchHeights } from '../../scripts/utils/utils.js';

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
      } else if (!div.hasAttribute('role')) {
        div.setAttribute('role', 'cell');
      }
    });

  const header = block.querySelector('div:not(:first-child)');
  [...header.children].forEach((headerColumns) => {
    headerColumns.setAttribute('role', 'columnheader');
  });
}

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
      if (prodName && !isCurrent) {
        cell.setAttribute('data-store-context', '');
        cell.setAttribute('data-store-id', prodName);
        cell.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
        cell.setAttribute('data-store-department', 'consumer');
        cell.setAttribute('data-store-event', 'product-loaded');
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
        block.setAttribute('data-store-context', '');
        block.setAttribute('data-store-id', prodName);
        block.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
        block.setAttribute('data-store-department', 'consumer');
        block.setAttribute('data-store-event', 'product-loaded');
        savingsTag.innerHTML = `
          <span class="saving-tag-text" data-store-hide="no-price=discounted">
            <span data-store-discount="percentage"></span> ${saveText || ''} 
          </span>
        `;
        savingsTag.style.visibility = 'visible';
      }
      // Populate buy box for non-current products
      if (!isCurrent) {
        buyBox.innerHTML = `
          <div class="price-box">
            <div>
              <span class="prod-oldprice" data-store-price="full" data-store-hide="no-price=discounted"></span>
            </div>
            <div class="newprice-container mt-2">
              <span class="prod-newprice"><span data-store-price="discounted||full"></span></span>
            </div>
          </div>
          <span class="under-price-text">${firstYearText}</span>
        `;
        const buyLink = cell.querySelector('a[href*="#buylink"]');
        buyLink?.setAttribute('data-store-buy-link', '');
      } else {
        cell.classList.add('current');
      }

      cell.insertAdjacentElement('afterbegin', buyBox);
      const tagCell = block.querySelector(`div[role="columnheader"]:nth-of-type(${index + 2})`);
      tagCell.insertAdjacentElement('afterbegin', savingsTag);

      // eslint-disable-next-line no-plusplus
      index++; // Increment index manually
    }
  });
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
}
