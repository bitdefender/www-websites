import { debounce } from '../../scripts/utils/utils.js';

function getItemsToShow() {
  if (window.innerWidth <= 676) {
    return 1; // Show 1 item for mobile screens
  } if (window.innerWidth <= 990) {
    return 2; // Show 2 items for tablets
  }
  return 3; // Show 3 items for desktops
}

function countSlides(carouselContent) {
  const numberOfItems = carouselContent.children.length;
  return Math.ceil(numberOfItems / getItemsToShow());
}

function showSlides(carousel, slideNumber) {
  const carouselContent = carousel.querySelector('.columns.carousel > div:nth-child(1)');

  function handleSlideDisplay(childDivs) {
    // Hide all elements
    childDivs.forEach((div) => {
      div.style.opacity = '0';
      if (window.innerWidth <= 676) {
        div.style.width = '0px';
      }
    });

    // Calculate the start and end for the items to display based on slideNumber
    let start;
    let end;

    const itemsToShow = getItemsToShow();

    if (childDivs.length % itemsToShow === 0) {
      start = slideNumber * itemsToShow;
      end = start + itemsToShow;
    } else {
      start = slideNumber * (itemsToShow - 1);
      end = start + itemsToShow;

      if (end > childDivs.length) {
        start = childDivs.length - itemsToShow;
        end = childDivs.length;
      }
    }
    // Get the width of the container in pixels
    const containerWidth = carousel.clientWidth;
    // Calculate column width in pixels
    const columnWidthPx = containerWidth / itemsToShow;

    for (let i = start; i < end && i < childDivs.length; i += 1) {
      if (childDivs[i]) {
        childDivs[i].style.opacity = '1';
        childDivs[i].style.position = 'relative';
        childDivs[i].style.width = `${columnWidthPx}px`;
      }
    }
  }

  // Apply the display logic for both images and texts
  handleSlideDisplay(carouselContent.querySelectorAll('div'));
}

function hideExcessElements(carousel) {
  showSlides(carousel, 0); // Default: Show the first set of three elements
}

function getButtonIndex(button) {
  const buttons = Array.from(button.parentElement.children);
  return buttons.indexOf(button);
}

function setActiveButton(button, buttonsWrapper, carousel) {
  const activeButton = buttonsWrapper.querySelector('.active-button');
  // Determine the index of the active button and the clicked button
  const activeButtonIndex = getButtonIndex(activeButton);
  const clickedButtonIndex = getButtonIndex(button);

  const carouselContent = carousel.querySelector('.columns.carousel > div:nth-child(1)');

  // Clear any previous slide classes
  carouselContent.classList.remove('slide-left');

  if (clickedButtonIndex > activeButtonIndex) {
    carouselContent.classList.add('slide-left');
  } else if (clickedButtonIndex < activeButtonIndex) {
    carouselContent.classList.remove('slide-left');
  }

  // Remove active class from all buttons
  buttonsWrapper.querySelectorAll('button').forEach((btn) => {
    btn.classList.remove('active-button');
  });

  button.classList.add('active-button');
}

function createNavigationButtons(numberOfSlides, carousel) {
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'carousel-buttons';

  for (let i = 0; i < numberOfSlides; i += 1) {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Slide ${i + 1}`);

    button.addEventListener('click', () => {
      // Return early if the button clicked is already active
      if (button.classList.contains('active-button')) {
        return;
      }

      showSlides(carousel, i);
      setActiveButton(button, buttonsWrapper, carousel);
    });

    buttonsWrapper.appendChild(button);
  }

  // By default, set the first button as the active button
  if (buttonsWrapper.firstChild) {
    buttonsWrapper.firstChild.classList.add('active-button');
  }

  return buttonsWrapper;
}

function setupCarousel(carousel, resetSlidePosition = false) {
  const carouselContent = carousel.querySelector('.columns.carousel > div');

  // Remove the slide-left class if necessary
  if (resetSlidePosition) {
    carouselContent.classList.remove('slide-left');
  }

  // Remove existing navigation buttons
  const existingButtonsWrapper = carousel.querySelector('.carousel-buttons');
  if (existingButtonsWrapper) {
    existingButtonsWrapper.remove();
  }

  const numberOfSlides = countSlides(carouselContent);
  const buttonsWrapper = createNavigationButtons(numberOfSlides, carousel);

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
    block.closest('.section').classList.add(type);
    const leftCol = block.querySelector('.columns-img-col');
    const videoPath = leftCol.querySelector('tr:last-of-type').innerText.trim();
    const videoImg = leftCol.querySelector('img').getAttribute('src');

    leftCol.innerHTML = `<video data-type="dam" data-video="" src="${videoPath}" disableremoteplayback="" playsinline="" controls="" poster="${videoImg}"></video>`;
  }
}
