import { debounce } from '@repobit/dex-utils';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { isView } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const [titleEl, ...slides] = [...block.children];
  let currentSlideIndex = 0;

  const countItems = slides.length;
  let countClass = `has-${countItems}-items`;
  if (countItems > 3 && countItems < 7) {
    countClass = 'has-3-7-items';
  }
  if (countItems > 7) {
    countClass = 'has-more-items';
  }
  block.classList.add(countClass);

  const isTestimonials = block.closest('.section').classList.contains('testimonials');

  const carouselItemStyle = {
    margin: 20,
  };

  function isFirstIndex() {
    return currentSlideIndex === 0;
  }

  function isLastIndex() {
    return currentSlideIndex === slides.length - 3;
  }

  function scrollCarousel(offset, carousel) {
    const carouselItem = block.querySelector('.carousel-item');
    carousel.style.transform = `translateX(${-1 * offset * (carouselItem.offsetWidth + carouselItemStyle.margin)}px)`;
  }

  function getCarousel() {
    return block.querySelector('.carousel');
  }

  function updateDisabledArrow() {
    const leftArrowEl = block.querySelector('.left-arrow');
    const rightArrowEl = block.querySelector('.right-arrow');

    leftArrowEl.classList.remove('disabled');
    rightArrowEl.classList.remove('disabled');

    if (isLastIndex()) {
      block.querySelector('.right-arrow').classList.add('disabled');
      return;
    }

    if (isFirstIndex()) {
      block.querySelector('.left-arrow').classList.add('disabled');
    }
  }

  function leftArrowHandler(e) {
    e.preventDefault();
    if (isFirstIndex()) {
      return;
    }
    currentSlideIndex -= 1;
    scrollCarousel(currentSlideIndex, getCarousel());
    updateDisabledArrow(currentSlideIndex);
  }

  function rightArrowHandler(e) {
    e.preventDefault();
    if (isLastIndex()) {
      return;
    }
    currentSlideIndex += 1;
    scrollCarousel(currentSlideIndex, getCarousel());
    updateDisabledArrow(currentSlideIndex);
  }

  function renderArrows() {
    block.classList.remove('scrollable');

    if (isView('desktop')) {
      const cardsNotFullyVisible = window.innerWidth > 767;
      return cardsNotFullyVisible ? `
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
    ` : '';
    }

    block.classList.add('scrollable');
    return '';
  }

  function render() {
    block.classList.add('default-content-wrapper');

    block.innerHTML = `
    <div class="carousel-header">
      <div class="title">${titleEl.children[0].innerHTML}</div>
      <div class="arrows d-flex">${renderArrows()}</div>
    </div>

    <div class="carousel-container">
        <div class="carousel">
          ${slides.map((slide) => `
            <div class="carousel-item">
                ${isTestimonials ? `
                  <div class="img-container">
                    ${slide.children[0].children[0].innerHTML}
                  </div>
                ` : slide.children[0].children[0].innerHTML}

                <p class="title">
                    ${slide.children[0].children[1].textContent}
                </p>

                ${isTestimonials ? `
                  <div class="subtitle-secondary">
                    ${slide.children[0].children[2].innerHTML}
                  </div>

                  <div class="subtitle">
                    ${slide.children[0].children[3].innerHTML}
                  </div>
                ` : `
                   <div class="subtitle">
                      ${slide.children[0].children[2].innerHTML}
                   </div>
                `}
            </div>
          `).join('')}
        </div>
    </div>
  `;

    decorateIcons(block);

    const leftArrowEl = block.querySelector('.left-arrow');
    const rightArrowEl = block.querySelector('.right-arrow');

    if (leftArrowEl && rightArrowEl) {
      leftArrowEl.removeEventListener('click', leftArrowHandler);
      rightArrowEl.removeEventListener('click', rightArrowHandler);

      leftArrowEl.addEventListener('click', leftArrowHandler);
      rightArrowEl.addEventListener('click', rightArrowHandler);
    }
  }

  render();

  window.addEventListener('resize', debounce(render, 250));
}
