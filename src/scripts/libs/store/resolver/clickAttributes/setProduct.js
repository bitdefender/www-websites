/**
 * @param {HTMLElement} button 
 * @param {import("../resolver").Context} context 
 */
export const resolve = (button, context) => {
    if (button.dataset.storeClickSetProduct === undefined) { return; }
    
    if (button.nodeName === "SELECT" && button.dataset.storeClickSetProduct === '') {
        button.addEventListener("change", (e) => {
            context.product = e.target.selectedOptions[0].dataset.storeProductId;
            context.option = e.target.selectedOptions[0].dataset.storeProductOption || context.option.getVariation();
        });
        return;
    }

    //TO BE REFACTORED
    switch (button.nodeName) {
        case "LABEL":
            const innerInput = button.querySelector("input");
            if (innerInput && innerInput.checked) {
                context.product = button.dataset.storeProductId;
                context.option = button.dataset.storeProductOption || context.option.getVariation();
            }
            break;
        default:
            if (button.checked) {
                context.product = button.dataset.storeProductId;
                context.option = button.dataset.storeProductOption || context.option.getVariation();
            }
            break;
    }

    button.addEventListener("click", () => {
        context.product = button.dataset.storeProductId;
        context.option = button.dataset.storeProductOption || context.option.getVariation();
    });
}