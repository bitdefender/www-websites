import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateTags,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata, loadScript,
} from './lib-franklin.js';

import {
  adobeMcAppendVisitorId,
  createTag,
  getDefaultLanguage,
  getParamValue,
  GLOBAL_EVENTS,
} from './utils/utils.js';

import { loadAnalytics } from './analytics.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
const TRACKED_PRODUCTS = [];
const TRACKED_PRODUCTS_COMPARISON = [];

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = getDefaultLanguage();

export const DEFAULT_COUNTRY = getDefaultLanguage();

export const METADATA_ANALYTICS_TAGS = 'analytics-tags';

const TARGET_TENANT = 'bitdefender';

const HREFLANG_MAP = new Map([
  ['en-ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
  ['de', { baseUrl: 'https://www.bitdefender.de', pageType: '.html' }],
  ['sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
  ['pt', { baseUrl: 'https://www.bitdefender.pt', pageType: '.html' }],
  ['en-sv', { baseUrl: 'https://www.bitdefender.se', pageType: '.html' }],
  ['pt-BR', { baseUrl: 'https://www.bitdefender.com.br', pageType: '.html' }],
  ['en', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
  ['it', { baseUrl: 'https://www.bitdefender.it', pageType: '.html' }],
  ['fr', { baseUrl: 'https://www.bitdefender.fr', pageType: '.html' }],
  ['nl-BE', { baseUrl: 'https://www.bitdefender.be', pageType: '.html' }],
  ['es', { baseUrl: 'https://www.bitdefender.es', pageType: '.html' }],
  ['en-AU', { baseUrl: 'https://www.bitdefender.com.au', pageType: '' }],
  ['ro', { baseUrl: 'https://www.bitdefender.ro', pageType: '.html' }],
  ['nl', { baseUrl: 'https://www.bitdefender.nl', pageType: '.html' }],
  ['en-GB', { baseUrl: 'https://www.bitdefender.co.uk', pageType: '.html' }],
  ['zh-hk', { baseUrl: 'https://www.bitdefender.com/zh-hk', pageType: '' }],
  ['zh-tw', { baseUrl: 'https://www.bitdefender.com/zh-tw', pageType: '' }],
  ['x-default', { baseUrl: 'https://www.bitdefender.com', pageType: '.html' }],
]);

window.hlx.plugins.add('rum-conversion', {
  load: 'lazy',
  url: '../plugins/rum-conversion/src/index.js',
});

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment'),
  options: {
    prodHost: 'www.bitdefender.com.au',
  },
  url: '../plugins/experimentation/src/index.js',
});

window.ADOBE_MC_EVENT_LOADED = false;

function initMobileDetector(viewport) {
  const mobileDetectorDiv = document.createElement('div');
  mobileDetectorDiv.setAttribute(`data-${viewport}-detector`, '');
  document.body.append(mobileDetectorDiv);
}

export function isView(viewport) {
  const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
  return !!(element && getComputedStyle(element).display !== 'none');
}

/**
 * Creates a meta tag with the given name and value and appends it to the head.
 * @param {String} name The name of the meta tag
 * @param {String} value The value of the meta tag
 */
export function createMetadata(name, value) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', value);
  document.head.append(meta);
}

export function getLanguageCountryFromPath() {
  return {
    language: DEFAULT_LANGUAGE,
    country: DEFAULT_COUNTRY,
  };
}

/**
 * Returns the current user operating system based on userAgent
 * @returns {String}
 */
export function getOperatingSystem(userAgent) {
  const systems = [
    ['Windows NT 10.0', 'Windows 10'],
    ['Windows NT 6.2', 'Windows 8'],
    ['Windows NT 6.1', 'Windows 7'],
    ['Windows NT 6.0', 'Windows Vista'],
    ['Windows NT 5.1', 'Windows XP'],
    ['Windows NT 5.0', 'Windows 2000'],
    ['X11', 'X11'],
    ['Linux', 'Linux'],
    ['Android', 'Android'],
    ['iPhone', 'iOS'],
    ['iPod', 'iOS'],
    ['iPad', 'iOS'],
    ['Mac', 'MacOS'],
  ];

  return systems.find(([substr]) => userAgent.includes(substr))?.[1] || 'Unknown';
}

