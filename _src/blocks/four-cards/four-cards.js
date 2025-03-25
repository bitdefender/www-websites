import { matchHeights } from '../../scripts/utils/utils.js';

export default async function decorate(block, options) {
  const {
    // eslint-disable-next-line no-unused-vars
    margintop,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
    const fourCardsWrapper = block.closest('.four-cards-wrapper');
    if (fourCardsWrapper) {
      fourCardsWrapper.classList.remove('four-cards-wrapper');
    }
  }

  if (margintop) {
    const blockParent = block.closest('.section');
    blockParent.style.marginTop = `${margintop}px`;
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

  // decorate icons only if the component is being called from www-websites
  const isInLandingPages = window.location.href.includes('www-landing-pages') || window.location.href.includes('bitdefender.com/pages');
  if (!options && !isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/lib-franklin.js');
    decorateIcons(block.closest('.section'));
  }

  if (isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/utils/utils.js');
    decorateIcons(block.closest('.section'));
  }

  matchHeights(block, 'h3');
  matchHeights(block, 'div[data-valign="middle"] > p:first-of-type');
}
