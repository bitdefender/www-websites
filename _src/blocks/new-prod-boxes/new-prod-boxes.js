/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import {
  formatPrice,
  checkIfNotProductPage,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

/**
 * @param {HTMLElement} planSwitcher
 * @param {string} oldProdCode
 * @returns {string} -> the product code after creating the plan switcher
 * Used to handle cases when the default is not the first input in the plans switcher
 */
const updateProdCodePostPlansSwitcher = (planSwitcher, oldProdCode) => {
  const defaultPlan = planSwitcher?.querySelector('input[checked] + label');
  return defaultPlan ? defaultPlan.dataset.storeSetId : oldProdCode;
};

function setDiscountedPriceAttribute(type, prodName) {
  let priceAttribute = 'discounted||full';

  if (type === 'monthly') {
    priceAttribute = 'discounted-monthly||full-monthly';
    if (prodName.endsWith('m')) {
      priceAttribute = 'discounted||full';
    }
  }

  return priceAttribute;
}

async function updateProductPrice(prodName, saveText, buyLinkSelector = null, billed = null, type = null, perPrice = '') {
  let priceElement = document.createElement('div');
  let newPrice = document.createElement('span');

  let priceAttribute = setDiscountedPriceAttribute(type, prodName);
  newPrice.setAttribute('data-store-price', priceAttribute);
  newPrice.setAttribute('data-store-render', '');

  priceElement.innerHTML = `
      <div class="hero-aem__price mt-3">
        <div class="oldprice-container" data-store-hide="!it.option.price.discounted">
          <span class="prod-oldprice" data-store-render data-store-price="full"></span>
          <span class="prod-save">${saveText} <span data-store-render data-store-discount="percentage"></span> </span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice"> ${newPrice.outerHTML}  ${perPrice && `<sup class="per-m">${perPrice.textContent.replace('0', '')}</sup>`}</span>
        </div>
        ${billed ? `<div class="billed">${billed.innerHTML.replace('0', '<span class="newprice-2" data-store-render data-store-price="discounted||full"></span>')}</div>` : ''}
        <a data-store-render data-store-buy-link href="#" class="button primary no-arrow">${buyLinkSelector?.innerText}</a>
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
    let checked = '';
    let defaultCheck = radio.textContent.match(/\[checked\]/g);
    if (defaultCheck) {
      radioText = radioText.replace('[checked]', '');
      checked = 'checked';
    }

    if (productName) {
      planSwitcher.innerHTML += `
        <input type="radio" id="${plan}-${productName.trim()}" name="${cardNumber}-${variant}" value="${cardNumber}-${plan}-${productName.trim()}" ${checked}>
        <label data-store-action data-store-set-id="${productName}" data-store-set-devices="${prodUser}" data-store-set-subscription="${prodYear}" for="${plan}-${productName.trim()}" class="radio-label">${radioText}</label><br>
      `;
    }
  });

  const checkedPlan = planSwitcher.querySelectorAll('input[checked]');
  if (!checkedPlan && radioButtons.children) {
    const defaultPlanSwitcher = planSwitcher.querySelectorAll('input');
    defaultPlanSwitcher.setAttribute('checked', '');
    defaultPlanSwitcher.checked = true;
  }
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

/**
 * @param {HTMLElement} element
 * @param {Record<string, string>} attributes
 */
const setAttributes = (element, attributes) => {
  if (!element) {
    return;
  }

  Object.entries(attributes).forEach(([attr, value]) => {
    element.setAttribute(attr, value);
  });
};

/**
 * @param {HTMLElement} listElement
 * @param {string} saveText
 */
const configureAddOnListPrices = (listElement, saveText = 'Save ') => {
  if (!listElement) {
    return;
  }

  /**
   * @type {import('@repobit/dex-store-elements').OptionNode}
   */
  const optionInListElement = listElement.querySelector('bd-option');
  if (!optionInListElement) {
    return;
  }

  /**
   * @type {import('@repobit/dex-store-elements').OptionNode}
   */
  const optionInCardElement = listElement.closest('bd-option');
  if (optionInCardElement) {
    optionInListElement.updateComplete.then(() => {
      const discountedPriceInCard = optionInCardElement.option?.getDiscountedPrice({ currency: false });
      const discountedPriceInList = optionInListElement.option?.getDiscountedPrice({ currency: false });

      if (discountedPriceInCard && discountedPriceInList) {
        listElement.querySelector('.add-on-newprice').textContent = formatPrice(
          Math.abs(discountedPriceInList - discountedPriceInCard),
          optionInListElement.option.currency,
        );
      }
    });
  }

  setAttributes(listElement.querySelector('.add-on-oldprice'), {
    'data-store-price': 'full',
    'data-store-hide': '!it.option.price.discounted',
    'data-store-render': '',
  });

  const percentSaveElement = listElement.querySelector('.add-on-percent-save');
  percentSaveElement.textContent = `${saveText}{{=it.option.discount.percentage}}`;

  setAttributes(percentSaveElement, {
    'data-store-hide': '!it.option.price.discounted',
  });
};

/**
 * @param {HTMLElement} addOnProductElement
 */
const configureAddOnProductPrices = (addOnProductElement) => {
  if (!addOnProductElement) {
    return;
  }

  setAttributes(addOnProductElement.querySelector('.prod-newprice span'), {
    'data-store-price': 'discounted||full',
    'data-store-render': '',
  });

  const addOnOldPrice = addOnProductElement.querySelector('.prod-oldprice');
  if (addOnOldPrice?.parentElement) {
    addOnOldPrice.parentElement.setAttribute('data-store-hide', '!it.option.price.discounted');
  }

  setAttributes(addOnOldPrice, {
    'data-store-price': 'full',
    'data-store-render': '',
  });

  setAttributes(addOnProductElement.querySelector('.prod-save span'), {
    'data-store-discount': 'percentage',
    'data-store-render': '',
  });
};

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
    products, familyProducts, monthlyProducts,
    addOnProducts, addOnMonthlyProducts, type, thirdRadioButtonProducts, saveText, addonProductName,
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
  let switchCheckbox;
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

    switchCheckbox = switchBox?.querySelector('#switchCheckbox');
    // Add an event listener to the checkbox
    switchCheckbox.addEventListener('change', () => {
      if (switchCheckbox.checked) {
        let familyBoxes = block.querySelectorAll('.family-box');
        familyBoxes.forEach((box) => {
          box.style.display = 'grid';
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
          box.style.display = 'grid';
        });
      }
    });
  }

  const productsAsList = products && products.replaceAll(' ', '').split(',');
  const familyProductsAsList = familyProducts && familyProducts.replaceAll(' ', '').split(',');
  const combinedProducts = productsAsList.concat(familyProductsAsList);
  const monthlyPricesAsList = monthlyProducts && monthlyProducts.replaceAll(' ', '').split(',');
  const thirdRadioButtonProductsAsList = thirdRadioButtonProducts && thirdRadioButtonProducts.replaceAll(' ', '').split(',');
  const addOnProductsAsList = addOnProducts && addOnProducts.replaceAll(' ', '').split(',');
  const addOnProductsInitial = addOnProductsAsList && addOnProductsAsList.slice(0, productsAsList.length);
  const addOnMonthlyProductsAsList = addOnMonthlyProducts && addOnMonthlyProducts.replaceAll(' ', '').split(',');
  const billedTexts = [];

  if (productsAsList.length >= 5) {
    block.classList.add('five-cards');
  }

  if (combinedProducts.length) {
    [...block.children].map(async (prod, key) => {
      const mainTable = prod.querySelector('tbody');
      const [greenTag, title, blueTag, subtitle, radioButtons, perPrice, billed, buyLink, undeBuyLink, benefitsLists, billed2, buyLink2, subtitle2] = [...mainTable.querySelectorAll(':scope > tr')];
      let [prodName, prodUsers, prodYears] = combinedProducts[key].split('/');
      const [prodMonthlyName, prodMonthlyUsers, prodMonthlyYears] = monthlyPricesAsList ? monthlyPricesAsList[key].split('/') : [];
      const [prodThirdRadioButtonName, prodThirdRadioButtonUsers, prodThirdRadioButtonYears] = thirdRadioButtonProductsAsList ? thirdRadioButtonProductsAsList[key].split('/') : [];
      let [addOnProdName, addOnProdUsers, addOnProdYears] = addOnProductsAsList ? addOnProductsAsList[key].split('/') : [];
      const [addOnProdMonthlyName, addOnProdMonthlyUsers, addOnProdMonthlyYears] = addOnMonthlyProductsAsList ? addOnMonthlyProductsAsList[key].split('/') : [];
      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = createFeatureList(featuresSet);
      billedTexts.push(billed);
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

      // default billedText will be the first one
      let billedText = billed?.children[0];
      // default billed text changes if we have the [checked] flag in the planSwitcher
      Array.from(radioButtons?.children)?.forEach((radio, idx) => {
        if (radio.textContent.match(/\[checked\]/g)) {
          billedText = billed.children[idx];
        }
      });

      // set the store event on the component
      let storeEvent = 'info';
      if (checkIfNotProductPage()) {
        storeEvent = 'all';
      }
      const prodBox = document.createElement('div');

      let titleHTML = '';
      const hasAnchor = title.querySelector('a');
      if (title.textContent.trim()) {
        if (hasAnchor) {
          const anchorHref = hasAnchor.getAttribute('href');
          const refactorTitle = title.textContent.replace(/(Bitdefender)(?!\s*<br>)/i, '$1<br>');
          titleHTML = `<h4><a href="${anchorHref}" title="${title.textContent}">${refactorTitle}</a></h4>`;
        } else {
          titleHTML = `<h4>${title.innerHTML}</h4>`;
        }
      }

      const [alias, selector, btnText] = (undeBuyLink?.innerText || '').trim().split('|');
      let demoBtn = '';
      if (alias.trim() === 'popup') {
        demoBtn = `<span class="demoBtn" data-show="${selector}" onclick="document.querySelector('.${selector.replace(/\s+/g, '')}').style.display = 'block'">${btnText}</span>`;
      }

      const updatedProdName = updateProdCodePostPlansSwitcher(planSwitcher, prodName);
      const updatedAddonProdName = updateProdCodePostPlansSwitcher(planSwitcher2, addOnProdName);
      prodBox.innerHTML = `
          <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'}${greenTag.innerText.trim() === 'demo-box' ? ' demo-box' : ''} ${key < productsAsList.length ? 'individual-box' : 'family-box'}">
          <bd-context>
            <bd-product product-id="${updatedProdName}">
              <bd-option devices="${prodUsers}" subscription="${prodYears}"
                ${productsAsList.some((prodEntry) => prodEntry.includes(updatedProdName)) ? `data-layer-event="${storeEvent}"` : ''}>
                <div class="inner_prod_box">
                    ${greenTag.innerText.trim() && greenTag.innerText.trim() !== 'demo-box' ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
                    ${titleHTML}

                    <div class="blueTagsWrapper">${newBlueTag.innerText.trim() ? `${newBlueTag.innerHTML.trim()}` : ''}</div>
  ${(() => {
    const t = subtitle.innerText.trim();
    if (!t) return '';
    const fixed = t.split(/\s+/).length > 8 ? ' fixed_height' : '';
    const hasInvisibleTag = /<span[^>]*class="[^"]*\btag\b[^"]*\btag-dark-blue\b[^"]*"[^>]*>\s*Invisible\s*<\/span>/i.test(subtitle.innerHTML);
    const extra = hasInvisibleTag ? ' style="min-height:18px;visibility:hidden;pointer-events:none;" aria-hidden="true"' : '';
    return `<p class="subtitle${fixed}"${extra}>${subtitle.innerHTML}</p>`;
  })()}

                    <hr />
                    ${subtitle2?.innerText.trim() ? `<p class="subtitle-2${subtitle2.innerText.trim().split(/\s+/).length > 8 ? ' fixed_height' : ''}">${subtitle2.innerText.trim()}</p>` : ''}
                    ${radioButtons ? planSwitcher.outerHTML : ''}
                    <div class="hero-aem__prices await-loader"></div>
                    ${secondButton ? secondButton.outerHTML : ''}
                    ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${demoBtn !== '' ? demoBtn : undeBuyLink.innerHTML.trim()}</div>` : ''}
                    <hr />
                    ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
                    <div class="add-on-product" style="display: none;">
                      ${billed2 ? '<hr>' : ''}
                      ${planSwitcher2.outerHTML ? planSwitcher2.outerHTML : ''}
                      ${addonProductName ? `<h4>${addonProductName}</h4>` : ''}
                      <div class="hero-aem__prices__addon"></div>
                    </div>
                  </div>
                </bd-option>
              </bd-product>
            </bd-context>
          </div>`;
      block.children[key].outerHTML = prodBox.innerHTML;
      const blockChild = block.children[key];
      let priceBox = await updateProductPrice(updatedProdName, saveText, buyLink.querySelector('a'), billedText, type, perPrice);
      blockChild.querySelector('.hero-aem__prices').appendChild(priceBox);
      let addOnPriceBox;
      if (addOn && addOnProducts) {
        addOnPriceBox = await updateProductPrice(updatedAddonProdName, saveText, buyLink2.querySelector('a'), billed2, type, perPrice);
        blockChild.querySelector('.hero-aem__prices__addon').appendChild(addOnPriceBox);
      }

      const checkmark = blockChild.querySelector('.checkmark');
      if (checkmark) {
        const checkmarkList = checkmark.closest('ul');
        const listItem = checkmark.closest('li');
        if (!checkmarkList || !listItem) {
          return;
        }

        checkmarkList.classList.add('checkmark-list');
        listItem.removeChild(checkmark);

        const checkBox = document.createElement('input');
        checkBox.setAttribute('type', 'checkbox');
        checkBox.classList.add('checkmark');

        // rewrite the list element so flexbox can work
        const newLi = document.createElement('li');
        newLi.innerHTML = `
          ${checkBox.outerHTML}
          <div>${listItem.innerHTML}</div>`;
        listItem.replaceWith(newLi);

        wrapChildrenWithStoreContext(checkmarkList, {
          productId: updatedAddonProdName,
          devices: addOnProdUsers,
          subscription: addOnProdYears,
          ignoreEventsParent: true,
        });

        configureAddOnListPrices(
          checkmarkList,
          addOnPriceBox.querySelector('.prod-save').textContent,
        );

        let addOnStoreEvent = '';
        if (addOnProductsInitial && addOnProductsInitial.some((prodEntry) => prodEntry.includes(updatedAddonProdName))) {
          addOnStoreEvent = storeEvent;
        }

        const addOnProductElement = blockChild.querySelector('.add-on-product');
        wrapChildrenWithStoreContext(addOnProductElement, {
          productId: updatedAddonProdName,
          devices: addOnProdUsers,
          subscription: addOnProdYears,
          ignoreEventsParent: true,
          addOnStoreEvent,
        });

        configureAddOnProductPrices(addOnProductElement);

        const checkBoxSelector = newLi.querySelector('.checkmark');
        if (checkBoxSelector) {
          checkBoxSelector.addEventListener('change', () => {
            const isChecked = checkBoxSelector.checked;
            checkmarkList.classList.toggle('checked', isChecked);
            if (addOnProductElement) {
              addOnProductElement.style.display = isChecked ? 'block' : 'none';
            }
          });
        }
      }
    });
  }

  if (blockParent.classList.contains('show-more-show-less')) {
    const benefitsLists = block.querySelectorAll('.benefitsLists');
    const btnWrappers = [];
    let anchorButtons = document.querySelectorAll('.tabs-component .button');
    const allPlanSwitchers = block.querySelectorAll('.plan-switcher');

    benefitsLists.forEach((benefits) => {
      const btnWrapper = document.createElement('div');
      btnWrapper.className = 'show-more-btn-wrapper';

      const btn = document.createElement('button');
      btn.className = 'show-more-btn';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = blockParent.getAttribute('data-show-more');

      btnWrapper.appendChild(btn);
      benefits.insertAdjacentElement('beforebegin', btnWrapper);
      btnWrappers.push(btn);
    });

    btnWrappers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const shouldExpand = ![...benefitsLists][0].classList.contains('expanded');
        benefitsLists.forEach((benefits) => {
          benefits.classList.toggle('expanded', shouldExpand);
        });
        btnWrappers.forEach((btnWrapper) => {
          btnWrapper.textContent = shouldExpand ? blockParent.getAttribute('data-show-less') : blockParent.getAttribute('data-show-more');
          btnWrapper.className = shouldExpand ? 'show-less-btn' : 'show-more-btn';
          btnWrapper.setAttribute('aria-expanded', shouldExpand ? 'true' : 'false');
        });
      });
    });

    anchorButtons.forEach((anchorButton) => {
      anchorButton.addEventListener('click', () => {
        document.getElementById('switchCheckbox').checked = true;
        let familyBoxes = block.querySelectorAll('.family-box');
        familyBoxes.forEach((box) => {
          box.style.display = 'block';
        });
        let individualBoxes = block.querySelectorAll('.individual-box');
        individualBoxes.forEach((box) => {
          box.style.display = 'none';
        });
      });
    });

    allPlanSwitchers.forEach((switcher) => {
      const inputs = switcher.querySelectorAll('input');
      inputs.forEach((input, idx) => {
        input.addEventListener('change', () => {
          if (input.checked) {
            const box = switcher.closest('.prod_box');
            const isIndividual = box.classList.contains('individual-box');
            const isFamily = box.classList.contains('family-box');
            allPlanSwitchers.forEach((otherSwitcher) => {
              const otherBox = otherSwitcher.closest('.prod_box');
              if (
                (isIndividual && otherBox.classList.contains('individual-box'))
                || (isFamily && otherBox.classList.contains('family-box'))
              ) {
                const otherInputs = otherSwitcher.querySelectorAll('input');
                if (otherInputs[idx] && !otherInputs[idx].checked) {
                  otherInputs[idx].checked = true;
                  otherInputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
                  otherInputs[idx].dispatchEvent(new Event('click', { bubbles: true }));
                }
              }
            });
          }
        });
      });
    });
  }

  if (individualSwitchText && familySwitchText) {
    block.parentNode.insertBefore(switchBox, block);
  }

  // handling of the billedText below the price
  [...block.children].forEach((box, key) => {
    box.querySelectorAll('.plan-switcher input').forEach((radio, idx) => {
      radio.addEventListener('change', () => {
        let billedText = billedTexts[key].children[idx]?.innerHTML;
        if (billedText) {
          box.querySelector('.billed').innerHTML = billedText;
        }
      });
    });
  });

  window.hj = window.hj || function initHotjar(...args) {
    (hj.q = hj.q || []).push(...args);
  };
  hj('event', 'new-prod-boxes');

  // decorate icons if the component is being called from www-websites
  const isInLandingPages = window.location.href.includes('www-landing-pages') || window.location.href.includes('bitdefender.com/pages');
  if (!isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/lib-franklin.js');
    decorateIcons(block.closest('.section'));
  }

  /**
   * This error is needed in order to work. Please contact miordache@bitdefender.com if you want this fixed
   * Also don't forget to increment this counter if you tried fixing it and did not work: 2
   */
  switchCheckbox?.dispatchEvent(new Event('change'));
}
