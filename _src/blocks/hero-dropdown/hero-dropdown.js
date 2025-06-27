/* eslint-disable max-len */
// Description: Hero Dropdown block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
} from '../../scripts/utils/utils.js';


/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} element The container element
 */
function buildHeroDropdownBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
  console.log(picture)
  const pictureParent = picture ? picture.parentNode : false;
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
     const section = document.querySelector('div.hero-dropdown');
     const subSection = document.querySelector('div.hero-dropdown div');
     subSection.classList.add('hero-dropdown-content');
 
     const isHomePage = window.location.pathname.split('/').filter((item) => item).length === 1;
 
     if (!isHomePage) {
       const breadcrumb = createTag('div', { class: 'breadcrumb' });
       document.querySelector('div.hero-dropdown div div:first-child').prepend(breadcrumb);
     }
 
     const pictureEl = document.createElement('div');
     pictureEl.classList.add('hero-dropdown-picture');
     pictureEl.append(picture);
     section.prepend(pictureEl);
 
     pictureParent.remove();
   }
  
}

createNanoBlock('dropdown', (...args) => {
  const block = args.find((arg) => arg instanceof HTMLElement);
  const raw = args
    .filter((arg) => typeof arg === 'string')
    .join(',');

  const products = raw.split(',').map((p) => p.trim());
  const root = document.createElement('div');
  root.classList.add('dropdown-products');

  const buyButtonText = block?.dataset.buybuttontext || 'Buy Now';
  const secondButtonText = block?.dataset.secondbuttontext;
  const secondButtonLink = block?.dataset.secondbuttonlink;
  
  const labelText = block?.dataset.label;
  const productNames = (block?.dataset.productnames || '')
    .split(',')
    .map((n) => n.trim());

  // Creează containerul dropdownului (div#prodSel)
  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.classList.add('prodSel');

  // Etichetă pentru dropdown, dacă există
  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', 'productSelector');
    labelEl.classList.add('bestValue');
    labelEl.textContent = labelText;
    dropdownWrapper.appendChild(labelEl);
  }

  // Dropdown <select>
  const select = document.createElement('select');

  select.classList.add('product-selector');
  dropdownWrapper.appendChild(select);
  root.appendChild(dropdownWrapper);

  products.forEach((prod, index) => {
    const [product, unit, year] = prod.split('/');
    const code = `${product}/${unit}/${year}`;
    const friendlyName = productNames[index] || product;

    // <option>
    const option = document.createElement('option');
    option.value = code;
    option.textContent = friendlyName;
    select.appendChild(option);

    // .price_box
    const newElement = document.createElement('div');
    newElement.classList.add('price_box');
    newElement.setAttribute('data-store-context', '');
    newElement.setAttribute('data-store-id', product);
    newElement.setAttribute('data-store-option', `${unit}-${year}`);
    newElement.setAttribute('data-store-department', 'consumer');
    newElement.setAttribute('data-store-event', 'product-loaded');
    newElement.setAttribute('data-store-hide', 'no-price=discounted;type=visibility');
    newElement.dataset.code = code;

    newElement.innerHTML = `
      <div class="discount">
        <div data-store-hide="no-price=discounted;type=visibility" class="price">
          <span class="old-price"><del data-store-price="full">$69.99</del></span>
        </div>
        <div data-store-hide="no-price=discounted;type=visibility" class="featured">
          <span data-store-text-variable="">Save 57%</span>
        </div>
      </div>
      <div class="price">
        <strong class="new-price">
          <strong data-store-price="discounted||full">$29.99</strong>
        </strong>
      </div>
      <div class="buttons">
        <a href="#" data-store-buy-link class="button primary-button">
          <span>${buyButtonText}</span>
        </a>
        ${secondButtonText && secondButtonLink ? `
          <a href="${secondButtonLink}" class="button secondary-button">
            <span>${secondButtonText}</span>
          </a>` : ''}
      </div>
    `;

    if (index !== 0) {
      newElement.style.display = 'none';
    }

    root.appendChild(newElement);
  });

  // Când utilizatorul schimbă selecția
  select.addEventListener('change', (e) => {
    const selected = e.target.value;
    root.querySelectorAll('.price_box').forEach((box) => {
      box.style.display = box.dataset.code === selected ? 'block' : 'none';
    });
  });

  return root;
});

async function renderDropdown(block) {
  await renderNanoBlocks(block);
}

export default function decorate(block) {
  const parentSection = block.closest('.section');
    const {
    signature,
    backgroundcolor,
    buybuttontext,
    secondbuttontext, 
    secondbuttonlink, 
    label,
    productnames
  } = parentSection.dataset;
  console.log("textul: " + productnames)
  const MetaData= parentSection.dataset;
  console.log(MetaData)

  if (backgroundcolor) {
  parentSection.style.backgroundColor = backgroundcolor;
  block.style.backgroundColor = backgroundcolor;
  }

  if (buybuttontext) {
  block.dataset.buybuttontext = buybuttontext;
  }

  if (secondbuttontext) {
  block.dataset.secondbuttontext = secondbuttontext;
  }

  if (secondbuttonlink) {
    block.dataset.secondbuttonlink = secondbuttonlink;
  }

  if (label) {
    block.dataset.label = label;
  }

  if (parentSection.dataset.productnames) {
  block.dataset.productnames = parentSection.dataset.productnames;
  }
  

  buildHeroDropdownBlock(block);
  renderDropdown(block);
}