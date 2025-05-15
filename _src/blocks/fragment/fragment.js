import { getLanguageCountryFromPath, decorateMain } from '../../scripts/scripts.js';
import { loadBlocks } from '../../scripts/lib-franklin.js';

/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */


/**
     * Loads a fragment.
     * @param {string} path The path to the fragment
     * @returns {HTMLElement} The root element of the fragment
     */
async function loadFragment(path) {
  const { country, language } = getLanguageCountryFromPath();
  if (path && path.startsWith('/')) {
    try {
      // eslint-disable-next-line no-param-reassign
      path = path.replace(/lang/g, `${language}-${country}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      decorateMain(main);
      await loadBlocks(main);
      return main;
    }
  }
  return null;
}

async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.closest('.section').classList.add(...fragmentSection.classList);
      block.closest('.fragment-wrapper').replaceWith(...fragmentSection.childNodes);
    }
  }
}

export { decorate as default };
//# sourceMappingURL=fragment.js.map
