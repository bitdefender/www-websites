import { wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/icon-corners/icon-corners.js
var headingSelector = "h1, h2, h3, h4, h5, h6";
var titleFrom = (source) => {
	const title = document.createElement("bd-h");
	title.slot = "title";
	title.setAttribute("as", source.tagName.toLowerCase());
	title.innerHTML = source.innerHTML;
	return title;
};
var mediaFrom = (cell, slot) => {
	const icon = cell.querySelector("span.icon");
	const name = icon && [...icon.classList].find((value) => value.startsWith("icon-"))?.slice(5);
	const image = cell.querySelector("img");
	const src = name ? `/common/icons/${name}.svg` : image?.getAttribute("src");
	if (!src) return null;
	const media = document.createElement("bd-img");
	media.slot = slot;
	media.setAttribute("src", src);
	media.setAttribute("alt", "");
	media.setAttribute("fit", slot === "icon" ? "contain" : "cover");
	media.setAttribute("radius", "none");
	if (slot === "icon") {
		media.setAttribute("width", "56");
		media.setAttribute("height", "56");
	}
	return media;
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const banner = document.createElement("bd-icon-columns-banner");
	const [header, ...rows] = block.children;
	if (!header) return;
	const heading = [...header.querySelectorAll(headingSelector)].find((element) => element.textContent.trim() && !element.querySelector("span.icon"));
	if (heading) banner.append(titleFrom(heading));
	const cells = [...header.children];
	const headingIndex = cells.findIndex((cell) => cell.contains(heading));
	cells.forEach((cell, index) => {
		if (heading && cell.contains(heading)) return;
		const media = mediaFrom(cell, !!cell.querySelector(".icon-corner-right") || headingIndex !== -1 && index > headingIndex ? "corner-end" : "corner-start");
		if (media) banner.append(media);
	});
	rows.forEach((row) => {
		[...row.children].forEach((cell) => {
			if (!cell.querySelector("span.icon, img") && !cell.textContent.trim()) return;
			const item = document.createElement("bd-icon-columns-banner-item");
			const media = mediaFrom(cell, "icon");
			if (media) item.append(media);
			const title = [...cell.querySelectorAll(headingSelector)].find((element) => element.textContent.trim() && !element.querySelector("span.icon"));
			if (title) item.append(titleFrom(title));
			cell.querySelectorAll("p").forEach((paragraph) => {
				if (paragraph.querySelector("span.icon, picture") || !paragraph.textContent.trim()) return;
				const description = document.createElement("bd-p");
				description.slot = "description";
				description.innerHTML = paragraph.innerHTML;
				item.append(description);
			});
			banner.append(item);
		});
	});
	try {
		await load(banner);
	} catch (err) {
		console.warn("icon-corners: DSN import failed, keeping the authored content", err);
		return;
	}
	block.replaceChildren(banner);
}
export { decorate as default };
