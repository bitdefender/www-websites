import { getSectionContent, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/accordion/accordion.js
/**
* The heading of the default content in the block's own section, or null
* when the block is not directly in its section.
* @param {HTMLElement} block
* @returns {HTMLElement|null}
*/
var getSectionHeading = (block) => {
	const content = getSectionContent(block.closest(".section"));
	const accordionWrapper = block.closest(".accordion-wrapper");
	if (!content || !accordionWrapper || accordionWrapper.parentElement !== content) return null;
	const heading = content.querySelector(":scope > .default-content-wrapper")?.querySelector("h1, h2, h3, h4, h5, h6");
	return heading?.textContent?.trim() ? heading : null;
};
/**
* The look the author picked with a class on the block or its section: terms
* in .terms-of-use or .system-requirements, whichever is nearest, and faq
* otherwise. faq is the look 3.x's bd-accordion-bg drew for every accordion
* without a terms class (a centred title over items that are cards on the
* brand wash), so an accordion with no look class, first-open among them,
* keeps it.
* @param {HTMLElement} block
* @returns {'faq'|'terms'}
*/
var getAppearance = (block) => {
	const looks = block.closest(".faq, .terms-of-use, .system-requirements");
	return !looks || looks.classList.contains("faq") ? "faq" : "terms";
};
/**
* A heading in a slot: bd-accordion and bd-accordion-item set its size, the
* page's outline its level.
* @param {string} text
* @param {number} level 1 to 6
*/
var buildTitle = (text, level) => {
	const bdH = document.createElement("bd-h");
	bdH.setAttribute("slot", "title");
	bdH.setAttribute("as", `h${level}`);
	bdH.textContent = text;
	return bdH;
};
var buildListItem = (li) => {
	const bdLi = document.createElement("bd-li");
	bdLi.setAttribute("appearance", "none");
	bdLi.setAttribute("size", "md");
	const bdP = document.createElement("bd-p");
	bdP.setAttribute("appearance", "small");
	bdP.innerHTML = li.innerHTML;
	bdLi.appendChild(bdP);
	return bdLi;
};
var buildList = (list) => {
	const bdList = document.createElement("bd-list");
	bdList.setAttribute("type", list.tagName === "OL" ? "ordered" : "unordered");
	bdList.setAttribute("spacing", "md");
	bdList.setAttribute("appearance", "default");
	bdList.setAttribute("orientation", "vertical");
	Array.from(list.querySelectorAll(":scope > li")).forEach((li) => {
		bdList.appendChild(buildListItem(li));
	});
	return bdList;
};
var buildAccordion = (block) => {
	const content = getSectionContent(block.closest(".section"));
	const defaultWrapper = content?.querySelector(":scope > .default-content-wrapper");
	const sectionHeading = getSectionHeading(block);
	if (defaultWrapper && sectionHeading) defaultWrapper.remove();
	const appearance = getAppearance(block);
	const accordion = document.createElement("bd-accordion");
	accordion.setAttribute("appearance", appearance);
	if (appearance === "faq") accordion.setAttribute("background", "none");
	const titleLevel = sectionHeading ? Number(sectionHeading.tagName[1]) : null;
	const itemLevel = titleLevel ? Math.min(titleLevel + 1, 6) : 3;
	if (sectionHeading) accordion.appendChild(buildTitle(sectionHeading.textContent.trim(), titleLevel));
	const isFirstOpen = block.classList.contains("first-open");
	Array.from(block.querySelectorAll(":scope > div")).forEach((row, index) => {
		const [headerCell, contentCell] = row.children;
		if (!headerCell) return;
		const title = headerCell.querySelector("h1, h2, h3, h4, h5, h6, p")?.textContent?.trim() || headerCell.textContent.trim();
		const item = document.createElement("bd-accordion-item");
		if (appearance === "faq") item.setAttribute("background", "tint");
		const itemTitle = buildTitle(title, itemLevel);
		item.appendChild(itemTitle);
		if (isFirstOpen && index === 0) item.setAttribute("open", "");
		if (contentCell) {
			const children = Array.from(contentCell.children);
			const hasDirectText = Array.from(contentCell.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
			if (children.length && !hasDirectText) {
				const mapped = children.map((el) => {
					if (el.tagName === "P") {
						const bdP = document.createElement("bd-p");
						bdP.innerHTML = el.innerHTML;
						return bdP;
					}
					if (el.tagName === "UL" || el.tagName === "OL") return buildList(el);
					return el.cloneNode(true);
				});
				item.replaceChildren(itemTitle, ...mapped);
			} else {
				const bdP = document.createElement("bd-p");
				bdP.innerHTML = contentCell.innerHTML;
				item.replaceChildren(itemTitle, bdP);
			}
		}
		accordion.appendChild(item);
	});
	const accordionWrapper = block.closest(".accordion-wrapper");
	if (accordionWrapper && content && accordionWrapper.parentElement === content) content.querySelectorAll(":scope > .default-content-wrapper").forEach((wrapper) => {
		Array.from(wrapper.querySelectorAll(":scope > p")).forEach((p) => {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("appearance", "small");
			bdP.setAttribute("slot", "footer");
			bdP.innerHTML = p.innerHTML;
			accordion.appendChild(bdP);
		});
		wrapper.remove();
	});
	return accordion;
};
async function decorate(block) {
	const bdSection = wrapSectionInDsSection(block);
	const accordion = buildAccordion(block);
	const wrapper = block.closest(".accordion-wrapper");
	const holdsOnlyTheBand = bdSection && wrapper?.parentElement === bdSection && [...bdSection.children].every((child) => child === wrapper);
	if (accordion.getAttribute("appearance") === "terms" && holdsOnlyTheBand) {
		bdSection.setAttribute("without-padding-top", "");
		bdSection.setAttribute("without-padding-bottom", "");
	}
	await load(accordion);
	block.replaceChildren(accordion);
	document.dispatchEvent(new CustomEvent("accordion-bg:loaded", { bubbles: true }));
}
export { decorate as default };
