import { writeValue } from '../resolver.js';

/**
 * @param {HTMLElement} element 
 * @param {import("../resolver.js").Context} context 
 */
const resolve = (element, { option }) => {
    if (!element.dataset.storeDiscount || !option) { return; }

    switch (element.dataset.storeDiscount) {
        case "value":
            if (option.getDiscount("valueWithCurrency")) {
                writeValue(element, option.getDiscount("valueWithCurrency"));
            }
            break;
        case "percentage":
            if (option.getDiscount("percentageWithProcent")) {
                writeValue(element, option.getDiscount("percentageWithProcent"));
            }
            break;
    }
};

export { resolve };
//# sourceMappingURL=discount.js.map
