// eslint-disable-next-line no-unused-vars
import { matchHeights } from '../../scripts/utils/utils.js';

export default function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  // count the children of a div
  const countChildren = (parent) => {
    const { children } = parent;
    return children.length;
  };

  [...block.children].forEach((child) => {
    if (countChildren(child) === 2) {
      child.classList.add('cards');
      matchHeights(child, 'p');
      matchHeights(child, 'h3');
      [...child.children].forEach((card) => {
        card.classList.add('card');
      });
    }
  });

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
