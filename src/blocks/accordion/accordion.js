import { load } from '@repobit/dex-system-design/loader';
import { getSectionContent, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * A bd-accordion. Authored one item a row: [question] [answer]. The heading
 * in the section's default content is the group's title, and the paragraphs
 * in the section's other default content its footer notes; neither is read
 * when the block sits in something other than its own section (a tab panel).
 */

/**
 * The heading of the default content in the block's own section, or null
 * when the block is not directly in its section.
 * @param {HTMLElement} block
 * @returns {HTMLElement|null}
 */
const getSectionHeading = (block) => {
  const content = getSectionContent(block.closest('.section'));
  const accordionWrapper = block.closest('.accordion-wrapper');
  if (!content || !accordionWrapper || accordionWrapper.parentElement !== content) return null;
  const defaultWrapper = content.querySelector(':scope > .default-content-wrapper');
  const heading = defaultWrapper?.querySelector('h1, h2, h3, h4, h5, h6');
  return heading?.textContent?.trim() ? heading : null;
};

/**
 * The look the author picked with a class on the block or its section: faq,
 * or terms in .terms-of-use or .system-requirements, whichever is nearest.
 * Without one the accordion keeps bd-accordion's own look, standard on its
 * container band.
 * @param {HTMLElement} block
 * @returns {'faq'|'terms'|null}
 */
const getAppearance = (block) => {
  const looks = block.closest('.faq, .terms-of-use, .system-requirements');
  if (!looks) return null;
  return looks.classList.contains('faq') ? 'faq' : 'terms';
};

/**
 * A heading in a slot: bd-accordion and bd-accordion-item set its size, the
 * page's outline its level.
 * @param {string} text
 * @param {number} level 1 to 6
 */
const buildTitle = (text, level) => {
  const bdH = document.createElement('bd-h');
  bdH.setAttribute('slot', 'title');
  bdH.setAttribute('as', `h${level}`);
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
  const content = getSectionContent(block.closest('.section'));
  const defaultWrapper = content?.querySelector(':scope > .default-content-wrapper');
  const sectionHeading = getSectionHeading(block);

  if (defaultWrapper && sectionHeading) {
    defaultWrapper.remove();
  }

  const appearance = getAppearance(block);
  const accordion = document.createElement('bd-accordion');
  if (appearance) accordion.setAttribute('appearance', appearance);
  // the FAQ look is no band, each item a card on the brand wash
  if (appearance === 'faq') accordion.setAttribute('background', 'none');

  // the title at the level the page wrote it, the questions a level under it
  const titleLevel = sectionHeading ? Number(sectionHeading.tagName[1]) : null;
  const itemLevel = titleLevel ? Math.min(titleLevel + 1, 6) : 3;
  if (sectionHeading) {
    accordion.appendChild(buildTitle(sectionHeading.textContent.trim(), titleLevel));
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
    const itemTitle = buildTitle(title, itemLevel);
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
  const isDirectChild = accordionWrapper && content && accordionWrapper.parentElement === content;

  if (isDirectChild) {
    content.querySelectorAll(':scope > .default-content-wrapper').forEach((wrapper) => {
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
  // the section on the design system's rhythm; in a tab panel the section is
  // the tab group's, which already is
  wrapSectionInDsSection(block);
  const accordion = buildAccordion(block);
  await load(accordion);
  block.replaceChildren(accordion);
  document.dispatchEvent(new CustomEvent('accordion-bg:loaded', { bubbles: true }));
}
