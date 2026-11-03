// src/blocks/ribbon/ribbon.js
function decorate(block) {
	const [, backgroundEl] = block.children;
	if (backgroundEl) {
		const backgroundImgSrc = backgroundEl.querySelector("img")?.getAttribute("src");
		if (backgroundImgSrc) {
			block.closest(".section").style.backgroundImage = `url("${backgroundImgSrc}")`;
			backgroundEl.remove();
		}
	}
	block.innerHTML = block.innerHTML.replace(/0\s*%/g, "<span data-store-text-variable>{{=it.state.discount.percentage.max}}</span>");
}
export { decorate as default };
