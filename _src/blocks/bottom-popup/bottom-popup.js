// src/blocks/bottom-popup/bottom-popup.js
var STORAGE_KEY = "bottom-popup:dismissed";
function isMobile() {
	return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 768px)").matches;
}
function decorate(block) {
	if (!isMobile()) {
		block.remove();
		return;
	}
	if (localStorage.getItem(STORAGE_KEY) === "1") {
		block.remove();
		return;
	}
	const blockParent = block.closest(".section");
	block.classList.add("bottom-popup");
	const closeBtn = document.createElement("button");
	closeBtn.className = "bottom-popup__close";
	closeBtn.type = "button";
	closeBtn.setAttribute("aria-label", "Close");
	closeBtn.textContent = "×";
	block.prepend(closeBtn);
	closeBtn.addEventListener("click", () => {
		blockParent.classList.remove("is-visible");
		block.classList.remove("is-visible");
		localStorage.setItem(STORAGE_KEY, "1");
		setTimeout(() => block.remove(), 300);
	});
	requestAnimationFrame(() => {
		blockParent.classList.add("is-visible");
		block.classList.add("is-visible");
	});
}
export { decorate as default };
