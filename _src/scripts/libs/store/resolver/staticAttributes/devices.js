import { writeValue } from "../resolver.js";
// src/scripts/libs/store/resolver/staticAttributes/devices.js
/**
* @param {HTMLElement} element 
* @param {import("../resolver.js").Context} context 
*/
var resolve = (element, { product, option, years }) => {
	if (element.dataset.storeDevices === void 0 || !option) return;
	if (element.nodeName === "SELECT") {
		element.innerHTML = "";
		for (const device of product.getDevices(years)) {
			const selectOption = new Option(device === 1 ? `${device} ${element.dataset.storeDevicesTextSingular}` : `${device} ${element.dataset.storeDevicesTextPlural}`, device, device === option.getDevices(), device === option.getDevices());
			element.add(selectOption);
		}
		return;
	}
	if (option.getDevices()) writeValue(element, option.getDevices());
};
export { resolve };
