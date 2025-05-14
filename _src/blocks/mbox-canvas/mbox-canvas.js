import Target from '@repobit/dex-target';
import { AdobeDataLayerService, WindowLoadStartedEvent } from '@repobit/dex-data-layer';
import { decorateMain, detectModalButtons } from '../../scripts/scripts.js';
import { getMetadata, loadBlocks } from '../../scripts/lib-franklin.js';
import page from '../../scripts/page.js';

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
      parameters.feature = feature.replaceAll('_', '-');
    }
    if (value === language) {
      parameters.lang = language.toLocaleLowerCase();
    }
  });

  return parameters;
}

function createOfferProfileParameters(parameters) {
  const profileParameters = {};
  Object.entries(parameters).forEach(([key, value]) => {
    profileParameters[`profile.${key}`] = value;
  });

  return profileParameters;
}

/**
 * Updates the PageLoadStartedEvent with dynamic content from the offer
 * and pushes it to the AdobeDataLayerService.
 *
 * @param {Object} offer - The offer object containing dynamic content.
 * @returns {Promise<void>} - A promise that resolves when the event is updated and pushed.
 */
async function updatePageLoadStartedEvent(offer) {
  const match = offer.offer.match(/\/([^/]+)\.plain\.html$/);
  const result = match ? match[1] : null;
  let trackingID = getMetadata('cid');
  trackingID = trackingID.replace('<language>', page.getParamValue('lang'));
  trackingID = trackingID.replace('<asset name>', page.getParamValue('feature'));

  const newObject = new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace('<dynamic-content>', result);
    pageLoadStartedInfo.language = page.getParamValue('lang') || 'en-us';
    return pageLoadStartedInfo;
  }, { trackingID });

  Object.entries(newObject.page.info).forEach(([key, value]) => {
    if (value === '<dynamic-content>') {
      newObject.page.info[key] = result;
    }
  });

  AdobeDataLayerService.push(newObject);
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
  block.classList.add('loader-circle');
  const offer = await Target.getOffers({
    mboxNames: mboxName,
    parameters,
    profileParameters: createOfferProfileParameters(parameters),
  });
  const pageCall = await fetch(`${offer.offer}`);
  let offerHtml;
  await loadBlocks(block.querySelector('.canvas-content'));

  if (pageCall.ok) {
    offerHtml = await pageCall.text();
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang')?.toLowerCase() || 'en-us';
    let defaultOffer = await fetch(`/${language}/consumer/webview/webview-table.plain.html`);
    if (defaultOffer.ok) {
      offerHtml = await defaultOffer.text();
    } else {
      defaultOffer = await fetch('/en-us/consumer/webview/webview-table.plain.html');
      offerHtml = await defaultOffer.text();
    }
  }

  const decoratedOfferHtml = decorateHTMLOffer(offerHtml);
  updatePageLoadStartedEvent(offer, mboxName);

  // Make all the links that contain #buylink in href open in a new browser window
  decoratedOfferHtml.querySelectorAll('a[href*="#buylink"]').forEach((link) => {
    link.setAttribute('target', '_blank');
  });

  block.querySelector('.canvas-content').innerHTML = decoratedOfferHtml.innerHTML;
  await loadBlocks(block.querySelector('.canvas-content'));
}
