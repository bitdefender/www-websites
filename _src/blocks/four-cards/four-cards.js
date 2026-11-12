import { getSectionContent, liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/four-cards/four-cards.js
var HEADINGS = "h1, h2, h3, h4, h5, h6";
var iconName = (el) => [...el?.classList || []].find((cls) => cls.startsWith("icon-"))?.substring(5);
/** An authored picture as a bd-img: its source, its alt, and its size as an aspect hint. */
var toImg = (picture) => {
	const img = picture.querySelector("img");
	const src = img?.currentSrc || img?.getAttribute("src");
	if (!src) return null;
	const image = document.createElement("bd-img");
	image.setAttribute("src", src);
	image.setAttribute("alt", img.getAttribute("alt") || "");
	["width", "height"].forEach((name) => {
		if (img.hasAttribute(name)) image.setAttribute(name, img.getAttribute(name));
	});
	return image;
};
/** The card's icon, a bd-img the card sizes to its icon frame, and the picture it came from. */
var getIcon = (row) => {
	const name = iconName(row.querySelector("[class*=\"icon-\"]"));
	if (name) {
		const icon = document.createElement("bd-img");
		icon.slot = "icon";
		icon.setAttribute("src", `/common/icons/${name}.svg`);
		icon.setAttribute("alt", "");
		return { icon };
	}
	const picture = row.querySelector("picture");
	const icon = picture && toImg(picture);
	if (icon) icon.slot = "icon";
	return {
		icon,
		picture
	};
};
/** A picture in a card's copy, inside a bd-link when it is authored as a linked image. */
var toMedia = (picture) => {
	const image = toImg(picture);
	const anchor = picture.closest("a.linked-image");
	if (!image || !anchor) return image;
	const link = document.createElement("bd-link");
	link.setAttribute("href", anchor.getAttribute("href") || "");
	if (anchor.target) link.setAttribute("target", anchor.target);
	image.slot = "start";
	link.append(image);
	return link;
};
var buildCta = (link, shape) => {
	const button = document.createElement("bd-button");
	button.setAttribute("appearance", "accent");
	button.setAttribute("href", link.getAttribute("href") || "");
	if (shape) button.setAttribute("shape", shape);
	button.textContent = link.textContent.trim();
	return button;
};
var buildCard = (row, shape) => {
	const card = document.createElement("bd-card");
	const { icon, picture: iconPicture } = getIcon(row);
	if (icon) card.append(icon);
	const titleHtml = [...row.querySelectorAll(HEADINGS)].map((h) => h.innerHTML.trim()).filter(Boolean).join("<br>");
	if (titleHtml) {
		const title = document.createElement("bd-h");
		title.slot = "title";
		title.setAttribute("as", "h3");
		title.innerHTML = titleHtml;
		card.append(title);
	}
	[...row.querySelectorAll("p")].forEach((p) => {
		const picture = p.querySelector("picture");
		if (picture) {
			if (picture === iconPicture) return;
			const media = toMedia(picture);
			if (media) card.append(media);
			return;
		}
		if (p.querySelector("[class*=\"icon-\"]") || !p.textContent.trim()) return;
		const link = p.querySelector("a");
		if (link) {
			const cta = buildCta(link, shape);
			cta.slot = "actions";
			card.append(cta);
			return;
		}
		const copy = document.createElement("bd-p");
		copy.innerHTML = p.innerHTML;
		card.append(copy);
	});
	return card;
};
var hasMedia = (row) => !!row?.querySelector("picture, img, [class*=\"icon-\"]");
/** A row holding a heading and nothing else: the grid's title. */
var isTitleRow = (row) => !!row?.querySelector(HEADINGS) && !hasMedia(row) && ![...row.querySelectorAll("p")].some((p) => p.textContent.trim());
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block, { defaultLayout: "centered" });
	const section = block.closest(".section");
	const { shape } = section?.dataset || {};
	const centered = section?.classList.contains("centered");
	const blue = block.classList.contains("blue") || section?.classList.contains("blue");
	const rows = [...block.children].filter((row) => row.textContent.trim() || hasMedia(row));
	const titleRow = isTitleRow(rows[0]) ? rows.shift() : null;
	const grid = document.createElement("bd-card-grid");
	if (titleRow) {
		const title = document.createElement("bd-h");
		title.slot = "title";
		title.setAttribute("as", "h2");
		title.textContent = titleRow.querySelector(HEADINGS).textContent.trim();
		grid.append(title);
	}
	rows.forEach((row) => {
		const card = buildCard(row, shape);
		if (centered) card.setAttribute("align", "center");
		if (blue) card.setAttribute("background", "tint");
		grid.append(card);
	});
	const wrappers = [...getSectionContent(section)?.querySelectorAll(":scope > .default-content-wrapper") || []];
	const ctas = wrappers.flatMap((wrapper) => [...wrapper.querySelectorAll(".button-container a")]).map((link) => {
		const cta = buildCta(link, shape);
		cta.setAttribute("align", "center");
		link.closest(".button-container").remove();
		return cta;
	});
	try {
		await load([grid, ...ctas]);
	} catch (err) {
		console.warn("four-cards: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(grid, ...ctas);
	await header;
	wrappers.filter((wrapper) => wrapper.isConnected && !wrapper.children.length).filter((wrapper) => !wrapper.textContent.trim()).forEach((wrapper) => wrapper.remove());
}
export { decorate as default };
