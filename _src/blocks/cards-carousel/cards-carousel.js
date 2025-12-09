function initCarousel(block) {
  const track = block.querySelector('.carousel-track');
  const cardsContainer = document.querySelector('.cards-container');
  const cards = block.querySelectorAll('.carousel-card');
  const dots = block.querySelectorAll('.carousel-dot');
  const prevBtn = block.querySelector('.button.left');
  const nextBtn = block.querySelector('.button.right');

  let currentIndex = 0;
  const totalCards = cards.length;
  const containerStyle = getComputedStyle(cardsContainer);
  let offset;

  function updateCarousel() {
    cardsContainer.style.setProperty('--transition', 'transform 0.3s ease');
    const cardWidth = cards[0].offsetWidth;
    const gap = parseInt(containerStyle?.gap, 10) || 0; // Gap between cards
    offset = -(currentIndex * (cardWidth + gap));

    cardsContainer.style.setProperty('--offset', `${offset}px`);

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

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
    cardsContainer.style.setProperty('--transition', 'none');
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const moveX = e.changedTouches[0].clientX;
    const diff = moveX - touchStartX;

    currentOffset = offset + diff;

    // Follow finger
    cardsContainer.style.setProperty('--offset', `${currentOffset}px`);
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    isDragging = false;
    const diff = touchStartX - e.changedTouches[0].clientX;

    if (diff > 0) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex - 1);
  }, { passive: true });

  updateCarousel();
}

export default function decorate(block) {
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  const dots = document.createElement('div');
  dots.classList.add('dots-container');
  const navButtons = document.createElement('div');
  navButtons.classList.add('nav-buttons-container');
  navButtons.innerHTML = `
    <button class="button left">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M9.34315 1.41419L7.92893 -2.2769e-05L0.857865 7.07104L2.27208 8.48526L9.34315 1.41419Z" fill="#fff"/>
        <path d="M2.27208 5.65683L0.857865 7.07104L7.92893 14.1421L9.34315 12.7279L2.27208 5.65683Z" fill="#fff"/>
      </svg>
    </button>
    <button class="button right">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M0.656854 1.41419L2.07107 -2.2769e-05L9.14214 7.07104L7.72792 8.48526L0.656854 1.41419Z" fill="white"/>
        <path d="M7.72792 5.65683L9.14214 7.07104L2.07107 14.1421L0.656854 12.7279L7.72792 5.65683Z" fill="white"/>
      </svg>
    </button>
  `;
  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('cards-container');
  block.querySelectorAll('.cards-carousel > div > div').forEach((card, idx) => {
    card.classList.add('carousel-card');
    cardsContainer.appendChild(card);
    dots.innerHTML += `<div data-index="${idx}" class="carousel-dot ${idx === 0 ? 'active' : ''}" ></div>`;
  });
  carouselTrack.innerHTML = '';
  carouselTrack.appendChild(cardsContainer);
  navigation.appendChild(dots);
  navigation.appendChild(navButtons);
  block.appendChild(carouselTrack);
  block.appendChild(navigation);
  initCarousel(block);
}
