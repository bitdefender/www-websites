import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  createNanoBlock,
  renderNanoBlocks,
  wrapChildrenWithStoreContext,
} from '../../scripts/utils/utils.js';

const productsList = [];

function updateProductsList(product) {
  const productTrim = product.trim();
  if (productsList.indexOf(productTrim) === -1) {
    productsList.push(productTrim);
  }

  window.productsListCount = productsList.length;
}

function getDiscountedPriceAttribute(type, prodName) {
  if (type !== 'monthly' || prodName.endsWith('m')) {
    return 'discounted||full';
  }

  return 'discounted-monthly||full-monthly';
}

function updateTagsMargin(block) {
  const greenTags = block.querySelectorAll('.green-tag');
  let greenTagsHeight = 0;
  greenTags.forEach((tag) => {
    if (greenTagsHeight < tag.offsetHeight) greenTagsHeight = tag.offsetHeight;
    block.style.setProperty('--green-tag-height', `${greenTagsHeight + 15}px`);
  });
}

function renderGreenTag(text) {
  const root = document.createElement('div');

  root.classList.add('green-tag');
  root.innerHTML = text.replace('PERCENT', '&nbsp;<span data-store-render data-store-discount="percentage"></span>');
  root.setAttribute('data-store-hide', '!it.option.price.discounted ');
  if (!text) root.classList.add('hidden');

  return root;
}

function renderRadios(...radios) {
  const cardIndex = radios[radios.length - 2];
  const root = document.createElement('div');
  root.classList.add('radios-container');
  const productCard = radios[radios.length - 1];
  const section = productCard.closest('.section');
  const products = section.dataset[`pricing${cardIndex + 1}`]?.split(',') || [];
  const { checkedRadio } = section.dataset;

  radios.forEach((radio, idx) => {
    if (typeof radio === 'string') {
      if (!radio) return;
      const radioWrapper = document.createElement('div');
      radioWrapper.classList.add('radio-wrapper');
      const radioElement = document.createElement('input');
      radioElement.classList.add('radio');
      radioElement.type = 'radio';
      radioElement.name = `radio-card-${cardIndex}`;
      radioElement.value = `radio-card-${cardIndex}-${idx}`;
      radioElement.id = `radio-card-${cardIndex}-${idx}`;
      radioElement.setAttribute('data-store-action', '');
      radioElement.setAttribute('data-store-set-id', `${products[idx]?.split('/')[0].trim()}`);
      radioElement.setAttribute('data-store-set-devices', `${products[idx]?.split('/')[1].trim()}`);
      radioElement.setAttribute('data-store-set-subscription', `${products[idx]?.split('/')[2].trim()}`);
      if (checkedRadio && idx + 1 === Number(checkedRadio)) radioElement.checked = true;

      const radioLabel = document.createElement('label');
      radioLabel.setAttribute('for', `radio-card-${cardIndex}-${idx}`);
      radioLabel.innerText = radio;
      radioWrapper.appendChild(radioElement);
      radioWrapper.appendChild(radioLabel);
      root.appendChild(radioWrapper);
    }
  });

  return root;
}

function renderPricing(...products) {
  const root = document.createElement('div');
  root.classList.add('pricing-container');
  const productCard = products[products.length - 1];

  const section = productCard.closest('.section');
  const { monthlyPrice, saveText } = section.dataset;
  const billedPrice = productCard.querySelector('.billed-price-container');
  const productId = productCard.closest('bd-product')?.getAttribute('product-id')
    || products[0].split('/')[0];
  const priceAttribute = getDiscountedPriceAttribute(monthlyPrice ? 'monthly' : '', productId);

  const percentHtml = '<span data-store-render data-store-discount="percentage"></span>';
  let saveHtml = `Save ${percentHtml}`;
  if (saveText) {
    saveHtml = saveText.includes('0%') ? saveText.replace('0%', percentHtml) : `${saveText} ${percentHtml}`;
  }

  root.innerHTML += `
        <div class="pricing">
           <div class="save_price_box await-loader new-store" data-store-render data-store-hide="!it.option.price.discounted" data-store-hide-type="visibility">
              <span class="prod-oldprice" data-store-render data-store-price="full"></span>
              <strong class="save prod-percent">${saveHtml}</strong>
            </div>
            <div class="prices_box await-loader new-store">
              <span class="prod-newprice" data-store-render
              data-store-price="${priceAttribute}">
              </span>
              ${monthlyPrice ? `<sup>${monthlyPrice}</sup>` : ''}
            </div>
        </div>
      `;

  if (billedPrice) {
    billedPrice.innerHTML += '<span class="prod-newprice billed-price" data-store-render data-store-price="discounted||full"></span>';
  }

  return root;
}

createNanoBlock('greenTag', renderGreenTag);
createNanoBlock('radios', renderRadios);
createNanoBlock('pricing', renderPricing);

function isIconElement(node) {
  return node?.nodeType === Node.ELEMENT_NODE && node.classList.contains('icon');
}

