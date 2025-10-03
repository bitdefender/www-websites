import '@repobit/dex-system-design/accordion-bg';

export default function decorate(block) {

  block.innerHTML = `
    <bd-accordion-bg title="Terms of use">
      <bd-accordion-bg-item title="Auto renewal terms">
        <ul>
          <li>Your subscription automatically begins at the purchase date;</li>
          <li>By subscribing, you are purchasing a recurring subscription which will automatically renew;</li>
          <li>The Bitdefender Auto Renewal Plan is designed to save you time, effort, and minimize your vulnerability risk by extending your subscription automatically before you run out of protection.</li>
        </ul>
      </bd-accordion-bg-item>
      <bd-accordion-bg-item title="How to cancel + email address cancelation support">
        <ul>
          <li>You can cancel your automatically subscription from Bitdefender Central or by contacting Customer Support at: <a href="mailto:cancel@bitdefender.com" title="cancel@bitdefender.com">cancel@bitdefender.com</a></li>
          <li>You can refund by contacting <a href="mailto:refunds@bitdefender.com" title="refunds@bitdefender.com">refunds@bitdefender.com</a> within 30 days of your initial purchase or of the automatic renewal date.</li>
        </ul>
      </bd-accordion-bg-item>
    </bd-accordion-bg>
  `;
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
