import page_default from "./page.js";
import user_default from "./user.js";
import { sampleRUM } from "./lib-franklin.js";
import { Constants } from "./libs/constants.js";
import { GLOBAL_EVENTS, generatePageLoadStartedName, getMetadata, shouldABTestsBeDisabled } from "./utils/utils.js";
import Target from "../vendor/repobit/dex-target.js";
import { PageLoadStartedEvent } from "../vendor/repobit/dex-data-layer.js";
// src/scripts/target.js
var isPageInDraftsFolder = window.location.pathname.includes("/drafts/");
var target = new Target({ pageLoadStartedEvent: isPageInDraftsFolder ? void 0 : new PageLoadStartedEvent(page_default, {
	name: generatePageLoadStartedName(),
	geoRegion: await user_default.country,
	serverName: "hlx.live"
}) });
/**
* Convert a URL to a relative URL.
* @param url
* @returns {*|string}
*/
function getPlainPageUrl(url) {
	const { pathname, search, hash } = new URL(url, window.location.href);
	return `${pathname.endsWith("/") ? `${pathname}index.plain.html` : `${pathname}.plain.html`}${search}${hash}`;
}
/**
* Replace the current page with the challenger page.
* @param url The challenger page url.
* @returns {Promise<boolean>}
*/
async function navigateToChallengerPage(url) {
	const plainPath = getPlainPageUrl(url);
	const resp = await fetch(plainPath);
	if (!resp.ok) throw new Error(`Failed to fetch challenger page: ${resp.status}`);
	const mainElement = document.querySelector("main");
	if (!mainElement) throw new Error("Main element not found");
	mainElement.innerHTML = await resp.text();
}
/**
* @param {string} experimentUrl
* @param {string} experimentId
* @return {Promise<{
*  experimentId: string;
*  experimentVariant: string;
* }|null>}
*/
async function runTargetExperiment(experimentUrl, experimentId) {
	if (!experimentUrl) return null;
	try {
		await navigateToChallengerPage(experimentUrl);
		sampleRUM("target-experiment", {
			source: `target:${experimentId}`,
			target: experimentUrl
		});
		return {
			experimentId,
			experimentVariant: experimentUrl
		};
	} catch (e) {
		return null;
	}
}
function appendAdobeMcLinks(selector) {
	try {
		const wrapperSelector = typeof selector === "string" ? document.querySelector(selector) : selector;
		const isFooterSelector = Boolean(wrapperSelector.querySelector(".footer-2025__content"));
		const pageUrlHostname = window.location.hostname === "localhost" ? "www.bitdefender.com" : window.location.hostname;
		wrapperSelector.querySelectorAll("a[href*=\".bitdefender.\"]").forEach(async (link) => {
			if (link.hostname !== pageUrlHostname && !Constants.DOMAINS_WITHOUT_ADOBE_MC.includes(link.hostname)) {
				if (isFooterSelector) {
					link.addEventListener("click", async (e) => {
						e.preventDefault();
						window.location.assign(await target.appendVisitorIDsTo(link.href));
					});
					return;
				}
				link.href = (await target.appendVisitorIDsTo(link.href)).replace(/MCAID%3D.*%7CMCORGID/, "MCAID%3D%7CMCORGID");
			}
		});
	} catch (e) {
		console.error(e);
	}
}
/**
* get experiment details from Target
* @returns {Promise<{
*  experimentId: string;
*  experimentVariant: string;
* } | null>}
*/
var getTargetExperimentDetails = async () => {
	/**
	* @type {{
	*  experimentId: string;
	*  experimentVariant: string;
	* }|null}
	*/
	let targetExperimentDetails = null;
	async function loadCSS(href) {
		return new Promise((resolve, reject) => {
			if (!document.querySelector(`head > link[href="${href}"]`)) {
				const link = document.createElement("link");
				link.rel = "stylesheet";
				link.href = href;
				link.onload = resolve;
				link.onerror = reject;
				document.head.append(link);
			} else resolve();
		});
	}
	const targetExperimentLocation = getMetadata("target-experiment-location");
	const targetExperimentId = getMetadata("target-experiment");
	if (targetExperimentLocation && targetExperimentId && !shouldABTestsBeDisabled()) {
		const { url, template, metadata } = await target.getOffers({ mboxNames: targetExperimentLocation }) || {};
		if (template) {
			loadCSS(`${window.hlx.codeBasePath}/scripts/template-factories/${template}.css`);
			document.body.classList.add(template);
		}
		if (metadata) Object.entries(metadata).forEach(([name, value]) => {
			const headMetaElement = document.head.querySelector(`meta[name="${name}"]`);
			if (headMetaElement) headMetaElement.content = value;
		});
		targetExperimentDetails = await runTargetExperiment(url, targetExperimentId);
	}
	return targetExperimentDetails;
};
function adobeMcAppendVisitorId(selector) {
	if (window.ADOBE_MC_EVENT_LOADED) appendAdobeMcLinks(selector);
	else document.addEventListener(GLOBAL_EVENTS.ADOBE_MC_LOADED, () => {
		appendAdobeMcLinks(selector);
	});
}
window.target = target;
export { adobeMcAppendVisitorId, appendAdobeMcLinks, getTargetExperimentDetails, runTargetExperiment, target };
