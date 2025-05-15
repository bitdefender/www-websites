import Target from '../node_modules/@repobit/dex-target/dist/src/index.js';
import '../node_modules/@repobit/dex-data-layer/dist/src/adobe-data-layer-service/index.js';
import { PageLoadStartedEvent } from '../node_modules/@repobit/dex-data-layer/dist/src/events/page-load-started-event/index.js';
import '../node_modules/@repobit/dex-utils/dist/src/index.js';
import { sampleRUM } from './lib-franklin.js';
import page from './page.js';
import { generatePageLoadStartedName, GLOBAL_EVENTS, getMetadata, shouldABTestsBeDisabled } from './utils/utils.js';
import User from '../node_modules/@repobit/dex-utils/dist/src/user.js';

/* eslint-disable max-classes-per-file */

const target = new Target({
  pageLoadStartedEvent: new PageLoadStartedEvent(
    page,
    {
      name: generatePageLoadStartedName(),
      geoRegion: await User.country,
      serverName: 'hlx.live', // indicator for AEM Success Edge
    },
  ),
});

/**
 * Convert a URL to a relative URL.
 * @param url
 * @returns {*|string}
 */
function getPlainPageUrl(url) {
  const { pathname, search, hash } = new URL(url, window.location.href);
  const plainPagePathname = pathname.endsWith('/') ? `${pathname}index.plain.html` : `${pathname}.plain.html`;
  return `${plainPagePathname}${search}${hash}`;
}

/**
 * Replace the current page with the challenger page.
 * @param url The challenger page url.
 * @returns {Promise<boolean>}
 */
async function navigateToChallengerPage(url) {
  const plainPath = getPlainPageUrl(url);

  const resp = await fetch(plainPath);
  if (!resp.ok) {
    throw new Error(`Failed to fetch challenger page: ${resp.status}`);
  }

  const mainElement = document.querySelector('main');
  if (!mainElement) {
    throw new Error('Main element not found');
  }

  mainElement.innerHTML = await resp.text();
}

/**
* @param {string} experimentUrl
* @param {string} experimentId
* @return {Promise<{
*  experimentId: string;
*  experimentVariant: string;
* }|null>}
*/
// eslint-disable-next-line import/prefer-default-export
async function runTargetExperiment(experimentUrl, experimentId) {
  if (!experimentUrl) {
    return null;
  }

  try {
    await navigateToChallengerPage(experimentUrl);

    sampleRUM('target-experiment', {
      source: `target:${experimentId}`,
      target: experimentUrl,
    });

    return {
      experimentId,
      experimentVariant: experimentUrl,
    };
  } catch (e) {
    return null;
  }
}

function appendAdobeMcLinks(selector) {
  try {
    const wrapperSelector = typeof selector === 'string' ? document.querySelector(selector) : selector;

    const hrefSelector = '[href*=".bitdefender."]';
    wrapperSelector.querySelectorAll(hrefSelector).forEach(async (link) => {
      const destinationURLWithVisitorIDs = await target.appendVisitorIDsTo(link.href);
      link.href = destinationURLWithVisitorIDs.replace(/MCAID%3D.*%7CMCORGID/, 'MCAID%3D%7CMCORGID');
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

/**
* get experiment details from Target
* @returns {Promise<{
*  experimentId: string;
*  experimentVariant: string;
* } | null>}
  */
const getTargetExperimentDetails = async () => {
  /**
   * @type {{
   *  experimentId: string;
   *  experimentVariant: string;
   * }|null}
   */
  let targetExperimentDetails = null;

  async function loadCSS(href) {
    return new Promise((resolve, reject) => {
      if (!document.querySelector(`head > link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.append(link);
      } else {
        resolve();
      }
    });
  }

  const targetExperimentLocation = getMetadata('target-experiment-location');
  const targetExperimentId = getMetadata('target-experiment');
  if (targetExperimentLocation && targetExperimentId && !shouldABTestsBeDisabled()) {
    const offer = await target.getOffers({ mboxNames: targetExperimentLocation });
    const { url, template } = offer || {};
    if (template) {
      loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${template}.css`);
      document.body.classList.add(template);
    }
    targetExperimentDetails = await runTargetExperiment(url, targetExperimentId);
  }

  return targetExperimentDetails;
};

function adobeMcAppendVisitorId(selector) {
  // https://experienceleague.adobe.com/docs/id-service/using/id-service-api/methods/appendvisitorid.html?lang=en

  if (window.ADOBE_MC_EVENT_LOADED) {
    appendAdobeMcLinks(selector);
  } else {
    document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, () => {
      appendAdobeMcLinks(selector);
    });
  }
}

export { adobeMcAppendVisitorId, appendAdobeMcLinks, getTargetExperimentDetails, runTargetExperiment, target };
//# sourceMappingURL=target.js.map
