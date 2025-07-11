/* eslint-disable no-unneeded-ternary */
/* eslint-disable prefer-object-spread */
/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
/* eslint-disable key-spacing */
/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-underscore-dangle */
/* eslint-disable lines-between-class-members */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import { AdobeDataLayerService, CdpEvent, PageLoadStartedEvent } from '@repobit/dex-data-layer';
import { Constants } from '@repobit/dex-constants';
import { User } from '@repobit/dex-utils';
import { sampleRUM } from './lib-franklin.js';
import page from './page.js';
import {
  getMetadata,
  shouldABTestsBeDisabled,
  generatePageLoadStartedName,
  GLOBAL_EVENTS,
} from './utils/utils.js';

if (!window.Promise.withResolvers) {
  window.Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { resolve, reject, promise };
  };
}

class Target {
  urlParameters;
  profileUrlParameters;
  cachedMboxes;
  _configMbox;
  controller;
  _visitorInfo;
  cdpData;

  constructor(config) {
    this.urlParameters = this.getUrlParameters();
    this.profileUrlParameters = this.transfromIntoProfileParameters(this.urlParameters);
    this.cachedMboxes = new Map();
    this.controller = new AbortController();

    if (!window.alloyProxy) {
      function __alloy(...args) {
        return new Promise((resolve, reject) => {
          window.alloyProxy.q.push([resolve, reject, args]);
        });
      }

      window.alloyProxy = __alloy;
      window.alloyProxy.q = [];
    }

    // check for dotest=1 in URL. If it exists abort all target calls
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dotest') === '1') {
      this.abort();
    }

