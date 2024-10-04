/* eslint-disable max-classes-per-file */
import { getMetadata, sampleRUM } from './lib-franklin.js';

const ADOBE_TARGET_SESSION_ID_PARAM = 'adobeTargetSessionId';

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
 * Generate a random session id.
 * @param length
 * @returns {string}
 */
function generateSessionID(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sessionID = '';
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    sessionID += characters.charAt(randomIndex);
  }
  return sessionID;
}

/**
 * Get or create a session id for the current user.
 * @returns {string}
 */
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(ADOBE_TARGET_SESSION_ID_PARAM);
  // eslint-disable-next-line no-console
  console.debug(`Session id: ${sessionId}`);
  if (!sessionId) {
    sessionId = generateSessionID();
    // eslint-disable-next-line no-console
    console.debug(`Generated new session id: ${sessionId}`);
    sessionStorage.setItem(ADOBE_TARGET_SESSION_ID_PARAM, sessionId);
  }
  return sessionId;
}

/**
 * Fetch the target offers for the current location.
 * @returns {Promise<boolean>}
 */
async function fetchChallengerPageUrl(tenant, targetLocation) {
  // eslint-disable-next-line no-console
  console.debug(`Fetching target offers for location: ${targetLocation}`);
  const res = await fetch(`https://${tenant}.tt.omtrdc.net/rest/v1/delivery?client=${tenant}&sessionId=${getOrCreateSessionId()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context: {
        channel: 'web',
      },
      execute: {
        pageLoad: {},
        mboxes: [
          {
            name: targetLocation,
            index: 0,
          },
        ],
      },
    }),
  });

  const payload = await res.json();
  const mbox = payload.execute.mboxes.find((m) => m.name === targetLocation);
  const { url } = mbox?.options[0].content ?? { url: null };
  if (!url) {
    // eslint-disable-next-line no-console
    console.error('No challenger url found');
    throw new Error('No challenger url found');
  }

  // eslint-disable-next-line no-console
  console.debug(`Resolved challenger url: ${url}`);
  return url;
}

/**
 * Replace the current page with the challenger page.
 * @param url The challenger page url.
 * @returns {Promise<boolean>}
 */
async function navigateToChallengerPage(url) {
  const plainPath = getPlainPageUrl(url);

  // eslint-disable-next-line no-console
  console.debug(`Navigating to challenger page: ${plainPath}`);

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

// eslint-disable-next-line import/prefer-default-export
export async function runTargetExperiment(clientId) {
  try {
    const experimentId = getMetadata('target-experiment');
    const targetLocation = getMetadata('target-experiment-location');
    if (!experimentId || !targetLocation) {
      // eslint-disable-next-line no-console
      console.log('Experiment id or target location not found');
      return null;
    }

    // eslint-disable-next-line no-console
    console.debug(`Running Target experiment ${experimentId} at location ${targetLocation}`);

    const pageUrl = await fetchChallengerPageUrl(clientId, targetLocation);
    // eslint-disable-next-line no-console
    console.debug(`Challenger page url: ${pageUrl}`);

    await navigateToChallengerPage(pageUrl);

    sampleRUM('target-experiment', {
      source: `target:${experimentId}`,
      target: pageUrl,
    });

    return {
      experimentId,
      experimentVariant: pageUrl,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error running target experiment:', e);
    return null;
  }
}
