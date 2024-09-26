import {
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
  matchHeights,
  setDataOnBuyLinks,
  generateProductBuyLink, formatPrice,
} from '../../scripts/utils/utils.js';
import { getDomain } from '../../scripts/scripts.js';

const fetchedProducts = [];

createNanoBlock('priceComparison', (code, variant, label, block, productIndex, columnEl) => {
  const priceRoot = document.createElement('div');
  priceRoot.classList.add('product-comparison-price');
  const oldPriceText = block.closest('.section').dataset.old_price_text ?? 'Old Price';
  const oldPriceElement = document.createElement('p');
  priceRoot.appendChild(oldPriceElement);
  oldPriceElement.innerText = '-';
  oldPriceElement.classList.add('old-price-container');
  const priceElement = document.createElement('strong');
  priceRoot.appendChild(priceElement);
  priceElement.innerText = '-';
  priceElement.classList.add('current-price-container');
  const priceAppliedOnTime = document.createElement('p');
  priceRoot.appendChild(priceAppliedOnTime);

  fetchProduct(code, variant)
    .then((product) => {
      const currentProduct = { code, variant, product };
      fetchedProducts.push(currentProduct);
      // eslint-disable-next-line camelcase
      const { price, discount: { discounted_price: discounted }, currency_iso: currency } = product;
      const formattedPriceParams = [currency, null, getDomain()];
      // eslint-disable-next-line max-len
      const formattedSavings = formatPrice((price - discounted).toFixed(2), ...formattedPriceParams);
      const formattedPrice = formatPrice(price, ...formattedPriceParams);
      const formattedDiscount = formatPrice(discounted, ...formattedPriceParams);

      oldPriceElement.innerHTML = `<div class="old-price-box">
        <span>${oldPriceText} <del>${formattedPrice}</del></span>
        <span class="savings d-none">Savings <del>${formattedSavings}</del></span>
      </div>`;
      priceElement.innerHTML = `<div class="new-price-box">
        <span class="d-none total-text">Your total price:</span>
        ${formattedDiscount}
      </div>`;
      priceAppliedOnTime.innerHTML = label;

      // update buy link
      const buyLink = columnEl.querySelector('.button-container a');
      const isBuyLink = buyLink?.href?.includes('/site/Store/buy/');

      if (isBuyLink) {
        const variantSplit = variant.split('-');
        const units = variantSplit[0].split('u')[0];
        const years = variantSplit[1].split('y')[0];

        // eslint-disable-next-line max-len
        buyLink.href = currentProduct.product.buy_link || generateProductBuyLink(currentProduct, currentProduct.code, units, years);

        const dataInfo = {
          productId: currentProduct.code,
          variation: {
            price: discounted,
            oldPrice: price,
            variation_name: currentProduct.variant,
            currency_label: currentProduct.product.currency_label,
            region_id: currentProduct.product.region_id,
          },
        };

        setDataOnBuyLinks(buyLink, dataInfo);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return priceRoot;
});

function handleExpanableRowClick(rows, expandableRowIndex, evt) {
  evt.currentTarget.classList.toggle('expanded');
  evt.currentTarget.nextElementSibling.classList.toggle('expanded');
  evt.currentTarget.nextElementSibling.classList.toggle('collapsed');

  [...rows].forEach((row, index) => {
    if (row.classList.contains('expanded') && index !== expandableRowIndex) {
      row.classList.remove('expanded');
      row.classList.add('collpased');
      row.nextElementSibling.classList.remove('expanded');
      row.nextElementSibling.classList.add('collapsed');
    }
  });
}

function markHiddenRowsUnderExpandableRows(rows, expandableRowsIndexes) {
  if (!expandableRowsIndexes || expandableRowsIndexes.length === 0) {
    return;
  }
  let lastExpandableRow = 0;

  rows.forEach((row, rowIndex) => {
    const index = expandableRowsIndexes.indexOf(rowIndex);
    if (index !== -1 || rowIndex === 0) {
      lastExpandableRow = expandableRowsIndexes[index];
      return;
    }

    row.setAttribute('expandable-row-index', lastExpandableRow);
  });

  expandableRowsIndexes.forEach((expandableRowIndex) => {
    const groupOfHiddenRows = [...rows].filter((row) => row.getAttribute('expandable-row-index') === `${expandableRowIndex}`);
    const hiddenRowsWrapper = document.createElement('div');
    hiddenRowsWrapper.classList.add('hidden-rows-wrapper');
    hiddenRowsWrapper.setAttribute('role', 'rowgroup');
    hiddenRowsWrapper.append(...groupOfHiddenRows);
    rows[expandableRowIndex].after(hiddenRowsWrapper);
  });
}

function addArrowAndEventToExpandableRows(rows) {
  rows.forEach((row, index) => {
    if (row.classList.contains('expandable-row')
      && row.nextElementSibling !== null
      && row.nextElementSibling.childElementCount > 0
      && !row.nextElementSibling.classList.contains('expandable-row')) {
      row.classList.add('expandable-arrow');
      row.nextElementSibling.classList.add('collapsed');
      row.addEventListener('click', handleExpanableRowClick.bind(null, rows, index));
    }
  });
}

function addClassesForExpandableRows(rows) {
  const expandableRowsIndexes = [];

  rows.forEach((row, index) => {
    const expandableRowMarker = row.querySelectorAll('h4');
    if (expandableRowMarker.length === 0 || row.classList.contains('product-comparison-header')) {
      return;
    }

    row.classList.add('expandable-row');
    expandableRowsIndexes.push(index);
  });

  markHiddenRowsUnderExpandableRows(rows, expandableRowsIndexes);
  addArrowAndEventToExpandableRows(rows);
}

function setExpandableRows(block) {
  const rows = block.querySelectorAll('div[role="row"]');
  addClassesForExpandableRows(rows);
}

function addAccesibilityRoles(block) {
  block.setAttribute('role', 'table');

  block.querySelectorAll('div')
    .forEach((div) => {
      if (div.childElementCount > 1 && div.parentElement.getAttribute('role') === 'table') {
        div.setAttribute('role', 'row');
      } else if (!div.hasAttribute('role')) {
        div.setAttribute('role', 'cell');
      }
    });

  const header = block.querySelector('div > div');
  [...header.children].forEach((headerColumns) => {
    headerColumns.setAttribute('role', 'columnheader');
  });
}

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

function extractTextFromStrongTagToParent(element) {
  if (element.children.length > 0) {
    [...element.children].forEach((children) => {
      extractTextFromStrongTagToParent(children);
    });
  }

  if (element.tagName === 'STRONG' && element.parentElement) {
    element.parentElement.innerHTML = element.textContent;
  }
}

function buildTableHeader(block) {
  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');

  [...header.children].forEach((headerColumn) => {
    const buttonSection = headerColumn.querySelector('p.button-container');

    if (buttonSection) {
      const paragraphBefore = buttonSection.previousElementSibling;
      paragraphBefore?.classList.add('per-year-statement');
      const paragraphAfter = buttonSection.nextElementSibling;
      paragraphAfter?.classList.add('product-comparison-header-subtitle');
      paragraphAfter?.nextElementSibling.classList.add('product-comparison-header-subtitle');
    }
  });
}

function setBuyButtonsToPrimary(columnHeaders) {
  columnHeaders.forEach((columnHeader) => {
    columnHeader.querySelectorAll('.button-container')
      .forEach((button) => button.classList.add('red'));
  });
}

function setColumnsStyle(block) {
  const columnHeaders = block.querySelectorAll('div[role="columnheader"]');
  const numberOfProductHeaders = [...columnHeaders]
    .filter((columnHeader) => [...columnHeader.children].length > 1).length;

  if (numberOfProductHeaders > 2) {
    block.classList.add('with-fixed-width');
  } else {
    [...columnHeaders].forEach((columnHeader, index) => {
      if (index === 0) return;
      columnHeader.classList.add('column-fixed-width');
    });
  }
}

function setActiveColumn(block) {
  const columnHeaders = block.querySelectorAll('div[role="columnheader"]');

  const tableActiveColumn = [...columnHeaders]
    .findIndex((header) => header.innerHTML.includes('<strong>'));

  if (tableActiveColumn <= 0) {
    setBuyButtonsToPrimary(columnHeaders);
    return;
  }

  const rows = block.querySelectorAll('div[role="row"]');
  [...rows].forEach((row) => row.children[tableActiveColumn].classList.add('active'));
}

function setColumnWithPriceDisplayedAlsoBelow(block) {
  const columnHeaders = block.querySelectorAll('div[role="columnheader"]');
  const columnWithPriceBelow = [...columnHeaders]
    .findIndex((header) => header.innerHTML.includes('<em>'));

  if (columnWithPriceBelow <= 0) {
    return;
  }

  const rows = block.querySelectorAll('div[role="row"]');
  [...rows].forEach((row) => row.children[columnWithPriceBelow].classList.add('display-price-below'));
}

function removeNotNeededRoles(element) {
  element.removeAttribute('role');

  [...element.children].forEach((children) => {
    if (children.tagName === 'H3' || children.innerText.match(/devices/i)) {
      children.remove();
    }
  });
}

function addProductPriceBelowSelectedColumn(block) {
  const lastRow = block.querySelector('div[role="row"]:last-of-type');
  const copiedRow = lastRow.cloneNode(true);

  copiedRow.classList.add('product-comparison-last-row-with-prices');
  lastRow.after(copiedRow);
  [...copiedRow.children].forEach((cell, index) => {
    cell.innerHTML = '';
    if (cell.classList.contains('display-price-below')) {
      const headerRow = block.querySelector('div[role="row"]');
      if (headerRow) {
        const headerCellToCopy = headerRow.children[index];
        const copiedCell = headerCellToCopy.cloneNode(true);
        removeNotNeededRoles(copiedCell);
        cell.appendChild(copiedCell);
      }
    }
  });
}

export default function decorate(block) {
  addAccesibilityRoles(block);
  replaceTableTextToProperCheckmars(block);
  setExpandableRows(block);
  setColumnsStyle(block);
  setActiveColumn(block);
  setColumnWithPriceDisplayedAlsoBelow(block);
  buildTableHeader(block);
  if (block.querySelector('div[role="columnheader"] em')) {
    addProductPriceBelowSelectedColumn(block);
  }

  extractTextFromStrongTagToParent(block);
  const headerList = [...block.children[0].children].slice(1);
  const lastRowWithPrice = block.querySelector('.product-comparison-last-row-with-prices');
  [...headerList, lastRowWithPrice].forEach((item, idx) => {
    if (item) {
      renderNanoBlocks(item, undefined, idx, block);
    }
  });

  matchHeights(block, 'h3');
}
