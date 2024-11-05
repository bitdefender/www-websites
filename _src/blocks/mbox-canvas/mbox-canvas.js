import { Target } from '../../scripts/libs/data-layer.js';
import { decorateMain , detectModalButtons } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/lib-franklin.js';

function decorateHTMLOffer(aemHeaderHtml) {
  let newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);

  return newHtml;
}

export default async function decorate(block) {
  let parametersJSON = {
    feature : 'main_ui'
  }
  block.innerHTML += `
      <div class="canvas-content">

      </div>
    `;
  const offer = await Target.getOffers([{
    name: 'something',
    parameters: parametersJSON
  }]);
  const page = await fetch(`${offer['something'].content.offer}`);
  const aemHeaderHtml = await page.text();
  let decoratedHTML = decorateHTMLOffer(aemHeaderHtml);
  block.querySelector('.canvas-content').innerHTML = decoratedHTML.innerHTML;
  await loadBlocks(block.querySelector('.canvas-content'));
}
