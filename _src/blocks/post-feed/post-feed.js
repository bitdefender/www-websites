import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/post-feed/post-feed.js
var READ_MORE = "Read more";
var text = (el) => el?.textContent.replace(/\s+/g, " ").trim() || "";
var slotted = (tag, slot, words) => {
	const el = document.createElement(tag);
	el.slot = slot;
	el.textContent = words;
	return el;
};
var buildCover = (row) => {
	const picture = row.querySelector("picture");
	const img = picture?.querySelector("img");
	const webp = picture?.querySelector("source[type=\"image/webp\"]:not([media])")?.getAttribute("srcset");
	const src = img?.currentSrc || webp || img?.getAttribute("src");
	if (!img || !src) return null;
	const cover = document.createElement("bd-img");
	cover.slot = "media";
	cover.setAttribute("src", src);
	[
		"width",
		"height",
		"loading"
	].forEach((name) => {
		if (img.hasAttribute(name)) cover.setAttribute(name, img.getAttribute(name));
	});
	cover.setAttribute("alt", "");
	return cover;
};
var buildCard = (row) => {
	const heading = row.querySelector("h1, h2, h3, h4, h5, h6");
	const link = heading?.querySelector("a") || row.querySelector("a");
	if (!heading && !link) return null;
	const category = [...row.querySelectorAll("p")].find((p) => text(p) && !p.querySelector("picture") && !p.contains(link));
	const card = document.createElement("bd-post-card");
	if (link) card.setAttribute("href", link.getAttribute("href") || "");
	const cover = buildCover(row);
	if (cover) card.append(cover);
	if (category) {
		const badge = slotted("bd-badge", "badge", text(category));
		[
			["variant", "info"],
			["appearance", "shade"],
			["size", "sm"]
		].forEach(([name, value]) => badge.setAttribute(name, value));
		card.append(badge);
	}
	const title = slotted("bd-h", "title", text(heading || link));
	title.setAttribute("as", heading ? heading.tagName.toLowerCase() : "h3");
	card.append(title);
	if (link) card.append(slotted("span", "read-more", READ_MORE));
	return card;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block);
	const grid = document.createElement("bd-grid");
	grid.className = "ds-page-column";
	[
		["cols", "1"],
		["cols-sm", "1"],
		["cols-md", "1"],
		["cols-lg", "3"],
		["gap", "md"]
	].forEach(([name, value]) => grid.setAttribute(name, value));
	grid.append(...[...block.children].map(buildCard).filter(Boolean));
	try {
		await load(grid);
	} catch (err) {
		console.warn("post-feed: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	block.replaceChildren(grid);
	await header;
}
export { decorate as default };
