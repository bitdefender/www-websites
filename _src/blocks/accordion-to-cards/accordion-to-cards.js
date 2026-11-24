// src/blocks/accordion-to-cards/accordion-to-cards.js
var DESKTOP_QUERY = "(min-width: 768px)";
var MAX_DESKTOP_COLUMNS = 4;
var instanceCount = 0;
/**
* Builds one item from a row: [icon + title, description (+ duplicate icon)]
* @param {HTMLElement} row - Authored row
* @param {string} idPrefix - Unique prefix for the button/panel ids
* @returns {HTMLElement|null} The item, or null for an empty row
*/
function buildItem(row, idPrefix) {
	const [headCell, bodyCell] = row.children;
	if (!headCell) return null;
	const picture = headCell.querySelector("picture") || bodyCell?.querySelector("picture");
	const title = (headCell.querySelector("strong, h1, h2, h3, h4, h5, h6") || headCell).textContent.trim();
	if (!title) return null;
	const item = document.createElement("div");
	item.className = "accordion-to-cards-item";
	const heading = document.createElement("h3");
	heading.className = "accordion-to-cards-title";
	const button = document.createElement("button");
	button.type = "button";
	button.id = `${idPrefix}-button`;
	button.innerHTML = "<span class=\"accordion-to-cards-icon\"></span><span class=\"accordion-to-cards-label\"></span>";
	if (picture) button.querySelector(".accordion-to-cards-icon").append(picture);
	else button.querySelector(".accordion-to-cards-icon").remove();
	button.querySelector(".accordion-to-cards-label").textContent = title;
	heading.append(button);
	item.append(heading);
	bodyCell?.querySelectorAll("picture").forEach((pic) => pic.remove());
	if (!bodyCell?.textContent.trim()) {
		item.classList.add("no-panel");
		return item;
	}
	const panel = document.createElement("div");
	panel.className = "accordion-to-cards-panel";
	panel.id = `${idPrefix}-panel`;
	panel.setAttribute("role", "region");
	panel.setAttribute("aria-labelledby", button.id);
	if (bodyCell.querySelector("p, ul, ol")) panel.append(...bodyCell.childNodes);
	else {
		const p = document.createElement("p");
		p.innerHTML = bodyCell.innerHTML.trim();
		panel.append(p);
	}
	item.append(panel);
	const chevron = document.createElement("span");
	chevron.className = "accordion-to-cards-chevron";
	chevron.setAttribute("aria-hidden", "true");
	button.append(chevron);
	button.setAttribute("aria-controls", panel.id);
	return item;
}
/**
* Mobile: accordion, all items closed. Desktop: all items shown as cards.
* @param {HTMLElement} block
*/
function decorate(block) {
	instanceCount += 1;
	const items = [...block.querySelectorAll(":scope > div")].map((row, idx) => buildItem(row, `accordion-to-cards-${instanceCount}-${idx}`)).filter(Boolean);
	block.replaceChildren(...items);
	if (items.length) {
		const rows = Math.ceil(items.length / MAX_DESKTOP_COLUMNS);
		block.style.setProperty("--accordion-to-cards-columns", Math.ceil(items.length / rows));
	}
	const toggles = items.map((item) => ({
		button: item.querySelector("button"),
		panel: item.querySelector(".accordion-to-cards-panel")
	})).filter(({ panel }) => panel);
	const setOpen = ({ button, panel }, open) => {
		button.setAttribute("aria-expanded", open);
		panel.hidden = !open;
	};
	toggles.forEach((toggle) => {
		setOpen(toggle, false);
		toggle.button.addEventListener("click", () => {
			setOpen(toggle, toggle.button.getAttribute("aria-expanded") !== "true");
		});
	});
	const desktop = window.matchMedia(DESKTOP_QUERY);
	const syncButtons = () => {
		toggles.forEach(({ button }) => {
			button.disabled = desktop.matches;
		});
	};
	desktop.addEventListener("change", syncButtons);
	syncButtons();
}
export { decorate as default };
