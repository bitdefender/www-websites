import { writeValue } from "../resolver.js";
// src/scripts/libs/store/resolver/staticAttributes/discount.js
/**
* @param {HTMLElement} element 
* @param {import("../resolver.js").Context} context 
*/
var resolve = (element, { option }) => {
	if (!element.dataset.storeDiscount || !option) return;
	switch (element.dataset.storeDiscount) {
		case "value":
			if (option.getDiscount("valueWithCurrency")) writeValue(element, option.getDiscount("valueWithCurrency"));
			break;
		case "percentage": if (option.getDiscount("percentageWithProcent")) writeValue(element, option.getDiscount("percentageWithProcent"));
	}
};
export { resolve };
