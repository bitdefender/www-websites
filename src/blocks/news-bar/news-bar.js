// TODO(DEX-29605): remove after Black Friday 2026, with scripts/black-friday/
// (and make decorate sync again)
import { isBlackFridayRibbon, renderBlackFridayRibbon } from '../../scripts/black-friday/ribbon.js';

export default async function decorate(block, options) {
  const {
    solutions, hideDate,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
  }

  // TODO(DEX-29605): remove after Black Friday 2026, with scripts/black-friday/
  // On the campaign's pages, the news bar at the top shows its ribbon instead.
  if (isBlackFridayRibbon(block)) {
    await renderBlackFridayRibbon(block);
    return;
  }
  // end TODO(DEX-29605)

  if (solutions) {
    block.closest('.section').classList.add('solutions');
  }

  const blockParent = block.closest('.section');
  setTimeout(() => {
    const elementLink = block.querySelector('a');
    block.style.backgroundColor = '#E4F2FF';
    block.style.color = '#0045AD';
    if (elementLink && !blockParent.classList.contains('solutions')) elementLink.style.color = '#0045AD';
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
