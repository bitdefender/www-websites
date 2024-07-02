export default function decorate(block, options) {

  const {
    hideDate,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    block = block.querySelector('.block');
    let blockParent = block.closest('.section');
  }

  setTimeout(() => {
    const elementLink = block.querySelector('.news-bar a');
    block.style.backgroundColor = '#E4F2FF';
    block.style.color = '#006EFF';
    if (elementLink) elementLink.style.color = '#006EFF';
  }, 2000);

  if (hideDate) {
    const currentDate = new Date();
    let hiddenDate = new Date(hideDate);
    console.log(hiddenDate, currentDate )
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
