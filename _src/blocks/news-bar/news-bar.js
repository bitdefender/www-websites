export default function decorate(block, options) {
  const {
    solutions, hideDate,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
  }

  if (solutions) {
    block.closest('.section').classList.add('solutions');
  }

  const blockParent = block.closest('.section');
  setTimeout(() => {
    const elementLink = block.querySelector('a');
    block.style.backgroundColor = '#E4F2FF';
    block.style.color = '#006EFF';
    if (elementLink && !blockParent.classList.contains('solutions')) elementLink.style.color = '#006EFF';
  }, 2000);

  if (hideDate) {
    const currentDate = new Date();
    const hiddenDate = new Date(hideDate);
    if (hiddenDate < currentDate) {
      block.style.display = 'none';
    }
  }

  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
      bubbles: true,
      composed: true,
    });
  }, 700);
}
