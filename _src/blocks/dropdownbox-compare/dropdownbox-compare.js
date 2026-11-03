// src/blocks/dropdownbox-compare/dropdownbox-compare.js
function decorate(block) {
	block.querySelectorAll(".dropdownbox-compare-container .block > div > div:nth-child(1)").forEach((item) => {
		item.innerHTML = item.innerHTML.replace("[", "<span class=\"green-tag\">");
		item.innerHTML = item.innerHTML.replace("]", "</span>");
	});
	block.querySelectorAll(".dropdownbox-compare-container .block > div:first-child").forEach((tab) => {
		tab.parentNode.classList.remove("closed");
		tab.addEventListener("click", () => {
			tab.parentNode.classList.toggle("closed");
		});
	});
}
export { decorate as default };
