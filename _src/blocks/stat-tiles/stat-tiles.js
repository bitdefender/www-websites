import { fullWidthOnPhone, liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/stat-tiles/stat-tiles.js
var TABLET = "(min-width: 768px)";
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
/** A value cell: the figure, and its spoken form from an <em> when there is one. */
var readValue = (cell) => {
	const spoken = cell?.querySelector("em");
	const copy = cell?.cloneNode(true);
	copy?.querySelectorAll("em").forEach((em) => em.remove());
	return {
		value: text(copy),
		label: text(spoken)
	};
};
var buildLead = (row) => {
	const [valueCell, copyCell] = row.children;
	const { value, label } = readValue(valueCell);
	const lead = document.createElement("div");
	lead.className = "stat-tiles-lead";
	const highlight = document.createElement("bd-stat-highlight");
	highlight.setAttribute("value", value);
	if (label) highlight.setAttribute("label", label);
	lead.append(highlight);
	const link = copyCell?.querySelector("a");
	[...copyCell?.querySelectorAll("p") || []].filter((p) => text(p) && !p.contains(link)).forEach((p) => {
		const paragraph = document.createElement("bd-p");
		paragraph.setAttribute("variant", "large");
		paragraph.textContent = text(p);
		lead.append(paragraph);
	});
	if (copyCell && !copyCell.querySelector("p") && text(copyCell)) {
		const paragraph = document.createElement("bd-p");
		paragraph.setAttribute("variant", "large");
		paragraph.textContent = text(copyCell);
		lead.append(paragraph);
	}
	if (link) {
		const button = document.createElement("bd-button-link");
		button.setAttribute("variant", "primary");
		button.setAttribute("href", link.getAttribute("href") || "");
		if (link.target) button.setAttribute("target", link.target);
		button.textContent = text(link);
		fullWidthOnPhone(button);
		lead.append(button);
	}
	return lead;
};
var buildTile = (row) => {
	const [valueCell, captionCell] = row.children;
	const { value, label } = readValue(valueCell);
	const tile = document.createElement("bd-stat-tile");
	tile.setAttribute("value", value);
	if (text(captionCell)) tile.setAttribute("caption", text(captionCell));
	if (label) tile.setAttribute("label", label);
	return tile;
};
var grid = (cols) => {
	const el = document.createElement("bd-grid");
	[
		"cols",
		"cols-sm",
		"cols-md",
		"cols-lg"
	].forEach((name, i) => el.setAttribute(name, cols[i]));
	return el;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/stat.js"),
			import("../../vendor/repobit/dex-system-design/grid.js"),
			import("../../vendor/repobit/dex-system-design/paragraph.js"),
			import("../../vendor/repobit/dex-system-design/button.js")
		]);
	} catch (err) {
		console.warn("stat-tiles: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	const rows = [...block.children];
	const leadRow = rows[0]?.children.length > 1 && rows[0].children[1].querySelector("p, a") ? rows.shift() : null;
	const layout = grid([
		"1",
		"1",
		"1",
		leadRow ? "2" : "1"
	]);
	layout.className = "stat-tiles-column ds-page-column";
	layout.setAttribute("gap", "md");
	const tiles = grid([
		"1",
		"1",
		"2",
		"2"
	]);
	const tablet = window.matchMedia?.(TABLET);
	const setGap = () => tiles.setAttribute("gap", !tablet || tablet.matches ? "md" : "sm");
	setGap();
	tablet?.addEventListener("change", setGap);
	tiles.append(...rows.map(buildTile));
	if (leadRow) layout.append(buildLead(leadRow));
	layout.append(tiles);
	block.replaceChildren(layout);
	await header;
}
export { decorate as default };
