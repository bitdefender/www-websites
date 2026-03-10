import { decorateIcons, getMetadata, loadBlocks } from '../../scripts/lib-franklin.js';
import { getDomain } from '../../scripts/utils/utils.js';
import { adobeMcAppendVisitorId } from '../../scripts/target.js';
import { decorateMain } from '../../scripts/scripts.js';
import { Constants } from '../../scripts/libs/constants.js';

function wrapImgsInLinks(container) {
  const pictures = container.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const link = pic.nextElementSibling;
    if (link && link.tagName === 'A' && link.href) {
      link.innerHTML = pic.outerHTML;
      pic.replaceWith(link);
    }
  });
}

function onFooterElementClick(evt) {
  const header = evt.target;
  const ul = header.nextElementSibling;
  header.classList.toggle('active');

  if (ul.classList.contains('open')) {
    ul.addEventListener('transitionend', function callback() {
      if (!ul.classList.contains('open')) { // Ensure the ul is still closed
        ul.classList.remove('visible');
      }
      ul.removeEventListener('transitionend', callback);
    });
    ul.classList.remove('open');
  } else {
    ul.classList.add('visible');
    setTimeout(() => {
      ul.classList.add('open');
    }, 10); // slight delay to allow the browser to apply the "visible" class first
  }
}

function disableSelectedCountry(container) {
  const listOfCountries = container.querySelectorAll('li');
  listOfCountries.forEach((countryLanguage) => {
    if (countryLanguage.innerHTML.includes('selected')) {
      countryLanguage.classList.add('deactivated');
      countryLanguage.innerHTML = countryLanguage.innerHTML.replace('(selected)', '');
    }
  });
}

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

async function runDefaultFooterLogic(block) {
  // fetch footer content
  const footerPath = getMetadata('footer') || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    wrapImgsInLinks(footer);

    const sectionHeaders = footer.querySelectorAll('div > div > p');
    sectionHeaders[2].addEventListener('click', onFooterElementClick);
    sectionHeaders[3].addEventListener('click', onFooterElementClick);

    const sectionsData = footer.querySelectorAll('div > div > ul');
    disableSelectedCountry(sectionsData[3]);

    decorateIcons(footer);
    block.append(footer);

    setupPrivacyButton(footer);

    adobeMcAppendVisitorId('footer');
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
  const websiteDomain = getDomain();
  let aemFetchDomain;

  if (websiteDomain === 'en-us') {
    aemFetchDomain = 'en';
  } else if (websiteDomain.includes('-global')) {
    const [singleDomain] = websiteDomain.split('-');
    aemFetchDomain = singleDomain;
  } else {
    aemFetchDomain = websiteDomain.split('-').join('_');
  }

  const aemFooterFetch = await fetch(`${Constants.PUBLIC_URL_ORIGIN}/content/experience-fragments/bitdefender/language_master/${aemFetchDomain}/footer-fragment-v1/master/jcr:content/root.html`);
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
    linkElement.href = `${Constants.PUBLIC_URL_ORIGIN}${linkElement.getAttribute('href')}`;
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
  const aemComponents = ['footer2025'];

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
    if (['dependencies', 'runtime', 'vendor'].some((key) => script.src.includes(key))) {
      return;
    }
    const newScript = document.createElement('script');
    newScript.src = `${Constants.PUBLIC_URL_ORIGIN}${script.getAttribute('src')}`;
    newScript.defer = true;
    shadowRoot.appendChild(newScript);
  });

  shadowRoot.appendChild(contentDiv);
  document.querySelector('footer').replaceWith(footer);
  adobeMcAppendVisitorId(contentDiv);
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
    case 'franklinFooter':
      runDefaultFooterLogic(block);
      break;
    case 'hidden':
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
