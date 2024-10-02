/* eslint-disable indent */
// import { decorateIcons } from '../../scripts/lib-franklin.js';
// import { fetchProduct } from '../../scripts/utils/utils.js';

/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */

let adobeDataLayerArray = [];
export default async function decorate(block, options) {
  const {
    pid, offtext, yearly, monthly, firstyear,
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
  const productCardsElement = parentNode.querySelector('.product-cards-ab'); // Get the container element
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

    productInfoDiv.innerHTML = `
      <h2>${heading}</h2>
      <div class="protect" bis_skin_checked="1">${protect}</div>
      <div class="product_area" bis_skin_checked="1">${productArea}</div>
      <div class="price-area" bis_skin_checked="1">
        <div class="tab-buttons" bis_skin_checked="1"></div>
        <div class="tab-content" bis_skin_checked="1"></div>
      </div>
      <div class="description" bis_skin_checked="1">${code}</div>
      <div class="buynow" bis_skin_checked="1">
      <a href="#" class="buy-button">${buyNowButton}</a></div>
      <div class="feature-list" bis_skin_checked="1">${featureList}</div>
    `;

    // Replace the table with the new div structure
    table.parentNode.replaceChild(productInfoDiv, table);

    const productsAsList = productArea.split(',');
    const tabButtons = productInfoDiv.querySelector('.price-area .tab-buttons');
    const tabContent = productInfoDiv.querySelector('.price-area .tab-content');

    // eslint-disable-next-line no-loop-func, no-await-in-loop
    await Promise.all(productsAsList.map(async (prod) => {
      const [prodName, prodUsers, prodYears] = prod.split('/');

      const button = document.createElement('button');
      button.classList.add('tab-button');
      button.setAttribute('data-tab', `${prodName}`);
      button.setAttribute('data-prodlink', `${prodName}/${prodUsers}/${prodYears}`);
      // button.textContent = `${prodName}`;
      tabButtons.appendChild(button);

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
      try {
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
        // add discount value to component title, only if it's not a monthly subscription
        // this is due to an a/b test and should be removed after the test is finished
        if (discountPercentage > globalDiscountPercentage && prodName !== 'psm' && prodName !== 'pspm') {
          globalDiscountPercentage = discountPercentage;
        }

        // tabbed code
        setTimeout(() => {
          const tabButton = productInfoDiv.querySelectorAll('.tab-button');
          const tabPanel = productInfoDiv.querySelectorAll('.tab-panel');
          const buybutton = productInfoDiv.querySelector('.buy-button');

          tabButton.forEach((buttonTab) => {
            buttonTab.addEventListener('click', () => {
              // Remove "active" class from all tab buttons
              tabButton.forEach((tabB) => {
                tabB.classList.remove('active');
              });

              // Add "active" class to the clicked tab button
              buttonTab.classList.add('active');

              // Hide all tab panels
              tabPanel.forEach((panel) => {
                panel.style.display = 'none';
              });

              // Show the selected tab panel
              const tabId = buttonTab.getAttribute('data-tab');
              const selectedPanel = parentNode.querySelector(`#${tabId}`);
              if (selectedPanel) {
                selectedPanel.style.display = 'block';
                // replace href with correct buy link
                const dataProdLink = buttonTab.dataset.prodlink;
                buybutton.href = `/site/Store/buy/${dataProdLink}/${pidLink}`;
              }
            });

            // Simulate click on the first tab button
            if (tabButton.length > 0) {
              tabButton[0].textContent = yearly;
              tabButton[1].textContent = monthly;
              tabButton[0].click();
            }
          });
        }, 500);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

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

  const discountXX = parentNode.querySelector('.product-cards-ab-container h3 strong em');
  const xx = document.createElement('em');
  xx.innerHTML = `${globalDiscountPercentage}%`;
  discountXX.replaceWith(xx);

  const elementsToRemove = block.querySelectorAll('.product_area');
  elementsToRemove.forEach((element) => {
    element.remove();
  });

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
