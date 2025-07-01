/* eslint-disable max-len */
// Description: Hero Dropdown block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
} from '../../scripts/utils/utils.js';

function buildHeroDropdownBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
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
  const raw = args.filter((arg) => typeof arg === 'string').join(',');
  const products = raw.split(',').map((p) => p.trim());
  const root = document.createElement('div');
  root.classList.add('dropdown-products');

  const buyButtonText = block?.dataset.buybuttontext || 'Buy Now';
  const secondButtonText = block?.dataset.secondbuttontext;
  const secondButtonLink = block?.dataset.secondbuttonlink;
  const labelText = block?.dataset.label;
  const productNames = (block?.dataset.productnames || '').split(',').map((n) => n.trim());

  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.classList.add('prodSel');

  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', 'productSelector');
    labelEl.classList.add('bestValue');
    labelEl.textContent = labelText;
    dropdownWrapper.appendChild(labelEl);
  }

  const customDropdown = document.createElement('div');
  customDropdown.classList.add('custom-dropdown');

  const selectedOption = document.createElement('div');
  selectedOption.classList.add('selected-option');
  selectedOption.innerHTML = `
    <span class="selected-label">${productNames[0] || 'Select'}</span>
    <span class="dropdown-arrow"></span>
  `;

  const optionsList = document.createElement('div');
  optionsList.classList.add('options-list');

  products.forEach((prod, index) => {
    const [product, unit, year] = prod.split('/');
    const code = `${product}/${unit}/${year}`;
    const friendlyName = productNames[index] || product;

    const option = document.createElement('div');
    option.classList.add('custom-dropdown-item');
    option.setAttribute('data-value', code);
    option.textContent = friendlyName;
    if (index === 0) option.classList.add('active');
    optionsList.appendChild(option);

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
          <span class="button-text">${buyButtonText}</span>
        </a>
        ${secondButtonText && secondButtonLink ? `
          <a href="${secondButtonLink}" class="button secondary-button">
            <span class="button-text">${secondButtonText}</span>
          </a>` : ''}
      </div>
    `;

    if (index !== 0) {
      newElement.style.display = 'none';
    }

    root.appendChild(newElement);
  });

  customDropdown.appendChild(selectedOption);
  customDropdown.appendChild(optionsList);
  dropdownWrapper.appendChild(customDropdown);
  root.insertBefore(dropdownWrapper, root.firstChild);

  selectedOption.addEventListener('click', () => {
    optionsList.classList.toggle('open');
    selectedOption.classList.toggle('open');
    customDropdown.classList.toggle('open');
  });

  optionsList.querySelectorAll('.custom-dropdown-item').forEach((item) => {
    item.addEventListener('click', () => {
      const selected = item.getAttribute('data-value');
      const label = item.textContent;
      selectedOption.querySelector('.selected-label').textContent = label;
      optionsList.classList.remove('open');
      selectedOption.classList.remove('open');
      customDropdown.classList.remove('open');
      
      optionsList.querySelectorAll('.custom-dropdown-item').forEach((el) => {
        el.classList.remove('active');
      });
      item.classList.add('active');

      root.querySelectorAll('.price_box').forEach((box) => {
        box.style.display = box.dataset.code === selected ? 'block' : 'none';
      });
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
    backgroundcolor,
    innerbackgroundcolor,
    buybuttontext,
    secondbuttontext,
    secondbuttonlink,
    label,
    productnames,
  } = parentSection.dataset;

  if (backgroundcolor) {
    parentSection.style.backgroundColor = backgroundcolor;
  }

  if (innerbackgroundcolor) {
    block.style.backgroundColor = innerbackgroundcolor;
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

  if (productnames) {
    block.dataset.productnames = productnames;
  }

  buildHeroDropdownBlock(block);
  renderDropdown(block);
}