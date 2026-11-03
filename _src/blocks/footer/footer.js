import { decorateIcons, getMetadata, loadBlocks } from "../../scripts/lib-franklin.js";
import { Constants } from "../../scripts/libs/constants.js";
import { getAemFragmentLocale, makeImagePathsAbsolute } from "../../scripts/utils/utils.js";
import { adobeMcAppendVisitorId } from "../../scripts/target.js";
import { decorateMain } from "../../scripts/scripts.js";
// src/blocks/footer/footer.js
function wrapImgsInLinks(container) {
	container.querySelectorAll("picture").forEach((pic) => {
		const link = pic.nextElementSibling;
		if (link && link.tagName === "A" && link.href) {
			link.innerHTML = pic.outerHTML;
			pic.replaceWith(link);
		}
	});
}
function onFooterElementClick(evt) {
	const header = evt.target;
	const ul = header.nextElementSibling;
	header.classList.toggle("active");
	if (ul.classList.contains("open")) {
		ul.addEventListener("transitionend", function callback() {
			if (!ul.classList.contains("open")) ul.classList.remove("visible");
			ul.removeEventListener("transitionend", callback);
		});
		ul.classList.remove("open");
	} else {
		ul.classList.add("visible");
		setTimeout(() => {
			ul.classList.add("open");
		}, 10);
	}
}
function disableSelectedCountry(container) {
	container.querySelectorAll("li").forEach((countryLanguage) => {
		if (countryLanguage.innerHTML.includes("selected")) {
			countryLanguage.classList.add("deactivated");
			countryLanguage.innerHTML = countryLanguage.innerHTML.replace("(selected)", "");
		}
	});
}
function setupPrivacyButton(container) {
	const privacyButton = container.querySelector("a[href=\"#privacybutton\"]");
	if (privacyButton) {
		privacyButton.href = "#";
		privacyButton.addEventListener("click", (e) => {
			e.preventDefault();
			if (window.UC_UI) window.UC_UI.showSecondLayer();
		});
	}
}
async function runDefaultFooterLogic(block) {
	const footerPath = getMetadata("footer") || "/footer";
	const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith("/footer") ? { cache: "reload" } : {});
	if (resp.ok) {
		const html = await resp.text();
		const footer = document.createElement("div");
		footer.innerHTML = html;
		wrapImgsInLinks(footer);
		const sectionHeaders = footer.querySelectorAll("div > div > p");
		sectionHeaders[2].addEventListener("click", onFooterElementClick);
		sectionHeaders[3].addEventListener("click", onFooterElementClick);
		disableSelectedCountry(footer.querySelectorAll("div > div > ul")[3]);
		decorateIcons(footer);
		block.append(footer);
		setupPrivacyButton(footer);
		adobeMcAppendVisitorId("footer");
	}
}
async function runLandingpageLogic(block) {
	const footerPath = getMetadata("footer") || "/footer";
	const resp = await fetch(`${footerPath}.plain.html`);
	const fragment = document.createElement("main");
	if (resp.ok) {
		fragment.innerHTML = await resp.text();
		decorateMain(fragment);
		await loadBlocks(fragment);
	}
	const footer = block.closest(".footer-wrapper");
	if (window.location.href.indexOf("scuderiaferrari") !== -1 || window.location.href.indexOf("spurs") !== -1) block.closest(".footer-wrapper").id = "footer-ferrari";
	if (fragment) {
		const fragmentSections = fragment.querySelectorAll(":scope .section");
		if (fragmentSections) footer.replaceChildren(...fragmentSections);
	}
	[
		[/\[year\]/g, (/* @__PURE__ */ new Date()).getFullYear()],
		[/>Twitter Bitdefender</, "><img alt=\"x\" src=\"/_src/icons/twitter.svg\" /><"],
		[/>Linkedin Bitdefender</, "><img alt=\"linkedin\" src=\"/_src/icons/linkedin.svg\" /><"],
		[/>Facebook Bitdefender</, "><img alt=\"facebook\" src=\"/_src/icons/facebook.svg\" /><"],
		[/>Youtube Bitdefender</, "><img alt=\"youtube\" src=\"/_src/icons/youtube.svg\" /><"]
	].forEach(([pattern, replacement]) => {
		footer.innerHTML = footer.innerHTML.replace(pattern, replacement);
	});
	setupPrivacyButton(footer);
	adobeMcAppendVisitorId("footer");
}
async function runAemFooterLogic() {
	const aemFetchDomain = getAemFragmentLocale();
	const aemFooterFetch = await fetch(`${Constants.PUBLIC_URL_ORIGIN}/content/experience-fragments/bitdefender/language_master/${aemFetchDomain}/footer-fragment-v1/master/jcr:content/root.html`);
	if (!aemFooterFetch.ok) return;
	const aemFooterHtml = await aemFooterFetch.text();
	const footer = document.createElement("footer");
	const shadowRoot = footer.attachShadow({ mode: "open" });
	const contentDiv = document.createElement("div");
	const template = document.createElement("template");
	template.innerHTML = aemFooterHtml;
	makeImagePathsAbsolute(template.content);
	contentDiv.append(template.content);
	const loadedLinks = [];
	contentDiv.querySelectorAll("link").forEach((linkElement) => {
		linkElement.href = `${Constants.PUBLIC_URL_ORIGIN}${linkElement.getAttribute("href")}`;
		linkElement.rel = "stylesheet";
		loadedLinks.push(new Promise((resolve, reject) => {
			linkElement.onload = () => {
				resolve();
			};
			linkElement.onerror = () => {
				reject();
			};
		}));
	});
	["footer2025"].forEach((aemComponentName) => {
		window.addEventListener(aemComponentName, () => {
			window[aemComponentName](shadowRoot);
		});
	});
	contentDiv.querySelectorAll("script").forEach((script) => {
		if ([
			"dependencies",
			"runtime",
			"vendor"
		].some((key) => script.src.includes(key))) return;
		const newScript = document.createElement("script");
		newScript.src = `${Constants.PUBLIC_URL_ORIGIN}${script.getAttribute("src")}`;
		newScript.defer = true;
		shadowRoot.appendChild(newScript);
	});
	shadowRoot.appendChild(contentDiv);
	document.querySelector("footer").replaceWith(footer);
	adobeMcAppendVisitorId(contentDiv);
}
/**
* applies footer factory based on footer variation
* @param {String} footerMetadata The footer variation: landingpage' or none
* @param {Element} footer The footer element
*/
function applyFooterFactorySetup(footerMetadata, block) {
	switch (footerMetadata) {
		case "landingpage":
			runLandingpageLogic(block);
			break;
		case "franklinFooter":
			runDefaultFooterLogic(block);
			break;
		case "hidden": break;
		default: runAemFooterLogic(block);
	}
}
/**
* loads and decorates the footer
* @param {Element} block The footer block element
*/
async function decorate(block) {
	const footerMetadata = getMetadata("footer-type");
	block.parentNode.classList.add(footerMetadata || "default");
	block.textContent = "";
	applyFooterFactorySetup(footerMetadata, block);
}
export { decorate as default };
