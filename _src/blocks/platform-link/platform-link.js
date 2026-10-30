import { getDatasetFromSection, openUrlForOs } from "../../scripts/utils/utils.js";
// src/blocks/platform-link/platform-link.js
function decorate(block) {
	block.classList.add("default-content-wrapper");
	const { linkandroid, linkios, linkmacos, linkwindows } = getDatasetFromSection(block);
	const freeDownloadButton = block.querySelector("a");
	if (freeDownloadButton) openUrlForOs(linkmacos, linkwindows, linkandroid, linkios, freeDownloadButton);
}
export { decorate as default };
