import '@repobit/dex-system-design/accordion-bg';
import '@repobit/dex-system-design/heading';
import '@repobit/dex-system-design/paragraph';
import '@repobit/dex-system-design/link';

export default function decorate(block) {
  block.classList.add('global-styles');

  block.innerHTML = `
    <bd-accordion-bg title="Terms of use">
      <bd-accordion-bg-item title="Auto renewal terms">
        <bd-h as="h2" fontWeight="500">Test</bd-h>
        <bd-p>Paragraph test <bd-link href="https://google.com" underline="true">Press me</bd-link></bd-p>
        <h2>Test H3</h2>
      </bd-accordion-bg-item>
    </bd-accordion-bg>
  `;
  return;
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

    const toggleItem = () => {
      const isOpen = item.classList.contains('expanded');
      items.forEach((i) => {
        i.classList.remove('expanded');
        i.querySelector('.accordion-item-header')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
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
}
