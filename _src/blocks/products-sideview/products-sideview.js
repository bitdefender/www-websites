import {
  createNanoBlock,
  getDatasetFromSection,
  renderNanoBlocks,
} from '../../scripts/utils/utils.js';

const state = {
  firstProduct: null,
  secondProduct: null,
  currentProduct: null,
  mode: 'm', // "m" or "y",
  membersIndex: 0,
  blockDataset: null,
};

const MEMBERS_MAP = new Map();

function expandItem(content) {
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  content.classList.add('expanded');
}

function collapseItem(content) {
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    content.classList.remove('expanded');
    content.style.height = 0;
  });
}

function eventListener(ul) {
  return (event) => {
    let target = null;

    // find ancestor a tag
    if (event.target.tagName !== 'A') {
      target = event.target.closest('a');
    } else {
      target = event.target;
    }

    // if the clicked node is not open then open it
    if (!target.classList.contains('is-open')) {
      target.classList.add('is-open');

      // if the clicked node has children then toggle the expanded class
      if (target.parentNode.children.length > 1) {
        target.parentNode.querySelectorAll('.features-tabs-content').forEach((content) => {
          expandItem(content);
        });
      }

      // hid the other tabs
      ul.querySelectorAll('li').forEach((collapsedLi) => {
        if (collapsedLi !== target.parentNode) {
          collapsedLi.children[0].classList.remove('is-open');
          collapsedLi.querySelectorAll('.features-tabs-content').forEach((content) => {
            collapseItem(content);
          });
        }
      });
    } else {
      target.classList.remove('is-open');
      // if the clicked node has children then toggle the expanded class
      if (target.parentNode.children.length > 1) {
        target.parentNode.querySelectorAll('.features-tabs-content').forEach((content) => {
          collapseItem(content);
        });
      }
    }
  };
}

function extractFeatures(col) {
  const ul = document.createElement('ul');
  ul.classList.add('features-tabs');

  // select all h4 tags as feature titles
  col.querySelectorAll('h4').forEach((h4) => {
    const li = document.createElement('li');
    ul.appendChild(li);

    const a = document.createElement('a');
    a.setAttribute('href', '#');

    // register click event on a tag

    a.addEventListener('click', (event) => {
      event.preventDefault();
      eventListener(ul)(event);
    });

    h4.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        a.appendChild(document.createTextNode(node.textContent));
      } else {
        a.appendChild(node);
      }
    });

    a.classList.add('features-tabs-title');

    li.appendChild(a);

    // all descendants of a that have class tag
    a.querySelectorAll('.tag').forEach((tag) => {
      li.appendChild(tag);
    });

    const content = document.createElement('div');
    content.classList.add('features-tabs-content');
    li.appendChild(content);

    // every oaragraph until next h4
    let nextElement = h4.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'H4') {
      content.appendChild(nextElement);
      nextElement = h4.nextElementSibling;
    }

    ul.appendChild(li);

    h4.remove();
  });

  return ul;
}

function updateBuyLink(block) {
  const buyLink = block.querySelector('.button-container > .button');
  if (buyLink) {
    buyLink.href = '#';
    buyLink.setAttribute('data-store-buy-link', '');
  }
}

function renderPrice(block, _firstProduct, secondProduct) {
  const variant = state.blockDataset.defaultSelection ?? '5-1';
  const priceElement = document.createElement('div');
  priceElement.classList.add('price-element-wrapper');

  const oldPrice = document.createElement('div');
  oldPrice.classList.add('prod-oldprice', 'await-loader');
  oldPrice.setAttribute('data-store-price', 'full');
  oldPrice.setAttribute('data-store-hide', 'no-price=discounted');

  const el = document.createElement('DIV');
  el.classList.add('price');
  el.classList.add('await-loader');
  block.setAttribute('data-store-context', '');
  block.setAttribute('data-store-id', secondProduct);
  block.setAttribute('data-store-option', variant);
  block.setAttribute('data-store-department', 'consumer');
  block.setAttribute('data-store-event', 'main-product-loaded');
  el.setAttribute('data-store-price', 'discounted||full');

  priceElement.appendChild(oldPrice);
  priceElement.appendChild(el);
  updateBuyLink(block);
  return priceElement;
}

function renderRadioGroup(block, monthlyLabel, yearlyLabel) {
  const { defaultSelection } = state.blockDataset;
  const [firstProduct, secondProduct] = state.blockDataset.price.split(',');
  const el = document.createElement('DIV');
  el.classList.add('products-sideview-radio');
  el.innerHTML = `
    <input type="radio" name="type" id="monthly"
    data-store-click-set-product data-store-product-id="${secondProduct}"
    data-store-product-department="consumer"
    data-product-type="monthly" ${defaultSelection.split('-')[0] === secondProduct ? 'checked' : ''}/>
    <label for="monthly">${monthlyLabel ?? 'Monthly'}</label>

    <input type="radio" name="type" id="yearly" data-store-click-set-product
    data-store-product-id="${firstProduct}"
    data-store-product-department="consumer"
    data-product-type="yearly" ${defaultSelection.split('-')[0] === firstProduct ? 'checked' : ''}/>
    <label for="yearly">${yearlyLabel ?? 'Yearly'}</label>
  `;
  return el;
}

