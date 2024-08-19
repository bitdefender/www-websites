/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
let dataLayerProducts = [];
async function createPricesElement(storeOBJ, conditionText, saveText, product, buylink, bluePillText, underPriceText) {
  const [prodName, prodUsers, prodYears] = product.split('/');
  const storeProduct = await storeOBJ.getProducts([new ProductInfo(prodName, 'consumer')]);
  const storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
  const price = storeOption.getPrice();
  const discountedPrice = storeOption.getDiscountedPrice();
  const discount = storeOption.getDiscount('valueWithCurrency');
  const buyLink = await storeOption.getStoreUrl();

  let productToDataLayer = {
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
  dataLayerProducts.push(productToDataLayer);

  const priceElement = document.createElement('div');
  priceElement.classList.add('hero-aem__prices');
  priceElement.innerHTML = `
  ${bluePillText ? `<p class="hero-aem__pill">${bluePillText}</p>` : ''}
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
    <p class="hero-aem__underPriceText">${underPriceText || ''}</p>`;
  if (buylink) {
    buylink.href = buyLink;
  }
  return priceElement;
}

function createCardElementContainer(elements, mobileImage) {
  const cardElementContainer = document.createElement('div');
  cardElementContainer.classList.add('hero-aem__card');

  const cardElementText = document.createElement('div');
  cardElementText.classList.add('hero-aem__card-text');

  elements.forEach((sibling) => {
    if (mobileImage && sibling.contains(mobileImage)) {
      cardElementContainer.appendChild(sibling);
    } else {
      cardElementText.appendChild(sibling);
    }
  });

  cardElementContainer.appendChild(cardElementText);

  return cardElementContainer;
}

function getOperatingSystem(userAgent) {
  const systems = [
    ['Windows NT 10.0', 'Windows 10'],
    ['Windows NT 6.2', 'Windows 8'],
    ['Windows NT 6.1', 'Windows 7'],
    ['Windows NT 6.0', 'Windows Vista'],
    ['Windows NT 5.1', 'Windows XP'],
    ['Windows NT 5.0', 'Windows 2000'],
    ['X11', 'X11'],
    ['Linux', 'Linux'],
    ['Android', 'Android'],
    ['iPhone', 'iOS'],
    ['iPod', 'iOS'],
    ['iPad', 'iOS'],
    ['Mac', 'MacOS'],
  ];

  return systems.find(([substr]) => userAgent.includes(substr))?.[1] || 'Unknown';
}

function openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos, selector) {
  // Get user's operating system
  const { userAgent } = navigator;
  const userOS = getOperatingSystem(userAgent);
  // Open the appropriate URL based on the OS
  let openUrl;
  switch (userOS) {
    case 'MacOS':
      openUrl = urlMacos;
      break;
    case 'Windows 10':
    case 'Windows 8':
    case 'Windows 7':
    case 'Windows Vista':
    case 'Windows XP':
    case 'Windows 2000':
      openUrl = urlWindows;
      break;
    case 'Android':
      openUrl = urlAndroid;
      break;
    case 'iOS':
      openUrl = urlIos;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }
  if (openUrl) {
    selector.href = openUrl;
  }
}

function createDropdownElement(paragraph, dropdownTagText, buyLink, dropdownProducts, pricesContainers) {
  let dropdownItems = paragraph.textContent.slice(1, -1).split(',').map((item) => item.trim());
  console.log('1');
  // Remove the first item as it does not need to be worked on
  dropdownItems.shift();

  // Create a container for the dropdown
  let dropdownContainer = document.createElement('div');
  dropdownContainer.classList.add('custom-dropdown-container');

  if (dropdownTagText) {
    let dropdownTagElement = document.createElement('div');
    dropdownTagElement.classList.add('custom-dropdown-tag');
    dropdownTagElement.textContent = dropdownTagText;
    dropdownContainer.appendChild(dropdownTagElement);
  }

  // Create the dropdown element
  let dropdown = document.createElement('div');
  dropdown.classList.add('custom-dropdown');

  // Create the button element
  let dropdownButton = document.createElement('button');
  dropdownButton.classList.add('dropdown-button');
  // eslint-disable-next-line prefer-destructuring
  dropdownButton.textContent = dropdownItems[0];
  dropdown.appendChild(dropdownButton);

  // Create the options element
  let dropdownOptions = document.createElement('div');
  dropdownOptions.classList.add('dropdown-options');
  dropdown.appendChild(dropdownOptions);

  dropdownItems.forEach((item, idx) => {
    let dropdownItem = document.createElement('div');
    dropdownItem.classList.add('custom-dropdown-item');
    dropdownItem.textContent = item;
    dropdownItem.setAttribute('data-value', dropdownProducts[idx]);
    dropdownOptions.appendChild(dropdownItem);
  });

  dropdownContainer.appendChild(dropdown);
  paragraph.replaceWith(dropdownContainer);

  dropdownButton.addEventListener('click', () => {
    let option = dropdownOptions.style.display === 'block' ? 'none' : 'block';
    dropdownOptions.style.display = option;
    dropdownButton.classList.add('active');
  });

  const dropdownItemsNodes = dropdownOptions.querySelectorAll('.custom-dropdown-item');
  dropdownItemsNodes.forEach((item) => {
    console.log(item);
    item.addEventListener('click', function () {
      dropdownButton.textContent = this.textContent;
      dropdownOptions.style.display = 'none';
      dropdownButton.classList.remove('active');
      dropdownItemsNodes.forEach((i) => i.classList.remove('selected'));
      this.classList.add('selected');
      let priceBox = pricesContainers.get(item.getAttribute('data-value'));
      console.log(pricesContainers);
      console.log(priceBox);
      buyLink.parentElement.previousElementSibling.replaceWith(priceBox);
    });
  });

  // Close the dropdown if clicked outside
  // document.addEventListener('click', (event) => {
  //   if (!dropdown.contains(event.target)) {
  //     dropdownOptions.style.display = 'none';
  //     dropdownButton.classList.remove('active');
  //   }
  // });
}

