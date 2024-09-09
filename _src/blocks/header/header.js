import {
  getMetadata, decorateIcons, decorateButtons, decorateTags,
} from '../../scripts/lib-franklin.js';

import { adobeMcAppendVisitorId } from '../../scripts/utils/utils.js';

import { decorateBlockWithRegionId, decorateLinkWithLinkTrackingId, getDomain } from '../../scripts/scripts.js';

function createLoginModal() {
  const loginModal = document.querySelector('nav > div:nth-child(4)');
  loginModal.classList.add('login-modal');

  const triangle = document.createElement('div');
  triangle.className = 'triangle';
  loginModal.appendChild(triangle);

  const divider = document.createElement('div');
  divider.className = 'divider';
  loginModal.appendChild(divider);
}

function handleLoginClick() {
  const loginModal = document.querySelector('.login-modal');
  if (loginModal.classList.contains('show')) {
    loginModal.classList.remove('show');
  } else {
    loginModal.style.display = 'flex';
    setTimeout(() => {
      loginModal.classList.add('show');
    }, 0); // Small delay to ensure that the modal is rendered before adding the transition
  }

  const loginButton = document.querySelector('.nav-sections p:last-child');
  loginButton.classList.toggle('clicked');
}

function appendUlToP() {
  const divs = document.querySelectorAll('.mega-menu-websites > div');

  divs.forEach((div) => {
    const uls = div.querySelectorAll('ul');
    uls.forEach((ul) => {
      const p = ul.previousElementSibling;

      const span = document.createElement('div');

      Array.from(ul.children).forEach((li) => {
        span.textContent += ` ${li.textContent}`;
        span.textContent = span.textContent.slice(1);
      });

      p.appendChild(span);

      ul.remove();
    });
  });
}

function wrapDivsInMegaMenu() {
  const nav = document.getElementById('nav');
  const divs = Array.from(nav.children).filter((node) => node.tagName.toLowerCase() === 'div');
  const navSectionsIndex = divs.findIndex((div) => div.classList.contains('nav-sections'));
  const megaMenuDiv = document.createElement('div');
  megaMenuDiv.className = 'mega-menu-websites';
  decorateBlockWithRegionId(megaMenuDiv, 'Main Menu|Home Solutions');

  const otherOptionsDiv = document.createElement('div');
  otherOptionsDiv.className = 'other-options';

  const bottomLinks = document.createElement('div');
  bottomLinks.className = 'bottom-links';

  megaMenuDiv.appendChild(divs[navSectionsIndex + 1].cloneNode(true));
  nav.removeChild(divs[navSectionsIndex + 1]);

  for (let i = navSectionsIndex + 2; i < 8; i += 1) {
    otherOptionsDiv.appendChild(divs[i].cloneNode(true));
    nav.removeChild(divs[i]);
  }

  for (let i = 8; i < divs.length; i += 1) {
    bottomLinks.appendChild(divs[i].cloneNode(true));
    nav.removeChild(divs[i]);
  }

  nav.appendChild(megaMenuDiv);
  megaMenuDiv.appendChild(otherOptionsDiv);
  megaMenuDiv.appendChild(bottomLinks);

  // Move first child of otherOptionsDiv to megaMenuDiv
  if (otherOptionsDiv.firstElementChild) {
    megaMenuDiv.insertBefore(otherOptionsDiv.firstElementChild, otherOptionsDiv);
  }

  // Move first child of bottomLinks to otherOptionsDiv
  if (bottomLinks.firstElementChild) {
    otherOptionsDiv.appendChild(bottomLinks.firstElementChild);
  }

  const loginModal = document.querySelector('.mega-menu-websites > div:first-child');
  nav.appendChild(loginModal);
}

function addDescriptionToHref() {
  const descriptions = document.querySelectorAll('header .button-container > div');

  descriptions.forEach((description) => {
    const a = description.parentNode.querySelector('a');
    a.appendChild(description);
  }, this);
}

function removeButtonClasses() {
  const bottomLinks = document.querySelector('.bottom-links');
  const bottomLinksParagraphs = bottomLinks.querySelectorAll('p');
  const bottomLinksSpans = bottomLinks.querySelectorAll('span');
  const bottomLinksLinks = bottomLinks.querySelectorAll('a');

  bottomLinksParagraphs.forEach((paragraph) => {
    paragraph.classList.remove('button-container');
  });

  bottomLinksSpans.forEach((span) => {
    span.classList.remove('button-text');
  });

  bottomLinksLinks.forEach((link) => {
    link.classList.remove('button');
  });
}

