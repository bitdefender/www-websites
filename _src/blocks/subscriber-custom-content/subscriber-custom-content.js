import { addScript } from '../../scripts/utils/utils.js';

export default function decorate(block) {
  const allItems = block.querySelectorAll('td');
  block.innerHTML = `<div class="flex">
      <div class="column">
        <div class="card tall medium">
          <div class="lottie-wrapper">
            <div id="dns-background" class="lottie-container dns-background mask"></div>
            <div id="dns" class="lottie-container dns mask"></div>
            <div class="icon icon-effects">
              <img src="/_src/icons/subscriber-icons/dns.svg" alt="Parental Protection">
            </div>
          </div>
          <p>${allItems[0].innerHTML}</p>
        </div>
        <div class="grid" style="justify-content: space-between;">

          <div class="card small">
            <div class="lottie-wrapper">
              <div class="icon icon-effects">
                <img src="/_src/icons/subscriber-icons/router.svg" alt="Parental Protection">
              </div>
            </div>
            <p>${allItems[1].innerHTML}</p>
          </div>

          <div class="card small">
            <div class="lottie-wrapper">
              <div class="icon icon-effects">
                <img src="/_src/icons/subscriber-icons/parental.svg" alt="Parental Protection">
              </div>
            </div>
            <p>${allItems[2].innerHTML}</p>
          </div>
        </div>
      </div>

      <div class="column large">

        <div class="card big" style="text-align: center; justify-content: center;">
          <div class="lottie-wrapper">
            <div id="devices" class="lottie-container devices mask"></div>
            <div class="icon icon-effects devices">
              <img src="/_src/icons/subscriber-icons/parental.svg" alt="Parental Protection">
            </div>
          </div>
          <p>${allItems[3].innerHTML}</p>
        </div>
        <div class="row" style="justify-content: space-between;">

          <div class="card medium">
            <div class="lottie-wrapper">
              <div class="lottie-container password-background mask">
                <img src="/_src/icons/subscriber-icons/password-background.svg" alt="Parental Protection">
              </div>
              <div id="password" class="lottie-container password mask"></div>
              <div class="icon icon-effects">
                <img src="/_src/icons/subscriber-icons/password.svg" alt="Parental Protection">
              </div>
            </div>
            <p>${allItems[4].innerHTML}</p>
          </div>

          <div class="card medium">
            <div class="lottie-wrapper">
              <div class="box icon icon-effects">
                <div class="box-content">
                  <div class="lottie-wrapper">
                    <div id="identity" class="lottie-container identity"></div>
                  </div>
                  <div class="icon identity">
                    <img src="/_src/icons/subscriber-icons/identity.svg" alt="Parental Protection">
                  </div>
                </div>
              </div>
              <div id="identity-background" class="lottie-container identity-background mask"></div>
            </div>
            <p>${allItems[5].innerHTML}</p>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="grid" style="justify-content: space-between;">
          <div class="card small">
            <div class="lottie-wrapper">
              <div class="icon icon-effects">
                <img src="/_src/icons/subscriber-icons/vpn.svg" alt="Parental Protection">
              </div>
            </div>
            <p>${allItems[6].innerHTML}</p>
          </div>

          <div class="card small">
            <div class="lottie-wrapper">
              <div class="icon icon-effects">
                <img src="/_src/icons/subscriber-icons/vpn-at-home.svg" alt="Parental Protection">
              </div>
            </div>
            <p>${allItems[7].innerHTML}</p>
          </div>
        </div>

        <div class="card tall medium">
          <div class="lottie-wrapper">
            <div id="home-background" class="lottie-container home-background mask"></div>
            <div id="home" class="lottie-container home"></div>
            <div class="icon icon-effects home"> </div>
          </div>
          <p>${allItems[8].innerHTML}</p>
        </div>
      </div>
    </div>`;

  addScript(
    'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js',
    {},
    'defer',
    () => {
      if (typeof window.lottie !== 'undefined') {
        initLottieAnimations(block);
      } else {
        console.error('Lottie failed to load properly.');
      }
    },
    (err) => {
      console.error('Failed to load Lottie script', err);
    },
    'module'
  );
}

