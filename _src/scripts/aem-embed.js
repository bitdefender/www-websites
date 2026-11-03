import { StoreResolver } from "./libs/store/resolver/resolver.js";
import "./libs/store/index.js";
import { resolveNonProductsDataLayerforWidgets } from "./libs/data-layer.js";
// src/scripts/aem-embed.js
var AEMEmbed = class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.initialized = false;
		window.hlx = window.hlx || {};
		window.hlx.suppressLoadPage = true;
		[window.hlx.codeBasePath] = new URL(import.meta.url).pathname.split("/scripts/");
	}
	async loadBlock(body, block, blockName, origin) {
		const blockCss = `${origin}${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`;
		if (!body.querySelector(`link[href="${blockCss}"]`)) {
			const link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("href", blockCss);
			const cssLoaded = new Promise((resolve) => {
				link.onload = resolve;
				link.onerror = resolve;
			});
			body.appendChild(link);
			await cssLoaded;
		}
		try {
			const decorateBlock = await import(`${origin}${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`);
			if (decorateBlock.default) {
				const onDataLoaded = new Promise((resolve) => {
					if (window.openai?.toolOutput) resolve(window.openai.toolOutput);
					else window.addEventListener("openai:set_globals", () => {
						if (window.openai?.toolOutput) resolve(window.openai.toolOutput);
					});
				});
				await decorateBlock.default(block, onDataLoaded);
			}
		} catch (e) {
			console.log("An error occured while loading the content");
		}
		block.querySelectorAll("a[href]").forEach((link) => {
			const rawHref = link.getAttribute("href");
			if (!rawHref) return;
			link.href = new URL(rawHref, origin).href;
		});
		const baseUrl = this.attributes.getNamedItem("url")?.value;
		const rewriteUrl = (rawUrl) => {
			const parsed = new URL(rawUrl);
			const mediaFile = parsed.pathname.split("/").pop();
			return `${baseUrl.replace(/\/$/, "")}/${mediaFile}${parsed.search}`;
		};
		block.querySelectorAll("img").forEach((img) => {
			const rawSrc = img.getAttribute("src");
			if (!rawSrc) return;
			img.src = rewriteUrl(rawSrc);
		});
		block.querySelectorAll("picture source").forEach((source) => {
			const rawSrcset = source.getAttribute("srcset");
			if (!rawSrcset) return;
			source.srcset = rewriteUrl(rawSrcset);
		});
	}
	async handleHeader(htmlText, body, origin) {
		await this.pseudoDecorateMain(htmlText, body, origin);
		const main = body.querySelector("main");
		const header = document.createElement("header");
		body.append(header);
		const { buildBlock } = await import(`${origin}${window.hlx.codeBasePath}/scripts/lib-franklin.js`);
		const block = buildBlock("header", "");
		header.append(block);
		const cell = block.firstElementChild.firstElementChild;
		const nav = document.createElement("nav");
		cell.append(nav);
		while (main.firstElementChild) nav.append(main.firstElementChild);
		main.remove();
		await this.loadBlock(body, block, "header", origin);
		block.dataset.blockStatus = "loaded";
		body.style.height = "var(--nav-height)";
		body.classList.add("appear");
	}
	async handleFooter(htmlText, body, origin) {
		await this.pseudoDecorateMain(htmlText, body, origin);
		const main = body.querySelector("main");
		const footer = document.createElement("footer");
		body.append(footer);
		const { buildBlock } = await import(`${origin}${window.hlx.codeBasePath}/scripts/lib-franklin.js`);
		const block = buildBlock("footer", "");
		footer.append(block);
		const cell = block.firstElementChild.firstElementChild;
		const nav = document.createElement("nav");
		cell.append(nav);
		while (main.firstElementChild) nav.append(main.firstElementChild);
		main.remove();
		await this.loadBlock(body, block, "footer", origin);
		block.dataset.blockStatus = "loaded";
		body.classList.add("appear");
	}
	async pseudoDecorateMain(htmlText, body, origin) {
		const main = document.createElement("main");
		body.append(main);
		main.innerHTML = htmlText;
		const { decorateMain } = await import(`${origin}${window.hlx.codeBasePath}/scripts/scripts.js`);
		if (decorateMain) await decorateMain(main, true);
		const blockElements = main.querySelectorAll(".block");
		if (blockElements.length > 0) {
			const blocks = Array.from(blockElements).map((block) => block.classList.item(0));
			for (let i = 0; i < blockElements.length; i += 1) {
				const blockName = blocks[i];
				const block = blockElements[i];
				await this.loadBlock(body, block, blockName, origin);
			}
		}
		main.querySelectorAll(".section").forEach((s) => {
			s.dataset.sectionStatus = "loaded";
			s.style = "";
		});
	}
	async handleMain(htmlText, body, origin) {
		await this.pseudoDecorateMain(htmlText, body, origin);
		await StoreResolver.resolve(body);
		body.querySelectorAll(".await-loader").forEach((element) => {
			element.classList.remove("await-loader");
		});
		body.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				window.open(e.target.href, "_blank");
			});
		});
		body.classList.add("appear");
		await resolveNonProductsDataLayerforWidgets();
	}
	/**
	* Invoked each time the custom element is appended into a document-connected element.
	* This will happen each time the node is moved, and may happen before the element's contents
	* have been fully parsed.
	*/
	async connectedCallback() {
		if (!this.initialized) try {
			const urlAttribute = this.attributes.getNamedItem("url");
			if (!urlAttribute) throw new Error("aem-embed missing url attribute");
			const type = this.getAttribute("type") || "main";
			const body = document.createElement("body");
			body.style = "display: none";
			this.shadowRoot.append(body);
			const url = urlAttribute.value;
			const plainUrl = url.endsWith("/") ? `${url}index.plain.html` : `${url}.plain.html`;
			const { href, origin } = new URL(plainUrl);
			const resp = await fetch(href);
			if (!resp.ok) throw new Error(`Unable to fetch ${href}`);
			const styles = document.createElement("link");
			styles.setAttribute("rel", "stylesheet");
			styles.setAttribute("href", `${origin}${window.hlx.codeBasePath}/styles/styles.css`);
			styles.onload = () => {
				body.style = "";
			};
			styles.onerror = () => {
				body.style = "";
			};
			this.shadowRoot.appendChild(styles);
			let htmlText = await resp.text();
			htmlText = htmlText.replace(/.\/media/g, `${origin}/media`);
			this.initialized = true;
			if (type === "main") await this.handleMain(htmlText, body, origin);
			if (type === "header") await this.handleHeader(htmlText, body, origin);
			if (type === "footer") await this.handleFooter(htmlText, body, origin);
			const fonts = document.createElement("link");
			fonts.setAttribute("rel", "stylesheet");
			fonts.setAttribute("href", `${origin}${window.hlx.codeBasePath}/styles/fonts.css`);
			this.shadowRoot.appendChild(fonts);
		} catch (err) {
			console.log(err || "An error occured while loading the content");
		}
	}
	/**
	* Imports a script and appends to document body
	* @param {*} url
	* @returns
	*/
	async importScript(url) {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = url;
			script.async = true;
			script.type = "module";
			script.onload = resolve;
			script.onerror = reject;
			document.body.appendChild(script);
		});
	}
};
customElements.define("aem-embed", AEMEmbed);
export { AEMEmbed };