function buildMegaMenu() {
  wrapDivsInMegaMenu();
  appendUlToP();
  removeButtonClasses();
  addDescriptionToHref();
}

function renderDesktopHeader(block, nav) {
  const navSections = nav.querySelector('.nav-sections');
  const navBrand = nav.querySelector('.nav-brand');
  const navBrandLinks = nav.querySelectorAll('.nav-brand a');

  if (navSections) {
    decorateBlockWithRegionId(navSections, 'Main Menu|General Links');
    const loginLink = document.querySelector('.nav-sections p:last-child');
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLoginClick();
    });
  }

  if (navBrand && navBrandLinks && navBrandLinks.length > 0) {
    decorateBlockWithRegionId(navBrand, 'Main Menu|Brands');
    const forHomeLink = Array.from(navBrandLinks)[0];
    if (forHomeLink) {
      forHomeLink.classList.add('active');
    }
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  buildMegaMenu();

  const homeSolutions = document.createElement('p');
  const homeSolutionText = document.querySelector('.bottom-links > div:last-child > p');
  homeSolutions.innerHTML = homeSolutionText.innerHTML;
  homeSolutions.classList.add('home-solutions-link-default');
  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.appendChild(homeSolutions);

  const bottomLinks = document.querySelector('.bottom-links');
  bottomLinks.removeChild(bottomLinks.lastElementChild);

  const megaMenu = document.querySelector('.mega-menu-websites');
  let isOverHomeSolutions = false;
  let isOverMegaMenu = false;

  const showMegaMenu = () => {
    megaMenu.style.display = 'flex';
    setTimeout(() => {
      megaMenu.classList.add('mega-menu-websites-show');
    }, 10);
  };

  const hideMegaMenu = () => {
    if (!isOverHomeSolutions && !isOverMegaMenu) {
      megaMenu.classList.remove('mega-menu-websites-show');
      homeSolutions.classList.remove('home-solutions-link-hover');
    }
  };

  homeSolutions.addEventListener('mouseenter', () => {
    isOverHomeSolutions = true;
    showMegaMenu();
    homeSolutions.classList.add('home-solutions-link-hover');
  });

  homeSolutions.addEventListener('mouseleave', () => {
    isOverHomeSolutions = false;
    setTimeout(hideMegaMenu, 0); // avoid menu to close when moving mouse to menu.
  });

  megaMenu.addEventListener('mouseenter', () => {
    isOverMegaMenu = true;
  });

  megaMenu.addEventListener('mouseleave', () => {
    isOverMegaMenu = false;
    hideMegaMenu();
    homeSolutions.classList.remove('home-solutions-link-hover');
  });

  createLoginModal();
}

// MOBILE HEADER //

