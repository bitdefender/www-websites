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
  const isDesktop = window.matchMedia('(min-width: 900px)');
  const b = !isDesktop.matches;
  return b;
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

  // create ul element and add it to block
  const $ul = document.createElement('ul');
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

  const tabsSelector = config['tab-group'] ? `[data-tab-group="${config['tab-group']}"][data-tab]` : '[data-tab]';

  // create empty array to store tab info
  /** @type TabInfo[] */
  const tabs = [];
  const {
    dropDownMenu, $ul,
  } = createTabsNavigation(block);

  // search referenced sections and move them inside the tab-container
  const $sections = document.querySelectorAll(tabsSelector);

  // move the tab's sections before the tab riders.
  [...$sections].forEach(($tabContent, index) => {
    const title = $tabContent.dataset.tab;
    const name = title.toLowerCase().trim();

    // create tab
    const $li = document.createElement('li');
    $ul.appendChild($li);

    $li.classList.add('tab');
    $li.innerText = title;

    // tab content
    const tabContentDiv = document.createElement('div');
    tabContentDiv.classList.add('tab-item');
    tabContentDiv.append(...$tabContent.children);
    tabContentDiv.classList.add('hidden');

    block.appendChild(tabContentDiv);
    $tabContent.remove();

    // if index is 0, then it is the first tab, so it should be active
    if (index === 0) {
      $li.classList.add('active');
      tabContentDiv.classList.remove('hidden');
      dropDownMenu.innerText = title;
    }

    // create tab info object
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

  tabs.forEach((tab) => {
    const {
      name, $tab,
    } = tab;

    $tab.addEventListener('click', () => {
      const $activeButton = block.querySelector('li.active');

      if (isMobileScreenSize()) {
        toggleMenu(dropDownMenu);
      }

      if ($activeButton !== $tab) {
        $activeButton.classList.remove('active');
        // remove active class from parent li
        $activeButton.parentElement.classList.remove('active');

        $activeButton.classList.add('active');
        // add active class to parent li
        $tab.classList.add('active');
        dropDownMenu.innerText = $tab.innerText;

        tabs.forEach((t) => {
          if (name === t.name) {
            t.$content.classList.remove('hidden');
            t.$tab.classList.add('active');
          } else {
            t.$content.classList.add('hidden');
            t.$tab.classList.remove('active');
          }
        });
      }
    });
  });
}
