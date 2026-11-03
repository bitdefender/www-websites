// src/scripts/libs/store/resolver/clickAttributes/setOption.js
/**
* @param {HTMLElement} button 
* @param {import("../resolver").Context} context 
*/
var resolve = (button, context) => {
	if (!button.dataset.storeClickSetOption) return;
	button.addEventListener("click", () => {
		context.option = button.dataset.storeClickSetOption;
	});
};
export { resolve };
