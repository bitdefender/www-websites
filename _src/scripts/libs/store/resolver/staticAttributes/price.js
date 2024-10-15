import { Store } from "../../store.js";
import { writeValue } from "../resolver.js";

/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = (element, context) => {
    const option = context.option;

    if (!element.dataset.storePrice || !option) { return; }

    for (const atom of element.dataset.storePrice.split("||")) {
        switch (atom) {
            case "full":
                if (!option.getPrice("valueWithCurrency")) { continue; }
                writeValue(element, option.getPrice("valueWithCurrency"));
                return;
            case "discounted":
                if (!option.getDiscountedPrice("valueWithCurrency")) { continue; }
                writeValue(element, option.getDiscountedPrice("valueWithCurrency"));
                return;
            case "full-monthly":
                if (!option.getPrice("monthlyWithCurrency")) { continue; }
                writeValue(element, option.getPrice("monthlyWithCurrency"));
                return;
            case "discounted-monthly":
                if (!option.getDiscountedPrice("monthlyWithCurrency")) { continue; }
                writeValue(element, option.getDiscountedPrice("monthlyWithCurrency"));
                return;
            case "discounted-monthly-no-decimal":
                if (!option.getDiscountedPrice("monthlyWithCurrency").replace('.00', '')) { continue; }
                writeValue(element, option.getDiscountedPrice("monthlyWithCurrency").replace('.00', ''));
                return;
            case "smallest-monthly":
                let smallestPrice = Number.MAX_SAFE_INTEGER;
                for (const { product } of context.contexts) {
                    if (product.getSmallestPrice("monthly") < smallestPrice) {
                        smallestPrice = product.getSmallestPrice("monthly");
                    }
                }
                if (smallestPrice === Number.MAX_SAFE_INTEGER) {
                    smallestPrice = "";
                }
                writeValue(element, `${Store.placeSymbol(smallestPrice, option.getCurrency())}`);
                return;
        }
    }
}