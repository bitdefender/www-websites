import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { openUrlForOs } from '../../scripts/scripts.js';

export default function decorate(block) {
  const {
    template,
    'open-url-macos': urlMacos,
    'open-url-windows': urlWindows,
    'open-url-android': urlAndroid,
    'open-url-ios': urlIos,
  } = readBlockConfig(block);

  if (template) {
    document.body.classList.add(template);
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
