import { parseKey } from "../resolver.js";

/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = (element, { product, option }) => {
    if (!element.dataset.storeHide) { return; }

    const [condition, type] = element.dataset.storeHide.split(";");
    const [key, value] = condition ? condition.split("=") : [];
    const [, hideType] = type ? type.split("=") : [];

    /**
     * Default hide is display none
     * @param {HTMLElement} element 
     */
    const hide = (element) => {
        switch (hideType) {
            case "visibility":
                element.classList.add('global-visibility-hidden');
                break;
            case "opacity":
                element.classList.add('global-opacity-zero');
                break;
            default:
                element.classList.add('global-display-none');
                break;
        }
    };

    /**
     * Default show is display unset
     * @param {HTMLElement} element 
     */
    const show = (element) => {
        element.classList.remove('global-visibility-hidden', 'global-opacity-zero', 'global-display-none');
    };

    switch (key) {
        case "price":
            if (!option) { break; }
            if (value === "full" && option.getPrice("value")) {
                hide(element);
                break;
            }
            if (value === "discounted" && option.getDiscountedPrice("value")) {
                hide(element);
                break;
            }
            if (value === undefined && option.getDiscountedPrice("value") && option.getPrice("value")) {
                hide(element);
                break;
            }

            show(element);
            break;
        case "no-price":
            if (!option) { break; }
            if (value === "full" && !option.getPrice("value")) {
                hide(element);
                break;
            }
            if (value === "discounted" && !option.getDiscountedPrice("value")) {
                hide(element);
                break;
            }
            if (value === undefined && !option.getDiscountedPrice("value") && !option.getPrice("value")) {
                hide(element);
                break;
            }

            show(element);
            break;
        case "no-option":
            if (value === undefined && !option) {
                hide(element);
                break;
            }
            if (!product.getOption(...parseKey(value))) {
                hide(element);
                break;
            }

            show(element);
            break;
        case "if-true":
            if (value === "true") {
                hide(element);
            }
            break;
        case "if-false":
            if (value === "false") {
                hide(element);
            }
            break;
        case "if-product":
            if (value === product.getId()) {
                hide(element);
            } else {
                show(element);
            }
            break;
        case "if-not-product":
            if (value !== product.getId()) {
                hide(element);
            } else {
                show(element);
            }
            break;
        case "if-devices":
            if (Number(value) === option.getDevices()) {
                hide(element);
            } else {
                show(element);
            }
            break;
        case "if-not-devices":
            if (Number(value) !== option.getDevices()) {
                hide(element);
            } else {
                show(element);
            }
            break;
        case "if-years":
            if (Number(value) === option.getSubscription("years")) {
                hide(element);
            } else {
                show(element);
            }
            break;
        case "if-not-years":
            if (Number(value) !== option.getSubscription("years")) {
                hide(element);
            } else {
                show(element);
            }
            break;
    }
}