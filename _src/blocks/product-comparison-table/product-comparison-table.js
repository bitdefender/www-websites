import {
  createNanoBlock,
  renderNanoBlocks,
  matchHeights,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

createNanoBlock('priceComparison', (code, variant, label, block, productIndex, columnEl) => {
  const [devices, subscription] = variant.match(/\d+/g)?.map(Number) ?? [];
  wrapChildrenWithStoreContext(columnEl, {
    productId: code,
    devices,
    subscription,
    storeEvent: 'comparison',
    topologyBoundary: true,
  });

  const sectionDataset = block.closest('.section')?.dataset;
  const oldPriceText = sectionDataset?.old_price_text ?? '';
  const trialDuration = sectionDataset?.[`trialDuration${productIndex + 1}`] ?? sectionDataset?.trialDuration ?? '';
  const priceRoot = document.createElement('div');
  priceRoot.classList.add('product-comparison-price');

  const oldPriceElement = document.createElement('div');
  oldPriceElement.classList.add('old-price-container');
  oldPriceElement.innerHTML = `
    <div class="old-price-box" data-store-render data-store-hide="!it.option.price.discounted">
      <span>${oldPriceText} <del data-store-render data-store-price="full"></del></span>
    </div>`;

  const priceElement = document.createElement('strong');
  priceElement.classList.add('current-price-container');
  priceElement.innerHTML = `
    <div class="new-price-box">
      <span class="await-loader total-text" data-store-render data-store-price="discounted||full"> </span>
    </div>`;

  const priceAppliedOnTime = document.createElement('p');
  priceAppliedOnTime.classList.add('price-applied-on-time');
  priceAppliedOnTime.innerHTML = label;

  priceRoot.append(oldPriceElement, priceElement, priceAppliedOnTime);

  const buyLink = columnEl.querySelector('.button-container a');
  if (buyLink?.href.includes('/buy/') || buyLink?.href.includes('#buylink')) {
    buyLink.href = '#';
    buyLink.setAttribute('data-store-render', '');
    buyLink.setAttribute('data-store-buy-link', trialDuration || '');
  }

  return priceRoot;
});

function addAccessibilityRoles(block) {
  block.setAttribute('role', 'table');

  block.querySelectorAll('div').forEach((div) => {
    if (div.childElementCount > 1 && div.parentElement.getAttribute('role') === 'table') {
      div.setAttribute('role', 'row');
    } else if (!div.hasAttribute('role')) {
      div.setAttribute('role', 'cell');
    }
  });

  const header = block.querySelector('div > div');
  [...header.children].forEach((headerColumn) => {
    headerColumn.setAttribute('role', 'columnheader');
  });
}

function replaceYesNoWithIcons(block) {
  block.querySelectorAll('div[role="cell"]').forEach((cell) => {
    const text = cell.textContent.trim().toLowerCase();
    if (text !== 'yes' && text !== 'no') return;

    const icon = document.createElement('div');
    icon.classList.add(text === 'yes' ? 'yes-check' : 'no-check');
    cell.replaceChildren(icon);
  });
}

function buildTableHeader(block) {
  const header = block.querySelector('div > div');
  header.classList.add('product-comparison-header');
  [...header.children].forEach((headerColumn) => {
    // group the paragraphs between the product title and the price
    const paragraphs = [];
    let next = headerColumn.querySelector('h3')?.nextElementSibling;
    while (next && next.textContent.trim().toLowerCase() !== '{pricecomparison}') {
      if (next.tagName === 'P') paragraphs.push(next);
      next = next.nextElementSibling;
    }

    if (paragraphs.length > 0) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('paragraph-group');
      paragraphs[0].before(wrapper);
      wrapper.append(...paragraphs);
    }

    const buttonSection = headerColumn.querySelector('p.button-container');
    const subtitle = buttonSection?.nextElementSibling;
    subtitle?.classList.add('product-comparison-header-subtitle');
    subtitle?.nextElementSibling?.classList.add('product-comparison-header-subtitle');
  });
}

function setColumnsStyle(block) {
  const columnHeaders = [...block.querySelectorAll('div[role="columnheader"]')];
  const numberOfProductHeaders = columnHeaders
    .filter((columnHeader) => columnHeader.children.length > 1).length;

  if (numberOfProductHeaders > 2) return;

  columnHeaders.slice(1).forEach((columnHeader) => columnHeader.classList.add('column-fixed-width'));
}

// the authored column header markers are: <strong> = active column, <em> = price repeated below
function getColumnIndex(block, marker) {
  return [...block.querySelectorAll('div[role="columnheader"]')]
    .findIndex((header) => header.querySelector(marker));
}

function markColumn(block, columnIndex, className) {
  if (columnIndex <= 0) return;
  block.querySelectorAll('div[role="row"]')
    .forEach((row) => row.children[columnIndex].classList.add(className));
}

function addProductPriceBelowColumn(block, columnIndex) {
  const lastRow = block.querySelector('div[role="row"]:last-of-type');
  const priceRow = lastRow.cloneNode(true);
  priceRow.classList.add('product-comparison-last-row-with-prices');
  lastRow.after(priceRow);

  [...priceRow.children].forEach((cell, index) => {
    cell.innerHTML = '';
    if (index !== columnIndex) return;

    const headerCell = block.querySelector('div[role="row"]').children[index].cloneNode(true);
    headerCell.removeAttribute('role');
    headerCell.querySelector('h3')?.remove();
    cell.appendChild(headerCell);
  });
}

function unwrapStrongTags(block) {
  block.querySelectorAll('strong').forEach((strong) => {
    if (strong.parentElement) strong.parentElement.innerHTML = strong.textContent;
  });
}

export default function decorate(block) {
  addAccessibilityRoles(block);
  replaceYesNoWithIcons(block);
  setColumnsStyle(block);

  const activeColumn = getColumnIndex(block, 'strong');
  const priceBelowColumn = getColumnIndex(block, 'em');
  markColumn(block, activeColumn, 'active');
  markColumn(block, priceBelowColumn, 'display-price-below');

  buildTableHeader(block);
  if (priceBelowColumn > 0) {
    addProductPriceBelowColumn(block, priceBelowColumn);
  }

  unwrapStrongTags(block);
  const headerColumns = [...block.children[0].children].slice(1);
  const priceRow = block.querySelector('.product-comparison-last-row-with-prices');
  [...headerColumns, priceRow].forEach((item, idx) => {
    if (item) {
      renderNanoBlocks(item, undefined, idx, block);
    }
  });

  matchHeights(block, 'h3');
  matchHeights(block, '.paragraph-group');
  matchHeights(block, '.old-price-container');
  matchHeights(block, '.product-comparison-price');
  matchHeights(block, '.price-applied-on-time');
  matchHeights(block, '.button-container');
  matchHeights(block, 'div[role="columnheader"] p:first-of-type:not(:has(.tag))');
}
