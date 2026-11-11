import { decorateIcons } from "../../scripts/lib-franklin.js";
import { slotIcon } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/features/features.js
var parseTrailingGreenPill = (text) => {
	const marker = text.match(/\[\$([^\]]+?)\$\]\s*$/);
	if (marker) return {
		title: text.replace(/\s*\[\$[^\]]+?\$\]\s*$/, "").trim(),
		pill: marker[1].trim()
	};
	const bracket = text.match(/\[([^\]]+?)\]\s*$/);
	if (!bracket) return {
		title: text.trim(),
		pill: ""
	};
	const candidate = bracket[1].trim();
	if (!/^[A-Z0-9+&\- ]{2,}$/.test(candidate)) return {
		title: text.trim(),
		pill: ""
	};
	return {
		title: text.replace(/\s*\[[^\]]+?\]\s*$/, "").trim(),
		pill: candidate
	};
};
var getTitleAndPill = (headingEl) => {
	const greenTag = headingEl.querySelector(".tag-green");
	if (greenTag) {
		const clone = headingEl.cloneNode(true);
		clone.querySelectorAll(".tag-green").forEach((tag) => tag.remove());
		return {
			title: clone.textContent.trim(),
			pill: greenTag.textContent.trim()
		};
	}
	return parseTrailingGreenPill(headingEl.textContent.trim());
};
var createGreenBadge = (pill) => {
	const badge = document.createElement("span");
	badge.setAttribute("slot", "badge");
	badge.textContent = pill;
	badge.style.display = "inline-flex";
	badge.style.alignItems = "center";
	badge.style.padding = "2px 8px";
	badge.style.borderRadius = "999px";
	badge.style.background = "#0A7D39";
	badge.style.color = "#fff";
	badge.style.fontSize = "12px";
	badge.style.fontWeight = "600";
	badge.style.lineHeight = "1.2";
	return badge;
};
/**
* A heading in a slot: the component around it draws it, the page picks its
* level.
* @param {string} text
* @param {string} as the level, h1 to h6
*/
var buildTitle = (text, as) => {
	const bdH = document.createElement("bd-h");
	bdH.setAttribute("slot", "title");
	bdH.setAttribute("as", as);
	bdH.textContent = text;
	return bdH;
};
/**
* The column's icon, as bd-feature-column's icon slot takes it: the page's
* inline SVG as a bd-icon (slotIcon), or its image as a 40px bd-img.
* @param {HTMLElement} col the authored column
* @returns {HTMLElement|null}
*/
var getIconElement = (col) => {
	const iconSpan = col.querySelector("span.icon");
	if (iconSpan) {
		const color = [...col.querySelectorAll("p")].map((p) => p.textContent.trim()).find((text) => /^#[0-9a-fA-F]{3,6}$/.test(text));
		return slotIcon(iconSpan, { color });
	}
	const image = col.querySelector("img");
	if (!image) return null;
	const img = document.createElement("bd-img");
	img.slot = "icon";
	img.setAttribute("src", image.currentSrc || image.getAttribute("src") || "");
	img.setAttribute("alt", "");
	img.setAttribute("width", "40");
	img.setAttribute("height", "40");
	return img;
};
var buildFeatureCol = (col, firstOpen) => {
	const title = col.querySelector("h1, h2, h3")?.textContent?.trim() || "";
	const featureCol = document.createElement("bd-feature-column");
	if (title) featureCol.appendChild(buildTitle(title, "h4"));
	const iconEl = getIconElement(col);
	if (iconEl) featureCol.appendChild(iconEl);
	const h4s = [...col.querySelectorAll("h4")];
	const firstH4 = h4s[0] || null;
	const descParts = [];
	Array.from(col.children).some((child) => {
		if (child === firstH4) return true;
		if (child.tagName === "P" && !child.querySelector("[class*=\"icon-\"]") && child.textContent.trim() && !child.textContent.trim().match(/^#[0-9a-fA-F]{3,6}$/)) descParts.push(child.innerHTML);
		return false;
	});
	if (descParts.length) {
		const desc = document.createElement("bd-p");
		desc.setAttribute("slot", "description");
		desc.setAttribute("appearance", "regular");
		desc.innerHTML = descParts.join(" ");
		featureCol.appendChild(desc);
	}
	if (h4s.length) {
		const accordion = document.createElement("bd-accordion");
		accordion.setAttribute("without-container", "");
		h4s.forEach((h4, index) => {
			const { title: itemTitle, pill } = getTitleAndPill(h4);
			const item = document.createElement("bd-accordion-item");
			item.appendChild(buildTitle(itemTitle || h4.textContent.trim(), "h3"));
			if (index === 0 && firstOpen) item.setAttribute("open", "");
			let next = h4.nextElementSibling;
			while (next && next.tagName !== "H4") {
				if (next.textContent.trim()) {
					const bdP = document.createElement("bd-p");
					bdP.setAttribute("appearance", "small");
					bdP.innerHTML = next.innerHTML;
					item.appendChild(bdP);
				}
				next = next.nextElementSibling;
			}
			if (pill) item.appendChild(createGreenBadge(pill));
			accordion.appendChild(item);
		});
		featureCol.appendChild(accordion);
	}
	return featureCol;
};
async function decorate(block) {
	await decorateIcons(block);
	const firstOpen = block.classList.contains("first-open");
	const featuresEl = document.createElement("bd-feature-columns");
	[...block.children].forEach((row) => {
		[...row.children].forEach((col) => {
			featuresEl.appendChild(buildFeatureCol(col, firstOpen));
		});
	});
	try {
		await load(featuresEl);
	} catch (err) {
		console.warn("features: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(featuresEl);
}
export { decorate as default };
