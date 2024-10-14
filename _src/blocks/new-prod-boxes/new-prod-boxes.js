/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import {
  matchHeights, formatPrice,
} from '../../scripts/utils/utils.js';
import { Store, ProductInfo } from '../../scripts/libs/store/index.js';

let dataLayerProducts = [];

async function updateProductPrice(saveText, buyLinkSelector = null, billed = null, type = null, hideDecimals = null, perPrice = '') {
  let priceElement = document.createElement('div');
  let newPrice = document.createElement('span');
  if (type === 'monthly') {
    newPrice.setAttribute('data-store-price', 'discounted-monthly||full-monthly');
  } else {
    newPrice.setAttribute('data-store-price', 'discounted||full');
  }

  priceElement.innerHTML = `
      <div class="hero-aem__price mt-3">
        <div>
          <span class="prod-oldprice" data-store-price="full" data-store-hide="no-price=discounted"></span>
          <span class="prod-save" data-store-hide="no-price=discounted">${saveText} <span data-store-discount="percentage"></span> </span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice"> ${newPrice.outerHTML}  ${perPrice && `<sup class="per-m">${perPrice.textContent.replace('0', '')}</sup>`}</span>
        </div>
        ${billed ? `<div class="billed">${billed.innerHTML.replace('0', '<span class="newprice-2" data-store-price="discounted||full"></span>')}</div>` : ''}
        <a data-store-buy-link href="#" class="button primary no-arrow">${buyLinkSelector.innerText}</a>
      </div>`;
  return priceElement;
}

function createPlanSwitcher(radioButtons, cardNumber, prodsNames, prodsUsers, prodsYears, variant = 'default') {
  const planSwitcher = document.createElement('div');
  planSwitcher.classList.add('plan-switcher');
  planSwitcher.classList.toggle('addon', variant === 'addon');

  let radioArray = ['yearly', 'monthly', '3-rd-button'];
  if (variant === 'addon') {
    radioArray = ['add-on-yearly', 'add-on-monthly'];
  }

  Array.from(radioButtons.children).forEach((radio, idx) => {
    let radioText = radio.textContent;
    let plan = radioArray[idx];
    let productName = prodsNames[idx];
    let prodUser = prodsUsers[idx];
    let prodYear = prodsYears[idx];
    let checked = idx === 0 ? 'checked' : '';
    let defaultCheck = radio.textContent.match(/\[checked\]/g);
    if (defaultCheck) {
      radioText = radioText.replace('[checked]', '');
      checked = 'checked';
    }

    if (productName) {
      planSwitcher.innerHTML += `
        <input data-store-click-set-product data-store-product-id="${productName}" data-store-product-option="${prodUser}-${prodYear}" data-store-product-department="consumer" type="radio" id="${plan}-${productName.trim()}" name="${cardNumber}-${variant}" value="${cardNumber}-${plan}-${productName.trim()}" ${checked}>
        <label for="${plan}-${productName.trim()}" class="radio-label">${radioText}</label><br>
      `;
    }
  });

  return planSwitcher;
}

