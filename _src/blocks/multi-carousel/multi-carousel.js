/* eslint-disable */
import { initAnimations } from '../../scripts/vendor/parallax/icons-parallax.js';

function createCarousel(block, shouldAutoplay = false, videos = undefined, titles = undefined, startsfrom = 0) {
  const parentSection = block.closest('.section');
  if (parentSection.classList.contains('animationn')) {
    //block.children
  } else {
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

        const table = contentElement.querySelector('table');

        if (table) {
          const html = `
            <div class="parallax-card">
              ${[...table.querySelectorAll('td p')].map((icon, k) => {
            const [src, txt] = icon.textContent.split('|').map(s => s.trim());
            return `
                  <div class="parallax-icon parallax-pos-${k + 1}" data-about-id="${k}">
                    <img class="parallax-icon-16" src="/common/icons/${src}.svg" alt="${txt || 'Bitdefender'}">
                    ${txt || ''}
                  </div>
                `;
          }).join('')}
            </div>
          `;

          carouselItem.insertAdjacentHTML('afterbegin', html);
          table.remove();
        }

        carouselItem.appendChild(contentElement);

        const parallaxCard = carouselItem.querySelector('.parallax-card');
        if (parallaxCard) initAnimations(parallaxCard);
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
}

export default function decorate(block) {
  const parentSection = block.closest('.section');
  let shouldAutoplay = false;
  const startsfrom = parentSection.getAttribute('data-startsfrom') || 0;

  if (parentSection.getAttribute('data-autoplay') === 'true') {
    shouldAutoplay = true;
  }

  if (parentSection.classList.contains('animationn')) {
    console.log('block ', block)

    /*block.innerHTML = `<div class="bd-cards carousel-container">
      <div class="carousel-item bd-card bd-card--mobile">
        <div class="bd-badge bd-pos-top-1" data-line="b">
          <img class="bd-icon-16" src="/common/icons/mvno-box-1-1.svg" alt="">
          Malware
        </div>
        <div class="bd-badge-icon bd-pos-1" data-line="b c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-1-2.svg" alt="">
        </div>

        <div class="bd-badge bd-device-count" data-line="b c">1 Device</div>
        <h3 class="bd-card-title">Mobile<br>Protection</h3>
        <p class="bd-card-desc">Essential security designed for mobile-first users</p>
        <p class="bd-card-desc">Protect a single smartphone against malware, scams, and unsafe browsing, perfect for prepaid and price-sensitive subscribers.</p>
        <p class="bd-card-desc">Protect the device tied to the SIM.</p>

        <span class="bd-badge bd-pos-2" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-1-3.svg" alt="">
          Scam
        </span>
        <span class="bd-badge bd-pos-3" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-1-4.svg" alt="">
          Unsafe Browsing
        </span>
      </div>

      <div class="carousel-item bd-card bd-card--multi">
        <div class="bd-badge bd-pos-top-1" data-line="b">
          <img class="bd-icon-16" src="/common/icons/mvno-box-2-3.svg" alt="">
          macOS
        </div>
        <div class="bd-badge bd-pos-top-2" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-2-4.svg" alt="">
          iOS
        </div>
        <div class="bd-badge-icon bd-pos-1" data-line="b">
          <img class="bd-icon-24" src="/common/icons/mvno-box-2-2.svg" alt="">
        </div>
        <div class="bd-badge-icon bd-pos-2" data-line="b c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-2-1.svg" alt="">
        </div>
        <div class="bd-badge-icon bd-pos-3" data-line="c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-2-5.svg" alt="">
        </div>

        <div class="bd-badge bd-device-count" data-line="b c">3 Devices</div>
        <h3 class="bd-card-title">Mobile &amp; Computer<br>Protection</h3>
        <p class="bd-card-desc">Multi-device security for everyday digital users</p>
        <p class="bd-card-desc">Extend protection across smartphones and computers with cross-platform coverage (Android, iOS, Windows, macOS).</p>
        <p class="bd-card-desc">Ideal for upselling households, multi-SIM users, and professionals.</p>

        <span class="bd-badge bd-pos-4" data-line="b">
          <img class="bd-icon-16" src="/common/icons/mvno-box-2-6.svg" alt="">
          Multi-SIM
        </span>
        <span class="bd-badge bd-pos-5" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-2-7.svg" alt="">
          Android
        </span>
      </div>

      <div class="carousel-item bd-card bd-card--family">
        <div class="bd-badge bd-pos-top-1" data-line="b">
          <img class="bd-icon-16" src="/common/icons/mvno-box-3-4.svg" alt="">
          Password Manager
        </div>
        <div class="bd-badge bd-pos-top-2" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-3-1.svg" alt="">
          VPN
        </div>
        <div class="bd-badge-icon bd-pos-1" data-line="b">
          <img class="bd-icon-24" src="/common/icons/mvno-box-3-2.svg" alt="">
        </div>
        <div class="bd-badge-icon bd-pos-2" data-line="b c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-3-4.svg" alt="">
        </div>
        <div class="bd-badge-icon bd-pos-3" data-line="c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-3-3.svg" alt="">
        </div>
        <div class="bd-badge-icon bd-pos-4" data-line="b c">
          <img class="bd-icon-24" src="/common/icons/mvno-box-3-5.svg" alt="">
        </div>

        <div class="bd-badge bd-device-count" data-line="b c">5 Devices</div>
        <h3 class="bd-card-title">Family<br>Protection</h3>
        <p class="bd-card-desc">Premium protection for connected families</p>
        <p class="bd-card-desc">Secure multiple devices with advanced features like VPN, Password Manager, and Parental Control.</p>
        <p class="bd-card-desc">Designed for higher-value subscribers and shared plans.</p>

        <span class="bd-badge bd-pos-5" data-line="b">
          <img class="bd-icon-16" src="/common/icons/mvno-box-3-6.svg" alt="">
          Family Plan
        </span>
        <span class="bd-badge bd-pos-6" data-line="c">
          <img class="bd-icon-16" src="/common/icons/mvno-box-3-7.svg" alt="">
          Parental Control
        </span>
      </div>

    </div>`;*/
  } else {
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
}
