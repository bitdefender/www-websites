import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [richTextEl, imageOnTopEl] = [...block.children];

  const blockDataset = getDatasetFromSection(block);
  const { desktopPicture, mobilePicture } = blockDataset;

  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.setAttribute('src', `${mobilePicture}?format=webply&optimize=medium`);
  img.setAttribute('alt', 'picture');

  const desktopSource = document.createElement('source');
  desktopSource.setAttribute('media', '(min-width: 768px)');
  desktopSource.setAttribute('type', 'image/webp');
  desktopSource.setAttribute('srcset', `${desktopPicture}?format=webply&optimize=medium`);

  picture.prepend(img);
  picture.prepend(desktopSource);

  block.innerHTML = `
    <div class="wrapper default-content-wrapper">
        <div class="rte">${richTextEl.children[0].innerHTML}</div>

        <div class="imgs-wrapper">
            <div class="main-img img-container">
                ${picture.outerHTML}
            </div>

            ${imageOnTopEl?.querySelector('picture') ?? ''}
            <div class="second-img img-container">
                ${imageOnTopEl?.querySelector('picture')?.innerHTML ?? ''}
            </div>
        </div>
    </div>
  `;
}
