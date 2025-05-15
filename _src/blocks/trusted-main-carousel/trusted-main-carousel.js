import '../../node_modules/@repobit/dex-utils/dist/src/index.js';
import { isView } from '../../scripts/utils/utils.js';
import { debounce } from '../../node_modules/@repobit/dex-utils/dist/src/utils.js';

async function decorate(block) {
  const slides = [...block.children];
  const AUTOMATIC_SLIDING = {
    viewport: 'desktop',
    slideDelay: 3 * 1000,
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

  const contentWrapper = block.querySelector('.content-wrapper');

  const navItems = block.querySelectorAll('.nav-item');
  const slideItems = block.querySelectorAll('.slide');
  const leftArrow = block.querySelector('.left-arrow');
  const rightArrow = block.querySelector('.right-arrow');
  function selectNavItem(itemPosition) {
    navItems.forEach((item) => item.classList.remove('active'));
    navItems[itemPosition].classList.add('active');
  }

  function selectSlideItem(itemPosition) {
    slideItems.forEach((item) => item.classList.remove('active'));
    slideItems[itemPosition].classList.add('active');
  }

  function slideToSection(itemPosition) {
    block.classList.add('scrolling');

    const transformValue = -100 * (itemPosition);
    const offset = 50 * itemPosition;
    contentWrapper.style.transform = `translateX(calc(${transformValue}% - ${offset}px ))`;
    setTimeout(() => {
      block.classList.remove('scrolling');
    }, 200);
  }

  function selectStep(itemPosition) {
    state.currentStep = itemPosition;
    selectNavItem(itemPosition);
    selectSlideItem(itemPosition);
    slideToSection(itemPosition);
  }

  function endAutomaticSliding(interval) {
    clearInterval(interval || state.currentInterval);
  }

  function beginAutomaticSliding() {

    endAutomaticSliding();

    if (state.carouselIsFocused || !isView(AUTOMATIC_SLIDING.viewport)) {
      return;
    }

    const interval = setInterval(() => {
      const isLastStep = state.currentStep === navItems.length - 1;
      const nextStepToSelect = isLastStep ? 0 : (state.currentStep + 1);
      selectStep(nextStepToSelect);

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

    navItems.forEach((navEl, itemPosition) => {
      navEl.addEventListener('click', () => {
        selectStep(itemPosition);
      });
    });

    leftArrow.addEventListener('click', (e) => {
      e.preventDefault();

      const isFirstStep = state.currentStep === 0;
      if (isFirstStep) {
        return;
      }

      selectStep(state.currentStep - 1);
    });

    rightArrow.addEventListener('click', (e) => {
      e.preventDefault();

      const isLastStep = state.currentStep === navItems.length - 1;
      if (isLastStep) {
        return;
      }

      selectStep(state.currentStep + 1);
    });
  }

  addEventListeners();

  beginAutomaticSliding();
  window.addEventListener('resize', debounce(beginAutomaticSliding, 250));
}

export { decorate as default };
//# sourceMappingURL=trusted-main-carousel.js.map
