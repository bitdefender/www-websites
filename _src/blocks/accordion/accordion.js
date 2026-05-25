import { getDsnBase } from '../../scripts/utils/utils.js';

const getSectionTitle = (block) => {
  const section = block.closest('.section');
  const defaultWrapper = section?.querySelector(':scope > .default-content-wrapper');
  return defaultWrapper?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';
};

const buildAccordion = (block) => {
  const section = block.closest('.section');
  const defaultWrapper = section?.querySelector(':scope > .default-content-wrapper');
  const sectionTitle = getSectionTitle(block);

  if (defaultWrapper && sectionTitle) {
    defaultWrapper.remove();
  }

  const accordion = document.createElement('bd-accordion-bg');
  if (sectionTitle) {
    accordion.setAttribute('title', sectionTitle);
  }

  const isFirstOpen = block.classList.contains('first-open');
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  rows.forEach((row, index) => {
    const [headerCell, contentCell] = row.children;
    if (!headerCell) return;

    const titleEl = headerCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    const title = titleEl?.textContent?.trim() || headerCell.textContent.trim();

    const item = document.createElement('bd-accordion-bg-item');
    item.setAttribute('title', title);

    if (isFirstOpen && index === 0) {
      item.setAttribute('open', '');
    }

    if (contentCell) {
      const bdParagraphs = Array.from(contentCell.querySelectorAll('p')).map((p) => {
        const bdP = document.createElement('bd-p');
        bdP.innerHTML = p.innerHTML;
        return bdP;
      });

      if (bdParagraphs.length) {
        item.replaceChildren(...bdParagraphs);
      } else {
        const bdP = document.createElement('bd-p');
        bdP.innerHTML = contentCell.innerHTML;
        item.replaceChildren(bdP);
      }
    }

    accordion.appendChild(item);
  });

  return accordion;
};

export default async function decorate(block) {
  const base = getDsnBase();
  await Promise.all([
    import(`${base}accordion-bg`),
    import(`${base}paragraph`),
  ]);
  const accordion = buildAccordion(block);
  block.replaceChildren(accordion);
}
