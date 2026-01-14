const STORAGE_KEY = 'bottom-popup:dismissed';

function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 768px)').matches;
}

export default function decorate(block) {
  // only mobile
  if (!isMobile()) {
    block.remove();
    return;
  }

  // akready closed
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    block.remove();
    return;
  }

  const blockParent = block.closest('.section');
  block.classList.add('bottom-popup');

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'bottom-popup__close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  block.prepend(closeBtn);

  closeBtn.addEventListener('click', () => {
    blockParent.classList.remove('is-visible');
    block.classList.remove('is-visible');
    localStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => block.remove(), 300);
  });

  // slide in from bottom
  requestAnimationFrame(() => {
    blockParent.classList.add('is-visible');
    block.classList.add('is-visible');
  });
}
