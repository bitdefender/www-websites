import { getDatasetFromSection, openUrlForOs } from '../../scripts/utils/utils.js';

function decorate(block) {
  block.classList.add('default-content-wrapper');
  const blockDataset = getDatasetFromSection(block);

  const {
    linkandroid, linkios, linkmacos, linkwindows,
  } = blockDataset;

  const freeDownloadButton = block.querySelector('a');
  if (freeDownloadButton) {
    openUrlForOs(linkmacos, linkwindows, linkandroid, linkios, freeDownloadButton);
  }
}

export { decorate as default };
//# sourceMappingURL=platform-link.js.map
