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

  buttonsContainer.innerHTML = `${leftBtn.outerHTML}${rightBtn.outerHTML}`;

  return buttonsContainer;
}

function createTimelineBoxContent(slide) {
  const icon = slide.querySelector('.icon');
  const title = slide.querySelector('h3');
  const description = slide.querySelector('p:not(:has(.icon))');

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

function initTimelineCarousel(block) {
  const track = block.querySelector('.timeline-track');
  const prevBtn = block.querySelector('.timeline-button.left');
  const nextBtn = block.querySelector('.timeline-button.right');
  const items = Array.from(block.querySelectorAll('.timeline-box.populated'));
  const upItems = Array.from(block.querySelectorAll('.timeline-content-up .timeline-box'));

  if (!track || !prevBtn || !nextBtn || items.length === 0) return;

  // Calculate base box width
  function getItemWidth() {
    return (upItems[0].offsetWidth + upItems[1].offsetWidth) / 2;
  }

  function getScrollAmount() {
    return getItemWidth(); // gap is built into layout
  }

  // Calculate how many items fit
  function getItemsToShow() {
    return Math.floor(track.clientWidth / getItemWidth());
  }

  function getMaxIndex() {
    return Math.max(0, items.length - getItemsToShow());
  }

  let currentIndex = getMaxIndex();

  function scrollToIndex(index) {
    const left = index * getScrollAmount();
    track.scrollTo({ left, behavior: 'smooth' });
  }

  // INITIAL ALIGN WHEN BLOCK ENTERS VIEW
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollToIndex(currentIndex);
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(block);

  // BUTTON HANDLERS
  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    scrollToIndex(currentIndex);
  });

  // SCROLL → DETECT CURRENT INDEX (instead of touch)
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const idx = Math.round(track.scrollLeft / getScrollAmount());

      // enable / disable buttons ONLY
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx >= getMaxIndex();
    }, 80);
  });

  // RESIZE → RECALCULATE
  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    scrollToIndex(currentIndex);
  });
}

export default function decorate(block) {
  const { timelineYears } = block.closest('.section').dataset;
  const slides = Array.from(block.children);
  const navigation = createTimelineNavigation(block);

  const timelineTrack = document.createElement('div');
  timelineTrack.classList.add('timeline-track');

  // Build top boxes
  const topBoxes = slides.map((slide, idx) => {
    const isEven = idx % 2 === 0;
    return `
      <div class="timeline-box ${isEven ? 'populated' : ''}">
        ${isEven ? createTimelineBoxContent(slide) : ''}
      </div>
    `;
  }).join('');

  // Build years
  const years = timelineYears
    .split(',')
    .map((year) => `
      <div class="timeline-year">
        <span class="year-tag">${year.trim()}</span>
      </div>
    `)
    .join('');

  // Build bottom boxes
  const bottomBoxes = slides.map((slide, idx) => {
    const isEven = idx % 2 === 0;
    return `
      <div class="timeline-box ${!isEven ? 'populated' : ''}">
        ${!isEven ? createTimelineBoxContent(slide) : ''}
      </div>
    `;
  }).join('');

  timelineTrack.innerHTML = `
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

  block.innerHTML = '';
  block.appendChild(navigation);
  block.appendChild(timelineTrack);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initTimelineCarousel(block);
        obs.disconnect(); // stop observing after first trigger
      }
    });
  }, { threshold: 0.1 });

  observer.observe(block);
}
