/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
const resolve = (button, context) => {
    if (button.dataset.storeClickSetYears === undefined) { return; }

    if (button.nodeName === "SELECT") {
        button.addEventListener("change", (e) => {
            context.years = e.target.value;
        });
        return;
    }

    button.addEventListener("click", () => {
        context.years = button.dataset.storeClickSetYears;
    });
};

export { resolve };
//# sourceMappingURL=setYears.js.map
