/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import {
  checkIfNotProductPage,
} from '../../scripts/utils/utils.js';

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

async function updateProductPrice(prodName, saveText, buyLinkSelector = null, billed = null, type = null, hideDecimals = null, perPrice = '') {
  let priceElement = document.createElement('div');
  let newPrice = document.createElement('span');

  let priceAttribute = setDiscountedPriceAttribute(type, hideDecimals, prodName);
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
          <span class="prod-save" data-store-hide="no-price=discounted">${saveText} <span data-store-discount="percentage"></span> </span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice"> ${newPrice.outerHTML}  ${perPrice && `<sup class="per-m">${perPrice.textContent.replace('0', '')}</sup>`}</span>
        </div>
        ${billed ? `<div class="billed">${billed.innerHTML.replace('0', `<span class="newprice-2" ${billedPrice}></span>`)}</div>` : ''}
        <a data-store-buy-link href="#" class="button primary no-arrow">${buyLinkSelector?.innerText}</a>
      </div>`;
  return priceElement;
}

function createPlanSwitcher(radioButtons, cardNumber, prodsNames, prodsUsers, prodsYears, variant = 'default') {
  const planSwitcher = document.createElement('div');
  planSwitcher.classList.add('plan-switcher');

  let radioArray = ['yearly', 'monthly', '3-rd-button'];

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

export default async function decorate(block, onDataLoaded) {
  let structuredContent = await onDataLoaded;

  const {
    // eslint-disable-next-line no-unused-vars
    titles, descriptions, products, featured,
  } = structuredContent || block.closest('.section').dataset;

  const {
    // eslint-disable-next-line no-unused-vars
    familyProducts, monthlyProducts,
    type, hideDecimals, thirdRadioButtonProducts, saveText,
  } = block.closest('.section').dataset;

  const blockParent = block.closest('.section');
  blockParent.classList.add('we-container');

  let individualSwitchText;
  let familySwitchText;

  const productsAsList = products && products.replaceAll(' ', '').split(',');
  const familyProductsAsList = familyProducts && familyProducts.replaceAll(' ', '').split(',');
  const combinedProducts = productsAsList.concat(familyProductsAsList);
  const monthlyPricesAsList = monthlyProducts && monthlyProducts.replaceAll(' ', '').split(',');
  const thirdRadioButtonProductsAsList = thirdRadioButtonProducts && thirdRadioButtonProducts.replaceAll(' ', '').split(',');
  const billedTexts = [];

  if (productsAsList.length >= 5) {
    block.classList.add('five-cards');
  }

  if (combinedProducts.length) {
    [...block.children].map(async (prod, key) => {
      const mainTable = prod.querySelector('tbody');
      const [greenTag, title, blueTag, subtitle, radioButtons, perPrice, billed, buyLink, undeBuyLink, benefitsLists, billed2, buyLink2, subtitle2] = [...mainTable.querySelectorAll(':scope > tr')];
      const [prodName, prodUsers, prodYears] = combinedProducts[key].split('/');
      const [prodMonthlyName, prodMonthlyUsers, prodMonthlyYears] = monthlyPricesAsList ? monthlyPricesAsList[key].split('/') : [];
      const [prodThirdRadioButtonName, prodThirdRadioButtonUsers, prodThirdRadioButtonYears] = thirdRadioButtonProductsAsList ? thirdRadioButtonProductsAsList[key].split('/') : [];
      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = createFeatureList(featuresSet);
      billedTexts.push(billed);
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
      let storeEvent = 'main-product-loaded';
      if (checkIfNotProductPage()) {
        storeEvent = 'product-loaded';
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

      prodBox.innerHTML = `
          <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'}${greenTag.innerText.trim() === 'demo-box' ? ' demo-box' : ''} ${key < productsAsList.length ? 'individual-box' : 'family-box'}"
          data-store-context data-store-id="${prodName}" data-store-option="${prodUsers}-${prodYears}" data-store-department="consumer" ${productsAsList.some((prodEntry) => prodEntry.includes(prodName)) ? `data-store-event="${storeEvent}"` : ''}>
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
            </div>
          </div>`;
      block.children[key].outerHTML = prodBox.innerHTML;
      let priceBox = await updateProductPrice(prodName, saveText, buyLink.querySelector('a'), billedText, type, hideDecimals, perPrice);
      block.children[key].querySelector('.hero-aem__prices').appendChild(priceBox);
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
  hj('event', 'new-prod-boxes-sandbox');

  if (titles) {
    const titleElement = [...block.querySelectorAll('h4')];
    // eslint-disable-next-line no-restricted-syntax
    for (const [idx, title] of titles.entries()) {
      titleElement[idx].innerText = title.trim();
    }
  }

  if (descriptions) {
    const descriptionElement = [...block.querySelectorAll('p.subtitle-2')];
    // eslint-disable-next-line no-restricted-syntax
    for (const [idx, description] of descriptions.entries()) {
      descriptionElement[idx].innerText = description.trim();
    }
  }

  if (featured) {
    block.querySelector(`[data-store-id="${featured}"]`).style.border = '12px solid #0072CE';
  }
}
