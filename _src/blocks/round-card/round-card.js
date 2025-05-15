function decorate(block) {
  const innerWrapper = block.children[0];
  innerWrapper.classList = 'inner-wrapper';

  const originalAnchorEl = innerWrapper.children[0].lastElementChild.firstElementChild;
  const newAnchorEl = originalAnchorEl.cloneNode();
  newAnchorEl.classList = '';
  innerWrapper.prepend(newAnchorEl);

  const defaultWrapper = document.createElement('div');
  defaultWrapper.classList = 'default-content-wrapper';

  defaultWrapper.append(innerWrapper);
  block.prepend(defaultWrapper);
}

export { decorate as default };
//# sourceMappingURL=round-card.js.map
