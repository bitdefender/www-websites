import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { openModal } from "../../scripts/scripts.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/cards-grid/cards-grid.js
var HEADINGS = "h1, h2, h3, h4, h5, h6";
var VARIANTS = [
	"responsible-ai",
	"benefits",
	"anchor",
	"logo"
];
var el = (tag, attrs = {}, ...children) => {
	const node = document.createElement(tag);
	Object.entries(attrs).forEach(([name, value]) => {
		if (value !== null && value !== void 0) node.setAttribute(name, value);
	});
	node.append(...children);
	return node;
};
var titleNodes = (heading) => {
	const copy = heading.cloneNode(true);
	copy.querySelectorAll("strong, b").forEach((bold) => bold.replaceWith(...bold.childNodes));
	return [...copy.childNodes];
};
/** An authored picture as a bd-img; `sized` keeps its width and height as an aspect hint. */
var toImg = (picture, sized = true) => {
	const img = picture?.querySelector("img");
	const src = img?.currentSrc || img?.getAttribute("src");
	if (!src) return null;
	const image = el("bd-img", {
		src,
		alt: img.getAttribute("alt") || ""
	});
	if (sized) ["width", "height"].forEach((name) => {
		if (img.hasAttribute(name)) image.setAttribute(name, img.getAttribute(name));
	});
	return image;
};
var iconName = (cell) => [...cell.querySelector(".icon")?.classList || []].find((cls) => cls.startsWith("icon-"))?.substring(5);
/** The cell's paragraphs that are copy: not a picture, an icon or a link on its own. */
var copyOf = (cell) => [...cell.querySelectorAll("p")].filter((p) => p.textContent.trim() && !p.querySelector("picture, .icon") && !(p.querySelector("a") && p.textContent.trim() === p.querySelector("a").textContent.trim()));
var paragraph = (p, appearance) => el("bd-p", { appearance }, ...p.childNodes);
var hrefOf = (link) => link.getAttribute("href") || link.getAttribute("location");
var linkOf = (cell) => [...cell.querySelectorAll("a")].find(hrefOf);
var appearanceOf = (link) => {
	if (link.classList.contains("modal")) return "plain";
	if (link.matches(".primary, .secondary") || link.closest("strong, b")) return "secondary";
	return "accent";
};
/** The cell's buttons, every link on its own line, in the order authored. */
var ctas = (cell, surface = "light") => [...cell.querySelectorAll("p")].map((p) => p.querySelector("a")).filter((link) => link && hrefOf(link) && link.closest("p").textContent.trim() === link.textContent.trim()).map((link) => {
	const href = hrefOf(link);
	const button = el("bd-button", {
		slot: "actions",
		appearance: appearanceOf(link),
		surface
	}, link.textContent.trim());
	if (link.classList.contains("modal") || href.includes("/fragments/")) button.addEventListener("click", (e) => {
		e.preventDefault();
		openModal(href, link.dataset.stopAutomaticModalRefresh === "true");
	});
	else button.setAttribute("href", href);
	return button;
});
var BUILDERS = {
	media: (cell) => {
		const card = el("bd-card", { appearance: "media" });
		const image = toImg(cell.querySelector("picture"));
		if (image) card.append(Object.assign(image, { slot: "media" }));
		const heading = cell.querySelector(HEADINGS);
		if (heading) card.append(el("bd-h", {
			slot: "title",
			as: "h3"
		}, ...titleNodes(heading)));
		copyOf(cell).forEach((p) => card.append(paragraph(p)));
		card.append(...ctas(cell, "dark"));
		return card;
	},
	"responsible-ai": (cell) => {
		const card = el("bd-card", { background: "tint" });
		const name = iconName(cell);
		const icon = name ? el("bd-img", {
			src: `/common/icons/${name}.svg`,
			alt: ""
		}) : toImg(cell.querySelector("picture"));
		if (icon) {
			icon.slot = "icon";
			icon.setAttribute("fit", "contain");
			card.append(icon);
		}
		const heading = cell.querySelector(HEADINGS);
		if (heading) card.append(el("bd-h", {
			slot: "title",
			as: "h3",
			color: "primary",
			"font-weight": "semibold"
		}, ...titleNodes(heading)));
		copyOf(cell).forEach((p) => card.append(paragraph(p)));
		card.append(...ctas(cell));
		return card;
	},
	benefits: (cell) => {
		const card = el("bd-card");
		const [figure, title] = cell.querySelectorAll(HEADINGS);
		if (figure) card.append(el("bd-display", { appearance: "md" }, figure.textContent.trim()));
		if (title) card.append(el("bd-h", {
			as: "h3",
			"visual-level": "h5",
			"font-weight": "bold",
			padding: "24 0 8 0"
		}, ...titleNodes(title)));
		copyOf(cell).forEach((p, index) => {
			const line = paragraph(p, "small");
			if (!title && figure && index === 0) line.setAttribute("padding-top", "24");
			card.append(line);
		});
		card.append(...ctas(cell));
		return card;
	},
	anchor: (cell) => {
		const link = linkOf(cell);
		const card = el("bd-audience-card", {
			appearance: "outline",
			href: link && hrefOf(link)
		});
		const headings = [...cell.querySelectorAll(HEADINGS)];
		const title = headings.filter((h) => /^H[1-3]$/.test(h.tagName)).pop();
		const eyebrow = headings.find((h) => /^H[4-6]$/.test(h.tagName));
		if (eyebrow) card.append(el("span", { slot: "eyebrow" }, eyebrow.textContent.trim()));
		if (title) card.append(el("bd-h", {
			slot: "title",
			as: "h3",
			"font-weight": "medium"
		}, ...titleNodes(title)));
		return card;
	},
	logo: (cell) => {
		const card = el("bd-card");
		const logo = toImg(cell.querySelector("picture"), false);
		if (logo) card.append(Object.assign(logo, { slot: "media" }));
		const heading = cell.querySelector(HEADINGS);
		if (heading) card.append(el("bd-h", {
			slot: "title",
			as: "h3",
			"visual-level": "h3",
			"font-weight": "semibold",
			"padding-bottom": "8"
		}, ...titleNodes(heading)));
		copyOf(cell).forEach((p) => card.append(paragraph(p)));
		card.append(...ctas(cell));
		return card;
	}
};
var rowsOf = (card) => {
	if (card.localName === "bd-audience-card") return 4;
	return [...card.children].filter((child) => !child.slot).length + 3;
};
var columnsFor = (variant, count) => {
	const lg = String(count <= 4 ? count : 3);
	if (variant === "anchor" || variant === "logo") return {
		md: String(Math.min(2, count)),
		lg
	};
	return {
		md: "1",
		lg
	};
};
async function decorate(block) {
	wrapSectionInDsSection(block);
	const section = block.closest(".section");
	const variant = VARIANTS.find((name) => section?.classList.contains(name) || block.classList.contains(name)) || "media";
	const header = liftSectionHeader(block, variant === "responsible-ai" ? { defaultLayout: "centered" } : {});
	const cards = [...block.querySelectorAll(":scope > div > div")].filter((cell) => cell.textContent.trim() || cell.querySelector("picture, .icon")).map(BUILDERS[variant]);
	if (!cards.length) {
		await header;
		return;
	}
	const { md, lg } = columnsFor(variant, cards.length);
	const grid = el("bd-grid", {
		class: "ds-page-column",
		cols: "1",
		"cols-sm": "1",
		"cols-md": md,
		"cols-lg": lg,
		gap: "md",
		"item-rows": String(Math.max(...cards.map(rowsOf)))
	}, ...cards);
	try {
		await load(grid);
	} catch (err) {
		console.warn("cards-grid: DSN import failed, continuing with native rendering", err);
	}
	block.replaceChildren(grid);
	block.dataset.variant = variant;
	await header;
}
export { decorate as default };
