import { debounce } from '@repobit/dex-utils';
import { isView } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const slides = [...block.children];
  const AUTOMATIC_SLIDING = {
    enabled: true,
    viewport: 'desktop',
    slideDelay: 3000,
  };

  const state = {
    currentStep: 0,
    carouselIsFocused: false,
    currentInterval: null,
  };

  const navItemsNames = slides.map((slideEl) => slideEl.children[0].firstElementChild.textContent);

  block.classList.add('default-content-wrapper');
  block.innerHTML = `
    <div class="navigation-wrapper">
        <div class="first-nav">
          ${navItemsNames.map((navItemName, index) => `<div class="nav-item ${index === 0 ? 'active' : ''}">${navItemName}</div>`).join('')}
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
    <div class="content-wrapper">
      ${slides.map((slide, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}">
            ${slide.innerHTML}
        </div>
        `).join('')}
    </div>
  `;

  const navItems = block.querySelectorAll('.nav-item');
  const slideItems = block.querySelectorAll('.slide');
  const contentWrapper = block.querySelector('.content-wrapper');
  const leftArrow = block.querySelector('.left-arrow');
  const rightArrow = block.querySelector('.right-arrow');

  function selectStep(index) {
    state.currentStep = index;

    navItems.forEach((item, i) => item.classList.toggle('active', i === index));
    slideItems.forEach((slide, i) => slide.classList.toggle('active', i === index));

    // Direct horizontal scroll, not using scrollIntoView to avoid vertical shift
    const scrollX = slideItems[index].offsetLeft;
    contentWrapper.scrollTo({ left: scrollX, behavior: 'smooth' });
  }

  function endAutomaticSliding(interval) {
    clearInterval(interval || state.currentInterval);
  }

  function beginAutomaticSliding() {
    if (!AUTOMATIC_SLIDING.enabled) return;

    endAutomaticSliding();

    if (state.carouselIsFocused || !isView(AUTOMATIC_SLIDING.viewport)) return;

    const interval = setInterval(() => {
      const nextIndex = (state.currentStep + 1) % slideItems.length;
      selectStep(nextIndex);

      if (!isView(AUTOMATIC_SLIDING.viewport) || state.carouselIsFocused) {
        endAutomaticSliding(interval);
      }
    }, AUTOMATIC_SLIDING.slideDelay);

    state.currentInterval = interval;
  }

  function addEventListeners() {
    block.addEventListener('mouseenter', () => {
      state.carouselIsFocused = true;
      endAutomaticSliding();
    });

    block.addEventListener('mouseleave', () => {
      state.carouselIsFocused = false;
      beginAutomaticSliding();
    });

    navItems.forEach((item, index) => {
      item.addEventListener('click', () => selectStep(index));
    });

    leftArrow.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.currentStep > 0) selectStep(state.currentStep - 1);
    });

    rightArrow.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.currentStep < slideItems.length - 1) selectStep(state.currentStep + 1);
    });

    contentWrapper.addEventListener('scroll', debounce(() => {
      let closestIndex = 0;
      let minDistance = Infinity;

      slideItems.forEach((slide, i) => {
        const dist = Math.abs(slide.getBoundingClientRect().left);
        if (dist < minDistance) {
          closestIndex = i;
          minDistance = dist;
        }
      });

      if (closestIndex !== state.currentStep) {
        selectStep(closestIndex);
      }
    }, 100));
  }

  addEventListeners();
  beginAutomaticSliding();
  window.addEventListener('resize', debounce(beginAutomaticSliding, 250));
}
