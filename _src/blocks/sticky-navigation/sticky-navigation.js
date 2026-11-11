import { STICKY_NAVIGATION_DATASET_KEY } from "../../scripts/lib-franklin.js";
import { openModal } from "../../scripts/scripts.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
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
/**
* The appearance of a 3.x bd-button kind, the values a section's `data-kind`
* holds: the kinds 4.0 renamed, and plain, which 3.x drew as primary (4.0's
* plain is the text-only CTA). Any other kind is an appearance already.
*/
var APPEARANCE_OF_KIND = {
	outline: "ghost",
	"primary-outline": "tertiary",
	danger: "accent",
	destructive: "accent",
	plain: "primary"
};
/** A nav item: the link to a section, its words the label. */
function buildNavItem(label, href) {
	const navItem = document.createElement("bd-anchor-nav-item");
	if (href) navItem.setAttribute("href", href);
	navItem.textContent = label;
	return navItem;
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
/** Builds the items from the authored rows; returns the id of the active one, if any. */
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
		anchorNav.appendChild(buildNavItem(label, href));
	});
	if (!activeLabel) return null;
	const idx = rows.findIndex((p) => getRowLabel(p).toLowerCase() === activeLabel.toLowerCase());
	return idx >= 0 ? `anchor-${idx + 1}` : null;
}
function buildFromSections(anchorNav, block) {
	collectSectionItems(block).forEach((item, index) => {
		if (!item.section.id) item.section.id = `nav-section-${index + 1}`;
		anchorNav.appendChild(buildNavItem(item.label, `#${item.section.id}`));
	});
	const ctaKind = block.closest(".section")?.dataset.kind || "danger";
	const ctaAppearance = APPEARANCE_OF_KIND[ctaKind] || ctaKind;
	const ctaLink = block.querySelector("a");
	if (ctaLink) {
		const isModal = ctaLink.classList.contains("modal");
		const ctaHref = (ctaLink.getAttribute("href") || ctaLink.getAttribute("location") || "").replace(/\.html(?=#|$)/, "");
		const ctaLabel = ctaLink.textContent.trim();
		const buttonLink = document.createElement("bd-button");
		buttonLink.setAttribute("slot", "actions");
		buttonLink.setAttribute("href", ctaHref);
		buttonLink.setAttribute("appearance", ctaAppearance);
		buttonLink.setAttribute("size", "md");
		buttonLink.textContent = ctaLabel;
		if (isModal && ctaHref) buttonLink.addEventListener("click", (e) => {
			e.preventDefault();
			openModal(ctaHref, ctaLink.dataset.stopAutomaticModalRefresh === "true");
		});
		anchorNav.appendChild(buttonLink);
	}
}
/** Builds the nav; returns it with the id of the item to show active, if any. */
function buildAnchorNav(block) {
	const activeLabel = block.closest(".section")?.dataset.active || "";
	let activeId = null;
	const isAuthoredMode = Array.from(block.querySelectorAll("p")).filter((p) => p.textContent.trim() !== "").length >= 2;
	const anchorNav = document.createElement("bd-anchor-nav");
	anchorNav.setAttribute("aria-label", "Section navigation");
	if (isAuthoredMode) {
		activeId = buildFromAuthoredRows(anchorNav, block, activeLabel);
		anchorNav.addEventListener("click", (e) => {
			const navItem = e.composedPath().find((el) => el.localName === "bd-anchor-nav-item");
			if (!navItem) return;
			const href = navItem.getAttribute("href");
			if (!href || href.startsWith("#")) return;
			if (new URL(href, window.location.href).pathname === window.location.pathname) window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			else window.location.href = href;
		});
	} else buildFromSections(anchorNav, block);
	return {
		anchorNav,
		activeId
	};
}
async function decorate(block) {
	const { anchorNav, activeId } = buildAnchorNav(block);
	await load(anchorNav);
	block.replaceChildren(anchorNav);
	if (activeId) setTimeout(() => {
		anchorNav.activeId = activeId;
	}, 0);
}
export { decorate as default };
