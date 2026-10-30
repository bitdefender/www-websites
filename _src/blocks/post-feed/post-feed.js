import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
// src/blocks/post-feed/post-feed.js
var DESKTOP = "(min-width: 992px)";
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
var buildCard = (row) => {
	const heading = row.querySelector("h1, h2, h3, h4, h5, h6");
	const link = heading?.querySelector("a") || row.querySelector("a");
	if (!heading && !link) return null;
	const category = [...row.querySelectorAll("p")].find((p) => text(p) && !p.querySelector("picture") && !p.contains(link));
	const card = document.createElement("bd-post-card");
	card.setAttribute("heading", text(heading || link));
	if (heading) card.setAttribute("as", heading.tagName.toLowerCase());
	if (link) card.setAttribute("href", link.getAttribute("href") || "");
	if (category) card.setAttribute("badge", text(category));
	const picture = row.querySelector("picture");
	if (picture) {
		picture.setAttribute("slot", "image");
		picture.querySelector("img")?.setAttribute("alt", "");
		card.append(picture);
	}
	return card;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/post-card.js"), import("../../vendor/repobit/dex-system-design/grid.js")]);
	} catch (err) {
		console.warn("post-feed: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	const grid = document.createElement("bd-grid");
	grid.className = "ds-page-column";
	[
		["cols", "1"],
		["cols-sm", "1"],
		["cols-md", "1"],
		["cols-lg", "3"]
	].forEach(([name, value]) => grid.setAttribute(name, value));
	const desktop = window.matchMedia?.(DESKTOP);
	const setGap = () => grid.setAttribute("gap", !desktop || desktop.matches ? "md" : "sm");
	setGap();
	desktop?.addEventListener("change", setGap);
	grid.append(...[...block.children].map(buildCard).filter(Boolean));
	block.replaceChildren(grid);
	await header;
}
export { decorate as default };
