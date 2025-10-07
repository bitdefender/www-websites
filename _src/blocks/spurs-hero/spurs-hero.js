import { adobeMcAppendVisitorId } from '../../scripts/target.js';

export default async function decorate(block) {
  block.classList.add('global-styles');
  const [rte, pictureEl] = [...block.children[0].children];

  if (window.location.href.indexOf('scuderiaferrari') !== -1) {
    block.closest('.section').classList.add('hero-ferrari');
  }

  block.innerHTML = `
      <div class="rte-wrapper"></div>
      <div class="img-container">${pictureEl.querySelector('picture').outerHTML}</div>
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
