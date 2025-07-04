/* eslint-disable max-len */
// Description: Hero Dropdown block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
} from '../../scripts/utils/utils.js';

function buildHeroDropdownBlock(element) {
  const picture = element.querySelector('picture');
  const pictureParent = picture?.parentNode;

  if (!picture) return;

  const section = element.closest('div.hero-dropdown');
  const subSection = section.querySelector('div');
  subSection.classList.add('hero-dropdown-content');

  const isHomePage = window.location.pathname.split('/').filter((item) => item).length === 1;

  if (!isHomePage) {
    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    const contentWrapper = subSection.querySelector('div:first-child');
    if (contentWrapper) contentWrapper.prepend(breadcrumb);
  }

  const pictureEl = document.createElement('div');
  pictureEl.classList.add('hero-dropdown-picture');
  pictureEl.append(picture);
  section.prepend(pictureEl);

  if (pictureParent) pictureParent.remove();
}

function createDropdownItem(code, friendlyName, isActive) {
  const item = document.createElement('div');
  item.classList.add('custom-dropdown-item');
  if (isActive) item.classList.add('active');
  item.setAttribute('data-value', code);
  item.textContent = friendlyName;
  return item;
}

function createPriceBox({
  code, product, unit, year, discounttext, buyButtonText, secondButtonText, secondButtonLink, detailsText,
}) {
  const box = document.createElement('div');
  box.classList.add('dropdown-products__price-box');
  box.setAttribute('data-store-context', '');
  box.setAttribute('data-store-id', product);
  box.setAttribute('data-store-option', `${unit}-${year}`);
  box.setAttribute('data-store-department', 'consumer');
  box.setAttribute('data-store-event', 'product-loaded');
  box.setAttribute('data-store-hide', 'no-price=discounted;type=visibility');
  box.dataset.code = code;

  box.innerHTML = `
    <p class="product-details">${detailsText || ''}</p>
    <div class="discount">
      <div data-store-hide="no-price=discounted;type=visibility" class="price">
        <span class="old-price"><del data-store-price="full">$69.99</del></span>
      </div>
      <div data-store-hide="no-price=discounted;type=visibility" class="featured">
        <span class="prod-save" data-store-hide="no-price=discounted"><span data-store-discount="percentage"></span> ${discounttext}</span>
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

  return box;
}

createNanoBlock('dropdown', (...args) => {
  const block = args.find((arg) => arg instanceof HTMLElement);
  const raw = args.filter((arg) => typeof arg === 'string').join(',');
  const products = raw.split(',').map((p) => p.trim());
  const root = document.createElement('div');
  root.classList.add('dropdown-products');

  const {
    buybuttontext = 'Buy Now',
    discounttext = 'OFF',
    secondbuttontext,
    secondbuttonlink,
    label: labelText,
    productnames = '',
  } = block?.dataset || {};

  const productNames = productnames.split(',').map((n) => n.trim());

  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.classList.add('dropdown-products__selector');

  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.classList.add('bestValue');
    labelEl.textContent = labelText;
    dropdownWrapper.appendChild(labelEl);
  }

  const customDropdown = document.createElement('div');
  customDropdown.classList.add('custom-dropdown');

  const selectedOption = document.createElement('div');
  selectedOption.classList.add('selected-option');
  selectedOption.innerHTML = `
    <span class="selected-label">${(productNames[0]?.split('|')[0] || 'Select').trim()}</span>
    <span class="dropdown-arrow"></span>
  `;

  const optionsList = document.createElement('div');
  optionsList.classList.add('options-list');

  products.forEach((prod, index) => {
    const [product, unit, year] = prod.split('/');
    const code = `${product}/${unit}/${year}`;
    const [friendlyName, detailsText] = (productNames[index] || product).split('|').map((p) => p.trim());

    const option = createDropdownItem(code, friendlyName, index === 0);
    optionsList.appendChild(option);

    const priceBox = createPriceBox({
      code, product, unit, year, discounttext, buyButtonText: buybuttontext, secondButtonText: secondbuttontext, secondButtonLink: secondbuttonlink, detailsText,
    });
    if (index !== 0) priceBox.style.display = 'none';
    root.appendChild(priceBox);
  });

  customDropdown.appendChild(selectedOption);
  customDropdown.appendChild(optionsList);
  dropdownWrapper.appendChild(customDropdown);
  root.insertBefore(dropdownWrapper, root.firstChild);

  selectedOption.addEventListener('click', () => {
    const isOpen = optionsList.classList.contains('open');
    optionsList.classList.toggle('open');
    selectedOption.classList.toggle('open', !isOpen);
    customDropdown.classList.toggle('open', !isOpen);
  });

  [...optionsList.querySelectorAll('.custom-dropdown-item')].forEach((item) => {
    item.addEventListener('click', () => {
      const selected = item.getAttribute('data-value');
      const label = item.textContent;
      selectedOption.querySelector('.selected-label').textContent = label;
      optionsList.classList.remove('open');
      selectedOption.classList.remove('open');
      customDropdown.classList.remove('open');

      [...optionsList.querySelectorAll('.custom-dropdown-item')].forEach((el) => el.classList.remove('active'));
      item.classList.add('active');

      [...root.querySelectorAll('.dropdown-products__price-box')].forEach((box) => {
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
    discounttext,
    corners,
    contentsize,
    textcolor,
  } = parentSection.dataset;

  if (backgroundcolor) parentSection.style.backgroundColor = backgroundcolor;
  if (innerbackgroundcolor) block.style.backgroundColor = innerbackgroundcolor;

  block.style.borderRadius = corners === 'round' ? '16px' : '0';

  if (textcolor) {
    block.querySelectorAll('p').forEach((p) => {
      p.style.color = textcolor;
    });
  }

  Object.assign(block.dataset, {
    ...(buybuttontext && { buybuttontext }),
    ...(secondbuttontext && { secondbuttontext }),
    ...(secondbuttonlink && { secondbuttonlink }),
    ...(label && { label }),
    ...(productnames && { productnames }),
    ...(discounttext && { discounttext }),
  });

  buildHeroDropdownBlock(block);

  if (contentsize) {
    const content = block.querySelector('.hero-dropdown-content > div');
    if (content) {
      switch (contentsize) {
        case 'half':
          content.style.width = '50%';
          break;
        case 'larger':
          content.style.width = '75%';
          break;
        case 'full':
          content.style.width = '100%';
          break;
        default:
          content.style.width = '60%';
          break;
      }
    }
  }

  renderDropdown(block);
}
