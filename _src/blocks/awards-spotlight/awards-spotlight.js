import { fullWidthOnPhone, getSectionContent, liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/awards-spotlight/awards-spotlight.js
var ASSET_SCALE = 1.5;
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
var readAward = (row) => {
	const title = row.querySelector("h1, h2, h3, h4, h5, h6");
	const img = row.querySelector("picture img, img");
	const body = [...row.querySelectorAll("p")].find((p) => text(p) && !p.querySelector("picture, img"));
	if (!title && !img) return null;
	const award = {
		title: text(title),
		body: text(body)
	};
	if (img) {
		award.logo = img.currentSrc || img.src;
		award.logoAlt = img.getAttribute("alt") || "";
		const width = Number(img.getAttribute("width"));
		const height = Number(img.getAttribute("height"));
		if (width && height) {
			award.logoWidth = Math.round(width / ASSET_SCALE);
			award.logoHeight = Math.round(height / ASSET_SCALE);
		}
	}
	return award;
};
/** The section's authored button links, as a row of primary DS buttons under the header. */
var liftActions = (block) => {
	const section = block.closest(".section");
	const containers = [...(section && getSectionContent(section).querySelector(":scope > .default-content-wrapper"))?.querySelectorAll(":scope > .button-container") || []];
	if (!containers.length) return;
	const actions = document.createElement("div");
	actions.className = "awards-spotlight-actions ds-page-column";
	const buttons = containers.map((container) => {
		const link = container.querySelector("a");
		const button = document.createElement("bd-button-link");
		button.setAttribute("variant", "primary");
		button.setAttribute("href", link?.getAttribute("href") || "");
		button.textContent = text(link);
		return button;
	});
	actions.append(...buttons);
	fullWidthOnPhone(...buttons);
	containers[0].before(actions);
	containers.forEach((container) => container.remove());
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block, { layout: "centered" });
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/awards-spotlight.js"), import("../../vendor/repobit/dex-system-design/button.js")]);
	} catch (err) {
		console.warn("awards-spotlight: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	const spotlight = document.createElement("bd-awards-spotlight");
	spotlight.awards = [...block.children].map(readAward).filter(Boolean);
	spotlight.setAttribute("autoplay", "");
	block.replaceChildren(spotlight);
	await header;
	liftActions(block);
}
export { decorate as default };