function createFeatureList(featuresSet) {
  return Array.from(featuresSet).map((table) => {
    const trList = Array.from(table.querySelectorAll('tr'));
    const liString = trList.map((tr) => {
      const tdList = Array.from(tr.querySelectorAll('td'));
      let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';
      const secondTdContent = tdList.length > 1 && tdList[1].textContent.trim() !== '' ? `<span class="white-pill-content">${tdList[1].innerHTML}</span>` : '';
      let liClass = '';

      if (firstTdContent === '') {
        liClass += 'd-none';
      }

      if (firstTdContent.indexOf('?pill') !== -1) {
        let pillText = firstTdContent.match(/\?pill (\w+)/);
        let iconElement = firstTdContent.match(/<span class="[^"]*">(.*?)<\/span>/);
        if (pillText) {
          let icon = tdList[0].querySelector('span');
          const pillElement = document.createElement('span');
          pillElement.classList.add('blue-pill');
          pillElement.innerHTML = `${pillText[1]}${iconElement ? iconElement[0] : ''}`;
          firstTdContent = firstTdContent.replace(pillText[0], `${pillElement.outerHTML}`);
          if (icon) {
            let count = 0;
            firstTdContent = firstTdContent.replace(new RegExp(icon.outerHTML, 'g'), (match) => {
              count += 1;
              return (count === 2) ? '' : match;
            });
          }
        }
      }

      if (firstTdContent.indexOf('&lt;pill') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
        liClass += ' has_arrow';
        firstTdContent = firstTdContent.replace('&lt;-', '');
      }

      if (firstTdContent.indexOf('-&gt;') !== -1 || firstTdContent.indexOf('&gt;') !== -1) {
        liClass += ' has_arrow_right';
        firstTdContent = firstTdContent.replace('-&gt;', '<span class="arrow-right"></span>');
      }

      if (firstTdContent.indexOf('[checkmark]') !== -1) {
        firstTdContent = firstTdContent.replace('[checkmark]', '<span class="checkmark"></span>');
      }

      if (firstTdContent.indexOf('[add-on]') !== -1) {
        firstTdContent = firstTdContent.replace('[add-on]', '');
      }

      if (firstTdContent.indexOf('&lt;&lt;add-on-newprice&gt;&gt;') !== -1) {
        firstTdContent = firstTdContent.replace('&lt;&lt;add-on-newprice&gt;&gt;', '<span class="add-on-newprice"></span>');
      }
      if (firstTdContent.indexOf('&lt;&lt;add-on-oldprice&gt;&gt;') !== -1) {
        firstTdContent = firstTdContent.replace('&lt;&lt;add-on-oldprice&gt;&gt;', '<span class="add-on-oldprice"></span>');
      }

      if (firstTdContent.indexOf('&lt;&lt;add-on-percent-save&gt;&gt;') !== -1) {
        firstTdContent = firstTdContent.replace('&lt;&lt;add-on-percent-save&gt;&gt;', '<span class="add-on-percent-save"></span>');
      }

      if (firstTdContent.indexOf('[[') !== -1) {
        firstTdContent = firstTdContent.replace('[[', '(');
      }

      if (firstTdContent.indexOf(']]') !== -1) {
        firstTdContent = firstTdContent.replace(']]', ')');
      }

      const liContent = `<li class="${liClass}">${firstTdContent}${secondTdContent}</li>`;
      return liContent;
    }).join(' ');

    return `<ul>${liString}</ul>`;
  });
}

// Function to check if content contains [add-on] text
function checkAddOn(featuresSet) {
  let addOn = false;
  // eslint-disable-next-line array-callback-return
  Array.from(featuresSet).map((table) => {
    const trList = Array.from(table.querySelectorAll('tr'));
    // eslint-disable-next-line array-callback-return
    trList.map((tr) => {
      const tdList = Array.from(tr.querySelectorAll('td'));
      let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';
      if (firstTdContent.indexOf('[add-on]') !== -1) {
        addOn = true;
      }
    });
  });

  return addOn;
}

