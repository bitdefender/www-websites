/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
let dataLayerProducts = [];
async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears, buylink, send2datalayer) {
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
    ${!send2datalayer ? '<p class="hero-aem__pill">Yearly - individual</p>' : ''}
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
    <p class="hero-aem__underPriceText">Protection for 5 PCs, Macs, tablets, or smartphones.<br> Windows® | macOS® | Android™ | iOS®</p>`;
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

// Function to dispatch 'shadowDomLoaded' event
function dispatchShadowDomLoadedEvent() {
  const event = new CustomEvent('shadowDomLoaded', {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
  window.dispatchEvent(event);
}

export default function decorate(block, options) {
  const {
    product, conditionText, saveText, MacOS, Windows, Android, IOS, mainProduct,
    alignContent, height, type, send2datalayer,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    let blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
    if (type) blockParent.classList.add(type);
  }

  let [richText, mainDesktopImage, richTextCard, columnsCard] = block.children;

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

  if (product && options?.store) {
    const [prodName, prodUsers, prodYears] = product.split('/');

    const buyLink = block.querySelector('a[href*="buylink"]');
    createPricesElement(options.store, conditionText, saveText, prodName, prodUsers, prodYears, buyLink, send2datalayer)
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
          dispatchShadowDomLoadedEvent();
          return;
        }

        // If buyLink does not exist, apply styles to simpleLink
        const simpleLink = block.querySelector('.hero-aem__card-text a');
        if (simpleLink) {
          simpleLink.classList.add('button', 'primary');
          simpleLink.parentNode.parentNode.insertBefore(pricesBox, simpleLink.parentNode);
        }

        dispatchShadowDomLoadedEvent();
      });
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
}
