import { debounce, matchHeights } from '../../scripts/utils/utils.js';

function getItemsToShow() {
  const width = window.innerWidth;
  return width <= 767 ? 1 : 3; // 1 item for mobile, 2 for tablet, 3 for desktop
}

function countSlides(carouselContent) {
  return Math.ceil(carouselContent.children.length / getItemsToShow());
}

function showSlides(carousel, slideNumber) {
  const carouselContent = carousel.querySelector('.columns.carousel > div:first-child');
  const itemsToShow = getItemsToShow();
  const translateXValue = -(carousel.clientWidth * slideNumber) / itemsToShow;

  carouselContent.style.transform = `translateX(${translateXValue}px)`;
  carouselContent.style.transition = 'transform 0.5s ease';
}

function hideExcessElements(carousel) {
  showSlides(carousel, 0); // Always show the first set initially
}

function setActiveButton(button, buttonsWrapper) {
  buttonsWrapper.querySelector('.active-button')?.classList.remove('active-button');
  button.classList.add('active-button');
}

function createNavigationButtons(numberOfSlides, carousel) {
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'carousel-buttons';

  Array.from({ length: numberOfSlides }, (_, i) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Slide ${i + 1}`);
    button.addEventListener('click', () => {
      if (!button.classList.contains('active-button')) {
        showSlides(carousel, i);
        setActiveButton(button, buttonsWrapper);
      }
    });
    buttonsWrapper.appendChild(button);
    return button;
  });

  buttonsWrapper.firstChild?.classList.add('active-button'); // Set first button as active
  return buttonsWrapper;
}

function setupCarousel(carousel, resetSlidePosition = false) {
  const carouselContent = carousel.querySelector('.columns.carousel > div');
  if (resetSlidePosition) carouselContent.style.transform = 'translateX(0px)';

  const buttonsWrapper = createNavigationButtons(countSlides(carouselContent), carousel);
  carousel.querySelector('.carousel-buttons')?.remove(); // Remove existing buttons
  carousel.appendChild(buttonsWrapper);
  hideExcessElements(carousel);
}

function setImageAsBackgroundImage() {
  const columns = document.querySelectorAll('.columns.text-over-image > div > div');

  columns.forEach((column) => {
    const image = column.querySelector('img');

    if (image) {
      const src = image.getAttribute('src');

      column.style.backgroundImage = `url(${src})`;

      // remove the p tag that contains the picture element
      const pContainer = image.closest('p');
      if (pContainer) {
        pContainer.remove();
      }
    }
  });
}

export default function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const { linksOpenInNewTab, type } = block.closest('.section').dataset;
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      } else {
        const children = [...row.children];

        if (children.length === 1) {
          col.closest('div').classList.add('columns-title-col');
        } else {
          const firstParentIndex = children.indexOf(col.closest('div'));

          col.closest('div').classList.add('columns-text-col');
          if (firstParentIndex) {
            col.closest('div').classList.add('columns-right-col');
          } else {
            col.closest('div').classList.add('columns-left-col');
          }
        }
      }
    });
  });

  if (linksOpenInNewTab === 'true') {
    block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
      anchorEl.target = '_blank';
      anchorEl.rel = 'noopener noreferrer';
    });
  }

  if (block.classList.contains('text-over-image')) {
    setImageAsBackgroundImage();
  }

  // If it has the carousel class, then setup the carousel
  if (block.classList.contains('carousel')) {
    setupCarousel(block);
  }

  window.addEventListener('resize', debounce(() => {
    // Check if the block still has the carousel class before resetting
    if (block.classList.contains('carousel')) {
      setupCarousel(block, true); // Pass true to reset the slide position
    }
  }, 250));
  window.dispatchEvent(new Event('resize')); // trigger resize to give width to columns

  const sectionDiv = document.querySelector('.columns-container[data-bg-image]');
  if (sectionDiv) {
    const bgImageUrl = sectionDiv.getAttribute('data-bg-image');
    if (bgImageUrl) {
      sectionDiv.style.setProperty('--bg-image-url', `url(${bgImageUrl})`);
    }
  }

  // This allows the event to cross the shadow DOM boundary
  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true,
  });

  if (type && type === 'video_left') {
    block.closest('.section').classList.add('video-left');
    const leftCol = block.querySelector('.columns-img-col');
    const videoPath = leftCol.querySelector('tr:last-of-type').innerText.trim();
    const videoImg = leftCol.querySelector('img').getAttribute('src');

    leftCol.innerHTML = `<video data-type="dam" data-video="" src="${videoPath}" disableremoteplayback="" playsinline="" controls="" poster="${videoImg}"></video>`;
  }

  const chatOptions = document.querySelector('.chat-options');
  if (chatOptions) {
    const cardButtons = chatOptions.querySelectorAll('.button-container');
    cardButtons.forEach((button) => {
      button.previousElementSibling.classList.add('chat-options-text');
    });
    matchHeights(chatOptions, '.chat-options-text');
    matchHeights(chatOptions, 'table');
  }
  matchHeights(block, 'h3');
  matchHeights(block, 'h4');
}
