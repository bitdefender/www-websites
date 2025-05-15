import { decorateIcons } from '../../scripts/lib-franklin.js';
import { matchHeights } from '../../scripts/utils/utils.js';

function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });

  decorateIcons(block);
  matchHeights(block, 'h4');
  matchHeights(block, 'p:first-of-type');
  matchHeights(block, 'p:nth-of-type(2)');
}

export { decorate as default };
//# sourceMappingURL=money-back.js.map
