/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
let adobeDataLayerArray = [];
export default async function decorate(block, options) {
  const {
    // eslint-disable-next-line no-unused-vars
    pid, offtext, firstyear,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    let blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const firstRow = block.firstElementChild;
  const lastRow = block.lastElementChild;
  /* eslint-disable-next-line prefer-destructuring */
  const parentNode = block.parentNode; // Get the parent of the block
  if (firstRow && parentNode) {
    parentNode.insertBefore(firstRow, block); // Insert the first row before the block
  }
  if (lastRow && parentNode) {
    parentNode.appendChild(lastRow); // Insert the last row after the block
  }
  const productCardsElement = parentNode.querySelector('.solutions-cards-ab.block'); // Get the container element
  const tables = productCardsElement.querySelectorAll('table'); // Find all tables within the container

  let globalDiscountPercentage = 0;

  /* eslint-disable no-restricted-syntax */
  for (const table of tables) {
    // Create a new div to replace the table
    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('product-info');

    // Process and replace table content:
    const tableBody = table.querySelector('tbody'); // Get the table body

    // Handle remaining content (code, discount, buttons)
    const heading = tableBody.querySelector('tr:first-child td').innerHTML;
    const protect = tableBody.querySelector('tr:nth-child(2) td').innerHTML;
    const productArea = tableBody.querySelector('tr:nth-child(3) td').innerHTML;
    const code = tableBody.querySelector('tr:nth-child(4) td').innerHTML;
    const buyNowButton = tableBody.querySelector('tr:nth-child(5) td').innerText;
    const featureList = tableBody.querySelector('tr:nth-child(6) td').innerHTML;
    const learnMoreButton = tableBody.querySelector('tr:nth-child(7) td').innerHTML;

    productInfoDiv.innerHTML = `
      <h2>${heading}</h2>
      <div class="protect" bis_skin_checked="1">${protect}</div>
      <div class="product_area" bis_skin_checked="1">${productArea}</div>
      <div class="feature-list" bis_skin_checked="1">${featureList}</div>
      <div class="price-area" bis_skin_checked="1"></div>
      <div class="description" bis_skin_checked="1">${code}</div>
      <div class="buynow" bis_skin_checked="1">
      <a href="#" class="buy-button">${buyNowButton}</a></div>
      <div class="learnmore" bis_skin_checked="1">${learnMoreButton}</div>
    `;

    // Replace the table with the new div structure
    table.parentNode.replaceChild(productInfoDiv, table);

    const productsAsList = productArea.split(',');
    const tabContent = productInfoDiv.querySelector('.price-area');

    // eslint-disable-next-line no-loop-func, no-await-in-loop
    await Promise.all(productsAsList.map(async (prod) => {
      const [prodName, prodUsers, prodYears] = prod.split('/');
      const { fetchProduct } = await import('../../scripts/utils/utils.js');

      let oldPrice;
      let newPrice;
      let discountPercentage;

      // build pid for link
      let pidLink = '';
      if (pid.length) {
        pidLink = `pid.${pid}`;
      }

      const tab = document.createElement('div');
      tab.classList.add('tab-panel');
      tab.setAttribute('id', `${prodName}`);

      const product = await fetchProduct(prodName, `${prodUsers}u-${prodYears}y`, pid);
      discountPercentage = Math.round(
        (1 - (product.discount.discounted_price) / product.price) * 100,
      );
      oldPrice = product.price;
      newPrice = product.discount.discounted_price;
      let currencyLabel = product.currency_label;
      tab.innerHTML = `
            <div>
                <span class="prod-oldprice">${currencyLabel}${oldPrice}</span>
                <span class="prod-save">${discountPercentage}% ${offtext}</span>
            </div>
            <div>
              <span class="prod-newprice">${currencyLabel}${newPrice}</span><span>/ ${firstyear}</span>
            </div>`;
      tabContent.appendChild(tab);

      // add discount value to component title
      if (discountPercentage > globalDiscountPercentage) {
        globalDiscountPercentage = discountPercentage;
      }

      // replace href with correct buy link
      const buybutton = productInfoDiv.querySelector('.buy-button');
      buybutton.href = `/site/Store/buy/${prodName}/${prodUsers}/${prodYears}/${pidLink}`;

      if (options) {
        const storeProduct = await options.store.getProducts([new ProductInfo(prodName, 'consumer')]);
        const storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
        if (!storeOption.getName().includes('Monthly')) {
          adobeDataLayerArray.push({
            info: {
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
            },
          });
        }
      }
    }));
  }

  const elementsToRemove = block.querySelectorAll('.product_area');
  elementsToRemove.forEach((element) => {
    element.remove();
  });

  if (options) {
    window.addEventListener('codeBaseFinishedRunning', () => {
      const allProducts = window.adobeDataLayer.find((productEvent) => productEvent.event === 'product all');
      if (allProducts) {
        const allProductsJson = JSON.parse(JSON.stringify(allProducts));
        allProductsJson.all = allProductsJson.all.filter((product) => product.info.name !== 'Bitdefender Premium Security' && product.info.name !== 'Bitdefender Premium Security Plus');
        allProductsJson.all = allProductsJson.all.concat(adobeDataLayerArray);

        window.adobeDataLayer.push({
          all: null,
        });

        window.adobeDataLayer.push(allProductsJson);
      }
    });
  }

  const discountXX = parentNode.querySelector('.solutions-cards-ab-wrapper h3 strong em');
  const xx = document.createElement('em');
  xx.innerHTML = `${globalDiscountPercentage}%`;
  discountXX.replaceWith(xx);

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
