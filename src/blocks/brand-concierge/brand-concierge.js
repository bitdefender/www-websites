import { getAemFragmentLocale, makeImagePathsAbsolute } from '../../scripts/utils/utils.js';
import { Constants } from '../../scripts/libs/constants.js';

/*
 * The Brand Concierge (Adobe's AI agent) is built in AEM. Like the footer and the
 * mega menu, it is embedded from its experience fragment, which brings the markup,
 * the styles and the script, and is rendered in a shadow root. The AEM script
 * loads the agent itself, once Launch has set up the Web SDK (window.alloy).
 */

// The AEM component's init function, and the event announcing it is ready
const AEM_COMPONENT = 'brandConcierge';

// Shared webpack chunks of the AEM site: the AEM header (mega menu) loads them,
// and running the runtime twice runs every AEM script twice
const SHARED_AEM_CHUNKS = ['dependencies', 'runtime', 'vendor'];

/**
 * @param {string} [locale] AEM fragment locale, e.g. en, ro_ro
 * @returns {string} URL of the brand concierge experience fragment
 */
export function getFragmentUrl(locale = getAemFragmentLocale()) {
  return `${Constants.PUBLIC_URL_ORIGIN}/content/experience-fragments/bitdefender/language_master/${locale}/consumer/brand-concierge/master/jcr:content/root.html`;
}

/**
 * Loads the brand concierge from AEM into the block
 * @param {Element} block The brand-concierge block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const response = await fetch(getFragmentUrl());
  if (!response.ok) {
    return;
  }

  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const contentDiv = document.createElement('div');
  // hidden until its CSS is in, so it never shows unstyled
  contentDiv.style.display = 'none';

  // parse in a template so images don't start loading before their paths are fixed
  const template = document.createElement('template');
  template.innerHTML = await response.text();
  makeImagePathsAbsolute(template.content);
  contentDiv.append(template.content);

  // update the links so that they work on all Franklin domains
  const loadedLinks = [...contentDiv.querySelectorAll('link')].map((linkElement) => {
    linkElement.href = `${Constants.PUBLIC_URL_ORIGIN}${linkElement.getAttribute('href')}`;
    linkElement.rel = 'stylesheet';

    return new Promise((resolve, reject) => {
      linkElement.onload = resolve;
      linkElement.onerror = reject;
    });
  });

  // the AEM script runs its init function on the shadow root once it is loaded -
  // or right away, if another brand concierge on the page already loaded it
  const initAemComponent = () => window[AEM_COMPONENT](shadowRoot);
  const isAemComponentLoaded = typeof window[AEM_COMPONENT] === 'function';
  if (!isAemComponentLoaded) {
    window.addEventListener(AEM_COMPONENT, initAemComponent, { once: true });
  }

  // scripts parsed from HTML never run, so they are recreated with absolute URLs
  contentDiv.querySelectorAll('script').forEach((script) => {
    const src = script.getAttribute('src');
    script.remove();

    if (!src || SHARED_AEM_CHUNKS.some((key) => src.includes(key))) {
      return;
    }

    const newScript = document.createElement('script');
    newScript.src = `${Constants.PUBLIC_URL_ORIGIN}${src}`;
    newScript.defer = true;
    shadowRoot.appendChild(newScript);
  });

  shadowRoot.appendChild(contentDiv);
  block.append(host);

  if (isAemComponentLoaded) {
    initAemComponent();
  }

  await Promise.allSettled(loadedLinks);
  contentDiv.style.display = '';
}
