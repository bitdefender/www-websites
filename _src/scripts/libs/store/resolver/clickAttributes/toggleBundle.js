// src/scripts/libs/store/resolver/clickAttributes/toggleBundle.js
/**
* @param {HTMLElement} button 
* @param {import("../resolver").Context} context 
*/
var resolve = (button, context) => {
	if (button.dataset.storeClickToggleBundle === void 0) return;
	button.addEventListener("click", () => {
		if (context.bundle) context.setBundle(null, null);
		else context.setBundle(button.dataset.storeBundleId, button.dataset.storeBundleOption);
	});
};
export { resolve };
