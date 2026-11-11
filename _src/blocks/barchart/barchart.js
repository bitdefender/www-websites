import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/barchart/barchart.js
var DEFAULT_SECONDARY_SCALES = ["0.93", "0.47"];
var VIEWPORT_ANIMATION_MS = 1e3;
var EASE_OUT_CUBIC = (value) => 1 - (1 - value) ** 3;
var MAX_SCORE = "6";
var BARS_LABEL = "Scores by brand";
var SCALE_NOTE = `Bar lengths are scaled for visibility between brands. Use the announced scores for exact values; scale is out of ${MAX_SCORE}.`;
var SOURCE = "Source ";
var regionCount = 0;
var getHeadingText = (root) => root?.querySelector("h1, h2, h3, h4, h5, h6")?.textContent?.trim() || "";
var getAdjacentParagraph = (element, fallbackRoot) => {
	const candidate = element?.nextElementSibling;
	if (candidate?.tagName === "P") return candidate;
	return fallbackRoot?.querySelector("p") || null;
};
var normalizeScore = (score) => score.replace(",", ".");
var parseScaleValue = (value) => {
	if (!value) return null;
	const normalizedValue = normalizeScore(value).replace("%", "").trim();
	const parsedValue = Number(normalizedValue);
	if (!Number.isFinite(parsedValue) || parsedValue < 0) return null;
	if (parsedValue <= 1) return String(parsedValue);
	if (parsedValue <= 100) return String(parsedValue / 100);
	return null;
};
var getCardIconSrc = (iconWrap) => {
	const image = iconWrap?.querySelector("img");
	const imageSrc = image?.currentSrc || image?.getAttribute("src") || "";
	if (imageSrc) return imageSrc;
	const iconElement = iconWrap?.querySelector("[class*=\"icon-\"]");
	if (!iconElement) return "";
	const iconName = Array.from(iconElement.classList).find((className) => className.startsWith("icon-"))?.substring(5);
	if (!iconName) return "";
	return `/common/icons/${iconName}.svg`;
};
var getFallbackScale = (secondaryIndex) => DEFAULT_SECONDARY_SCALES[secondaryIndex] ?? DEFAULT_SECONDARY_SCALES[DEFAULT_SECONDARY_SCALES.length - 1];
var slotted = (tag, slot, text) => {
	const el = document.createElement(tag);
	if (slot) el.slot = slot;
	el.textContent = text;
	return el;
};
var buildRegion = (title, grid) => {
	regionCount += 1;
	const heading = slotted("bd-h", "title", title);
	heading.setAttribute("as", "h3");
	heading.setAttribute("visual-level", "h3");
	heading.id = `barchart-title-${regionCount}`;
	const header = document.createElement("bd-section-header");
	header.setAttribute("layout", "centered");
	header.append(heading);
	const region = document.createElement("section");
	region.setAttribute("aria-labelledby", heading.id);
	region.append(header, grid);
	return region;
};
var buildIcon = (src, size) => {
	const icon = document.createElement("bd-img");
	icon.slot = "icon";
	icon.setAttribute("src", src);
	icon.setAttribute("alt", "");
	icon.setAttribute("width", size);
	icon.setAttribute("height", size);
	icon.setAttribute("fit", "contain");
	icon.setAttribute("loading", "eager");
	return icon;
};
var buildFootnote = (text, href) => {
	const footer = slotted("bd-p", "footer", href ? "" : text);
	footer.setAttribute("appearance", "xsmall");
	if (!href) return footer;
	const at = text.indexOf(SOURCE);
	const link = slotted("bd-link", "", at === -1 ? text : text.slice(at + 7));
	link.setAttribute("href", href);
	link.setAttribute("target", "_blank");
	link.setAttribute("font-size", "xs");
	link.setAttribute("color", "strong");
	link.setAttribute("underline", "");
	footer.append(...at === -1 ? [link] : [text.slice(0, at + 7), link]);
	return footer;
};
var prefersReducedMotion = () => {
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return false;
	}
};
var buildCompareSection = (block) => {
	const defaultWrapper = block.closest(".section")?.querySelector(":scope > .default-content-wrapper");
	const sectionTitle = getHeadingText(defaultWrapper);
	if (defaultWrapper && sectionTitle) defaultWrapper.remove();
	const compareSection = document.createElement("bd-bar-chart-grid");
	const rows = Array.from(block.querySelectorAll(":scope > div"));
	const isSingleCard = rows.filter((row) => row.children.length >= 2).length === 1;
	rows.forEach((row) => {
		const [iconWrap, contentWrap] = row.children;
		if (!contentWrap) return;
		let titleEl;
		let descriptionEl;
		let listEl;
		let footnoteEl;
		if (isSingleCard) {
			titleEl = iconWrap.querySelector("h1, h2, h3, h4, h5, h6") ?? Array.from(iconWrap.querySelectorAll(":scope > p")).find((p) => p.textContent.trim() && !p.querySelector("picture, img, svg, [class*=\"icon-\"]"));
			const descCandidate = titleEl?.nextElementSibling;
			descriptionEl = descCandidate?.tagName === "P" ? descCandidate : null;
			const footnoteCandidate = descriptionEl?.nextElementSibling;
			footnoteEl = footnoteCandidate?.tagName === "P" ? footnoteCandidate : null;
			listEl = contentWrap.querySelector("ul");
		} else {
			titleEl = contentWrap.querySelector("h1, h2, h3, h4, h5, h6");
			descriptionEl = getAdjacentParagraph(titleEl, contentWrap);
			listEl = contentWrap.querySelector("ul");
			const footnoteCandidate = listEl?.nextElementSibling;
			footnoteEl = footnoteCandidate?.tagName === "P" ? footnoteCandidate : null;
		}
		const card = document.createElement("bd-bar-chart");
		card.setAttribute("bars-label", BARS_LABEL);
		card.setAttribute("scale-note", SCALE_NOTE);
		if (isSingleCard) card.setAttribute("orientation", "horizontal");
		const iconSrc = getCardIconSrc(iconWrap);
		if (iconSrc) card.append(buildIcon(iconSrc, isSingleCard ? "40" : "48"));
		const cardTitle = titleEl?.textContent?.trim();
		if (cardTitle) {
			const heading = slotted("bd-h", "title", cardTitle);
			heading.setAttribute("as", isSingleCard ? "h3" : "h4");
			card.append(heading);
		}
		const cardDescription = descriptionEl?.textContent?.trim();
		if (cardDescription) card.append(slotted("bd-p", "description", cardDescription));
		const listItems = Array.from(listEl?.querySelectorAll("li") || []);
		let hasScaledBars = false;
		let secondaryBarIndex = 0;
		for (let i = 0; i < listItems.length;) {
			const label = listItems[i]?.textContent?.trim();
			const score = listItems[i + 1]?.textContent?.trim();
			if (label && score) {
				const isPrimaryBar = /bitdefender/i.test(label);
				const parsedScale = parseScaleValue(listItems[i + 2]?.textContent?.trim());
				const bar = slotted("bd-bar-chart-item", "", label);
				bar.setAttribute("score", normalizeScore(score));
				bar.setAttribute("max-score", MAX_SCORE);
				bar.setAttribute("appearance", isPrimaryBar ? "primary" : "secondary");
				if (parsedScale) {
					bar.setAttribute("scale", parsedScale);
					hasScaledBars = true;
				} else if (!isPrimaryBar) {
					bar.setAttribute("scale", getFallbackScale(secondaryBarIndex));
					hasScaledBars = true;
				}
				if (!isPrimaryBar) secondaryBarIndex += 1;
				i += parsedScale ? 3 : 2;
				card.appendChild(bar);
			} else i += 1;
		}
		if (hasScaledBars) card.setAttribute("without-stretch", "");
		const footnoteText = footnoteEl?.textContent.trim();
		if (footnoteText) card.append(buildFootnote(footnoteText, footnoteEl.querySelector("a")?.href));
		compareSection.appendChild(card);
	});
	return {
		compareSection,
		region: sectionTitle ? buildRegion(sectionTitle, compareSection) : compareSection
	};
};
var runBarsIntroAnimation = (compareSection) => {
	if (compareSection.dataset.barchartAnimated === "true" || prefersReducedMotion()) return;
	const secondaryBars = Array.from(compareSection.querySelectorAll("bd-bar-chart-item")).filter((bar) => bar.getAttribute("appearance") !== "primary");
	if (!secondaryBars.length) return;
	compareSection.dataset.barchartAnimated = "true";
	const animationState = secondaryBars.map((bar) => {
		const maxScore = Number(normalizeScore(bar.getAttribute("max-score") || "6")) || 6;
		const finalScore = Number(normalizeScore(bar.getAttribute("score") || "0")) || 0;
		const finalScale = Number(parseScaleValue(bar.getAttribute("scale")) ?? "1");
		bar.setAttribute("score", String(maxScore));
		bar.setAttribute("scale", "1");
		return {
			bar,
			maxScore,
			finalScore,
			finalScale
		};
	});
	const startedAt = performance.now();
	const step = (now) => {
		const elapsed = now - startedAt;
		const progress = Math.min(1, elapsed / VIEWPORT_ANIMATION_MS);
		const easedProgress = EASE_OUT_CUBIC(progress);
		animationState.forEach(({ bar, maxScore, finalScore, finalScale }) => {
			const nextScore = maxScore + (finalScore - maxScore) * easedProgress;
			const nextScale = 1 + (finalScale - 1) * easedProgress;
			bar.setAttribute("score", nextScore.toFixed(2));
			bar.setAttribute("scale", nextScale.toFixed(4));
		});
		if (progress < 1) {
			requestAnimationFrame(step);
			return;
		}
		animationState.forEach(({ bar, finalScore, finalScale }) => {
			bar.setAttribute("score", finalScore.toFixed(2));
			bar.setAttribute("scale", String(finalScale));
		});
	};
	requestAnimationFrame(() => requestAnimationFrame(step));
};
var activateCompareAnimationsOnViewport = (compareSection) => {
	if (!("IntersectionObserver" in window)) {
		runBarsIntroAnimation(compareSection);
		return;
	}
	const observer = new IntersectionObserver((entries) => {
		if (!entries.some((entry) => entry.isIntersecting)) return;
		observer.disconnect();
		runBarsIntroAnimation(compareSection);
	}, {
		threshold: .25,
		rootMargin: "0px 0px -10% 0px"
	});
	observer.observe(compareSection);
};
async function decorate(block) {
	const { compareSection, region } = buildCompareSection(block);
	await load(region);
	block.replaceChildren(region);
	activateCompareAnimationsOnViewport(compareSection);
}
export { decorate as default };
