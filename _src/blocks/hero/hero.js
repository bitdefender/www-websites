/* eslint-disable max-len */
// Description: Hero block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  getBrowserName,
} from '../../scripts/utils/utils.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} element The container element
 */
function buildHeroBlock(element) {
  const h1 = element.querySelector('h1');
  const picture = element.querySelector('picture');
  const pictureParent = picture ? picture.parentNode : false;
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.querySelector('div.hero');
    const subSection = document.querySelector('div.hero div');
    subSection.classList.add('hero-content');

    const isHomePage = window.location.pathname.split('/').filter((item) => item).length === 1;

    if (!isHomePage) {
      const breadcrumb = createTag('div', { class: 'breadcrumb' });
      document.querySelector('div.hero div div:first-child').prepend(breadcrumb);
    }

    const pictureEl = document.createElement('div');
    pictureEl.classList.add('hero-picture');
    pictureEl.append(picture);
    section.prepend(pictureEl);

    pictureParent.remove();
  }
}

createNanoBlock('discount', (code, label = '{label}') => {
  // code = "av/3/1"
  const [product, unit, year] = code.split('/');

  const root = document.createElement('div');
  root.classList.add('discount-bubble');
  root.classList.add('await-loader');

  // Add the required attributes to the root element

  root.setAttribute('data-store-context', '');
  root.setAttribute('data-store-id', product);
  root.setAttribute('data-store-option', `${unit}-${year}`);
  root.setAttribute('data-store-department', 'consumer');
  root.setAttribute('data-store-event', 'main-product-loaded');
  root.setAttribute('data-store-hide', 'no-price=discounted;type=visibility');
  root.innerHTML = `
    <span class="discount-bubble-0" data-store-discount="percentage">--%</span>
    <span class="discount-bubble-1">${label}</span>
  `;

  return root;
});

async function renderBubble(block) {
  await renderNanoBlocks(block);
  const bubble = block?.querySelector('.discount-bubble');
  if (bubble) {
    const { label } = block.closest('.section').dataset;
    if (label) {
      bubble.innerHTML = bubble.innerHTML.replace('{label}', label);
    }

    let sibling = bubble.previousElementSibling;

    while (sibling) {
      if (sibling.matches('.button-container')) {
        sibling.append(bubble);
        break;
      }
      sibling = sibling.previousElementSibling;
    }
  }
}

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const {
    // this defines wether the modals automatically refresh or not in the hero banner
    stopAutomaticModalRefresh,
    signature,
    percentProduct,
    firefoxUrl,
    buttonImage,
  } = block.closest('.section').dataset;

  buildHeroBlock(block);
  renderBubble(block);
  // Eager load images to improve LCP
  [...block.querySelectorAll('img')].forEach((el) => el.setAttribute('loading', 'eager'));

  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');
  if (elementHeroContent !== null) {
    // Select  <ul> elements that contain a <picture> tag
    const ulsWithPicture = Array.from(document.querySelectorAll('ul')).filter((ul) => ul.querySelector('picture'));

    // Apply a CSS class to each selected <ul> element
    ulsWithPicture.forEach((ul) => ul.classList.add('hero-awards'));

    // add signature to the top of the banner
    if (signature) {
      const signatureElement = createTag('div', { class: 'signature' });
      signatureElement.textContent = signature;
      document.querySelector('div.hero div div:first-child').prepend(signatureElement);
    }

    // set the modal buttons in the hero banner to not refresh the modal on click
    if (stopAutomaticModalRefresh === 'true') {
      block.querySelectorAll('a.modal.button').forEach((modalButton) => {
        modalButton.setAttribute('data-stop-automatic-modal-refresh', true);
      });
    }

    if (buttonImage) {
      const buttonImageEl = document.createElement('img');
      buttonImageEl.setAttribute('src', buttonImage);
      const heroBtn = block.querySelector('a');
      heroBtn.insertAdjacentElement('afterbegin', buttonImageEl);
    }
  }

  // make discount dynamic
  if (percentProduct) {
    const [alias, variant] = percentProduct.split(',');
    block.setAttribute('data-store-context', '');
    block.setAttribute('data-store-text-variable', '');
    block.setAttribute('data-store-id', alias);
    block.setAttribute('data-store-department', 'consumer');
    block.setAttribute('data-store-option', variant);
    block.querySelector('div').classList.add('await-loader');
  }

  // Add the await-loader class to the button that leads to the thank you page, this is an exception
  // for the free antivirus page
  if (block.querySelector('.button-container a[href*="/consumer/thank-you"]')) {
    block.querySelector('.button-container a[href*="/consumer/thank-you"]').classList.add('await-loader');
  }

  if (firefoxUrl && getBrowserName() === 'Firefox') {
    block.querySelector('a').href = firefoxUrl;
  }
}
