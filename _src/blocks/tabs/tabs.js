import { getDsnBase } from '../../scripts/utils/utils.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

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

const buildTabCol = (cells, isFirstOpen, bgBlue) => {
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
  if (bgBlue) accordionSection.setAttribute('bg-blue', '');
  col.appendChild(accordionSection);

  col.accordionSection = accordionSection;
  col.isFirstOpen = isFirstOpen;
  col.firstItemAdded = false;

  return col;
};

const appendAccordionItem = (col, cells) => {
  const [titleCell, contentCell] = cells;
  const titleText = titleCell?.textContent?.trim();
  if (!titleText) return;

  const item = document.createElement('bd-accordion-item');
  item.setAttribute('title', titleText);

  if (col.isFirstOpen && !col.firstItemAdded) {
    item.setAttribute('open', '');
  }
  col.firstItemAdded = true;

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

  col.accordionSection.appendChild(item);
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

const buildTabsFromBlock = (block, title, subtitle, bgBlue) => {
  const tabsEl = document.createElement('bd-tabs');
  if (title) tabsEl.setAttribute('title', title);
  if (subtitle) tabsEl.setAttribute('subtitle', subtitle);

  const isFirstOpen = block.classList.contains('first-open');
  let currentPanel = null;
  let currentFeatures = null;
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
      currentFeatures = null;
      currentCol = null;
    } else if (headingLevel !== null) {
      if (!currentPanel) {
        currentPanel = document.createElement('bd-tab-panel');
        tabsEl.appendChild(currentPanel);
      }
      if (!currentFeatures) {
        currentFeatures = document.createElement('bd-features');
        currentPanel.appendChild(currentFeatures);
      }
      currentCol = buildTabCol(cells, isFirstOpen, bgBlue);
      currentFeatures.appendChild(currentCol);
    } else if (currentCol) {
      appendAccordionItem(currentCol, cells);
    }
  });

  return tabsEl;
};

function waitForInnerBlocks(container) {
  const pending = [...container.querySelectorAll('[data-block-status]')]
    .filter((el) => el.getAttribute('data-block-status') !== 'loaded');
  if (!pending.length) return Promise.resolve();

  return Promise.all(pending.map((innerBlock) => new Promise((resolve) => {
    const obs = new MutationObserver(() => {
      if (innerBlock.getAttribute('data-block-status') === 'loaded') {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(innerBlock, { attributes: true, attributeFilter: ['data-block-status'] });
    setTimeout(() => { obs.disconnect(); resolve(); }, 8000);
  })));
}

function suppressPanelMinHeight(bdTabs) {
  const { shadowRoot } = bdTabs;
  if (!shadowRoot) return;

  let wrapperObs = null;

  const attachToWrapper = () => {
    const wrapper = shadowRoot.querySelector('.bd-panel-wrapper');
    if (!wrapper) return;
    if (wrapper.style.minHeight) wrapper.style.removeProperty('min-height');
    if (wrapperObs) wrapperObs.disconnect();
    wrapperObs = new MutationObserver(() => {
      if (wrapper.style.minHeight) wrapper.style.removeProperty('min-height');
    });
    wrapperObs.observe(wrapper, { attributes: true, attributeFilter: ['style'] });
  };

  const component = shadowRoot.querySelector('.bd-tabs-component');
  if (component) {
    new MutationObserver(attachToWrapper).observe(component, { childList: true });
  }
  attachToWrapper();
}

function buildTabsFromSections(config, title, subtitle) {
  const tabGroupName = config['tab-group'];
  const tabsSelector = tabGroupName
    ? `[data-tab-group="${tabGroupName}"][data-tab]`
    : '[data-tab]';

  const sections = [...document.querySelectorAll(tabsSelector)];
  if (!sections.length) return null;

  const bdTabs = document.createElement('bd-tabs');
  if ('bg-blue' in config) bdTabs.setAttribute('bg-blue', '');
  if (title) bdTabs.setAttribute('title', title);
  if (subtitle) bdTabs.setAttribute('subtitle', subtitle);

  sections.forEach((section) => {
    const tabPanel = document.createElement('bd-tab-panel');
    tabPanel.setAttribute('title', section.dataset.tab);
    while (section.firstChild) tabPanel.appendChild(section.firstChild);
    section.remove();
    bdTabs.appendChild(tabPanel);
  });

  return bdTabs;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const bgBlue = 'bg-blue' in config;

  if ('tab-group' in config) {
    [...block.children].forEach((child) => child.remove());

    const { defaultWrapper, title, subtitle } = getSectionContext(block);
    if (defaultWrapper && title) defaultWrapper.remove();

    const bdTabs = buildTabsFromSections(config, title, subtitle);
    if (bdTabs) {
      block.replaceChildren(bdTabs);

      const base = getDsnBase();
      try {
        await import(`${base}tabs`);
        if (typeof bdTabs.updateComplete?.then === 'function') {
          await bdTabs.updateComplete;
        }
        suppressPanelMinHeight(bdTabs);

        waitForInnerBlocks(bdTabs).then(() => {
          const { shadowRoot } = bdTabs;
          if (!shadowRoot) return;
          const buttons = [...shadowRoot.querySelectorAll('[role="tab"]')];
          if (buttons.length < 2) return;
          const activeIdx = buttons.findIndex((btn) => btn.getAttribute('aria-selected') === 'true');
          const otherIdx = activeIdx === 0 ? 1 : 0;
          buttons[otherIdx].click();
          buttons[activeIdx < 0 ? 0 : activeIdx].click();
        });
      } catch (err) {
        console.warn('DSN imports failed (Mode 1)', err);
      }
    }
  } else {
    const { defaultWrapper, title, subtitle } = getSectionContext(block);
    if (defaultWrapper && title) defaultWrapper.remove();

    const base = getDsnBase();
    try {
      await Promise.all([
        import(`${base}tabs`),
        import(`${base}paragraph`),
        import(`${base}accordion`),
        import(`${base}individual-icon`),
      ]);
    } catch (err) {
      console.warn('DSN imports failed (Mode 2)', err);
    }

    const tabsEl = buildTabsFromBlock(block, title, subtitle, bgBlue);
    if (tabsEl) block.replaceChildren(tabsEl);
  }
}
