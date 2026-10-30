import { decorateIcons } from "../../scripts/lib-franklin.js";
import { createTag } from "../../scripts/utils/utils.js";
// src/blocks/quote/quote.js
function createQuote(item) {
	const quote = Array.from(item.querySelectorAll("p")).find((paragraph) => {
		const strong = paragraph.querySelector("strong");
		const starsLine = /^[*]+$/.test(paragraph.textContent.trim());
		return !strong && !starsLine && paragraph.textContent.trim() !== "";
	});
	const author = item.querySelector("p > strong");
	const stars = item.querySelector("p > em");
	if (!quote) return null;
	const paragraphText = stars.textContent;
	let asteriskCount = 0;
	for (let i = 0; i < paragraphText.length; i++) if (paragraphText[i] === "*") asteriskCount += 1;
	const starsContainer = createTag("div", { class: "quote-stars-container" });
	for (let i = 0; i < asteriskCount; i++) {
		const star = createTag("span", { class: "star" });
		starsContainer.append(star);
	}
	return createTag("div", { class: "quote-container" }, `<div class="quote-img">
        <span class="icon icon-dark-blue-quote"/>
    </div>
    <div class="quote-content">
        <p class="stars">${starsContainer?.innerHTML}</p>
        <p class="description">${quote?.innerHTML}</p>
        ${author ? `<p class="author">${author?.innerHTML}</p>` : "<p class=\"author\"></p>"}
    </div>`);
}
async function decorate(block) {
	const quoteWrap = createTag("div", { class: "quote-wrap" });
	[...block.children].forEach((item) => {
		const quote = createQuote(item);
		if (quote) quoteWrap.append(quote);
	});
	block.replaceChildren(quoteWrap);
	decorateIcons(block);
}
export { decorate as default };
