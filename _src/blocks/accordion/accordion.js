import { Constants } from '../../scripts/libs/constants.js';
import '@repobit/dex-system-design/accordion-bg';
import '@repobit/dex-system-design/heading';
import '@repobit/dex-system-design/paragraph';
import '@repobit/dex-system-design/link';
import '@repobit/dex-system-design/list';
import '@repobit/dex-system-design/list-item';

/**
 * transform all elements into design systems elements
 * @param {HTMLElement} parent
 */
const transformAllChildren = (parent) => {
  [...parent.children].forEach((child) => {
    transformAllChildren(child);
  });

  if (['DIV', 'STRONG'].includes(parent.tagName)) {
    return;
  }

  let newParent;
  switch (parent.tagName) {
    case 'P': {
      newParent = document.createElement('bd-p');
      break;
    }

    case 'A': {
      newParent = document.createElement('bd-link');
      newParent.setAttribute('href', parent.href);
      break;
    }

    case 'UL': {
      newParent = document.createElement('bd-list');
      break;
    }

    case 'LI': {
      newParent = document.createElement('bd-li');
      break;
    }

    default: {
      newParent = document.createElement('bd-h');
      newParent.setAttribute('as', parent.tagName.toLowerCase());
      break;
    }
  }

  newParent.replaceChildren(...parent.childNodes);
  parent.replaceWith(newParent);
};

export default function decorate(block) {
  const blockContainer = block.closest('.accordion-container');
  const firstDefaultWrapper = blockContainer?.querySelector('.default-content-wrapper');
  const accordionTitle = firstDefaultWrapper?.querySelector(Constants.HEADINGS_QUERY)?.textContent;
  const bdAccordion = document.createElement('bd-accordion-bg');
  bdAccordion.setAttribute('title', accordionTitle || '');
  firstDefaultWrapper?.remove();

  const items = Array.from(block.querySelectorAll(':scope > div'));
  items.forEach((item) => {
    const bdAccordionItem = document.createElement('bd-accordion-bg-item');
    // item.classList.add('accordion-item');
    const [header, content] = item.children;
    const headerTitle = header.querySelector(Constants.HEADINGS_QUERY)?.textContent;
    bdAccordionItem.setAttribute('title', headerTitle || '');
    bdAccordionItem.appendChild(content);

    [...bdAccordionItem.children].forEach((child) => {
      transformAllChildren(child);
    });

    bdAccordion.appendChild(bdAccordionItem);
  });

  block.replaceChildren(bdAccordion);
}
