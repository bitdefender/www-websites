import { debounce } from '@repobit/dex-utils';
import { getDatasetFromSection, isView } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const defaultBackgroundColor = '#004299';
  const SLIDE_SIZE_ENUM = {
    MOBILE: 85 + 20 * 2,
    TABLET_UP: 85 + 20 * 2,
  };

  const SPEED_ANIMATION = 0.6;

  const [title, ...initialSlideList] = [...block.children];

  function getCurrentViewportSlideSize() {
    return isView('mobile') ? SLIDE_SIZE_ENUM.MOBILE : SLIDE_SIZE_ENUM.TABLET_UP;
  }
  function calculateSlideListBasedOnScreenWidth() {
    const result = {
      duplicatedSlides: null,
      slidesToShift: null,
    };

    const currentViewportSlideSize = getCurrentViewportSlideSize();
    const clientWidth = window.innerWidth;
    const spaceToFillMore = clientWidth - initialSlideList.length * currentViewportSlideSize; // ok
    if (spaceToFillMore < 0) {
      result.duplicatedSlides = initialSlideList.concat(initialSlideList);
      result.slidesToShift = initialSlideList.length;

      return result;
    }
    // fill space
    const fullWidthSlidesToFill = parseInt(spaceToFillMore / currentViewportSlideSize, 10);
    const hasPartialSlideToFill = clientWidth % currentViewportSlideSize !== 0;

    result.duplicatedSlides = Array(fullWidthSlidesToFill)
      .fill(initialSlideList).flatMap((slide) => slide);

    if (!hasPartialSlideToFill) {
      result.duplicatedSlides = result.duplicatedSlides.concat(result.duplicatedSlides);
      result.slidesToShift = result.duplicatedSlides.length;

      return result;
    }

    // need to apply the patch here
    result.duplicatedSlides = result.duplicatedSlides.concat(initialSlideList);
    result.slidesToShift = result.duplicatedSlides.length;
    result.duplicatedSlides = result.duplicatedSlides.concat(result.duplicatedSlides);

    return result;
  }

  function updateTranslation(slidesToShift) {
    const content = block.querySelector('.marquee-content');
    content.style.animationDuration = `${slidesToShift / SPEED_ANIMATION}s`;
    content.style.setProperty('--translateX', `${getCurrentViewportSlideSize() * slidesToShift}px`);
  }

  function render() {
    const blockDataset = getDatasetFromSection(block);
    const { background_color: backgroundColor } = blockDataset;
    block.style.background = backgroundColor || defaultBackgroundColor;

    const { duplicatedSlides, slidesToShift } = calculateSlideListBasedOnScreenWidth();

    block.innerHTML = `
      <div class="default-content-wrapper"><div class="title">${title.textContent}</div></div>
      <div class="outer-wrapper">
          <div class="marquee-content">
              ${duplicatedSlides.map((slide) => `<div class="marquee-item img-container">${slide.querySelector('picture').outerHTML}</div>`).join('')}
          </div>
      </div>
  `;

    updateTranslation(slidesToShift);
  }

  render();

  window.addEventListener('resize', debounce(render, 250));
}
