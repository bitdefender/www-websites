import { writeValue } from "../resolver.js";
// src/scripts/libs/store/resolver/staticAttributes/subscription.js
/**
* @param {HTMLElement} element 
* @param {import("../resolver.js").Context} context 
*/
var resolve = (element, { product, option, devices }) => {
	if (element.dataset.storeSubscription === void 0 || !option) return;
	if (element.nodeName === "SELECT") {
		element.innerHTML = "";
		for (const subscription of product.getSubscriptions("years", devices)) {
			const selectOption = new Option(subscription === 1 ? `${subscription} ${element.dataset.storeSubscriptionTextSingular}` : `${subscription} ${element.dataset.storeSubscriptionTextPlural}`, subscription, subscription === option.getSubscription("years"), subscription === option.getSubscription("years"));
			element.add(selectOption);
		}
		return;
	}
	switch (element.dataset.storeSubscription) {
		case "years":
			if (option.getSubscription("years")) writeValue(element, option.getSubscription("years"));
			break;
		case "months": if (option.getSubscription("months")) writeValue(element, option.getSubscription("months"));
	}
};
export { resolve };
