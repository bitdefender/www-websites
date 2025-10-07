function extractYouTubeID(url) {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : '';
}

function enableDragScroll(container) {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

function updateArrowState(carousel, leftBtn, rightBtn) {
  const scrollLeft = Math.round(carousel.scrollLeft);
  const maxScrollLeft = Math.round(carousel.scrollWidth - carousel.clientWidth);

  if (scrollLeft <= 0) {
    leftBtn.classList.add('inactive');
    leftBtn.classList.remove('active');
  } else {
    leftBtn.classList.remove('inactive');
    leftBtn.classList.add('active');
  }

  if (scrollLeft >= maxScrollLeft) {
    rightBtn.classList.add('inactive');
    rightBtn.classList.remove('active');
  } else {
    rightBtn.classList.remove('inactive');
    rightBtn.classList.add('active');
  }
}

export default function decorate(block) {
  block.classList.add('global-styles');
  const items = [...block.children];
  if (!items.length) return;

  block.classList.add('carousel-with-preview-container');

  const mainVideoContainer = document.createElement('div');
  mainVideoContainer.className = 'main-video-container';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';

  const carousel = document.createElement('div');
  carousel.className = 'carousel video-carousel';

  // Featured video setup
  const featured = document.createElement('div');
  featured.className = 'featured-video';

  const featuredIframe = document.createElement('iframe');
  featuredIframe.setAttribute('frameborder', '0');
  featuredIframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  featuredIframe.setAttribute('allowfullscreen', '');

  const featuredTitleWrapper = document.createElement('div');
  featuredTitleWrapper.className = 'featured-title';

  const featuredTitle = document.createElement('strong');
  const featuredSubtitle = document.createElement('p');

  featuredTitleWrapper.appendChild(featuredTitle);
  featuredTitleWrapper.appendChild(featuredSubtitle);

  featured.appendChild(featuredIframe);
  featured.appendChild(featuredTitleWrapper);

  // Function to set featured video
  function setFeatured(videoUrl, titleText) {
    featuredIframe.src = videoUrl;
    featuredTitle.innerHTML = titleText;
  }

  // Build carousel items
  const createdItems = [];

  items.forEach((item, i) => {
    const [titleEl, videoEl] = item.children;
    const fullTitle = titleEl?.innerHTML.trim();
    const videoUrl = videoEl?.textContent.trim();

    if (i === 0) setFeatured(videoUrl, fullTitle);

    const itemDiv = document.createElement('div');
    itemDiv.className = 'carousel-item';

    if (i === 0) itemDiv.classList.add('active');

    const thumbWrapper = document.createElement('div');
    thumbWrapper.className = 'thumb-wrapper';

    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${extractYouTubeID(videoUrl)}/hqdefault.jpg`;
    img.alt = fullTitle;
    thumbWrapper.appendChild(img);

    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = fullTitle;

    itemDiv.appendChild(thumbWrapper);
    itemDiv.appendChild(caption);

    itemDiv.addEventListener('click', () => {
      createdItems.forEach((el) => el.classList.remove('active'));
      itemDiv.classList.add('active');
      setFeatured(videoUrl, fullTitle);
    });

    carousel.appendChild(itemDiv);
    createdItems.push(itemDiv); // Track dynamically created items
  });

  // Arrows + Navigation
  const navContainer = document.createElement('div');
  navContainer.className = 'navContainer';

  const leftBtn = document.createElement('button');
  const rightBtn = document.createElement('button');

  leftBtn.className = 'carousel-arrow left inactive';
  rightBtn.className = 'carousel-arrow right active';

  leftBtn.innerHTML = '<img src="/_src/icons/subscriber-icons/left-arrow-black.svg" alt="Bitdefender" />';
  rightBtn.innerHTML = '<img src="/_src/icons/subscriber-icons/right-arrow-black.svg" alt="Bitdefender" />';

  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -350, behavior: 'smooth' });
    setTimeout(() => updateArrowState(carousel, leftBtn, rightBtn), 300);
  });

  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 350, behavior: 'smooth' });
    setTimeout(() => updateArrowState(carousel, leftBtn, rightBtn), 300);
  });

  navContainer.appendChild(leftBtn);
  navContainer.appendChild(rightBtn);

  // Final DOM structure
  mainVideoContainer.appendChild(featured);
  carouselWrapper.appendChild(carousel);
  carouselWrapper.appendChild(navContainer);
  enableDragScroll(carousel);
  block.innerHTML = '';
  block.appendChild(mainVideoContainer);
  block.appendChild(carouselWrapper);

  carousel.addEventListener('scroll', () => {
    updateArrowState(carousel, leftBtn, rightBtn);
  });
}
