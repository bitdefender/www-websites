/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (button.dataset.storeClickSetDevices === undefined) { return; }

    if (button.nodeName === "INPUT") {
        button.addEventListener("change", () => {
            const [min, max] = context.product.getMinMaxDeviceNumbers();
            const value = Number(button.value);

            if (context.devices > (Number(button.dataset.storeMin) || Number.MIN_SAFE_INTEGER)
                || context.devices < (Number(button.dataset.storeMax) || Number.MAX_SAFE_INTEGER)) {
                context.devices = value > max ? max : value < min ? min : value;
            }
        });
        return;
    }

    if (button.nodeName === "SELECT") {
        button.addEventListener("change", (e) => {
            context.devices = e.target.value;
        });
        return;
    }

    button.addEventListener("click", () => {
        context.devices = button.dataset.storeClickSetDevices;
    });
};

export { resolve };
//# sourceMappingURL=setDevices.js.map
