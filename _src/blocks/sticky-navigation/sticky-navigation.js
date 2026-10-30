import { STICKY_NAVIGATION_DATASET_KEY } from "../../scripts/lib-franklin.js";
// src/blocks/sticky-navigation/sticky-navigation.js
/** True if href is an anchor on the current page (#id or /same-path#id). */
function isPageAnchorHref(href) {
	if (!href) return false;
	if (href.startsWith("#")) return true;
	try {
		const url = new URL(href, window.location.href);
		return url.pathname === window.location.pathname && Boolean(url.hash);
	} catch {
		return false;
	}
}
/** Extract bare fragment id from #id or /page#id. */
function extractAnchorId(href) {
	if (href.startsWith("#")) return href.slice(1);
	try {
		return new URL(href, window.location.href).hash.slice(1);
	} catch {
		return "";
	}
}
function collectSectionItems(block) {
	const stickySection = block.closest(".section");
	const sections = Array.from(document.querySelectorAll(".section")).filter((s) => s !== stickySection);
	const labeled = sections.filter((s) => s.dataset[STICKY_NAVIGATION_DATASET_KEY]);
	if (labeled.length) return labeled.map((section) => ({
		label: section.dataset[STICKY_NAVIGATION_DATASET_KEY],
		section
	}));
	return sections.map((section) => {
		const label = section.querySelector("h1, h2, h3, h4, h5, h6")?.textContent?.trim() || "";
		return label ? {
			label,
			section
		} : null;
	}).filter(Boolean);
}
/** Label from an authored <p>: prefers link title/text, falls back to plain text. */
function getRowLabel(p) {
	const link = p.querySelector("a");
	return link?.getAttribute("title") || link?.textContent.trim() || p.textContent.trim();
}
function buildFromAuthoredRows(anchorNav, block, activeLabel) {
	const sectionItems = collectSectionItems(block);
	const rows = Array.from(block.querySelectorAll("p")).filter((p) => p.textContent.trim() !== "");
	rows.forEach((p, index) => {
		const link = p.querySelector("a[href]");
		const label = getRowLabel(p);
		let href = "";
		if (link) {
			const rawHref = link.getAttribute("href") || "";
			href = isPageAnchorHref(rawHref) ? `#${extractAnchorId(rawHref)}` : rawHref;
		} else {
			const match = sectionItems.find((item) => item.label.toLowerCase() === label.toLowerCase());
			if (match) {
				if (!match.section.id) match.section.id = `nav-section-${index + 1}`;
				href = `#${match.section.id}`;
			}
		}
		const navItem = document.createElement("bd-anchor-nav-item");
		navItem.setAttribute("title", label);
		if (href) navItem.setAttribute("href", href);
		anchorNav.appendChild(navItem);
	});
	if (activeLabel) {
		const idx = rows.findIndex((p) => getRowLabel(p).toLowerCase() === activeLabel.toLowerCase());
		if (idx >= 0) setTimeout(() => {
			anchorNav.activeId = `anchor-${idx + 1}`;
		}, 0);
	}
}
function buildFromSections(anchorNav, block) {
	collectSectionItems(block).forEach((item, index) => {
		if (!item.section.id) item.section.id = `nav-section-${index + 1}`;
		const navItem = document.createElement("bd-anchor-nav-item");
		navItem.setAttribute("title", item.label);
		navItem.setAttribute("href", `#${item.section.id}`);
		anchorNav.appendChild(navItem);
	});
	const ctaKind = block.closest(".section")?.dataset.kind || "danger";
	const ctaLink = block.querySelector("a");
	if (ctaLink) {
		const ctaHref = ctaLink.getAttribute("href")?.replace(/\.html(?=#|$)/, "") || "";
		const ctaLabel = ctaLink.textContent.trim();
		const buttonLink = document.createElement("bd-button-link");
		buttonLink.setAttribute("slot", "cta");
		buttonLink.setAttribute("href", ctaHref);
		buttonLink.setAttribute("kind", ctaKind);
		buttonLink.setAttribute("size", "md");
		buttonLink.textContent = ctaLabel;
		anchorNav.appendChild(buttonLink);
	}
}
function buildAnchorNav(block) {
	const activeLabel = block.closest(".section")?.dataset.active || "";
	const isAuthoredMode = Array.from(block.querySelectorAll("p")).filter((p) => p.textContent.trim() !== "").length >= 2;
	const anchorNav = document.createElement("bd-anchor-nav");
	if (isAuthoredMode) {
		buildFromAuthoredRows(anchorNav, block, activeLabel);
		anchorNav.addEventListener("click", (e) => {
			const bdLink = e.composedPath().find((el) => el.tagName === "BD-LINK");
			if (!bdLink) return;
			const href = bdLink.getAttribute("href");
			if (!href || href.startsWith("#")) return;
			if (new URL(href, window.location.href).pathname === window.location.pathname) window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			else window.location.href = href;
		});
	} else buildFromSections(anchorNav, block);
	block.replaceChildren(anchorNav);
}
async function decorate(block) {
	await Promise.all([import("../../vendor/repobit/dex-system-design/anchor.js"), import("../../vendor/repobit/dex-system-design/button.js")]);
	buildAnchorNav(block);
}
export { decorate as default };
