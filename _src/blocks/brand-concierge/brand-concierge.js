import { Constants } from "../../scripts/libs/constants.js";
import { getAemFragmentLocale, makeImagePathsAbsolute } from "../../scripts/utils/utils.js";
// src/blocks/brand-concierge/brand-concierge.js
var AEM_COMPONENT = "brandConcierge";
var SHARED_AEM_CHUNKS = [
	"dependencies",
	"runtime",
	"vendor"
];
/**
* @param {string} [locale] AEM fragment locale, e.g. en, ro_ro
* @returns {string} URL of the brand concierge experience fragment
*/
function getFragmentUrl(locale = getAemFragmentLocale()) {
	return `${Constants.PUBLIC_URL_ORIGIN}/content/experience-fragments/bitdefender/language_master/${locale}/consumer/brand-concierge/master/jcr:content/root.html`;
}
/**
* Loads the brand concierge from AEM into the block
* @param {Element} block The brand-concierge block element
*/
async function decorate(block) {
	block.textContent = "";
	const response = await fetch(getFragmentUrl());
	if (!response.ok) return;
	const host = document.createElement("div");
	const shadowRoot = host.attachShadow({ mode: "open" });
	const contentDiv = document.createElement("div");
	contentDiv.style.display = "none";
	const template = document.createElement("template");
	template.innerHTML = await response.text();
	makeImagePathsAbsolute(template.content);
	contentDiv.append(template.content);
	const loadedLinks = [...contentDiv.querySelectorAll("link")].map((linkElement) => {
		linkElement.href = `${Constants.PUBLIC_URL_ORIGIN}${linkElement.getAttribute("href")}`;
		linkElement.rel = "stylesheet";
		return new Promise((resolve, reject) => {
			linkElement.onload = resolve;
			linkElement.onerror = reject;
		});
	});
	const initAemComponent = () => window[AEM_COMPONENT](shadowRoot);
	const isAemComponentLoaded = typeof window[AEM_COMPONENT] === "function";
	if (!isAemComponentLoaded) window.addEventListener(AEM_COMPONENT, initAemComponent, { once: true });
	contentDiv.querySelectorAll("script").forEach((script) => {
		const src = script.getAttribute("src");
		script.remove();
		if (!src || SHARED_AEM_CHUNKS.some((key) => src.includes(key))) return;
		const newScript = document.createElement("script");
		newScript.src = `${Constants.PUBLIC_URL_ORIGIN}${src}`;
		newScript.defer = true;
		shadowRoot.appendChild(newScript);
	});
	shadowRoot.appendChild(contentDiv);
	block.append(host);
	if (isAemComponentLoaded) initAemComponent();
	await Promise.allSettled(loadedLinks);
	contentDiv.style.display = "";
}
export { decorate as default, getFragmentUrl };
