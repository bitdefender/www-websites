import { getSectionContent, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/logo-marquee/logo-marquee.js
var ASSET_SCALE = 1.5;
var GAPS = {
	default: "48",
	awards: "24"
};
var sizeLogo = (picture) => {
	const img = picture.querySelector("img");
	if (!img) return null;
	const width = Number(img.getAttribute("width"));
	const height = Number(img.getAttribute("height"));
	img.style.display = "block";
	img.style.maxWidth = "none";
	if (width && height) {
		img.style.width = `${Math.round(width / ASSET_SCALE)}px`;
		img.style.height = `${Math.round(height / ASSET_SCALE)}px`;
	}
	return picture;
};
var buildTextItem = (cell) => {
	const figure = cell.querySelector("strong, b")?.textContent.trim() || "";
	const rest = cell.cloneNode(true);
	rest.querySelector("strong, b")?.remove();
	const label = rest.querySelector("p") || rest;
	const item = document.createElement("span");
	item.style.cssText = "display: inline-flex; align-items: center; gap: var(--spacing-8); --bd-paragraph-margin-bottom: 0;";
	if (figure) {
		const display = document.createElement("bd-display");
		display.setAttribute("variant", "md");
		display.textContent = figure;
		item.append(display);
	}
	if (label.textContent.trim()) {
		const p = document.createElement("bd-p");
		p.setAttribute("variant", "small");
		p.style.width = "min-content";
		p.append(...label.childNodes);
		item.append(p);
	}
	return item.childElementCount ? item : null;
};
var getLabel = (block, textItem) => {
	if (textItem) return textItem.textContent.replace(/\s+/g, " ").trim();
	const section = block.closest(".section");
	const wrapper = section && getSectionContent(section).querySelector(":scope > .default-content-wrapper");
	return wrapper?.querySelector(":scope > bd-section-header")?.getAttribute("heading") || wrapper?.querySelector(":is(h1, h2, h3)")?.textContent.trim() || "";
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/logo-marquee.js"),
			import("../../vendor/repobit/dex-system-design/display.js"),
			import("../../vendor/repobit/dex-system-design/paragraph.js")
		]);
	} catch (err) {
		console.warn("logo-marquee: DSN import failed, continuing with native rendering", err);
	}
	const items = [];
	let textItem = null;
	[...block.querySelectorAll(":scope > div > div")].forEach((cell) => {
		const pictures = [...cell.querySelectorAll("picture")];
		if (pictures.length) {
			pictures.forEach((picture) => {
				const logo = sizeLogo(picture);
				if (logo) items.push(logo);
			});
			return;
		}
		if (!cell.textContent.trim()) return;
		const item = buildTextItem(cell);
		if (!item) return;
		if (!textItem) textItem = item;
		items.push(item);
	});
	if (!items.length) {
		block.replaceChildren();
		return;
	}
	const marquee = document.createElement("bd-logo-marquee");
	marquee.setAttribute("gap", block.classList.contains("awards") ? GAPS.awards : GAPS.default);
	const label = getLabel(block, textItem);
	if (label) marquee.setAttribute("label", label);
	marquee.append(...items);
	block.replaceChildren(marquee);
	await marquee.updateComplete;
	if (marquee.shadowRoot) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(".toggle { display: none; }");
		marquee.shadowRoot.adoptedStyleSheets = [...marquee.shadowRoot.adoptedStyleSheets, sheet];
	}
}
export { decorate as default };
