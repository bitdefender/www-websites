import { writeValue } from "../resolver.js";

/**
 * @param {HTMLElement} element 
 * @param {import("../resolver.js").Context} context 
 */
export const resolve = (element, { product, option, years }) => {
    if (element.dataset.storeDevices === undefined || !option) { return; }

    if (element.nodeName === "SELECT") {
        element.innerHTML = "";
        for (const device of product.getDevices(years)) {
            const selectOption = new Option(
                device === 1
                    ? `${device} ${element.dataset.storeDevicesTextSingular}`
                    : `${device} ${element.dataset.storeDevicesTextPlural}`,
                device,
                device === option.getDevices(),
                device === option.getDevices()
            )
            element.add(selectOption);
        }
        return;
    }

    if (option.getDevices()) {
        writeValue(element, option.getDevices());
    }
}