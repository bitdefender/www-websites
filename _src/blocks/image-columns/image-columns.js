import { matchHeights } from '../../scripts/utils/utils.js';
import { initAnimations, bdHeroStates } from '../../scripts/vendor/parallax/icons-parallax.js';

export default function decorate(block) {
  const parentSection = block.closest('.section');
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  block.parentElement.classList.add('default-content-wrapper');

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, idx) => {
      if (parentSection.classList.contains('animated') && idx === 1) {
        const tables = col.querySelectorAll('table');

        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-hero-step', '0');
        wrapper.className = 'bd-hero-item bd-hero-item-1 bd-hero-glass bd-hero-glass--state bd-hero-glass--active';

        // Insert wrapper before the first table
        tables[0].parentNode.insertBefore(wrapper, tables[0]);
        tables[0].classList.add('bd-hero-item-0');
        tables[1].classList.add('bd-hero-item-same');
        tables[1].querySelector('td').classList.add('bd-hero-float--products');
        tables[1].querySelectorAll('td p').forEach((item) => {
          item.classList.add('bd-hero-tag');
        });

        // Move first 2 tables into wrapper
        wrapper.appendChild(tables[0]);
        wrapper.appendChild(tables[1]);
        tables[2].setAttribute('data-hero-step', '1');
        tables[2].querySelector('td').classList.add('bd-hero-float--products');
        tables[2].classList.add('bd-hero-item', 'bd-hero-item-2', 'bd-hero-item-same', 'bd-hero-glass', 'bd-hero-glass--state');
        tables[2].querySelectorAll('td p').forEach((item) => {
          item.classList.add('bd-hero-tag');
        });

        bdHeroStates(col).init();
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

      if ((parentSection.classList.contains('columnvideo') && idx === 1) || col.innerText.includes('.mp4')) {
        if (col.innerText.includes('.mp4')) col.classList.add('mp4video');
        const colVideo = parentSection.getAttribute('data-video') || col.innerText;
        col.innerHTML = `<video autoplay loop muted playsinline>
          <source src="/_src/images/${colVideo}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
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
