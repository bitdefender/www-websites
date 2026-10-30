import { readBlockConfig } from "../../scripts/lib-franklin.js";
import { openUrlForOs } from "../../scripts/utils/utils.js";
// src/blocks/fragment-metadata/fragment-metadata.js
function decorate(block) {
	const { template, "open-url-macos": urlMacos, "open-url-windows": urlWindows, "open-url-android": urlAndroid, "open-url-ios": urlIos } = readBlockConfig(block);
	if (template) {
		const variableMatch = template.match(/^\{([\s\S]*)\}$/);
		const classTemplate = variableMatch ? variableMatch[1] : template;
		document.body.classList.add(classTemplate);
	}
	if (urlMacos || urlWindows || urlAndroid || urlIos) openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
	if (block.parentElement) {
		const parentWrapper = block.parentElement;
		if (parentWrapper) {
			parentWrapper.remove();
			parentWrapper.parentElement?.classList.remove("fragment-metadata-container");
		}
	}
}
export { decorate as default };
