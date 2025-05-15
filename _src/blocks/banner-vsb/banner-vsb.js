import { decorateButtons } from '../../scripts/lib-franklin.js';

async function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const [rte, videoUrlEl] = [...block.children];

  const videoUrl = videoUrlEl.textContent.trim();
  const videoFormat = videoUrl.split('.').pop();

  // const blockDataset = getDatasetFromSection(block);
  const { videoPlayerSettings, videoPlayerPoster } = block.closest('.section').dataset;

  function appendPreloadedVideo() {
    const linkVideoEl = document.createElement('link');
    const linkVideoPosterEl = document.createElement('link');
    linkVideoEl.rel = 'preload';
    linkVideoEl.as = 'video';
    linkVideoEl.href = videoUrl;
    linkVideoEl.type = `video/${videoFormat}`;

    linkVideoPosterEl.rel = 'preload';
    linkVideoPosterEl.as = 'image';
    linkVideoPosterEl.href = videoPlayerPoster;

    document.head.prepend(linkVideoPosterEl);
    document.head.prepend(linkVideoEl);
  }

  appendPreloadedVideo();

  const formattedVideoSettings = videoPlayerSettings
    .split(',')
    .map((item) => {
      let newStr = item;
      if (newStr.includes('=')) {
        newStr = item.replace('=', '="');
        newStr = `${newStr}"`;

        return newStr;
      }

      return newStr.trim();
    })
    .join(' ');

  block.innerHTML = `
    <div class="video-wrapper">
        <video ${formattedVideoSettings} poster="${videoPlayerPoster}">
          <source src="${videoUrl}" type="video/${videoFormat}">
        </video>
    </div>
    <div class="default-content-wrapper">
        ${rte.innerHTML}
    </div>
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  decorateButtons(block);

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}

export { decorate as default };
//# sourceMappingURL=banner-vsb.js.map
