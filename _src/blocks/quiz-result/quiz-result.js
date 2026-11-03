import { getDatasetFromSection } from "../../scripts/utils/utils.js";
// src/blocks/quiz-result/quiz-result.js
async function decorate(block) {
	const { socialTitlePost } = getDatasetFromSection(block);
	block.classList.add("default-content-wrapper");
	block.children[0].children[0].classList.add("results-wrapper");
	block.children[0].children[0].lastElementChild.classList.add("social-wrapper");
	const resultPageUrl = window.location.href;
	[...block.querySelector(".social-wrapper").querySelectorAll("a")].forEach((anchor) => {
		anchor.target = "_blank";
		anchor.rel = "noopener noreferrer";
		if (anchor.href.includes("twitter")) {
			const twitterBaseUrl = "https://twitter.com/intent/post?";
			const twitterText = `text=${encodeURIComponent(socialTitlePost)}`;
			const twitterUrl = `&url=${encodeURIComponent(resultPageUrl)}`;
			anchor.href = twitterBaseUrl + twitterText + twitterUrl;
		}
		if (anchor.href.includes("facebook")) anchor.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultPageUrl)}`;
	});
}
export { decorate as default };
