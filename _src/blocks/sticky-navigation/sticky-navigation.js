import { STICKY_NAVIGATION_DATASET_KEY } from '../../scripts/lib-franklin.js';

function scrollToAnchorWithOffset(anchorId) {
  const anchorElement = document.getElementById(anchorId);

  if (anchorElement) {
    const offsetPosition = anchorElement.getBoundingClientRect().top + window.scrollY - 80;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

function renderMobileDropDown() {
  const mobileDropDown = document.createElement('div');
  mobileDropDown.className = 'mobile-dropdown';

  /* listen to click event to open or close the dropdown menu on mobile */
  mobileDropDown.addEventListener('click', (e) => {
    e.preventDefault();
    mobileDropDown.classList.toggle('opened');
  });

  return mobileDropDown;
}

function renderStickyNavMenuItem(section) {
  if (!section.id) return null;

  const sectionTitle = section.dataset[STICKY_NAVIGATION_DATASET_KEY];
  if (!sectionTitle) return null; // Nu creează nimic dacă nu există titlu

  const navMenuItem = document.createElement('li');
  const navItemLink = document.createElement('a');
  navItemLink.href = `#${section.id}`;
  navItemLink.title = sectionTitle;
  navItemLink.innerText = sectionTitle;
  navMenuItem.appendChild(navItemLink);

  /** close the dropdown menu after user selection */
  navMenuItem.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToAnchorWithOffset(section.id);
  });

  return navMenuItem;
}

function renderStickyNavMenu() {
  const stickyNavMenu = document.createElement('ul');
  const stickyNavMenuItems = Array.from(document.querySelectorAll('.section[id]')).map(renderStickyNavMenuItem).filter(Boolean);
  stickyNavMenu.append(...stickyNavMenuItems);
  return stickyNavMenu;
}

function renderStickyNavigation(block) {
  const menuWithButton = document.createElement('div');
  menuWithButton.classList.add('menu-with-button');

  const mobileDropDown = renderMobileDropDown();

  const stickyNavMenu = renderStickyNavMenu();
  menuWithButton.appendChild(stickyNavMenu);

  /** close the dropdown menu after user selection */
  stickyNavMenu.addEventListener('click', (event) => {
    event.target.closest('ul').querySelectorAll('li').forEach((item) => {
      item.classList.remove('opened');
    });
    event.target.closest('li').classList.toggle('opened');
    mobileDropDown.classList.toggle('opened');
  });

  mobileDropDown.innerText = stickyNavMenu.querySelector('li').innerText;

  const stickyNavButton = block.querySelector('.button-container');
  if (stickyNavButton) {
    stickyNavButton.addEventListener('click', () => {
      window.adobeDataLayer.push(
        {
          event: 'click',
          asset: 'sticky-buy',
        },
      );
    });
    menuWithButton.appendChild(stickyNavButton);
  }
  block.replaceChildren(mobileDropDown);
  block.appendChild(menuWithButton);
  return block;
}

function stickNavigationOnTop(stickyNav) {
  const wrapperTop = document.querySelector('.sticky-navigation-container')?.offsetTop;
  if (wrapperTop) {
    if (window.scrollY >= wrapperTop) {
      stickyNav.classList.add('fixed-nav');
    } else {
      stickyNav.classList.remove('fixed-nav');
    }
  }
}

function findVisibleSection(sections) {
  return Array.from(sections).reduce((visSection, curSection) => {
    const curTop = curSection.getBoundingClientRect().top;
    const curBottom = curSection.getBoundingClientRect().bottom;
    // return current heading if at max 115px (magic number) from the top of the screen
    if (curTop < 115 && curBottom > 0) {
      return curSection;
    }
    return visSection;
  }, null);
}

function updateStickyNavActiveMenuItem(stickyNav) {
  // list all sections referenced in the sticky navigation
  const sections = document.querySelectorAll('.section[id]');

  const mobileDropDown = stickyNav.querySelector('.mobile-dropdown');

  // identify the visible section based on scroll position
  const visibleSection = findVisibleSection(sections);

  const previousActiveMenuEntry = stickyNav.querySelector('li.active');

  if (visibleSection) {
    const visibleActiveMenuEntryLink = stickyNav.querySelector(`li a[href="#${visibleSection.id}"]`);

    // the section is present in the sticky menu
    if (visibleActiveMenuEntryLink) {
      const visibleActiveMenuEntry = visibleActiveMenuEntryLink.parentElement;
      visibleActiveMenuEntry.classList.add('active');
      mobileDropDown.innerText = visibleActiveMenuEntry.innerText;

      if (previousActiveMenuEntry && !previousActiveMenuEntry.isSameNode(visibleActiveMenuEntry)) {
        previousActiveMenuEntry.classList.remove('active');
      }
    } else if (previousActiveMenuEntry) {
      previousActiveMenuEntry.classList.remove('active');
    }
  } else if (previousActiveMenuEntry) {
    previousActiveMenuEntry.classList.remove('active');
  }
}

function onScroll(stickyNav) {
  stickNavigationOnTop(stickyNav);
  updateStickyNavActiveMenuItem(stickyNav);
}

export default function decorate(block) {
  block.classList.add('global-styles');
  const stickyNav = renderStickyNavigation(block);

  // listen to scroll event to stick the nav on the top and update the current visible section
  document.addEventListener('scroll', () => onScroll(stickyNav));
}
