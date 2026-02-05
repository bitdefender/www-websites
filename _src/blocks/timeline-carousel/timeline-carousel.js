function createTimelineNavigation(block) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('timeline-controls');
  const leftBtn = document.createElement('button');
  leftBtn.className = 'timeline-button left';
  leftBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M9.34315 1.41419L7.92893 -2.2769e-05L0.857865 7.07104L2.27208 8.48526L9.34315 1.41419Z" fill="#fff"/>
        <path d="M2.27208 5.65683L0.857865 7.07104L7.92893 14.1421L9.34315 12.7279L2.27208 5.65683Z" fill="#fff"/>
        </svg>`;

  const rightBtn = document.createElement('button');
  rightBtn.className = 'timeline-button right';
  rightBtn.disabled = true;
  rightBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none">
        <path d="M0.656854 1.41419L2.07107 -2.2769e-05L9.14214 7.07104L7.72792 8.48526L0.656854 1.41419Z" fill="white"/>
        <path d="M7.72792 5.65683L9.14214 7.07104L2.07107 14.1421L0.656854 12.7279L7.72792 5.65683Z" fill="white"/>
        </svg>`;

  const gradient1 = document.createElement('div');
  gradient1.className = 'timeline-gradient';
  gradient1.style.left = '0';
  gradient1.style.transform = 'rotate(180deg)';
  gradient1.style.background = 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)';
  block.appendChild(gradient1);

  const gradient2 = document.createElement('div');
  gradient2.className = 'timeline-gradient';
  gradient2.style.right = '0';
  gradient2.style.background = 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)';
  block.appendChild(gradient2);

  buttonsContainer.appendChild(leftBtn);
  buttonsContainer.appendChild(rightBtn);
  return buttonsContainer;
}

function createTimelineBoxContent(slide) {
  const icon = slide.querySelector('.icon') || slide.querySelector('p:has(img)');
  const title = slide.querySelector('h3');
  const description = slide.querySelector('p:not(:has(.icon)):not(:has(img))');

  if (title) title.classList.add('timeline-title');
  if (description) description.classList.add('timeline-description');

  return `
    ${icon ? icon.outerHTML : ''}
    <div class="timeline-box-content">
      ${title ? title.outerHTML : ''}
      ${description ? description.outerHTML : ''}
    </div>
  `;
}

function initTimelineCarousel(block, startPosition) {
  const track = block.querySelector('.timeline-track');
  const slideContainer = block.querySelector('.slides-container');
  const prevBtn = block.querySelector('.timeline-button.left');
  const nextBtn = block.querySelector('.timeline-button.right');
  const items = Array.from(block.querySelectorAll('.timeline-box.populated'));
  const fullBox = block.querySelector('.timeline-box.populated');
  const emptyBox = block.querySelector('.timeline-box:not(:first-of-type):not(.populated)');
  if (!track || !prevBtn || !nextBtn || items.length === 0) return;
  // Amount to scroll per click (item width + gap)
  function getScrollAmount() {
    const itemWidth = (fullBox.offsetWidth + emptyBox.offsetWidth) / 2;
    return itemWidth;
  }

  const containerWidth = track.offsetWidth;
  const avgWidthWithGap = getScrollAmount();
  const itemsToShow = Math.floor(containerWidth / avgWidthWithGap);
  const maxIndex = Math.max(0, items.length - itemsToShow);
  let currentIndex = startPosition === 'end' ? maxIndex : 0;

  let offset;

  function updateTimeline() {
    offset = -((currentIndex) * getScrollAmount());
    if (currentIndex === 0) offset = 0;
    slideContainer.style.setProperty('--transition', 'transform 0.3s ease');
    slideContainer.style.setProperty('--offset', `${offset}px`);
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  track.addEventListener('resize', updateTimeline());

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex -= 1;
    updateTimeline();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) currentIndex += 1;
    updateTimeline();
  });

  let touchStartX = 0;
  let currentOffset = 0;
  let isDragging = false;

  // Shared event Handlers
  function onDragStart(clientX) {
    slideContainer.style.setProperty('--transition', 'none');
    touchStartX = clientX;
    isDragging = true;
  }

  function onDragMove(clientX) {
    if (!isDragging) return;

    const diff = clientX - touchStartX;

    currentOffset = offset + diff;
    slideContainer.style.setProperty('--offset', `${currentOffset}px`);
  }

  function onDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;

    const diff = touchStartX - clientX;

    if (diff > 0) {
      currentIndex = Math.min(currentIndex + 1, maxIndex);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    updateTimeline();
  }

  function handlePointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    onDragStart(e.clientX);
  }

  function handlePointerMove(e) {
    onDragMove(e.clientX);
  }

  function handlePointerUp(e) {
    onDragEnd(e.clientX);
  }

  // Touch Events (iOS Safari compatibility)
  function handleTouchStart(e) {
    onDragStart(e.changedTouches[0].clientX);
  }

  function handleTouchMove(e) {
    onDragMove(e.changedTouches[0].clientX);
  }

  function handleTouchEnd(e) {
    onDragEnd(e.changedTouches[0].clientX);
  }

  track.addEventListener('pointerdown', handlePointerDown);
  track.addEventListener('pointermove', handlePointerMove);
  track.addEventListener('pointerup', handlePointerUp);

  track.addEventListener('touchstart', handleTouchStart, { passive: true });
  track.addEventListener('touchmove', handleTouchMove, { passive: true });
  track.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Initial position
  updateTimeline();
}

export default function decorate(block) {
  const { timelineYears, startPosition } = block.closest('.section').dataset;
  const slides = Array.from(block.children);
  const navigation = createTimelineNavigation(block);

  const timelineTrack = document.createElement('div');
  timelineTrack.classList.add('timeline-track');
  const slideContainer = document.createElement('div');
  slideContainer.classList.add('slides-container');

  const parityOffset = startPosition === 'end' ? 1 : 0;
  const isTopBox = (idx) => ((idx + parityOffset) % 2 === 0);

  let topBoxes = '';
  let years = '';
  let bottomBoxes = '';

  slides.forEach((slide, idx) => {
    const isTop = isTopBox(idx);

    // Top boxes
    topBoxes += `
    <div class="timeline-box ${isTop ? 'populated' : ''}">
      ${isTop ? createTimelineBoxContent(slide) : ''}
    </div>
  `;

    // Years axis
    const year = timelineYears.split(',')[idx]?.trim() ?? '';
    years += `
    <div class="timeline-year">
      <span class="year-tag">${year}</span>
    </div>
  `;

    // Bottom boxes
    bottomBoxes += `
    <div class="timeline-box ${!isTop ? 'populated' : ''}">
      ${!isTop ? createTimelineBoxContent(slide) : ''}
    </div>
  `;
  });

  slideContainer.innerHTML = `
    <div class="timeline-content-up">
      ${topBoxes}
    </div>

    <div class="timeline-years">
      ${years}
    </div>

    <div class="timeline-content-down">
      ${bottomBoxes}
    </div>
  `;

  timelineTrack.appendChild(slideContainer);
  block.innerHTML = '';
  block.appendChild(navigation);
  block.appendChild(timelineTrack);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initTimelineCarousel(block, startPosition);
        obs.disconnect(); // stop observing after first trigger
      }
    });
  }, { threshold: 0.1 });

  observer.observe(block);
}