function handleMenuClick() {
  this.classList.toggle('change');

  const headerWrapper = document.querySelector('.header-wrapper');
  headerWrapper.classList.toggle('expanded');
  document.body.classList.toggle('no-scroll');

  let hasToggled = false;

  const optionsWrapper = document.querySelector('.options-wrapper');
  setTimeout(() => {
    optionsWrapper.classList.toggle('show');
  }, 100);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000 && !hasToggled && headerWrapper.classList.contains('expanded')) {
      headerWrapper.classList.toggle('expanded');
      this.classList.toggle('change');
      optionsWrapper.classList.toggle('show');
      hasToggled = true;
    } else if (window.innerWidth <= 1000) {
      hasToggled = false;
    }
  });

  // Select the first child of mega-menu and all div children of other-options
  const megaMenuFirstChild = document.querySelector('.mega-menu-websites').firstElementChild;

  const otherOptionsChildren = Array.from(document.querySelector('.other-options').children);
  const navDivs = [megaMenuFirstChild].concat(otherOptionsChildren);
  const menuOptions = [];

  // Iterate over each div
  for (let i = 0; i < navDivs.length; i += 1) {
    const menuOption = {};
    const div = navDivs[i];

    // Find the h2 within this div and assign its innerHTML to the title of menuOption
    const h2 = div.querySelector('h2');
    if (h2) {
      menuOption.title = h2.childNodes[0].textContent.trim();

      // find all links that are not children of h2
      const links = div.querySelectorAll('a:not(h2 a)');

      // Find all a tags within this div
      if (links.length > 0) {
        menuOption.subMenu = [];

        links.forEach((link) => {
          const submenuItem = {};
          // Clone the link element
          const cloneLink = link.cloneNode(true);
          submenuItem.name = cloneLink.textContent;
          submenuItem.url = cloneLink.href;

          submenuItem.updatedLinkHTML = cloneLink.outerHTML;

          menuOption.subMenu.push(submenuItem);
        });
      }
      menuOptions.push(menuOption);
    } else {
      // If there is no h2 in the div, remove the div from the DOM
      div.parentNode.removeChild(div);
    }
  }

  let originalMenuHTML;

  function generateSubMenu(option) {
    return `<div class='sub-menu-title' data-option='${option.title}'>${option.title}</div>${option.subMenu.map((subMenuItem) => `<a href='${subMenuItem.url}'>${subMenuItem.updatedLinkHTML}</a>`).join('')}`;
  }

  const menuOptionsHTML = menuOptions.map((option) => `<div class='menu-option' data-option='${option.title}'>${option.title}</div>`).join('');

  // eslint-disable-next-line prefer-const
  originalMenuHTML = menuOptionsHTML;

  optionsWrapper.innerHTML = menuOptionsHTML;

  function handleMenuOptionClick() {
    const optionTitle = this.dataset.option;
    const selectedOption = menuOptions.find((opt) => opt.title === optionTitle);
    optionsWrapper.innerHTML = generateSubMenu(selectedOption);

    const subMenuTitle = document.querySelector('.sub-menu-title');
    if (subMenuTitle) {
      // eslint-disable-next-line no-use-before-define
      subMenuTitle.addEventListener('click', handleSubMenuTitleClick);
    }
    const optionWrapperShow = document.querySelector('.options-wrapper.show');
    optionWrapperShow.style.height = 'auto';

    const optionWrapperShowDivs = optionWrapperShow.querySelectorAll('div:not(.sub-menu-title)');

    optionWrapperShowDivs.forEach((div) => {
      div.parentNode.removeChild(div);
    });
  }

  function attachMenuOptionClickEvents() {
    document.querySelectorAll('.menu-option').forEach((menuOption) => {
      menuOption.addEventListener('click', handleMenuOptionClick);
    });
    const optionWrapperShow = document.querySelector('.options-wrapper.show');
    if (optionWrapperShow) {
      optionWrapperShow.style.height = '100vh';
    }
  }

  function handleSubMenuTitleClick() {
    optionsWrapper.innerHTML = originalMenuHTML;
    attachMenuOptionClickEvents();
  }

  attachMenuOptionClickEvents();
}

function renderMobileHeader(nav) {
  const headerBlock = document.querySelector('.header.block');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('menu-wrapper');
  wrapperDiv.addEventListener('click', handleMenuClick);

  // Create three span elements (bars)
  for (let i = 0; i < 3; i += 1) {
    const barSpan = document.createElement('span');
    barSpan.classList.add('menu-bar');
    wrapperDiv.appendChild(barSpan);
  }

  const optionsWrapper = document.createElement('div');
  optionsWrapper.className = 'options-wrapper';

  headerBlock.appendChild(nav);
  headerBlock.appendChild(wrapperDiv);
  headerBlock.appendChild(optionsWrapper);
}