function getBlueTagsAndListItems(block) {
  const benefitsList = block.querySelector('ul');
  if (!benefitsList) return { blueTags: [], listItems: [] };

  benefitsList.classList.add('benefits-list');
  const listItems = [...benefitsList.querySelectorAll('li')];

  listItems.forEach((li) => {
    let blueTag = li.querySelector('.tag-blue');
    if (!blueTag) {
      blueTag = document.createElement('span');
      blueTag.classList.add('tag-blue');
      li.insertAdjacentElement('beforeend', blueTag);
    }
    li.innerHTML = li.innerHTML.replace('{benefits}', '<span class="benefits-placeholder"></span>');
  });

  const blueTags = [...benefitsList.querySelectorAll('.tag-blue')];
  return { blueTags, listItems };
}

function updateBenefits(block, selectEl, metadata) {
  if (!metadata) return;

  // eslint-disable-next-line no-unused-vars
  const { blueTags, listItems } = getBlueTagsAndListItems(block);

  const selectedOption = [...selectEl.options].find((option) => option.hasAttribute('selected'));
  const neededIndex = [...selectEl.options].indexOf(selectedOption);
  const rawMetadata = metadata[neededIndex];

  const cleanedArray = rawMetadata
    .slice(1, -1)
    .split(',')
    .map((item) => {
      const cleanedItem = item.trim().replace(/['"]+/g, '');
      return cleanedItem.includes('-icon')
        ? `${Number(cleanedItem.split('-icon')[0])}-icon`
        : Number(cleanedItem);
    });

  listItems.forEach((li, i) => {
    if (i < cleanedArray.length) {
      const value = cleanedArray[i];
      const displayValue = typeof value === 'string' ? value.replace('-icon', '') : value;
      const iconSVG = (typeof value === 'string' && value.includes('-icon'))
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="7" r="4" fill="white" /><path d="M12 14c-4.418 0-8 2.686-8 6v1h16v-1c0-3.314-3.582-6-8-6z" fill="white" /></svg>'
        : '';

      // Update the tag-blue span
      const tag = li.querySelector('.tag-blue');
      if (tag) {
        tag.innerHTML = `${displayValue}x ${iconSVG}`;
      }

      // Update the benefits-placeholder span
      const placeholder = li.querySelector('.benefits-placeholder');
      if (placeholder) {
        placeholder.textContent = `${displayValue}`;
      }
    }
  });
}

function renderSelector(block, ...options) {
  const { labelText, membersText } = block.closest('.section').dataset;
  const [singleMember, multipleMembers] = [...membersText.split(',')];

  const selectorOptions = options
    .filter((option) => option && !Number.isNaN(Number(option)))
    .map((opt) => Number(opt));
  const defaultSelection = Number(state.blockDataset.defaultSelection?.split('-')[1]) || selectorOptions[1];
  const el = document.createElement('div');
  el.classList.add('products-sideview-selector');

  const selectId = `members-select-${Math.random().toString(36).substr(2, 9)}`;

  el.innerHTML = `
    <label for="${selectId}">${labelText ?? 'Choose number of members'}</label>
    <select id="${selectId}"
      data-store-click-set-devices>
        ${selectorOptions.sort((first, second) => first - second).map((opt) => `
          <option value="${opt}" ${opt === defaultSelection ? 'selected' : ''}>${opt === 1 ? `${opt} ${singleMember ?? 'member'}` : `${opt} ${multipleMembers ?? 'members'}`} </option>
        `).join('')}
    </select>
  `;

  const selectEl = el.querySelector('select');
  const metadata = block.parentElement.parentElement.dataset;
  selectEl.value = defaultSelection;

  selectEl.addEventListener('change', (e) => {
    [...selectEl.options].forEach((option) => option.removeAttribute('selected'));
    [...selectEl.options].find((option) => option.value === e.target.value)?.setAttribute('selected', '');
    updateBenefits(block, selectEl, metadata.benefits.split(',,'));
  });

  updateBenefits(block, selectEl, metadata.benefits?.split(',,'));

  return el;
}

createNanoBlock('price', renderPrice);
createNanoBlock('monthlyYearly', renderRadioGroup);
createNanoBlock('selectMembers', renderSelector);

function initMembersMap() {
  const selectMembers = state.blockDataset.selectmembers.trim().split(',');
  selectMembers.forEach((member, index) => MEMBERS_MAP.set(index, Number(member)));
}

export default function decorate(block) {
  const blockDataset = getDatasetFromSection(block);
  state.blockDataset = blockDataset;

  initMembersMap();

  block.firstElementChild.classList.add('d-flex');
  block.firstElementChild.firstElementChild.classList.add('pricing-wrapper');
  block.firstElementChild.lastElementChild.classList.add('features-wrapper');

  renderNanoBlocks(block.firstElementChild, block);

  const cols = [...block.firstElementChild.children];
  block.classList.add(`features-${cols.length}-cols`);

  const col = block.children[0].children[1];
  col.appendChild(extractFeatures(col));
}
