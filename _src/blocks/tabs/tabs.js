import { getDsnBase } from '../../scripts/utils/utils.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

// ── Helpers for Mode 2 (all-in-block / bd-tabs) ───────────────────────────────

const getIconSrc = (iconCell) => {
  const image = iconCell?.querySelector('img');
  const imageSrc = image?.currentSrc || image?.getAttribute('src') || '';
  if (imageSrc) return imageSrc;

  const iconElement = iconCell?.querySelector('[class*="icon-"]');
  if (!iconElement) return '';

  const iconName = Array.from(iconElement.classList)
    .find((cls) => cls.startsWith('icon-'))
    ?.substring(5);

  return iconName ? `/common/icons/${iconName}.svg` : '';
};

const parseIconColor = (cell) => {
  const match = cell?.textContent?.match(/#[0-9a-fA-F]{3,6}/);
  return match ? match[0] : null;
};

const parseIconSize = (cell) => {
  const match = cell?.textContent?.match(/\bsize:?\s*(\d+)/i);
  return match ? match[1] : '40';
};

const buildTabCol = (cells, isFirstOpen) => {
  const [titleCell, iconCell, descCell] = cells;
  const heading = titleCell.querySelector('h1, h2, h3, h4, h5, h6');

  const col = document.createElement('bd-feature-col');
  col.setAttribute('title', heading?.textContent?.trim() || titleCell.textContent.trim());

  const icon = document.createElement('bd-individual-icon');
  icon.setAttribute('slot', 'icon');
  icon.setAttribute('size', parseIconSize(iconCell));
  const color = parseIconColor(iconCell);
  if (color) icon.setAttribute('color', color);
  const iconSrc = getIconSrc(iconCell);
  if (iconSrc) {
    const img = document.createElement('img');
    img.src = iconSrc;
    icon.appendChild(img);
  }
  col.appendChild(icon);

  if (descCell) {
    const descText = descCell.textContent.trim();
    if (descText) {
      const bdP = document.createElement('bd-p');
      bdP.setAttribute('slot', 'description');
      bdP.setAttribute('kind', 'small');
      bdP.innerHTML = descCell.innerHTML;
      col.appendChild(bdP);
    }
  }

  const accordionSection = document.createElement('bd-accordion-section');
  accordionSection.setAttribute('no-container', '');
  col.appendChild(accordionSection);

  col._accordionSection = accordionSection;
  col._isFirstOpen = isFirstOpen;
  col._firstItemAdded = false;

  return col;
};

const appendAccordionItem = (col, cells) => {
  const [titleCell, contentCell] = cells;
  const titleText = titleCell?.textContent?.trim();
  if (!titleText) return;

  const item = document.createElement('bd-accordion-item');
  item.setAttribute('title', titleText);

  if (col._isFirstOpen && !col._firstItemAdded) {
    item.setAttribute('open', '');
  }
  col._firstItemAdded = true;

  if (contentCell) {
    const children = Array.from(contentCell.children);
    if (children.length) {
      children.forEach((child) => {
        const bdP = document.createElement('bd-p');
        bdP.setAttribute('kind', 'small');
        bdP.innerHTML = child.innerHTML;
        item.appendChild(bdP);
      });
    } else {
      const bdP = document.createElement('bd-p');
      bdP.setAttribute('kind', 'small');
      bdP.innerHTML = contentCell.innerHTML;
      item.appendChild(bdP);
    }
  }

  col._accordionSection.appendChild(item);
};

const getSectionContext = (block) => {
  const section = block.closest('.section');
  const wrapper = block.closest('.tabs-wrapper');
  const defaultWrapper = wrapper?.parentElement === section
    ? section.querySelector(':scope > .default-content-wrapper')
    : null;
  const titleEl = defaultWrapper?.querySelector('h1, h2, h3, h4, h5, h6') || null;
  const subtitleEl = titleEl?.nextElementSibling?.tagName === 'P'
    ? titleEl.nextElementSibling
    : null;
  return {
    defaultWrapper,
    title: titleEl?.textContent?.trim() || '',
    subtitle: subtitleEl?.textContent?.trim() || '',
  };
};

/**
 * Mode 2 — all-in-block:
 * H1–H3 → bd-tab-panel, H4–H6 → bd-feature-col, plain P → bd-accordion-item
 */
const buildTabsFromBlock = (block, title, subtitle) => {
  const tabsEl = document.createElement('bd-tabs');
  if (title) tabsEl.setAttribute('title', title);
  if (subtitle) tabsEl.setAttribute('subtitle', subtitle);

  const isFirstOpen = block.classList.contains('first-open');
  let currentPanel = null;
  let currentCol = null;

  Array.from(block.querySelectorAll(':scope > div')).forEach((row) => {
    const cells = Array.from(row.children);
    const firstCell = cells[0];
    if (!firstCell) return;

    const heading = firstCell.querySelector('h1, h2, h3, h4, h5, h6');
    const headingLevel = heading ? parseInt(heading.tagName[1], 10) : null;

    if (headingLevel !== null && headingLevel <= 3) {
      currentPanel = document.createElement('bd-tab-panel');
      currentPanel.setAttribute('title', heading.textContent.trim());
      tabsEl.appendChild(currentPanel);
      currentCol = null;
    } else if (headingLevel !== null) {
      if (!currentPanel) {
        currentPanel = document.createElement('bd-tab-panel');
        tabsEl.appendChild(currentPanel);
      }
      currentCol = buildTabCol(cells, isFirstOpen);
      currentPanel.appendChild(currentCol);
    } else {
      if (currentCol) appendAccordionItem(currentCol, cells);
    }
  });

  return tabsEl;
};

// ── Helpers for Mode 1 (data-tab sections / custom navigation) ────────────────

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

  return { dropDownMenu, $ul };
}

