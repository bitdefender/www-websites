// Description: Hero block
import {
  createTag,
  createNanoBlock,
  renderNanoBlocks,
  fetchProduct, getDatasetFromSection,
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

    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    document.querySelector('div.hero div div:first-child').prepend(breadcrumb);

    const pictureEl = document.createElement('div');
    pictureEl.classList.add('hero-picture');
    pictureEl.append(picture);

    section.prepend(pictureEl);

    pictureParent.remove();
  }
}

createNanoBlock('discount', (code, variant) => {
  const root = document.createElement('div');
  root.classList.add('discount-bubble');
  root.innerHTML = `
    <span class="discount-bubble-0">--%</span>
    <span class="discount-bubble-1">Discount</span>
  `;

  fetchProduct(code, variant)
    .then((product) => {
      if (product.discount) {
        const discount = Math.round(
          (1 - (product.discount.discounted_price) / product.price) * 100,
        );
        root.querySelector('.discount-bubble-0').textContent = `${discount}%`;
      } else {
        // eslint-disable-next-line no-console
        console.error('no discount available');
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  return root;
});

/**
 * decorates hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
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
}
