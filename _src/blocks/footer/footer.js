import { decorateIcons, getMetadata, loadBlocks } from '../../scripts/lib-franklin.js';
import { adobeMcAppendVisitorId } from '../../scripts/utils/utils.js';
import { decorateMain } from '../../scripts/scripts.js';

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

    adobeMcAppendVisitorId('footer');
  }
}

async function runAemFooterLogic(block) {
  // fetch footer content
  const footerPath = getMetadata('footer') || '/footer';
  const aemFooterFetch = await fetch('https://dev3.bitdefender.com/content/experience-fragments/bitdefender/language_master/en/footer-fragment-v1/master/jcr:content/root/footer.html');
  if (!aemFooterFetch.ok) {
    return;
  }
  const aemFooterHtml = await aemFooterFetch.text();
  const footer = document.createElement('footer');
  const shadowRoot = footer.attachShadow({ mode: 'open' });

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = aemFooterHtml;

  // select all the scripts from contet div and
  const scripts = contentDiv.querySelectorAll('script');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.src = `https://dev3.bitdefender.com${script.getAttribute('src')}`;
    shadowRoot.appendChild(newScript);
  });

  // select all the css from content div and
  const styles = contentDiv.querySelectorAll('link[rel="stylesheet"]');
  styles.forEach((style) => {
    style.href = `https://dev3.bitdefender.com${style.getAttribute('href')}`;
    style.rel = 'stylesheet';
  });

  window.addEventListener('footer-logic-finished', () => {
    window.runFooterLogic(shadowRoot);
  });

  shadowRoot.appendChild(contentDiv);
  document.querySelector('footer').replaceWith(footer);
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

  adobeMcAppendVisitorId('footer');
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
    case 'aem':
      runAemFooterLogic(block);
      break;
    default:
      runDefaultFooterLogic(block);
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
  console.log(footerMetadata);
  block.textContent = '';

  applyFooterFactorySetup(footerMetadata, block);
}
