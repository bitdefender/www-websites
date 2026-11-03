// src/blocks/tabs-component/tabs-component.js
function decorate(block, options) {
	if (options) {
		block = block.querySelector(".block");
		block.closest(".section").classList.add("we-container");
	}
	block.closest(".section").dataset;
	const [title, subtitle, tabsTitle, ...sections] = block.children;
	title.classList.add("title-class");
	subtitle.classList.add("subtitle-class");
	tabsTitle.classList.add("tabs-container");
	const container = block.querySelector(".tabs-container");
	if (container) {
		const divs = container.querySelectorAll(":scope > div");
		const buttonsContainer = document.createElement("div");
		buttonsContainer.className = "buttons-container";
		divs.forEach((div, index) => {
			const button = document.createElement("button");
			if (index === 0) button.classList.add("selected");
			const tabImage = div.querySelector("img");
			const cardImage = sections[index]?.querySelector("img");
			const tabAlt = tabImage?.getAttribute("alt")?.trim();
			const cardAlt = cardImage?.getAttribute("alt")?.trim();
			if (tabImage && !tabAlt && cardAlt) tabImage.setAttribute("alt", cardAlt);
			button.append(...div.childNodes);
			button.addEventListener("click", () => {
				block.querySelectorAll(".tabs-container button").forEach((btn) => btn.classList.remove("selected"));
				button.classList.add("selected");
				block.querySelectorAll(".card-container").forEach((card) => card.classList.add("hide"));
				sections[index].classList.remove("hide");
			});
			buttonsContainer.appendChild(button);
		});
		container.replaceChildren(buttonsContainer);
	} else console.error("Container not found");
	sections.forEach((element, index) => {
		element.classList.add("card-container");
		if (index === 0) element.classList.add("show");
		if (index !== 0) element.classList.add("hide");
		const photoDiv = element.querySelector("div:nth-child(1)");
		const textDiv = element.querySelector("div:nth-child(2)");
		photoDiv.classList.add("left");
		textDiv.classList.add("right");
	});
	window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
		bubbles: true,
		composed: true
	});
}
export { decorate as default };
