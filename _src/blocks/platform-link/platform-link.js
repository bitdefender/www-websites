import { getDatasetFromSection, openUrlForOs } from '../../scripts/utils/utils.js';

export default function decorate(block) {
  block.classList.add('global-styles');
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
