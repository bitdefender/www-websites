import page_default from "../page.js";
import { decorateBlocks, decorateSections, loadCSS } from "../lib-franklin.js";
// src/scripts/black-friday/ribbon.js
var END = /* @__PURE__ */ new Date("2026-12-02T11:00:00+02:00");
var PAGES_WITH_LINKED_RIBBON = [
	"antivirus",
	"antivirus-for-mac",
	"security-for-creators",
	"mobile-security-android",
	"mobile-security-ios",
	"small-office-security",
	"scam-protection",
	"realcheck",
	"identity-theft-protection",
	"scamio",
	"reverse-phone-lookup",
	"digital-footprint-checker",
	"password-generator",
	"link-checker",
	"ai-skills-checker"
];
var PAGES_WITH_STATIC_RIBBON = [
	"consumer",
	"individual",
	"family",
	"small-business-security",
	"total-security",
	"premium-security",
	"ultimate-security",
	"vpn",
	"password-manager",
	"digital-identity-protection"
];
var SMALL_OFFICE_LINKED_LOCALES = ["en-us", "en-gb"];
var SOLUTIONS_PRODUCTS = [
	"ts_f",
	"ps_f",
	"us_f"
];
var SOLUTIONS_PRODUCTS_EN_US = [...SOLUTIONS_PRODUCTS, "us_pf"];
var DISCOUNT = "<span data-store-render data-store-context-discount=\"max-percentage\" class=\"await-loader\"></span>";
var MAIN_TEXT = {
	en: "Black Friday Limited Time deals!",
	de: "Zeitlich begrenzte Angebote zum Black Friday!",
	es: "¡Ofertas por tiempo limitado del Black Friday!",
	fr: "Offres à durée limitée pour le Black Friday&nbsp;!",
	it: "Offerte a tempo limitato del Black Friday!",
	nl: "Black Friday-Tijdelijke aanbieding!",
	pt: "Ofertas por tempo limitado da Black Friday!",
	ro: "Black Friday! Ofertă limitată!",
	sv: "Black Friday-Tidsbegränsade erbjudanden!",
	zh: "黑色星期五限時優惠！"
};
var SUB_TEXT = {
	en: `Save up to ${DISCOUNT}!`,
	de: `Sparen Sie bis zu ${DISCOUNT}!`,
	es: `¡Obtenga hasta un ${DISCOUNT} de descuento!`,
	fr: `Économisez jusqu’à ${DISCOUNT}&nbsp;!`,
	it: `Risparmia fino a un ${DISCOUNT}!`,
	nl: `Bespaar tot ${DISCOUNT}!`,
	pt: `Economize até ${DISCOUNT} de desconto!`,
	ro: `Economisește până la ${DISCOUNT}!`,
	sv: `Spara upp till ${DISCOUNT}!`,
	zh: `最高可省 ${DISCOUNT}!`
};
var isCampaignRunning = () => /* @__PURE__ */ new Date() < END;
/**
* @returns {{ linked: boolean } | null} the ribbon this page shows, or null when it shows none
*/
function getBlackFridayRibbon() {
	if (!MAIN_TEXT[page_default.language] || !isCampaignRunning()) return null;
	if (PAGES_WITH_LINKED_RIBBON.includes(page_default.name)) return { linked: page_default.name !== "small-office-security" || SMALL_OFFICE_LINKED_LOCALES.includes(page_default.locale) };
	return PAGES_WITH_STATIC_RIBBON.includes(page_default.name) ? { linked: false } : null;
}
var RIBBON_SECTION_CLASS = "bf-ribbon";
var getFolder = () => `${window.hlx.codeBasePath}/scripts/black-friday`;
var ribbonStyles;
var loadRibbonStyles = () => {
	ribbonStyles ??= Promise.all([loadCSS(`${window.hlx.codeBasePath}/blocks/news-bar/news-bar.css`), loadCSS(`${getFolder()}/ribbon.css`)]);
	return ribbonStyles;
};
var preloadNewsBar = () => {
	const link = document.createElement("link");
	link.rel = "modulepreload";
	link.href = `${window.hlx.codeBasePath}/blocks/news-bar/news-bar.js`;
	document.head.append(link);
	loadRibbonStyles();
};
/**
* Picks the news bar that becomes the ribbon: the one at the top of the page, if the page starts
* with one. Otherwise the page gets a new one at the top, in place of its blue top ribbon. Either
* way, the news bars further down the page stay as authored.
* @param {Element} main the decorated main element
*/
function addBlackFridayRibbon(main) {
	if (!getBlackFridayRibbon()) return;
	preloadNewsBar();
	const firstSection = main.querySelector(":scope > .section");
	if (firstSection?.classList.contains("news-bar-container")) {
		firstSection.classList.add(RIBBON_SECTION_CLASS);
		return;
	}
	if (firstSection?.classList.contains("top_blue")) firstSection.remove();
	const container = document.createElement("div");
	container.innerHTML = "<div><div class=\"news-bar\"><div><div></div></div></div></div>";
	decorateSections(container);
	decorateBlocks(container);
	const section = container.firstElementChild;
	section.classList.add("no-spacing", RIBBON_SECTION_CLASS);
	main.prepend(section);
}
/**
* @param {Element} block a news-bar block
* @returns {boolean} whether addBlackFridayRibbon picked it to become the ribbon
*/
var isBlackFridayRibbon = (block) => !!block.closest(`.section.${RIBBON_SECTION_CLASS}`);
/**
* Replaces the news bar's content with the Black Friday ribbon.
* @param {Element} block the news-bar block, one isBlackFridayRibbon picked
* @returns {Promise<void>} resolves once the ribbon's styles are loaded
*/
async function renderBlackFridayRibbon(block) {
	const { linked } = getBlackFridayRibbon();
	const textArea = `
    <div class="bf-text-area">
      <img class="bf-discount-logo" src="${`${getFolder()}/images/ribbon-tag.png`}" width="20" height="23" alt="">
      <p class="bf-text">
        <strong>${MAIN_TEXT[page_default.language]}</strong>
        <span class="bf-subtext">${SUB_TEXT[page_default.language]}</span>
      </p>
    </div>`;
	if (!linked) block.innerHTML = `<div>${textArea}</div>`;
	else {
		const options = (page_default.locale === "en-us" ? SOLUTIONS_PRODUCTS_EN_US : SOLUTIONS_PRODUCTS).map((id) => `<bd-product product-id="${id}"><bd-option devices="25" subscription="12"></bd-option></bd-product>`).join("");
		block.innerHTML = `
      <a class="bf-ribbon-link" href="/${page_default.locale}/consumer/">
        <bd-context class="bf-ribbon-context" topology-boundary>
          <div hidden>${options}</div>
          ${textArea}
        </bd-context>
      </a>`;
	}
	block.closest(".section")?.classList.add("bf-25");
	await loadRibbonStyles();
}
export { addBlackFridayRibbon, getBlackFridayRibbon, isBlackFridayRibbon, renderBlackFridayRibbon };
