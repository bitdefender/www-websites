/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import {
  openUrlForOs, createNanoBlock, renderNanoBlocks, createTag,
} from '../../scripts/utils/utils.js';

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

function createDropdownElement(paragraph, dropdownTagText, product) {
  let dropdownItems = paragraph.textContent.slice(1, -1).split(',').map((item) => item.trim());
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
    const [prodName, prodUsers, prodYears] = product[idx].split('/');
    dropdownItem.textContent = item;
    dropdownItem.setAttribute('data-store-click-set-product', '');
    dropdownItem.setAttribute('data-store-product-id', `${prodName}`);
    dropdownItem.setAttribute('data-store-product-option', `${prodUsers}-${prodYears}`);
    dropdownItem.setAttribute('data-store-product-department', 'consumer');
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
  dropdownItemsNodes.forEach((item, index) => {
    // eslint-disable-next-line func-names
    item.addEventListener('click', function () {
      dropdownButton.textContent = this.textContent;
      dropdownOptions.style.display = 'none';
      dropdownButton.classList.remove('active');
      dropdownItemsNodes.forEach((i) => i.classList.remove('selected'));
      this.classList.add('selected');
      const dex = document.querySelector('.dex-18076');

      if (dex) {
        const dropdownTag = dex.querySelector('.custom-dropdown-tag');
        const customDropdown = dex.querySelector('.custom-dropdown');

        if (index !== 0) {
          dropdownTag.style.display = 'none';
          customDropdown.style.marginTop = '24px';
        } else {
          dropdownTag.style.display = 'inline-block';
          customDropdown.style.marginTop = '0';
        }
      }
    });
  });

  // Close the dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      dropdownOptions.style.display = 'none';
      dropdownButton.classList.remove('active');
    }
  });
}

async function createPricesWebsites(buyLink, bluePillText, saveText, underPriceText, conditionText) {
  const pricesBox = document.createElement('div');
  pricesBox.classList.add('hero-aem__prices', 'await-loader');
  pricesBox.innerHTML = `
          ${bluePillText ? `<p class="hero-aem__pill">${bluePillText}</p>` : ''}
          <div class="hero-aem__price mt-3">
            <div>
                <span class="prod-oldprice" data-store-price="full"></span>
                <span class="prod-save" data-store-text-variable>${saveText} {DISCOUNT_VALUE}</span></span>
            </div>
            <div class="newprice-container mt-2">
              <span class="prod-newprice" data-store-price="discounted||full"></span>
              <sup>${conditionText || ''}</sup>
            </div>
          </div>
          <p class="hero-aem__underPriceText">${underPriceText || ''}</p>`;
  buyLink.setAttribute('data-store-buy-link', '');
  return pricesBox;
}

/**
 * Nanoblock representing the price conditions below the Price
 * @param text Conditions
 * @returns Root node of the nanoblock
 */
function renderDevicesUsersText(text) {
  return createTag(
    'div',
    {
      class: 'devices-years-text',
    },
    `<span>${text}</span>`,
  );
}

createNanoBlock('devices-users-text', renderDevicesUsersText);

export default async function decorate(block, options) {
  const {
    product, conditionText, saveText, MacOS, Windows, Android, IOS,
    alignContent, height, type, dropdownProducts, bluePillText, underPriceText,
    dropdownTag, circleDiscount,
  } = block.closest('.section').dataset;
  const isHomePage = window.location.pathname.split('/').filter((item) => item).length === 1;

  if (!isHomePage) {
    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    const contentWrapper = block.querySelector(':scope > div:first-child > div');
    if (contentWrapper) contentWrapper.prepend(breadcrumb);
  }
  renderNanoBlocks(block);

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

  if (circleDiscount) {
    const circleDiscountBox = document.createElement('div');
    circleDiscountBox.className = 'circleDiscount';
    circleDiscountBox.innerHTML = `<p>${circleDiscount.replace(
      /0\s*%/g,
      '<span data-store-text-variable>{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}</span>',
    )}</p>`;
    block.querySelector('.col-md-6:last-child').appendChild(circleDiscountBox);
  }

  // Get all the siblings after h1
  const cardElements = Array.from(block.querySelectorAll('h1 ~ *'));
  // Put the siblings in a new div and append it to the block
  const cardElementContainer = createCardElementContainer(cardElements, mobileImage);
  if (product) {
    const [prodName, prodUsers, prodYears] = product.split('/');
    cardElementContainer.setAttribute('data-store-context', '');
    cardElementContainer.setAttribute('data-store-id', prodName);
    cardElementContainer.setAttribute('data-store-option', `${prodUsers}-${prodYears}`);
    cardElementContainer.setAttribute('data-store-department', 'consumer');
    cardElementContainer.setAttribute('data-store-event', 'main-product-loaded');
  }
  // Append the container after h1
  block.querySelector('h1')?.after(cardElementContainer);

  const desktopImage = block.querySelector('.hero-aem > div > div > picture');
  desktopImage?.classList.add('hero-aem__desktop-image');

  const buyLink = block.querySelector('a[href*="buylink"]');

  if (product && !options) {
    let priceBox = await createPricesWebsites(buyLink, bluePillText, saveText, underPriceText, conditionText);
    // Select all paragraph elements
    const paragraphs = document.querySelectorAll('p');
    let insertPricesParagraph = null;

    // Iterate through the paragraphs
    paragraphs.forEach((paragraph) => {
      // Check if the paragraph contains the text <insert-prices>
      if (paragraph.textContent.includes('<insert-prices>')) {
        // Perform any additional actions here
        insertPricesParagraph = paragraph;
      }
    });

    if (insertPricesParagraph) {
      insertPricesParagraph.replaceWith(priceBox);
    } else {
      buyLink.parentNode.parentNode.insertBefore(priceBox, buyLink.parentNode);
    }

    pricesContainers.set(product, priceBox);
  }

  let paragraphs = block.querySelectorAll('p');
  paragraphs.forEach((paragraph) => {
    if (paragraph.textContent.toLowerCase().includes('dropdown')) {
      createDropdownElement(paragraph, dropdownTag, dropdownProductsArray);
    }
  });

  let breadcrumbTable = block.querySelector('table');

  if (breadcrumbTable && breadcrumbTable.textContent.includes('breadcrumb')) {
    breadcrumbTable.classList.add('hero-aem__breadcrumb');
    // delete the first row
    breadcrumbTable.deleteRow(0);
  }

  let tables = block.querySelectorAll('table');
  // eslint-disable-next-line no-restricted-syntax
  for (const listTable of tables) {
    if (listTable && listTable.textContent.includes('benefit_list')) {
      listTable.classList.add('benefit_list');
      // delete the first row
      listTable.deleteRow(0);
    }

    if (listTable && listTable.textContent.includes('ratings')) {
      listTable.classList.add('ratings');
      // delete the first row
      listTable.deleteRow(0);

      // Dynamically import the decorateButtons function, bugfix for landing page
      // eslint-disable-next-line no-await-in-loop
      const { decorateButtons } = await import('../../scripts/lib-franklin.js');
      decorateButtons(listTable);
      // listTable.querySelector('a').classList.add('button');
    }
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
