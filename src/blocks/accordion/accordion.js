import { load } from '@repobit/dex-system-design/loader';

const getSectionTitle = (block) => {
  const section = block.closest('.section');
  const accordionWrapper = block.closest('.accordion-wrapper');
  if (!section || !accordionWrapper || accordionWrapper.parentElement !== section) return '';
  const defaultWrapper = section.querySelector(':scope > .default-content-wrapper');
  return defaultWrapper?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';
};

/**
 * The look the accordion takes from the nearest of the block and its
 * ancestors with a look's class: the terms look in .terms-of-use or
 * .system-requirements, else the FAQ look, which 3.x's bd-accordion-bg also
 * drew in .faq and with no class at all. 3.x detected it from these classes
 * itself; 4.0 reads only the appearance the page writes.
 * @param {HTMLElement} block
 * @returns {'faq'|'terms'}
 */
const getAppearance = (block) => {
  const looks = block.closest('.faq, .terms-of-use, .system-requirements');
  return looks && !looks.classList.contains('faq') ? 'terms' : 'faq';
};

/**
 * A heading in a slot: bd-accordion and bd-accordion-item draw it, the page
 * picks its level.
 * @param {string} text
 * @param {string} as the level, h1 to h6
 */
const buildTitle = (text, as) => {
  const bdH = document.createElement('bd-h');
  bdH.setAttribute('slot', 'title');
  bdH.setAttribute('as', as);
  bdH.textContent = text;
  return bdH;
};

const buildListItem = (li) => {
  const bdLi = document.createElement('bd-li');
  bdLi.setAttribute('appearance', 'none');
  bdLi.setAttribute('size', 'md');
  const bdP = document.createElement('bd-p');
  bdP.setAttribute('appearance', 'small');
  bdP.innerHTML = li.innerHTML;
  bdLi.appendChild(bdP);
  return bdLi;
};

const buildList = (list) => {
  const bdList = document.createElement('bd-list');
  bdList.setAttribute('type', list.tagName === 'OL' ? 'ordered' : 'unordered');
  bdList.setAttribute('spacing', 'md');
  bdList.setAttribute('appearance', 'default');
  bdList.setAttribute('orientation', 'vertical');
  Array.from(list.querySelectorAll(':scope > li')).forEach((li) => {
    bdList.appendChild(buildListItem(li));
  });
  return bdList;
};

const buildAccordion = (block) => {
  const section = block.closest('.section');
  const defaultWrapper = section?.querySelector(':scope > .default-content-wrapper');
  const sectionTitle = getSectionTitle(block);

  if (defaultWrapper && sectionTitle) {
    defaultWrapper.remove();
  }

  // the FAQ look draws no band, each item a card on the brand wash; the terms
  // look keeps the group's band and draws its items flat
  const appearance = getAppearance(block);
  const accordion = document.createElement('bd-accordion');
  accordion.setAttribute('appearance', appearance);
  if (appearance === 'faq') accordion.setAttribute('background', 'none');
  if (sectionTitle) {
    // 3.x drew the title at h2, and at h6 on the terms look
    accordion.appendChild(buildTitle(sectionTitle, appearance === 'terms' ? 'h6' : 'h2'));
  }

  const isFirstOpen = block.classList.contains('first-open');
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  rows.forEach((row, index) => {
    const [headerCell, contentCell] = row.children;
    if (!headerCell) return;

    const titleEl = headerCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    const title = titleEl?.textContent?.trim() || headerCell.textContent.trim();

    const item = document.createElement('bd-accordion-item');
    if (appearance === 'faq') item.setAttribute('background', 'tint');
    // 3.x drew the question as plain text; 4.0 makes it a heading, at h3
    const itemTitle = buildTitle(title, 'h3');
    item.appendChild(itemTitle);

    if (isFirstOpen && index === 0) {
      item.setAttribute('open', '');
    }

    if (contentCell) {
      const children = Array.from(contentCell.children);
      const hasDirectText = Array.from(contentCell.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      );
      if (children.length && !hasDirectText) {
        const mapped = children.map((el) => {
          if (el.tagName === 'P') {
            const bdP = document.createElement('bd-p');
            bdP.innerHTML = el.innerHTML;
            return bdP;
          }
          if (el.tagName === 'UL' || el.tagName === 'OL') {
            return buildList(el);
          }
          return el.cloneNode(true);
        });
        item.replaceChildren(itemTitle, ...mapped);
      } else {
        const bdP = document.createElement('bd-p');
        bdP.innerHTML = contentCell.innerHTML;
        item.replaceChildren(itemTitle, bdP);
      }
    }

    accordion.appendChild(item);
  });

  const accordionWrapper = block.closest('.accordion-wrapper');
  const isDirectChild = accordionWrapper && section && accordionWrapper.parentElement === section;

  if (isDirectChild) {
    section.querySelectorAll(':scope > .default-content-wrapper').forEach((wrapper) => {
      Array.from(wrapper.querySelectorAll(':scope > p')).forEach((p) => {
        const bdP = document.createElement('bd-p');
        bdP.setAttribute('appearance', 'small');
        bdP.setAttribute('slot', 'footer');
        bdP.innerHTML = p.innerHTML;
        accordion.appendChild(bdP);
      });
      wrapper.remove();
    });
  }

  return accordion;
};

export default async function decorate(block) {
  const accordion = buildAccordion(block);
  await load(accordion);
  block.replaceChildren(accordion);
  document.dispatchEvent(new CustomEvent('accordion-bg:loaded', { bubbles: true }));
}
