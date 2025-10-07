import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { openUrlForOs } from '../../scripts/utils/utils.js';

export default function decorate(block) {
  block.classList.add('global-styles');
  const {
    template,
    'open-url-macos': urlMacos,
    'open-url-windows': urlWindows,
    'open-url-android': urlAndroid,
    'open-url-ios': urlIos,
  } = readBlockConfig(block);

  if (template) {
    // make sure that the added class is a string
    // not a variable caught between '{' and '}'
    const variableRegex = /^\{([\s\S]*)\}$/;
    const variableMatch = template.match(variableRegex);
    const classTemplate = variableMatch ? variableMatch[1] : template;

    document.body.classList.add(classTemplate);
  }

  if (urlMacos || urlWindows || urlAndroid || urlIos) {
    openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
  }

  // Remove the Fragments Metadata table
  if (block.parentElement) {
    const parentWrapper = block.parentElement;
    if (parentWrapper) {
      parentWrapper.remove();
      parentWrapper.parentElement?.classList.remove('fragment-metadata-container');
    }
  }
}
