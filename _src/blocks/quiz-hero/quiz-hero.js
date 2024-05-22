import { adobeMcAppendVisitorId } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [rte, pictureEl] = [...block.children[0].children];

  block.innerHTML = `
    <div class="rte-wrapper"></div>
    <div class="img-container">${pictureEl.querySelector('picture').innerHTML}</div>
    <div class="default-content-wrapper">
        ${rte.outerHTML}
    </div>
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  adobeMcAppendVisitorId('header');
}
