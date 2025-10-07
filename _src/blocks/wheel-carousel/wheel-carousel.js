/* eslint-disable */
function createCarousel(block, items) {
  const parentSection = block.closest('.section');
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');

  // Create carousel items
  items.forEach((item, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    const contentElement = document.createElement('div');
    contentElement.classList.add('carousel-content');
    contentElement.innerHTML = item;
    carouselItem.appendChild(contentElement);
    carouselTrack.appendChild(carouselItem);
  });

  // Duplicate carousel items for infinite scroll effect
  const itemsClone = Array.from(carouselTrack.children).map(item => item.cloneNode(true));
  itemsClone.forEach(item => carouselTrack.appendChild(item));

  carouselContainer.appendChild(carouselTrack);
  block.appendChild(carouselContainer);

  let currentIndex = 0;
  let prevArrow, nextArrow;

  // Create carousel navigation dots
  const carouselNav = document.createElement('div');
  carouselNav.classList.add('carousel-navigation');

  items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index));
    carouselNav.appendChild(dot);
  });

  block.appendChild(carouselNav);

  // Create arrows only if there is more than one slide
  if (items.length > 1) {
    createArrows(block, carouselTrack);
  }

  function moveToSlide(index) {
    const dots = document.querySelectorAll('.carousel-dot');
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');

    currentIndex = index;
    updateArrows();
  }

  function createArrows(block, carouselTrack) {
    const arrowsContainer = document.createElement('div');
    arrowsContainer.classList.add('carousel-arrows-container');

    prevArrow = document.createElement('button');
    prevArrow.classList.add('carousel-prev');
    prevArrow.innerHTML = `<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.6666 5.18083L1.66663 5.18083M1.66663 5.18083L5.66663 9.15983M1.66663 5.18083L5.66663 1.16016" stroke="black" stroke-width="2.13333"/>
    </svg>`;
    prevArrow.addEventListener('click', () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      } else {
        moveToSlide(items.length - 1); // Wrap around to last slide
      }
    });

    nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = `<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.13916H16M16 5.13916L12 1.16016M16 5.13916L12 9.15983" stroke="black" stroke-width="2.13333"/>
    </svg>`;
    nextArrow.addEventListener('click', () => {
      if (currentIndex < items.length - 1) {
        moveToSlide(currentIndex + 1);
      } else {
        moveToSlide(0); // Wrap around to first slide
      }
    });

    arrowsContainer.appendChild(prevArrow);
    arrowsContainer.appendChild(nextArrow);

    if (parentSection.dataset['arrows'] && parentSection.dataset['arrows'] === 'bottom') {
      block.appendChild(arrowsContainer);
    } else {
      parentSection.querySelector('.default-content-wrapper')?.appendChild(arrowsContainer);
    }

    updateArrows();
  }

  function updateArrows() {
    if (prevArrow) {
      if (currentIndex === 0) {
        prevArrow.classList.add('inactive');
      } else {
        prevArrow.classList.remove('inactive');
      }
    }
    if (nextArrow) {
      if (currentIndex === items.length - 1) {
        nextArrow.classList.add('inactive');
      } else {
        nextArrow.classList.remove('inactive');
      }
    }
  }
}

export default function decorate(block) {
  block.classList.add('global-styles');
  const htmlContent = Array.from(block.children).map(child => child.innerHTML);
  block.textContent = '';
  createCarousel(block, htmlContent);
}
