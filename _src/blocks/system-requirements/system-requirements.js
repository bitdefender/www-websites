function expandItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  const transitionEndCallback = () => {
    content.removeEventListener('transitionend', transitionEndCallback);
    content.style.height = 'auto';
  };
  content.addEventListener('transitionend', transitionEndCallback);
  item.classList.add('expanded');
}

function collapseItem(item) {
  const [, content] = item.children;
  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    item.classList.remove('expanded');
    content.style.height = 0;
  });
}

function handleAccordionItemClick(item, items) {
  if (!item.classList.contains('expanded')) {
    items.filter((i) => i.classList.contains('expanded')).forEach((i) => collapseItem(i));
    expandItem(item);
  } else {
    collapseItem(item);
  }
}

export default function decorate(block, options) {
  block.classList.add('global-styles');
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    // const blockParent = block.closest('.section');
    // blockParent.classList.add('we-container');
  }

  const items = Array.from(block.querySelectorAll(':scope > div'));
  items.forEach((item) => {
    item.classList.add('system-requirements-item');
    const [header, content] = item.children;
    header.classList.add('system');

    if (content) {
      content.classList.add('requirement');
      // check if .accordion-item-content has a <p>
      // const p = content.querySelector('ul li p');
      // // if it doesn't, add a <p> and move the content inside
      // if (!p) {
      //   const newP = document.createElement('p');
      //   newP.innerHTML = content.querySelector('ul li').innerHTML;
      //   content.querySelector('ul li').innerHTML = '';
      //   content.querySelector('ul li').appendChild(newP);
      // }
    }

    if ([...block.classList].includes('action-only-on-header')) {
      header.addEventListener('click', handleAccordionItemClick.bind(null, header.parentElement, items));
    } else {
      item.addEventListener('click', handleAccordionItemClick.bind(null, item, items));
    }
  });

  if (block.classList.contains('first-open')) {
    items[0].classList.add('expanded');
  }

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
