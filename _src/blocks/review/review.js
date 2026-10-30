// src/blocks/review/review.js
var buildReview = (cell, variant) => {
	const paragraphs = [...cell.querySelectorAll("p")].filter((p) => !p.querySelector("[class*=\"icon-\"]") && p.textContent.trim());
	const [quoteP, dateP] = [paragraphs[0], paragraphs[paragraphs.length - 1]];
	const source = cell.querySelector("h1, h2, h3, h4, h5, h6");
	if (!quoteP) return null;
	const review = document.createElement("bd-review");
	review.setAttribute("variant", variant);
	const quote = document.createElement("span");
	quote.setAttribute("slot", "quote");
	quote.innerHTML = quoteP.innerHTML;
	review.append(quote);
	if (source) {
		const sourceEl = document.createElement("span");
		sourceEl.setAttribute("slot", "source");
		sourceEl.textContent = source.textContent.trim();
		review.append(sourceEl);
	}
	if (dateP && dateP !== quoteP) {
		const dateEl = document.createElement("span");
		dateEl.setAttribute("slot", "date");
		dateEl.textContent = dateP.textContent.trim();
		review.append(dateEl);
	}
	return review;
};
async function decorate(block) {
	try {
		await Promise.all([import("../../vendor/repobit/dex-system-design/review-grid.js"), import("../../vendor/repobit/dex-system-design/review.js")]);
	} catch (err) {
		console.warn("review: DSN import failed, continuing with native rendering", err);
	}
	const wrapper = block.closest(".section")?.querySelector(".default-content-wrapper");
	const heading = wrapper?.querySelector("h1, h2, h3, h4, h5, h6");
	const title = heading?.textContent.trim() || "";
	const variant = block.classList.contains("neutral") ? "neutral" : "tint";
	const reviewGrid = document.createElement("bd-review-grid");
	if (title) reviewGrid.setAttribute("title", title);
	[...block.querySelectorAll(":scope > div > div")].forEach((cell) => {
		const review = buildReview(cell, variant);
		if (review) reviewGrid.append(review);
	});
	block.replaceChildren(reviewGrid);
	if (title) {
		heading.remove();
		if (!wrapper.textContent.trim()) wrapper.remove();
	}
}
export { decorate as default };
