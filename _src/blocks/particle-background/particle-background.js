/* eslint-disable prefer-const */
/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isView(viewport) {
  const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
  return !!(element && getComputedStyle(element).display !== 'none');
}

let tsParticles;
let loadAll;

async function init(block) {
  // eslint-disable-next-line import/no-unresolved
  tsParticles = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.1.0/+esm')).tsParticles;
  // eslint-disable-next-line import/no-unresolved
  loadAll = (await import('https://cdn.jsdelivr.net/npm/@tsparticles/all@3.1.0/+esm')).loadAll;

  const particleIdSelector = 'ts-particles';

  const particleDiv = document.createElement('div');
  particleDiv.setAttribute('id', particleIdSelector);

  block.parentElement.classList.add('we-container');
  const particleBackground = block.parentElement.querySelector('.particle-background');
  particleBackground.prepend(particleDiv);

  async function loadParticles(options) {
    await loadAll(tsParticles);

    await tsParticles.load({ id: particleIdSelector, options });
  }

  const configs = {
    particles: {
      number: {
        value: 20,
      },
      color: {
        value: '#ffffff',
      },
      links: {
        enable: true,
        distance: 200,
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.6,
      },
      size: {
        value: {
          min: 2,
          max: 4,
        },
      },
      move: {
        enable: true,
        speed: 0.5,
      },
    },
    background: {
      color: '#016DFF',
    },
    poisson: {
      enable: true,
    },
    fullScreen: { enable: false },
  };

  await loadParticles(configs);
}

// eslint-disable-next-line no-unused-vars
async function checkForMobile() {
  const isMobileView = isView('mobile');
  if (isMobileView && (!tsParticles && !loadAll)) {
    return;
  }

  if (isMobileView && tsParticles) {
    const particles = tsParticles.domItem(0);
    particles.pause();
    return;
  }

  if (!isMobileView && (!tsParticles && !loadAll)) {
    await init();
    return;
  }

  const particles = tsParticles.domItem(0);
  particles.play();
}

export default async function decorate(block) {
  await init(block);

  // uncomment this line if you want the bubbles to stop moving on mobile
  // window.addEventListener('resize', debounce(checkForMobile, 250));

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