export function openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos) {
  // Get user's operating system
  const { userAgent } = navigator;
  const userOS = getOperatingSystem(userAgent);

  // Open the appropriate URL based on the OS
  let openUrl;
  switch (userOS) {
    case 'MacOS':
      openUrl = urlMacos;
      break;
    case 'Windows 10':
    case 'Windows 8':
    case 'Windows 7':
    case 'Windows Vista':
    case 'Windows XP':
    case 'Windows 2000':
      openUrl = urlWindows;
      break;
    case 'Android':
      openUrl = urlAndroid;
      break;
    case 'iOS':
      openUrl = urlIos;
      break;
    default:
      openUrl = null; // Fallback or 'Unknown' case
  }

  if (openUrl) {
    window.open(openUrl, '_self');
  }
}

/**
 * Returns the current user time in the format HH:MM|HH:00-HH:59|dayOfWeek|timezone
 * @returns {String}
 */
function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const dayOfWeek = date.getDay();
  const timezone = date.toTimeString().split(' ')[1];
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${hours}:${minutes}|${hours}:00-${hours}:59|${weekday[dayOfWeek]}|${timezone}`;
}

/**
 * Returns the current GMT date in the format DD/MM/YYYY
 * @returns {String}
 */
function getCurrentDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Returns the environment name based on the hostname
 * @returns {String}
 */
export function getEnvironment(hostname) {
  if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) {
    return 'stage';
  }
  if (hostname.includes('www.bitdefender')) {
    return 'prod';
  }
  return 'dev';
}

export function getDomain() {
  return window.location.pathname.split('/').filter((item) => item)[0];
}

export function getLocalizedResourceUrl(resourceName) {
  const { pathname } = window.location;
  const lastCharFromUrl = pathname.charAt(pathname.length - 1);
  const lpIsInFolder = lastCharFromUrl === '/';

  let pathnameAsArray = pathname.split('/');

  if (lpIsInFolder) {
    return `${pathnameAsArray.join('/')}${resourceName}`;
  }

  const basePathIndex = pathname.startsWith('/pages/') ? 3 : 2;
  pathnameAsArray = pathnameAsArray.slice(0, basePathIndex + 1); // "/consumer/en";

  return `${pathnameAsArray.join('/')}/${resourceName}`;
}

/**
 * Sets the page language.
 * @param {Object} param The language and country
 */
function setPageLanguage(param) {
  document.documentElement.lang = param.language;
  createMetadata('nav', `${getLocalizedResourceUrl('nav')}`);
  createMetadata('footer', `${getLocalizedResourceUrl('footer')}`);
}

export function pushToDataLayer(event, payload) {
  if (!event) {
    // eslint-disable-next-line no-console
    console.error('The data layer event is missing');
    return;
  }
  if (!window.adobeDataLayer) {
    window.adobeDataLayer = [];
    window.adobeDataLayerInPage = true;
  }
  window.adobeDataLayer.push({ event, ...payload });
}

export function getTags(tags) {
  return tags ? tags.split(':').filter((tag) => !!tag).map((tag) => tag.trim()) : [];
}

export function trackProduct(product, location = '') {
  // eslint-disable-next-line max-len
  if (!product && product.length === 0) return;
  if (location && location === 'comparison') {
    const isDuplicate = TRACKED_PRODUCTS_COMPARISON.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
    if (!isDuplicate) TRACKED_PRODUCTS_COMPARISON.push(product);
  } else {
    const isDuplicate = TRACKED_PRODUCTS.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
    if (!isDuplicate) TRACKED_PRODUCTS.push(product);
  }
}

export function pushProductsToDataLayer() {
  const url = window.location.href;
  const isHomepageSolutions = url.split('/').filter(Boolean).pop();
  const key = isHomepageSolutions === 'consumer' ? 'all' : 'info';

  const mapProductData = (products) =>
    products.map((product) => {
      const {
        platformProductId,
        productId,
        productCode,
        devices,
        subscription,
        version,
        basePrice,
        discount,
        discountRate,
        currency_iso,
        actualPrice,
      } = product;

      return Object.fromEntries(
        Object.entries({
          ID: platformProductId || productId,
          name: platformProductId ? productCode : undefined,
          devices,
          subscription,
          version,
          basePrice,
          discountValue: discount,
          discountRate,
          currency: currency_iso,
          priceWithTax: actualPrice,
        }).filter(([_, value]) => value !== undefined)
      );
    });

  let productAlreadyLoaded = adobeDataLayer.some(item => item.event === 'product loaded');

  // if product loaded already exists we only add comparison array if e have it in the page
  if (productAlreadyLoaded) {
    adobeDataLayer.forEach(item => {
      if (item.event === 'product loaded') {
          // Ensure item.product exists and has the expected structure
          if (key === 'all' && item.product && item.product.info) {
            item.product = {
              ...item.product,
              all: item.product.info
            };
              delete item.product.info;
          }

          // check if TRACKED_PRODUCTS_COMPARISON has items and add it to the event
          if (TRACKED_PRODUCTS_COMPARISON && TRACKED_PRODUCTS_COMPARISON.length && item.product) {
              item.product.comparison = TRACKED_PRODUCTS_COMPARISON;
          }
      }
  });

  } else {
    if (!TRACKED_PRODUCTS.length && TRACKED_PRODUCTS_COMPARISON.length) {
      TRACKED_PRODUCTS.push({ productId: TRACKED_PRODUCTS_COMPARISON[0].productId });
    }

    const dataLayerProduct = {
      product: {
        [key]: mapProductData(TRACKED_PRODUCTS),
        ...(TRACKED_PRODUCTS_COMPARISON.length && { comparison: mapProductData(TRACKED_PRODUCTS_COMPARISON) }),
      },
    };

    pushToDataLayer('product loaded', dataLayerProduct);
  }

  console.log('adobeDataLayer', adobeDataLayer);
}

export function pushTrialDownloadToDataLayer() {
  const getTrialID = () => (
    ((TRACKED_PRODUCTS && TRACKED_PRODUCTS.length > 0 && TRACKED_PRODUCTS[0].productCode) || (TRACKED_PRODUCTS_COMPARISON && TRACKED_PRODUCTS_COMPARISON.length > 0 && TRACKED_PRODUCTS_COMPARISON[0].productCode))
    || getMetadata('breadcrumb-title')
    || getMetadata('og:title')
  );

  const url = window.location.href;
  const currentPage = url.split('/').filter(Boolean).pop();
  const downloadType = currentPage === 'thank-you' ? 'product downloaded' : 'trial downloaded';

  const pushTrialData = () => {
    const dataLayerDownload = { product: {trial: [{ ID: getTrialID() }] } };
    pushToDataLayer(downloadType, dataLayerDownload);
  };

  const sections = document.querySelectorAll('a.button.modal');
  if (sections.length) {
    sections.forEach((button) => {
      const href = button.getAttribute('href');
      if (href.includes('fragments/thank-you-for-downloading') || href.includes('fragments/get-bitdefender')) {
        button.addEventListener('click', pushTrialData);
      }
    });
  } else if (currentPage === 'thank-you') {
    pushTrialData();
  }
}

export function decorateBlockWithRegionId(element, id) {
  // we could consider to use `element.setAttribute('s-object-region', id);` in the future
  if (element) element.id = id;
}

export function decorateLinkWithLinkTrackingId(element, id) {
  if (element) element.setAttribute('s-object-id', id);
}

/**
 * Decorates picture elements with a link to a video.
 * @param {Element} main The main element
 */
export default function decorateLinkedPictures(main) {
  main.querySelectorAll('picture').forEach((picture) => {
    // this condition checks if the picture is part of some content block ( rte )
    // and not a direct element in some DIV block
    // that could have different behaviour for some blocks (ex: columns )
    if (!picture.closest('div.block') && picture.parentElement.tagName !== 'DIV') {
      const next = picture.parentNode.nextElementSibling;
      if (next) {
        const a = next.querySelector('a');
        const link = a?.textContent;
        /* Modal video */
        if (a && link.startsWith('https://') && link.includes('fragments')) {
          a.innerHTML = '';
          a.className = 'video-placeholder';
          a.appendChild(picture);
          const overlayPlayButton = document.createElement('span');
          overlayPlayButton.className = 'video-placeholder-play';
          a.appendChild(overlayPlayButton);
          a.addEventListener('click', async (event) => {
            event.preventDefault();
            // eslint-disable-next-line no-use-before-define
            const modalContainer = await createModal(link, 'video-modal');
            document.body.append(modalContainer);
          });
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('modal-video-container');
          }
          return;
        }
        // Basic linked image
        if (a && link.startsWith('https://')) {
          a.innerHTML = '';
          a.className = 'linked-image';
          const pictureParent = picture.parentNode;
          a.append(picture);
          if (pictureParent.children.length === 0) {
            pictureParent.parentNode.removeChild(pictureParent);
          }
          const up = a.parentElement;
          if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
            up.classList.add('linked-image-container');
          }
        }
      }
    }
  });
}

function addHreflangTags() {
  if (document.querySelectorAll('head link[hreflang]').length > 0) return;

  const path = window.location.pathname;
  const pathCount = path.split('/').filter(String).length;

  Object.keys(HREFLANG_MAP).forEach((key) => {
    const hreflang = HREFLANG_MAP[key][0];
    const href = `${HREFLANG_MAP[key][1].baseUrl}${path}${pathCount > 1 ? HREFLANG_MAP[key][1].pageType : ''}`;
    const ln = document.createElement('link');
    ln.setAttribute('rel', 'alternate');
    ln.setAttribute('hreflang', hreflang);
    ln.setAttribute('href', href);
    document.querySelector('head').appendChild(ln);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateTags(main);
  decorateLinkedPictures(main);
  decorateSections(main);
  decorateBlocks(main);
  addHreflangTags();
}

/**
 *
 * @param {String} path The path to the modal
 * @param {String} template The template to use for the modal styling
 * @param {Boolean} stopAutomaticRefresh Wether the modal refreshes after exiting or not
 * @returns {Promise<Element>}
 * @example
 */
export async function createModal(path, template, stopAutomaticRefresh) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

  // add the class which makes the modal identifiable in the page
  if (stopAutomaticRefresh) {
    const modalClass = path.split('/').pop();
    modalContainer.classList.add(modalClass);
  }

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // fetch modal content
  const resp = await fetch(`${path}.plain.html`);

  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error(`modal url cannot be loaded: ${path}`);
    return modalContainer;
  }

  const html = await resp.text();
  modalContent.innerHTML = html;

  decorateMain(modalContent);
  await loadBlocks(modalContent);
  modalContainer.append(modalContent);

  // add class to modal container for opportunity to add custom modal styling
  if (template) modalContainer.classList.add(template);

  const closeModal = () => {
    // if the modal is still supposed to exist just hide it
    if (stopAutomaticRefresh) {
      modalContainer.classList.add('global-display-none');
      return;
    }

    // if it's supposed to refresh delete it so that it can be rerendered
    modalContainer.remove();
  };

  const close = document.createElement('div');
  close.classList.add('modal-close');
  close.addEventListener('click', closeModal);
  modalContent.append(close);
  return modalContainer;
}

export async function detectModalButtons(main) {
  main.querySelectorAll('a.button.modal').forEach((link) => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const stopAutomaticModalRefresh = link.dataset.stopAutomaticModalRefresh === 'true';

      // if we wish for the button to not generate a new modal everytime
      if (stopAutomaticModalRefresh) {
        // we use the last part of the link to identify the modals
        const modalClass = link.href.split('/').pop();

        // check if the modal exists in the page
        const existingModal = document.querySelector(`div.modal-container.${modalClass}`);
        if (existingModal) {
          // if it exists just display it
          existingModal.classList.remove('global-display-none');
          return;
        }
      }

      // generate new modal
      document.body.append(await createModal(link.href, undefined, stopAutomaticModalRefresh));
    });
  });
}

function populateColumns(section) {
  if (section.querySelectorAll('.columns div div').length === 2) {
    const rightColContainer = section.querySelector('.columns div div:last-child');
    rightColContainer.classList.add('right-col');
    section.querySelector('.columns div div:last-child').classList.add('right-col');
    const leftColContainer = section.querySelector('.columns div div:first-child');
    leftColContainer.classList.add('left-col');

    section.querySelectorAll('.right-column').forEach((el) => rightColContainer.append(el));
    section.querySelectorAll('.left-column').forEach((el) => leftColContainer.append(el));
  }
}

function populateHero(section) {
  if (section.querySelectorAll('.hero div div').length === 2) {
    const rightColContainer = section.querySelector('.hero div div:last-child');
    rightColContainer.classList.add('right-col');
    section.querySelector('.hero div div:last-child').classList.add('right-col');
    const leftColContainer = section.querySelector('.hero div div:first-child');
    leftColContainer.classList.add('left-col');

    section.querySelectorAll('.right-column').forEach((el) => rightColContainer.append(el));
    section.querySelectorAll('.left-column').forEach((el) => leftColContainer.append(el));
  }
}

function buildTwoColumnsSection(main) {
  main.querySelectorAll('div.section.two-columns').forEach((section) => {
    populateHero(section);
    populateColumns(section);
  });
}

function buildCta(section) {
  populateColumns(section);
  const fullWidthContainer = createTag(
    'div',
    { class: 'full-width' },
    '',
  );
  [...section.children].forEach((el) => fullWidthContainer.append(el));
  section.append(fullWidthContainer);
}

function buildCtaSections(main) {
  main.querySelectorAll('div.section.cta, div.section.footer-cta')
    .forEach(buildCta);
}

function getDomainInfo(hostname) {
  const domain = hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\\_]{3,}(\.|:)?(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/);
  return {
    domain: domain[1],
    domainPartsCount: domain[1].split('.').length,
  };
}

function getExperimentDetails() {
  if (!window.hlx || !window.hlx.experiment) {
    return null;
  }

  const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
  return { experimentId, experimentVariant };
}

function pushPageLoadToDataLayer(targetExperimentDetails) {
  const { hostname } = window.location;
  if (!hostname) {
    return;
  }
  const { domain, domainPartsCount } = getDomainInfo(hostname);
  const languageCountry = getLanguageCountryFromPath(window.location.pathname);
  const environment = getEnvironment(hostname, languageCountry.country);
  const experimentDetails = targetExperimentDetails ?? getExperimentDetails();
  // eslint-disable-next-line no-console
  console.debug(`Experiment details: ${JSON.stringify(experimentDetails)}`);

  const langCountry = navigator.language || navigator.userLanguage || languageCountry.language;
  const [lang, country] = langCountry.split('-');
  const urlPath = window.location.pathname;
  const allSegments = urlPath.split('/');
  const lastSegment = allSegments[allSegments.length - 1].replace('-', ' ');
  let siteSubSection = urlPath.indexOf('/consumer/') !== -1 ? 'consumer' : 'business';
  const tagName = `${lang}:${siteSubSection}:product:${lastSegment}`;

  pushToDataLayer('page load started', {
    pageInstanceID: environment,
    page: {
      info: {
        name: tagName, // e.g. au:consumer:product:internet security
        section: '',
        subSection: siteSubSection,
        subSubSection: 'product',
        subSubSubSection: lastSegment,
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('adobe_mc_ref') || getParamValue('ref') || document.referrer || '',
        serverName: 'hlx.live', // indicator for AEM Success Edge
        language: lang,
        sysEnv: getOperatingSystem(window.navigator.userAgent),
        ...(experimentDetails && { experimentDetails }),
      },
      attributes: {
        promotionID: getParamValue('pid') || '',
        internalPromotionID: getParamValue('icid') || '',
        trackingID: getParamValue('cid') || '',
        time: getCurrentTime(),
        date: getCurrentDate(),
        domain,
        domainPeriod: domainPartsCount,
      },
    },
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  setPageLanguage(getLanguageCountryFromPath(window.location.pathname));
  decorateTemplateAndTheme();

  await window.hlx.plugins.run('loadEager');

  let targetExperimentDetails = null;
  if (getMetadata('target-experiment') !== '') {
    const { runTargetExperiment } = await import('./target.js');
    targetExperimentDetails = await runTargetExperiment(TARGET_TENANT);
  }

  pushPageLoadToDataLayer(targetExperimentDetails);

  const templateMetadata = getMetadata('template');
  const hasTemplate = getMetadata('template') !== '';
  if (hasTemplate) {
    loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}.css`);
    // loadScript(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}.js`, {
    //   type: 'module',
    // });
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    buildCtaSections(main);
    buildTwoColumnsSection(main);
    detectModalButtons(main);
    document.body.classList.add('appear');
    if (window.location.href.indexOf('scuderiaferrari') !== -1) {
      document.body.classList.add('sferrari');
    }
    await waitForLCP(LCP_BLOCKS);
  }
}

