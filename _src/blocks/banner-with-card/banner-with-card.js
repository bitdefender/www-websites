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
  const [textDiv, porductCard] = block.children[0].children;
  textDiv.classList.add('banner-content');
  porductCard.classList.add('product-card');
  const tosButton = parentElement.querySelector('.default-content-wrapper .button-container');
  tosButton.parentElement.remove();
  block.innerHTML = `
  ${textDiv.outerHTML}
  <div class="card-container">
    ${porductCard.outerHTML}
    ${tosButton.outerHTML ?? ''}
  </div>`;

  renderNanoBlocks(block);
}
