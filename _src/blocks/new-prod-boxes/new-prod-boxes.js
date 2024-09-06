/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import { getMetadata, getBuyLinkCountryPrefix } from '../../scripts/utils/utils.js';

let dataLayerProducts = [];
async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears, buylink, billed, customLink) {
  const storeProduct = await storeOBJ.getProducts([new ProductInfo(prodName, 'consumer')]);
  const storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
  const price = storeOption.getPrice();
  const discountedPrice = storeOption.getDiscountedPrice();
  const discount = storeOption.getDiscount('valueWithCurrency');
  const buyLink = await storeOption.getStoreUrl();

  let product = {
    ID: storeOption.getAvangateId(),
    name: storeOption.getName(),
    devices: storeOption.getDevices(),
    subscription: storeOption.getSubscription('months'),
    version: storeOption.getSubscription('months') === 1 ? 'monthly' : 'yearly',
    basePrice: storeOption.getPrice('value'),
    discountValue: storeOption.getDiscount('value'),
    discountRate: storeOption.getDiscount('percentage'),
    currency: storeOption.getCurrency(),
    priceWithTax: storeOption.getDiscountedPrice('value') || storeOption.getPrice('value'),
  };
  dataLayerProducts.push(product);
  const priceElement = document.createElement('div');
  priceElement.classList.add('hero-aem__prices');
  priceElement.innerHTML = `
    <div class="hero-aem__price mt-3">
      <div>
          <span class="prod-oldprice">${price}</span>
          <span class="prod-save">${saveText} ${discount}<span class="save"></span></span>
      </div>
      <div class="newprice-container mt-2">
        <span class="prod-newprice">${discountedPrice}</span>
        <sup>${conditionText || ''}</sup>
      </div>
    </div>
    ${billed ? `<div class="billed">${billed.innerHTML}</div>` : ''}
    <a href="${customLink === 1 ? buylink.href : buyLink}" class="button primary">${buylink.text}</a>`;
  buylink.remove();
  return priceElement;
}

function dynamicBuyLink(buyLinkSelector, prodName, ProdUsers, prodYears, pid = null) {
  if (!buyLinkSelector) {
    return null;
  }

  const url = new URL(window.location.href);
  let buyLinkPid = pid;
  if (!buyLinkPid) {
    buyLinkPid = url.searchParams.get('pid') || getMetadata('pid');
  }
  if (!buyLinkPid) {
    buyLinkPid = '';
  }

  let buyLinkHref = new URL(`${getBuyLinkCountryPrefix()}/${prodName.trim()}/${ProdUsers}/${prodYears}/`);
  if (buyLinkPid) {
    buyLinkHref.searchParams.append('pid', buyLinkPid);
  }
  return buyLinkHref;
}
async function updateProductPrice(prodName, prodUsers, prodYears, pid = null, buyLinkSelector = null, billed = null, type = null, hideDecimals = null, perPrice = '') {
  try {
    const { fetchProduct, formatPrice } = await import('../../scripts/utils/utils.js');
    const product = await fetchProduct(prodName, `${prodUsers}u-${prodYears}y`, pid);
    const { price, discount } = product;
    const discountPercentage = Math.round((1 - discount.discounted_price / price) * 100);
    let oldPrice = price;
    let newPrice = discount.discounted_price;
    // eslint-disable-next-line no-param-reassign
    let updatedBuyLinkSelector = buyLinkSelector;
    if (updatedBuyLinkSelector) {
      updatedBuyLinkSelector.href = dynamicBuyLink(updatedBuyLinkSelector, prodName, prodUsers, prodYears, pid);
    }
    let priceElement = document.createElement('div');
    priceElement.classList.add('hero-aem__prices__box');

    let newPriceBilled = '';
    let newPriceListed = '';
    let prodVersion = 'monthly';

    if (!prodName.endsWith('m') && type === 'monthly') {
      newPrice = `${(parseInt(newPrice, 10) / 12)}`;
      prodVersion = 'yearly';
    }

    let adobeDataLayerProduct = {
      ID: product.platform_product_id,
      name: prodName.trim(),
      devices: product.variation.dimension_value,
      subscription: prodVersion,
      version: prodVersion,
      basePrice: price,
      discountValue: discount.discounted_price,
      discountRate: discountPercentage,
      currency: product.currency_label,
      priceWithTax: discount.discounted_price,
    };
    dataLayerProducts.push(adobeDataLayerProduct);

    oldPrice = formatPrice(oldPrice, product.currency_iso, product.region_id).replace('.00', '');
    if (hideDecimals === 'true') {
      newPriceBilled = formatPrice(product.discount.discounted_price, product.currency_iso, product.region_id).replace('.00', '');
      newPriceListed = formatPrice(newPrice, product.currency_iso, product.region_id).replace('.00', '');
    }

    priceElement.innerHTML = `
      <div class="hero-aem__price mt-3">
        <div>
          <span class="prod-oldprice">${oldPrice}</span>
          <span class="prod-save">${saveText} ${discountPercentage}%<span class="save"></span></span>
        </div>
        <div class="newprice-container mt-2">
          <span class="prod-newprice">${newPriceListed} ${perPrice && `<sup class="per-m">${perPrice.textContent.replace('0', '')}</sup>`}</span>
        </div>
        ${billed ? `<div class="billed">${billed.innerHTML.replace('0', `<span class="newprice-2">${newPriceBilled}</span>`)}</div>` : ''}
        <a href="${updatedBuyLinkSelector ? updatedBuyLinkSelector.href : ''}" class="button primary no-arrow">${updatedBuyLinkSelector ? updatedBuyLinkSelector.text : ''}</a>
      </div>`;
    return priceElement;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching product:', err);
  }
  return null;
}

