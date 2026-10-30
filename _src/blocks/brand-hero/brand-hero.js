import { wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/brand-hero/brand-hero.js
var DS_ICONS = [
	"home",
	"small-business",
	"enterprise"
];
var BREAK = "";
/**
* The element's text on one line, except where the author wrote a <br>: that
* becomes a newline, which bd-hero and bd-audience-card render as a break.
*/
var text = (el) => {
	if (!el) return "";
	const copy = el.cloneNode(true);
	copy.querySelectorAll("br").forEach((br) => br.replaceWith(BREAK));
	return copy.textContent.split(BREAK).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
};
/** The cell's text without its icon's, which decorateIcons may fill with markup. */
var labelText = (cell) => {
	if (!cell) return "";
	const copy = cell.cloneNode(true);
	copy.querySelectorAll(".icon").forEach((icon) => icon.remove());
	return text(copy);
};
/** The copy row: paragraphs before the heading are the eyebrow, after it the lead. */
var readCopy = (row) => {
	const heading = row.querySelector("h1, h2, h3, h4, h5, h6");
	const paragraphs = [...row.querySelectorAll("p")].filter((p) => text(p));
	const before = paragraphs.filter((p) => heading && p.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
	const after = paragraphs.filter((p) => !before.includes(p));
	return {
		eyebrow: before.map(text).join(" "),
		heading: text(heading),
		lead: after.map(text).join(" ")
	};
};
var readIcon = (cell) => {
	const icon = cell?.querySelector(".icon");
	const name = icon && [...icon.classList].find((c) => c.startsWith("icon-"))?.substring(5);
	if (name && DS_ICONS.includes(name)) return document.createElement(`bd-${name}-icon`);
	return icon ? icon.cloneNode(true) : null;
};
/** A card row: [icon + eyebrow] [heading, description, link]; either cell may be missing. */
var buildCard = (row) => {
	const cells = [...row.children];
	const content = cells.find((c) => c.querySelector("h1, h2, h3, h4, h5, h6, a")) || cells.at(-1);
	const label = cells.find((c) => c !== content);
	const heading = content?.querySelector("h1, h2, h3, h4, h5, h6");
	const link = content?.querySelector("a");
	const description = [...content?.querySelectorAll("p") || []].find((p) => text(p) && !p.contains(link));
	const card = document.createElement("bd-audience-card");
	const eyebrow = labelText(label);
	if (eyebrow) card.setAttribute("eyebrow", eyebrow);
	card.setAttribute("heading", text(heading));
	if (description) card.setAttribute("description", text(description));
	if (link) {
		card.setAttribute("href", link.getAttribute("href") || "");
		if (link.target) card.setAttribute("target", link.target);
		if (text(link)) card.setAttribute("label", text(link));
	}
	const icon = readIcon(label);
	if (icon) {
		icon.setAttribute("slot", "icon");
		card.append(icon);
	}
	return card;
};
async function decorate(block) {
	wrapSectionInDsSection(block)?.setAttribute("no-padding-top", "");
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/hero.js"),
			import("../../vendor/repobit/dex-system-design/motion-art.js"),
			import("../../vendor/repobit/dex-system-design/audience-card.js"),
			import("../../vendor/repobit/dex-system-design/grid.js"),
			import("../../vendor/repobit/dex-system-design/icons.js")
		]);
	} catch (err) {
		console.warn("brand-hero: DSN import failed, keeping the authored content", err);
		return;
	}
	const [copyRow, ...cardRows] = [...block.children];
	const { eyebrow, heading, lead } = readCopy(copyRow || block);
	const hero = document.createElement("bd-hero");
	if (eyebrow) hero.setAttribute("eyebrow", eyebrow);
	hero.setAttribute("heading", heading);
	if (lead) hero.setAttribute("lead", lead);
	const art = document.createElement("bd-motion-art");
	art.setAttribute("slot", "media");
	art.setAttribute("object", "brand-surface");
	hero.append(art);
	const cards = cardRows.map(buildCard);
	if (cards.length) {
		const grid = document.createElement("bd-grid");
		grid.setAttribute("slot", "cards");
		grid.setAttribute("cols", "1");
		grid.setAttribute("cols-sm", "1");
		grid.setAttribute("cols-md", "1");
		grid.setAttribute("cols-lg", String(Math.min(cards.length, 3)));
		const desktop = window.matchMedia?.("(min-width: 992px)");
		const setGap = () => grid.setAttribute("gap", !desktop || desktop.matches ? "md" : "sm");
		setGap();
		desktop?.addEventListener("change", setGap);
		grid.append(...cards);
		hero.append(grid);
	}
	block.replaceChildren(hero);
}
export { decorate as default };
