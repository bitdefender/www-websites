import { getDsnBase, liftSectionHeader, matchHeights } from '../../scripts/utils/utils.js';

/*
 * The multi-endpoint variant is the homepage's Latest insights, on the design
 * system's bd-post-card under the section header: the newest post from each
 * feed in Section Metadata (Endpoint, Endpoint-business, Endpoint-labs),
 * taken in turn until Articles-number. Each card's badge is its feed's
 * channel title, so it arrives translated with the feed.
 */

// the design system's lg (992): the cards go three across
const DESKTOP = '(min-width: 992px)';

const readFeed = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const xml = new window.DOMParser().parseFromString(await response.text(), 'text/xml');
  const channel = xml.querySelector('channel > title')?.textContent.trim() || '';
  return [...xml.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title')?.textContent.trim() || '',
    link: item.querySelector('link')?.textContent.trim() || '',
    image: item.getElementsByTagName('media:content')[0]?.getAttribute('url') || '',
    channel,
  })).filter((post) => post.title && post.link);
};

async function decorateFeedCards(block) {
  const section = block.closest('.section');
  const { dataset } = section;
  const feeds = Object.keys(dataset)
    .filter((key) => /^endpoint/.test(key) && dataset[key])
    .map((key) => dataset[key]);

  // the section's heading, as bd-section-header
  const header = liftSectionHeader(block);
  const base = getDsnBase();
  const [modules, ...results] = await Promise.allSettled([
    Promise.all([import(`${base}post-card`), import(`${base}grid`)]),
    ...feeds.map(readFeed),
  ]);
  if (modules.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.warn('blog-news: DSN import failed', modules.reason);
  }

  // the newest of each feed first, then the next of each, until the count
  const lists = results.map((result) => {
    if (result.status === 'fulfilled') return result.value;
    // eslint-disable-next-line no-console
    console.error('blog-news:', result.reason);
    return [];
  });
  const count = parseInt(dataset.articlesNumber, 10) || feeds.length;
  const posts = [];
  for (let round = 0; posts.length < count && lists.some((list) => list[round]); round += 1) {
    lists.forEach((list) => {
      if (list[round] && posts.length < count) posts.push(list[round]);
    });
  }

  const cards = posts.map(({
    title, link, image, channel,
  }) => {
    const card = document.createElement('bd-post-card');
    card.setAttribute('heading', title);
    card.setAttribute('href', link);
    if (channel) card.setAttribute('badge', channel);
    if (image) card.setAttribute('image', image);
    if (dataset.buttonText) card.setAttribute('read-more', dataset.buttonText);
    return card;
  });

  const grid = document.createElement('bd-grid');
  // the design system's page column (styles.css), on the hero's edges
  grid.className = 'ds-page-column';
  [['cols', '1'], ['cols-sm', '1'], ['cols-md', '1'], ['cols-lg', '3']]
    .forEach(([name, value]) => grid.setAttribute(name, value));
  // phone and tablet stack the posts 16 apart; the desktop row sets them 24 apart
  const desktop = window.matchMedia?.(DESKTOP);
  const setGap = () => grid.setAttribute('gap', !desktop || desktop.matches ? 'md' : 'sm');
  setGap();
  desktop?.addEventListener('change', setGap);
  grid.append(...cards);

  block.replaceChildren(grid);
  await header;
}

async function renderBlogGrid(block, endpoint, articlesNumber) {
  const { buttonText } = block.closest('.section').dataset;
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
              <a href="${link}">${buttonText ?? 'Find out more'}</a>
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
  if (block.classList.contains('multi-endpoint')) {
    await decorateFeedCards(block);
    return;
  }

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
