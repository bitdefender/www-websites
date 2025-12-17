/* eslint-disable indent */
import Glide from '@glidejs/glide';

// load YouTube IFrame API once
function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });
}

export default async function decorate(block) {
  const { navigationPosition, arrows } = block.closest('.section').dataset;
  const slides = [...block.children];
  const navItemsNames = slides.map((slideEl) => slideEl.children[0].firstElementChild.textContent);

  block.classList.add('default-content-wrapper');
  block.innerHTML = `
    <div class="carousel-container glide">
      ${!navigationPosition ? `<div class="navigation-wrapper">
        <div class="first-nav">
          ${navItemsNames.map((text, index) => `
            <div class="nav-item ${index === 0 ? 'active' : ''}" data-glide-dir="=${index}">
              <span class="text">${text}</span><span class="pill"></span>
            </div>`).join('')}
        </div>
        
        <div class="second-nav" ${arrows && arrows === 'hide' ? 'style="display: none;"' : ''}>
         <a href class="arrow disabled left-arrow">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,752) scale(0.1,-0.1)">
                <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
                l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
                109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
                -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
                896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
                16z"></path>
              </g>
            </svg>
          </a>
         <a href class="arrow right-arrow">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0,752) scale(0.1,-0.1)">
                <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
                l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
                109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
                -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
                896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
                16z"></path>
              </g>
            </svg>
          </a>
        </div>
      </div>` : ''}

      <div class="glide__track content-wrapper" data-glide-el="track">
        <ul class="glide__slides">
          ${slides.map((slide) => {
            const firstDiv = slide.querySelector('div');
            const lastDiv = slide.querySelector('div:last-of-type');

            return `<li class="glide__slide slide">
              <div class="left-content">
                ${firstDiv ? firstDiv.innerHTML : ''}
              </div>
              <div class="right-content">
                ${(() => {
                  if (!lastDiv) return '';
                  const content = lastDiv.textContent.trim();

                  if (content.startsWith('https://www.youtube.com/embed/')) {
                    try {
                      const url = new URL(content);
                      url.searchParams.set('enablejsapi', '1');
                      url.searchParams.set('origin', window.location.origin);
                      const finalSrc = url.toString();
                      return `<iframe width="100%" height="100%" src="${finalSrc}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                    } catch (e) {
                      // Fallback if URL parsing fails, use original
                      return `<iframe width="100%" height="100%" src="${content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                    }
                  }

                  return lastDiv.innerHTML;
                })()}
              </div>
            </li>`;
          }).join('')}
        </ul>
      </div>

      ${(navigationPosition && navigationPosition === 'bottom' && `<div class="navigation-wrapper">
        <div class="first-nav">
          ${navItemsNames.map((text, index) => `
            <div class="nav-item ${index === 0 ? 'active' : ''}" data-glide-dir="=${index}">
              <span class="text">${text}</span><span class="pill"></span>
            </div>`).join('')}
        </div>`) ?? ''}
    </div>
  `;

  const navItems = block.querySelectorAll('.nav-item');
  const glideEl = block.querySelector('.glide');
  const leftArrow = block.querySelector('.left-arrow');
  const rightArrow = block.querySelector('.right-arrow');

  const glide = new Glide(glideEl, {
    type: 'slider',
    startAt: 0,
    perView: 1,
    autoplay: 9000,
    keyboard: true,
    swipeThreshold: 40,
    dragThreshold: 60,
    touchAngle: 45,
    perTouch: 1,
    animationDuration: 250,
    animationTimingFunc: 'ease-out',
    hoverpause: false,
  });

  glide.on('run.after', () => {
    const { index } = glide;
    navItems.forEach((item, i) => item.classList.toggle('active', i === index));
  });

  navItems.forEach((item, index) => item.addEventListener('click', () => glide.go(`=${index}`)));
  if (leftArrow) leftArrow.addEventListener('click', (e) => { e.preventDefault(); glide.go('<'); });
  if (rightArrow) rightArrow.addEventListener('click', (e) => { e.preventDefault(); glide.go('>'); });

  glide.mount();

  // pause/resume carousel on video play/pause
  const ytIframes = block.querySelectorAll('.right-content iframe[src*="youtube.com/embed"]');

  if (ytIframes.length > 0) {
    try {
      const YT = await loadYouTubeAPI();

      ytIframes.forEach((iframe) => {
        // eslint-disable-next-line no-new
        new YT.Player(iframe, {
          events: {
            onStateChange: (event) => {
              const state = event.data;

              if (state === YT.PlayerState.PLAYING) {
                // Video started - pause carousel
                glide.pause();
              } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
                // Video paused - resume carousel
                glide.play(9000);
              }
            },
          },
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('YouTube API failed to load', e);
    }
  }
}