export async function loadTrackers() {
  const isPageNotInDraftsFolder = window.location.pathname.indexOf('/drafts/') === -1;

  const onAdobeMcLoaded = () => {
    document.dispatchEvent(new Event(GLOBAL_EVENTS.ADOBE_MC_LOADED));
    window.ADOBE_MC_EVENT_LOADED = true;
  };

  if (isPageNotInDraftsFolder) {
    const LANGUAGE_COUNTRY = getLanguageCountryFromPath(window.location.pathname);
    const LAUNCH_URL = 'https://assets.adobedtm.com';
    const ENVIRONMENT = getEnvironment(window.location.hostname, LANGUAGE_COUNTRY.country);

    // Load Adobe Experience platform data collection (Launch) script
    // const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();

    const ADOBE_MC_URL_ENV_MAP = new Map([
      ['prod', '8a93f8486ba4/5492896ad67e/launch-b1f76be4d2ee.min.js'],
      ['stage', '8a93f8486ba4/5492896ad67e/launch-3e7065dd10db-staging.min.js'],
      ['dev', '8a93f8486ba4/5492896ad67e/launch-fbd6d02d30e8-development.min.js'],
    ]);

    const adobeMcScriptUrl = `${LAUNCH_URL}/${ADOBE_MC_URL_ENV_MAP.get(ENVIRONMENT)}`;
    await loadScript(adobeMcScriptUrl);

    onAdobeMcLoaded();

    await loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-PLJJB3');
  } else {
    onAdobeMcLoaded();
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  const pageIsNotInFragmentsFolder = window.location.pathname.indexOf('/fragments/') === -1;

  if (pageIsNotInFragmentsFolder) {
    // eslint-disable-next-line no-unused-vars
    loadHeader(doc.querySelector('header'));
  }
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  if (pageIsNotInFragmentsFolder) {
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  window.hlx.plugins.run('loadLazy');

  const templateMetadata = getMetadata('template');
  const hasTemplate = getMetadata('template') !== '';
  if (hasTemplate) {
    loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}-lazy.css`);
  }

  loadTrackers();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Event listener for dropdown slider dropdown-box.js component.
 * This is imported from www-landing-pages repo.
 * @returns {void}
* */
function eventOnDropdownSlider() {
  document.querySelectorAll('.dropdown-slider').forEach((slider) => {
    const titles = slider.querySelectorAll('.title');
    const loadingBars = slider.querySelectorAll('.loading-bar');
    let activeIndex = 0;
    let interval;

    function showLoadingBar(index) {
      const loadingBar = loadingBars[index];
      loadingBar.style.width = '0';
      let width = 0;
      const interval2 = setInterval(() => {
        width += 1;
        loadingBar.style.width = `${width}%`;
        if (width >= 100) {
          clearInterval(interval2);
        }
      }, 30); // Adjust the interval for smoother animation
    }

    function moveToNextItem() {
      titles.forEach((title, index) => {
        if (index === activeIndex) {
          title.parentNode.classList.add('active');
          title.closest('.dropdown-slider').setAttribute('style', `min-height: ${title.parentNode.querySelector('.description').offsetHeight + 50}px`);
          if (loadingBars.length) {
            showLoadingBar(index);
          }
        } else {
          title.parentNode.classList.remove('active');
        }
      });

      activeIndex = (activeIndex + 1) % titles.length; // Move to the next item and handle wrapping
    }

    function startAutomaticMovement() {
      interval = setInterval(moveToNextItem, 4000); // Set the interval
    }

    function stopAutomaticMovement() {
      clearInterval(interval); // Clear the interval
    }

    // Set the initial active item
    moveToNextItem();

    if (loadingBars.length) {
      // Start automatic movement after the loading is complete
      setTimeout(() => {
        startAutomaticMovement();
      }, 1000);

      // Click event listener on titles
      titles.forEach((title, index) => {
        title.addEventListener('click', () => {
          stopAutomaticMovement();
          activeIndex = index;
          showLoadingBar(index);
          moveToNextItem();
          startAutomaticMovement();
        });
      });
    }
  });
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    // load anything that can be postponed to the latest here
    eventOnDropdownSlider();
    // eslint-disable-next-line import/no-cycle
    return import('./delayed.js');
  }, 3000);
}

async function loadPage() {
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);

  const setupAnalytics = loadAnalytics(document, {
    edgeConfigId: '7275417f-3870-465c-af3e-84f8f4670b3c',
    orgId: '0E920C0F53DA9E9B0A490D45@AdobeOrg',
  });

  adobeMcAppendVisitorId('main');

  loadDelayed();
  await setupAnalytics;
}

initMobileDetector('mobile');
initMobileDetector('tablet');
initMobileDetector('desktop');

loadPage();
