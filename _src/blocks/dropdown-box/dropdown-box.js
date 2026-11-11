// src/blocks/dropdown-box/dropdown-box.js
function decorate(block) {
	const parentSelector = block.closest(".section");
	const { type, topBackgroundColor, topTextColor } = parentSelector.dataset;
	const noDropdownLogic = type === "slider-no-load-bar";
	if (noDropdownLogic) parentSelector.classList.add("no-dropdown-logic");
	block.querySelectorAll(".dropdown-box-container .block > div > div:nth-child(1)").forEach((item) => {
		item.innerHTML = item.innerHTML.replace("[", "<span class=\"greenTag\">");
		item.innerHTML = item.innerHTML.replace("]", "</span>");
	});
	block.classList.remove("inactive");
	const tab = block.firstElementChild;
	if (tab && !noDropdownLogic) tab.addEventListener("click", () => {
		block.classList.toggle("inactive");
	});
	if (block.children.length >= 2) {
		const childrenNr = block.children[1].children.length;
		block.classList.add(`has${childrenNr}divs`);
		if (topBackgroundColor) block.querySelector("div:nth-child(1) > div > div").style.backgroundColor = topBackgroundColor;
		if (topTextColor) block.querySelector("div:nth-child(1) > div").style.color = topTextColor;
	}
	const titleCell = block.children[0]?.children[0];
	const contentCell = block.children[1]?.children[0];
	if (type === "slider" && titleCell && contentCell) {
		block.closest(".dropdown-box-container").classList.add("container", "dropdown-slider", "has-load-bar");
		const sliderBox = document.createElement("div");
		sliderBox.className = "slider-box";
		const infoTextEl = block.children[0].children[0];
		const infoTextEl2 = block.children[1].children[0];
		sliderBox.innerHTML = `
          <div class="row">
            <div class="col-12 col-md-5 title">
              <div class="loading-bar"></div>
              ${infoTextEl.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${infoTextEl2.innerHTML}</div>
          </div>
      `;
		block.closest(".dropdown-box-container").appendChild(sliderBox);
	}
	if (type === "slider-no-load-bar" && titleCell && contentCell) {
		block.closest(".dropdown-box-container").classList.add("container", "dropdown-slider", "no-load-bar");
		const sliderBox = document.createElement("div");
		sliderBox.className = "slider-box";
		const infoTextEl = block.children[0].children[0];
		const infoTextEl2 = block.children[1].children[0];
		sliderBox.innerHTML = `
          <div class="row">
            <div class="col-12 col-md-5 title">
              ${infoTextEl.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${infoTextEl2.innerHTML}</div>
          </div>
      `;
		block.closest(".dropdown-box-container").appendChild(sliderBox);
	}
}
export { decorate as default };
