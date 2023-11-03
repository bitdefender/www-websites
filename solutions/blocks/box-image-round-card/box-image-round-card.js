import * as ceva from '../round-card/round-card.js';
import {createOptimizedPicture} from '../../scripts/lib-franklin.js';
import {getDatasetFromSection} from '../../scripts/utils/utils.js';
export default function decorate(block) {
  console.log('box-image-round-card', block);
  const innerWrapper = block.children[0];
  innerWrapper.classList = 'inner-wrapper';

  // const iconElement = innerWrapper.children[0].children[0].children[0];
  // innerWrapper.children[0].children[0].remove();
  // innerWrapper.children[0].prepend(iconElement);

  // const originalAnchorEl = innerWrapper.children[0].lastElementChild.firstElementChild;
  // const newAnchorEl = originalAnchorEl.cloneNode();
  // newAnchorEl.classList = '';
  // innerWrapper.prepend(newAnchorEl);

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
