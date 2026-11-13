import { liftSectionHeader, splitAroundHeading, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/bento-cards/bento-cards.js
var ART_LABELS = {
	"mesh-globe": (art, labels) => art.setAttribute("badges", labels),
	"layer-stack": (art, labels) => art.setAttribute("labels", labels),
	"geo-core": (art, labels) => {
		art.textContent = labels;
	}
};
var isLinkOnly = (p) => {
	const link = p.querySelector("a");
	return !!link && p.textContent.trim() === link.textContent.trim();
};
var buildArt = (cell) => {
	if (!cell) return null;
	const picture = cell.querySelector("picture");
	if (picture) {
		const img = picture.querySelector("img");
		const src = img?.currentSrc || img?.getAttribute("src");
		if (!src) return null;
		const art = document.createElement("bd-img");
		art.slot = "media";
		art.setAttribute("src", src);
		art.setAttribute("alt", img.getAttribute("alt") || "");
		return art;
	}
	const [name, ...rest] = [...cell.querySelectorAll("p")].map((p) => p.textContent.trim());
	const object = (name || cell.textContent).trim().toLowerCase();
	if (!ART_LABELS[object]) return null;
	const art = document.createElement("bd-motion-art");
	art.slot = "media";
	art.setAttribute("object", object);
	const labels = rest.join("|").split("|").map((label) => label.trim()).filter(Boolean);
	if (labels.length) ART_LABELS[object](art, labels.join("|"));
	return art;
};
/** The cell holding a card's art: a picture, or a bd-motion-art object's name. */
var isArtCell = (cell) => !!cell.querySelector("picture") || !!ART_LABELS[(cell.querySelector("p")?.textContent || cell.textContent).trim().toLowerCase()];
var slotted = (tag, slot, text) => {
	const el = document.createElement(tag);
	if (slot) el.slot = slot;
	el.textContent = text;
	return el;
};
var buildCard = (row) => {
	const cells = [...row.children];
	const copy = cells.find((cell) => cell.querySelector("h1, h2, h3, h4, h5, h6")) || cells.find((cell) => !isArtCell(cell));
	if (!copy) return null;
	const paragraphs = [...copy.querySelectorAll("p")].filter((p) => p.textContent.trim());
	const prose = paragraphs.filter((p) => !isLinkOnly(p));
	const { heading, before, after } = splitAroundHeading(copy, prose);
	if (!heading && !before.length && !after.length) return null;
	const card = document.createElement("bd-bento-item");
	card.setAttribute("background", "brand");
	const [badge] = before;
	if (badge) {
		const label = slotted("bd-badge", "badge", badge.textContent.trim());
		label.setAttribute("variant", "info");
		label.setAttribute("appearance", "shade");
		label.setAttribute("size", "sm");
		card.append(label);
	}
	if (heading) {
		const title = slotted("bd-h", "title", heading.textContent.trim());
		title.setAttribute("as", heading.tagName.toLowerCase());
		card.append(title);
	}
	const [body] = after;
	if (body) card.append(slotted("bd-p", "", body.textContent.trim()));
	const art = buildArt(cells.find((cell) => cell !== copy));
	if (art) card.append(art);
	paragraphs.filter(isLinkOnly).forEach((p) => {
		const link = p.querySelector("a");
		const cta = slotted("bd-button", "actions", link.textContent.trim());
		cta.setAttribute("appearance", "outline-white");
		cta.setAttribute("href", link.getAttribute("href") || "");
		card.append(cta);
	});
	return card;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	const cards = [...block.children].map(buildCard).filter(Boolean);
	if (cards.length % 2) cards.at(-1).setAttribute("priority", "featured");
	const grid = document.createElement("bd-bento-grid");
	grid.setAttribute("wide-share", "0.5");
	grid.setAttribute("min-card-width", "440");
	grid.append(...cards);
	try {
		await load(grid);
	} catch (err) {
		console.warn("bento-cards: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(grid);
	await header;
}
export { decorate as default };
