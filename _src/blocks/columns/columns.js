/* global lottie */
import { debounce, UserAgent } from '@repobit/dex-utils';
import { AdobeDataLayerService, ButtonClickEvent } from '@repobit/dex-data-layer';
import {
  matchHeights, createTag, renderNanoBlocks, addScript,
} from '../../scripts/utils/utils.js';

function getItemsToShow() {
  const width = window.innerWidth;
  return width <= 767 ? 1 : 3; // 1 item for mobile, 2 for tablet, 3 for desktop
}

function countSlides(carouselContent) {
  return Math.ceil(carouselContent.children.length - getItemsToShow() + 1);
}

function showSlides(carousel, slideNumber) {
  const carouselContent = carousel.querySelector('.columns.carousel > div:first-child');
  const itemsToShow = getItemsToShow();
  const translateXValue = -(carousel.clientWidth * slideNumber) / itemsToShow;

  carouselContent.style.transform = `translateX(${translateXValue}px)`;
  carouselContent.style.transition = 'transform 0.5s ease';
}

function hideExcessElements(carousel) {
  showSlides(carousel, 0); // Always show the first set initially
}

function setActiveButton(button, buttonsWrapper) {
  buttonsWrapper.querySelector('.active-button')?.classList.remove('active-button');
  button.classList.add('active-button');
}

