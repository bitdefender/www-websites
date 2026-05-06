import { matchHeights } from '../../scripts/utils/utils.js';
import { initAnimations } from '../../scripts/vendor/parallax/icons-parallax.js';

export default function decorate(block) {
  const parentSection = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  block.parentElement.classList.add('default-content-wrapper');

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, idx) => {
      if ((parentSection.classList.contains('columnvideo') && idx === 1) || col.innerText.includes('.mp4')) {
        if (col.innerText.includes('.mp4')) col.classList.add('mp4video');
        const colVideo = parentSection.getAttribute('data-video') || col.innerText;
        if (parentSection.getAttribute('data-video')) {
          col.innerHTML = `<video autoplay loop muted playsinline>
            <source src="/_src/images/${colVideo}" type="video/mp4">
            Your browser does not support the video tag.
          </video>`;
        }

        if (parentSection.getAttribute('data-animation')) {
          const allImages = col.innerText.split(',').map((s) => s.trim());

          col.innerHTML = '';
          col.classList.add('parallax-card');

          col.innerHTML = allImages.map((icon, k) => `
            <div class="parallax-icon parallax-pos-${k + 1}" data-about-id="${k}">
              <img class="parallax-icon-40" src="/common/icons/${icon}.svg" alt="">
            </div>
          `).join('');

          initAnimations(col);
        }
      }
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('img-container');
          imgContainer.append(picWrapper.children[0]);
          picWrapper.append(imgContainer);
          // picture is only content in column
          picWrapper.classList.add('image-columns-img-col');
        }
      } else {
        col.classList.add('image-columns-txt-col');
      }
    });
  });
  matchHeights(block, '.image-columns.quotes > div > div');
}
