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
  createTag, getDefaultLanguage, GLOBAL_EVENTS,
} from './utils/utils.js';

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
const TRACKED_PRODUCTS = [];

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = getDefaultLanguage();

export const DEFAULT_COUNTRY = getDefaultLanguage();

export const METADATA_ANAYTICS_TAGS = 'analytics-tags';

window.hlx.plugins.add('rum-conversion', {
  load: 'lazy',
  url: '../plugins/rum-conversion/src/index.js',
});

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

/**
 * Returns the value of a query parameter
 * @returns {String}
 */
function getParamValue(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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

export function trackProduct(product) {
  // eslint-disable-next-line max-len
  const isDuplicate = TRACKED_PRODUCTS.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId);
  const tags = getTags(getMetadata(METADATA_ANAYTICS_TAGS));
  const isTrackedPage = tags.includes('product') || tags.includes('service');
  if (isTrackedPage && !isDuplicate) TRACKED_PRODUCTS.push(product);
}

export function pushProductsToDataLayer() {
  if (TRACKED_PRODUCTS.length > 0) {
    pushToDataLayer('product loaded', {
      product: TRACKED_PRODUCTS
        .map((p) => ({
          info: {
            ID: p.platformProductId,
            name: getMetadata('breadcrumb-title') || getMetadata('og:title'),
            devices: p.devices,
            subscription: p.subscription,
            version: p.version,
            basePrice: p.basePrice,
            discountValue: p.discount,
            discountRate: p.discountRate,
            currency: p.currency,
            priceWithTax: p.actualPrice,
          },
        })),
    });
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
}

/**
 *
 * @param {String} path The path to the modal
 * @param {String} template The template to use for the modal styling
 * @returns {Promise<Element>}
 * @example
 */
export async function createModal(path, template) {
  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');

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

  const closeModal = () => modalContainer.remove();
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
      document.body.append(await createModal(link.href));
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

function pushPageLoadToDataLayer() {
  const { hostname } = window.location;
  if (!hostname) {
    return;
  }

  const { domain, domainPartsCount } = getDomainInfo(hostname);
  const languageCountry = getLanguageCountryFromPath(window.location.pathname);
  const environment = getEnvironment(hostname, languageCountry.country);
  const tags = getTags(getMetadata(METADATA_ANAYTICS_TAGS));
  pushToDataLayer('page load started', {
    pageInstanceID: environment,
    page: {
      info: {
        name: [languageCountry.country, ...tags].join(':'), // e.g. au:consumer:product:internet security
        section: languageCountry.country || '',
        subSection: tags[0] || '',
        subSubSection: tags[1] || '',
        subSubSubSection: tags[2] || '',
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: getParamValue('adobe_mc_ref') || getParamValue('ref') || document.referrer || '',
        serverName: 'hlx.live', // indicator for AEM Success Edge
        language: navigator.language || navigator.userLanguage || languageCountry.language,
        sysEnv: getOperatingSystem(window.navigator.userAgent),
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

  // eslint-disable-next-line no-unused-vars
  loadHeader(doc.querySelector('header'));
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

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
  document.querySelectorAll('.dropdownSlider').forEach((slider) => {
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
          title.closest('.dropdownSlider').setAttribute('style', `min-height: ${title.parentNode.querySelector('.description').offsetHeight + 50}px`);
          showLoadingBar(index);
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
  pushPageLoadToDataLayer();
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  adobeMcAppendVisitorId('main');
  loadDelayed();
}

initMobileDetector('mobile');
initMobileDetector('tablet');
initMobileDetector('desktop');

loadPage();
