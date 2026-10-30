import page_default from "../../scripts/page.js";
import user_default from "../../scripts/user.js";
import { decorateIcons, getMetadata, loadBlocks } from "../../scripts/lib-franklin.js";
import { Constants } from "../../scripts/libs/constants.js";
import { target } from "../../scripts/target.js";
import { decorateMain, detectModalButtons } from "../../scripts/scripts.js";
import { AdobeDataLayerService, WindowLoadStartedEvent } from "../../vendor/repobit/dex-data-layer.js";
import { Store } from "../../vendor/repobit/dex-store.js";
// src/blocks/mbox-canvas/mbox-canvas.js
function decorateHTMLOffer(aemHeaderHtml) {
	const newHtml = document.createElement("div");
	newHtml.innerHTML = aemHeaderHtml;
	decorateMain(newHtml);
	detectModalButtons(newHtml);
	return newHtml;
}
var serviceIdSegmentCache = /* @__PURE__ */ new Map();
async function extractServiceId(serviceId) {
	if (!serviceId) return null;
	if (serviceIdSegmentCache.has(serviceId)) return serviceIdSegmentCache.get(serviceId);
	const endpoint = `https://www.bitdefender.com/cdp/splash/${encodeURIComponent(serviceId)}`;
	try {
		const response = await fetch(endpoint);
		if (!response.ok) {
			console.error(`Failed to fetch segments for service id ${serviceId}: ${response.status}`);
			return null;
		}
		const payload = await response.json();
		const segmentIds = Array.isArray(payload?.data) ? payload.data.map((entry) => entry?.segment_id).filter((segment) => typeof segment === "string" && segment.trim().length > 0) : [];
		if (segmentIds.length === 0) return null;
		const segmentParam = segmentIds.join(",");
		serviceIdSegmentCache.set(serviceId, segmentParam);
		return segmentParam;
	} catch (error) {
		console.error(`Failed to fetch segments for service id ${serviceId}`, error);
	}
	return null;
}
async function createOfferParameters() {
	const parameters = {};
	const urlParams = new URLSearchParams(window.location.search);
	const feature = urlParams.get("feature");
	const language = urlParams.get("lang");
	const serviceId = urlParams.get("service_id");
	const autoRenewal = urlParams.get("auto_renewal");
	const bundleId = urlParams.get("bundle_id");
	const reason = urlParams.get("reason");
	const remainingDays = urlParams.get("remaining_days");
	const renewalDate = urlParams.get("renewal-date");
	if (feature) parameters.feature = feature.replaceAll("_", "-");
	if (language) parameters.lang = language.toLocaleLowerCase();
	if (serviceId) {
		const serviceIdSegment = await extractServiceId(serviceId);
		if (serviceIdSegment) parameters.segment = serviceIdSegment;
	}
	if (autoRenewal) parameters.auto_renewal = autoRenewal;
	if (bundleId) parameters.bundle_id = bundleId;
	if (reason) parameters.reason = reason;
	if (remainingDays) parameters.remaining_days = remainingDays;
	if (renewalDate) parameters.renewal_date = renewalDate;
	return parameters;
}
function createOfferProfileParameters(parameters) {
	const profileParameters = {};
	Object.entries(parameters).forEach(([key, value]) => {
		profileParameters[`profile.${key}`] = value;
	});
	return profileParameters;
}
/**
* Updates the PageLoadStartedEvent with dynamic content from the offer
* and pushes it to the AdobeDataLayerService.
*
* @param {Object} offer - The offer object containing dynamic content.
* @returns {Promise<void>} - A promise that resolves when the event is updated and pushed.
*/
async function updatePageLoadStartedEvent(offer) {
	let result = null;
	const match = (offer.offer || offer).match(/\/([^/]+)\.plain\.html$/);
	result = match ? match[1] : null;
	if (!result) return;
	const productName = page_default.getParamValue("trialSku") || "avfree";
	const pageType = !result.toLowerCase().includes("webview-table") ? "plugin" : "offer";
	const flow = result.toLowerCase().includes("splash") ? "splash" : "webview";
	const [locale, country] = (page_default.getParamValue("lang") || "en-US").split("-");
	let trackingID = getMetadata("cid");
	trackingID = trackingID.replace("<flow>", flow);
	trackingID = trackingID.replace("<locale>", locale);
	trackingID = trackingID.replace("<country>", country);
	trackingID = trackingID.replace("<asset name>", result);
	trackingID = trackingID.replace("<product>", productName);
	const newObject = new WindowLoadStartedEvent((pageLoadStartedInfo) => {
		pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace("<dynamic-content>", result);
		pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace("<product>", productName);
		pageLoadStartedInfo.name = pageLoadStartedInfo.name.replace("<page-type>", pageType);
		pageLoadStartedInfo.subSection = pageLoadStartedInfo.subSection.replace("<product>", productName);
		pageLoadStartedInfo.subSubSection = pageLoadStartedInfo.subSubSection.replace("<page-type>", pageType);
		pageLoadStartedInfo.language = page_default.getParamValue("lang") || "en-us";
		return pageLoadStartedInfo;
	}, { trackingID });
	Object.entries(newObject.page.info).forEach(([key, value]) => {
		if (value === "<dynamic-content>") newObject.page.info[key] = result;
	});
	AdobeDataLayerService.push(newObject);
}
async function decorate(block) {
	const { mboxName } = block.closest(".section").dataset;
	const parameters = await createOfferParameters();
	block.innerHTML += `
    <div class="canvas-content">

    </div>
  `;
	block.classList.add("loader-circle");
	const configMbox = await target.getOffers({
		mboxNames: "config-mbox",
		parameters,
		profileParameters: createOfferProfileParameters(parameters)
	});
	const canvasStore = new Store({
		campaign: async () => configMbox?.promotion,
		transformers: { buyLink: async (param) => {
			const { buyLink, product } = param;
			const buyLinkURL = new URL(buyLink);
			buyLinkURL.searchParams.set("REF", product.campaign && product.campaign !== "ignore" ? `WEBSITES_${product.campaign}` : "N/A");
			return target.appendVisitorIDsTo(buyLinkURL.href);
		} },
		locale: configMbox?.useGeoIpPricing ? (await user_default.locale)?.toLowerCase() : page_default.locale.toLowerCase(),
		provider: { name: "vlaicu" }
	});
	const canvasRoot = document.createElement("bd-context");
	canvasRoot.classList.add("store-context");
	block.parentElement.appendChild(canvasRoot);
	canvasRoot.appendChild(block);
	canvasRoot.store = canvasStore;
	await canvasRoot.updateComplete;
	const offer = await target.getOffers({
		mboxNames: mboxName,
		parameters,
		profileParameters: createOfferProfileParameters(parameters)
	});
	const offerLink = `${Constants.BASE_URL_FOR_PROD}${offer.offer}`.toLowerCase();
	const pageCall = await fetch(offerLink);
	let offerHtml;
	await loadBlocks(block.querySelector(".canvas-content"));
	if (pageCall.ok) {
		offerHtml = await pageCall.text();
		updatePageLoadStartedEvent(offer);
	} else {
		const language = new URLSearchParams(window.location.search).get("lang")?.toLowerCase() || "en-us";
		let defaultOffer = await fetch(`/${language}/consumer/webview/webview-table.plain.html`);
		if (defaultOffer.ok) {
			offerHtml = await defaultOffer.text();
			updatePageLoadStartedEvent(`/${language}/consumer/webview/webview-table.plain.html`);
		} else {
			defaultOffer = await fetch("/en-us/consumer/webview/webview-table.plain.html");
			offerHtml = await defaultOffer.text();
			updatePageLoadStartedEvent("/en-us/consumer/webview/webview-table.plain.html");
		}
	}
	const decoratedOfferHtml = decorateHTMLOffer(offerHtml);
	decoratedOfferHtml.querySelectorAll("a[href*=\"#buylink\"]").forEach((link) => {
		link.setAttribute("target", "_blank");
	});
	block.querySelector(".canvas-content").innerHTML = decoratedOfferHtml.innerHTML;
	await loadBlocks(block.querySelector(".canvas-content"));
	decorateIcons(block.querySelector(".canvas-content"));
}
export { createOfferParameters, createOfferProfileParameters, decorate as default };
