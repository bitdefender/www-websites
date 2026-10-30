import { target } from '../../scripts/target.js';
import { decorateMain, detectModalButtons } from '../../scripts/scripts.js';
import { decorateIcons, loadBlocks } from '../../scripts/lib-franklin.js';
import page from '../../scripts/page.js';

function decorateHTMLOffer(aemHeaderHtml) {
  const newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);

  return newHtml;
}

export default async function decorate(block) {
  const {
    mboxName, path,
  } = block.closest('.section').dataset;
  block.innerHTML += `
    <div class="personalized-content"></div>
  `;
  block.classList.add('await-loader');

  const offer = await target.getOffers({
    mboxNames: mboxName,
  });
  if (offer?.offer) {
    const pageCall = await fetch(`/${page.locale}${path}${offer.offer}.plain.html`);
    let offerHtml;
    await loadBlocks(block.querySelector('.personalized-content'));
    if (pageCall.ok) {
      offerHtml = await pageCall.text();
      const decoratedOfferHtml = decorateHTMLOffer(offerHtml);

      block.querySelector('.personalized-content').innerHTML = decoratedOfferHtml.innerHTML;
      await loadBlocks(block.querySelector('.personalized-content'));
      decorateIcons(block);
    }
  }
}
