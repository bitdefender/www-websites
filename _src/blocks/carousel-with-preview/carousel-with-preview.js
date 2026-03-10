function extractYouTubeID(url) {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : '';
}

function isYouTubeLink(url) {
  return /youtube\.com|youtu\.be/.test(url);
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

  ['mouseleave', 'mouseup'].forEach((evt) => {
    container.addEventListener(evt, () => {
      isDown = false;
      container.classList.remove('dragging');
    });
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    container.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

function updateArrowState(carousel, leftBtn, rightBtn) {
  const scrollLeft = Math.round(carousel.scrollLeft);
  const maxScrollLeft = Math.round(carousel.scrollWidth - carousel.clientWidth);

  leftBtn.classList.toggle('inactive', scrollLeft <= 0);
  leftBtn.classList.toggle('active', scrollLeft > 0);

  rightBtn.classList.toggle('inactive', scrollLeft >= maxScrollLeft);
  rightBtn.classList.toggle('active', scrollLeft < maxScrollLeft);
}

function initToggleList(list) {
  const items = [...list.querySelectorAll('li')];
  if (items.length < 2) return;

  const toggleItem = items[items.length - 1];
  const contentItems = items.slice(0, -1);

  const rawText = toggleItem.textContent;
  const [showMoreText, showLessText] = rawText.split('|').map((t) => t.trim());

  let expanded = false;
  function update() {
    contentItems.forEach((item) => {
      const [txt, tooltip] = item.innerHTML.split('::');
      if (tooltip) item.classList.add('has-tooltip');
      item.innerHTML = `${txt} ${tooltip ? `<span class="tooltip">${tooltip}<span>` : ''}`;
      item.style.display = expanded ? 'list-item' : 'none';
    });

    toggleItem.textContent = expanded ? showLessText || rawText : showMoreText || rawText;
  }

  toggleItem.setAttribute('aria-expanded', 'false');
  toggleItem.addEventListener('click', () => {
    expanded = !expanded;
    toggleItem.setAttribute('aria-expanded', expanded);
    update();
  });

  update();
}

export default function decorate(block) {
  const { preview } = block.closest('.section').dataset;
  const items = [...block.children];
  if (!items.length) return;

  const showPreview = preview !== 'hide';

  let setFeatured = null;
  let mainVideoContainer = null;

  /* =========================
     Featured / preview
  ========================= */
  if (showPreview) {
    block.classList.add('carousel-with-preview-container');

    mainVideoContainer = document.createElement('div');
    mainVideoContainer.className = 'main-video-container';

    const featured = document.createElement('div');
    featured.className = 'featured-video';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute(
      'allow',
      'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    );
    iframe.setAttribute('allowfullscreen', '');

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'featured-title';

    const title = document.createElement('strong');
    titleWrapper.appendChild(title);

    featured.appendChild(iframe);
    featured.appendChild(titleWrapper);
    mainVideoContainer.appendChild(featured);

    setFeatured = (url, text) => {
      iframe.src = url;
      title.innerHTML = text;
    };
  }

  /* =========================
     Carousel
  ========================= */
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';

  const carousel = document.createElement('div');
  carousel.className = 'carousel video-carousel';

  const createdItems = [];

  items.forEach((item, i) => {
    const [titleEl, linkEl] = item.children;
    const link = linkEl?.textContent.trim();
    const titleHTML = titleEl?.innerHTML.trim();

    const isYouTube = isYouTubeLink(link);

    if (showPreview && isYouTube && i === 0 && setFeatured) {
      setFeatured(link, titleHTML);
    }

    const itemDiv = document.createElement('div');
    itemDiv.className = 'carousel-item';
    if (i === 0) itemDiv.classList.add('active');

    /* is youtube link */
    if (isYouTube) {
      const thumbWrapper = document.createElement('div');
      thumbWrapper.className = 'thumb-wrapper';

      const img = document.createElement('img');
      img.src = `https://img.youtube.com/vi/${extractYouTubeID(link)}/hqdefault.jpg`;
      img.alt = '';

      thumbWrapper.appendChild(img);

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerHTML = titleHTML;

      itemDiv.appendChild(thumbWrapper);
      itemDiv.appendChild(caption);

      itemDiv.addEventListener('click', () => {
        createdItems.forEach((el) => el.classList.remove('active'));
        itemDiv.classList.add('active');

        if (setFeatured) {
          setFeatured(link, titleHTML);
        }
      });
    } else { /* external link - add it for the image */
      const wrapper = document.createElement('div');
      wrapper.innerHTML = titleHTML;

      const img = wrapper.querySelector('img');

      if (img) {
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';

        img.parentNode.insertBefore(anchor, img);
        anchor.appendChild(img);
      }

      itemDiv.appendChild(wrapper);
    }

    itemDiv.querySelectorAll('ul').forEach((ul) => {
      initToggleList(ul);
    });

    const lastItemText = itemDiv.querySelector('p:last-of-type');
    const maybeVideo = lastItemText.textContent.includes('mp4');
    if (maybeVideo) {
      const videoName = lastItemText.closest('p').textContent.trim();
      lastItemText.innerHTML = `
        <video autoplay loop muted playsinline>
          <source src="/_src/images/${videoName}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }

    carousel.appendChild(itemDiv);
    createdItems.push(itemDiv);
  });

  /* =========================
     Navigation
  ========================= */
  const navContainer = document.createElement('div');
  navContainer.className = 'navContainer';

  const leftBtn = document.createElement('button');
  const rightBtn = document.createElement('button');

  leftBtn.className = 'carousel-arrow left inactive';
  rightBtn.className = 'carousel-arrow right active';

  leftBtn.innerHTML = '<img src="/_src/icons/subscriber-icons/left-arrow-black.svg" alt="Left">';
  rightBtn.innerHTML = '<img src="/_src/icons/subscriber-icons/right-arrow-black.svg" alt="Right">';

  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -350, behavior: 'smooth' });
    setTimeout(() => updateArrowState(carousel, leftBtn, rightBtn), 300);
  });

  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 350, behavior: 'smooth' });
    setTimeout(() => updateArrowState(carousel, leftBtn, rightBtn), 300);
  });

  navContainer.append(leftBtn, rightBtn);

  /* =========================
     Final DOM
  ========================= */
  carouselWrapper.append(carousel, navContainer);
  enableDragScroll(carousel);

  block.innerHTML = '';

  if (showPreview && mainVideoContainer) {
    block.appendChild(mainVideoContainer);
  }

  block.appendChild(carouselWrapper);

  carousel.addEventListener('scroll', () => {
    updateArrowState(carousel, leftBtn, rightBtn);
  });
}
