function createCarousel(block, shouldAutoplay = false, videos = undefined, titles = undefined, startsfrom = 0) {
  const parentSection = block.closest('.section')
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');
  videos = videos || Array.from(block.children).map(child => child.innerHTML);

  videos.forEach((item, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) carouselItem.classList.add('active');

    if (item.includes('https://www.youtube.com/embed/')) {
      carouselItem.classList.add('hasIframe');
      // Create an iframe element for embedding YouTube video
      item = item.replace('<div>', '').replace('</div>', '').replace('<div bis_skin_checked="1">', '');
      const iframeElement = document.createElement('iframe');
      iframeElement.setAttribute('src', item);
      iframeElement.setAttribute('frameborder', '0');
      iframeElement.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframeElement.setAttribute('allowfullscreen', '');
      carouselItem.appendChild(iframeElement);
    } else {
      // For non-video content (text, images, etc.)
      const contentElement = document.createElement('div');
      contentElement.classList.add('carousel-content');
      contentElement.innerHTML = item;
      carouselItem.appendChild(contentElement);
    }

    // Add title if provided
    if (titles && titles[index]) {
      const itemTitle = document.createElement('div');
      itemTitle.classList.add('carousel-item-title');
      itemTitle.textContent = titles[index];
      carouselItem.appendChild(itemTitle);
    }

    carouselTrack.appendChild(carouselItem);
  });

  carouselContainer.appendChild(carouselTrack);
  block.appendChild(carouselContainer);

  // Declare currentIndex and arrow variables before usage in any function
  let currentIndex = 0;
  let prevArrow, nextArrow;

  // Create carousel navigation dots
  const carouselNav = document.createElement('div');
  carouselNav.classList.add('carousel-navigation');

  videos.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index));
    carouselNav.appendChild(dot);
  });

  block.appendChild(carouselNav);

  // Create arrows only if there is more than one slide
  if (videos.length > 1) {
    createArrows(block, carouselTrack);
  }

  function moveToSlide(index) {
    const dots = document.querySelectorAll('.carousel-dot');
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');

    block.querySelectorAll('.carousel-item').forEach((itm) => itm.classList.remove('active'));
    block.querySelector(`.carousel-item:nth-of-type(${index + 1})`).classList.add('active');

    currentIndex = index;
    carouselTrack.style.transform = `translateX(-${block.querySelector('.carousel-item').offsetWidth * index}px)`;
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
      }
    });

    nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = `<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.13916H16M16 5.13916L12 1.16016M16 5.13916L12 9.15983" stroke="black" stroke-width="2.13333"/>
    </svg>`;
    nextArrow.addEventListener('click', () => {
      if (currentIndex < videos.length - 1) {
        moveToSlide(currentIndex + 1);
      }
    });

    arrowsContainer.appendChild(prevArrow);
    arrowsContainer.appendChild(nextArrow);

    // Append arrows to a wrapper container if it exists
    if (parentSection.dataset['arrows'] && parentSection.dataset['arrows'] === 'bottom') {
      block.appendChild(arrowsContainer);
    } else {
      parentSection.querySelector('.default-content-wrapper')?.appendChild(arrowsContainer);
    }

    updateArrows();
  }

  // Update arrow state: add inactive class if on first or last slide
  function updateArrows() {
    if (prevArrow) {
      if (currentIndex === 0) {
        prevArrow.classList.add('inactive');
      } else {
        prevArrow.classList.remove('inactive');
      }
    }
    if (nextArrow) {
      if (currentIndex === videos.length - 1) {
        nextArrow.classList.add('inactive');
      } else {
        nextArrow.classList.remove('inactive');
      }
    }
  }

  // Autoplay carousel if enabled
  if (shouldAutoplay) {
    const autoplayInterval = 3000;
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % videos.length;
      moveToSlide(nextIndex);
    }, autoplayInterval);
  }

  if (startsfrom !== undefined && startsfrom !== null) {
    setTimeout(() => {
      const nextIndex = startsfrom - 1 % videos.length;
      moveToSlide(nextIndex);
    }, 500);
  }
}

export default function decorate(block) {
  const parentSection = block.closest('.section');
  let shouldAutoplay = false;
  const startsfrom = parentSection.getAttribute('data-startsfrom') || 0;

  if (parentSection.getAttribute('data-autoplay') === 'true') {
    shouldAutoplay = true;
  }

  // Check for video content in dataset
  let videos = Object.values(parentSection.dataset).filter(value =>
    value.includes('https://www.youtube.com/embed/')
  );

  if (videos.length > 0) {
    // If there are videos, create a carousel with the video content and associated titles
    const titles = Object.keys(parentSection.dataset)
      .filter(key => key.includes('title'))
      .map(key => parentSection.dataset[key]);
    createCarousel(block, shouldAutoplay, videos, titles, startsfrom);
  } else {
    // Get HTML content from block.children if no videos are found
    const htmlContent = Array.from(block.children).map(child => child.innerHTML);
    // Clear original content
    block.innerHTML = '';
    createCarousel(block, shouldAutoplay, htmlContent, undefined, startsfrom);
  }
}
