/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
let dataLayerProducts = [];
async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears, buylink, billed) {
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
    <a href="${buyLink}" class="button primary">${buylink.text}</a>`;
  buylink.remove();
  return priceElement;
}

export default async function decorate(block, options) {
  const {
    // eslint-disable-next-line no-unused-vars
    products, familyProducts, monthlyProducts, priceType, pid, mainProduct,
    hideProducts, addRichTextZone, margintop,
  } = options ? options.metadata : block.closest('.section').dataset;
  // if options exists, this means the component is being called from aem
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
  }
  const blockParent = block.closest('.section');
  blockParent.classList.add('we-container');

  if (margintop) {
    blockParent.style.marginTop = `${margintop}px`;
  }

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

  const productsAsList = products ? products.split(',') : [];
  const familyProductsAsList = familyProducts && familyProducts.split(',');
  const combinedProductsPreFilter = productsAsList.concat(familyProductsAsList);
  const monthlyPricesAsList = monthlyProducts && monthlyProducts.split(',');
  let monthlyPriceBoxes = {};
  let yearlyPricesBoxes = {};
  if (combinedProductsPreFilter.length) {
    const combinedProducts = combinedProductsPreFilter.filter(product => product && product.length > 0);
    if (combinedProducts.length) {
      await Promise.all([...block.children].map(async (prod, key) => {
        // eslint-disable-next-line no-unused-vars
        const [greenTag, title, blueTag, subtitle, radioButtons, richTextZone, billed, buyLink, undeBuyLink, benefitsLists, richText] = [...prod.querySelectorAll('div > div > table > tbody > tr')];
        const onSelectorClass = 'tsmd-10-1';
        const [prodName, prodUsers, prodYears] = combinedProducts[key].split('/');
        const [prodMonthlyName, prodMonthlyUsers, prodMonthlyYears] = monthlyPricesAsList ? monthlyPricesAsList[key].split('/') : [];
        const featuresSet = benefitsLists.querySelectorAll('table');
        const featureList = Array.from(featuresSet).map((table) => {
          const trList = Array.from(table.querySelectorAll('tr'));
          const liString = trList.map((tr) => {
            const tdList = Array.from(tr.querySelectorAll('td'));
            // Extract the content of the first <td> to be placed outside the <li>
            let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';
            // Extract the content of the second <td> (if present) inside a <span>
            const secondTdContent = tdList.length > 1 && tdList[1].textContent.trim() !== '' ? `<span>${tdList[1].innerHTML}</span>` : '';
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
            if (firstTdContent.indexOf('?info') !== -1) {
              let pillText = firstTdContent.match(/\?info/);
              let iconElement = firstTdContent.match(/<span class="[^"]*">(.*?)<\/span>/);
              if (pillText) {
                let icon = tdList[0].querySelector('span');
                const pillElement = document.createElement('span');
                pillElement.classList.add('info-pill');
                pillElement.innerHTML = `${iconElement ? iconElement[0] : ''}`;
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

            const liContent = `<li class="${liClass}">${firstTdContent}${secondTdContent}</li>`;

            return liContent;
          }).join(' ');

          return `<ul>${liString}</ul>`;
        });

        if (title.innerHTML.indexOf('href') !== -1) {
          title.innerHTML = `<a href="#" title="${title.innerText}" class="buylink-${onSelectorClass} await-loader prodload prodload-${onSelectorClass}">${title.querySelector('tr a').innerHTML}</a>`;
        }

        const buyLinkSelector = prod.querySelector('a[href*="#buylink"]');
        if (buyLinkSelector) {
          buyLinkSelector.classList.add('button', 'primary');
        }
        if (richText) {
          richText.querySelectorAll('a').forEach((link) => {
            link.classList.add('button', 'primary');
          });
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
        // create the prices element based on where the component is being called from, aem of www-websites
        if (options) {
          await createPricesElement(options.store, '', 'Save', prodName, prodUsers, prodYears, buyLinkSelector, billed)
            .then((pricesBox) => {
              yearlyPricesBoxes[`${key}-yearly-${prodName.trim()}`] = pricesBox;
              // buyLink.parentNode.parentNode.insertBefore(pricesBox, buyLink.parentNode);
              prod.outerHTML = `
                <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'} ${key < productsAsList.length ? 'individual-box' : 'family-box'}">
                  <div class="inner_prod_box">
                    ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
                    ${title.innerText.trim() ? `${title.tagName === 'h3' ? `${title.innerHTML}` : `<h2>${title.innerHTML}</h2>`}` : ''}
                    ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
                    ${subtitle.innerText.trim() ? `<p class="subtitle">${subtitle.querySelector('td').innerHTML.trim()}</p>` : ''}

                    ${radioButtons ? planSwitcher.outerHTML : ''}
                    ${addRichTextZone === 'true' ? `${richTextZone ? `<hr /> <div class="richTextArea">${richTextZone.innerHTML}</div>` : ''}` : ''}
                    ${hideProducts === 'true' ? '' : `
                      ${pricesBox.outerHTML}

                      ${buyLink.outerHTML}

                      ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}`}
                    <hr />
                    ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
                    ${richText ? `<hr /> <div class="richTextArea">${richText.outerHTML}</div>` : ''}
                  </div>
              </div>`;
            });
          if (monthlyProducts) {
            const montlyPriceBox = await createPricesElement(options.store, '', 'Save', prodMonthlyName, prodMonthlyUsers, prodMonthlyYears, buyLinkSelector, billed);
            monthlyPriceBoxes[`${key}-monthly-${prodMonthlyName.trim()}`] = montlyPriceBox;
          }
        } else {
          const { fetchProduct } = await import('../../scripts/utils/utils.js');
          let oldPrice;
          let newPrice;
          let discountPercentage;
          let priceElement = document.createElement('div');
          buyLink.querySelector('a').classList.add('button', 'primary', 'no-arrow');
          block.children[key].outerHTML = `
            <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'}">
              <div class="inner_prod_box">
                ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
                ${title.innerText.trim() ? `<h2>${title.innerHTML}</h2>` : ''}
                ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
                ${subtitle.innerText.trim() ? `<p class="subtitle${subtitle.innerText.trim().split(/\s+/).length > 5 ? ' fixed_height' : ''}">${subtitle.innerText.trim()}</p>` : ''}
                <hr />
                ${hideProducts === 'true' ? '' : `
                  <div class="price_box"></div>
                  ${billed ? `<div class="billed">${billed.innerHTML.replace('0', `<span class="newprice-${onSelectorClass}"></span>`)}</div>` : ''}

                  ${buyLink.innerHTML}

                  ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}`}
                <hr />
                ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
                ${richText ? `<hr /> <div class="richText">${richText.outerHTML}</div>` : ''}
              </div>
            </div>`;
          if (hideProducts !== 'true') {
            fetchProduct(prodName, `${prodUsers}u-${prodYears}y`, pid)
              .then((product) => {
                discountPercentage = Math.round(
                  (1 - (product.discount.discounted_price) / product.price) * 100,
                );
                oldPrice = product.price;
                newPrice = product.discount.discounted_price;
                let currencyLabel = product.currency_label;
                priceElement.classList.add('hero-aem__prices');
                priceElement.innerHTML = `
                <div class="hero-aem__price mt-3">
                  <div>
                      <span class="prod-oldprice">${oldPrice}${currencyLabel}</span>
                      <span class="prod-save">Save ${discountPercentage}%<span class="save"></span></span>
                  </div>
                  <div class="newprice-container mt-2">
                    <span class="prod-newprice">${newPrice}${currencyLabel}</span>

                  </div>
                </div>`;
                block.children[key].querySelector('.price_box').appendChild(priceElement);
              })
              .catch((err) => {
              // eslint-disable-next-line no-console
                console.error(err);
              });
          }
        }
      }));
    }
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

  if (individualSwitchText && familySwitchText) {
    block.parentNode.insertBefore(switchBox, block);
  }

  // dataLayer push with all the products
  if (options) {
    window.adobeDataLayer.push({
      event: 'product loaded',
      product: {
        [mainProduct === 'false' ? 'all' : 'info']: dataLayerProducts,
      },
    });
  }

  window.hj = window.hj || function initHotjar(...args) {
    (hj.q = hj.q || []).push(...args);
  };
  hj('event', 'new-prod-boxes-vsb');

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
