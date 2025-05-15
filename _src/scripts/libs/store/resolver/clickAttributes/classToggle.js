/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (!button.dataset.storeClickClassToggle) { return; }

    button.addEventListener("click", () => {
        context.clickAttributes.forEach(clickAttribute =>
            clickAttribute.dataset.storeClickClassToggle
            && clickAttribute.classList.remove(button.dataset.storeClickClassToggle)
        );
        button.classList.add(button.dataset.storeClickClassToggle);
    });
};

export { resolve };
//# sourceMappingURL=classToggle.js.map
