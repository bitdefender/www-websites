import { resolve } from "./buyLink.js";
import { resolve as resolve$1 } from "./devices.js";
import { resolve as resolve$2 } from "./discount.js";
import { resolve as resolve$3 } from "./hide.js";
import { resolve as resolve$4 } from "./price.js";
import { resolve as resolve$5 } from "./subscription.js";
import { resolve as resolve$6 } from "./textVariable.js";
import { resolve as resolve$7 } from "./addClass.js";
import { resolve as resolve$8 } from "./trialLink.js";
// src/scripts/libs/store/resolver/staticAttributes/index.js
var staticAttributesResolvers = [
	resolve$3,
	resolve,
	resolve$1,
	resolve$2,
	resolve$4,
	resolve$5,
	resolve$6,
	resolve$7,
	resolve$8
];
var staticAttributes = {
	storePrice: "[data-store-price]",
	storeDiscount: "[data-store-discount]",
	storeHide: "[data-store-hide]",
	storeBuyLink: "[data-store-buy-link]",
	storeDevices: "[data-store-devices]",
	storeSubscription: "[data-store-subscription]",
	storeTextVariable: "[data-store-text-variable]",
	storeAddClass: "[data-store-add-class]",
	storeTrialLink: "[data-store-trial-link]"
};
export { staticAttributes, staticAttributesResolvers };
