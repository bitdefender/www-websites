export default function decorate(block) {
  const innerWrapper = block.children[0];
  innerWrapper.classList = 'inner-wrapper';

  const iconElement = innerWrapper.children[0].children[0].children[0];
  innerWrapper.children[0].children[0].remove();
  innerWrapper.children[0].prepend(iconElement);

  const originalAnchorEl = innerWrapper.children[0].lastElementChild.firstElementChild;
  const newAnchorEl = originalAnchorEl.cloneNode();
  newAnchorEl.classList = '';
  innerWrapper.prepend(newAnchorEl);

  const defaultWrapper = document.createElement('div');
  defaultWrapper.classList = 'default-content-wrapper';

  defaultWrapper.append(innerWrapper);
  block.prepend(defaultWrapper);
}