/**
 * Mode 1 — data-tab sections:
 * Block has "tab-group" config; content lives in [data-tab] sections.
 * Restores the original custom navigation (dropdown + ul > li tabs + tab-item panels).
 */
function buildTabsFromSections(block, config) {
  const tabGroupName = config['tab-group'];
  const tabsSelector = tabGroupName
    ? `[data-tab-group="${tabGroupName}"][data-tab]`
    : '[data-tab]';

  const $sections = [...document.querySelectorAll(tabsSelector)];
  if (!$sections.length) return [];

  const { dropDownMenu, $ul } = createTabsNavigation(block);
  const tabs = [];

  $sections.forEach(($section, index) => {
    const title = $section.dataset.tab;

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
    if (index !== 0) tabContentDiv.classList.add('hidden');
    tabContentDiv.setAttribute('role', 'tabpanel');
    tabContentDiv.setAttribute('aria-labelledby', `tab-${index}`);

    while ($section.firstChild) tabContentDiv.appendChild($section.firstChild);
    block.appendChild(tabContentDiv);
    $section.remove();

    if (index === 0) {
      $li.classList.add('active');
      dropDownMenu.innerText = title;
    }

    tabs.push({ $tab: $li, $content: tabContentDiv });
  });

  return tabs;
}

// ── Main decorate ─────────────────────────────────────────────────────────────

export default async function decorate(block) {
  const config = readBlockConfig(block);

  if ('tab-group' in config) {
    // Mode 1: data-tab sections — clear config rows, then build custom navigation
    [...block.children].forEach((child) => child.remove());
    const tabs = buildTabsFromSections(block, config);
    if (!tabs.length) return;

    const dropDownMenu = block.querySelector('.dropdown-menu');

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
      if (isMobileScreenSize() && toggleDropdown) toggleMenu(dropDownMenu);
      tabs[index].$content.querySelectorAll('bd-features').forEach((el) => {
        el._measureMaxHeight?.();
      });
    }

    tabs.forEach((tab, index) => {
      tab.$tab.addEventListener('click', () => {
        if (tab.$tab.getAttribute('aria-selected') !== 'true') activateTab(index);
      });
      tab.$tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTab(index);
        }
      });
    });

    block.addEventListener('keydown', (e) => {
      const focusedTab = document.activeElement;
      if (focusedTab.getAttribute('role') !== 'tab') return;
      const currentIndex = tabs.findIndex((t) => t.$tab === focusedTab);
      let newIndex = currentIndex;
      switch (e.key) {
        case 'ArrowRight': newIndex = (currentIndex + 1) % tabs.length; break;
        case 'ArrowLeft': newIndex = (currentIndex - 1 + tabs.length) % tabs.length; break;
        case 'Home': newIndex = 0; break;
        case 'End': newIndex = tabs.length - 1; break;
        default: return;
      }
      e.preventDefault();
      activateTab(newIndex, { toggleDropdown: false });
    });
  } else {
    // Mode 2: all-in-block — bd-tabs + bd-feature-col + bd-accordion-section
    const { defaultWrapper, title, subtitle } = getSectionContext(block);
    if (defaultWrapper && title) defaultWrapper.remove();

    const base = getDsnBase();
    await Promise.all([
      import(`${base}tabs`),
      import(`${base}paragraph`),
      import(`${base}accordion`),
      import(`${base}individual-icon`),
    ]);

    const tabsEl = buildTabsFromBlock(block, title, subtitle);
    if (tabsEl) block.replaceChildren(tabsEl);
  }
}

