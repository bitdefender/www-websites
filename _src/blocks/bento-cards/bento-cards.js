import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/bento-cards/bento-cards.js
var ART_LABELS = {
	"mesh-globe": "badges",
	"layer-stack": "labels",
	"geo-core": "label"
};
var isLinkOnly = (p) => {
	const link = p.querySelector("a");
	return !!link && p.textContent.trim() === link.textContent.trim();
};
var buildArt = (cell) => {
	if (!cell) return null;
	const picture = cell.querySelector("picture");
	if (picture) {
		picture.slot = "media";
		return picture;
	}
	const [name, ...rest] = [...cell.querySelectorAll("p")].map((p) => p.textContent.trim());
	const object = (name || cell.textContent).trim().toLowerCase();
	if (!ART_LABELS[object]) return null;
	const art = document.createElement("bd-motion-art");
	art.slot = "media";
	art.setAttribute("object", object);
	const labels = rest.join("|").split("|").map((label) => label.trim()).filter(Boolean);
	if (labels.length) art.setAttribute(ART_LABELS[object], labels.join("|"));
	return art;
};
var buildCard = (row) => {
	const cells = [...row.children];
	const copy = cells.find((cell) => cell.querySelector("h1, h2, h3, h4, h5, h6"));
	if (!copy) return null;
	const heading = copy.querySelector("h1, h2, h3, h4, h5, h6");
	const paragraphs = [...copy.querySelectorAll("p")];
	const before = paragraphs.filter((p) => heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_PRECEDING);
	const after = paragraphs.filter((p) => !before.includes(p));
	const card = document.createElement("bd-bento-item");
	card.setAttribute("tone", "brand");
	card.setAttribute("as", heading.tagName.toLowerCase());
	card.setAttribute("title", heading.textContent.trim());
	const badge = before.find((p) => p.textContent.trim());
	if (badge) card.setAttribute("badge", badge.textContent.trim());
	const body = after.find((p) => p.textContent.trim() && !isLinkOnly(p));
	if (body) card.setAttribute("body", body.textContent.trim());
	const art = buildArt(cells.find((cell) => cell !== copy));
	if (art) card.append(art);
	after.filter(isLinkOnly).forEach((p) => {
		const link = p.querySelector("a");
		const cta = document.createElement("bd-button-link");
		cta.setAttribute("variant", "outline-white");
		cta.setAttribute("href", link.getAttribute("href") || "");
		cta.textContent = link.textContent.trim();
		card.append(cta);
	});
	return card;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/bento-grid.js"),
			import("../../vendor/repobit/dex-system-design/motion-art.js"),
			import("../../vendor/repobit/dex-system-design/button.js")
		]);
	} catch (err) {
		console.warn("bento-cards: DSN import failed, continuing with native rendering", err);
	}
	const cards = [...block.children].map(buildCard).filter(Boolean);
	if (cards.length % 2) cards.at(-1).setAttribute("priority", "featured");
	const grid = document.createElement("bd-bento-grid");
	grid.setAttribute("wide-share", "0.5");
	grid.setAttribute("min-card-width", "440");
	grid.append(...cards);
	block.replaceChildren(grid);
	await header;
}
export { decorate as default };
