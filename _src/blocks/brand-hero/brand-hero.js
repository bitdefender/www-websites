import { splitAroundHeading, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/brand-hero/brand-hero.js
var DS_ICONS = [
	"home",
	"small-business",
	"enterprise"
];
var BREAK = "";
/**
* The element's text on one line, except where the author wrote a <br>: that
* becomes a newline, which slotted() writes back as a <br>.
*/
var text = (el) => {
	if (!el) return "";
	const copy = el.cloneNode(true);
	copy.querySelectorAll("br").forEach((br) => br.replaceWith(BREAK));
	return copy.textContent.split(BREAK).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
};
/**
* An element for one of a component's slots, holding the copy: its lines,
* a <br> between each, as the author broke them.
*/
var slotted = (tag, slot, copy, attributes = {}) => {
	const el = document.createElement(tag);
	el.slot = slot;
	Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value));
	copy.split("\n").forEach((line, index) => {
		if (index) el.append(document.createElement("br"));
		el.append(line);
	});
	return el;
};
/** The cell's text without its icon's, which decorateIcons may fill with markup. */
var labelText = (cell) => {
	if (!cell) return "";
	const copy = cell.cloneNode(true);
	copy.querySelectorAll(".icon").forEach((icon) => icon.remove());
	return text(copy);
};
/**
* The copy row: paragraphs before the heading are the eyebrow, after it the
* lead. Without a heading, the first of two or more is still the eyebrow.
*/
var readCopy = (row) => {
	const paragraphs = [...row.querySelectorAll("p")].filter((p) => text(p));
	const { heading, before, after } = splitAroundHeading(row, paragraphs);
	return {
		eyebrow: before.map(text).join(" "),
		heading: text(heading),
		lead: after.map(text).join(" ")
	};
};
var readIcon = (cell) => {
	const icon = cell?.querySelector(".icon");
	const name = icon && [...icon.classList].find((c) => c.startsWith("icon-"))?.substring(5);
	if (name && DS_ICONS.includes(name)) {
		const dsIcon = document.createElement("bd-icon");
		dsIcon.setAttribute("name", name);
		return dsIcon;
	}
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
	if (eyebrow) card.append(slotted("span", "eyebrow", eyebrow));
	if (text(heading)) card.append(slotted("bd-h", "title", text(heading), { as: "h2" }));
	if (description) card.append(slotted("bd-p", "description", text(description)));
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
	wrapSectionInDsSection(block)?.setAttribute("without-padding-top", "");
	const [copyRow, ...cardRows] = [...block.children];
	const { eyebrow, heading, lead } = readCopy(copyRow || block);
	const hero = document.createElement("bd-hero");
	if (eyebrow) hero.append(slotted("span", "eyebrow", eyebrow));
	if (heading) hero.append(slotted("bd-h", "title", heading, { as: "h1" }));
	if (lead) hero.append(slotted("bd-p", "description", lead));
	const art = document.createElement("bd-motion-art");
	art.setAttribute("slot", "media");
	art.setAttribute("object", "brand-surface");
	hero.append(art);
	const cards = cardRows.map(buildCard);
	if (cards.length) {
		const grid = document.createElement("bd-grid");
		grid.setAttribute("cols", "1");
		grid.setAttribute("cols-sm", "1");
		grid.setAttribute("cols-md", "1");
		grid.setAttribute("cols-lg", String(cards.length));
		grid.setAttribute("item-rows", "4");
		const desktop = window.matchMedia?.("(min-width: 992px)");
		const setGap = () => grid.setAttribute("gap", !desktop || desktop.matches ? "md" : "sm");
		setGap();
		desktop?.addEventListener("change", setGap);
		grid.append(...cards);
		hero.append(grid);
	}
	try {
		await load(hero);
	} catch (err) {
		console.warn("brand-hero: DSN import failed, keeping the authored content", err);
		return;
	}
	block.replaceChildren(hero);
}
export { decorate as default };
