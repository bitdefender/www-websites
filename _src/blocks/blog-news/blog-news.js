import { matchHeights } from '../../scripts/utils/utils.js';

async function renderBlogGrid(block, endpoint, articlesNumber) {
  const blogGrid = block.querySelector('.blog-grid');
  try {
    const response = await fetch(endpoint);
    const rssText = await response.text();

    const data = new window.DOMParser().parseFromString(rssText, 'text/xml');
    const items = data.querySelectorAll('item');
    let currentCount = 0;
    items.forEach((item) => {
      // eslint-disable-next-line no-plusplus
      currentCount++;
      if (currentCount > articlesNumber) return;
      const link = item.querySelector('link').textContent;

      const title = item.querySelector('title').textContent;
      const media = item.querySelector('content');
      const image = media.getAttribute('url');

      // Create a blog card
      const blogCard = document.createElement('a');
      blogCard.setAttribute('href', link);
      blogCard.classList.add('blog-card');

      blogCard.innerHTML = `
          <img src="${image}" alt="${title}">
          <div class="blog-card-content">
              <p>${title}</p>
              <a href="${link}">Find out more</a>
          </div>
      `;

      blogGrid.appendChild(blogCard);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function initCarousel(block) {
  const track = block.querySelector('.carousel-track');
  if (!track) return;
  const slidesContainer = block.querySelector('.slides-container');
  const cards = block.querySelectorAll('.blog-card');
  const prevBtn = block.querySelector('.carousel-button.left');
  const nextBtn = block.querySelector('.carousel-button.right');

  let currentIndex = 0;
  const totalCards = cards.length;
  slidesContainer.style.setProperty('--slides-number', totalCards);
  const containerStyle = getComputedStyle(slidesContainer);
  let offset;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(containerStyle?.gap, 10) || 0; // Gap between cards
    offset = -(currentIndex * (cardWidth + gap));
    slidesContainer.style.transition = 'transform 0.3s ease';
    slidesContainer.style.transform = `translateX(${offset}px)`;

    // Update buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalCards - 1;
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    updateCarousel();
  }

  // Arrow navigation
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Touch/Swipe support
  let touchStartX = 0;
  let isDragging = false;
  let currentOffset = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    isDragging = true;

    // stop animation so user can drag smoothly
    slidesContainer.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const moveX = e.changedTouches[0].clientX;
    const diff = moveX - touchStartX;

    currentOffset = offset + diff;

    // Follow finger
    slidesContainer.style.transform = `translateX(${currentOffset}px)`;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    isDragging = false;
    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 0) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex - 1);
  }, { passive: true });

  updateCarousel();
}

function createCarouselNavigation() {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('carousel-controls');
  const leftBtn = document.createElement('button');
  leftBtn.className = 'carousel-button left';
  leftBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M9.34315 1.41419L7.92893 -2.2769e-05L0.857865 7.07104L2.27208 8.48526L9.34315 1.41419Z" fill="#fff"/>
        <path d="M2.27208 5.65683L0.857865 7.07104L7.92893 14.1421L9.34315 12.7279L2.27208 5.65683Z" fill="#fff"/>
        </svg>`;

  const rightBtn = document.createElement('button');
  rightBtn.className = 'carousel-button right';
  rightBtn.disabled = true;
  rightBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M0.656854 1.41419L2.07107 -2.2769e-05L9.14214 7.07104L7.72792 8.48526L0.656854 1.41419Z" fill="white"/>
        <path d="M7.72792 5.65683L9.14214 7.07104L2.07107 14.1421L0.656854 12.7279L7.72792 5.65683Z" fill="white"/>
        </svg>`;

  buttonsContainer.appendChild(leftBtn);
  buttonsContainer.appendChild(rightBtn);

  return buttonsContainer;
}

export default async function decorate(block) {
  const section = block.closest('.section');
  const { endpoint, articlesNumber, sectionColor } = section.dataset;
  if (sectionColor) section.style.backgroundColor = sectionColor;

  const blogGrid = document.createElement('div');
  blogGrid.classList.add('blog-grid');

  if (block.classList.contains('carousel')) {
    const buttonsContainer = createCarouselNavigation();
    const carouselTrack = document.createElement('div');
    carouselTrack.classList.add('carousel-track');
    blogGrid.classList.add('slides-container');

    carouselTrack.appendChild(blogGrid);
    block.appendChild(carouselTrack);
    block.appendChild(buttonsContainer);
  } else {
    block.appendChild(blogGrid);
  }

  await renderBlogGrid(block, endpoint, articlesNumber);

  matchHeights(block, 'p');
  initCarousel(block);
}