function createPill(type, text) {
  const pillElement = document.createElement('span');
  pillElement.classList.add(`${type}-pill`);
  if (text.trim()) pillElement.append(text.trim());
  return pillElement;
}

function moveLeadingTextToPill(textNode, pillElement) {
  if (textNode?.nodeType !== Node.TEXT_NODE) return;

  const nextMarkerIndex = textNode.textContent.search(/\?(?:blue|green)-pill/);
  const textEndIndex = nextMarkerIndex === -1 ? textNode.textContent.length : nextMarkerIndex;
  const pillText = textNode.textContent.slice(0, textEndIndex).trim();

  if (!pillText) return;

  pillElement.append(pillText);
  textNode.textContent = textNode.textContent.slice(textEndIndex);
}

function replacePills(root) {
  const pillPattern = /\?(blue|green)-pill\s*([^?]*)/g;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent.includes('?blue-pill') && !node.textContent.includes('?green-pill')) {
        return NodeFilter.FILTER_REJECT;
      }

      if (node.parentElement.closest('span.blue-pill, span.green-pill')) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes = [];

  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    const text = textNode.textContent;
    let currentIndex = 0;
    let lastPill;

    [...text.matchAll(pillPattern)].forEach((match) => {
      const [matchedText, pillType, pillText] = match;
      const matchIndex = match.index;

      fragment.append(text.slice(currentIndex, matchIndex));

      lastPill = createPill(pillType, pillText);
      fragment.append(lastPill);
      currentIndex = matchIndex + matchedText.length;
    });

    fragment.append(text.slice(currentIndex));

    if (lastPill) {
      const hasPillText = lastPill.textContent.trim();
      const nextNode = textNode.nextSibling;

      if (isIconElement(nextNode)) {
        const textAfterIcon = nextNode.nextSibling;
        lastPill.append(nextNode);
        if (!hasPillText) moveLeadingTextToPill(textAfterIcon, lastPill);
      }
    }

    textNode.replaceWith(fragment);
  });
}

function setSliderBoxVisibility(block, showFamilyBoxes) {
  block.querySelectorAll('.family-box').forEach((box) => {
    box.style.display = showFamilyBoxes ? 'grid' : 'none';
  });

  block.querySelectorAll('.individual-box').forEach((box) => {
    box.style.display = showFamilyBoxes ? 'none' : 'grid';
  });

  updateTagsMargin(block);
}

// a linked product name is authored as a paragraph, so restore it as the card title
function decorateLinkedProductName(innerCard) {
  if (innerCard.querySelector('h3')) return;

  const [first, second] = innerCard.children;
  const nameParagraph = first?.textContent.includes('{GreenTag}') ? second : first;
  const links = nameParagraph?.tagName === 'P' ? nameParagraph.querySelectorAll('a') : [];
  const [link] = links;
  if (links.length !== 1 || nameParagraph.textContent.trim() !== link.textContent.trim()) return;

  link.className = '';
  link.textContent = link.textContent.trim();
  const title = document.createElement('h3');
  title.append(link);
  nameParagraph.replaceWith(title);
}

