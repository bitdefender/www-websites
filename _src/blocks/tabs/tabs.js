import { decorateIcons, loadBlocks, readBlockConfig } from "../../scripts/lib-franklin.js";
import { getSectionContent, slotIcon, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/tabs/tabs.js
var SECTION_LEVEL = 2;
/** One level under `level`, h6 at most. */
var below = (level) => Math.min(level + 1, 6);
var getImageSrc = (iconCell) => {
	const image = iconCell?.querySelector("img");
	return image?.currentSrc || image?.getAttribute("src") || "";
};
var parseIconColor = (cell) => {
	const match = cell?.textContent?.match(/#[0-9a-fA-F]{3,6}/);
	return match ? match[0] : null;
};
/** The icon size the cell names (`size: 32`), in px, or null. */
var parseIconSize = (cell) => {
	const match = cell?.textContent?.match(/\bsize:?\s*(\d+)/i);
	return match ? Number(match[1]) : null;
};
var ICON_STEPS = [
	["xs", 12],
	["sm", 16],
	["md", 20],
	["lg", 24],
	["xl", 32],
	["2xl", 48],
	["3xl", 64]
];
/** The step of the icon scale nearest a px size; between two, the larger. */
var nearestIconStep = (px) => ICON_STEPS.reduce((best, step) => Math.abs(step[1] - px) <= Math.abs(best[1] - px) ? step : best)[0];
/**
* The column's icon, as bd-feature-column's icon slot takes it: the cell's
* image as a bd-img, at the size the cell names or else 40px, the column
* icon of bd-feature-column's own examples; or its inline SVG as a bd-icon
* (slotIcon), at the step of the icon scale nearest the size the cell names.
* @param {HTMLElement} [iconCell]
* @returns {HTMLElement|null}
*/
var buildColumnIcon = (iconCell) => {
	const size = parseIconSize(iconCell);
	const imageSrc = getImageSrc(iconCell);
	if (imageSrc) {
		const img = document.createElement("bd-img");
		img.slot = "icon";
		img.setAttribute("src", imageSrc);
		img.setAttribute("alt", "");
		img.setAttribute("width", String(size || 40));
		img.setAttribute("height", String(size || 40));
		return img;
	}
	const iconSpan = iconCell?.querySelector("span.icon");
	if (!iconSpan) return null;
	return slotIcon(iconSpan, {
		color: parseIconColor(iconCell),
		...size && { size: nearestIconStep(size) }
	});
};
/**
* A heading in a slot: the component around it sets its size, the page's
* outline its level.
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
/**
* The tab group with the section's title, at the level the page wrote it,
* and its description.
* @param {{ title: string, level: number, subtitle: string, tint: boolean }} context
*/
var buildTabGroup = ({ title, level, subtitle, tint }) => {
	const group = document.createElement("bd-tab-group");
	if (tint) group.setAttribute("background", "tint");
	if (title) group.appendChild(buildTitle(title, level));
	if (subtitle) {
		const bdP = document.createElement("bd-p");
		bdP.setAttribute("slot", "description");
		bdP.textContent = subtitle;
		group.appendChild(bdP);
	}
	return group;
};
/**
* Adds a tab and the panel it shows to the group, paired by a name made from
* the label, unique in the group.
* @param {HTMLElement} group the bd-tab-group
* @param {string} label the tab's words
* @returns {HTMLElement} the bd-tab-panel
*/
var addTab = (group, label) => {
	const slug = label.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "tab";
	const taken = new Set([...group.querySelectorAll(":scope > bd-tab-panel")].map((panel) => panel.getAttribute("name")));
	let name = slug;
	for (let n = 2; taken.has(name); n += 1) name = `${slug}-${n}`;
	const tab = document.createElement("bd-tab");
	tab.setAttribute("panel", name);
	tab.textContent = label;
	const panel = document.createElement("bd-tab-panel");
	panel.setAttribute("name", name);
	group.append(tab, panel);
	return panel;
};
/**
* A bd-feature-column: its title, icon and description, and an accordion
* that the rows under it fill.
* @param {HTMLElement[]} cells the row's title, icon and description cells
* @param {boolean} isFirstOpen
* @param {number} level the column title's heading level
*/
var buildTabCol = (cells, isFirstOpen, level) => {
	const [titleCell, iconCell, descCell] = cells;
	const heading = titleCell.querySelector("h1, h2, h3, h4, h5, h6");
	const col = document.createElement("bd-feature-column");
	col.appendChild(buildTitle(heading?.textContent?.trim() || titleCell.textContent.trim(), level));
	const icon = buildColumnIcon(iconCell);
	if (icon) col.appendChild(icon);
	if (descCell?.textContent.trim()) {
		const paragraphs = [...descCell.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim());
		(paragraphs.length ? paragraphs : [descCell]).forEach((source) => {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("slot", "description");
			bdP.innerHTML = source.innerHTML;
			col.appendChild(bdP);
		});
	}
	const accordion = document.createElement("bd-accordion");
	accordion.setAttribute("without-container", "");
	col.appendChild(accordion);
	col.accordion = accordion;
	col.isFirstOpen = isFirstOpen;
	col.firstItemAdded = false;
	col.itemLevel = below(level);
	return col;
};
var appendAccordionItem = (col, cells) => {
	const [titleCell, contentCell] = cells;
	const titleText = titleCell?.textContent?.trim();
	if (!titleText) return;
	const item = document.createElement("bd-accordion-item");
	item.appendChild(buildTitle(titleText, col.itemLevel));
	if (col.isFirstOpen && !col.firstItemAdded) item.setAttribute("open", "");
	col.firstItemAdded = true;
	if (contentCell) {
		const children = Array.from(contentCell.children);
		if (children.length) children.forEach((child) => {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("appearance", "small");
			bdP.innerHTML = child.innerHTML;
			item.appendChild(bdP);
		});
		else {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("appearance", "small");
			bdP.innerHTML = contentCell.innerHTML;
			item.appendChild(bdP);
		}
	}
	col.accordion.appendChild(item);
};
/**
* What the group takes from its section: the heading in the section's
* default content and the paragraph after it, the heading's level, and
* whether the section is styled to stand on blue (the `bg-blue` config row or
* the tabs-container-v2 style).
* @param {HTMLElement} block
* @param {object} [config] the block's config rows
*/
var getSectionContext = (block, config = {}) => {
	const section = block.closest(".section");
	const content = getSectionContent(section);
	const wrapper = block.closest(".tabs-wrapper");
	const defaultWrapper = content && wrapper?.parentElement === content ? content.querySelector(":scope > .default-content-wrapper") : null;
	const titleEl = defaultWrapper?.querySelector("h1, h2, h3, h4, h5, h6") || null;
	const subtitleEl = titleEl?.nextElementSibling?.tagName === "P" ? titleEl.nextElementSibling : null;
	return {
		defaultWrapper,
		title: titleEl?.textContent?.trim() || "",
		level: titleEl ? Number(titleEl.tagName[1]) : SECTION_LEVEL,
		subtitle: subtitleEl?.textContent?.trim() || "",
		tint: "bg-blue" in config || !!section?.classList.contains("tabs-container-v2")
	};
};
var buildTabsFromBlock = (block, context) => {
	const tabsEl = buildTabGroup(context);
	const columnLevel = below(context.level);
	const isFirstOpen = block.classList.contains("first-open");
	let currentPanel = null;
	let currentFeatures = null;
	let currentCol = null;
	Array.from(block.querySelectorAll(":scope > div")).forEach((row) => {
		const cells = Array.from(row.children);
		const firstCell = cells[0];
		if (!firstCell) return;
		const heading = firstCell.querySelector("h1, h2, h3, h4, h5, h6");
		const headingLevel = heading ? parseInt(heading.tagName[1], 10) : null;
		if (headingLevel !== null && headingLevel <= 3) {
			currentPanel = addTab(tabsEl, heading.textContent.trim());
			currentFeatures = null;
			currentCol = null;
		} else if (headingLevel !== null) {
			if (!currentPanel) currentPanel = addTab(tabsEl, "");
			if (!currentFeatures) {
				currentFeatures = document.createElement("bd-feature-columns");
				currentPanel.appendChild(currentFeatures);
			}
			currentCol = buildTabCol(cells, isFirstOpen, columnLevel);
			currentFeatures.appendChild(currentCol);
		} else if (currentCol) appendAccordionItem(currentCol, cells);
	});
	return tabsEl;
};
function buildTabsFromSections(config, context) {
	const tabGroupName = config["tab-group"];
	const tabsSelector = tabGroupName ? `[data-tab-group="${tabGroupName}"][data-tab]` : "[data-tab]";
	const sections = [...document.querySelectorAll(tabsSelector)];
	if (!sections.length) return null;
	const bdTabs = buildTabGroup(context);
	sections.forEach((section) => {
		const tabPanel = addTab(bdTabs, section.dataset.tab);
		const content = getSectionContent(section);
		while (content.firstChild) tabPanel.appendChild(content.firstChild);
		section.remove();
	});
	return bdTabs;
}
async function decorate(block) {
	wrapSectionInDsSection(block);
	const config = readBlockConfig(block);
	if ("tab-group" in config) {
		[...block.children].forEach((child) => child.remove());
		const context = getSectionContext(block, config);
		if (context.defaultWrapper && context.title) context.defaultWrapper.remove();
		const bdTabs = buildTabsFromSections(config, context);
		if (bdTabs) {
			block.replaceChildren(bdTabs);
			try {
				await loadBlocks(bdTabs);
				await load(bdTabs);
			} catch (err) {
				console.warn("DSN imports failed (Mode 1)", err);
			}
		}
	} else {
		await decorateIcons(block);
		const context = getSectionContext(block);
		if (context.defaultWrapper && context.title) context.defaultWrapper.remove();
		const tabsEl = buildTabsFromBlock(block, context);
		try {
			await load(tabsEl);
		} catch (err) {
			console.warn("DSN imports failed (Mode 2)", err);
		}
		block.replaceChildren(tabsEl);
	}
}
export { decorate as default };
