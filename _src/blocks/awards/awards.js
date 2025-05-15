import { matchHeights } from '../../scripts/utils/utils.js';

// eslint-disable-next-line no-unused-vars

function decorate(block) {
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
}

export { decorate as default };
//# sourceMappingURL=awards.js.map