function calculateAddOnCost(selector1, selector2) {
  if (!selector1 || !selector2) {
    return null;
  }

  // get only the number from the new price
  const numberRegex = /\d+(\.\d+)?/;

  const firstPriceString = selector1.textContent.match(numberRegex)[0];
  const firstPriceFloat = parseFloat(firstPriceString);

  const secondPriceString = selector2.textContent.match(numberRegex)[0];
  const secondPriceFloat = parseFloat(secondPriceString);
  const correctPrice = parseInt(secondPriceFloat - firstPriceFloat, 10);

  return correctPrice;
}

export default async function decorate(block, options) {
  const {
    // eslint-disable-next-line no-unused-vars
    products, familyProducts, monthlyProducts, priceType, pid, mainProduct,
    addOnProducts, addOnMonthlyProducts, type, hideDecimals,
  } = block.closest('.section').dataset;
  // if options exists, this means the component is being called from aem
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
  }

  const blockParent = block.closest('.section');
  blockParent.classList.add('we-container');
  blockParent.id = 'new-prod-boxes';

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
  let monthlyPriceBoxes = {};
  let yearlyPricesBoxes = {};
  let yearlyAddOnPricesBoxes = {};
  let monthlyAddOnPricesBoxes = {};
  if (combinedProducts.length) {
    await Promise.all([...block.children].map(async (prod, key) => {
      // eslint-disable-next-line no-unused-vars
      const mainTable = prod.querySelector('tbody');
      // eslint-disable-next-line no-unused-vars
      const [greenTag, title, blueTag, subtitle, radioButtons, perPrice, billed, buyLink, undeBuyLink, benefitsLists, billed2, buyLink2] = [...mainTable.querySelectorAll(':scope > tr')];
      const [prodName, prodUsers, prodYears] = combinedProducts[key].split('/');
      const [prodMonthlyName, prodMonthlyUsers, prodMonthlyYears] = monthlyPricesAsList ? monthlyPricesAsList[key].split('/') : [];
      let addOn = 0;
      const addOnProductsAsList = addOnProducts && addOnProducts.split(',');
      const addOnMonthlyProductsAsList = addOnMonthlyProducts && addOnMonthlyProducts.split(',');
      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = Array.from(featuresSet).map((table) => {
        const trList = Array.from(table.querySelectorAll('tr'));
        const liString = trList.map((tr) => {
          const tdList = Array.from(tr.querySelectorAll('td'));
          // Extract the content of the first <td> to be placed outside the <li>
          let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';
          // Extract the content of the second <td> (if present) inside a <span>
          const secondTdContent = tdList.length > 1 && tdList[1].textContent.trim() !== '' ? `<span class="white-pill-content">${tdList[1].innerHTML}</span>` : '';
          // Create the <li> combining the first and second td content
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
          // &lt reffers to '<' character
          if (firstTdContent.indexOf('&lt;pill') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
            liClass += ' has_arrow';
            firstTdContent = firstTdContent.replace('&lt;-', '');
          }

          // &lt reffers to '<' character
          if (firstTdContent.indexOf('&lt;-') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
            liClass += ' has_arrow';
            firstTdContent = firstTdContent.replace('&lt;-', '');
          }

          // &gt reffers to '>' character
          if (firstTdContent.indexOf('-&gt;') !== -1 || firstTdContent.indexOf('&gt;') !== -1) {
            liClass += ' has_arrow_right';
            firstTdContent = firstTdContent.replace('-&gt;', '<span class="arrow-right"></span>');
          }

          if (firstTdContent.indexOf('[checkmark]') !== -1) {
            firstTdContent = firstTdContent.replace('[checkmark]', '<span class="checkmark"></span>');
          }

          if (firstTdContent.indexOf('[add-on]') !== -1) {
            firstTdContent = firstTdContent.replace('[add-on]', '');
            addOn = 1;
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

      if (title.innerHTML.indexOf('href') !== -1) {
        title.innerHTML = `<a href="#" title="${title.innerText}">${title.querySelector('tr a').innerHTML}</a>`;
      }

      let buyLinkSelector = prod.querySelector('a[href*="#buylink"]');
      let customLink = 0;
      if (buyLinkSelector) {
        buyLinkSelector.classList.add('button', 'primary');
      } else {
        buyLinkSelector = buyLink.querySelector('a');
        customLink = 1;
      }

      let planSwitcher = document.createElement('div');
      if (radioButtons && monthlyProducts) {
        let leftRadio = radioButtons.querySelector('td:first-child')?.textContent;
        let rightRadio = radioButtons.querySelector('td:last-child')?.textContent;
        planSwitcher.classList.add('plan-switcher');
        planSwitcher.innerHTML = `
        <input type="radio" id="yearly-${prodName.trim()}" name="${key}-plan" value="${key}-yearly-${prodName.trim()}" checked>
        <label for="yearly-${prodName.trim()}" class="radio-label">${leftRadio}</label><br>
        <input type="radio" id="monthly-${prodMonthlyName.trim()}" name="${key}-plan" value="${key}-monthly-${prodMonthlyName.trim()}">
        <label for="monthly-${prodMonthlyName.trim()}" class='radio-label'>${rightRadio}</label>`;
      }
      let planSwitcher2 = document.createElement('div');
      if (addOn && addOnProductsAsList && addOnMonthlyProductsAsList) {
        // eslint-disable-next-line no-unused-vars
        const [addOnProdName, addOnProdUsers, addOnProdYears] = addOnProductsAsList[key].split('/');
        // eslint-disable-next-line no-unused-vars
        const [addOnProdMonthlyName, addOnProdMonthlyUsers, addOnProdMonthlyYears] = addOnMonthlyProductsAsList[key].split('/');
        let leftRadio = radioButtons.querySelector('td:first-child')?.textContent;
        let rightRadio = radioButtons.querySelector('td:last-child')?.textContent;
        planSwitcher2.classList.add('plan-switcher', 'addon');
        planSwitcher2.innerHTML = `
        <input type="radio" id="add-on-yearly-${addOnProdName.trim()}" name="${key}-add-on-plan" value="${key}-add-on-yearly-${addOnProdName.trim()}" checked>
        <label for="add-on-yearly-${addOnProdName.trim()}" class="radio-label">${leftRadio}</label><br>
        <input type="radio" id="add-on-monthly-${addOnProdMonthlyName.trim()}" name="${key}-add-on-plan" value="${key}-add-on-monthly-${addOnProdMonthlyName.trim()}">
        <label for="add-on-monthly-${addOnProdMonthlyName.trim()}" class='radio-label'>${rightRadio}</label>`;
      }

      let addOnPriceBox;
      // create the prices element based on where the component is being called from, aem of www-websites
      if (options) {
        await createPricesElement(options.store, '', 'Save', prodName, prodUsers, prodYears, buyLinkSelector, billed, customLink)
          .then((pricesBox) => {
            yearlyPricesBoxes[`${key}-yearly-${prodName.trim()}`] = pricesBox;
            prod.outerHTML = `
              <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'} ${key < productsAsList.length ? 'individual-box' : 'family-box'}">
                <div class="inner_prod_box">
                  ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
                  ${title.innerText.trim() ? `<h4>${title.innerHTML}</h4>` : ''}
                  ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
                  ${subtitle.innerText.trim() ? `<p class="subtitle">${subtitle.querySelector('td').innerHTML.trim()}</p>` : ''}

                  ${radioButtons ? planSwitcher.outerHTML : ''}

                  ${pricesBox.outerHTML}

                  ${buyLink.outerHTML}

                  ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}
                  <hr />
                  ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
                </div>
            </div>`;
          });
        if (monthlyProducts) {
          const montlyPriceBox = await createPricesElement(options.store, '', 'Save', prodMonthlyName, prodMonthlyUsers, prodMonthlyYears, buyLinkSelector, billed);
          monthlyPriceBoxes[`${key}-monthly-${prodMonthlyName.trim()}`] = montlyPriceBox;
        }
      } else {
        buyLink.querySelector('a').classList.add('button', 'primary', 'no-arrow');
        buyLink2?.querySelector('a')?.classList.add('button', 'primary', 'no-arrow');

        const prodBox = document.createElement('div');
        prodBox.innerHTML = `
          <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'} ${key < productsAsList.length ? 'individual-box' : 'family-box'}">
            <div class="inner_prod_box">
              ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
              ${title.innerText.trim() ? `<h4>${title.innerHTML}</h4>` : ''}
              ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
              ${subtitle.innerText.trim() ? `<p class="subtitle${subtitle.innerText.trim().split(/\s+/).length > 5 ? ' fixed_height' : ''}">${subtitle.innerText.trim()}</p>` : ''}
              <hr />
              ${radioButtons ? planSwitcher.outerHTML : ''}
              <div class="hero-aem__prices"></div>

              ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}
              <hr />
              ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
              <div class="add-on-product" style="display: none;">
                ${billed2 ? '<hr>' : ''}
                ${planSwitcher2.outerHTML ? planSwitcher2.outerHTML : ''}
                <div class="hero-aem__prices__addon"></div>
              </div>
            </div>
          </div>`;

        block.children[key].outerHTML = prodBox.innerHTML;
        let priceBox = await updateProductPrice(prodName, prodUsers, prodYears, pid, buyLink.querySelector('a'), billed, type, hideDecimals, perPrice);
        block.children[key].querySelector('.hero-aem__prices').appendChild(priceBox);
        yearlyPricesBoxes[`${key}-yearly-${prodName.trim()}`] = priceBox;

        if (monthlyProducts) {
          const montlyPriceBox = await updateProductPrice(prodMonthlyName, prodMonthlyUsers, prodMonthlyYears, pid, buyLink.querySelector('a'), billed, type, hideDecimals, perPrice);
          monthlyPriceBoxes[`${key}-monthly-${prodMonthlyName.trim()}`] = montlyPriceBox;
        }

        if (addOn && addOnMonthlyProductsAsList) {
          const [addOnProdMonthlyName, addOnProdMonthlyUsers, addOnProdMonthlyYears] = addOnMonthlyProductsAsList[key].split('/');
          let monthlyAddOnPriceBox = await updateProductPrice(addOnProdMonthlyName, addOnProdMonthlyUsers, addOnProdMonthlyYears, pid, buyLink2.querySelector('a'), billed2, type, hideDecimals, perPrice);
          monthlyAddOnPricesBoxes[`${key}-add-on-monthly-${addOnProdMonthlyName.trim()}`] = monthlyAddOnPriceBox;
        }

        if (addOn && addOnProductsAsList) {
          const [addOnProdName, addOnProdUsers, addOnProdYears] = addOnProductsAsList[key].split('/');
          addOnPriceBox = await updateProductPrice(addOnProdName, addOnProdUsers, addOnProdYears, pid, buyLink2.querySelector('a'), billed2, type, hideDecimals, perPrice);
          block.children[key].querySelector('.hero-aem__prices__addon').appendChild(addOnPriceBox);
          yearlyAddOnPricesBoxes[`${key}-add-on-yearly-${addOnProdName.trim()}`] = addOnPriceBox;
        }
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

        let addOnNewPrice = newLi.querySelector('.add-on-newprice');
        let newPriceSelector = block.children[key].querySelector('.prod-newprice');
        let addOnPriceSelector = addOnPriceBox.querySelector('.prod-newprice');

        const numberRegex = /\d+(\.\d+)?/;
        const addOnCost = calculateAddOnCost(newPriceSelector, addOnPriceSelector);

        let addOnOldPrice = newLi.querySelector('.add-on-oldprice');
        let addOnPercentSave = newLi.querySelector('.add-on-percent-save');
        addOnNewPrice.textContent = addOnPriceBox.querySelector('.prod-newprice').textContent.replace(numberRegex, addOnCost);
        addOnOldPrice.textContent = addOnPriceBox.querySelector('.prod-oldprice').textContent;
        addOnPercentSave.textContent = addOnPriceBox.querySelector('.prod-save').textContent;

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
    }));
  } else {
    block.innerHTML = `
    <div class="container-fluid">
      add some products
    </div>`;
  }

  if (monthlyProducts) {
    [...block.children].forEach((prod) => {
      let planSwitcher = prod.querySelector('.plan-switcher');
      planSwitcher.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('input', (event) => {
          let planType = event.target.value.split('-')[1];
          let priceBox = prod.querySelector('.hero-aem__prices');
          if (planType === 'monthly') {
            priceBox.innerHTML = '';
            priceBox.appendChild(monthlyPriceBoxes[event.target.value]);
          } else {
            priceBox.innerHTML = '';
            priceBox.appendChild(yearlyPricesBoxes[event.target.value]);
          }
        });
      });
    });
  }

  if (addOnProducts && addOnMonthlyProducts) {
    [...block.children].forEach((prod) => {
      let planSwitcher = prod.querySelector('.plan-switcher.addon');
      planSwitcher?.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('input', (event) => {
          let planType = event.target.value.split('-')[3];
          let priceBox = prod.querySelector('.hero-aem__prices__addon');
          if (planType === 'monthly') {
            priceBox.innerHTML = '';
            priceBox.appendChild(monthlyAddOnPricesBoxes[event.target.value]);
          } else {
            priceBox.innerHTML = '';
            priceBox.appendChild(yearlyAddOnPricesBoxes[event.target.value]);
          }
        });
      });
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
  if (!options && !isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/lib-franklin.js');
    decorateIcons(block.closest('.section'));
  }

  if (isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/utils/utils.js');
    decorateIcons(block.closest('.section'));
  }

  if (!isInLandingPages) {
    // dataLayer push with all the products
    window.adobeDataLayer.push({
      event: 'product loaded',
      product: {
        [mainProduct === 'false' ? 'all' : 'info']: dataLayerProducts,
      },
    });
  }

  // General function to match the height of elements based on a selector
  const matchHeights = (targetNode, selector) => {
    const resetHeights = () => {
      const elements = targetNode.querySelectorAll(selector);
      elements.forEach((element) => {
        element.style.minHeight = '';
      });
    };

    const adjustHeights = () => {
      if (window.innerWidth >= 768) {
        resetHeights();
        const elements = targetNode.querySelectorAll(selector);
        const elementsHeight = Array.from(elements).map((element) => element.offsetHeight);
        const maxHeight = Math.max(...elementsHeight);

        elements.forEach((element) => {
          element.style.minHeight = `${maxHeight}px`;
        });
      } else {
        resetHeights();
      }
    };

    const matchHeightsCallback = (mutationsList) => {
      Array.from(mutationsList).forEach((mutation) => {
        if (mutation.type === 'childList') {
          adjustHeights();
        }
      });
    };

    const observer = new MutationObserver(matchHeightsCallback);

    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }

    window.addEventListener('resize', () => {
      adjustHeights();
    });
  };

  matchHeights(block, '.subtitle');
  matchHeights(block, 'h2');
}
