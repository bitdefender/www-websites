import { Page } from "../vendor/repobit/dex-utils.js";
// src/scripts/page.js
/**
* @returns {`${string}-${string}`} page locale
*/
var getPageLocale = () => {
	const match = window.location.pathname.match(/\/([a-z]{2}-(?:[a-z]{2}|global))\//i);
	const defaultLocale = "en-us";
	if (match) return match[1];
	return defaultLocale;
};
/**
* @returns {'dev' | 'stage' | 'prod'}
*/
var getEnvironment = () => {
	const { hostname } = window.location;
	if ([
		"aem.page",
		"aem.live",
		"stage.bitdefender"
	].some((stageHostname) => hostname.includes(stageHostname))) return "stage";
	if (hostname.includes("www.bitdefender")) return "prod";
	return "dev";
};
/**
* @returns {string} page name
*/
var getPageName = () => window.location.pathname.split("/").filter(Boolean).pop();
var page_default = new Page(getPageLocale(), getPageName(), getEnvironment());
export { page_default as default };
