import { matchHeights } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const {
    // eslint-disable-next-line no-unused-vars
    margintop,
  } = block.closest('.section').dataset;

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

  // decorate icons only if the component is being called from www-websites
  const isInLandingPages = window.location.href.includes('www-landing-pages') || window.location.href.includes('bitdefender.com/pages');
  if (!isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/lib-franklin.js');
    decorateIcons(block.closest('.section'));
  }

  if (isInLandingPages) {
    const { decorateIcons } = await import('../../scripts/utils/utils.js');
    decorateIcons(block.closest('.section'));
  }

  matchHeights(block, 'h3:last-of-type');
  matchHeights(block, 'h4');
  matchHeights(block, 'div[data-valign="middle"] > p:first-of-type:not(:has(.icon))');
  matchHeights(block, 'div[data-valign="middle"] > p:nth-of-type(2):not(:has(.icon))');
}
