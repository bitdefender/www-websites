/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears, buylink) {
  const storeProduct = await storeOBJ.getProducts([new ProductInfo(prodName, "consumer")]);
  const storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
  const price = storeOption.getPrice();
  const discountedPrice = storeOption.getDiscountedPrice();
  const discount = storeOption.getDiscount("valueWithCurrency");
  const buyLink = await storeOption.getStoreUrl();
  window.adobeDataLayer.push({
    event: "product loaded",
    product: [{info : {
      ID: storeOption.getAvangateId(),
      name: storeOption.getName(),
      devices: storeOption.getDevices(),
      subscription: storeOption.getSubscription("months"),
      version: storeOption.getSubscription("months") === 1 ? "monthly" : "yearly",
      basePrice: storeOption.getPrice("value"),
      discountValue: storeOption.getDiscount("value"),
      discountRate: storeOption.getDiscount("percentage"),
      currency: storeOption.getCurrency(),
      priceWithTax: storeOption.getDiscountedPrice("value") || storeOption.getPrice("value"),
    }}]
  })
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
        <sup>${conditionText}</sup>
      </div>
    </div>`;
  buylink.href = buyLink;
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

export default function decorate(block, options) {
  const {
    product, conditionText, saveText,
  } = options.metadata;

  const aemContainer = block.children[1];
  aemContainer.classList.add('hero-aem-container');
  aemContainer.classList.add('we-container');
  const underShadow = aemContainer.children[0];
  let [richText, mainDesktopImage, richTextCard, columnsCard] = underShadow.children;

  // Configuration for new elements
  richText.classList.add('hero-aem__card__desktop', 'col-md-6');
  mainDesktopImage.classList.add('col-md-6');
  mainDesktopImage.children[0].classList.add("h-100");
  
  const mobileImage = block.querySelector('.hero-aem__card__desktop div > p > picture');
  mobileImage.classList.add('hero-aem__mobile-image');

  // Get all the siblings after h1
  const cardElements = Array.from(underShadow.querySelectorAll('h1 ~ *'));
  // Put the siblings in a new div and append it to the block
  const cardElementContainer = createCardElementContainer(cardElements, mobileImage);

  // Append the container after h1
  block.querySelector('h1').after(cardElementContainer);

  const desktopImage = block.querySelector('.hero-aem > div > div > picture');
  desktopImage.classList.add('hero-aem__desktop-image');

  if (product) {
    const [prodName, prodUsers, prodYears] = product.split('/');

    const buyLink = block.querySelector('a[href*="#buylink"]');
    buyLink.classList.add('button', 'primary');

    createPricesElement(options.store, conditionText, saveText, prodName, prodUsers, prodYears, buyLink)
    .then(pricesBox => {
      buyLink.parentNode.parentNode.insertBefore(pricesBox, buyLink.parentNode);
      window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
        bubbles: true,
        composed: true, // This allows the event to cross the shadow DOM boundary
      });
    })
  } else {
    // If there is no product, just add the button class and dispatch the event
    const simpleLink = block.querySelector('.hero-aem__card-text a');
    simpleLink.classList.add('button', 'primary');
    window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
      bubbles: true,
      composed: true, // This allows the event to cross the shadow DOM boundary
    });
  }

  columnsCard = [...columnsCard.children];
  const cardElement = document.createElement('div');
  cardElement.classList.add('aem-two-cards');
  cardElement.innerHTML = `
    <div class="row justify-space-between">
      <div class="col-lg-6">
        ${richTextCard.innerHTML}
      </div>
      ${columnsCard.map((col) => `
        <div class="col-12 col-md-6 col-lg-3">
          <div class="aem-two-cards_card">
            ${col.innerHTML}
          </div>
        </div>`).join('')}
    </div>
  `;
  aemContainer.appendChild(cardElement);
  richTextCard.innerHTML = '';
  columnsCard.forEach((col) => col.remove());
  
}