async function createPricesWebsites(product, buyLink, bluePillText, saveText, underPriceText, conditionText) {
  const { fetchProduct } = await import('../../scripts/utils/utils.js');
  const [prodName, prodUsers, prodYears] = product.split('/');
  let oldPrice;
  let newPrice;
  let discountPercentage;
  let discountValue;
  let heroProduct = await fetchProduct(prodName, `${prodUsers}u-${prodYears}y`);
  console.log(heroProduct);

  discountPercentage = Math.round(
    (1 - (heroProduct.discount.discounted_price) / heroProduct.price) * 100,
  );

  oldPrice = heroProduct.price;
  newPrice = heroProduct.discount.discounted_price;
  discountValue = heroProduct.discount.discount_value;
  let currencyLabel = heroProduct.currency_label;
  const pricesBox = document.createElement('div');
  pricesBox.classList.add('hero-aem__prices');
  pricesBox.innerHTML = `
          ${bluePillText ? `<p class="hero-aem__pill">${bluePillText}</p>` : ''}
          <div class="hero-aem__price mt-3">
            <div>
                <span class="prod-oldprice">${oldPrice}${currencyLabel}</span>
                <span class="prod-save">${saveText} ${discountValue}${currencyLabel}<span class="save"></span></span>
            </div>
            <div class="newprice-container mt-2">
              <span class="prod-newprice">${newPrice}${currencyLabel}</span>
              <sup>${conditionText || ''}</sup>
            </div>
          </div>
          <p class="hero-aem__underPriceText">${underPriceText || ''}</p>`;
  buyLink.href = `https://www.bitdefender.com/site/Store/buy/${prodName}/${prodUsers}/${prodYears}/`;
  return pricesBox;
}

