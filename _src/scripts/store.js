import page_default from "./page.js";
import { getCampaignBasedOnLocale, getMetadata, getUrlPromotion } from "./utils/utils.js";
import { target } from "./target.js";
import getTrialLinkMap from "./trialLinkMap.js";
import { Store } from "../vendor/repobit/dex-store.js";
// src/scripts/store.js
var trialLinkMap = await getTrialLinkMap();
var store_default = new Store({
	campaign: async ({ campaign }) => (await target.configMbox)?.promotion || getUrlPromotion() || campaign || getMetadata("pid") || getCampaignBasedOnLocale(),
	locale: page_default.locale.includes("global") ? "en-us" : page_default.locale,
	provider: { name: "vlaicu" },
	trialLinks: trialLinkMap,
	transformers: {
		buyLink: async (param) => {
			const products = (await target.configMbox)?.products;
			const { buyLink, product, option } = param;
			const monthsToYears = option.subscription / (option.subscription === 1 ? 1 : 12);
			const targetOverride = products?.[product.alias]?.[`${option.devices}-${monthsToYears}`];
			const buyLinkURL = new URL(targetOverride?.buyLink || buyLink);
			buyLinkURL.searchParams.set("REF", product.campaign && product.campaign !== "ignore" ? `WEBSITES_${product.campaign}` : "N/A");
			targetOverride?.extraParameters?.forEach(({ key, value }) => {
				buyLinkURL.searchParams.set(key, value);
			});
			return target.appendVisitorIDsTo(buyLinkURL.href);
		},
		trialLink: async (param) => {
			const { buyLink, option, trialLink } = param;
			if (!trialLink) return;
			const optionBuyLink = new URL(buyLink);
			const coupon = page_default.getParamValue("coupon") || getMetadata("coupon") || option.coupon;
			const matchBuyLinkURL = new URL(trialLink);
			optionBuyLink.searchParams.forEach((value, key) => {
				if ([
					"LANG",
					"CURRENCY",
					"DCURRENCY",
					"COUPON"
				].includes(key)) matchBuyLinkURL.searchParams.set(key, value);
			});
			matchBuyLinkURL.searchParams.set("SRC", window.location.origin + window.location.pathname);
			if (coupon) matchBuyLinkURL.searchParams.set("COUPON", coupon);
			return target.appendVisitorIDsTo(matchBuyLinkURL.href);
		}
	}
});
export { store_default as default };
