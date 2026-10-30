// src/scripts/trialLinkMap.js
var SUBSCRIPTION_MONTHS = 12;
var DEFAULT_CAMPAIGN = "default";
var getTrials = async () => {
	const res = await fetch("https://www.bitdefender.com/common/triallinks.json");
	if (!res.ok) return [];
	const { data = [] } = await res.json();
	return data;
};
var getLocale = () => {
	const locale = (window.location.pathname.split("/")[1]?.split("-")[1] || "").toLowerCase();
	return !locale || locale === "us" ? "COM" : locale.toUpperCase();
};
var trialMapCache = null;
/**
* Builds and caches a trial link lookup map from the remote trial links sheet.
*
* Structure:
* {
*   [productId]: {
*     [campaign]: {
*       [`${devices}-${subscriptionMonths}`]: buyLink
*     }
*   }
* }
*
* Campaign is always 'default' (no campaign field in the source data).
* Subscription months is always 12 (annual).
* When multiple trial durations exist for the same product/devices, the first entry wins.
*
* @returns {Promise<Partial<Record<string, Record<string, Record<string, string>>>>>}
*/
async function getTrialLinkMap() {
	if (trialMapCache) return trialMapCache;
	const trials = await getTrials();
	if (!trials?.length) {
		trialMapCache = {};
		return trialMapCache;
	}
	const locale = getLocale();
	const map = trials.reduce((acc, { product, devices, buy_link: buyLink, locale: rowLocale, duration }) => {
		if (!product || !devices || !buyLink) return acc;
		if (rowLocale?.toUpperCase() !== locale) return acc;
		const variantKey = `${devices}-${SUBSCRIPTION_MONTHS}`;
		acc[product] ??= {};
		acc[product][DEFAULT_CAMPAIGN] ??= {};
		acc[product][DEFAULT_CAMPAIGN][variantKey] ??= {};
		acc[product][DEFAULT_CAMPAIGN][variantKey][duration] ??= buyLink;
		return acc;
	}, {});
	trialMapCache = map;
	return map;
}
export { getTrialLinkMap as default };
