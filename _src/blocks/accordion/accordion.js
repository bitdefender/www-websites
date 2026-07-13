export default function decorate(block) {
  const items = Array.from(block.querySelectorAll(':scope > div'));

  items.forEach((item, index) => {
    item.classList.add('accordion-item');
    const [header, content] = item.children;
    header.classList.add('accordion-item-header');

    // A11Y: focusabil, activabil, semantic
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', `accordion-content-${index}`);
    content.setAttribute('id', `accordion-content-${index}`);

    if (content) {
      content.classList.add('accordion-item-content');
      const p = content.querySelector('p');
      if (!p) {
        const newP = document.createElement('p');
        newP.innerHTML = content.innerHTML;
        content.innerHTML = '';
        content.appendChild(newP);
      }
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
        item.replaceChildren(...mapped);
      } else {
        header.setAttribute('aria-expanded', 'false');
      }
    };

    if ([...block.classList].includes('action-only-on-header')) {
      header.addEventListener('click', toggleItem);
    } else {
      item.addEventListener('click', toggleItem);
    }

    // A11Y: tastatură
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem();
      }
    });
  });

  // Prima deschisă
  if (block.classList.contains('first-open')) {
    const firstItem = items[0];
    firstItem.classList.add('expanded');
    const header = firstItem.querySelector('.accordion-item-header');
    if (header) header.setAttribute('aria-expanded', 'true');
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
  document.dispatchEvent(new CustomEvent('accordion-bg:loaded', { bubbles: true }));
}
