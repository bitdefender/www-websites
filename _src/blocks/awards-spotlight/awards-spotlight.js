import { fullWidthOnPhone, getSectionContent, liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/awards-spotlight/awards-spotlight.js
var ASSET_SCALE = 1.5;
var LABEL = "Awards and recognition";
var ITEM_LABEL = "Go to award";
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
/** A row as a bd-award: its mark the logo bd-img, its h3 the title, its paragraph the text. */
var buildAward = (row) => {
	const title = row.querySelector("h1, h2, h3, h4, h5, h6");
	const img = row.querySelector("picture img, img");
	const body = [...row.querySelectorAll("p")].find((p) => text(p) && !p.querySelector("picture, img"));
	if (!title && !img) return null;
	const award = document.createElement("bd-award");
	if (img) {
		const logo = document.createElement("bd-img");
		logo.slot = "media";
		logo.setAttribute("src", img.currentSrc || img.src);
		logo.setAttribute("alt", img.getAttribute("alt") || "");
		const width = Number(img.getAttribute("width"));
		const height = Number(img.getAttribute("height"));
		if (width && height) {
			logo.setAttribute("width", String(Math.round(width / ASSET_SCALE)));
			logo.setAttribute("height", String(Math.round(height / ASSET_SCALE)));
		}
		logo.setAttribute("fit", "contain");
		award.append(logo);
	}
	if (text(title)) {
		const heading = document.createElement("bd-h");
		heading.slot = "title";
		heading.setAttribute("as", "h3");
		heading.textContent = text(title);
		award.append(heading);
	}
	if (text(body)) award.append(text(body));
	return award;
};
/**
* The section's authored button links, as a row of primary DS buttons under
* the header. The links stay as they are if the buttons fail to load.
*/
var liftActions = async (block) => {
	const section = block.closest(".section");
	const containers = [...(section && getSectionContent(section).querySelector(":scope > .default-content-wrapper"))?.querySelectorAll(":scope > .button-container") || []];
	if (!containers.length) return;
	const actions = document.createElement("div");
	actions.className = "awards-spotlight-actions ds-page-column";
	const buttons = containers.map((container) => {
		const link = container.querySelector("a");
		const button = document.createElement("bd-button");
		button.setAttribute("appearance", "primary");
		button.setAttribute("href", link?.getAttribute("href") || "");
		button.textContent = text(link);
		return button;
	});
	actions.append(...buttons);
	fullWidthOnPhone(...buttons);
	try {
		await load(actions);
	} catch (err) {
		console.warn("awards-spotlight: DSN import failed, keeping the authored links", err);
		return;
	}
	containers[0].before(actions);
	containers.forEach((container) => container.remove());
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block, { layout: "centered" });
	const spotlight = document.createElement("bd-awards");
	spotlight.setAttribute("layout", "spotlight");
	spotlight.setAttribute("autoplay", "");
	spotlight.setAttribute("label", LABEL);
	spotlight.setAttribute("item-label", ITEM_LABEL);
	spotlight.append(...[...block.children].map(buildAward).filter(Boolean));
	try {
		await load(spotlight);
	} catch (err) {
		console.warn("awards-spotlight: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	block.replaceChildren(spotlight);
	await header;
	await liftActions(block);
}
export { decorate as default };
