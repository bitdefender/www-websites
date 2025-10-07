import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default function decorate(block) {
  block.classList.add('global-styles');
  const innerWrapper = block.children[0];
  innerWrapper.classList = 'inner-wrapper';

  const defaultWrapper = document.createElement('div');
  defaultWrapper.classList = 'default-content-wrapper';

  const carWrapper = document.createElement('div');
  carWrapper.classList = 'card-wrapper';

  carWrapper.append(innerWrapper);

  const pictureWrapper = document.createElement('div');
  pictureWrapper.classList = 'picture-wrapper';

  const blockDataset = getDatasetFromSection(block);
  pictureWrapper.append(createOptimizedPicture(blockDataset.bgImage, 'title'));

  defaultWrapper.prepend(carWrapper);
  defaultWrapper.append(pictureWrapper);

  block.prepend(defaultWrapper);
}
