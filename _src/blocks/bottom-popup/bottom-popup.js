const STORAGE_KEY = 'bottom-popup:dismissed';

function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches ||
         window.matchMedia('(max-width: 768px)').matches;
}

function isIOS() {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function decorate(block) {
  // Only mobile
  if (!isMobile()) {
    block.remove();
    return;
  }

  // Already dismissed
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    block.remove();
    return;
  }

  const blockParent = block.closest('.section');
  block.classList.add('bottom-popup');

  // Add close button ONLY
  const closeBtn = document.createElement('button');
  closeBtn.className = 'bottom-popup__close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  block.prepend(closeBtn);

  closeBtn.addEventListener('click', () => {
    blockParent.classList.remove('is-visible');
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => block.remove(), 300);
  });

  // Slide in from bottom
  requestAnimationFrame(() => {
    blockParent.classList.add('is-visible');
  });

  // Optional: expose platform to CSS if needed
  block.dataset.platform = isIOS() ? 'ios' : 'android';
}
