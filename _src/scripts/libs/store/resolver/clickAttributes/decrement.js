/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (!button.dataset.storeClickDecrement) { return; }

    button.addEventListener("click", () => {
        if (button.dataset.storeClickDecrement === "devices"
            && context.devices > (Number(button.dataset.storeMin) || Number.MIN_SAFE_INTEGER)) {
            context.devices -= 1;
        }
        if (button.dataset.storeClickDecrement === "years"
            && context.years > (Number(button.dataset.storeMin) || Number.MIN_SAFE_INTEGER)) {
            context.years -= 1;
        }
    });
};

export { resolve };
//# sourceMappingURL=decrement.js.map
