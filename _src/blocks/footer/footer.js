import { getMetadata, loadBlocks } from '../../scripts/lib-franklin.js';
import { adobeMcAppendVisitorId } from '../../scripts/utils/utils.js';
import { decorateMain } from '../../scripts/scripts.js';

function setupPrivacyButton(container) {
  const privacyButton = container.querySelector('a[href="#privacybutton"]');
  if (privacyButton) {
    privacyButton.href = '#';
    privacyButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.UC_UI) {
        window.UC_UI.showSecondLayer();
      }
    });
  }
}

async function runLandingpageLogic(block) {
  const footerPath = getMetadata('footer') || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);

  const fragment = document.createElement('main');
  if (resp.ok) {
    fragment.innerHTML = await resp.text();
    decorateMain(fragment);
    await loadBlocks(fragment);
  }
  const footer = block.closest('.footer-wrapper');

  if (window.location.href.indexOf('scuderiaferrari') !== -1 || window.location.href.indexOf('spurs') !== -1) {
    block.closest('.footer-wrapper').id = 'footer-ferrari';
  }

  if (fragment) {
    const fragmentSections = fragment.querySelectorAll(':scope .section');
    if (fragmentSections) {
      footer.replaceChildren(...fragmentSections);
    }
  }

  const replacements = [
    [/\[year\]/g, new Date().getFullYear()],
    [/>Twitter Bitdefender</, '><img alt="x" src="/_src/icons/twitter.svg" /><'],
    [/>Linkedin Bitdefender</, '><img alt="linkedin" src="/_src/icons/linkedin.svg" /><'],
    [/>Facebook Bitdefender</, '><img alt="facebook" src="/_src/icons/facebook.svg" /><'],
    [/>Youtube Bitdefender</, '><img alt="youtube" src="/_src/icons/youtube.svg" /><'],
  ];

  replacements.forEach(([pattern, replacement]) => {
    footer.innerHTML = footer.innerHTML.replace(pattern, replacement);
  });

  setupPrivacyButton(footer);

  adobeMcAppendVisitorId('footer');
}

async function runAemFooterLogic() {
  // fetch footer content
  const aemFooterHostname = window.location.hostname.includes('.hlx.')
    || window.location.hostname.includes('localhost')
    ? 'https://stage.bitdefender.com'
    : '';

  const aemFooterFetch = await fetch(`${aemFooterHostname}/content/experience-fragments/bitdefender/language_master/en/footer-fragment-v1/master/jcr:content/root.html`);
  if (!aemFooterFetch.ok) {
    return;
  }

  const aemFooterHtml = await aemFooterFetch.text();
  const footer = document.createElement('footer');
  const shadowRoot = footer.attachShadow({ mode: 'open' });
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = aemFooterHtml;

  const loadedLinks = [];
  contentDiv.querySelectorAll('link').forEach((linkElement) => {
    // update the links so that they work on all Franklin domains
    linkElement.href = `${aemFooterHostname}${linkElement.getAttribute('href')}`;
    linkElement.rel = 'stylesheet';

    // add a promise for each link element in the code
    // so that we can wait on all the CSS before displaying the component
    loadedLinks.push(new Promise((resolve, reject) => {
      linkElement.onload = () => {
        resolve();
      };

      linkElement.onerror = () => {
        reject();
      };
    }));
  });

  // a list of all the components to be received from aem components
  const aemComponents = ['footer'];

  // add logic so that every time an AEM function is fully loaded
  // it is directly run using the shadow dom as parameter
  aemComponents.forEach((aemComponentName) => {
    window.addEventListener(aemComponentName, () => {
      window[aemComponentName](shadowRoot);
    });
  });

  // select all the scripts from contet div and
  const scripts = contentDiv.querySelectorAll('script');
  scripts.forEach((script) => {
    //  multiple reruns of runtime lead to all the scripts
    // being run multiple times
    if (!script.src.includes('runtime')) {
      const newScript = document.createElement('script');
      newScript.src = `${aemFooterHostname}${script.getAttribute('src')}`;
      newScript.defer = true;
      shadowRoot.appendChild(newScript);
    }
  });

  shadowRoot.appendChild(contentDiv);
  document.querySelector('footer').replaceWith(footer);
}

/**
 * applies footer factory based on footer variation
 * @param {String} footerMetadata The footer variation: landingpage' or none
 * @param {Element} footer The footer element
 */
function applyFooterFactorySetup(footerMetadata, block) {
  switch (footerMetadata) {
    case 'landingpage':
      runLandingpageLogic(block);
      break;
    default:
      runAemFooterLogic(block);
      break;
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMetadata = getMetadata('footer-type');
  block.parentNode.classList.add(footerMetadata || 'default');

  block.textContent = '';

  applyFooterFactorySetup(footerMetadata, block);
}
