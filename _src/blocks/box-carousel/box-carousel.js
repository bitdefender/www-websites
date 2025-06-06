import { debounce } from '@repobit/dex-utils';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { isView } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [titleEl, ...slides] = [...block.children];
  const isTestimonials = block.closest('.section').classList.contains('testimonials');
  let currentIndex = 0;

  const itemMargin = 20;

  function calculateVisibleCount(carousel, item) {
    if (!item) return 1;
    const totalWidth = carousel.offsetWidth;
    const itemFullWidth = item.offsetWidth + itemMargin;
    return Math.floor(totalWidth / itemFullWidth);
  }

  function getCarousel() {
    return block.querySelector('.carousel');
  }

  function scrollToIndex(index) {
    const carousel = getCarousel();
    const item = carousel.querySelector('.carousel-item');
    if (!item) return;

    const itemFullWidth = item.offsetWidth + itemMargin;
    carousel.scrollTo({
      left: index * itemFullWidth,
      behavior: 'smooth',
    });

    // Update nav dots
    const navDots = block.querySelectorAll('.navigation-item');
    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update arrow disabled state
    const visibleCount = calculateVisibleCount(carousel, item);
    const leftArrow = block.querySelector('.left-arrow');
    const rightArrow = block.querySelector('.right-arrow');

    leftArrow?.classList.toggle('disabled', index <= 0);
    rightArrow?.classList.toggle('disabled', index >= slides.length - visibleCount);
  }

  function renderArrows() {
    if (isView('desktop')) {
      return `
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
    `;
    }
    block.classList.add('scrollable');
    return '';
  }

  function render() {
    block.classList.add('default-content-wrapper');
    block.innerHTML = `
      <div class="carousel-header">
        <div class="title">${titleEl?.children[0]?.innerHTML ?? ''}</div>
        <div class="arrows d-flex">${renderArrows()}</div>
      </div>

      <div class="carousel-container">
        <div class="carousel">
          ${slides.map((slide) => `
            <div class="carousel-item">
              ${isTestimonials ? `
                <div class="img-container">
                  ${slide.children[0]?.children[0]?.innerHTML}
                </div>
              ` : slide.children[0]?.children[0]?.innerHTML}

              <p class="title">
                ${slide.children[0]?.children[1]?.textContent}
              </p>

              ${isTestimonials ? `
                <div class="subtitle-secondary">
                  ${slide.children[0]?.children[2]?.innerHTML}
                </div>
                <div class="subtitle">
                  ${slide.children[0]?.children[3]?.innerHTML}
                </div>
              ` : `
                <div class="subtitle">
                  ${slide.children[0]?.children[2]?.innerHTML}
                </div>
              `}
            </div>
          `).join('')}
        </div>

        <div class="carousel-nav">
          ${slides.map((_, i) => `<div class="navigation-item ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`).join('')}
        </div>
      </div>
    `;

    decorateIcons(block);

    const carousel = getCarousel();
    const firstItem = carousel.querySelector('.carousel-item');

    // ARROWS
    const leftArrow = block.querySelector('.left-arrow');
    const rightArrow = block.querySelector('.right-arrow');

    leftArrow?.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = Math.max(0, currentIndex - 1);
      scrollToIndex(currentIndex);
    });

    rightArrow?.addEventListener('click', (e) => {
      e.preventDefault();
      const visibleCount = calculateVisibleCount(carousel, firstItem);
      currentIndex = Math.min(slides.length - visibleCount, currentIndex + 1);
      scrollToIndex(currentIndex);
    });

    // DOTS
    const navDots = block.querySelectorAll('.navigation-item');
    navDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        currentIndex = Number(dot.dataset.index);
        scrollToIndex(currentIndex);
      });
    });

    scrollToIndex(currentIndex);
  }

  render();
  window.addEventListener('resize', debounce(() => {
    render();
    scrollToIndex(currentIndex);
  }, 250));
}
