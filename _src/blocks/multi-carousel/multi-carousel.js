function createCarousel(block, shouldAutoplay = false, videos = undefined, titles = undefined, startsfrom = 0) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');

  const contentItems = videos || Array.from(block.children).map(child => child.innerHTML);
  const totalSlides = contentItems.length;
  let currentIndex = 0;
  let prevArrow, nextArrow, autoplayTimer;

  // Build slides
  contentItems.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-item');
    if (index === 0) slide.classList.add('active');

    if (item.includes('https://www.youtube.com/embed/')) {
      slide.classList.add('hasIframe');
      const iframe = document.createElement('iframe');
      iframe.src = item.replace(/<\/?div[^>]*>/g, '');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      slide.appendChild(iframe);
    } else {
      const content = document.createElement('div');
      content.classList.add('carousel-content');
      content.innerHTML = item;
      slide.appendChild(content);
    }

    if (titles && titles[index]) {
      const title = document.createElement('div');
      title.classList.add('carousel-item-title');
      title.textContent = titles[index];
      slide.appendChild(title);
    }

    carouselTrack.appendChild(slide);
  });

  carouselContainer.appendChild(carouselTrack);
  block.innerHTML = '';
  block.appendChild(carouselContainer);

  const slides = Array.from(carouselTrack.children);

  // Navigation dots
  const nav = document.createElement('div');
  nav.classList.add('carousel-navigation');

  const dots = contentItems.map((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index));
    nav.appendChild(dot);
    return dot;
  });

  block.appendChild(nav);

  // Arrows
  if (totalSlides > 1) {
    const arrowContainer = document.createElement('div');
    arrowContainer.classList.add('carousel-arrows-container');

    prevArrow = document.createElement('button');
    prevArrow.classList.add('carousel-prev');
    prevArrow.innerHTML = `←`;
    prevArrow.addEventListener('click', () => moveToSlide(currentIndex - 1));

    nextArrow = document.createElement('button');
    nextArrow.classList.add('carousel-next');
    nextArrow.innerHTML = `→`;
    nextArrow.addEventListener('click', () => moveToSlide(currentIndex + 1));

    arrowContainer.appendChild(prevArrow);
    arrowContainer.appendChild(nextArrow);

    if (block.dataset.arrows === 'bottom') {
      block.appendChild(arrowContainer);
    } else {
      block.querySelector('.default-content-wrapper')?.appendChild(arrowContainer);
    }
  }

  function moveToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    const slideWidth = slides[0]?.offsetWidth || 0;
    carouselTrack.style.transform = `translateX(-${slideWidth * index}px)`;

    currentIndex = index;
    updateArrows();
  }

  function updateArrows() {
    if (!prevArrow || !nextArrow) return;
    prevArrow.classList.toggle('inactive', currentIndex === 0);
    nextArrow.classList.toggle('inactive', currentIndex === totalSlides - 1);
  }

  function startAutoplay() {
    if (!shouldAutoplay || totalSlides <= 1) return;
    autoplayTimer = setInterval(() => {
      const next = (currentIndex + 1) % totalSlides;
      moveToSlide(next);
    }, 3000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  // Touch swipe support
  let startX = 0;
  let isSwiping = false;

  carouselTrack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  carouselTrack.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    const diffX = e.touches[0].clientX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        moveToSlide(currentIndex - 1);
      } else {
        moveToSlide(currentIndex + 1);
      }
      isSwiping = false;
    }
  });

  carouselTrack.addEventListener('touchend', () => {
    isSwiping = false;
  });

  // Wait for layout readiness using ResizeObserver
  const firstSlide = slides[0];
  const initialIndex = Math.max(0, Math.min(parseInt(startsfrom || 0, 10) - 1, totalSlides - 1));

  if (firstSlide) {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      if (width > 0) {
        observer.disconnect();
        moveToSlide(initialIndex);
        startAutoplay();
      }
    });
    observer.observe(firstSlide);
  } else {
    moveToSlide(0);
    startAutoplay();
  }
}

export default function decorate(block) {
  const parentSection = block.closest('.section');
  let shouldAutoplay = false;
  const startsfrom = parseInt(parentSection.getAttribute('data-startsfrom') || 0, 10);

  if (parentSection.getAttribute('data-autoplay') === 'true') {
    shouldAutoplay = true;
  }

  // Check for video content in dataset
  let videos = Object.values(parentSection.dataset).filter(value =>
    value.includes('https://www.youtube.com/embed/')
  );

  if (videos.length > 0) {
    const titles = Object.keys(parentSection.dataset)
      .filter(key => key.includes('title'))
      .map(key => parentSection.dataset[key]);

    block.innerHTML = '';
    createCarousel(block, shouldAutoplay, videos, titles, startsfrom);
  } else {
    const htmlContent = Array.from(block.children).map(child => child.innerHTML);
    block.innerHTML = '';
    createCarousel(block, shouldAutoplay, htmlContent, undefined, startsfrom);
  }
}
