import page_default from "../../scripts/page.js";
import { createTag, generatePageLoadStartedName, wrapChildrenWithStoreContext } from "../../scripts/utils/utils.js";
import { openModal } from "../../scripts/scripts.js";
import { UserAgent } from "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, ButtonClickEvent } from "../../vendor/repobit/dex-data-layer.js";
import { load } from "../../vendor/repobit/dex-system-design/loader.js";
// src/blocks/hero-banner/hero-banner.js
var DROPDOWN_MARKER = /^\{\s*dropdown\s*\}$/i;
var whenRendered = (atom) => customElements.whenDefined(atom.localName).then(() => atom.updateComplete);
function parseProducts(raw = "") {
	return raw.split(",").map((code) => code.trim()).filter(Boolean).map((code) => {
		const [productId, devices, subscription] = code.split("/").map((part) => part.trim());
		return {
			productId,
			devices,
			subscription
		};
	}).filter(({ productId, devices, subscription }) => productId && devices && subscription);
}
function parseProductNames(raw = "") {
	return raw.split(",").map((entry) => {
		const [name = "", details = ""] = entry.split("|").map((part) => part.trim());
		return {
			name,
			details
		};
	});
}
var isPicturesOnly = (el) => el.tagName === "P" && el.querySelector("picture") && !el.textContent.trim();
var isButtonLink = (a) => a.href !== a.textContent && !a.querySelector("img");
var isButtonsOnly = (el) => {
	const links = [...el.querySelectorAll("a")];
	if (el.tagName !== "P" || !links.length || !links.every(isButtonLink)) return false;
	return !links.reduce((text, a) => text.replace(a.textContent, ""), el.textContent).trim();
};
function toAtom(tagName, source, attributes = {}) {
	const atom = createTag(tagName, attributes);
	atom.append(...source.childNodes);
	if (source.id) atom.id = source.id;
	return atom;
}
function createCta({ text, href, primary, buyLink, trialDuration, keepModal = false }) {
	const cta = createTag("bd-button-link", {
		class: `hero-banner__cta hero-banner__cta--${primary ? "primary" : "secondary"}`,
		variant: primary ? "accent" : "tertiary",
		size: "lg",
		fullwidth: ""
	});
	cta.textContent = text;
	if (buyLink) {
		cta.buyLink = true;
		cta.setAttribute("data-bd-watch-shadow", "");
		whenRendered(cta).then(() => {
			const anchor = cta.shadowRoot?.querySelector("a");
			if (anchor && trialDuration) anchor.dataset.storeBuyLink = trialDuration;
			if (cta.isConnected) cta.parentNode.insertBefore(cta, cta.nextSibling);
		});
	} else if (href?.includes("/fragments/")) cta.addEventListener("click", (e) => {
		e.preventDefault();
		openModal(href, keepModal);
	});
	else if (href) cta.href = href;
	return cta;
}
function buildCtas(settings) {
	const { buybuttontext = "Buy Now", secondbuttontext, secondbuttonlink, hardcodedLink, microsoftEdgeLink, trialDuration, hasProduct } = settings;
	const ctas = createTag("div", { class: "hero-banner__ctas" });
	let primaryHref = hardcodedLink;
	if (hardcodedLink && microsoftEdgeLink && UserAgent.browser === "edge") primaryHref = microsoftEdgeLink;
	if (primaryHref || hasProduct) ctas.append(createCta({
		text: buybuttontext,
		href: primaryHref,
		primary: true,
		buyLink: !primaryHref,
		trialDuration
	}));
	if (secondbuttontext && secondbuttonlink) ctas.append(createCta({
		text: secondbuttontext,
		href: secondbuttonlink
	}));
	return ctas;
}
function buildPriceBox(product, details, settings) {
	const box = createTag("div", { class: "hero-banner__offer await-loader" });
	if (details) box.append(createTag("bd-p", {
		class: "hero-banner__details",
		variant: "small"
	}, details));
	box.insertAdjacentHTML("beforeend", `
    <div class="hero-banner__price">
      <div class="hero-banner__was" data-store-render data-store-hide="!it.option.price.discounted" data-store-hide-type="visibility">
        <bd-p class="hero-banner__full" variant="regular" font-weight="medium" color="muted"><s data-store-render data-store-price="full"></s></bd-p>
        <bd-badge class="hero-banner__badge" tone="success" variant="fill" size="lg"><span data-store-render data-store-discount="percentage"></span> ${settings.discounttext || "OFF"}</bd-badge>
      </div>
      <p class="hero-banner__final"><span data-store-render data-store-price="discounted||full"></span></p>
    </div>
  `);
	box.append(buildCtas({
		...settings,
		hasProduct: true
	}));
	wrapChildrenWithStoreContext(box, {
		productId: product.productId,
		devices: product.devices,
		subscription: product.subscription,
		storeEvent: "all"
	});
	return box;
}
function buildSelector(products, names, accessibleName, boxes) {
	const labels = [];
	products.forEach((product, index) => {
		const { name, details } = names[index] || {};
		let label = name || product.productId;
		if (labels.includes(label) && details) label = `${label} - ${details}`;
		if (labels.includes(label)) label = `${label} (${index + 1})`;
		labels.push(label);
	});
	const dropdown = createTag("bd-custom-dropdown", {
		class: "hero-banner__select",
		name: "hero-banner-product",
		size: "md"
	});
	dropdown.options = labels;
	[dropdown.value] = labels;
	[dropdown.textContent] = labels;
	dropdown.addEventListener("bd-change", (e) => {
		const chosen = labels.indexOf(e.detail.value);
		boxes.forEach((box, index) => {
			box.hidden = index !== chosen;
		});
	});
	if (accessibleName) whenRendered(dropdown).then(() => {
		dropdown.shadowRoot?.querySelector("select")?.setAttribute("aria-label", accessibleName);
	});
	const selector = createTag("div", { class: "hero-banner__selector" });
	selector.append(dropdown);
	return selector;
}
function readContent(cell) {
	const nodes = [...cell.children];
	const h1 = cell.querySelector("h1");
	const picture = cell.querySelector("picture");
	const h1Index = nodes.indexOf(h1);
	const productName = h1Index > 0 ? nodes.slice(0, h1Index).reverse().find((el) => /^H[2-6]$/.test(el.tagName)) : null;
	const after = h1Index >= 0 ? nodes.slice(h1Index + 1) : nodes;
	const markerIndex = after.findIndex((el) => DROPDOWN_MARKER.test(el.textContent.trim()));
	const body = markerIndex >= 0 ? after.slice(0, markerIndex) : after;
	const tail = markerIndex >= 0 ? after.slice(markerIndex + 1) : [];
	const isHeroPicture = (el) => picture && el.contains(picture);
	const marks = [...body, ...tail].filter((el) => isPicturesOnly(el) && !isHeroPicture(el));
	const ctas = [...body, ...tail].filter(isButtonsOnly);
	const rest = (list) => list.filter((el) => !marks.includes(el) && !ctas.includes(el) && !isHeroPicture(el));
	return {
		h1,
		picture,
		productName,
		description: rest(body),
		disclaimer: rest(tail),
		marks,
		ctas
	};
}
function buildMedia(picture, signature, isProductLook) {
	const media = createTag("div", { class: "hero-banner__media" });
	if (!picture) return media;
	const img = picture.querySelector("img");
	if (img) {
		img.loading = "eager";
		img.setAttribute("fetchpriority", "high");
	}
	media.append(picture);
	if (isProductLook && signature) media.append(createTag("div", {
		class: "hero-banner__scrim",
		"aria-hidden": "true"
	}), createTag("p", { class: "hero-banner__signature" }, signature));
	return media;
}
function authoredCta(link) {
	const href = link.getAttribute("href") || link.getAttribute("location");
	return createCta({
		text: link.textContent.trim(),
		href,
		primary: link.classList.contains("primary") || !!link.closest("strong"),
		keepModal: link.dataset.stopAutomaticModalRefresh === "true"
	});
}
async function loadAtoms(block) {
	try {
		await load(block);
	} catch (err) {
		console.warn("hero-banner: DSN import failed, continuing with native rendering", err);
	}
}
function decorate(block) {
	const settings = { ...block.closest(".section")?.dataset || {} };
	const { signature, hardcodedLink, linksOpenInNewTab } = settings;
	const content = readContent(block.querySelector(":scope > div > div") || block);
	const products = parseProducts(settings.dropdown);
	const names = parseProductNames(settings.productnames);
	const isProductLook = block.classList.contains("product") || !block.classList.contains("card") && (!!content.productName || products.length === 1);
	block.classList.add(isProductLook ? "hero-banner--product" : "hero-banner--card");
	if (!content.picture) block.classList.add("hero-banner--no-media");
	const copy = createTag("div", { class: "hero-banner__content" });
	if (!isProductLook && signature) copy.append(createTag("p", { class: "hero-banner__eyebrow" }, signature));
	if (content.productName) copy.append(toAtom("bd-h", content.productName, {
		class: "hero-banner__product",
		as: content.productName.tagName.toLowerCase(),
		"visual-level": "h4",
		color: "primary"
	}));
	if (content.h1) copy.append(toAtom("bd-h", content.h1, {
		class: "hero-banner__title",
		as: "h1",
		"visual-level": "h1"
	}));
	if (content.description.length) {
		const description = createTag("div", { class: "hero-banner__description" });
		description.append(...content.description.map((el) => {
			const paragraph = toAtom("bd-p", el, { variant: "regular" });
			if (/^H[1-6]$/.test(el.tagName)) paragraph.dataset.authoredAs = "heading";
			return paragraph;
		}));
		copy.append(description);
	}
	if (products.length) {
		const boxes = products.map((product, index) => {
			const box = buildPriceBox(product, names[index]?.details, settings);
			box.hidden = index > 0;
			return box;
		});
		if (products.length > 1) {
			const accessibleName = (content.description.length ? copy.querySelector(".hero-banner__description") : copy.querySelector(".hero-banner__title"))?.textContent.trim();
			copy.append(buildSelector(products, names, accessibleName, boxes));
		}
		copy.append(...boxes);
	} else {
		const ctas = buildCtas({
			...settings,
			hasProduct: false
		});
		if (ctas.children.length) copy.append(ctas);
	}
	if (content.ctas.length) {
		const authored = createTag("div", { class: "hero-banner__ctas hero-banner__ctas--authored" });
		authored.append(...content.ctas.flatMap((paragraph) => [...paragraph.querySelectorAll("a")]).map(authoredCta));
		copy.append(authored);
	}
	if (content.disclaimer.length) {
		const disclaimer = createTag("div", { class: "hero-banner__disclaimer" });
		disclaimer.append(...content.disclaimer.map((el) => toAtom("bd-p", el, {
			variant: "xsmall",
			color: "muted"
		})));
		copy.append(disclaimer);
	}
	if (content.marks.length) {
		const marks = createTag("div", { class: "hero-banner__marks" });
		content.marks.forEach((paragraph) => marks.append(...paragraph.querySelectorAll("picture")));
		copy.append(marks);
	}
	block.replaceChildren(copy, buildMedia(content.picture, signature, isProductLook));
	const img = block.querySelector(".hero-banner__media img");
	if (img && !img.complete) {
		img.addEventListener("load", () => loadAtoms(block), { once: true });
		img.addEventListener("error", () => loadAtoms(block), { once: true });
	} else loadAtoms(block);
	if (hardcodedLink && page_default.name === "web-sage") block.addEventListener("click", (e) => {
		if (!e.target.closest(".hero-banner__cta--primary")) return;
		const clickEvent = new ButtonClickEvent("click", { asset: "get it free" });
		clickEvent.eventInfo = { page: generatePageLoadStartedName() };
		AdobeDataLayerService.push(clickEvent);
	});
	if (linksOpenInNewTab) block.querySelectorAll("bd-button-link.hero-banner__cta").forEach((cta) => {
		if (cta.href && !cta.href.includes("#")) cta.target = "_blank";
	});
}
export { decorate as default };
