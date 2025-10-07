export default async function decorate(block, options) {
  block.classList.add('global-styles');
  block.closest('.section').id = 'tos';

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.terms-wrapper');
    blockParent.classList.add('we-container');
  }

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
