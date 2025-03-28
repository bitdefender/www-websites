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
  AdobeDataLayerService,
  PageLoadedEvent,
  PageLoadStartedEvent,
  resolveNonProductsDataLayer,
} from './libs/data-layer.js';
import { StoreResolver } from './libs/store/index.js';
import Page from './libs/page.js';

import {
  adobeMcAppendVisitorId,
  createTag,
  getPageExperimentKey,
  GLOBAL_EVENTS, pushTrialDownloadToDataLayer,
} from './utils/utils.js';
import { Constants } from './libs/constants.js';

const LCP_BLOCKS = ['hero', 'password-generator']; // add your LCP blocks to the list

export const SUPPORTED_LANGUAGES = ['en'];

window.hlx.plugins.add('rum-conversion', {
  load: 'lazy',
  url: '../plugins/rum-conversion/src/index.js',
});

window.hlx.plugins.add('experimentation', {
  condition: () => getMetadata('experiment'),
  options: {
    prodHost: 'www.bitdefender.com',
  },
  url: '../plugins/experimentation/src/index.js',
});

window.ADOBE_MC_EVENT_LOADED = false;

function initMobileDetector(viewport) {
  const mobileDetectorDiv = document.createElement('div');
  mobileDetectorDiv.setAttribute(`data-${viewport}-detector`, '');
  document.body.append(mobileDetectorDiv);
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
  const currentPathUrl = window.location.pathname;
  return {
    language: currentPathUrl.split('/')[1].split('-')[0],
    country: currentPathUrl.split('/')[1].split('-')[1],
  };
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
      const modalContainer = await createModal(link.href, undefined, stopAutomaticModalRefresh);
      document.body.append(modalContainer);
      await StoreResolver.resolve(modalContainer);
      modalContainer.querySelectorAll('.await-loader').forEach((element) => {
        element.classList.remove('await-loader');
      });
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

export async function loadTrackers() {
  const isPageNotInDraftsFolder = window.location.pathname.indexOf('/drafts/') === -1;

  const onAdobeMcLoaded = () => {
    document.dispatchEvent(new Event(GLOBAL_EVENTS.ADOBE_MC_LOADED));
    window.ADOBE_MC_EVENT_LOADED = true;
  };

  if (isPageNotInDraftsFolder) {
    const LAUNCH_URL = 'https://assets.adobedtm.com';
    const ENVIRONMENT = Page.environment;

    // Load Adobe Experience platform data collection (Launch) script
    // const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();

    const ADOBE_MC_URL_ENV_MAP = new Map([
      ['prod', '8a93f8486ba4/5492896ad67e/launch-b1f76be4d2ee.min.js'],
      ['stage', '8a93f8486ba4/5492896ad67e/launch-3e7065dd10db-staging.min.js'],
      ['dev', '8a93f8486ba4/5492896ad67e/launch-fbd6d02d30e8-development.min.js'],
    ]);

    const adobeMcScriptUrl = `${LAUNCH_URL}/${ADOBE_MC_URL_ENV_MAP.get(ENVIRONMENT)}`;
    try {
      await loadScript(adobeMcScriptUrl);
    } catch (e) { /* empty */ }

    onAdobeMcLoaded();
  } else {
    onAdobeMcLoaded();
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  // load trackers early if there is a target experiment on the page
  if (getPageExperimentKey()) {
    loadTrackers();
  }

  createMetadata('nav', `${getLocalizedResourceUrl('nav')}`);
  createMetadata('footer', `${getLocalizedResourceUrl('footer')}`);
  decorateTemplateAndTheme();

  // TODO: if experiments stop working correctly please consider bringing this back:
  // await window.hlx.plugins.run('loadEager');

  AdobeDataLayerService.push(await new PageLoadStartedEvent());
  await resolveNonProductsDataLayer();

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
    document.body.classList.add('appear', 'franklin');
    if (window.location.href.indexOf('scuderiaferrari') !== -1) {
      document.body.classList.add('sferrari');
    }
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  const pageIsNotInFragmentsFolder = window.location.pathname.indexOf('/fragments/') === -1;
  const pageIsNotInWebviewFolder = window.location.pathname.indexOf('/webview/') === -1;
  doc.querySelector('header').style.height = '0px';

  if (pageIsNotInFragmentsFolder && pageIsNotInWebviewFolder) {
    // eslint-disable-next-line no-unused-vars
    doc.querySelector('header').style.height = 'initial';
    loadHeader(doc.querySelector('header'));
  }

  // only call load Trackers here if there is no experiment on the page
  if (!getPageExperimentKey()) {
    loadTrackers();
  }
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  if (pageIsNotInFragmentsFolder && pageIsNotInWebviewFolder) {
    loadFooter(doc.querySelector('footer'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  window.hlx.plugins.run('loadLazy');

  const templateMetadata = getMetadata('template');
  const hasTemplate = getMetadata('template') !== '';
  if (hasTemplate) {
    loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${templateMetadata}-lazy.css`);
  }

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

  // specific for webview
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('theme') === 'dark' && window.location.href.includes('canvas')) {
    document.body.style = 'background-color: #141517';
  }

  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await Constants.PRODUCT_ID_MAPPINGS_CALL;
  await loadLazy(document);

  await StoreResolver.resolve();
  const elements = document.querySelectorAll('.await-loader');
  document.dispatchEvent(new Event('bd_page_ready'));
  window.bd_page_ready = true;
  elements.forEach((element) => {
    element.classList.remove('await-loader');
  });

  // loader circle used in mbox-canvas
  const loaderCircle = document.querySelectorAll('.loader-circle');
  loaderCircle.forEach((element) => {
    element.classList.remove('loader-circle');
  });

  adobeMcAppendVisitorId('main');

  pushTrialDownloadToDataLayer();
  AdobeDataLayerService.pushEventsToDataLayer();
  AdobeDataLayerService.push(new PageLoadedEvent());

  loadDelayed();
}

initMobileDetector('mobile');
initMobileDetector('tablet');
initMobileDetector('desktop');

loadPage();
