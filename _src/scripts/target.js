/* eslint-disable max-classes-per-file */
import { sampleRUM } from './lib-franklin.js';

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
export async function runTargetExperiment(experimentUrl, experimentId) {
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
