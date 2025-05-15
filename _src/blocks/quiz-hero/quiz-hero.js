import { adobeMcAppendVisitorId } from '../../scripts/target.js';

async function decorate(block) {
  const [rte, pictureEl] = [...block.children[0].children];

  block.innerHTML = `
    <div class="rte-wrapper"></div>
    <div class="img-container">${pictureEl.querySelector('picture').innerHTML}</div>
    <div class="default-content-wrapper">
        ${rte.outerHTML}
    </div>
  `;

  adobeMcAppendVisitorId('header');
}

export { decorate as default };
//# sourceMappingURL=quiz-hero.js.map
