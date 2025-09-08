import { createTag } from '../../scripts/utils/utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

const SLIDE_PREFIX = 'carousel-slide-';
const CONTROL_PREFIX = 'carousel-control-';

function createSlide(item, index, parentSection) {
  const isCustom = parentSection.id === 'customQuoteCarousel' || null;
  const paragraphs = Array.from(item.querySelectorAll('p'));
  const quote = paragraphs.find((paragraph) => {
    const strongOrEm = paragraph.querySelector('strong, em');
    return !strongOrEm && paragraph.innerHTML !== '';
  });

  const author = item.querySelector('p > strong');
  const description = item.querySelector('p > em');
  if (!quote) {
    return null;
  }

  return createTag(
    'div',
    {
      class: 'slide',
      id: `${SLIDE_PREFIX}${index}`,
      role: 'tabpanel',
      'aria-hidden': 'true',
      'aria-describedby': `${CONTROL_PREFIX}${index}`,
      tabindex: '-1',
    },
    `${isCustom
      ? `<div class="quote-content">
        ${item.innerHTML}
      </div>`
      : `<div class="quote">
        <span class="icon icon-dark-blue-quote"></span>
      </div>
      <div class="quote-content">
        <h4>${quote?.innerHTML}</h4>
        <h5>${author?.textContent}</h5>
        <p>${description?.innerHTML}</p>
      </div>`
    }`,
  );
}

function getCurrentSlideIndex(slides) {
  return [...slides.children].findIndex((slide) => slide.classList.contains('active'));
}

function updateControlsState(block, nextIndex) {
  const dots = block.querySelector('.slides-dots');
  const currentActive = dots.querySelector('.active');
  if (currentActive) {
    currentActive.classList.remove('active');
    const btn = currentActive.querySelector('button');
    btn.removeAttribute('aria-selected');
    btn.setAttribute('tabindex', '-1');
  }
  const nextActive = dots.children[nextIndex];
  if (nextActive) {
    nextActive.classList.add('active');
    const btn = nextActive.querySelector('button');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
  }
}

function updateSlideState(nextIndex, block) {
  const slides = block.querySelector('.slides');
  const currentIndex = getCurrentSlideIndex(slides);
  slides.children[currentIndex].classList.remove('active');
  slides.children[nextIndex].classList.add('active');
  const translateX = -nextIndex * 100;
  slides.style.transform = `translateX( ${translateX}% )`;
  [...slides.children].forEach((slide, index) => {
    if (index === nextIndex) {
      slide.removeAttribute('tabindex');
      slide.setAttribute('aria-hidden', 'false');
    } else {
      slide.setAttribute('tabindex', '-1');
      slide.setAttribute('aria-hidden', 'true');
    }
  });
  updateControlsState(block, nextIndex);
  const allPictures = block.closest('.columns').querySelectorAll('.right-col picture');
  if (allPictures && allPictures.length > 1) {
    allPictures.forEach((picture) => {
      picture.style.display = 'none';
    });
    block.closest('.columns').querySelector(`.right-col picture:nth-of-type(${nextIndex + 1})`).style.display = 'block';
  }
}

function addDotsListeners(dotsControls, slides) {
  [...dotsControls.children].forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
      event.preventDefault();
      updateSlideState(index, slides.parentElement);
    });
  });
}

function createDotsControls(slides) {
  const dots = createTag('ul', { class: 'slides-dots', role: 'tablist' });
  const slidesNumber = slides.children.length;
  [...slides.children].forEach((slide, slideIndex) => {
    const ariaIndex = slideIndex + 1;
    const btn = createTag(
      'button',
      {
        id: `${CONTROL_PREFIX}${ariaIndex}`,
        class: 'dot',
        role: 'tab',
        type: 'button',
        tabindex: '-1',
        'aria-controls': `${SLIDE_PREFIX}${ariaIndex}`,
        'aria-label': `${ariaIndex} of ${slidesNumber}`,
      },
      `${ariaIndex}`,
    );
    const li = createTag('li', { role: 'presentation' }, btn);
    dots.append(li);
  });
  return dots;
}

export default async function decorate(block) {
  const parentSection = block.closest('.section');
  const slides = createTag('div', { class: 'slides' });
  let slideIndex = 1;
  [...block.children].forEach((item) => {
    const slide = createSlide(item, slideIndex, parentSection);
    if (slide) {
      slideIndex += 1;
      slides.append(slide);
    }
  });

  const allPictures = block.closest('.columns')?.querySelectorAll('.right-col picture');
  if (allPictures && !block.closest('.columns')?.classList.contains('hasMultiImgs')) {
    block.closest('.columns').classList.add('has-multi-imgs');
  }

  slides.children[0].classList.add('active');
  const dotsControls = createDotsControls(slides, block);

  /* Add carousel action button if it exists */
  const controlsElements = [dotsControls];
  const button = block.querySelector('.button-container');
  if (button) {
    const slidesAction = createTag('div', { class: 'slides-action' });
    slidesAction.append(button);
    controlsElements.push(slidesAction);
  }
  const slidesControls = createTag('div', { class: 'slides-controls' }, controlsElements);
  const slidesContainer = createTag('div', { class: 'slides-container' }, [slides, slidesControls]);
  block.replaceChildren(slidesContainer);
  updateControlsState(block, 0);
  addDotsListeners(dotsControls, slides);
  decorateIcons(block);
}
