/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (!button.dataset.storeClickSetOption) { return; }

    button.addEventListener("click", () => {
        context.option = button.dataset.storeClickSetOption;
    });
};

export { resolve };
//# sourceMappingURL=setOption.js.map
