// src/scripts/lib-franklin-api.js
/**
* @param {HTMLDivElement} shadoRoot
* @param {string} origin - prepends the origin to the relative links
*/
var updateLinkSources = (shadoRoot, origin) => {
	shadoRoot.querySelectorAll("source").forEach((source) => source.srcset = new URL(source.getAttribute("srcset"), origin).href);
	shadoRoot.querySelectorAll("img").forEach((image) => image.src = new URL(image.getAttribute("src"), origin).href);
};
var ICONS_CACHE = {};
async function decorateIcons(element) {
	let svgSprite = element.getElementById("franklin-svg-sprite");
	if (!svgSprite) {
		const div = document.createElement("div");
		div.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"franklin-svg-sprite\" style=\"display: none\"></svg>";
		svgSprite = div.firstElementChild;
		element.append(div.firstElementChild);
	}
	const icons = [...element.querySelectorAll("span.icon")];
	await Promise.all(icons.map(async (span) => {
		const iconName = Array.from(span.classList).find((c) => c.startsWith("icon-")).substring(5);
		if (!ICONS_CACHE[iconName]) {
			ICONS_CACHE[iconName] = true;
			try {
				let dynamicIconsSharepointPath = "https://www.bitdefender.com/common/icons/";
				if (window.location.hostname.includes("bitdefender.co.uk")) dynamicIconsSharepointPath = "https://www.bitdefender.co.uk/content/dam/franklin/";
				if (window.location.hostname.includes("bitdefender.fr")) dynamicIconsSharepointPath = "https://www.bitdefender.fr/content/dam/franklin/";
				if (window.location.hostname === "localhost") dynamicIconsSharepointPath = "https://www.bitdefender.com/common/icons/";
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
/**
* Sanitizes a string for use as a js property name.
* @param {string} name The unsanitized string
* @returns {string} The camelCased name
*/
function toCamelCase(name) {
	return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
/**
* Sanitizes a string for use as class name.
* @param {string} name The unsanitized string
* @returns {string} The class name
*/
function toClassName(name) {
	return typeof name === "string" ? name.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "";
}
/**
* Extracts the config from a block.
* @param {Element} block The block element
* @returns {object} The block config
*/
function readBlockConfig(block) {
	const config = {};
	block.querySelectorAll(":scope > div").forEach((row) => {
		if (row.children) {
			const cols = [...row.children];
			if (cols[1]) {
				const col = cols[1];
				const name = toClassName(cols[0].textContent);
				let value = "";
				if (col.querySelector("a")) {
					const as = [...col.querySelectorAll("a")];
					if (as.length === 1) value = as[0].href;
					else value = as.map((a) => a.href);
				} else if (col.querySelector("img")) {
					const imgs = [...col.querySelectorAll("img")];
					if (imgs.length === 1) value = imgs[0].src;
					else value = imgs.map((img) => img.src);
				} else if (col.querySelector("p")) {
					const ps = [...col.querySelectorAll("p")];
					if (ps.length === 1) value = ps[0].textContent;
					else value = ps.map((p) => p.textContent);
				} else value = row.children[1].textContent;
				config[name] = value;
			}
		}
	});
	return config;
}
function decorateSections(main) {
	main.querySelectorAll(":scope > div").forEach((section) => {
		const wrappers = [];
		let defaultContent = false;
		[...section.children].forEach((e) => {
			if (e.tagName === "DIV" || !defaultContent) {
				const wrapper = document.createElement("div");
				wrappers.push(wrapper);
				defaultContent = e.tagName !== "DIV";
				if (defaultContent) wrapper.classList.add("default-content-wrapper");
			}
			wrappers[wrappers.length - 1].append(e);
		});
		wrappers.forEach((wrapper) => section.append(wrapper));
		section.classList.add("section");
		const sectionMeta = section.querySelector("div.section-metadata");
		if (sectionMeta) {
			const meta = readBlockConfig(sectionMeta);
			Object.keys(meta).forEach((key) => {
				if (key === "style") meta.style.split(",").map((style) => toClassName(style.trim())).forEach((style) => section.classList.add(style));
				else section.dataset[toCamelCase(key)] = meta[key];
			});
			sectionMeta.parentNode.remove();
		}
	});
}
function decorateBlock(block) {
	const shortBlockName = block.classList[0];
	if (shortBlockName) {
		block.classList.add("block");
		block.dataset.blockName = shortBlockName;
		block.dataset.blockStatus = "initialized";
		block.parentElement.classList.add(`${shortBlockName}-wrapper`);
		const section = block.closest(".section");
		if (section) section.classList.add(`${shortBlockName}-container`);
	}
}
async function loadComponent(offer, block, options, selector) {
	const offerURL = new URL(offer);
	const origin = offerURL.origin;
	const offerFolder = offerURL.pathname.split("/").slice(0, -1).join("/");
	const container = selector ? document.querySelector(selector) : document.createElement("div");
	const shadowRoot = container.attachShadow({ mode: "open" });
	shadowRoot.innerHTML = `<link rel="stylesheet" href="${origin}/_src/blocks/${block}/${block}.css" type="text/css">`;
	const [html, js] = await Promise.all([fetch(offer).then((r) => r.text()), import(`${origin}/_src/blocks/${block}/${block}.js`)]);
	let franklinHTMLStructure = document.createElement("div");
	franklinHTMLStructure.innerHTML = html;
	decorateSections(franklinHTMLStructure);
	decorateBlock(franklinHTMLStructure.querySelector(`.${block}`));
	shadowRoot.innerHTML += franklinHTMLStructure.innerHTML;
	updateLinkSources(shadowRoot, `${origin}${offerFolder}/`);
	await js.default(shadowRoot.querySelector(".block"), { ...options });
	decorateIcons(shadowRoot);
	const currentPagePath = window.location.protocol + "//" + window.location.host + window.location.pathname;
	shadowRoot.querySelectorAll("a[href*=\"#\"]").forEach((link) => {
		let linkAnchor = link.getAttribute("href");
		try {
			const parsedLinkAnchor = new URL(linkAnchor, currentPagePath);
			const linkAnchorPath = parsedLinkAnchor.protocol + "//" + parsedLinkAnchor.host + parsedLinkAnchor.pathname;
			if (currentPagePath === linkAnchorPath) link.addEventListener("click", (event) => {
				event.preventDefault();
				linkAnchor = "#" + linkAnchor.split("#")[1];
				document.querySelector(linkAnchor).scrollIntoView({ behavior: "smooth" });
			});
		} catch (e) {
			return;
		}
	});
	return container;
}
export { decorateSections, loadComponent, readBlockConfig, toCamelCase, toClassName };