export default async function decorate(block) {
  const {
    // eslint-disable-next-line no-unused-vars
    products, familyProducts, monthlyProducts, pid, mainProduct,
    addOnProducts, addOnMonthlyProducts, type, hideDecimals, thirdRadioButtonProducts, saveText, addonProductName,
  } = block.closest('.section').dataset;

  const blockParent = block.closest('.section');
  blockParent.classList.add('we-container');

  let defaultContentWrapperElements = block.closest('.section').querySelector('.default-content-wrapper')?.children;
  let individualSwitchText;
  let familySwitchText;
  if (defaultContentWrapperElements) {
    [...defaultContentWrapperElements].forEach((element) => {
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
  }

  let switchBox = document.createElement('div');
  if (individualSwitchText && familySwitchText) {
    switchBox.classList.add('switchBox');
    switchBox.innerHTML = `
      <label class="switch">
        <input type="checkbox" id="switchCheckbox">
        <span class="slider round">

        </span>
        <span class="label right">${individualSwitchText}</span>
        <span class="label left">${familySwitchText}</span>
      </label>
    `;

    // Get the checkbox inside the switchBox
    let switchCheckbox = switchBox.querySelector('#switchCheckbox');
    // Add an event listener to the checkbox
    switchCheckbox.addEventListener('change', () => {
      if (switchCheckbox.checked) {
        let familyBoxes = block.querySelectorAll('.family-box');
        familyBoxes.forEach((box) => {
          box.style.display = 'block';
        });

        let individualBoxes = block.querySelectorAll('.individual-box');
        individualBoxes.forEach((box) => {
          box.style.display = 'none';
        });
      } else {
        let familyBoxes = block.querySelectorAll('.family-box');
        familyBoxes.forEach((box) => {
          box.style.display = 'none';
        });

        let individualBoxes = block.querySelectorAll('.individual-box');
        individualBoxes.forEach((box) => {
          box.style.display = 'block';
        });
      }
    });
  }

  const productsAsList = products && products.split(',');
  const familyProductsAsList = familyProducts && familyProducts.split(',');
  const combinedProducts = productsAsList.concat(familyProductsAsList);
  const monthlyPricesAsList = monthlyProducts && monthlyProducts.split(',');
  const thirdRadioButtonProductsAsList = thirdRadioButtonProducts && thirdRadioButtonProducts.split(',');
  const addOnProductsAsList = addOnProducts && addOnProducts.split(',');
  const addOnMonthlyProductsAsList = addOnMonthlyProducts && addOnMonthlyProducts.split(',');

  if (combinedProducts.length) {
    [...block.children].map(async (prod, key) => {
      const mainTable = prod.querySelector('tbody');
      const [greenTag, title, blueTag, subtitle, radioButtons, perPrice, billed, buyLink, undeBuyLink, benefitsLists, billed2, buyLink2] = [...mainTable.querySelectorAll(':scope > tr')];
      const [prodName, prodUsers, prodYears] = combinedProducts[key].split('/');
      const [prodMonthlyName, prodMonthlyUsers, prodMonthlyYears] = monthlyPricesAsList ? monthlyPricesAsList[key].split('/') : [];
      const [prodThirdRadioButtonName, prodThirdRadioButtonUsers, prodThirdRadioButtonYears] = thirdRadioButtonProductsAsList ? thirdRadioButtonProductsAsList[key].split('/') : [];
      const [addOnProdName, addOnProdUsers, addOnProdYears] = addOnProductsAsList ? addOnProductsAsList[key].split('/') : [];
      const [addOnProdMonthlyName, addOnProdMonthlyUsers, addOnProdMonthlyYears] = addOnMonthlyProductsAsList ? addOnMonthlyProductsAsList[key].split('/') : [];
      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = createFeatureList(featuresSet);
      let addOn = checkAddOn(featuresSet);

      let buyLinkSelector = prod.querySelector('a[href*="#buylink"]');
      if (buyLinkSelector) {
        buyLinkSelector.classList.add('button', 'primary');
      } else {
        buyLinkSelector = buyLink.querySelector('a');
      }

      let planSwitcher = document.createElement('div');
      if (radioButtons && monthlyProducts) {
        let prodsNames = [prodName, prodMonthlyName, prodThirdRadioButtonName];
        let prodsUsers = [prodUsers, prodMonthlyUsers, prodThirdRadioButtonUsers];
        let prodsYears = [prodYears, prodMonthlyYears, prodThirdRadioButtonYears];
        planSwitcher = createPlanSwitcher(radioButtons, key, prodsNames, prodsUsers, prodsYears);
      }
      let planSwitcher2 = document.createElement('div');
      if (addOn && addOnProducts && addOnMonthlyProducts) {
        let prodsNames = [addOnProdName, addOnProdMonthlyName];
        let prodsUsers = [addOnProdUsers, addOnProdMonthlyUsers];
        let prodsYears = [addOnProdYears, addOnProdMonthlyYears];
        planSwitcher2 = createPlanSwitcher(radioButtons, key, prodsNames, prodsUsers, prodsYears, 'addon');
      }

      let newBlueTag = document.createElement('div');
      if (blueTag) {
        let blueTagChildren = blueTag.children;
        blueTagChildren = Array.from(blueTagChildren);
        blueTagChildren.forEach((child) => {
          // create a different blueTag element
          newBlueTag.innerHTML += `<div class="blueTag">${child.innerHTML}</div>`;
        });
      }

      let secondButton = buyLink?.querySelectorAll('a')[1];
      if (secondButton) {
        secondButton.classList.add('button', 'secondary', 'no-arrow');
      }

      const prodBox = document.createElement('div');
      prodBox.innerHTML = `
          <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'} ${key < productsAsList.length ? 'individual-box' : 'family-box'}" 
          data-store-context data-store-id="${prodName}" data-store-option="${prodUsers}-${prodYears}" data-store-department="consumer" data-store-event="main-product-loaded">
            <div class="inner_prod_box">
              ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
              ${title.innerText.trim() ? `<h4>${title.innerHTML}</h4>` : ''}

              <div class="blueTagsWrapper">${newBlueTag.innerText.trim() ? `${newBlueTag.innerHTML.trim()}` : ''}</div>
              ${subtitle.innerText.trim() ? `<p class="subtitle${subtitle.innerText.trim().split(/\s+/).length > 5 ? ' fixed_height' : ''}">${subtitle.innerText.trim()}</p>` : ''}
              <hr />
              ${radioButtons ? planSwitcher.outerHTML : ''}
              <div class="hero-aem__prices await-loader"></div>
              ${secondButton ? secondButton.outerHTML : ''}
              ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}
              <hr />
              ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
              <div class="add-on-product" style="display: none;">
                ${billed2 ? '<hr>' : ''}
                ${planSwitcher2.outerHTML ? planSwitcher2.outerHTML : ''}
                ${addonProductName ? `<h4>${addonProductName}</h4>` : ''}
                <div class="hero-aem__prices__addon"></div>
              </div>
            </div>
          </div>`;
      block.children[key].outerHTML = prodBox.innerHTML;
      let priceBox = await updateProductPrice(saveText, buyLink.querySelector('a'), billed, type, hideDecimals, perPrice);
      block.children[key].querySelector('.hero-aem__prices').appendChild(priceBox);

      let addOnPriceBox;
      if (addOn && addOnProducts) {
        addOnPriceBox = await updateProductPrice(saveText, buyLink2.querySelector('a'), billed2, type, hideDecimals, perPrice);
        block.children[key].querySelector('.hero-aem__prices__addon').appendChild(addOnPriceBox);
      }

      let checkmark = block.children[key].querySelector('.checkmark');
      if (checkmark) {
        let checkmarkList = checkmark.closest('ul');
        checkmarkList.classList.add('checkmark-list');

        let li = checkmark.closest('li');
        li.removeChild(checkmark);

        let checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.classList.add('checkmark');

        // rewrite the list element so flexbox can work
        let newLi = document.createElement('li');
        newLi.innerHTML = `
          ${checkBox.outerHTML}
          <div>${li.innerHTML}</div>`;
        li.replaceWith(newLi);

        block.children[key].querySelector('.add-on-product').setAttribute('data-store-context', '');
        block.children[key].querySelector('.add-on-product').setAttribute('data-store-id', addOnProdName);
        block.children[key].querySelector('.add-on-product').setAttribute('data-store-option', `${addOnProdUsers}-${addOnProdYears}`);
        block.children[key].querySelector('.add-on-product').setAttribute('data-store-department', 'consumer');
        block.children[key].querySelector('.add-on-product').setAttribute('data-store-event', 'main-product-loaded');

        let productObject = await Store.getProducts([new ProductInfo(prodName), new ProductInfo(addOnProdName)]);
        let product = productObject[prodName];
        let addOnProduct = productObject[addOnProdName];
        let addOnCost = addOnProduct.getOption(addOnProdUsers, addOnProdYears).getDiscountedPrice('value') - product.getOption(prodUsers, prodYears).getDiscountedPrice('value');
        addOnCost = formatPrice(addOnCost, product.getCurrency());

        let addOnNewPrice = newLi.querySelector('.add-on-newprice');
        addOnNewPrice.textContent = addOnCost;
        let addOnOldPrice = newLi.querySelector('.add-on-oldprice');
        addOnOldPrice.textContent = formatPrice(addOnProduct.getOption(addOnProdUsers, addOnProdYears).getPrice('value'), addOnProduct.getCurrency());
        let addOnPercentSave = newLi.querySelector('.add-on-percent-save');
        addOnPercentSave.textContent = `${addOnPriceBox.querySelector('.prod-save').textContent} ${addOnProduct.getOption(addOnProdUsers, addOnProdYears).getDiscount('percentageWithProcent')}`;

        let checkBoxSelector = newLi.querySelector('.checkmark');
        checkBoxSelector.addEventListener('change', () => {
          if (checkBoxSelector.checked) {
            checkmarkList.classList.add('checked');
            block.children[key].querySelector('.add-on-product').style.display = 'block';
          } else {
            checkmarkList.classList.remove('checked');
            block.children[key].querySelector('.add-on-product').style.display = 'none';
          }
        });
      }
    });
  }

  if (individualSwitchText && familySwitchText) {
    block.parentNode.insertBefore(switchBox, block);
  }

  window.hj = window.hj || function initHotjar(...args) {
    (hj.q = hj.q || []).push(...args);
  };
  hj('event', 'new-prod-boxes');

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });

  // decorate icons if the component is being called from www-websites
  const isInLandingPages = window.location.href.includes('www-landing-pages') || window.location.href.includes('bitdefender.com/pages');
  if (!isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/lib-franklin.js');
    decorateIcons(block.closest('.section'));
  }

  if (isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/utils/utils.js');
    // eslint-disable-next-line import/no-unresolved
    const { GLOBAL_EVENTS } = await import(`https://${window.location.hostname}/_src-lp/scripts/utils.js`);
    const { sendAnalyticsPageLoadedEvent } = await import(`https://${window.location.hostname}/_src-lp/scripts/adobeDataLayer.js`);
    decorateIcons(block.closest('.section'));

    document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, () => {
      window.adobeDataLayer.push({
        event: 'campaign product',
        product: {
          [mainProduct === 'false' ? 'all' : 'info']: dataLayerProducts,
        },
      });

      sendAnalyticsPageLoadedEvent(true);
    });
  }

  matchHeights(block, '.subtitle');
  matchHeights(block, 'h2');
  matchHeights(block, 'h4');
  matchHeights(block, '.plan-switcher');
  matchHeights(block, '.blueTagsWrapper');
}
