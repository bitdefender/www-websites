/**
 * @typedef TabInfo
 * @property {string} name
 * @property {HTMLElement} $tab
 * @property {HTMLElement} $content
 */

import {
  readBlockConfig,
} from '../../scripts/lib-franklin.js';

function isMobileScreenSize() {
  return !window.matchMedia('(min-width: 900px)').matches;
}

function showMenuItems(content) {
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  content.classList.add('expanded');
}

function hideMenuItems(content) {
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    content.classList.remove('expanded');
    content.style.height = 0;
  });
}

function toggleMenu(dropDownMenu) {
  const $ul = dropDownMenu.nextElementSibling;

  if (dropDownMenu.classList.contains('opened')) {
    hideMenuItems($ul);
    dropDownMenu.classList.remove('opened');
  } else {
    showMenuItems($ul);
    dropDownMenu.classList.add('opened');
  }
}

function createTabsNavigation(block) {
  const tabsNavigation = document.createElement('div');
  tabsNavigation.classList.add('tabs-navigation');
  block.appendChild(tabsNavigation);

  const dropDownMenu = document.createElement('div');
  dropDownMenu.classList.add('dropdown-menu');
  tabsNavigation.appendChild(dropDownMenu);

  const $ul = document.createElement('ul');
  $ul.setAttribute('role', 'tablist');
  if (!isMobileScreenSize()) {
    $ul.classList.add('expanded');
  }
  tabsNavigation.appendChild($ul);

  dropDownMenu.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMenu(dropDownMenu);
  });

  return {
    dropDownMenu, $ul,
  };
}

/**
 * @param {HTMLElement} block
 * @return {TabInfo[]}
 */
export function createTabs(block) {
  const config = readBlockConfig(block);
  block.innerHTML = '';

  const tabsSelector = config['tab-group']
    ? `[data-tab-group="${config['tab-group']}"][data-tab]`
    : '[data-tab]';

  /** @type TabInfo[] */
  const tabs = [];
  const {
    dropDownMenu, $ul,
  } = createTabsNavigation(block);

  const $sections = document.querySelectorAll(tabsSelector);

  [...$sections].forEach(($tabContent, index) => {
    const title = $tabContent.dataset.tab;
    const name = title.toLowerCase().trim();

    const $li = document.createElement('li');
    $li.classList.add('tab');
    $li.setAttribute('role', 'tab');
    $li.setAttribute('tabindex', index === 0 ? '0' : '-1');
    $li.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    $li.setAttribute('id', `tab-${index}`);
    $li.innerText = title;

    $ul.appendChild($li);

    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('tab-item');
    tabContentDiv.classList.add('hidden');
    tabContentDiv.setAttribute('role', 'tabpanel');
    tabContentDiv.setAttribute('aria-labelledby', `tab-${index}`);
    tabContentDiv.append(...$tabContent.children);

    block.appendChild(tabContentDiv);
    $tabContent.remove();

    if (index === 0) {
      $li.classList.add('active');
      tabContentDiv.classList.remove('hidden');
      dropDownMenu.innerText = title;
    }

    tabs.push({
      name,
      $tab: $li,
      $content: tabContentDiv,
    });
  });

  return tabs;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const tabs = createTabs(block);
  const dropDownMenu = block.querySelector('.dropdown-menu');

  /**
   * Activează un tab
   * @param {number} index
   * @param {{ toggleDropdown?: boolean }} options
   */
  function activateTab(index, { toggleDropdown = true } = {}) {
    tabs.forEach((t, i) => {
      const isActive = i === index;

      t.$tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.$tab.setAttribute('tabindex', isActive ? '0' : '-1');
      t.$tab.classList.toggle('active', isActive);
      t.$content.classList.toggle('hidden', !isActive);
    });

    tabs[index].$tab.focus();
    dropDownMenu.innerText = tabs[index].$tab.innerText;

    if (isMobileScreenSize() && toggleDropdown) {
      toggleMenu(dropDownMenu);
    }
  }

  tabs.forEach((tab, index) => {
    tab.$tab.addEventListener('click', () => {
      if (tab.$tab.getAttribute('aria-selected') !== 'true') {
        activateTab(index); // toggleDropdown = true (default)
      }
    });

    tab.$tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(index); // suport și pentru Enter / Space
      }
    });
  });

  block.addEventListener('keydown', (e) => {
    const focusedTab = document.activeElement;
    if (focusedTab.getAttribute('role') !== 'tab') return;

    const currentIndex = tabs.findIndex((t) => t.$tab === focusedTab);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    activateTab(newIndex, { toggleDropdown: false });
  });
}