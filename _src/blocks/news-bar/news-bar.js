// src/blocks/news-bar/news-bar.js
function decorate(block, options) {
	const { solutions, hideDate } = block.closest(".section").dataset;
	if (options) block = block.querySelector(".block");
	if (solutions) block.closest(".section").classList.add("solutions");
	const blockParent = block.closest(".section");
	setTimeout(() => {
		const elementLink = block.querySelector("a");
		block.style.backgroundColor = "#E4F2FF";
		block.style.color = "#0045AD";
		if (elementLink && !blockParent.classList.contains("solutions")) elementLink.style.color = "#0045AD";
	}, 2e3);
	if (hideDate) {
		const currentDate = /* @__PURE__ */ new Date();
		if (new Date(hideDate) < currentDate) block.style.display = "none";
	}
	setTimeout(() => {
		window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
			bubbles: true,
			composed: true
		});
	}, 700);
}
export { decorate as default };
