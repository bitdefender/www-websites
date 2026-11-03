// src/blocks/round-card/round-card.js
function decorate(block) {
	const innerWrapper = block.children[0];
	innerWrapper.classList = "inner-wrapper";
	const newAnchorEl = innerWrapper.children[0].lastElementChild.firstElementChild.cloneNode();
	newAnchorEl.classList = "";
	innerWrapper.prepend(newAnchorEl);
	const defaultWrapper = document.createElement("div");
	defaultWrapper.classList = "default-content-wrapper";
	defaultWrapper.append(innerWrapper);
	block.prepend(defaultWrapper);
}
export { decorate as default };
