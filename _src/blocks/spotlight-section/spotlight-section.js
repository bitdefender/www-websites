// src/blocks/spotlight-section/spotlight-section.js
var getIcon = (block) => {
	const picture = block.querySelector("picture");
	if (picture) return picture.cloneNode(true);
	const image = block.querySelector("img");
	if (image) return image.cloneNode(true);
	const icon = block.querySelector("[class*=\"icon-\"]");
	const iconName = icon && Array.from(icon.classList).find((className) => className.startsWith("icon-"))?.substring(5);
	const markerName = block.textContent.match(/:([a-z0-9-]+):/i)?.[1];
	if (!iconName && !markerName) return null;
	const iconImage = document.createElement("img");
	iconImage.src = `/common/icons/${iconName || markerName}.svg`;
	iconImage.alt = "";
	return iconImage;
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
		const button = document.createElement("bd-button-link");
		button.setAttribute("slot", slot);
		button.setAttribute("href", link.getAttribute("href") || "");
		button.setAttribute("label", link.textContent.trim());
		button.setAttribute("kind", slot === "right-buttons" || index > 0 || link.classList.contains("secondary") ? "outline-white" : "white");
		button.setAttribute("size", "sm");
		button.innerHTML = link.innerHTML;
		banner.append(button);
	});
};
async function decorate(block) {
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/spotlight-section.js"), import("../../vendor/repobit/dex-system-design/button.js")]);
	} catch (err) {
		console.warn("spotlight-section: DSN import failed, continuing with native rendering", err);
	}
	const heading = block.querySelector("h1, h2, h3, h4, h5, h6");
	const { headingCell, descriptionCell } = getContentCells(block, heading);
	const description = getDescription(block, heading, descriptionCell);
	const spotlightSection = document.createElement("bd-spotlight-section");
	const title = heading?.textContent.trim();
	if (title) spotlightSection.setAttribute("title", title);
	if (description) spotlightSection.setAttribute("description", description);
	const icon = getIcon(block);
	if (icon) {
		icon.setAttribute("slot", "icon");
		spotlightSection.append(icon);
	}
	appendButtons(spotlightSection, headingCell, "left-buttons");
	appendButtons(spotlightSection, descriptionCell, "right-buttons");
	block.replaceChildren(spotlightSection);
}
export { decorate as default };
