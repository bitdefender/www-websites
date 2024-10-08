// Description: Hero block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct,
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
  const variant = `${unit}u-${year}y`;

  const root = document.createElement('div');
  root.classList.add('discount-bubble');
  root.classList.add('await-loader');
  root.innerHTML = `
    <span class="discount-bubble-0">--%</span>
    <span class="discount-bubble-1">${label}</span>
  `;

  fetchProduct(product, variant)
    .then((productResponse) => {
      if (productResponse.discount) {
        const discount = Math.round(
          (1 - (productResponse.discount.discounted_price) / productResponse.price) * 100,
        );
        root.querySelector('.discount-bubble-0').textContent = `${discount}%`;
        root.classList.remove('await-loader');
      } else {
        // eslint-disable-next-line no-console
        console.error('no discount available');
        root.classList.remove('await-loader');
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      root.classList.remove('await-loader');
    });
  return root;
});

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  const {
    // this defines wether the modals automatically refresh or not in the hero banner
    stopAutomaticModalRefresh,
    signature,
    label,
  } = block.closest('.section').dataset;

  buildHeroBlock(block);
  // Eager load images to improve LCP
  [...block.querySelectorAll('img')].forEach((el) => el.setAttribute('loading', 'eager'));

  // get div class hero-content
  const elementHeroContent = block.querySelector('.hero div.hero-content div');

  if (elementHeroContent !== null) {
    // Select  <ul> elements that contain a <picture> tag
    const ulsWithPicture = Array.from(document.querySelectorAll('ul')).filter((ul) => ul.querySelector('picture'));

    // Apply a CSS class to each selected <ul> element
    ulsWithPicture.forEach((ul) => ul.classList.add('hero-awards'));

    renderNanoBlocks(block);

    // move discount bubble inside the closest button
    const bubble = block.querySelector('.discount-bubble');
    if (bubble) {
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
  }
}
