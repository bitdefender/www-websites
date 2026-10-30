// src/blocks/terms/terms.js
async function decorate(block, options) {
	block.closest(".section").id = "tos";
	if (options) {
		block = block.querySelector(".block");
		block.closest(".terms-wrapper").classList.add("we-container");
	}
	window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
		bubbles: true,
		composed: true
	});
}
export { decorate as default };
