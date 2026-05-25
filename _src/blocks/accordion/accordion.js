import { getDsnBase } from '../../scripts/utils/utils.js';

const getSectionTitle = (block) => {
  const section = block.closest('.section');
  const defaultWrapper = section?.querySelector(':scope > .default-content-wrapper');
  return defaultWrapper?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || '';
};

const buildListItem = (li) => {
  const bdLi = document.createElement('bd-li');
  bdLi.setAttribute('kind', 'none');
  bdLi.setAttribute('size', 'md');
  const bdP = document.createElement('bd-p');
  bdP.setAttribute('kind', 'small');
  bdP.innerHTML = li.innerHTML;
  bdLi.appendChild(bdP);
  return bdLi;
};

const buildList = (list) => {
  const bdList = document.createElement('bd-list');
  bdList.setAttribute('type', list.tagName === 'OL' ? 'ordered' : 'unordered');
  bdList.setAttribute('spacing', 'md');
  bdList.setAttribute('variant', 'default');
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
      const children = Array.from(contentCell.children);
      if (children.length) {
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
        item.replaceChildren(...mapped);
      } else {
        const bdP = document.createElement('bd-p');
        bdP.innerHTML = contentCell.innerHTML;
        item.replaceChildren(bdP);
      }
    }

    accordion.appendChild(item);
  });

  if (section) {
    section.querySelectorAll(':scope > .default-content-wrapper').forEach((wrapper) => {
      Array.from(wrapper.querySelectorAll(':scope > p')).forEach((p) => {
        const bdP = document.createElement('bd-p');
        bdP.setAttribute('kind', 'small');
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
  const base = getDsnBase();
  await Promise.all([
    import(`${base}accordion-bg`),
    import(`${base}paragraph`),
    import(`${base}list`),
    import(`${base}list-item`),
  ]);
  const accordion = buildAccordion(block);
  block.replaceChildren(accordion);
}
