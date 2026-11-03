import { loadBlocks } from "../../scripts/lib-franklin.js";
import { decorateMain, getLanguageCountryFromPath } from "../../scripts/scripts.js";
// src/blocks/fragment/fragment.js
/**
* Loads a fragment.
* @param {string} path The path to the fragment
* @returns {HTMLElement} The root element of the fragment
*/
async function loadFragment(path) {
	const { country, language } = getLanguageCountryFromPath();
	if (path && path.startsWith("/")) {
		try {
			path = path.replace(/lang/g, `${language}-${country}`);
		} catch (error) {
			console.log(error);
		}
		const resp = await fetch(`${path}.plain.html`);
		if (resp.ok) {
			const main = document.createElement("main");
			main.innerHTML = await resp.text();
			decorateMain(main);
			await loadBlocks(main);
			return main;
		}
	}
	return null;
}
async function decorate(block) {
	const link = block.querySelector("a");
	const fragment = await loadFragment(link ? link.getAttribute("href") : block.textContent.trim());
	if (fragment) {
		const fragmentSection = fragment.querySelector(":scope .section");
		if (fragmentSection) {
			block.closest(".section").classList.add(...fragmentSection.classList);
			block.closest(".fragment-wrapper").replaceWith(...fragmentSection.childNodes);
		}
	}
}
export { decorate as default };
