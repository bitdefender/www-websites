/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
export const resolve = (button, context) => {
    if (!button.dataset.storeClickIncrement) { return; }

    button.addEventListener("click", () => {
        if (button.dataset.storeClickIncrement === "devices"
            && context.devices < (Number(button.dataset.storeMax) || Number.MAX_SAFE_INTEGER)) {
            context.devices += 1;
        }
        if (button.dataset.storeClickIncrement === "years"
            && context.years < (Number(button.dataset.storeMax) || Number.MAX_SAFE_INTEGER)) {
            context.years += 1;
        }
    });
}