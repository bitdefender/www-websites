const decodeUpgrade = (encoded) => {
  if (!encoded) return null;

  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    while (base64.length % 4) {
      base64 += '=';
    }

    return atob(base64);
  } catch (error) {
    return null;
  }
};

const getParam = (param) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
};

const createLoader = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'upgrade-loader';

  const progress = document.createElement('div');
  progress.className = 'upgrade-loader-progress';

  wrapper.append(progress);

  return wrapper;
};

export default function decorate(block) {
  const upgrade = getParam('upgrade');
  if (!upgrade) return;

  const redirectUrl = decodeUpgrade(upgrade);
  if (!redirectUrl) return;

  const loader = createLoader();
  block.append(loader);

  const progress = loader.querySelector('.upgrade-loader-progress');

  // reset + trigger animation
  progress.style.width = '0';
  setTimeout(() => {
    progress.style.transition = 'width 8s linear';
    progress.style.width = '100%';
  }, 50);

  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 8000);
}