// Function to dispatch 'shadowDomLoaded' event
function dispatchShadowDomLoadedEvent() {
  const event = new CustomEvent('shadowDomLoaded', {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
  window.dispatchEvent(event);
}

export default async function decorate(block, options) {
  const {
    product, conditionText, saveText, MacOS, Windows, Android, IOS, mainProduct,
    alignContent, height, type, send2datalayer, underPriceText, bluePillText, dropdownTag,
    dropdownProducts,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    let blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
    if (type) blockParent.classList.add(type);
  }

  let [richText, mainDesktopImage, richTextCard, columnsCard] = block.children;

  let pricesContainers = new Map();
  let dropdownProductsArray = [];
  if (dropdownProducts) {
    dropdownProductsArray = dropdownProducts.split(',').map((item) => item.trim());
  }

  // Configuration for new elements
  richText.classList.add('hero-aem__card__desktop', 'col-md-6');
  if (alignContent === 'center') {
    richText.classList.add('hero-aem__card__desktop--center');
  }

  if (height) {
    // eslint-disable-next-line array-callback-return
    Array.from(block.children).map((child) => {
      child.style.maxHeight = `${height}px`;
    });
  }
  mainDesktopImage.classList.add('col-md-6');
  mainDesktopImage.children[0].classList.add('h-100');

  let mobileImage = block.querySelector('.hero-aem__card__desktop div > p > picture');
  if (mobileImage) {
    mobileImage.classList.add('hero-aem__mobile-image');
  } else {
    mobileImage = '';
  }

  // Get all the siblings after h1
  const cardElements = Array.from(block.querySelectorAll('h1 ~ *'));
  // Put the siblings in a new div and append it to the block
  const cardElementContainer = createCardElementContainer(cardElements, mobileImage);

  // Append the container after h1
  block.querySelector('h1').after(cardElementContainer);

  const desktopImage = block.querySelector('.hero-aem > div > div > picture');
  desktopImage.classList.add('hero-aem__desktop-image');

  const buyLink = block.querySelector('a[href*="buylink"]');

  if (product && options?.store) {
    createPricesElement(options.store, conditionText, saveText, product, buyLink, bluePillText, underPriceText)
      .then((pricesBox) => {
        // dataLayer push with all the products
        if (options && send2datalayer) {
          window.adobeDataLayer.push({
            event: 'product loaded',
            product: {
              [mainProduct === 'false' ? 'all' : 'info']: dataLayerProducts,
            },
          });
        }

        // If buyLink exists, apply styles and insert pricesBox
        if (buyLink) {
          buyLink.classList.add('button', 'primary');
          buyLink.parentNode.parentNode.insertBefore(pricesBox, buyLink.parentNode);
          pricesContainers.set(product, pricesBox);
          dispatchShadowDomLoadedEvent();
          return;
        }

        // If buyLink does not exist, apply styles to simpleLink
        const simpleLink = block.querySelector('.hero-aem__card-text a');
        if (simpleLink) {
          simpleLink.classList.add('button', 'primary');
          simpleLink.parentNode.parentNode.insertBefore(pricesBox, simpleLink.parentNode);
        }

        pricesContainers.set(product, pricesBox);
        dispatchShadowDomLoadedEvent();
      });

    if (product && dropdownProductsArray) {
      dropdownProductsArray.forEach((dropdownProduct) => {
        if (dropdownProduct !== product) {
          createPricesElement(options.store, conditionText, saveText, dropdownProduct, buyLink, bluePillText, underPriceText)
            .then((priceBox) => {
              pricesContainers.set(dropdownProduct, priceBox);
              console.log(pricesContainers);
            });
        }
      });
    }
  } else {
    // If there is no product, just add the button class and dispatch the event
    const simpleLink = block.querySelector('.hero-aem__card-text a');
    if (simpleLink) {
      simpleLink.classList.add('button', 'primary');
    }
    window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
      bubbles: true,
      composed: true, // This allows the event to cross the shadow DOM boundary
    });
  }

  if (product && !options) {
    let priceBox = await createPricesWebsites(product, buyLink, bluePillText, saveText, underPriceText, conditionText);
    buyLink.parentNode.parentNode.insertBefore(priceBox, buyLink.parentNode);

    pricesContainers.set(product, priceBox);
  }

  if (product && !options && dropdownProductsArray) {
    dropdownProductsArray.forEach((dropdownProduct) => {
      if (dropdownProduct !== product) {
        createPricesWebsites(dropdownProduct, buyLink, bluePillText, saveText, underPriceText, conditionText)
          .then((priceBox) => {
            pricesContainers.set(dropdownProduct, priceBox);
          });
      }
    });
  }

  let paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((paragraph) => {
    if (paragraph.textContent.toLowerCase().includes('dropdown')) {
      createDropdownElement(paragraph, dropdownTag, buyLink, dropdownProductsArray, pricesContainers);
    }
  });

  let breadcrumbTable = block.querySelector('table');

  if (breadcrumbTable && breadcrumbTable.textContent.includes('breadcrumb')) {
    breadcrumbTable.classList.add('hero-aem__breadcrumb');
    // delete the first row
    breadcrumbTable.deleteRow(0);
  }

  let freeDownloadButton = block.querySelector('a[href*="#free-download"]');
  if (freeDownloadButton) {
    freeDownloadButton.classList.add('button', 'free-download');
    openUrlForOs(MacOS, Windows, Android, IOS, freeDownloadButton);
  }

  if (columnsCard) {
    const columnsCardChildren = Array.from(columnsCard.children);
    const cardElement = document.createElement('div');
    cardElement.classList.add('aem-two-cards');
    // Determine the appropriate column width class based on the number of cards
    const columnWidthMdClass = columnsCardChildren.length === 2 ? 'col-md-6' : 'col-md-4';
    const columnWidthLgClass = columnsCardChildren.length === 2 ? 'col-lg-3' : 'col-lg-3';

    const columnCardsHtml = columnsCardChildren.map((col) => `
      <div class="col-12 ${columnWidthMdClass} ${columnWidthLgClass}">
        <div class="aem-two-cards_card">
          ${col.innerHTML}
        </div>
      </div>`).join('');

    cardElement.innerHTML = `
      <div class="row justify-space-between">
        <div class="col-lg-3">
          ${richTextCard.innerHTML}
        </div>
        ${columnCardsHtml}
      </div>
    `;

    block.appendChild(cardElement);
    richTextCard.innerHTML = '';
    columnsCardChildren.forEach((col) => col.remove());
  }

  let termsParagraph = block.querySelector('.hero-aem-container .hero-aem .hero-aem__card-text p:last-child');
  if (termsParagraph) {
    termsParagraph.classList.add('hero-aem__terms');
  }
}
