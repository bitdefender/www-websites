import page_default from "../../scripts/page.js";
import { decorateIcons, loadBlocks } from "../../scripts/lib-franklin.js";
import { target } from "../../scripts/target.js";
import { decorateMain, detectModalButtons } from "../../scripts/scripts.js";
// src/blocks/personalisation-block/personalisation-block.js
function decorateHTMLOffer(aemHeaderHtml) {
	const newHtml = document.createElement("div");
	newHtml.innerHTML = aemHeaderHtml;
	decorateMain(newHtml);
	detectModalButtons(newHtml);
	return newHtml;
}
async function decorate(block) {
	const { mboxName, path } = block.closest(".section").dataset;
	block.innerHTML += `
    <div class="personalized-content"></div>
  `;
	block.classList.add("await-loader");
	const offer = await target.getOffers({ mboxNames: mboxName });
	if (offer?.offer) {
		const pageCall = await fetch(`/${page_default.locale}${path}${offer.offer}.plain.html`);
		let offerHtml;
		await loadBlocks(block.querySelector(".personalized-content"));
		if (pageCall.ok) {
			offerHtml = await pageCall.text();
			const decoratedOfferHtml = decorateHTMLOffer(offerHtml);
			block.querySelector(".personalized-content").innerHTML = decoratedOfferHtml.innerHTML;
			await loadBlocks(block.querySelector(".personalized-content"));
			decorateIcons(block);
		}
	}
}
export { decorate as default };
