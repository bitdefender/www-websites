/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = async (element, { product, option }) => {
    if (element.dataset.storeBuyLink === undefined || !option) { return; }

    const attributes = element.dataset.storeBuyLink === '' || element.dataset.storeBuyLink === 'empty'
        ? []
        : element.dataset.storeBuyLink.split(",");

    const button = element.nodeName === "A"
        ? element
        : element.querySelector("a");

    if (!button) { return; }

    button.href = await option.getStoreUrl(attributes);
    button.setAttribute("data-product", option.getId());
    button.setAttribute("data-buy-price", option.getDiscountedPrice("value") || option.getPrice("value"));
    button.setAttribute("data-old-price", option.getPrice("value"));
    button.setAttribute("data-currency", option.getCurrency());
    button.setAttribute("data-variation", `${option.getDevices()}u-${option.getSubscription("years")}y`);
}