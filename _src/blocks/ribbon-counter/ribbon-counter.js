// src/blocks/ribbon-counter/ribbon-counter.js
function decorate(block) {
	const parentSection = block.closest(".section");
	const { background_color, text_color, counter_ends_on, counter_headings, padding_top, padding_bottom, margin_top, margin_bottom } = parentSection.dataset;
	const [, backgroundEl] = block.children;
	if (background_color) parentSection.style.backgroundColor = background_color;
	if (text_color) block.querySelector("*").style.color = text_color;
	if (padding_top) block.style.paddingTop = `${padding_top}rem`;
	if (padding_bottom) block.style.paddingBottom = `${padding_bottom}rem`;
	if (margin_top) parentSection.style.marginTop = `${margin_top}rem`;
	if (margin_bottom) parentSection.style.marginBottom = `${margin_bottom}rem`;
	if (backgroundEl) {
		const backgroundImgSrc = backgroundEl.querySelector("img")?.getAttribute("src");
		if (backgroundImgSrc) {
			parentSection.style.backgroundImage = `url("${backgroundImgSrc}")`;
			backgroundEl.remove();
		}
	}
	if (counter_ends_on) {
		const [daysLabel, hoursLabel, minsLabel, secLabel] = counter_headings ? counter_headings.split(",").map((v) => v.trim()) : [
			"d",
			"h",
			"m",
			"s"
		];
		block.innerHTML = block.innerHTML.replace("[counter]", `
      <strong class="ribbonCounter"></strong>
    `);
		const countdownElement = block.querySelector(".ribbonCounter");
		const targetDate = new Date(counter_ends_on).getTime();
		let interval;
		const updateCountdown = () => {
			const now = (/* @__PURE__ */ new Date()).getTime();
			const distance = targetDate - now;
			if (distance < 0) {
				parentSection.remove();
				clearInterval(interval);
				return;
			}
			const days = Math.floor(distance / 864e5);
			const hours = Math.floor(distance % 864e5 / 36e5);
			const minutes = Math.floor(distance % 36e5 / 6e4);
			const seconds = Math.floor(distance % 6e4 / 1e3);
			countdownElement.innerHTML = `${days}${daysLabel} : ${hours}${hoursLabel} : ${minutes}${minsLabel} : ${seconds}${secLabel}`;
		};
		interval = setInterval(updateCountdown, 1e3);
		updateCountdown();
	}
}
export { decorate as default };
