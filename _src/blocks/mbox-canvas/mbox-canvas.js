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

function createOfferParameters() {
  let parameters = {}
  const urlParams = new URLSearchParams(window.location.search);
  const feature = urlParams.get('feature');
  urlParams.forEach((value, key) => {
    if (value === feature) {
      parameters['feature'] = feature;
    }
  })

  return parameters;
}

export default async function decorate(block) {
  const {
    // eslint-disable-next-line no-unused-vars
    mboxName,
  } = block.closest('.section').dataset;

  let parameters = createOfferParameters();
  block.innerHTML += `
    <div class="canvas-content">

    </div>
  `;
  const offer = await Target.getOffers([{
    name: mboxName,
    parameters: parameters
  }]);
  const page = await fetch(`${offer[mboxName].content.offer}`);
  const aemHeaderHtml = await page.text();
  let decoratedHTML = decorateHTMLOffer(aemHeaderHtml);
  block.querySelector('.canvas-content').innerHTML = decoratedHTML.innerHTML;
  await loadBlocks(block.querySelector('.canvas-content'));
}
