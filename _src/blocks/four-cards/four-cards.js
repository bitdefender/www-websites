const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["scripts/lib-franklin.js","node_modules/@repobit/dex-utils/dist/src/index.js","node_modules/@repobit/dex-utils/dist/src/cookies.js","node_modules/js-cookie/dist/js.cookie.js","node_modules/@repobit/dex-utils/dist/src/user.js","node_modules/@repobit/dex-constants/dist/src/index.js","node_modules/@repobit/dex-utils/dist/src/user-agent/index.js","node_modules/@repobit/dex-utils/dist/src/user-agent/cssua.js","scripts/page.js","node_modules/@repobit/dex-utils/dist/src/page.js","scripts/utils/utils.js","node_modules/@repobit/dex-data-layer/dist/src/adobe-data-layer-service/index.js","node_modules/@repobit/dex-data-layer/dist/src/events/page-loaded-event/index.js","node_modules/@repobit/dex-data-layer/dist/src/events/product-loaded-event/index.js","_virtual/cjs.js","_virtual/_commonjsHelpers.js","node_modules/deepmerge/dist/cjs.js","node_modules/@repobit/dex-data-layer/dist/src/events/button-click-event/index.js","scripts/libs/constants.js","node_modules/@repobit/dex-utils/dist/src/utils.js"])))=>i.map(i=>d[i]);
import { __vitePreload } from '../../_virtual/preload-helper.js';
import { matchHeights } from '../../scripts/utils/utils.js';

async function decorate(block) {
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
    const { decorateIcons } = await __vitePreload(async () => { const { decorateIcons } = await import('../../scripts/lib-franklin.js');return { decorateIcons }},true              ?__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]):void 0);
    decorateIcons(block.closest('.section'));
  }

  if (isInLandingPages) {
    const { decorateIcons } = await __vitePreload(async () => { const { decorateIcons } = await import('../../scripts/utils/utils.js');return { decorateIcons }},true              ?__vite__mapDeps([10,1,2,3,4,5,6,7,11,12,13,14,15,16,17,8,9,18,19]):void 0);
    decorateIcons(block.closest('.section'));
  }

  matchHeights(block, 'h3');
  matchHeights(block, 'div[data-valign="middle"] > p:first-of-type');
}

export { decorate as default };
//# sourceMappingURL=four-cards.js.map