function createNavigationButtons(numberOfSlides, carousel) {
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.className = 'carousel-buttons';

  Array.from({ length: numberOfSlides }, (_, i) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Slide ${i + 1}`);
    button.addEventListener('click', () => {
      if (!button.classList.contains('active-button')) {
        showSlides(carousel, i);
        setActiveButton(button, buttonsWrapper);
      }
    });
    buttonsWrapper.appendChild(button);
    return button;
  });

  buttonsWrapper.firstChild?.classList.add('active-button'); // Set first button as active
  return buttonsWrapper;
}

function setupCarousel(carousel, resetSlidePosition = false) {
  const carouselContent = carousel.querySelector('.columns.carousel > div');
  if (resetSlidePosition) carouselContent.style.transform = 'translateX(0px)';

  const buttonsWrapper = createNavigationButtons(countSlides(carouselContent), carousel);
  carousel.querySelector('.carousel-buttons')?.remove(); // Remove existing buttons
  carousel.appendChild(buttonsWrapper);
  hideExcessElements(carousel);
}

function setImageAsBackgroundImage() {
  const columns = document.querySelectorAll('.columns.text-over-image > div > div');

  columns.forEach((column) => {
    const image = column.querySelector('img');

    if (image) {
      const src = image.getAttribute('src');

      column.style.backgroundImage = `url(${src})`;

      // remove the p tag that contains the picture element
      const pContainer = image.closest('p');
      if (pContainer) {
        pContainer.remove();
      }
    }
  });
}

function setDynamicLink(dynamicLink, dynamicLinks, dynamicProducts) {
  switch (UserAgent.os) {
    case 'android':
      dynamicLink.href = dynamicLinks.androidLink;
      if (dynamicProducts.storeIdAndroid) {
        AdobeDataLayerService.push(new ButtonClickEvent(
          'trial downloaded',
          { productId: dynamicProducts.storeIdAndroid },
        ));
      }

      break;
    case 'ios':
      dynamicLink.href = dynamicLinks.iosLink;
      if (dynamicProducts.storeIdIos) {
        AdobeDataLayerService.push(new ButtonClickEvent(
          'trial downloaded',
          { productId: dynamicProducts.storeIdIos },
        ));
      }
      break;
    default:
      dynamicLink.href = dynamicLinks.defaultLink;
      if (dynamicProducts.storeId) {
        AdobeDataLayerService.push(new ButtonClickEvent(
          'trial downloaded',
          { productId: dynamicProducts.storeId },
        ));
      }
      break;
  }
}

const slug = (s) => s?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'tab';
function setupTabs({ block, firstTab }) {
  const section = block.closest('.section');
  const wrapper = block.closest('.columns-wrapper');

  const label = wrapper.previousElementSibling?.closest('.default-content-wrapper')?.textContent?.trim() || 'Tab';
  const id = slug(label);
  section.classList.add('columns-tabs');

  if (!block.closest('.section').classList.contains('hide-tabs')) {
    let tabsList = section.querySelector('.tabs-section');
    if (!tabsList) {
      tabsList = document.createElement('div');
      tabsList.className = 'tabs-section default-content-wrapper';
      tabsList.addEventListener('click', (e) => {
        const tab = e.target.closest('span[data-tab]');
        if (tab && tab && tab.dataset?.tab) {
          const showAll = tab.dataset.tab === firstTab.toLowerCase();
          section.querySelectorAll('.section-el').forEach((el) => {
            el.hidden = !showAll && !el.classList.contains(`section-${tab.dataset.tab}`);
          });
          tabsList.querySelectorAll('span').forEach((el) => {
            el.classList.toggle('active', el === tab);
          });

          AdobeDataLayerService.push(new ButtonClickEvent('click', { asset: tab.dataset.tab }));
        }
      });
      // add All tab once
      const all = document.createElement('span');
      all.className = 'tag active';
      all.dataset.tab = firstTab.toLowerCase();
      all.textContent = firstTab;
      tabsList.appendChild(all);
      section.prepend(tabsList);
    }

    const tab = document.createElement('span');
    tab.className = 'tag';
    tab.dataset.tab = id;
    tab.textContent = label;
    tabsList.appendChild(tab);
  }

  wrapper.classList.add('section-el', `section-${id}`);
  wrapper.previousElementSibling?.classList.add('section-el', `section-${id}`);
}

function initLottieAnimations(block) {
  // MARQUEE
  const marqueeEl = block.querySelector('.marquee');
  if (marqueeEl) {
    lottie.loadAnimation({
      container: marqueeEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/_src/scripts/vendor/lottie/marquee-data.json',
    });
  }

  // DNS
  const dnsEl = block.querySelector('.dns');
  if (dnsEl) {
    lottie.loadAnimation({
      container: dnsEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/_src/scripts/vendor/lottie/dns-data.json',
    });
  }

  // DNS BACKGROUND
  const dnsBgEl = block.querySelector('.dns-background');
  if (dnsBgEl) {
    lottie.loadAnimation({
      container: dnsBgEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/_src/scripts/vendor/lottie/dns-background-data.json',
    });
  }
}

export default function decorate(block) {
  const {
    linksOpenInNewTab, type, bckImage, firstTab, maxElementsInColumn, products, breadcrumbs, aliases,
    defaultLink, iosLink, androidLink, storeId, storeIdIos, storeIdAndroid,
  } = block.closest('.section').dataset;
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  if (bckImage) {
    block.style.backgroundImage = `url("${bckImage}")`;
    block.style.backgroundRepeat = "no-repeat";
    block.style.backgroundPosition = "right";
    block.style.backgroundSize = "auto 100%";
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      } else {
        const children = [...row.children];

        if (children.length === 1) {
          col.closest('div').classList.add('columns-title-col');
        } else {
          const firstParentIndex = children.indexOf(col.closest('div'));

          col.closest('div').classList.add('columns-text-col');
          if (firstParentIndex) {
            col.closest('div').classList.add('columns-right-col');
          } else {
            col.closest('div').classList.add('columns-left-col');
          }
        }
      }
    });
  });

  if (breadcrumbs && block.classList.contains('creators-banner')) {
    const breadcrumb = createTag('div', { class: 'breadcrumb' });
    block.querySelector('h2')?.prepend(breadcrumb);
  }

  // setup buylink, this can be used later as a starting point for prices.
  const productsAsList = products?.split(',');
  if (productsAsList) {
    // eslint-disable-next-line no-unused-vars
    [...block.children].forEach((row, _) => {
      [...row.children].forEach((col, colNumber) => {
        const [prodName, prodYears, prodUsers] = productsAsList[colNumber].trim().split('/');
        col.querySelector('a[href*="#buylink"]')?.setAttribute('data-store-buy-link', '');
        col.querySelector('a[href*="#buylink"]')?.setAttribute('data-store-render', '');
      });
    });
  }

  // setup data-store-id on mobal buttons
  aliases?.split(',').forEach((alias, i) => {
    [...block.children].forEach((row) => {
      row.children[i]
        ?.querySelector('a.button.modal')
        ?.setAttribute('product-id', alias.trim());
    });
  });

  if (linksOpenInNewTab === 'true') {
    block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
      anchorEl.target = '_blank';
      anchorEl.rel = 'noopener noreferrer';
    });
  }

  if (block.classList.contains('text-over-image')) {
    setImageAsBackgroundImage();
  }

  // If it has the carousel class, then setup the carousel
  if (block.classList.contains('carousel')) {
    setupCarousel(block);
  }

  window.addEventListener('resize', debounce(() => {
    // Check if the block still has the carousel class before resetting
    if (block.classList.contains('carousel')) {
      setupCarousel(block, true); // Pass true to reset the slide position
    }
  }, 250));
  window.dispatchEvent(new Event('resize')); // trigger resize to give width to columns

  const sectionDiv = document.querySelector('.columns-container[data-bg-image]');
  if (sectionDiv) {
    const bgImageUrl = sectionDiv.getAttribute('data-bg-image');
    if (bgImageUrl) {
      sectionDiv.style.setProperty('--bg-image-url', `url(${bgImageUrl})`);
    }
  }

  if (type && type === 'video_left') {
    block.closest('.section').classList.add('video-left');

    const leftCol = block.querySelector('.columns-img-col');
    const cell = leftCol.querySelector('tr:last-of-type');
    if (!cell) return;

    const raw = cell.innerHTML;

    // decode HTML
    const decoded = (() => {
      const t = document.createElement('textarea');
      t.innerHTML = raw;
      return t.value;
    })();

    // parse possible iframe
    const temp = document.createElement('div');
    temp.innerHTML = decoded;
    const iframe = temp.querySelector('iframe');

    /* youtube iframe */
    if (iframe && iframe.src.includes('youtube.com/embed')) {
      const id = iframe.src.match(/\/embed\/([^?]+)/)?.[1];
      if (!id) return;

      leftCol.innerHTML = `
        <div class="yt-preview">
          <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg">
          <button class="yt-play-btn"></button>
        </div>
      `;

      leftCol.firstElementChild.onclick = () => {
        iframe.src += iframe.src.includes('?') ? '&autoplay=1' : '?autoplay=1';
        leftCol.innerHTML = '';
        leftCol.appendChild(iframe);
      };

      return;
    }

    /* direct link */
    const videoPath = cell.innerText.trim();
    if (/\.(mp4|webm|ogg)$/i.test(videoPath)) {
      const poster = leftCol.querySelector('img')?.src || '';

      leftCol.innerHTML = `
        <video
          src="${videoPath}"
          controls
          playsinline
          ${poster ? `poster="${poster}"` : ''}>
        </video>
      `;
      return;
    }

    /* fallback */
    leftCol.innerHTML = decoded;
  }

  renderNanoBlocks(block.closest('.section'), undefined, undefined, block);

  const chatOptions = document.querySelector('.chat-options');
  if (chatOptions) {
    const cardButtons = chatOptions.querySelectorAll('.button-container');
    cardButtons.forEach((button) => {
      button.previousElementSibling.classList.add('chat-options-text');
    });
    matchHeights(chatOptions, '.chat-options-text');
    matchHeights(chatOptions, 'table');
  }
  block.querySelectorAll('h3')?.forEach((element) => {
    if (element.textContent.includes('{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}')) {
      element.textContent = element.textContent.replace('{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}', '{{=it.state.discount.percentage.max}}');
      element.classList.add('await-loader');
    }
  });

  const dynamicLink = block.closest('.section').querySelector('a[href*="#os-dynamic-link"]');
  if (dynamicLink) {
    const dynamicLinks = { defaultLink, iosLink, androidLink };
    const dynamicProducts = { storeId, storeIdAndroid, storeIdIos };
    setDynamicLink(dynamicLink, dynamicLinks, dynamicProducts);
  }

  // this will define the number of rows inside each card of the subgrid system
  // by dynamically setting this, i can set howewer much rows i want based on the number of
  // maximum elements expected in the row
  if (block.closest('.section').classList.contains('v-5') && maxElementsInColumn) {
    let cards = block.querySelectorAll('.columns-text-col');
    if (block.classList.contains('cards-with-img')) {
      cards = block.querySelectorAll('.columns > div > div');
    }

    cards.forEach((element) => {
      element.style['grid-row'] = `span ${maxElementsInColumn}`;
    });

    matchHeights(block, '.columns-container.v-5 .columns-wrapper .columns > div > div img');
  }

  // tabs version
  if (type && type === 'tabs') setupTabs({ block, firstTab });

  if (block.classList.contains('sidebar')) {
    const videoP = cols[1].querySelector('p');
    const content = videoP.innerText;
    if (content.startsWith('https://www.youtube.com/embed/')) {
      videoP.classList.add('iframe');
      cols[1].querySelector('p').innerHTML = `<iframe width="100%" height="232" src="${content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
  }

  matchHeights(block, 'h3');
  matchHeights(block, 'h4');
  if (block.closest('.section').classList.contains('dex-carousel-cards')) {
    matchHeights(block, 'div > div:not(:first-of-type) p:first-of-type');
    matchHeights(block, 'div > div:not(:first-of-type) ul');
  }

  if (block.classList.contains('text-over-image')) matchHeights(block, '.columns > div > div');

  if (block.closest('.section').classList.contains('multi-blocks')) {
    matchHeights(block.closest('.section'), '.columns');
    matchHeights(block.closest('.section'), 'table');
    matchHeights(block.closest('.section'), 'p:nth-last-of-type(2)');
    matchHeights(block.closest('.section'), '.columns > div');
  }
  if (block.closest('.section').classList.contains('fix-tables-heights')) {
    matchHeights(block, 'div.columns-text-col > table:nth-of-type(1)');
    matchHeights(block, 'div.columns-text-col > table:nth-of-type(2)');
  }
  if (block.classList.contains('awards-fragment')) {
    matchHeights(block, 'p:last-of-type');
  }

  if (block.closest('.section').classList.contains('responsible-ai')) {
    matchHeights(block, 'p');
  }

  if (block.closest('.section').classList.contains('online-safe-animated')) {
    block.querySelector('span.icon-online-safe-animated').closest('p').innerHTML = `<div id="lottieAnimation" class="security-window">
      <div class="security-window__header">
        <span class="security-window__dot security-window__dot--red"></span>
        <span class="security-window__dot security-window__dot--yellow"></span>
        <span class="security-window__dot security-window__dot--green"></span>
      </div>
      <div class="security-window__body">
         <div id="dns" class="dns lottie-container  mask">
           <div class="dns-background" class="lottie-container mask"></div>
         </div>
          <div class="marquee-wrap">
            <div class="marquee"></div>
          </div>
      </div>
    </div>
    
    <style>
      #lottieAnimation.security-window {
        max-height: 266px;
        overflow: hidden;
        border-radius: 14px;
        background: #0a3d91;
        margin-top: 2em;
      }

      #lottieAnimation .security-window__header {
        height: 36px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #063a86;
      }

      #lottieAnimation .security-window__dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      #lottieAnimation .security-window__dot--red {
        background: #ff5f56;
      }

      #lottieAnimation .security-window__dot--yellow {
        background: #ffbd2e;
      }

      #lottieAnimation .security-window__dot--green {
        background: #27c93f;
      }

      #lottieAnimation .security-window__body {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 40px;
        flex-direction: column;
        background: linear-gradient(135deg,
            #0a4fb3 0%,
            #1b6fe0 50%,
            #1f82ff 100%);
      }

      #lottieAnimation .dns {
        height: 150px;
      }

      #lottieAnimation .dns-background {
        top: 0;
        svg {
          width: 100px;
        }
        position: absolute;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 100%);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
      }

      #lottieAnimation .dns svg {
        width: 230px !important;
      }

      #lottieAnimation .marquee svg {
        width: 940px !important;
      }

      #lottieAnimation .marquee-gradient {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 100%);
        mix-blend-mode: multiply;
        opacity: 0.9;
      }

      #lottieAnimation .marquee-wrap {
        position: relative;
        height: auto;
        margin-top: 1em;
      }

      #lottieAnimation .marquee {
        width: 100%;
        height: 100%;
        -webkit-mask-image: linear-gradient(180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 100%);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-image: linear-gradient(180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 100%);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
      }

      #lottieAnimation .marquee svg {
        width: 100%;
        height: 100%;
      }
    </style>
    `;
  }

  addScript(
    'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js',
    {},
    'defer',
    () => {
      if (typeof window.lottie !== 'undefined') {
        initLottieAnimations(block);
      }
    },
    'module',
  );
}
