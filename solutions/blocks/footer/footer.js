import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

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

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // fetch footer content
  const footerPath = getMetadata('footer') || '/footer';
  const resp = await fetch(`/${window.location.pathname.split('/')[1]}${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

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
  }
}
