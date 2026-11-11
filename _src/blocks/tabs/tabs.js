import { decorateIcons, loadBlocks, readBlockConfig } from "../../scripts/lib-franklin.js";
import { slotIcon } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/tabs/tabs.js
var getImageSrc = (iconCell) => {
	const image = iconCell?.querySelector("img");
	return image?.currentSrc || image?.getAttribute("src") || "";
};
var parseIconColor = (cell) => {
	const match = cell?.textContent?.match(/#[0-9a-fA-F]{3,6}/);
	return match ? match[0] : null;
};
var parseIconSize = (cell) => {
	const match = cell?.textContent?.match(/\bsize:?\s*(\d+)/i);
	return match ? match[1] : "40";
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
* The tab group with the section's title and subtitle, which 3.x's bd-tabs
* drew at h3 and in a large paragraph.
* @param {string} title
* @param {string} subtitle
*/
var buildTabGroup = (title, subtitle) => {
	const group = document.createElement("bd-tab-group");
	if (title) group.appendChild(buildTitle(title, "h3"));
	if (subtitle) {
		const bdP = document.createElement("bd-p");
		bdP.setAttribute("slot", "description");
		bdP.setAttribute("appearance", "large");
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
var buildTabCol = (cells, isFirstOpen) => {
	const [titleCell, iconCell, descCell] = cells;
	const heading = titleCell.querySelector("h1, h2, h3, h4, h5, h6");
	const col = document.createElement("bd-feature-column");
	col.appendChild(buildTitle(heading?.textContent?.trim() || titleCell.textContent.trim(), "h4"));
	const icon = document.createElement("span");
	icon.setAttribute("slot", "icon");
	const imageSrc = getImageSrc(iconCell);
	const iconSpan = !imageSrc && iconCell?.querySelector("span.icon");
	if (imageSrc) {
		const img = document.createElement("img");
		img.src = imageSrc;
		icon.appendChild(img);
	} else if (iconSpan) icon.appendChild(slotIcon(iconSpan, {
		color: parseIconColor(iconCell),
		size: parseIconSize(iconCell)
	}));
	col.appendChild(icon);
	if (descCell) {
		if (descCell.textContent.trim()) {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("slot", "description");
			bdP.setAttribute("appearance", "regular");
			const paragraphs = [...descCell.querySelectorAll(":scope > p")];
			bdP.innerHTML = paragraphs.length ? paragraphs.map((p) => p.innerHTML).join(" ") : descCell.innerHTML;
			col.appendChild(bdP);
		}
	}
	const accordion = document.createElement("bd-accordion");
	accordion.setAttribute("without-container", "");
	col.appendChild(accordion);
	col.accordion = accordion;
	col.isFirstOpen = isFirstOpen;
	col.firstItemAdded = false;
	return col;
};
var appendAccordionItem = (col, cells) => {
	const [titleCell, contentCell] = cells;
	const titleText = titleCell?.textContent?.trim();
	if (!titleText) return;
	const item = document.createElement("bd-accordion-item");
	item.appendChild(buildTitle(titleText, "h3"));
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
var getSectionContext = (block) => {
	const section = block.closest(".section");
	const defaultWrapper = block.closest(".tabs-wrapper")?.parentElement === section ? section.querySelector(":scope > .default-content-wrapper") : null;
	const titleEl = defaultWrapper?.querySelector("h1, h2, h3, h4, h5, h6") || null;
	const subtitleEl = titleEl?.nextElementSibling?.tagName === "P" ? titleEl.nextElementSibling : null;
	return {
		defaultWrapper,
		title: titleEl?.textContent?.trim() || "",
		subtitle: subtitleEl?.textContent?.trim() || ""
	};
};
var buildTabsFromBlock = (block, title, subtitle) => {
	const tabsEl = buildTabGroup(title, subtitle);
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
			currentCol = buildTabCol(cells, isFirstOpen);
			currentFeatures.appendChild(currentCol);
		} else if (currentCol) appendAccordionItem(currentCol, cells);
	});
	return tabsEl;
};
function buildTabsFromSections(config, title, subtitle) {
	const tabGroupName = config["tab-group"];
	const tabsSelector = tabGroupName ? `[data-tab-group="${tabGroupName}"][data-tab]` : "[data-tab]";
	const sections = [...document.querySelectorAll(tabsSelector)];
	if (!sections.length) return null;
	const bdTabs = buildTabGroup(title, subtitle);
	if ("bg-blue" in config) bdTabs.setAttribute("background", "tint");
	sections.forEach((section) => {
		const tabPanel = addTab(bdTabs, section.dataset.tab);
		while (section.firstChild) tabPanel.appendChild(section.firstChild);
		section.remove();
	});
	return bdTabs;
}
function normalizeLoadingFeatureIcons(container) {
	container.querySelectorAll([".features.block [class*=\"icon-\"] svg"].join(", ")).forEach((svg) => {
		svg.style.width = "40px";
		svg.style.height = "40px";
		svg.style.maxWidth = "40px";
		svg.style.maxHeight = "40px";
		svg.style.display = "block";
	});
}
function watchAndNormalizeFeatureIcons(container) {
	const observer = new MutationObserver(() => {
		normalizeLoadingFeatureIcons(container);
	});
	observer.observe(container, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["data-block-status"]
	});
	return observer;
}
async function decorate(block) {
	const config = readBlockConfig(block);
	if ("tab-group" in config) {
		[...block.children].forEach((child) => child.remove());
		const { defaultWrapper, title, subtitle } = getSectionContext(block);
		if (defaultWrapper && title) defaultWrapper.remove();
		const bdTabs = buildTabsFromSections(config, title, subtitle);
		if (bdTabs) {
			block.replaceChildren(bdTabs);
			normalizeLoadingFeatureIcons(bdTabs);
			const iconObserver = watchAndNormalizeFeatureIcons(bdTabs);
			try {
				await loadBlocks(bdTabs);
				normalizeLoadingFeatureIcons(bdTabs);
				bdTabs.querySelectorAll("bd-accordion[appearance=\"faq\"], bd-accordion[appearance=\"terms\"]").forEach((el) => el.setAttribute("without-padding", ""));
				await load(bdTabs);
				iconObserver.disconnect();
			} catch (err) {
				iconObserver.disconnect();
				console.warn("DSN imports failed (Mode 1)", err);
			}
		}
	} else {
		await decorateIcons(block);
		const { defaultWrapper, title, subtitle } = getSectionContext(block);
		if (defaultWrapper && title) defaultWrapper.remove();
		const tabsEl = buildTabsFromBlock(block, title, subtitle);
		try {
			await load(tabsEl);
		} catch (err) {
			console.warn("DSN imports failed (Mode 2)", err);
		}
		block.replaceChildren(tabsEl);
	}
}
export { decorate as default };
