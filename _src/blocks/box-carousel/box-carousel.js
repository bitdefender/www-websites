import Glide from '@glidejs/glide';
import { debounce } from '@repobit/dex-utils';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const [titleEl, ...slides] = [...block.children];
  const isTestimonials = block.closest('.section')?.classList.contains('testimonials');
  const isTrusted = block.classList.contains('trusted-carousel');
  const slidesHTML = slides.map((slide) => {
    const row = slide.children[0];
    const colMedia = row?.children?.[0];
    const colTitle = row?.children?.[1];
    const colSubSecondary = row?.children?.[2];
    const colSubPrimary = row?.children?.[3];
    const hasImg = colMedia?.querySelector?.('img, picture, .icon');

    if (isTestimonials && block.classList.contains('reviews')) {
      let subSecondary = colSubSecondary?.innerHTML || '';
      let subPrimary = (() => {
        if (colSubPrimary != null) return colSubPrimary?.innerHTML || '';
        return '';
      })();

      if (
        !colSubPrimary?.textContent?.trim()
        && colSubSecondary?.textContent?.trim()
        && !colSubSecondary?.querySelector('strong')
      ) {
        subPrimary = colSubSecondary?.innerHTML || '';
        subSecondary = '';
      }

      return `
        <li class="carousel-item glide__slide">
          <div class="img-container">${colMedia?.innerHTML}</div>
          <p class="title">${colTitle?.outerHTML}</p>
          <div class="subtitle-secondary">${subSecondary ?? ''}</div>
          <div class="subtitle">${subPrimary ?? ''}</div>
        </li>`;
    }

    const mediaBlock = (() => {
      if (!isTestimonials) return (colMedia?.innerHTML ?? '');
      return `<div class="img-container">${hasImg ? colMedia?.innerHTML : ''}</div>`;
    })();

    const titleHTML = (() => {
      if (isTestimonials) return (hasImg ? colTitle?.outerHTML ?? colMedia?.outerHTML : colMedia?.outerHTML) ?? '';
      return colTitle?.outerHTML ?? '';
    })();

    const subSecondary = (() => {
      if (isTestimonials) return (hasImg ? colSubSecondary?.innerHTML : colTitle?.innerHTML) ?? '';
      return '';
    })();

    const subPrimary = (() => {
      if (isTestimonials) return (hasImg ? colSubPrimary?.innerHTML : colTitle?.innerHTML) ?? '';
      return colSubSecondary?.innerHTML ?? '';
    })();

    return `
      <li class="carousel-item glide__slide">
        ${mediaBlock}
        <p class="title">${titleHTML}</p>
        ${isTestimonials ? `<div class="subtitle-secondary">${subSecondary}</div>` : ''}
          <div class="subtitle">${subPrimary}</div>
      </li>`;
  }).join('');

  // Only one carousel-nav block: your original one with div.navigation-item
  const navDotsHTML = slides.map((_, i) => `
    <div class="navigation-item ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
  `).join('');

  const arrowsHTML = `
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
  `;

  block.classList.add('default-content-wrapper');
  block.innerHTML = `
    <div class="carousel-header">
      <div class="title">${titleEl?.children[0]?.innerHTML ?? ''}</div>
      <div class="arrows d-flex">${arrowsHTML}</div>
    </div>

    <div class="carousel-container glide">
      <div class="carousel glide__track" data-glide-el="track">
        <ul class="glide__slides">
          ${slidesHTML}
        </ul>
      </div>

      <div class="carousel-nav">
        ${navDotsHTML}
      </div>
    </div>
  `;

  decorateIcons(block);

  block.innerHTML = block.innerHTML.replaceAll('---', '<hr />');

  const glide = new Glide(block.querySelector('.glide'), {
    type: (slides.length > (isTrusted ? 1 : 4)) ? 'carousel' : 'slider',
    gap: 20,
    perView: isTrusted ? 1 : Math.min(slides.length, 4),
    rewind: false,
    bound: slides.length <= (isTrusted ? 1 : 4),
    breakpoints: isTrusted
      ? {}
      : {
        991: { perView: Math.min(slides.length, 2) },
        767: { perView: 1 },
      },
  });

  const arrowsEl = block.querySelector('.arrows');
  const showArrows = () => { arrowsEl.style.display = (slides.length > (glide.settings.perView || 1)) ? 'flex' : 'none'; };
  glide.on(['mount.after', 'update', 'run'], showArrows);
  showArrows();

  glide.mount();

  function updateNav() {
    const navDots = block.querySelectorAll('.navigation-item');
    navDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === glide.index);
    });
  }

  // Arrow click handlers to update glide
  const leftArrow = block.querySelector('.left-arrow');
  const rightArrow = block.querySelector('.right-arrow');

  function updateArrows() {
    if (!leftArrow || !rightArrow) return;

    const currentIndex = glide.index;
    const perView = glide.settings.perView || 1;
    const totalSlides = slides.length;

    if (currentIndex === 0) {
      leftArrow.classList.add('disabled');
    } else {
      leftArrow.classList.remove('disabled');
    }

    if (currentIndex >= totalSlides - perView) {
      rightArrow.classList.add('disabled');
    } else {
      rightArrow.classList.remove('disabled');
    }
  }

  glide.on('run', () => {
    updateNav();
    updateArrows();
  });

  // Add click handlers for your nav dots to control glide
  const navDots = block.querySelectorAll('.navigation-item');
  navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.index);
      glide.go(`=${idx}`);
    });
  });

  if (leftArrow) {
    leftArrow.addEventListener('click', (e) => {
      e.preventDefault();
      glide.go('<');
    });
  }
  if (rightArrow) {
    rightArrow.addEventListener('click', (e) => {
      e.preventDefault();
      glide.go('>');
    });
  }

  window.addEventListener('resize', debounce(() => {
    glide.update();
    updateNav();
    updateArrows();
  }, 250));
  window.dispatchEvent(new Event('resize'));
}
