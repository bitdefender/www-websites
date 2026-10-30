import page_default from "../page.js";
import { Constants } from "../libs/constants.js";
import { UserAgent, debounce } from "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, ButtonClickEvent } from "../../vendor/repobit/dex-data-layer.js";
// src/scripts/utils/utils.js
var TRACKED_PRODUCTS = [];
var TRACKED_PRODUCTS_COMPARISON = [];
var GLOBAL_V2_LOCALES = ["en-bz", "en-lv"];
var IANA_BY_REGION_MAP = /* @__PURE__ */ new Map([
	[3, {
		locale: "en-GB",
		label: "united kingdom"
	}],
	[4, {
		locale: "au-AU",
		label: "australia"
	}],
	[5, {
		locale: "de-DE",
		label: "germany"
	}],
	[6, {
		locale: "ro-RO",
		label: "romania"
	}],
	[7, {
		locale: "es-ES",
		label: "spain"
	}],
	[8, {
		locale: "en-US",
		label: "com"
	}],
	[9, {
		locale: "it-IT",
		label: "italy"
	}],
	[10, {
		locale: "en-CA",
		label: "canada"
	}],
	[12, {
		locale: "pt-PT",
		label: "portugal"
	}],
	[13, {
		locale: "br-BR",
		label: "brazil"
	}],
	[14, {
		locale: "fr-FR",
		label: "france"
	}],
	[15, {
		locale: "en-GB",
		label: "united kingdom"
	}],
	[16, {
		locale: "en-US",
		label: "rest of the world EU countries"
	}],
	[17, {
		locale: "de-CH",
		label: "germany-switzerland"
	}],
	[19, {
		locale: "en-ZA",
		label: "en south africa"
	}],
	[22, {
		locale: "nl-NL",
		label: "netherlands"
	}],
	[24, {
		locale: "en-VN",
		label: "en vietnam"
	}],
	[20, {
		locale: "en-MX",
		label: "en es mexico"
	}],
	[21, {
		locale: "en-CO",
		label: "en es columbia"
	}],
	[25, {
		locale: "en-SG",
		label: "en singapore"
	}],
	[26, {
		locale: "en-SE",
		label: "en sweden"
	}],
	[27, {
		locale: "en-DK",
		label: "en denmark"
	}],
	[28, {
		locale: "en-HU",
		label: "en hungary"
	}],
	[29, {
		locale: "en-BG",
		label: "en bulgaria"
	}],
	[30, {
		locale: "en-HR",
		label: "en croatia"
	}],
	[31, {
		locale: "en-NO",
		label: "en norway"
	}],
	[32, {
		locale: "en-MD",
		label: "en moldova"
	}],
	[33, {
		locale: "en-RS",
		label: "en serbia"
	}],
	[34, {
		locale: "en-RU",
		label: "en russia"
	}],
	[35, {
		locale: "en-EG",
		label: "en egypt"
	}],
	[36, {
		locale: "en-SA",
		label: "en saudi arabia"
	}],
	[37, {
		locale: "fr-DZ",
		label: "en Algeria"
	}],
	[38, {
		locale: "en-AE",
		label: "en united arab emirates"
	}],
	[39, {
		locale: "en-PS",
		label: "en palestinia"
	}],
	[40, {
		locale: "en-CN",
		label: "en china"
	}],
	[41, {
		locale: "en-HK",
		label: "en hong kong"
	}],
	[42, {
		locale: "en-CK",
		label: "Cook Islands"
	}],
	[43, {
		locale: "en-KE",
		label: "en kenya"
	}],
	[44, {
		locale: "en-NG",
		label: "en nigeria"
	}],
	[45, {
		locale: "fr-TN",
		label: "en Tunisia"
	}],
	[46, {
		locale: "en-PL",
		label: "en poland"
	}],
	[47, {
		locale: "en-CZ",
		label: "en Czech"
	}],
	[48, {
		locale: "es-VE",
		label: "en Venezuela"
	}],
	[49, {
		locale: "en-TR",
		label: "en turkey"
	}],
	[50, {
		locale: "en-ID",
		label: "en Indonesia"
	}],
	[51, {
		locale: "en-PH",
		label: "en Philippines"
	}],
	[52, {
		locale: "en-TW",
		label: "en taiwan"
	}],
	[53, {
		locale: "en-UA",
		label: "en Ukraine"
	}],
	[54, {
		locale: "es-CL",
		label: "en Chile"
	}],
	[55, {
		locale: "en-MY",
		label: "en Malaysia"
	}],
	[56, {
		locale: "es-AR",
		label: "en Argentina"
	}],
	[57, {
		locale: "es-PE",
		label: "en Peru"
	}],
	[59, {
		locale: "hr-HR",
		label: "Croatia"
	}],
	[60, {
		locale: "ma-MA",
		label: "Morocco"
	}],
	[61, {
		locale: "pk-PK",
		label: "Pakistan"
	}],
	[62, {
		locale: "bo-BO",
		label: "Bolivia"
	}],
	[63, {
		locale: "do-DO",
		label: "Dominican Republic"
	}],
	[64, {
		locale: "kw-KW",
		label: "Kuwait"
	}],
	[65, {
		locale: "jo-JO",
		label: "Jordan"
	}],
	[66, {
		locale: "th-TH",
		label: "Thailand"
	}],
	[67, {
		locale: "en-BD",
		label: "en Bangladesh"
	}],
	[68, {
		locale: "en-LK",
		label: "en Sri Lanka"
	}],
	[69, {
		locale: "en-PY",
		label: "en Paraguay"
	}],
	[70, {
		locale: "en-UY",
		label: "en Uruguay"
	}],
	[72, {
		locale: "en-JP",
		label: "en Japan"
	}]
]);
var PRICE_LOCALE_MAP = /* @__PURE__ */ new Map([
	["en-us", {
		force_country: "en",
		country_code: "us"
	}],
	["en-bg", {
		force_country: "bg",
		country_code: "bg"
	}],
	["en-ca", {
		force_country: "ca",
		country_code: "ca"
	}],
	["en-cl", {
		force_country: "cl",
		country_code: "cl"
	}],
	["en-dk", {
		force_country: "dk",
		country_code: "dk"
	}],
	["en-hu", {
		force_country: "hu",
		country_code: "hu"
	}],
	["en-id", {
		force_country: "id",
		country_code: "id"
	}],
	["en-il", {
		force_country: "il",
		country_code: "il"
	}],
	["en-in", {
		force_country: "in",
		country_code: "in"
	}],
	["en-kr", {
		force_country: "kr",
		country_code: "kr"
	}],
	["en-my", {
		force_country: "my",
		country_code: "my"
	}],
	["en-no", {
		force_country: "no",
		country_code: "no"
	}],
	["en-ph", {
		force_country: "ph",
		country_code: "ph"
	}],
	["en-pl", {
		force_country: "pl",
		country_code: "pl"
	}],
	["en-sa", {
		force_country: "sa",
		country_code: "sa"
	}],
	["en-th", {
		force_country: "th",
		country_code: "th"
	}],
	["en-za", {
		force_country: "za",
		country_code: "za"
	}],
	["en-ae", {
		force_country: "ae",
		country_code: "ae"
	}],
	["en-sg", {
		force_country: "sg",
		country_code: "sg"
	}],
	["en-sd", {
		force_country: "sd",
		country_code: "sd"
	}],
	["en-mt", {
		force_country: "mt",
		country_code: "mt"
	}],
	["en-lv", {
		force_country: "lv",
		country_code: "lv"
	}],
	["en-jm", {
		force_country: "jm",
		country_code: "jm"
	}],
	["en-bz", {
		force_country: "bz",
		country_code: "bz"
	}],
	["en-gb", {
		force_country: "uk",
		country_code: "gb"
	}],
	["en-au", {
		force_country: "au",
		country_code: "au"
	}],
	["en-nz", {
		force_country: "nz",
		country_code: "nz"
	}],
	["en-cz", {
		force_country: "cz",
		country_code: "cz"
	}],
	["en-global", {
		force_country: "en",
		country_code: null
	}],
	["es-cl", {
		force_country: "cl",
		country_code: "cl"
	}],
	["es-co", {
		force_country: "co",
		country_code: "co"
	}],
	["es-mx", {
		force_country: "mx",
		country_code: "mx"
	}],
	["es-pe", {
		force_country: "pe",
		country_code: "pe"
	}],
	["es-bz", {
		force_country: "bz",
		country_code: "bz"
	}],
	["es-es", {
		force_country: "es",
		country_code: "es"
	}],
	["es-global", {
		force_country: "en",
		country_code: null
	}],
	["ro-ro", {
		force_country: "ro",
		country_code: "ro"
	}],
	["it-it", {
		force_country: "it",
		country_code: "it"
	}],
	["fr-fr", {
		force_country: "fr",
		country_code: "fr"
	}],
	["fr-be", {
		force_country: null,
		country_code: null,
		isZuora: true
	}],
	["nl-be", {
		force_country: null,
		country_code: null,
		isZuora: true
	}],
	["nl-nl", {
		force_country: null,
		country_code: null,
		isZuora: true
	}],
	["de-de", {
		force_country: "de",
		country_code: "de"
	}],
	["de-at", {
		force_country: "de",
		country_code: "at"
	}],
	["de-ch", {
		force_country: "ch",
		country_code: "ch"
	}],
	["sv-se", {
		force_country: "se",
		country_code: "se"
	}],
	["pt-br", {
		force_country: "br",
		country_code: "br"
	}],
	["pt-pt", {
		force_country: "pt",
		country_code: "pt"
	}],
	["zh-hk", {
		force_country: "en",
		country_code: "hk"
	}],
	["zh-tw", {
		force_country: "en",
		country_code: "tw"
	}]
]);
/**
* @returns {boolean} check if you are on exactly the consumer page (e.g /en-us/consumer/)
*/
function checkIfNotProductPage() {
	return Constants.NONE_PRODUCT_PAGES.includes(page_default.name);
}
function addScript(src, data = {}, loadStrategy = void 0, onLoadCallback = void 0, onErrorCallback = void 0, type = void 0) {
	const s = document.createElement("script");
	s.setAttribute("src", src);
	if (loadStrategy) s.setAttribute(loadStrategy, true);
	if (type) s.setAttribute("type", type);
	if (typeof data === "object" && data !== null) {
		for (const key in data) if (data.hasOwnProperty(key)) s.dataset[key] = data[key];
	}
	if (onLoadCallback) s.onload = onLoadCallback;
	if (onErrorCallback) s.onerror = onErrorCallback;
	document.body.appendChild(s);
}
function createTag(tag, attributes, html) {
	const el = document.createElement(tag);
	if (html) {
		if (html instanceof HTMLElement || html instanceof SVGElement || html instanceof DocumentFragment) el.append(html);
		else if (Array.isArray(html)) el.append(...html);
		else el.insertAdjacentHTML("beforeend", html);
	}
	if (attributes) Object.entries(attributes).forEach(([key, val]) => {
		el.setAttribute(key, val);
	});
	return el;
}
function isZuora() {
	const url = new URL(window.location.href);
	return url.pathname.includes("/nl-nl/") || url.pathname.includes("/nl-be/");
}
function getMetadata(name) {
	const attr = name && name.includes(":") ? "property" : "name";
	return [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(", ") || "";
}
function getProductLinkCountryPrefix() {
	const { pathname } = window.location;
	if (pathname.includes("/en-au/")) return "https://www.bitdefender.com.au/site/Store/ajax";
	if (pathname.includes("/en-gb/")) return "https://www.bitdefender.com.uk/site/Store/ajax";
	if (pathname.includes("/ro-ro/")) return "https://www.bitdefender.ro/site/Store/ajax";
	if (pathname.includes("/it-it/")) return "https://www.bitdefender.it/site/Store/ajax";
	if (pathname.includes("/fr-fr/")) return "https://www.bitdefender.fr/site/Store/ajax";
	if (pathname.includes("/fr-be/")) return "https://www.bitdefender.be/site/Store/ajax";
	if (pathname.includes("/nl-be/")) return "https://www.bitdefender.be/site/Store/ajax";
	if (pathname.includes("/nl-nl/")) return "https://www.bitdefender.nl/site/Store/ajax";
	if (pathname.includes("/de-de/")) return "https://www.bitdefender.de/site/Store/ajax";
	if (pathname.includes("/de-ch/")) return "https://www.bitdefender.de/site/Store/ajax";
	if (pathname.includes("/sv-se/")) return "https://www.bitdefender.se/site/Store/ajax";
	if (pathname.includes("/pt-br/")) return "https://www.bitdefender.com.br/site/Store/ajax";
	if (pathname.includes("/pt-pt/")) return "https://www.bitdefender.pt/site/Store/ajax";
	if (pathname.includes("/es-es/")) return "https://www.bitdefender.es/site/Store/ajax";
	return "https://www.bitdefender.com/site/Store/ajax";
}
function getBuyLinkCountryPrefix() {
	return "https://www.bitdefender.com/site/Store/buy";
}
function getPriceLocalMapByLocale() {
	const locale = window.location.pathname.split("/")[1];
	return PRICE_LOCALE_MAP.get(locale) || PRICE_LOCALE_MAP.get("en-us");
}
function generateProductBuyLink(product, productCode, month = null, years = null, pid = null) {
	if (isZuora()) return product.buy_link;
	const m = product.variation?.dimension_value || month;
	const y = product.variation?.years || years;
	const url = new URL(window.location.href);
	let buyLinkPid = "";
	if (pid) buyLinkPid = `pid.${pid}`;
	else if (url.searchParams.get("pid")) buyLinkPid = `pid.${url.searchParams.get("pid")}`;
	else if (getMetadata("pid")) buyLinkPid = `pid.${getMetadata("pid")}`;
	if (GLOBAL_V2_LOCALES.includes(page_default.locale)) buyLinkPid = "pid.global_v2";
	const forceCountry = getPriceLocalMapByLocale().force_country;
	return `${getBuyLinkCountryPrefix()}/${productCode}/${m}/${y}/${buyLinkPid}?force_country=${forceCountry}`;
}
function setDataOnBuyLinks(element, dataInfo) {
	const { productId, variation } = dataInfo;
	if (productId) element.dataset.product = productId.trim();
	if (variation.price) element.dataset.buyPrice = variation.price.trim();
	if (variation.oldPrice) element.dataset.oldPrice = variation.oldPrice.trim();
	if (variation.currency_label) element.dataset.currency = variation.currency_label.trim();
	if (variation.region_id) element.dataset.region = variation.region_id.trim();
	if (variation.variation_name) element.dataset.variation = variation.variation_name.trim();
}
function formatPrice(price, currency) {
	if (!price) return null;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency
	}).format(price);
}
var nanoBlocks = /* @__PURE__ */ new Map();
function findTextNodes(parent) {
	let all = [];
	for (let node = parent.firstChild; node; node = node.nextSibling) if (node.nodeType === Node.TEXT_NODE) all.push(node);
	else all = all.concat(findTextNodes(node));
	return all;
}
/**
* Create a nano block
* The renderer should return a valid HTMLElement. This parameter is mandatory.
* @param name The name of the block
* @param renderer The renderer function
*/
function createNanoBlock(name, renderer) {
	nanoBlocks.set(name.toLowerCase(), renderer);
}
/**
* Parse nano block parameters, support string and array.
* parseString("aa, bb, cc") -> [ 'aa', 'bb', 'cc' ]
* parseString("aa, [x, y, z], cc") -> [ 'aa', [ 'x', 'y', 'z' ], 'cc' ]
* @param params string representing nanoblock parameters
* @returns an array representation of the parameters
*/
function parseParams(params) {
	const segments = params.split(",").map((segment) => segment.trim());
	const result = [];
	let tempArray = [];
	let isInArray = false;
	segments.forEach((segment) => {
		if (isInArray) {
			if (segment.endsWith("]")) {
				tempArray.push(segment.slice(0, -1).trim());
				result.push(tempArray);
				tempArray = [];
				isInArray = false;
			} else tempArray.push(segment.trim());
		} else if (segment.startsWith("[")) {
			if (segment.endsWith("]")) result.push(segment.slice(1, -1).trim());
			else {
				tempArray.push(segment.slice(1).trim());
				isInArray = true;
			}
		} else result.push(segment);
	});
	return result;
}
function replaceDoubleCommas(str) {
	const arr = str.split("");
	for (let i = arr.length - 1; i > 0; i -= 1) if (arr[i] === "," && arr[i - 1] === ",") arr.splice(i, 1);
	return arr.join("");
}
function getDatasetFromSection(block) {
	return block.closest(".section").dataset;
}
/**
* Renders nano blocks
* @param parent The parent element
*/
async function renderNanoBlocks(parent = document.body, mv = void 0, index = void 0, block = void 0) {
	const regex = /{([^}]+)}/g;
	findTextNodes(parent).forEach((node) => {
		const matches = node.textContent.trim().match(regex);
		if (matches) matches.forEach((match) => {
			const [name] = parseParams(match.slice(1, -1));
			const datasetValue = getDatasetFromSection(parent);
			const [newName, ...params] = parseParams([match, replaceDoubleCommas((index !== void 0 ? datasetValue[`${name.toLowerCase()}${index + 1}`] : datasetValue[name.toLowerCase()]) || "").split(",")].join(",").replace(/[{}]/g, ""));
			const renderer = nanoBlocks.get(newName.toLowerCase());
			if (renderer) {
				const element = mv ? renderer(mv, ...params, block, index, parent) : renderer(...params, block, index, parent);
				element.classList.add("nanoblock");
				const oldElement = node.parentNode;
				oldElement.parentNode.replaceChild(element, oldElement);
			}
		});
	});
}
/**
* Results returned from {@link fetchIndex} come from a derived Excel sheet that is constructed
* with the FILTER function. This FILTER function has the unwanted side effect of returning '0' in
* cells that are empty in the original sheet.
*
* This function replaces those '0' values with empty cells again.
*
* @see fetchIndex
* @param {Object} data - the data returned from the fetchIndex function.
*/
function fixExcelFilterZeroes(data) {
	data.forEach((line) => {
		Object.keys(line).forEach((k) => {
			line[k] = line[k] === "0" ? "" : line[k];
		});
	});
}
async function fetchIndex(indexFile, sheet, pageSize = 500) {
	const idxKey = indexFile.concat(sheet || "");
	const handleIndex = async (offset) => {
		const sheetParam = sheet ? `&sheet=${sheet}` : "";
		const json = await (await fetch(`/${window.location.pathname.split("/")[1]}/${indexFile}.json?limit=${pageSize}&offset=${offset}${sheetParam}`)).json();
		return {
			complete: json.limit + json.offset === json.total,
			offset: json.offset + pageSize,
			promise: null,
			data: [...window.index[idxKey].data, ...json.data]
		};
	};
	window.index = window.index || {};
	window.index[idxKey] = window.index[idxKey] || {
		data: [],
		offset: 0,
		complete: false,
		promise: null
	};
	if (window.index[idxKey].complete) return window.index[idxKey];
	if (window.index[idxKey].promise) return window.index[idxKey].promise;
	window.index[idxKey].promise = handleIndex(window.index[idxKey].offset);
	const newIndex = await window.index[idxKey].promise;
	window.index[idxKey] = newIndex;
	return newIndex;
}
var GLOBAL_EVENTS = {
	ADOBE_MC_LOADED: "adobe_mc::loaded",
	PAGE_LOADED: "page::loaded"
};
var ICONS_CACHE = {};
async function decorateIcons(element) {
	let svgSprite = document.getElementById("franklin-svg-sprite");
	if (!svgSprite) {
		const div = document.createElement("div");
		div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"franklin-svg-sprite\" style=\"display: none\"></svg>";
		svgSprite = div.firstElementChild;
		document.body.append(div.firstElementChild);
	}
	const icons = [...element.querySelectorAll("span.icon")];
	await Promise.all(icons.map(async (span) => {
		const iconName = Array.from(span.classList).find((c) => c.startsWith("icon-")).substring(5);
		if (!ICONS_CACHE[iconName]) {
			ICONS_CACHE[iconName] = true;
			try {
				let dynamicIconsSharepointPath = "/common/icons/";
				if (window.location.hostname.includes("www-landing-pages") || window.location.hostname.includes("bitdefender.com/pages")) dynamicIconsSharepointPath = "/icons/";
				const response = await fetch(`${dynamicIconsSharepointPath}${iconName}.svg`);
				if (!response.ok) {
					ICONS_CACHE[iconName] = false;
					return;
				}
				const svg = await response.text();
				if (svg.match(/(<style | class=)/)) ICONS_CACHE[iconName] = {
					styled: true,
					html: svg
				};
				else ICONS_CACHE[iconName] = { html: svg.replace("<svg", `<symbol id="icons-sprite-${iconName}"`).replace(/ width=".*?"/, "").replace(/ height=".*?"/, "").replace("</svg>", "</symbol>") };
			} catch (error) {
				ICONS_CACHE[iconName] = false;
				console.error(error);
			}
		}
	}));
	const symbols = Object.keys(ICONS_CACHE).filter((k) => !svgSprite.querySelector(`#icons-sprite-${k}`)).map((k) => ICONS_CACHE[k]).filter((v) => !v.styled).map((v) => v.html).join("\n");
	svgSprite.innerHTML += symbols;
	icons.forEach((span) => {
		const iconName = Array.from(span.classList).find((c) => c.startsWith("icon-")).substring(5);
		const parent = span.firstElementChild?.tagName === "A" ? span.firstElementChild : span;
		if (ICONS_CACHE[iconName].styled) parent.innerHTML = ICONS_CACHE[iconName].html;
		else parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`;
	});
}
async function matchHeights(targetNode, selector) {
	const resetHeights = () => {
		targetNode.querySelectorAll(selector).forEach((element) => {
			element.style.minHeight = "";
		});
	};
	const adjustHeights = () => {
		if (window.innerWidth >= 768) {
			resetHeights();
			const elements = targetNode.querySelectorAll(selector);
			const elementsHeight = Array.from(elements).map((element) => element.offsetHeight);
			const maxHeight = Math.max(...elementsHeight);
			elements.forEach((element) => {
				element.style.minHeight = `${maxHeight}px`;
			});
		} else resetHeights();
	};
	const matchHeightsCallback = (mutationsList) => {
		Array.from(mutationsList).forEach((mutation) => {
			if (mutation.type === "childList") adjustHeights();
		});
	};
	const observer = new MutationObserver(matchHeightsCallback);
	const resizeObserver = new ResizeObserver(debounce((entries) => {
		entries.forEach((entry) => {
			adjustHeights();
		});
	}), 100);
	if (targetNode) observer.observe(targetNode, {
		childList: true,
		subtree: true
	});
	window.addEventListener("resize", () => {
		adjustHeights();
	});
	targetNode.querySelectorAll(selector).forEach((element) => {
		resizeObserver.observe(element);
	});
	adjustHeights();
}
/**
* Adjusts the font size of matching elements until a target element reaches a
* target height. The adjustment is bounded so localized copy cannot become
* unreadably small.
* @param {string} elementsSelector CSS selector for elements to adjust
* @param {HTMLElement} targetElement Element whose height should be matched
* @param {number} targetHeight Target height in pixels
* @param {number} [maxSize=100] Maximum font size in pixels
* @param {number} [minSize=10] Minimum font size in pixels
* @param {number} [step=1] Font size adjustment step in pixels
* @param {number} [interval=50] Adjustment interval in milliseconds
* @param {HTMLElement|Document} [rootElement=document] Query root
*/
function adjustFontSizeUntilTargetHeight(elementsSelector, targetElement, targetHeight, maxSize = 100, minSize = 10, step = 1, interval = 50, rootElement = document) {
	const DEBOUNCE_DELAY_MS = 100;
	const elements = rootElement.querySelectorAll(elementsSelector);
	if (!elements.length || !targetElement || !targetElement.offsetHeight) return;
	let previousHeight = targetElement.offsetHeight;
	let previousDirection = 0;
	let active = true;
	let timer;
	let observer;
	function stop() {
		active = false;
		window.clearTimeout(timer);
		observer?.disconnect();
	}
	function adjustSize() {
		if (!active) return;
		const currentHeight = targetElement.offsetHeight;
		if (Math.abs(currentHeight - targetHeight) <= 2) {
			stop();
			return;
		}
		const direction = currentHeight > targetHeight ? -1 : 1;
		if (previousDirection && direction !== previousDirection) {
			if (Math.abs(previousHeight - targetHeight) < Math.abs(currentHeight - targetHeight)) elements.forEach((element) => {
				const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
				element.style.fontSize = `${currentSize - direction * step}px`;
			});
			stop();
			return;
		}
		let fontChanged = false;
		elements.forEach((element) => {
			const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
			const nextSize = Math.min(maxSize, Math.max(minSize, currentSize + direction * step));
			if (nextSize !== currentSize) {
				element.style.fontSize = `${nextSize}px`;
				fontChanged = true;
			}
		});
		if (fontChanged) timer = window.setTimeout(adjustSize, interval);
		else stop();
		previousDirection = direction;
	}
	observer = new MutationObserver(debounce(() => {
		if (!active) return;
		const newHeight = targetElement.offsetHeight;
		if (newHeight !== previousHeight) {
			previousHeight = newHeight;
			adjustSize();
		}
	}, DEBOUNCE_DELAY_MS));
	observer.observe(targetElement, {
		attributes: true,
		childList: true,
		subtree: true
	});
	adjustSize();
}
function isSafariMobile() {
	return (UserAgent.os === "ios" || UserAgent.os === "Mac/iOS") && UserAgent.isSafari;
}
function embedYoutube(url, autoplay) {
	const usp = new URLSearchParams(url.search);
	const muteParam = autoplay && isSafariMobile() ? "&mute=1&muted=1" : "";
	const suffix = autoplay ? `&cc_load_policy=1&autoplay=1&playsinline=1${muteParam}` : "";
	const startTime = usp.get("t") ? `&start=${encodeURIComponent(usp.get("t"))}` : "";
	let vid = usp.get("v") ? encodeURIComponent(usp.get("v")) : url.pathname.split("/").pop();
	if (url.origin.includes("youtu.be")) [, vid] = url.pathname.split("/");
	const iframeId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
	const origin = encodeURIComponent(window.location.origin);
	return `
    <iframe id="${iframeId}"
      src="https://www.youtube.com/embed/${vid}?rel=0&enablejsapi=1&origin=${origin}${suffix}${startTime}"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
      allowfullscreen
      scrolling="no"
      title="Content from Youtube"
      loading="lazy"></iframe>
  `;
}
function getPidFromUrl() {
	return new URL(window.location.href).searchParams.get("pid") || getMetadata("pid");
}
function trackProduct(product, location = "") {
	if (!product && product.length === 0) return;
	if (location && location === "comparison") {
		if (!TRACKED_PRODUCTS_COMPARISON.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId)) TRACKED_PRODUCTS_COMPARISON.push(product);
	} else if (!TRACKED_PRODUCTS.find((p) => p.platformProductId === product.platformProductId && p.variantId === product.variantId)) TRACKED_PRODUCTS.push(product);
}
function pushTrialDownloadToDataLayer() {
	const trialPaths = [
		"fragments/thank-you-for-downloading",
		"fragments/get-bitdefender",
		"fragments/trial"
	];
	const getTrialID = (currentPage, button) => {
		if (["thank-you", "free-antivirus"].includes(currentPage)) return "8430";
		const buttonProductId = button?.getAttribute("product-id");
		if (buttonProductId) return buttonProductId;
		const { storeId } = (button?.closest(".section")?.querySelector("[data-store-id]") || button?.closest(".section")).dataset;
		if (storeId) return storeId;
		return getMetadata("breadcrumb-title") || getMetadata("og:title");
	};
	const currentPage = page_default.name;
	const downloadType = currentPage === "thank-you" ? "product" : "trial";
	const pushTrialData = (button = null) => {
		AdobeDataLayerService.push(new ButtonClickEvent(`${downloadType} downloaded`, { productId: getTrialID(currentPage, button) }));
	};
	const sections = document.querySelectorAll("a.button.modal");
	if (sections.length) sections.forEach((button) => {
		const href = button.getAttribute("location");
		if (!href) return;
		if (trialPaths.some((trialPath) => href.includes(trialPath)) && !button.hasAttribute("data-layer-ignore")) button.addEventListener("click", () => {
			pushTrialData(button);
		});
	});
	else if (currentPage === "thank-you") pushTrialData();
}
function setUrlParams(urlIn, paramsIn = []) {
	const isRelativeLink = /^(?!\/\/|[a-z]+:)/i;
	if (!Array.isArray(paramsIn)) {
		console.error(`paramsIn must be an Array but you provided an ${typeof paramsIn}`);
		return urlIn;
	}
	const url = isRelativeLink.test(urlIn) ? new URL(urlIn, window.location.origin) : new URL(urlIn);
	for (const param of paramsIn) {
		if (!param) continue;
		const [key, value] = param.split("=");
		if (value === "") url.searchParams.delete(key);
		else url.searchParams.set(key, value || "");
	}
	return url.href;
}
function getDomain() {
	return window.location.pathname.split("/").filter((item) => item)[0];
}
/**
* Maps a site locale (first path segment) to the locale folder of the AEM
* experience fragments on bitdefender.com: en-us -> en, xx-global -> xx,
* xx-yy -> xx_yy. Anything that isn't shaped like a locale (/drafts/, the
* site root, etc.) falls back to en, since language_master has no folder for it.
* @param {string} [domain] site locale, defaults to getDomain()
* @returns {string} AEM fragment locale
*/
function getAemFragmentLocale(domain = getDomain()) {
	const locale = domain?.toLowerCase();
	if (!locale || !/^[a-z]{2}-([a-z]{2}|global)$/.test(locale) || locale === "en-us") return "en";
	const [language, region] = locale.split("-");
	return region === "global" ? language : `${language}_${region}`;
}
/**
* Prefixes the root-relative image URLs (src, srcset, data-cmp-src) of an AEM
* fragment with the public origin, so they load from bitdefender.com instead of
* the current host (aem.page, localhost). No-op where the origin is the site itself.
* @param {ParentNode} root fragment content
* @param {string} [origin] defaults to Constants.PUBLIC_URL_ORIGIN
*/
function makeImagePathsAbsolute(root, origin = Constants.PUBLIC_URL_ORIGIN) {
	if (!origin) return;
	const rootRelative = /(^|,)(\s*)(\/(?!\/)[^\s,]*)/g;
	root.querySelectorAll("img, source, [data-cmp-src]").forEach((element) => {
		[
			"src",
			"srcset",
			"data-cmp-src"
		].forEach((attribute) => {
			const value = element.getAttribute(attribute);
			if (value) element.setAttribute(attribute, value.replace(rootRelative, `$1$2${origin}$3`));
		});
	});
}
function isView(viewport) {
	const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
	return !!(element && getComputedStyle(element).display !== "none");
}
function openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos, anchorSelector = null) {
	let openUrl;
	switch (UserAgent.os) {
		case "Mac/iOS":
			openUrl = urlMacos;
			break;
		case "Windows":
			openUrl = urlWindows;
			break;
		case "Linux":
		case "android":
			openUrl = urlAndroid;
			break;
		case "ios":
			openUrl = urlIos;
			break;
		default: openUrl = null;
	}
	if (openUrl) {
		if (anchorSelector) anchorSelector.href = openUrl;
		else window.open(openUrl, "_self");
	}
}
function getBrowserName() {
	const { userAgent } = navigator;
	if (userAgent.includes("Firefox")) return "Firefox";
	if (userAgent.includes("Edg")) return "Edge";
	if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
	if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
	return "Unknown";
}
/**
* Returns the promotion/campaign found in the URL
* @returns {string|null}
*/
var getUrlPromotion = () => page_default.getParamValue("pid") || page_default.getParamValue("promotionId") || page_default.getParamValue("campaign") || null;
/**
* Returns the promotion/campaign found in the Vlaicu file or 'global_v2' for specific locales
* @returns {string|null}
*/
var getCampaignBasedOnLocale = () => {
	if (GLOBAL_V2_LOCALES.find((domain) => page_default.locale === domain)) return "global_v2";
	if (!Constants.ZUROA_LOCALES.includes(page_default.locale)) return Constants.NO_PROMOTION;
	return Constants.PRODUCT_ID_MAPPINGS?.campaign || Constants.NO_PROMOTION;
};
function decorateBlockWithRegionId(element, id) {
	if (element) element.id = id;
}
function decorateLinkWithLinkTrackingId(element, id) {
	if (element) element.setAttribute("s-object-id", id);
}
var getPageExperimentKey = () => getMetadata(Constants.TARGET_EXPERIMENT_METADATA_KEY);
/**
*
* @returns {boolean} returns wether A/B tests should be disabled or not
*/
var shouldABTestsBeDisabled = () => {
	if (new URLSearchParams(window.location.search).get(Constants.DISABLE_TARGET_PARAMS.key) === Constants.DISABLE_TARGET_PARAMS.value) return true;
	return false;
};
/**
*
* @returns {object} - get experiment information
*/
var getExperimentDetails = () => {
	if (!window.hlx || !window.hlx.experiment) return null;
	const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
	return {
		experimentId,
		experimentVariant
	};
};
/**
* get the name of the page as seen by analytics
* @returns {string}
*/
var generatePageLoadStartedName = () => {
	/**
	*
	* @param {string[]} tags
	* @returns {string[]} get all analytic tags
	*/
	if (window.location.href.includes("oaiusercontent")) return "oai";
	const getTags = (tags) => tags ? tags.split(":").filter((tag) => !!tag).map((tag) => tag.trim()) : [];
	const { pathname } = window.location;
	const tags = getTags(getMetadata("analytics-tags"));
	const { locale } = page_default;
	const pageSectionDataLocale = getMetadata("locale") || page_default.locale;
	let tagName;
	if (tags.length) tagName = [pageSectionDataLocale, ...tags].filter(Boolean).join(":");
	else {
		const allSegments = pathname.split("/").filter((segment) => segment !== "");
		const lastSegment = allSegments[allSegments.length - 1];
		const subSubSubSection = allSegments[allSegments.length - 1] = allSegments[allSegments.length - 1].replace(/-/g, " ");
		tagName = `${locale}:${lastSegment === "subscriber-protection-platform" ? "partners" : "product"}:${subSubSubSection}`;
		if (lastSegment === "trusted" || lastSegment === "scuderiaferrari") tagName = `${locale}:${lastSegment}`;
		if (lastSegment === "consumer") tagName = `${locale}:consumer:solutions`;
		if (pathname.includes("spot-the-scam-quiz")) {
			tagName = `${locale}:consumer:quiz`;
			if (getMetadata("skip-start-page")) tagName = `${locale}:consumer:quiz:question-1`;
			if (!pathname.endsWith("/")) tagName = `${locale}:consumer:quiz:results:${subSubSubSection}`;
		}
		if (pathname.includes("scam-masters")) tagName = `${locale}:consumer:quiz:scam-masters`;
		if (pathname.includes("reverse-phone-lookup")) {
			tagName = `${locale}:consumer:product:${subSubSubSection}`;
			if (pathname.includes("/reverse-phone-lookup/")) tagName = `${locale}:consumer:product:reverse phone lookup:${subSubSubSection}`;
		}
		if (lastSegment === "web-sage") tagName = `${locale}:consumer:product:${subSubSubSection}`;
		if (pathname.includes("bundle-solutions")) tagName = `${locale}:oem:bundle solutions`;
		if (window.errorCode === "404") tagName = `${locale}:404`;
	}
	return tagName;
};
/**
*
* @returns {string} get product findings for analytics
*/
var getProductFinding = () => {
	const productFindingMetadata = getMetadata("product-finding");
	if (productFindingMetadata) return productFindingMetadata;
	const pageName = page_default.name.toLowerCase();
	const currentPath = window.location.pathname;
	let productFinding = "";
	switch (pageName) {
		case "consumer":
			productFinding = "solutions page";
			break;
		case "thank-you":
			productFinding = "thank you page";
			break;
		case "toolbox page":
			productFinding = "toolbox page";
			break;
		case "downloads":
			productFinding = "downloads page";
			break;
		case "spot-the-scam-quiz":
			productFinding = "consumer quiz";
			break;
		case "scamio": break;
		default: if (currentPath.includes("/consumer/")) productFinding = "product pages";
	}
	if (currentPath.includes("/link-checker")) productFinding = "toolbox page";
	if (currentPath.includes("/spot-the-scam-quiz")) productFinding = "consumer quiz";
	return productFinding;
};
function generateLDJsonSchema() {
	const country = getMetadata("jsonld-areaserved").split(";").map((pair) => pair.split(":")).findLast(([key]) => key === page_default.locale)?.[1] || null;
	const jsonldName = getMetadata("jsonld-name");
	if (!country || !jsonldName) return;
	const ldJson = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: jsonldName,
		url: `${window.location.origin}${window.location.pathname}`,
		inLanguage: page_default.locale,
		areaServed: {
			"@type": "Country",
			name: country
		},
		isPartOf: {
			"@type": "WebSite",
			name: "Bitdefender",
			url: `${window.location.origin}/${page_default.locale}/`
		}
	};
	const script = document.createElement("script");
	script.type = "application/ld+json";
	script.textContent = JSON.stringify(ldJson, null, 2);
	document.head.appendChild(script);
}
var isRendering = false;
var widgetExecuting = false;
function renderTurnstile(containerId, { invisible = false } = {}) {
	if (isRendering) return Promise.reject(/* @__PURE__ */ new Error("Turnstile is already rendering."));
	isRendering = true;
	return new Promise((resolve, reject) => {
		function finish(error, result = null) {
			isRendering = false;
			widgetExecuting = false;
			if (error) reject(error);
			else resolve(result);
		}
		function renderWidget() {
			if (!window.turnstile) return finish(/* @__PURE__ */ new Error("Turnstile not loaded."));
			const container = document.getElementById(containerId);
			if (!container) return finish(/* @__PURE__ */ new Error(`Container "${containerId}" not found.`));
			container.innerHTML = "";
			const widgetId = window.turnstile.render(container, {
				sitekey: "0x4AAAAAABkTzSd63P7J-Tl_",
				size: invisible ? "compact" : "normal",
				callback: (token) => {
					widgetExecuting = false;
					if (!invisible) window.latestVisibleToken = token;
					if (!token) return finish(/* @__PURE__ */ new Error("Token missing."));
					return finish(null, {
						widgetId,
						token
					});
				},
				"error-callback": () => {
					finish(/* @__PURE__ */ new Error("Turnstile error during execution."));
				},
				"expired-callback": () => {
					finish(/* @__PURE__ */ new Error("Turnstile token expired."));
				}
			});
			if (invisible) {
				if (!widgetExecuting) {
					widgetExecuting = true;
					try {
						window.turnstile.execute(widgetId);
					} catch (err) {
						window.turnstile.reset(widgetId);
						window.turnstile.execute(widgetId);
					}
				}
			} else finish(null, { widgetId });
		}
		if (window.turnstile) renderWidget();
		else {
			const script = document.createElement("script");
			script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
			script.async = true;
			script.defer = true;
			window.onloadTurnstileCallback = renderWidget;
			document.head.appendChild(script);
		}
	});
}
async function submitWithTurnstile({ widgetId, data, fileName, successCallback = null, errorCallback = null }) {
	let ENDPOINT = "https://stage.bitdefender.com/form";
	if (window.location.hostname.startsWith("www.")) ENDPOINT = ENDPOINT.replace("stage.", "www.");
	try {
		if (!window.turnstile || typeof window.turnstile.getResponse !== "function") throw new Error("Turnstile is not loaded.");
		const token = window.turnstile.getResponse(widgetId);
		if (!token || token.length < 10) throw new Error("Turnstile token is missing or invalid. Please complete the challenge.");
		const requestData = {
			file: `/sites/common/formdata/${fileName}.xlsx`,
			table: "Table1",
			row: { ...data },
			token
		};
		const res = await fetch(ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestData)
		});
		if (!res.ok) throw new Error(`Server returned status ${res.status}`);
		if (typeof successCallback === "function") successCallback();
		window.turnstile.reset(widgetId);
	} catch (err) {
		if (typeof errorCallback === "function") errorCallback(err);
	}
}
var createBdContext = (topologyBoundary) => {
	const bdContext = document.createElement("bd-context");
	bdContext.classList.add("store-context");
	if (topologyBoundary) bdContext.setAttribute("topology-boundary", "");
	return bdContext;
};
var createBdProduct = (productId) => {
	const bdProductElement = document.createElement("bd-product");
	bdProductElement.classList.add("store-product");
	bdProductElement.setAttribute("product-id", productId);
	return bdProductElement;
};
var createBdOption = ({ devices, subscription, storeEvent = "" }) => {
	const bdOptionElement = document.createElement("bd-option");
	bdOptionElement.classList.add("store-option");
	bdOptionElement.setAttribute("devices", devices);
	bdOptionElement.setAttribute("subscription", subscription);
	if (storeEvent) bdOptionElement.setAttribute("data-layer-event", storeEvent);
	return bdOptionElement;
};
/**
* @param {HTMLElement} element
* @param {object} storeProperties
* @param {string} storeProperties.productId
* @param {number} storeProperties.devices
* @param {number} storeProperties.subscription
* @param {boolean} storeProperties.ignoreEventsParent
* @param {boolean} storeProperties.storeEvent
* @summary
* Modifies element into the following structure:
* ```html
* <bd-context>
*   <bd-product>
*     <bd-option>
*       initial element's children
*     </bd-option>
*   </bd-product>
* </bd-context>
* ```
*/
var wrapChildrenWithStoreContext = (element, { productId, devices, subscription, storeEvent = "", topologyBoundary = false }) => {
	if (!element || element.firstElementChild?.matches(".store-context")) return;
	const bdContext = createBdContext(topologyBoundary);
	const bdProduct = createBdProduct(productId);
	const bdOption = createBdOption({
		devices,
		subscription,
		storeEvent
	});
	while (element.firstChild) bdOption.appendChild(element.firstChild);
	bdProduct.appendChild(bdOption);
	bdContext.appendChild(bdProduct);
	element.appendChild(bdContext);
};
/**
* An authored icon (span.icon, the page's inline SVG) readied for a design
* system component's icon slot: a copy, sized, in the brand's colour unless
* the page names one.
*
* The component copies its slots into its shadow root once, when it renders,
* where the page's CSS cannot follow; so the icon goes in as an SVG that is
* already there, carrying its own colour. The icon set draws with
* currentColor, which an <img> cannot pass in: shown as images,
* complete-protection and online-privacy came out black beside performance,
* whose blue is in its file. An icon with its colours in its file keeps them.
*
* The caller awaits decorateIcons (lib-franklin) on its block first. The
* page's icon pass is not awaited, and that call queues behind it, so every
* span.icon in the block holds its SVG by the time this copies it.
*/
var slotIcon = (span, { color, size = 40 } = {}) => {
	const icon = span.cloneNode(true);
	icon.style.display = "block";
	icon.style.width = `${size}px`;
	icon.style.height = `${size}px`;
	icon.style.color = color || "var(--color-brand-500)";
	const svg = icon.querySelector("svg");
	if (svg) {
		svg.style.display = "block";
		svg.style.width = "100%";
		svg.style.height = "100%";
	} else icon.replaceChildren();
	return icon;
};
/**
* The element that holds a section's wrappers: the bd-section a page laid
* out on the design system's rhythm puts them in, or else the section itself.
* @param {HTMLElement} section
* @returns {HTMLElement}
*/
var getSectionContent = (section) => section?.querySelector(":scope > bd-section") || section;
/**
* Puts the block's section on the design system's vertical rhythm: every
* design system block calls it first, so its section's wrappers go into one
* bd-section, which pads the section (24 below md, 32 from md) and sets its
* blocks twice that apart, and the section adds no padding of its own
* (main .section:has(> bd-section) in styles.css). The Section Metadata
* styles `no-padding-top` and `no-padding-bottom` turn that edge's inset off.
* A second block in the same section finds the bd-section already there.
* @param {HTMLElement} block
* @returns {HTMLElement|null} the section's bd-section
*/
var wrapSectionInDsSection = (block) => {
	const section = block.closest(".section");
	if (!section) return null;
	const existing = section.querySelector(":scope > bd-section");
	if (existing) return existing;
	const bdSection = document.createElement("bd-section");
	["no-padding-top", "no-padding-bottom"].forEach((edge) => {
		if (section.classList.contains(edge)) bdSection.setAttribute(edge, "");
	});
	bdSection.append(...section.children);
	section.append(bdSection);
	import("../../vendor/repobit/dex-system-design/section.js").catch((err) => {
		console.warn("bd-section: DSN import failed, the section keeps its authored spacing", err);
	});
	return bdSection;
};
var HEADER_LAYOUTS = [
	"stacked",
	"split",
	"centered"
];
var toLead = (p) => {
	const lead = document.createElement("span");
	lead.slot = "lead";
	lead.append(...p.childNodes);
	lead.querySelectorAll("a").forEach((a) => {
		const link = document.createElement("bd-link");
		link.setAttribute("href", a.getAttribute("href") || "");
		link.setAttribute("inline", "");
		link.setAttribute("underline", "");
		link.append(...a.childNodes);
		a.replaceWith(link);
	});
	return lead;
};
/**
* Turns the default content that opens a block's section (an eyebrow p, an
* h1-h3 and a lead p) into a bd-section-header, in place, so the wrapper keeps
* its margins. Button links stay under it. One header per section: the first
* block to call this claims it. Layout comes from the section's Section
* Metadata: a `section-header-<layout>` Style (Section-header-split) or a
* `Header` key.
*
* Until sections are re-authored, a `section-header` block table in the same
* section is read too, its variant class giving the layout.
*
* @param {HTMLElement} block
* @param {{ layout?: string }} [options] a layout that wins over the section's
* @returns {Promise<HTMLElement|null>} the header, or null when there is none
*/
var liftSectionHeader = async (block, { layout } = {}) => {
	const section = block.closest(".section");
	if (!section || section.dataset.headerLifted !== void 0) return null;
	const content = getSectionContent(section);
	const legacy = content.querySelector(":scope > .section-header-wrapper > .section-header");
	const wrapper = content.querySelector(":scope > .default-content-wrapper");
	const source = wrapper?.querySelector("h1, h2, h3") ? wrapper : legacy;
	const heading = source?.querySelector("h1, h2, h3");
	if (!heading) return null;
	section.dataset.headerLifted = "";
	const eyebrow = heading.previousElementSibling?.matches("p:not(.button-container)") ? heading.previousElementSibling : null;
	let lead = heading.nextElementSibling;
	while (lead && !(lead.matches("p:not(.button-container)") && lead.textContent.trim() && !lead.querySelector("picture"))) lead = lead.nextElementSibling;
	const styleLayout = HEADER_LAYOUTS.find((name) => section.classList.contains(`section-header-${name}`));
	const legacyLayout = legacy && HEADER_LAYOUTS.find((name) => legacy.classList.contains(name));
	const requested = (layout || styleLayout || section.dataset.header || legacyLayout || "").trim().toLowerCase();
	const header = document.createElement("bd-section-header");
	header.setAttribute("heading", heading.textContent.trim());
	header.setAttribute("as", heading.tagName.toLowerCase());
	header.setAttribute("layout", HEADER_LAYOUTS.includes(requested) ? requested : "stacked");
	if (eyebrow) header.setAttribute("eyebrow", eyebrow.textContent.trim());
	if (heading.id) header.id = heading.id;
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/section-header.js"), import("../../vendor/repobit/dex-system-design/link.js")]);
	} catch (err) {
		console.warn("liftSectionHeader: DSN import failed, continuing with native rendering", err);
	}
	if (lead) header.append(toLead(lead));
	heading.replaceWith(header);
	eyebrow?.remove();
	lead?.remove();
	if (source === legacy) {
		const legacyWrapper = legacy.parentElement;
		legacyWrapper.classList.replace("section-header-wrapper", "default-content-wrapper");
		legacyWrapper.replaceChildren(header, ...legacy.querySelectorAll(".button-container"));
	}
	return header;
};
/**
* The homepage's phone frames run a section's CTAs across the column; from md
* (768, the design system's) they hug their label. bd-button-link stretches
* only through its own fullwidth attribute, so this sets it below md and keeps
* it in step when the viewport crosses md.
*
* @param {...HTMLElement} buttons bd-button-link (or bd-button) elements
*/
var fullWidthOnPhone = (...buttons) => {
	const tablet = window.matchMedia?.("(min-width: 768px)");
	const set = () => buttons.forEach((button) => button.toggleAttribute("fullwidth", !!tablet && !tablet.matches));
	set();
	tablet?.addEventListener("change", set);
};
function onCookiesAccepted(callback) {
	if (window.adobeDataLayer.getState("ucCategory.functional")) callback();
	else window.adobeDataLayer.addEventListener("consent_status", () => {
		if (window.adobeDataLayer.getState("ucCategory.functional")) callback();
	});
}
export { GLOBAL_EVENTS, GLOBAL_V2_LOCALES, IANA_BY_REGION_MAP, addScript, adjustFontSizeUntilTargetHeight, checkIfNotProductPage, createBdContext, createBdOption, createBdProduct, createNanoBlock, createTag, decorateBlockWithRegionId, decorateIcons, decorateLinkWithLinkTrackingId, embedYoutube, fetchIndex, fixExcelFilterZeroes, formatPrice, fullWidthOnPhone, generateLDJsonSchema, generatePageLoadStartedName, generateProductBuyLink, getAemFragmentLocale, getBrowserName, getBuyLinkCountryPrefix, getCampaignBasedOnLocale, getDatasetFromSection, getDomain, getExperimentDetails, getMetadata, getPageExperimentKey, getPidFromUrl, getPriceLocalMapByLocale, getProductFinding, getProductLinkCountryPrefix, getSectionContent, getUrlPromotion, isView, liftSectionHeader, makeImagePathsAbsolute, matchHeights, onCookiesAccepted, openUrlForOs, pushTrialDownloadToDataLayer, renderNanoBlocks, renderTurnstile, setDataOnBuyLinks, setUrlParams, shouldABTestsBeDisabled, slotIcon, submitWithTurnstile, trackProduct, wrapChildrenWithStoreContext, wrapSectionInDsSection };