function initLottieAnimations(block) {
  const animationConfig = {
    password: {
      segment1: [0, 110],
      segment2: [110, 220],
      segment3: [220, 330]
    },

    home: {
      segment1: [0, 20],
      segment2: [20, 40]
    },

    devices: {
      segment1: [0, 60],
      segment2: [60, 120],
      segment3: [120, 180],
      segment4: [180, 240],
      segment5: [240, 300],
      segment6: [300, 360],
      segment7: [360, 420]
    },

    dnsBackground: {
      segment1: [0, 60],
      segment2: [60, 120],
      segment3: [120, 180],
      segment4: [180, 240],
      segment5: [240, 300],
      segment6: [300, 360],
      segment7: [360, 420],
      segment8: [420, 480]

    },

    dns: {
      segment1: [0, 120],
      segment2: [120, 240],
      segment3: [240, 360],
      segment4: [360, 480]
    }

  };

  function loadAnimation(container) {
    return new Promise(resolve => {
      const animation = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: `/_src/icons/subscriber-icons/lottie/${container.id}/data.json`
      });
      animation.addEventListener('data_ready', () => {
        container.animation = animation;
        resolve();
      });
      animation.addEventListener('data_failed', () => {
        console.error(`Failed to load animation for ${container.id}`);
        resolve();
      });
    });
  }

  async function loadAnimations() {
    const containers = document.querySelectorAll('.lottie-container');
    const loaders = Array.from(containers)
      .filter(container => container.id)
      .map(container => loadAnimation(container));

    await Promise.all(loaders);
    initInteractivity();
  }

  function initInteractivity() {
    document.querySelectorAll('.lottie-container').forEach(container => {
      if (!container.id || !container.animation) return;
      const animation = container.animation;
      const card = container.closest('.card');
      if (!card) return;

      if (container.id === 'devices') {
        setupDevicesAnimation(card, animation);
      } else if (container.id === 'password') {
        setupPasswordAnimation(card, animation);
      } else if (container.id === 'home') {
        setupHomeAnimation(card, animation);
      } else if (container.id === 'identity-background') {
        setupIdentityBackgroundAnimation(card, animation);
      } else if (container.id === 'home-background') {
        setupHomeBackgroundAnimation(card, animation);
      } else if (container.id === 'identity') {
        setupIdentityAnimation(card, animation);
      } else if (container.id === 'dns-background') {
        setupDnsBackgroundAnimation(card, animation);
      } else if (container.id === 'dns') {
        setupDnsAnimation(card, animation);
      } else {
        setupDefaultAnimation(card, animation);
      }
    });
  }

  function setupDefaultAnimation(card, animation) {
    card.addEventListener('mouseenter', () => {
      animation.loop = true;
      animation.play();
    });
    card.addEventListener('mouseleave', () => {
      animation.stop();
    });
  }

  function setupDevicesAnimation(card, animation) {
    const config = animationConfig.devices;
    let currentSegmentIndex = 0;
    let isHovered = false;
    let forcedIncrement = false;

    function playCurrentSegment() {
      const segKey = 'segment' + (currentSegmentIndex + 1);
      const segment = config[segKey];
      animation.playSegments(segment, true);
      animation.removeEventListener('complete', onSegmentComplete);
      animation.addEventListener('complete', onSegmentComplete, { once: true });
    }

    function onSegmentComplete() {
      if (forcedIncrement) {
        forcedIncrement = false;
      } else {
        currentSegmentIndex = (currentSegmentIndex + 1) % 7;
      }
      if (isHovered) {
        playCurrentSegment();
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      forcedIncrement = false;
      playCurrentSegment();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (!forcedIncrement) {
        currentSegmentIndex = (currentSegmentIndex + 1) % 7;
        forcedIncrement = true;
      }
    });
  }

  function setupDnsAnimation(card, animation) {
    const config = animationConfig.dns;
    let currentSegmentIndex = 0;
    let isHovered = false;
    let forcedIncrement = false;

    function playCurrentSegment() {
      const segKey = 'segment' + (currentSegmentIndex + 1);
      const segment = config[segKey];
      animation.playSegments(segment, true);
      animation.removeEventListener('complete', onSegmentComplete);
      animation.addEventListener('complete', onSegmentComplete, { once: true });
    }

    function onSegmentComplete() {
      if (forcedIncrement) {
        forcedIncrement = false;
      } else {
        currentSegmentIndex = (currentSegmentIndex + 1) % 4;
      }
      if (isHovered) {
        playCurrentSegment();
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      forcedIncrement = false;
      playCurrentSegment();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (!forcedIncrement) {
        currentSegmentIndex = (currentSegmentIndex + 1) % 4;
        forcedIncrement = true;
      }
    });
  }

  function setupPasswordAnimation(card, animation) {
    const config = animationConfig.password;
    let currentSegmentIndex = 0;
    let isHovered = false;
    let forcedIncrement = false;

    const container = card.querySelector('.lottie-container.password');
    if (!container) return;

    function playCurrentSegment() {
      const segKey = 'segment' + (currentSegmentIndex + 1);
      animation.playSegments(config[segKey], true);
      animation.removeEventListener('complete', onSegmentComplete);
      animation.addEventListener('complete', onSegmentComplete, { once: true });
    }

    function onSegmentComplete() {
      if (!forcedIncrement) {
        currentSegmentIndex = (currentSegmentIndex + 1) % 3;
      }
      forcedIncrement = false;
      if (isHovered) {
        playCurrentSegment();
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      forcedIncrement = false;
      container.style.opacity = '1';
      playCurrentSegment();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      container.style.opacity = '0';
      if (!forcedIncrement) {
        currentSegmentIndex = (currentSegmentIndex + 1) % 3;
        forcedIncrement = true;
      }
    });
  }

  function setupHomeAnimation(card, animation) {
    const config = animationConfig.home;
    const segment1 = config.segment1;
    const segment2 = config.segment2;

    let isHovered = false;
    let hasPlayedUnhover = false;

    function playSegment(segment, label) {
      const time = new Date().toLocaleTimeString();

      animation.playSegments(segment, true);

      animation.addEventListener('complete', function onSegmentComplete() {
        animation.pause();
        animation.removeEventListener('complete', onSegmentComplete);
      }, { once: true });
    }

    card.addEventListener('mouseenter', () => {
      if (!isHovered) {
        isHovered = true;
        hasPlayedUnhover = false;
        playSegment(segment1, "Hover segment");
      }
    });

    card.addEventListener('mouseleave', () => {
      if (isHovered) {
        isHovered = false;
        if (!hasPlayedUnhover) {
          playSegment(segment2, "Unhover segment");
          hasPlayedUnhover = true;
        }
      }
    });
  }

  function setupHomeBackgroundAnimation(card, animation) {
    card.addEventListener('mouseenter', () => {
      animation.setSpeed(1.0);
      animation.setDirection(1);
      animation.loop = true;
      animation.play();
    });

    card.addEventListener('mouseleave', () => {
      animation.loop = false;
      easeOutStop(animation);
    });
  }

  function setupIdentityBackgroundAnimation(card, animation) {
    card.addEventListener('mouseenter', () => {
      animation.setSpeed(1.0);
      animation.setDirection(1);
      animation.loop = true;
      animation.play();
    });

    card.addEventListener('mouseleave', () => {
      animation.loop = false;
      easeOutStop(animation);
    });
  }

  function setupDnsBackgroundAnimation(card, animation) {
    const config = animationConfig.dnsBackground;
    let currentSegmentIndex = 0;
    let isHovered = false;
    let forcedIncrement = false;

    function playCurrentSegment() {
      const segKey = 'segment' + (currentSegmentIndex + 1);
      const segment = config[segKey];
      animation.playSegments(segment, true);
      animation.removeEventListener('complete', onSegmentComplete);
      animation.addEventListener('complete', onSegmentComplete, { once: true });
    }

    function onSegmentComplete() {
      if (forcedIncrement) {
        forcedIncrement = false;
      } else {
        currentSegmentIndex = (currentSegmentIndex + 1) % 8;
      }
      if (isHovered) {
        playCurrentSegment();
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      forcedIncrement = false;
      playCurrentSegment();
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (!forcedIncrement) {
        currentSegmentIndex = (currentSegmentIndex + 1) % 8;
        forcedIncrement = true;
      }
    });
  }

  function easeOutStop(animation) {
    const totalFrames = 20;
    const duration = (totalFrames / animation.frameRate) * 1000;

    let speed = 1.0;
    const interval = setInterval(() => {
      speed -= 0.05;
      if (speed <= 0) {
        speed = 0;
        clearInterval(interval);
        animation.pause();
      }
      animation.setSpeed(Math.max(speed, 0));
    }, duration / (1.0 / 0.05));
  }

  function setupIdentityAnimation(card, animation) {
    card.addEventListener('mouseenter', () => {
      animation.loop = true;
      animation.play();
    });

    card.addEventListener('mouseleave', () => {
      animation.loop = false;
      animation.stop();
    });
  }

  loadAnimations().catch(console.error);
}