function removeArrowMarker(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const updatedText = textNode.textContent.replace(/\s*<-\s*/, '');

    if (updatedText !== textNode.textContent) {
      textNode.textContent = updatedText;
      break;
    }
  }
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const productCards = [...block.children];
  const {
    checkedRadio, slider, sliderIcons, titleProduct,
  } = section.dataset;
  let limit = productCards.length;
  let switchCheckbox;
  if (slider) {
    limit = productCards.length / 2;
    const switchBox = document.createElement('div');

    const [partsIndividual, partsFamily] = slider ? slider.split(',') : ['', ''];
    const [iconIndividual, iconFamily] = sliderIcons ? sliderIcons.split(',') : ['', ''];

    switchBox.classList.add('switchBox');
    switchBox.innerHTML = `  
            <label class="switch"> 
              <input type="checkbox" id="switchCheckbox">
              <span class="slider round"></span>
              <span class="label left">
                ${iconIndividual ? `<span class="icon icon-${iconIndividual}"></span>` : ''}
                ${partsIndividual ? `<p>${partsIndividual}</p>` : ''}
              </span>
               <span class="label right">
                ${iconFamily ? `<span class="icon icon-${iconFamily.trim()}"></span>` : ''}
                ${partsFamily ? `<p>${partsFamily}</p>` : ''}
              </span>
            </label>
          `;

    // Get the checkbox inside the switchBox
    switchCheckbox = switchBox.querySelector('#switchCheckbox');
    const switchLabel = switchBox.querySelector('.switch');

    // label and icon colors for each state live in the CSS (.switch.is-family)
    const syncSwitchState = () => {
      switchLabel?.classList.toggle('is-family', switchCheckbox.checked);
    };

    if (section.classList.contains('reverted-slider')) {
      switchCheckbox.checked = true;
      switchCheckbox.setAttribute('checked', '');
    }

    syncSwitchState();

    // Add an event listener to the checkbox
    switchCheckbox.addEventListener('change', () => {
      syncSwitchState();
      setSliderBoxVisibility(block, switchCheckbox.checked);
    });

    block.parentElement.prepend(switchBox);
  }

  productCards.forEach((card, idx) => {
    if (idx >= limit) card.classList.add('family-box');
    else card.classList.add('individual-box');
    card.classList.add('prod_box');
    const innerCard = card.querySelector(':scope > div');
    if (innerCard) {
      innerCard.classList.add('inner_prod_box');
      decorateLinkedProductName(innerCard);
      const products = block.closest('.section').dataset[`pricing${idx + 1}`]?.split(',') || [];
      const activeProduct = products[checkedRadio - 1] || products[0];
      const [activeProductName, activeProductUsers, activeProductYears] = activeProduct.split('/');
      wrapChildrenWithStoreContext(innerCard, {
        productId: activeProductName,
        devices: activeProductUsers,
        subscription: activeProductYears,
        storeEvent: 'info',
      });

      replacePills(innerCard);

      const listElements = innerCard.querySelectorAll('.inner_prod_box ul li');
      listElements.forEach((li) => {
        if (li.innerText.includes('<-')) {
          li.classList.add('has-arrow-left');
          removeArrowMarker(li);
        }
      });

      // wrap the heading of each top-level list item so it fills a single subgrid row
      innerCard.querySelectorAll('ul > li').forEach((li) => {
        if (li.parentElement.closest('li')) return;
        const heading = document.createElement('div');
        heading.classList.add('list-heading');
        [...li.childNodes].filter((node) => node.nodeName !== 'UL').forEach((node) => heading.append(node));
        li.prepend(heading);
      });

      const buyButtons = innerCard.querySelectorAll('a[href*="#buylink"]');

      buyButtons.forEach((button) => {
        button.classList.add('buy-button');
        button.setAttribute('data-store-render', '');
        button.setAttribute('data-store-buy-link', '');
      });

      const paragraphs = card.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // only a standalone 0 is the billed price placeholder (not the 0 in "30 days")
        p.innerHTML = p.innerHTML.replace(/(^|[\s>])0(?=%|[\s.,<]|$)/, '$1<span class="billed-price-container"></span>');
      });

      const addOnList = card.querySelector(':scope  div  ol');
      if (addOnList) {
        const items = addOnList.querySelectorAll(':scope > li');

        const [isCheckbox, addonProduct, addonContent] = [...items];

        if (isCheckbox.textContent.toLowerCase().includes('add-on-checkbox') && addonProduct) {
          updateProductsList(addonProduct.textContent.trim());
          const [addOnProductName, addOnProductUsers, addOnProductYears] = addonProduct.textContent.trim().split('/');
          isCheckbox.remove();
          addonProduct.remove();

          const addOnLabel = document.createElement('label');
          addOnLabel.setAttribute('for', `addon-checkBox-${idx}`);
          addOnLabel.innerHTML = `
            ${addonContent.innerHTML
    .replace('{PERCENT}', '&nbsp;<span class="add-on-percent"><span class="prod-percent" data-store-render data-store-discount="percentage"></span></span>')
    .replace('{PRICE}', '<span class="add-on-price"><span class="prod-newprice" data-store-render data-store-price="discounted||full"></span></span>')
    .replace('{OLD_PRICE}', '&nbsp;<span class="add-on-percent"><span class="prod-oldprice" data-store-render data-store-price="full"></span></span>')}
    `;

          wrapChildrenWithStoreContext(addOnLabel, {
            productId: addOnProductName,
            devices: addOnProductUsers,
            subscription: addOnProductYears,
            ignoreEventsParent: true,
            storeEvent: 'info',
          });
          addonContent.innerHTML = ` <div class= "vpn_box">
          <input type="checkbox" id="addon-checkBox-${idx}" name="addon-checkbox-${idx}"
          data-store-action data-store-set-bundle 
          data-store-set-id="${addOnProductName}"
          data-store-set-devices="${addOnProductUsers}"
          data-store-set-subscription="${addOnProductYears}" value="">
          ${addOnLabel.outerHTML}
          </div>
        `;
        }
      }

      renderNanoBlocks(innerCard, undefined, idx);
    }
  });

  if (slider) {
    setSliderBoxVisibility(block, switchCheckbox?.checked);
  }

  await decorateIcons(section);

  const sectionTitle = section.querySelector('h1');
  const [titleProductName, titleProductUsers, titleProductYears] = titleProduct?.split('/') || [];
  if (sectionTitle && titleProduct) {
    wrapChildrenWithStoreContext(sectionTitle, {
      productId: titleProductName,
      devices: titleProductUsers,
      subscription: titleProductYears,
      storeEvent: 'info',
    });

    sectionTitle.innerHTML = sectionTitle.innerHTML.replace('0%', '<span data-store-render data-store-discount="percentage"></span>');
  }

  const resizeObserver = new ResizeObserver(() => {
    updateTagsMargin(block);
  });
  resizeObserver.observe(document.body);
}
