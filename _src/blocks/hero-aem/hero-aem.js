// const { loadPage } = await import('../../scripts/scripts.js');
// import { updateProductsList } from '../../scripts/utils.js';

function productAliases(name) {
  let newName = name.trim();
  if (newName === 'elite') {
    newName = 'elite_1000';
  } else if (newName === 'bs') {
    newName = 'bus-security';
  }

  return newName;
}

async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears) {
  let storeProduct = await storeOBJ.getProducts([new ProductInfo(prodName, "consumer")]);
  let storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
  let price = storeOption.getPrice();
  let discountedPrice = storeOption.getDiscountedPrice();

  const priceElement = document.createElement('div');
  priceElement.classList.add('hero-aem__prices');
  priceElement.innerHTML = `
    <div class="hero-aem__price mt-3">
      <div>
          <span class="prod-oldprice">${price}</span>
          <span class="prod-save">${saveText} <span class="save-${onSelectorClass}"></span></span>
      </div>
      <div class="newprice-container mt-2">
        <span class="prod-newprice">${discountedPrice}</span>
        <sup>${conditionText}</sup>
      </div>
    </div>`;
  return priceElement;
}

function createCardElementContainer(elements, mobileImage) {
  const cardElementContainer = document.createElement('div');
  cardElementContainer.classList.add('hero-aem__card');

  const cardElementText = document.createElement('div');
  cardElementText.classList.add('hero-aem__card-text');

  elements.forEach((sibling) => {
    if (sibling.contains(mobileImage)) {
      cardElementContainer.appendChild(sibling);
    } else {
      cardElementText.appendChild(sibling);
    }
  });

  cardElementContainer.appendChild(cardElementText);

  return cardElementContainer;
}

function decorateBuyLink(buyLink, onSelectorClass) {
  if (buyLink) {
    buyLink.classList.add('button', 'primary', `buylink-${onSelectorClass}`);
    buyLink.innerHTML = buyLink.innerHTML.replace(/0%/g, `<span class="percent-${onSelectorClass}">10%</span>`);
  }
}

export default function decorate(block, options) {
  const {
    product, conditionText, saveText,
  } = options.metadata;

  const aemContainer = block.children[0];
  aemContainer.classList.add('hero-aem-container');
  const underShadow = aemContainer.children[0];
  const [richText, mainDesktopImage] = underShadow.children;

  // Configuration for new elements
  richText.classList.add('hero-aem__card__desktop', 'col-md-6');
  mainDesktopImage.classList.add('col-md-6');

  const mobileImage = block.querySelector('.hero-aem > div > div picture');
  mobileImage.classList.add('hero-aem__mobile-image');

  // Get all the siblings after h1
  const cardElements = Array.from(block.querySelectorAll('h1 ~ *'));

  // Put the siblings in a new div and append it to the block
  const cardElementContainer = createCardElementContainer(cardElements, mobileImage);

  // Append the container after h1
  block.querySelector('h1').after(cardElementContainer);

  const desktopImage = block.querySelector('.hero-aem > div > div > picture');
  desktopImage.classList.add('hero-aem__desktop-image');

  if (product) {
    const [prodName, prodUsers, prodYears] = product.split('/');
    const onSelectorClass = `${productAliases(prodName)}-${prodUsers}${prodYears}`;

    // updateProductsList(product);

    const buyLink = block.querySelector('a[href*="#buylink"]');
    decorateBuyLink(buyLink, onSelectorClass);

    const pricesBox = createPricesElement(options.store, conditionText, saveText, prodName, prodUsers, prodYears);
    richText.appendChild(pricesBox);
  }

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