    this._visitorInfo = new Promise((resolve) => {
      if (this.controller.signal?.aborted) {
        resolve({});
      }

      window.alloyProxy("getIdentity").then(result => resolve(result))
        .catch(() => resolve({}));
      this.controller.signal?.addEventListener("abort", () => resolve({}));
    });
    this.cdpData = config?.pageLoadStartedEvent && urlParams.get('dotest') !== '1'
      ? this.sendCdpData(config?.pageLoadStartedEvent)
      : Promise.resolve({});
    this._configMbox = this.getOffers({ mboxNames: 'config-mbox' });
  }

  /** get an object containing all the url query parameters */
  getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const parameters = {};

    urlParams.forEach((value, key) => {
      parameters[key] = value;
    });

    return parameters;
  }

  get configMbox() {
    return this._configMbox;
  }

  get visitorInfo() {
    return this._visitorInfo;
  }

  /** add adobe_mc parameter at the end of the url */
  appendVisitorIDsTo(url) {
    if (this.controller.signal?.aborted || url.includes('adobe_mc')) {
      return Promise.resolve(url);
    }

    return new Promise((resolve) => {
      window.alloyProxy("appendIdentityToUrl", { url }).then(result => resolve(result.url))
        .catch(() => resolve(url));
      this.controller.signal?.addEventListener("abort", () => resolve(url));
    });
  }

  /** abort all the Target calls for casese where Target does not load */
  abort() {
    this.controller.abort();
  }

  async sendCdpData(pageLoadStartedEvent) {
    const cdpDataPromise = Promise.withResolvers();
    let cdpData = {};
    if (window.BD.state.cdpDataPromise) {
      return await window.BD.state.cdpDataPromise;
    }
    window.BD.state.cdpDataPromise = cdpDataPromise.promise;

    try {
      const ecid = (await this.visitorInfo)?.identity?.ECID;
      const cdpDataCall = await fetch(
        `${Constants.PUBLIC_URL_ORIGIN}/cdp/`,
        {
          method: 'POST',
          body  : JSON.stringify({
            mcvisid: ecid || '',
            ...pageLoadStartedEvent.page
          })
        }
      );

      /** @type {{auds: string[], mdl: {key: string, value: string}[], ub: any[] vid: string}} */
      const receivedCdpData = await cdpDataCall.json();
      cdpData = {
        auds: receivedCdpData?.auds[0] || ''
      };

      if (receivedCdpData.mdl) {
        cdpData = receivedCdpData?.mdl.reduce((acc, mdlValue) => {
          acc[mdlValue.key] = mdlValue.value;
          return acc;
        }, cdpData);
      }

      AdobeDataLayerService.push(new CdpEvent(cdpData));
    } catch (e) {
      console.warn(e);
    }

    cdpDataPromise.resolve(cdpData);
    return cdpData;
  }

  transfromIntoProfileParameters(object) {
    const profileObject = Object.keys(object).reduce((acc, key) => {
      acc[`profile.${key}`] = object[key];
      return acc;
    }, {});

    return profileObject;
  }

  async getOffers(param) {
    let { mboxNames } = param;
    const isInitialyArray = Array.isArray(mboxNames);
    const { parameters, profileParameters } = param;
    if (!Array.isArray(mboxNames)) {
      mboxNames = [mboxNames];
    }

    const cdpData = await this.cdpData;
    if (this.controller.signal?.aborted) {
      return mboxNames.length > 1 ? {} : undefined;
    }

    const notRequestedMboxes = mboxNames.filter(
      mbox => !this.cachedMboxes.has(`${mbox}_${JSON.stringify(parameters)}`)
    );
    if (notRequestedMboxes.length) {
      const notRequestedOffersCall = window.alloyProxy('sendEvent', {
        type          : "decisioning.propositionFetch",
        decisionScopes: notRequestedMboxes,
        data          : {
          "__adobe": {
            "target": Object.assign(
              {},
              this.urlParameters,
              this.profileUrlParameters,
              parameters ? parameters : {},
              profileParameters ? profileParameters : {},
              cdpData,
              this.transfromIntoProfileParameters(cdpData)
            )
          }
        },
        renderDecisions: true
      });

      notRequestedOffersCall.then(result => {
        console.log("Proposition Fetch response for ", notRequestedMboxes, " : ", result);
        window.alloyProxy('applyPropositions', {
          "propositions": result.propositions,
          "viewName"    : window.location.href
        });
      });

      notRequestedMboxes.forEach(mbox => {
        const receivedMboxOfferCall = new Promise((resolve, reject) => {
          notRequestedOffersCall.then(result => {
            const mboxResult = result.propositions.find(
              (offer) => offer.scope === mbox
            )?.items[0].data?.content;

            resolve(mboxResult);
          }).catch(e => {
            reject(e);
          });

          this.controller.signal?.addEventListener("abort", reject);
        });

        this.cachedMboxes.set(`${mbox}_${JSON.stringify(parameters)}_${JSON.stringify(profileParameters)}`, receivedMboxOfferCall);
      });
    }

    const mboxesPromises = mboxNames.map(
      mboxName => this.cachedMboxes.get(`${mboxName}_${JSON.stringify(parameters)}_${JSON.stringify(profileParameters)}`)
    );
    const resolvedMboxes = await Promise.allSettled(mboxesPromises);

    const offersResult = mboxNames.reduce((acc, mboxName, index) => {
      acc[mboxName] = resolvedMboxes[index].status === 'fulfilled' ? resolvedMboxes[index].value : undefined;
      return acc;
    }, {});

    return isInitialyArray ? offersResult : offersResult[mboxNames[0]];
  }
}

window.BD = window.BD || {};
window.BD.state = window.BD.state || {};

export const target = new Target({
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

export function appendAdobeMcLinks(selector) {
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
export const getTargetExperimentDetails = async () => {
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
    const { url, template, metadata } = offer || {};
    if (template) {
      loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${template}.css`);
      document.body.classList.add(template);
    }

    // Update meta tags from the page if an experiment is encountered
    if (metadata) {
      Object.entries(metadata).forEach(([name, value]) => {
        const headMetaElement = document.head.querySelector(`meta[name="${name}"]`);
        if (headMetaElement) {
          headMetaElement.content = value;
        }
      });
    }
    targetExperimentDetails = await runTargetExperiment(url, targetExperimentId);
  }

  return targetExperimentDetails;
};

export function adobeMcAppendVisitorId(selector) {
  // https://experienceleague.adobe.com/docs/id-service/using/id-service-api/methods/appendvisitorid.html?lang=en

  if (window.ADOBE_MC_EVENT_LOADED) {
    appendAdobeMcLinks(selector);
  } else {
    document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, () => {
      appendAdobeMcLinks(selector);
    });
  }
}
