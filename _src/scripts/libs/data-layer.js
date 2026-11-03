import page_default from "../page.js";
import user_default from "../user.js";
import { generatePageLoadStartedName, getExperimentDetails, getProductFinding } from "../utils/utils.js";
import { getTargetExperimentDetails } from "../target.js";
import "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, ButtonClickEvent, PageErrorEvent, PageLoadStartedEvent, ProductLoadedEvent, UserDetectedEvent } from "../../vendor/repobit/dex-data-layer.js";
// src/scripts/libs/data-layer.js
var FranklinProductsLoadedEvent = class extends ProductLoadedEvent {
	getOptionInfo(option) {
		return {
			ID: option.getAvangateId(),
			name: option.getName(),
			devices: option.getId() === "psm" ? 10 : option.getDevices(),
			subscription: option.getSubscription("months"),
			version: option.getSubscription("months") === 1 ? "monthly" : "yearly",
			basePrice: option.getPrice("value"),
			discountValue: option.getDiscount("value"),
			discountRate: option.getDiscount("percentage"),
			currency: option.getCurrency(),
			grossPrice: option.getDiscountedPrice("value") || option.getPrice("value"),
			discountCoupon: option.getCampaignType() ? `${option.getCampaignType()}|${option.getPromotion()}` : option.getPromotion() || ""
		};
	}
};
/**
* Products sold per member, keyed by product alias (as authored, e.g. soho_new).
* The store option holds the number of members, but tracking expects the number of devices.
*/
var DEVICES_PER_MEMBER_MAPPING = {
	soho_new: 2,
	soho_new_m: 2
};
/**
* Product loaded event for the dex-store-elements options
*/
var StoreProductLoadedEvent = class extends ProductLoadedEvent {
	getOptionInfo(option) {
		const optionInfo = super.getOptionInfo(option);
		const devicesPerMember = DEVICES_PER_MEMBER_MAPPING[option.getProduct().getAlias()];
		if (devicesPerMember) optionInfo.devices = option.getDevices() * devicesPerMember;
		return optionInfo;
	}
};
/**
* Page Error Handling
*/
var pageErrorHandling = () => {
	if (window.errorCode === "404") AdobeDataLayerService.push(new PageErrorEvent());
};
/**
* Add click events to the data layer after page redirect
*/
var checkClickEventAfterRedirect = () => {
	if (localStorage.getItem("clickEvent") !== null) {
		const clickEvent = JSON.parse(localStorage.getItem("clickEvent"));
		if (clickEvent?.clickEvent) AdobeDataLayerService.push(new ButtonClickEvent(clickEvent.clickEvent, { productId: clickEvent.productId }));
		localStorage.removeItem("clickEvent");
	}
};
/**
* Add form events to the data layer after page redirect
*/
var checkFormCompletedEventAfterRedirect = () => {
	const storedData = localStorage.getItem("formCompletedEvent");
	if (storedData) {
		const formCompletedEvent = JSON.parse(storedData);
		if (formCompletedEvent?.event && formCompletedEvent?.user) AdobeDataLayerService.push({
			event: formCompletedEvent.event,
			user: {
				form: formCompletedEvent.user.form,
				formFields: formCompletedEvent.user.formFields
			}
		});
		localStorage.removeItem("formCompletedEvent");
	}
};
/**
* Add entry for free products
*/
var getFreeProductsEvents = () => {
	if (page_default.name === "free-antivirus") AdobeDataLayerService.push(new ProductLoadedEvent({ ID: "8430" }, "info"));
};
/**
* push the pageLoadStartedEvent
* and send data to CDP
*/
var resolvePageLoadStartedEvent = async () => {
	AdobeDataLayerService.push(new PageLoadStartedEvent(page_default, {
		experimentDetails: await getTargetExperimentDetails() ?? getExperimentDetails(),
		geoRegion: await user_default.country,
		name: generatePageLoadStartedName(),
		serverName: "hlx.live"
	}, {
		internalPromotionID: page_default.getParamValue("icid") || "",
		trackingID: page_default.getParamValue("cid") || ""
	}));
};
/**
* push the userDetectedEvent to the Data Layer
*/
var resolveUserDetectedEvent = async () => {
	AdobeDataLayerService.push(new UserDetectedEvent(page_default, {
		ID: await user_default.fingerprint,
		productFinding: getProductFinding()
	}));
};
/**
* for file download links, push a special buttonClick event
*/
var handleFileDownloadedEvents = () => {
	document.querySelectorAll("[href*=\".pdf\"], [href*=\".docx\"], [href*=\".xlsx\"]").forEach((fileLink) => {
		const hrefPathname = new URL(fileLink).pathname;
		const filename = hrefPathname.substring(hrefPathname.lastIndexOf("/") + 1);
		fileLink.addEventListener("click", () => {
			AdobeDataLayerService.push(new ButtonClickEvent("file downloaded", { asset: filename }));
		});
	});
};
/**
* Resolve the data layer for widget pages
*/
var resolveNonProductsDataLayerforWidgets = async () => {
	await resolvePageLoadStartedEvent();
	pageErrorHandling();
	checkClickEventAfterRedirect();
	checkFormCompletedEventAfterRedirect();
	getFreeProductsEvents();
};
/**
* Resolve the data layer
*/
var resolveNonProductsDataLayer = async () => {
	await resolvePageLoadStartedEvent();
	pageErrorHandling();
	await resolveUserDetectedEvent();
	checkClickEventAfterRedirect();
	checkFormCompletedEventAfterRedirect();
	getFreeProductsEvents();
};
export { FranklinProductsLoadedEvent, StoreProductLoadedEvent, handleFileDownloadedEvents, resolveNonProductsDataLayer, resolveNonProductsDataLayerforWidgets };
