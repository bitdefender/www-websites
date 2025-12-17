/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import { matchHeights } from '../../scripts/utils/utils.js';

function setDiscountedPriceAttribute(type, hideDecimals, prodName) {
  let priceAttribute = 'discounted||full';

  if (type === 'monthly') {
    priceAttribute = hideDecimals === 'true' ? 'discounted-monthly-no-decimal||full-monthly' : 'discounted-monthly||full-monthly';
    if (prodName.endsWith('m')) {
      priceAttribute = hideDecimals === 'true' ? 'discounted-no-decimal||full' : 'discounted||full';
    }
  }

  return priceAttribute;
}

async function updateProductPrice(prodName, saveText = null, buyLinkSelector = null, billed = null, type = null, hideDecimals = null, perPrice = '', key = null) {
  let priceElement = document.createElement('div');
  let newPrice = document.createElement('span');
  const customLink = buyLinkSelector.querySelector('a')?.getAttribute('href');
  let priceAttribute = setDiscountedPriceAttribute(type, hideDecimals, prodName);
  const savePriceEl = saveText ? saveText.replace('0%', '<span data-store-discount="percentage"></span>'): '';
  const billedText = billed?.innerHTML || '';
  newPrice.setAttribute('data-store-price', priceAttribute);

  let oldPrice = 'data-store-price="full"';
  let billedPrice = 'data-store-price="discounted||full"';
  if (hideDecimals === 'true') {
    oldPrice = 'data-store-price="full-no-decimal"';
    billedPrice = 'data-store-price="discounted-no-decimal||full-no-decimal"';
  }

  priceElement.innerHTML = `
    <div class="hero-aem__price mt-3">
      <div class="oldprice-container">
        <span class="prod-oldprice" ${oldPrice} data-store-hide="no-price=discounted"></span>
      </div>
      <div class="newprice-container mt-2">
        <span class="prod-newprice"> ${newPrice.outerHTML}  ${perPrice && `<sup class="per-m">${perPrice.textContent.replace('0', '')}</sup>`}</span>
        <span class="prod-save green-pill" data-store-hide="no-price=discounted">${savePriceEl}</span>
      </div>
      
      ${billedText.includes('0') ? `<div class="billed"> ${billedText.replace('0', `<span class="newprice-2" ${billedPrice}></span>`)}</div>` : ''}
      ${!billedText.includes('0') ? `<div class="billed">${billedText}</div>` : ''}

      <a ${customLink ? `href="${customLink}"` : 'href="#"'} href="#" data-store-buy-link class="button ${key === 0 ? 'primary' : ''} no-arrow">${buyLinkSelector?.innerText}</a>
    </div>`;
  return priceElement;
}

export default async function decorate(block) {
  const { products, savetext } = block.closest('.section').dataset;
  if (!products) return;

  const tables = block.querySelectorAll('table');
  const productList = products.split(',');

  for (const [key, table] of [...tables].entries()) {
    const rows = table.querySelectorAll('tr');
    const billed = rows[2];
    const priceRow = rows[3];
    if (!priceRow) continue;

    const productStr = productList[key];
    if (!productStr) continue;

    const [prodName, prodUsers, prodYears] = productStr.split('/');
    const name = prodName.trim();

    table.setAttribute('data-store-context', '');
    table.setAttribute('data-store-id', name);
    table.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
    table.setAttribute('data-store-department', 'consumer');
    table.querySelector('a[href*="#buylink"]')?.setAttribute('data-store-buy-link', '');

    const priceBox = await updateProductPrice(name, savetext, priceRow, billed, '', '' , '', key);
    priceRow.innerHTML = priceBox.innerHTML;

    if (billed.innerText) billed.innerText = '';

    // add icon on features:
    const allfeats = rows[rows.length - 1];
    allfeats.innerHTML = allfeats.innerHTML.replace(/\[yes\]/g, '<span class="yes-check"></span>').replace(/\[no\]/g, '<span class="no-check"></span>');

    matchHeights(block, 'table tr:nth-of-type(1)');
    matchHeights(block, 'table tr:nth-of-type(2)');
    matchHeights(block, 'table tr:nth-of-type(3)');
    matchHeights(block, 'table tr:nth-of-type(4)');
    matchHeights(block, 'table tr:nth-of-type(5)');
  }
}
