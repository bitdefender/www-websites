import { embedYoutube } from "../../scripts/utils/utils.js";
import YouTubeTracker from "../../scripts/utils/youtube-tracker.js";
// src/blocks/scuderia-ferrari-section/scuderia-ferrari-section.js
function replacePlaceholderWithVideo(block, videoUrl) {
	const placeholderDiv = [...block.querySelectorAll("div")].find((div) => div.textContent.trim() === "{video}");
	if (!placeholderDiv) return;
	const videoContainer = document.createElement("div");
	videoContainer.className = "video-container";
	const url = new URL(videoUrl);
	videoContainer.innerHTML = embedYoutube(url, false);
	placeholderDiv.replaceWith(videoContainer);
}
function decorate(block) {
	const { video, buttonImage } = block.closest(".section").dataset;
	replacePlaceholderWithVideo(block, video);
	const videoId = block.querySelector("iframe")?.getAttribute("id");
	if (video) {
		const url = new URL(video);
		new YouTubeTracker(block, video, url, videoId).initialize();
	}
	if (buttonImage) {
		const buttonImageEl = document.createElement("img");
		buttonImageEl.setAttribute("src", buttonImage);
		block.querySelector("table tr").insertAdjacentElement("afterbegin", buttonImageEl);
	}
}
export { decorate as default };