async function runDefaultHeaderLogic(block) {
  const hero = document.querySelector('.hero');

  if (hero && hero.classList.contains('black-background')) {
    const header = document.querySelector('header');
    header.classList.add('black-background');
  }

  const headerBlock = document.querySelector('.header.block');
  headerBlock.removeChild(headerBlock.firstElementChild);

  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    if (html.includes('aem-banner')) {
      let domain = getDomain();
      if (domain === 'en-us') {
        domain = 'en';
      } else {
        domain = domain.split('-').join('_');
      }
      const aemHeaderFetch = await fetch(`https://stage.bitdefender.com/content/experience-fragments/bitdefender/language_master/${domain}/header-navigation/mega-menu/master/jcr:content/root/mega_menu.html`);
      if (!aemHeaderFetch.ok) {
        return;
      }
      const aemHeaderHtml = await aemHeaderFetch.text();

      const nav = document.createElement('div');
      const shadowRoot = nav.attachShadow({ mode: 'open' });

      const contentDiv = document.createElement('div');
      contentDiv.style.display = 'none';
      contentDiv.classList.add('mega-menu');
      contentDiv.classList.add('default-content-wrapper');
      contentDiv.innerHTML = aemHeaderHtml;
      const cssFile = contentDiv.querySelector('link[rel="stylesheet"]');
      if (cssFile) {
        cssFile.href = '/_src/scripts/vendor/mega-menu/mega-menu.css';
        cssFile.as = 'style';

        // wait for the css to load before displaying the content
        // this is to avoid the content being displayed without the styles
        cssFile.onload = () => {
          contentDiv.style.display = 'block';
        };
        shadowRoot.appendChild(contentDiv);
      }

      const newScriptFile = document.createElement('script');
      newScriptFile.src = '/_src/scripts/vendor/mega-menu/mega-menu.js';

      const shadowRootScriptTag = shadowRoot.querySelector('script');
      if (shadowRootScriptTag) {
        shadowRootScriptTag.replaceWith(newScriptFile);
      }

      const navHeader = shadowRoot.querySelector('header');
      if (navHeader) {
        navHeader.style.height = 'auto';
      }

      const body = document.querySelector('body');
      body.style.maxWidth = 'initial';

      const header = document.querySelector('header');
      if (header) {
        header.remove();
      }

      document.querySelector('body').prepend(nav);

      adobeMcAppendVisitorId(shadowRoot);
      return;
    }

    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    decorateButtons(nav);
    renderMobileHeader(nav);
    renderDesktopHeader(block, nav);
    decorateIcons(nav);
    decorateTags(nav);

    // Select the parent elements
    const bottomLinks = document.querySelector('.bottom-links');
    const header = document.querySelector('header');

    const thirdChild = bottomLinks.children[2];

    bottomLinks.removeChild(thirdChild);

    thirdChild.classList.add('logo');

    const container = document.createElement('div');
    container.classList.add('logo-container');
    decorateBlockWithRegionId(container, 'Main Menu|Logo Container');
    container.appendChild(thirdChild);

    if (header.querySelector('p.home-solutions-link-default')) {
      container.appendChild(header.querySelector('p.home-solutions-link-default'));
    }
    decorateIcons(container);
    header.appendChild(container);
  }

  // assign an aria-label to the a tag inside of .logo
  const logoLink = document.querySelector('.logo a');
  logoLink.setAttribute('aria-label', 'Logo');
  decorateLinkWithLinkTrackingId(logoLink, 'Bitdefender Logo');

  const secondSpan = document.querySelector('.header-wrapper > div > p span:nth-child(2)');
  if (secondSpan) {
    secondSpan.parentNode.removeChild(secondSpan);
  }

  const header = document.getElementsByClassName('header-wrapper')[0];

  window.addEventListener('scroll', () => {
    if (window.innerWidth > 990) {
      if (window.scrollY > 0) {
        header.style.display = 'none';
        const loginModal = document.querySelector('nav > div:nth-child(4)');
        loginModal.classList.remove('show');
      } else {
        header.style.display = 'block';
      }
    }
  });
}

async function runLandingPageHeaderLogic(block) {
  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  const html = await resp.text();

  block.classList.add('lp-header', 'py-3', 'default-content-wrapper');
  const headerWrapper = block.closest('header');

  headerWrapper.id = 'header-ferrari';
  headerWrapper.classList.add('header-spurs', 'dark');
  block.innerHTML = html;

  const lpHeader = block.closest('.lp-header');
  lpHeader.addEventListener('click', () => {
    lpHeader.classList.toggle('active', !lpHeader.classList.contains('active'));
  });
}

async function runQuizPageHeaderLogic(block) {
  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  const html = await resp.text();

  block.classList.add('quiz', 'py-3', 'default-content-wrapper');
  const headerWrapper = block.closest('header');

  headerWrapper.classList.add('dark');
  block.innerHTML = html;

  decorateIcons(block);
}

/**
 * applies header factory based on header variation
 * @param {String} headerMetadata The header variation: landingpage' or none
 * @param {Element} header The header element
 */
function applyHeaderFactorySetup(headerMetadata, header) {
  switch (headerMetadata) {
    case 'landingpage':
      runLandingPageHeaderLogic(header);
      break;
    case 'quiz':
      runQuizPageHeaderLogic(header);
      break;
    default:
      runDefaultHeaderLogic(header);
      break;
  }
}

export default async function decorate(block) {
  const headerMetadata = getMetadata('header-type');
  block.parentNode.classList.add(headerMetadata || 'default');

  applyHeaderFactorySetup(headerMetadata, block);
}
