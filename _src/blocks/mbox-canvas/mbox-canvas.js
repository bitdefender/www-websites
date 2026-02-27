import { AdobeDataLayerService, WindowLoadStartedEvent } from '@repobit/dex-data-layer';
import { Store } from '@repobit/dex-store';
import { target } from '../../scripts/target.js';
import { decorateMain, detectModalButtons } from '../../scripts/scripts.js';
import { getMetadata, loadBlocks, decorateIcons } from '../../scripts/lib-franklin.js';
import page from '../../scripts/page.js';
import { Constants } from '../../scripts/libs/constants.js';
import user from '../../scripts/user.js';

function decorateHTMLOffer(aemHeaderHtml) {
  const newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);

  return newHtml;
}

const serviceIdSegmentCache = new Map();
async function extractServiceId(serviceId) {
  if (!serviceId) {
    return null;
  }

  if (serviceIdSegmentCache.has(serviceId)) {
    return serviceIdSegmentCache.get(serviceId);
  }

  const baseUrl = 'https://www.bitdefender.com';
  const endpoint = `${baseUrl}/cdp/splash/${encodeURIComponent(serviceId)}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch segments for service id ${serviceId}: ${response.status}`);
      return null;
    }

    const payload = await response.json();
    const segmentIds = Array.isArray(payload?.data)
      ? payload.data
        .map((entry) => entry?.segment_id)
        .filter((segment) => typeof segment === 'string' && segment.trim().length > 0)
      : [];

    if (segmentIds.length === 0) {
      return null;
    }
    const segmentParam = segmentIds.join(',');
    serviceIdSegmentCache.set(serviceId, segmentParam);
    return segmentParam;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch segments for service id ${serviceId}`, error);
  }

  return null;
}

async function createOfferParameters() {
  const parameters = {};
  const urlParams = new URLSearchParams(window.location.search);
  const feature = urlParams.get('feature');
  const language = urlParams.get('lang');
  const serviceId = urlParams.get('service_id');

  if (feature) {
    parameters.feature = feature.replaceAll('_', '-');
  }

  if (language) {
    parameters.lang = language.toLocaleLowerCase();
  }

  if (serviceId) {
    const serviceIdSegment = await extractServiceId(serviceId);
    if (serviceIdSegment) {
      // search for segment in the url params
      parameters.segment = serviceIdSegment;
    }
  }

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
  let result = null;
  const cleanOffer = offer.offer || offer;
  const match = cleanOffer.match(/\/([^/]+)\.plain\.html$/);
  result = match ? match[1] : null;

  if (!result) {
    return;
  }

  const productName = page.getParamValue('trialSku') || 'avfree';
  const isPluginPage = !result.toLowerCase().includes('webview-table');
  const pageType = isPluginPage ? 'plugin' : 'offer';
  const isSplashpage = result.toLowerCase().includes('splash');
  const flow = isSplashpage ? 'splash' : 'webview';

  const [locale, country] = (page.getParamValue('lang') || 'en-US').split('-');

  let trackingID = getMetadata('cid');
  trackingID = trackingID.replace('<flow>', flow);
  trackingID = trackingID.replace('<locale>', locale);
  trackingID = trackingID.replace('<country>', country);
  trackingID = trackingID.replace('<asset name>', result);
  trackingID = trackingID.replace('<product>', productName);

  const newObject = new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace('<dynamic-content>', result);
    pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace('<product>', productName);
    pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace('<page-type>', pageType);

    pageLoadStartedInfo.subSection = pageLoadStartedInfo.subSection.replace('<product>', productName);
    pageLoadStartedInfo.subSubSection = pageLoadStartedInfo.subSubSection.replace('<page-type>', pageType);

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

  const parameters = await createOfferParameters();
  block.innerHTML += `
    <div class="canvas-content">

    </div>
  `;
  block.classList.add('loader-circle');
  const configMbox = await target.getOffers({
    mboxNames: 'config-mbox',
    parameters,
    profileParameters: createOfferProfileParameters(parameters),
  });

  const canvasStore = new Store({
    campaign: async () => configMbox.promotion,
    locale: configMbox.useGeoIpPricing
      ? (await user.locale)?.toLowerCase()
      : page.locale.toLowerCase(),
    provider: { name: 'vlaicu' },
  });

  const canvasRoot = document.createElement('bd-root');
  canvasRoot.store = canvasStore;
  const canvasWrapper = block.parentElement;
  canvasWrapper.appendChild(canvasRoot);
  canvasRoot.appendChild(block);

  await canvasRoot.updateComplete;

  const offer = await target.getOffers({
    mboxNames: mboxName,
    parameters,
    profileParameters: createOfferProfileParameters(parameters),
  });

  // once in a while the offer returned has the language in uppercase which makes the fetch fail
  // to avoid this edge case, lowercase the entire url
  // this will break if the offer url needs to have uppercase letters, for now it is not the case
  const offerLink = `${Constants.BASE_URL_FOR_PROD}${offer.offer}`.toLowerCase();
  const pageCall = await fetch(offerLink);
  let offerHtml;
  await loadBlocks(block.querySelector('.canvas-content'));

  if (pageCall.ok) {
    offerHtml = await pageCall.text();
    updatePageLoadStartedEvent(offer);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang')?.toLowerCase() || 'en-us';
    let defaultOffer = await fetch(`/${language}/consumer/webview/webview-table.plain.html`);
    if (defaultOffer.ok) {
      offerHtml = await defaultOffer.text();
      updatePageLoadStartedEvent(`/${language}/consumer/webview/webview-table.plain.html`);
    } else {
      defaultOffer = await fetch('/en-us/consumer/webview/webview-table.plain.html');
      offerHtml = await defaultOffer.text();
      updatePageLoadStartedEvent('/en-us/consumer/webview/webview-table.plain.html');
    }
  }

  const decoratedOfferHtml = decorateHTMLOffer(offerHtml);
  // Make all the links that contain #buylink in href open in a new browser window
  decoratedOfferHtml.querySelectorAll('a[href*="#buylink"]').forEach((link) => {
    link.setAttribute('target', '_blank');
  });
  block.querySelector('.canvas-content').innerHTML = decoratedOfferHtml.innerHTML;

  await loadBlocks(block.querySelector('.canvas-content'));
  decorateIcons(block.querySelector('.canvas-content'));
}
