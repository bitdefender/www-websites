import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/link-columns/link-columns.js
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
var buildColumn = (row) => {
	const link = row.querySelector("a");
	if (!link) return null;
	const description = [...row.querySelectorAll("p")].find((p) => text(p) && !p.contains(link));
	const column = document.createElement("div");
	column.className = "link-columns-item";
	const title = document.createElement("bd-link");
	title.setAttribute("href", link.getAttribute("href") || "");
	title.setAttribute("variant", "bold");
	title.setAttribute("arrow", "");
	title.textContent = text(link);
	column.append(title);
	if (description) {
		const body = document.createElement("bd-p");
		body.setAttribute("variant", "small");
		body.textContent = text(description);
		column.append(body);
	}
	return column;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	try {
		await Promise.all([
			import("../../vendor/repobit/dex-system-design/link.js"),
			import("../../vendor/repobit/dex-system-design/paragraph.js"),
			import("../../vendor/repobit/dex-system-design/grid.js")
		]);
	} catch (err) {
		console.warn("link-columns: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	const grid = document.createElement("bd-grid");
	grid.className = "ds-page-column";
	[
		["cols", "1"],
		["cols-sm", "1"],
		["cols-md", "2"],
		["cols-lg", "4"],
		["gap", "md"]
	].forEach(([name, value]) => grid.setAttribute(name, value));
	grid.append(...[...block.children].map(buildColumn).filter(Boolean));
	block.replaceChildren(grid);
	await header;
}
export { decorate as default };
