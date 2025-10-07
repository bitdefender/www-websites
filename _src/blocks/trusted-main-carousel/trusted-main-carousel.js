import Glide from '@glidejs/glide';
import { debounce } from '@repobit/dex-utils';
import { isView } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  block.classList.add('global-styles');
  const slides = [...block.children];
  const navItemsNames = slides.map((slideEl) => slideEl.children[0].firstElementChild.textContent);

  block.classList.add('default-content-wrapper');
  block.innerHTML = `
    <div class="carousel-container glide">
      <div class="navigation-wrapper">
        <div class="first-nav">
          ${navItemsNames.map((text, index) => `
            <div class="nav-item ${index === 0 ? 'active' : ''}" data-glide-dir="=${index}">
              <span class="text">${text}</span><span class="pill"></span>
            </div>`).join('')}
        </div>
        
        <div class="second-nav">
         <a href class="arrow disabled left-arrow">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,752) scale(0.1,-0.1)">
                <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
                l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
                109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
                -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
                896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
                16z"></path>
              </g>
            </svg>
          </a>
         <a href class="arrow right-arrow">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,752) scale(0.1,-0.1)">
                <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
                l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
                109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
                -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
                896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
                16z"></path>
              </g>
            </svg>
          </a>
        </div>
      </div>

      <div class="glide__track content-wrapper" data-glide-el="track">
        <ul class="glide__slides">
          ${slides.map((slide) => `<li class="glide__slide slide">${slide.innerHTML}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  const navItems = block.querySelectorAll('.nav-item');
  const glideEl = block.querySelector('.glide');
  const leftArrow = block.querySelector('.left-arrow');
  const rightArrow = block.querySelector('.right-arrow');

  // Initialize Glide config
  const glide = new Glide(glideEl, {
    type: 'slider',
    startAt: 0,
    perView: 1,
  });

  glide.on('run.after', () => {
    const { index } = glide;
    navItems.forEach((item, i) => item.classList.toggle('active', i === index));
  });

  navItems.forEach((item, index) => {
    item.addEventListener('click', () => glide.go(`=${index}`));
  });

  if (leftArrow) {
    leftArrow.addEventListener('click', (e) => {
      e.preventDefault();
      glide.go('<');
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', (e) => {
      e.preventDefault();
      glide.go('>');
    });
  }

  glide.mount();

  // Reinitialize autoplay on resize (desktop only)
  const updateAutoplay = debounce(() => {
    const isDesktop = isView('desktop');
    const newAutoplay = isDesktop ? 3000 : false;

    glide.update({ autoplay: newAutoplay });

    if (newAutoplay && glide.playing === false) {
      glide.play(newAutoplay);
    }
  }, 300);

  window.addEventListener('resize', updateAutoplay);

  // Pause/resume on hover
  glideEl.addEventListener('mouseenter', () => glide.pause());
  glideEl.addEventListener('mouseleave', () => {
    if (isView('desktop')) glide.play(3000);
  });

  window.dispatchEvent(new Event('resize'));
}
