import { wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/spotlight-section/spotlight-section.js
var toImg = (src, alt) => {
	const img = document.createElement("bd-img");
	img.setAttribute("src", src);
	img.setAttribute("alt", alt);
	return img;
};
/** The logo, as a bd-img the band sizes. */
var getIcon = (block) => {
	const image = block.querySelector("img");
	const src = image && (image.currentSrc || image.getAttribute("src"));
	if (src) return toImg(src, image.getAttribute("alt") || "");
	const icon = block.querySelector("[class*=\"icon-\"]");
	const iconName = icon && Array.from(icon.classList).find((className) => className.startsWith("icon-"))?.substring(5);
	const markerName = block.textContent.match(/:([a-z0-9-]+):/i)?.[1];
	if (!iconName && !markerName) return null;
	return toImg(`/common/icons/${iconName || markerName}.svg`, "");
};
var getContentCells = (block, heading) => {
	const headingCell = heading && [...block.querySelectorAll("div")].find((cell) => cell.contains(heading) && cell.parentElement?.parentElement === block);
	const row = headingCell?.parentElement;
	return {
		headingCell,
		descriptionCell: row && [...row.children].find((cell) => cell !== headingCell && cell.textContent.trim())
	};
};
var getDescription = (block, heading, descriptionCell) => {
	const description = descriptionCell || [...block.querySelectorAll("p")].find((paragraph) => paragraph.textContent.trim());
	if (!description) return "";
	const cleanedDescription = description.cloneNode(true);
	cleanedDescription.querySelectorAll("svg, picture, img, [class*=\"icon-\"], .button-container, a.button").forEach((element) => element.remove());
	return cleanedDescription.textContent.replace(/:[a-z0-9-]+:/gi, "").replace(/\s+/g, " ").trim();
};
var appendButtons = (banner, cell, slot) => {
	if (!cell) return;
	cell.querySelectorAll(".button-container a, a.button").forEach((link, index) => {
		const button = document.createElement("bd-button");
		button.setAttribute("slot", slot);
		button.setAttribute("href", link.getAttribute("href") || "");
		button.setAttribute("appearance", slot === "description-actions" || index > 0 || link.classList.contains("secondary") ? "outline-white" : "white");
		button.setAttribute("size", "sm");
		button.textContent = link.textContent.trim();
		banner.append(button);
	});
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const heading = block.querySelector("h1, h2, h3, h4, h5, h6");
	const { headingCell, descriptionCell } = getContentCells(block, heading);
	const description = getDescription(block, heading, descriptionCell);
	const spotlightSection = document.createElement("bd-spotlight");
	const title = heading?.textContent.trim();
	if (title) {
		const titleHeading = document.createElement("bd-h");
		titleHeading.slot = "title";
		titleHeading.setAttribute("as", "h2");
		titleHeading.textContent = title;
		spotlightSection.append(titleHeading);
	}
	if (description) {
		const descriptionText = document.createElement("bd-p");
		descriptionText.slot = "description";
		descriptionText.textContent = description;
		spotlightSection.append(descriptionText);
	}
	const icon = getIcon(block);
	if (icon) {
		icon.slot = "icon";
		spotlightSection.append(icon);
	}
	appendButtons(spotlightSection, headingCell, "actions");
	appendButtons(spotlightSection, descriptionCell, "description-actions");
	try {
		await load(spotlightSection);
	} catch (err) {
		console.warn("spotlight-section: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(spotlightSection);
}
export { decorate as default };
