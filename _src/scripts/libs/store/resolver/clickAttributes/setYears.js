// src/scripts/libs/store/resolver/clickAttributes/setYears.js
/**
* @param {HTMLElement} button 
* @param {import("../resolver").Context} context 
*/
var resolve = (button, context) => {
	if (button.dataset.storeClickSetYears === void 0) return;
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
