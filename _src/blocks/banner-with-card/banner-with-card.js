import { detectModalButtons } from '../../scripts/scripts.js';
import { createNanoBlock, createTag, renderNanoBlocks } from '../../scripts/utils/utils.js';

function renderBluePill(icon, text) {
  const root = createTag(
    'div',
    {
      class: 'blue-pill-container',
    },

    `<div class= "blue-pill">
      ${icon ? `<span class = "icon icon-${icon.toLowerCase()}"></span>` : ''}
      ${text ? `<span class = "blue-pill-text">${text}</span>` : ''}
     </div>
    `,
  );

  return root;
}

createNanoBlock('bluePill', renderBluePill);

export default function decorate(block) {
  const parentElement = block.closest('.section');
  const { product } = parentElement.dataset;
  const [textDiv, productCard] = block.children[0].children;
  textDiv.classList.add('banner-content');
  productCard.classList.add('product-card');
  if (product) {
    productCard.setAttribute('product-id', `${product.split('/')?.[0]}`);
  }
  const tosButton = parentElement.querySelector('.default-content-wrapper .button-container');
  tosButton?.parentElement.remove();
  block.innerHTML = `
  ${textDiv.outerHTML}
  <div class="card-container">
    ${productCard.outerHTML}
    ${tosButton?.outerHTML ?? ''}
  </div>`;

  renderNanoBlocks(block);
  detectModalButtons(block);
}
