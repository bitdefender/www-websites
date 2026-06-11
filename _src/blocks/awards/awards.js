// eslint-disable-next-line no-unused-vars
import { matchHeights } from '../../scripts/utils/utils.js';

// Load SourceForge badge script

function loadSfBadgeScript(variant) {
  const src = `https://b.sf-syn.com/badge_js?sf_id=3929827&variant_id=${variant}`;

  if ([...document.scripts].some((s) => s.src === src)) {
    return; // already loaded
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

export default function decorate(block) {
  const { dynamicAwards, variantIds } = block.closest('.section').dataset;
  const countChildren = (parent) => parent.children.length;

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

  if (dynamicAwards) {
    const target = block.querySelector('.awards > div:last-of-type > div:last-of-type');
    if (!target) return;

    if (variantIds) {
      variantIds.split(',').forEach((variantId) => {
        const badge = document.createElement('p');
        badge.className = 'sf-root';
        badge.dataset.id = '3929827';
        badge.dataset.variantId = variantId.trim();
        badge.dataset.badge = variantId.trim() === 'tbs' ? 'partner' : 'light-partner';
        badge.style.width = '125px';

        target.appendChild(badge);

        loadSfBadgeScript(variantId.trim());
      });
    }
  }
}
