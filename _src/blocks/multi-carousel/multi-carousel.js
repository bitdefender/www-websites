/* eslint-disable */
function createCarousel(block, shouldAutoplay = false, videos = undefined, titles = undefined, startsfrom = 0) {
  const parentSection = block.closest('.section');
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');
  videos = videos || Array.from(block.children).map((child) => child.innerHTML);

  let currentIndex = 0;
  let prevArrow, nextArrow;

  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  videos.forEach((item, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) carouselItem.classList.add('active');

    if (item.includes('https://www.youtube.com/embed/')) {
      carouselItem.classList.add('hasIframe');
      const itemReplaced = item.replace('<div>', '').replace('</div>', '').replace('<div bis_skin_checked="1">', '');
      const iframeElement = document.createElement('iframe');
      iframeElement.setAttribute('src', itemReplaced);
      iframeElement.setAttribute('frameborder', '0');
      iframeElement.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframeElement.setAttribute('allowfullscreen', '');
      carouselItem.appendChild(iframeElement);
    } else {
      const contentElement = document.createElement('div');
      contentElement.classList.add('carousel-content');
      contentElement.innerHTML = item;
      carouselItem.appendChild(contentElement);
    }

    if (titles && titles[index]) {
      const itemTitle = document.createElement('div');
      itemTitle.classList.add('carousel-item-title');
      itemTitle.textContent = titles[index];
      carouselItem.appendChild(itemTitle);
    }

    carouselTrack.appendChild(carouselItem);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        moveToSlide(currentIndex);
      }, 200);
    });
  });

  carouselContainer.appendChild(carouselTrack);
  carouselTrack.style.transform = 'translateX(0px)';
  block.appendChild(carouselContainer);

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

  if (videos.length > 1) {
    createArrows(block, carouselTrack);
  }

  function moveToSlide(index) {
    index = Math.floor(index);
    const dots = block.querySelectorAll('.carousel-dot');
    dots.forEach((dot) => dot.classList.remove('active'));
    dots[index]?.classList.add('active');
  
    requestAnimationFrame(() => {
      const items = block.querySelectorAll('.carousel-item');
      const itemWidth = items[0]?.offsetWidth || 0;
  
      carouselTrack.style.transform = `translateX(-${itemWidth * index}px)`;
      
      // Update active item
      items.forEach((itm) => itm.classList.remove('active'));
      items[index]?.classList.add('active');
  
      prevTranslate = -itemWidth * index;
      currentTranslate = prevTranslate;
    });
  
    currentIndex = index;
    updateArrows();
  }  

  function createArrows(block) {
    const arrowsContainer = document.createElement('div');
    arrowsContainer.classList.add('carousel-arrows-container');

    prevArrow = document.createElement('button');
    prevArrow.classList.add('carousel-prev');
    prevArrow.innerHTML = '<img src="/_src/icons/subscriber-icons/left-arrow-black.svg" alt="Bitdefender" />';
    prevArrow.addEventListener('click', () => {
      if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
      }
    });

    nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = '<img src="/_src/icons/subscriber-icons/right-arrow-black.svg" alt="Bitdefender" />';
    nextArrow.addEventListener('click', () => {
      if (currentIndex < videos.length - 1) {
        moveToSlide(currentIndex + 1);
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
        prevArrow.classList.remove('active');
      } else {
        prevArrow.classList.remove('inactive');
        prevArrow.classList.add('active');
      }
    }

    if (nextArrow) {
      if (currentIndex === videos.length - 1) {
        nextArrow.classList.add('inactive');
        nextArrow.classList.remove('active');
      } else {
        nextArrow.classList.remove('inactive');
        nextArrow.classList.add('active');
      }
    }
  }

  // Drag events
  carouselTrack.addEventListener('mousedown', startDrag);
  carouselTrack.addEventListener('touchstart', startDrag, { passive: true });
  carouselTrack.addEventListener('mousemove', dragMove);
  carouselTrack.addEventListener('touchmove', dragMove, { passive: false });
  carouselTrack.addEventListener('mouseup', endDrag);
  carouselTrack.addEventListener('touchend', endDrag);
  carouselTrack.addEventListener('mouseleave', endDrag);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function startDrag(event) {
    isDragging = true;
    startX = getPositionX(event);
    carouselTrack.classList.add('dragging');
  }

  function dragMove(event) {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;
    carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    carouselTrack.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100 && currentIndex < videos.length - 1) {
      moveToSlide(currentIndex + 1);
    } else if (movedBy > 100 && currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    } else {
      moveToSlide(currentIndex);
    }
  }

  if (shouldAutoplay) {
    const autoplayInterval = 3000;
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % videos.length;
      moveToSlide(nextIndex);
    }, autoplayInterval);
  }

  if (startsfrom !== undefined && startsfrom !== null && startsfrom > 1) {
    setTimeout(() => {
      requestAnimationFrame(() => {
        const nextIndex = (startsfrom - 1 + videos.length) % videos.length;
        moveToSlide(nextIndex);
      });
    }, 500);
  }
}

export default function decorate(block) {
  block.classList.add('global-styles');
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
