/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (button.dataset.storeClickToggleBundle === undefined) { return; }

    button.addEventListener("click", () => {
        if (context.bundle) {
            context.setBundle(null, null);
        } else {
            context.setBundle(button.dataset.storeBundleId, button.dataset.storeBundleOption);
        }
    });
};

export { resolve };
//# sourceMappingURL=toggleBundle.js.map
