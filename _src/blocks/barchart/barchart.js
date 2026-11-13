import { liftSectionHeader, wrapSectionInDsSection } from "../../scripts/utils/utils.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/barchart/barchart.js
var DEFAULT_SECONDARY_SCALES = ["0.93", "0.47"];
var VIEWPORT_ANIMATION_MS = 1e3;
var EASE_OUT_CUBIC = (value) => 1 - (1 - value) ** 3;
var MAX_SCORE = "6";
var BARS_LABEL = "Scores by brand";
var SCALE_NOTE = `Bar lengths are scaled for visibility between brands. Use the announced scores for exact values; scale is out of ${MAX_SCORE}.`;
var regionCount = 0;
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
	if (!title.id) title.id = `barchart-title-${regionCount}`;
	const region = document.createElement("section");
	region.setAttribute("aria-labelledby", title.id);
	region.append(grid);
	return region;
};
var buildIcon = (src) => {
	const icon = document.createElement("bd-img");
	icon.slot = "icon";
	icon.setAttribute("src", src);
	icon.setAttribute("alt", "");
	icon.setAttribute("fit", "contain");
	return icon;
};
var buildFootnote = (paragraph) => {
	const footer = slotted("bd-p", "footer", "");
	footer.setAttribute("appearance", "xsmall");
	footer.append(...paragraph.cloneNode(true).childNodes);
	footer.querySelectorAll("a").forEach((a) => {
		const link = document.createElement("bd-link");
		link.setAttribute("href", a.getAttribute("href") || "");
		link.setAttribute("target", "_blank");
		link.setAttribute("inline", "");
		link.setAttribute("underline", "");
		link.append(...a.childNodes);
		a.replaceWith(link);
	});
	return footer;
};
var prefersReducedMotion = () => {
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch {
		return false;
	}
};
var buildGrid = (block) => {
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
		if (iconSrc) card.append(buildIcon(iconSrc));
		const cardTitle = titleEl?.textContent?.trim();
		if (cardTitle) {
			const heading = slotted("bd-h", "title", cardTitle);
			heading.setAttribute("as", "h3");
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
		if (footnoteEl?.textContent.trim()) card.append(buildFootnote(footnoteEl));
		compareSection.appendChild(card);
	});
	return compareSection;
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
	wrapSectionInDsSection(block);
	const header = liftSectionHeader(block, { defaultLayout: "centered" });
	const grid = buildGrid(block);
	try {
		await load(grid);
	} catch (err) {
		console.warn("barchart: DSN import failed, keeping the authored content", err);
		await header;
		return;
	}
	const title = (await header)?.querySelector(":scope > bd-h[slot=\"title\"]");
	block.replaceChildren(title ? buildRegion(title, grid) : grid);
	activateCompareAnimationsOnViewport(grid);
}
export { decorate as default };
