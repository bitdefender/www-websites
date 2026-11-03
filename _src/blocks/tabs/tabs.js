import { decorateIcons, loadBlocks, readBlockConfig } from "../../scripts/lib-franklin.js";
import { slotIcon } from "../../scripts/utils/utils.js";
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
var buildTabCol = (cells, isFirstOpen, bgBlue) => {
	const [titleCell, iconCell, descCell] = cells;
	const heading = titleCell.querySelector("h1, h2, h3, h4, h5, h6");
	const col = document.createElement("bd-feature-col");
	col.setAttribute("title", heading?.textContent?.trim() || titleCell.textContent.trim());
	const icon = document.createElement("bd-individual-icon");
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
			bdP.setAttribute("kind", "small");
			bdP.innerHTML = descCell.innerHTML;
			col.appendChild(bdP);
		}
	}
	const accordionSection = document.createElement("bd-accordion-section");
	accordionSection.setAttribute("no-container", "");
	if (bgBlue) accordionSection.setAttribute("bg-blue", "");
	col.appendChild(accordionSection);
	col.accordionSection = accordionSection;
	col.isFirstOpen = isFirstOpen;
	col.firstItemAdded = false;
	return col;
};
var appendAccordionItem = (col, cells) => {
	const [titleCell, contentCell] = cells;
	const titleText = titleCell?.textContent?.trim();
	if (!titleText) return;
	const item = document.createElement("bd-accordion-item");
	item.setAttribute("title", titleText);
	if (col.isFirstOpen && !col.firstItemAdded) item.setAttribute("open", "");
	col.firstItemAdded = true;
	if (contentCell) {
		const children = Array.from(contentCell.children);
		if (children.length) children.forEach((child) => {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("kind", "small");
			bdP.innerHTML = child.innerHTML;
			item.appendChild(bdP);
		});
		else {
			const bdP = document.createElement("bd-p");
			bdP.setAttribute("kind", "small");
			bdP.innerHTML = contentCell.innerHTML;
			item.appendChild(bdP);
		}
	}
	col.accordionSection.appendChild(item);
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
var buildTabsFromBlock = (block, title, subtitle, bgBlue) => {
	const tabsEl = document.createElement("bd-tabs");
	if (title) tabsEl.setAttribute("title", title);
	if (subtitle) tabsEl.setAttribute("subtitle", subtitle);
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
			currentPanel = document.createElement("bd-tab-panel");
			currentPanel.setAttribute("title", heading.textContent.trim());
			tabsEl.appendChild(currentPanel);
			currentFeatures = null;
			currentCol = null;
		} else if (headingLevel !== null) {
			if (!currentPanel) {
				currentPanel = document.createElement("bd-tab-panel");
				tabsEl.appendChild(currentPanel);
			}
			if (!currentFeatures) {
				currentFeatures = document.createElement("bd-features");
				currentPanel.appendChild(currentFeatures);
			}
			currentCol = buildTabCol(cells, isFirstOpen, bgBlue);
			currentFeatures.appendChild(currentCol);
		} else if (currentCol) appendAccordionItem(currentCol, cells);
	});
	return tabsEl;
};
function suppressPanelMinHeight(bdTabs) {
	const { shadowRoot } = bdTabs;
	if (!shadowRoot) return;
	let wrapperObs = null;
	const attachToWrapper = () => {
		const wrapper = shadowRoot.querySelector(".bd-panel-wrapper");
		if (!wrapper) return;
		if (wrapper.style.minHeight) wrapper.style.removeProperty("min-height");
		if (wrapperObs) wrapperObs.disconnect();
		wrapperObs = new MutationObserver(() => {
			if (wrapper.style.minHeight) wrapper.style.removeProperty("min-height");
		});
		wrapperObs.observe(wrapper, {
			attributes: true,
			attributeFilter: ["style"]
		});
	};
	const component = shadowRoot.querySelector(".bd-tabs-component");
	if (component) new MutationObserver(attachToWrapper).observe(component, { childList: true });
	attachToWrapper();
}
function buildTabsFromSections(config, title, subtitle) {
	const tabGroupName = config["tab-group"];
	const tabsSelector = tabGroupName ? `[data-tab-group="${tabGroupName}"][data-tab]` : "[data-tab]";
	const sections = [...document.querySelectorAll(tabsSelector)];
	if (!sections.length) return null;
	const bdTabs = document.createElement("bd-tabs");
	if ("bg-blue" in config) bdTabs.setAttribute("bg-blue", "");
	if (title) bdTabs.setAttribute("title", title);
	if (subtitle) bdTabs.setAttribute("subtitle", subtitle);
	sections.forEach((section) => {
		const tabPanel = document.createElement("bd-tab-panel");
		tabPanel.setAttribute("title", section.dataset.tab);
		while (section.firstChild) tabPanel.appendChild(section.firstChild);
		section.remove();
		bdTabs.appendChild(tabPanel);
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
	const bgBlue = "bg-blue" in config;
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
				bdTabs.querySelectorAll("bd-accordion-bg").forEach((el) => el.setAttribute("no-padding", ""));
				await import("../../vendor/repobit/dex-system-design/tabs.js");
				if (typeof bdTabs.requestUpdate === "function") bdTabs.requestUpdate();
				iconObserver.disconnect();
				if (typeof bdTabs.updateComplete?.then === "function") await bdTabs.updateComplete;
				suppressPanelMinHeight(bdTabs);
			} catch (err) {
				iconObserver.disconnect();
				console.warn("DSN imports failed (Mode 1)", err);
			}
		}
	} else {
		await decorateIcons(block);
		const { defaultWrapper, title, subtitle } = getSectionContext(block);
		if (defaultWrapper && title) defaultWrapper.remove();
		try {
			await Promise.all([
				import("../../vendor/repobit/dex-system-design/tabs.js"),
				import("../../vendor/repobit/dex-system-design/paragraph.js"),
				import("../../vendor/repobit/dex-system-design/accordion.js")
			]);
		} catch (err) {
			console.warn("DSN imports failed (Mode 2)", err);
		}
		const tabsEl = buildTabsFromBlock(block, title, subtitle, bgBlue);
		if (tabsEl) block.replaceChildren(tabsEl);
	}
}
export { decorate as default };
