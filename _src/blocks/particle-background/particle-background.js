/* eslint-disable prefer-const */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import { debounce } from '@repobit/dex-utils';
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

function isView(viewport) {
  const element = document.querySelectorAll(`[data-${viewport}-detector]`)[0];
  return !!(element && getComputedStyle(element).display !== 'none');
}

async function init(block, aemOptions) {
  // Initialize tsParticles with the slim preset
  await loadSlim(tsParticles);

  const particleIdSelector = 'ts-particles';

  const particleDiv = document.createElement('div');
  particleDiv.setAttribute('id', particleIdSelector);

  if (aemOptions) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  } else {
    block.parentElement.classList.add('we-container');
  }

  const particleBackground = block.parentElement.querySelector('.particle-background');
  particleBackground.prepend(particleDiv);

  const options = {
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

  try {
    const container = await tsParticles.load({
      id: particleIdSelector,
      options,
    });

    if (container) {
      // tsParticles loaded successfully
      container.play();
    }
  } catch (error) {
    // Error handling silently
  }
}

// eslint-disable-next-line no-unused-vars
async function checkForMobile() {
  const isMobileView = isView('mobile');
  const container = tsParticles.domItem(0);

  if (!container) {
    if (!isMobileView) {
      // Initialize particles if not mobile and not initialized
      await init(document.querySelector('.particle-background').parentElement);
    }
    return;
  }

  if (isMobileView) {
    container.pause();
  } else {
    container.play();
  }
}

export default async function decorate(block, options) {
  await init(block, options);

  // uncomment this line if you want the bubbles to stop moving on mobile
  // window.addEventListener('resize', debounce(checkForMobile, 250));
}
