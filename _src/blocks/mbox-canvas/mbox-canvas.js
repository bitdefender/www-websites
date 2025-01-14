import { Target } from '../../scripts/libs/data-layer.js';
import { decorateMain, detectModalButtons } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/lib-franklin.js';

function decorateHTMLOffer(aemHeaderHtml) {
  const newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);

  return newHtml;
}

function createOfferParameters() {
  const parameters = {};
  const urlParams = new URLSearchParams(window.location.search);
  const feature = urlParams.get('feature');
  const language = urlParams.get('lang');
  urlParams.forEach((value) => {
    if (value === feature) {
      parameters.feature = feature;
    }
    if (value === language) {
      parameters.lang = language;
    }
  });

  return parameters;
}

export default async function decorate(block) {
  const {
    // eslint-disable-next-line no-unused-vars
    mboxName,
  } = block.closest('.section').dataset;

  const parameters = createOfferParameters();
  block.innerHTML += `
    <div class="canvas-content">

    </div>
  `;
  block.classList.add('loader');
  const offer = await Target.getOffers([{
    name: mboxName,
    parameters,
  }]);
  const page = await fetch(`${offer[mboxName].content.offer}`);
  const offerHtml = await page.text();
  const decoratedOfferHtml = decorateHTMLOffer(offerHtml);
  block.querySelector('.canvas-content').innerHTML = decoratedOfferHtml.innerHTML;
  await loadBlocks(block.querySelector('.canvas-content'));

  // make all the links from the canvas open in a new browser window
  block.querySelectorAll('a').forEach((link) => link.setAttribute('_target', 'blank'));
}
