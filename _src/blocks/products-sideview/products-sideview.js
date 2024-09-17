import {
  createNanoBlock,
  fetchProduct,
  getBuyLinkCountryPrefix,
  getDatasetFromSection,
  getPidFromUrl,
  renderNanoBlocks, setDataOnBuyLinks,
} from '../../scripts/utils/utils.js';

const state = {
  firstProduct: null,
  secondProduct: null,
  currentProduct: null,
  mode: 'm', // "m" or "y",
  membersIndex: 0,
};

const MEMBERS_MAP = new Map([
  [0, 3],
  [1, 5],
  [2, 10],
  [3, 25],
]);

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
  const productCode = state.currentProduct.alias;
  const dimension = MEMBERS_MAP.get(state.membersIndex);
  const { years } = state.currentProduct.variation;
  const pid = getPidFromUrl();

  if (buyLink) {
    buyLink.href = `${getBuyLinkCountryPrefix()}/${productCode}/${dimension}/${years}/${pid ? `pid.${pid}` : ''}`;
    const dataInfo = {
      productId: productCode,
      variation: {
        price: state.currentProduct.discount
          ? +state.currentProduct.discount.discounted_price : +state.currentProduct.price,
        discounted_price: state.currentProduct.discount?.discounted_price,
        variation_name: state.currentProduct.variation.variation_name,
        currency_label: state.currentProduct.currency_label,
        region_id: state.currentProduct.region_id,
      },
    };

    setDataOnBuyLinks(buyLink, dataInfo);
  }
}

function updatePrice(block) {
  const isMonthly = state.mode === 'm';
  const priceEl = block.querySelector('.price');

  (async () => {
    const product = isMonthly
      ? state.secondProduct
      : state.firstProduct;

    state.currentProduct = product;
    const variant = `${MEMBERS_MAP.get(state.membersIndex)}u-1y`;
    const resp = await fetchProduct(product.alias, variant);
    priceEl.textContent = `${resp.currency_label} ${resp.price}`;
  })();
}

function renderPrice(block, firstProduct, secondProduct) {
  const variant = '3u-1y';

  const el = document.createElement('DIV');
  el.classList.add('price');

  Promise.all([
    fetchProduct(firstProduct, variant),
    fetchProduct(secondProduct, variant),
  ]).then(([vsb, vsbm]) => {
    state.firstProduct = vsb;
    state.firstProduct.alias = firstProduct;
    state.secondProduct = vsbm;
    state.secondProduct.alias = secondProduct;
    updatePrice(block);
    updateBuyLink(block);
  });

  return el;
}

function renderRadioGroup(block) {
  const el = document.createElement('DIV');
  el.classList.add('products-sideview-radio');

  el.innerHTML = `
    <input type="radio" name="type" id="monthly" value="m" checked/>
    <label for="monthly">Monthly</label>
    
    <input type="radio" name="type" id="yearly" value="y" />
    <label for="yearly">Yearly</label>
  `;

  const radioButtons = el.querySelectorAll('input[name="type"]');

  radioButtons.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      state.mode = event.target.value;

      updatePrice(block);

      // update buy link
      updateBuyLink(block);
    });
  });

  return el;
}

function updateBenefits(block) {
  const blockDataset = getDatasetFromSection(block);
  const ul = block.querySelector('ul');
  if (ul) {
    ul.classList.add('benefits-list');
    try {
      const benefitsList = blockDataset.benefits.split(',,').map((b) => JSON.parse(b));
      const currentBenefitSelection = benefitsList[state.membersIndex];
      ul.querySelectorAll('li').forEach((li, index) => {
        const numberOfBenefitsTag = document.createElement('SPAN');
        numberOfBenefitsTag.textContent = `x${currentBenefitSelection[index]}`;
        numberOfBenefitsTag.classList.add('tag-blue');

        // Find the last span element within the li
        const lastSpan = li.querySelector('span:last-of-type');

        // Replace the last span element with the new one
        if (lastSpan) {
          li.replaceChild(numberOfBenefitsTag, lastSpan);
        } else {
          // If no span is found, just append the new one
          li.append(numberOfBenefitsTag);
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("couldn't load the benefits");
    }
  }
}

function renderSelector(block, ...options) {
  const el = document.createElement('div');
  el.classList.add('products-sideview-selector');

  el.innerHTML = `
    <select>
        ${options.map((opt, index) => `
          <option value="${index}">${opt} members</option>
        `).join(',')}
    </select>
  `;

  el.querySelector('select').addEventListener('change', (e) => {
    const value = JSON.parse(e.target.value);
    state.membersIndex = value;
    // update benefits
    updateBenefits(block);

    // update price
    updatePrice(block);

    // update buy link
    updateBuyLink(block);
  });

  return el;
}

createNanoBlock('price', renderPrice);
createNanoBlock('monthlyYearly', renderRadioGroup);
createNanoBlock('selectMembers', renderSelector);

export default function decorate(block) {
  block.firstElementChild.classList.add('d-flex');
  block.firstElementChild.firstElementChild.classList.add('pricing-wrapper');
  block.firstElementChild.lastElementChild.classList.add('features-wrapper');

  updateBenefits(block);

  renderNanoBlocks(block.firstElementChild, block);

  const cols = [...block.firstElementChild.children];
  block.classList.add(`features-${cols.length}-cols`);

  const col = block.children[0].children[1];
  col.appendChild(extractFeatures(col));
}
