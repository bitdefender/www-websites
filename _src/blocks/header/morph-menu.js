import images from './morph-menu-images.js';

// desktop only; below 1200px the AEM mega menu is a drill-down panel
const DESKTOP = '(min-width: 1200px) and (hover: hover) and (pointer: fine)';
const CLOSE_DELAY = 150;
// minimum distance between the card and the viewport edges
const EDGE = 16;

/**
 * @param {HTMLAnchorElement} link
 * @returns {string|undefined} the banner of the linked page, any locale
 */
const imageFor = (link) => {
  const { pathname } = new URL(link.href, window.location.href);
  return images[pathname.replace(/^\/[a-z]{2}-[a-z]{2}(?=\/)/i, '').replace(/\/$/, '')];
};

/**
 * @param {HTMLElement} panel a .mega-menu__third-level dropdown
 * @returns {Function|undefined} shows the first link's banner, when the panel has any
 * adds an image pane next to the links; hovering a link shows its page's banner
 */
function addPreview(panel) {
  const links = [...panel.querySelectorAll('a.navigation__link')].filter(imageFor);
  if (!links.length) return undefined;

  const content = panel.firstElementChild || panel;
  const preview = document.createElement('div');
  preview.className = 'morph-menu__preview';
  preview.setAttribute('aria-hidden', 'true');
  content.classList.add('morph-menu__content--preview');
  content.append(preview);

  const loaded = new Map();
  let wanted;
  // keep the current image until the next one is decoded, then crossfade
  const show = (src) => {
    wanted = src;
    let image = loaded.get(src);
    if (!image) {
      image = document.createElement('img');
      image.alt = '';
      image.src = src;
      loaded.set(src, image);
      preview.append(image);
    }
    image.decode().catch(() => {}).then(() => {
      if (wanted !== src) return;
      loaded.forEach((other) => other.classList.toggle('morph-menu__preview-image--shown', other === image));
    });
  };

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => show(imageFor(link)));
    link.addEventListener('focus', () => show(imageFor(link)));
  });
  return () => show(imageFor(links[0]));
}

/**
 * @param {HTMLElement} bar a .mega-menu__second-level row of dropdown triggers
 * one card is shared by every dropdown in the row: it moves and resizes to the
 * hovered item's panel while the old and new panels crossfade inside it
 */
function morphBar(bar) {
  const items = [...bar.querySelectorAll('.mega-menu__l2-item')];
  const panelOf = (item) => item.querySelector(':scope > .mega-menu__third-level');
  if (!items.some(panelOf)) return;

  const card = document.createElement('div');
  card.className = 'morph-menu__card';
  bar.append(card);

  const previews = new Map();
  items.filter(panelOf).forEach((item) => previews.set(panelOf(item), addPreview(panelOf(item))));

  // each panel's own box and the card's current box, relative to the bar
  const boxes = new WeakMap();
  let cardBox = null;
  let active = null;
  let closeTimer;

  // clips a panel to a box, so its content never shows outside the card mid-morph
  const clip = (panel, box) => {
    const own = boxes.get(panel);
    const gap = parseFloat(getComputedStyle(panel).paddingTop);
    const right = own.x + own.w - (box.x + box.w);
    panel.style.clipPath = `inset(${gap}px ${right}px ${own.h - box.h}px ${box.x - own.x}px round var(--morph-radius))`;
  };

  const close = () => {
    clearTimeout(closeTimer);
    bar.classList.remove('morph-menu--open');
    active?.classList.remove('morph-menu__item--active');
    active = null;
  };

  const open = (item) => {
    clearTimeout(closeTimer);
    if (item === active || !window.matchMedia(DESKTOP).matches) return;

    const panel = panelOf(item);
    const content = panel.firstElementChild || panel;
    previews.get(panel)?.();
    const barBox = bar.getBoundingClientRect();
    const trigger = (item.querySelector('.mega-menu__l2-link') || item).getBoundingClientRect();
    const w = content.offsetWidth;
    // line the panel text up with the trigger text
    const x = trigger.left - barBox.left - parseFloat(getComputedStyle(content).paddingLeft);
    const box = {
      x: Math.max(EDGE, Math.min(x, barBox.width - w - EDGE)),
      w,
      h: content.offsetHeight,
    };

    panel.style.left = `${box.x}px`;
    boxes.set(panel, box);

    // the new panel starts out clipped to where the card is now and grows with it
    panel.style.transition = 'none';
    clip(panel, active ? cardBox : box);
    panel.getBoundingClientRect();
    panel.style.transition = '';
    clip(panel, box);
    if (active) clip(panelOf(active), box);

    // opening from closed drops the card in place instead of morphing from the last spot
    bar.classList.toggle('morph-menu--entering', !active);
    bar.style.setProperty('--morph-x', `${box.x}px`);
    bar.style.setProperty('--morph-w', `${box.w}px`);
    bar.style.setProperty('--morph-h', `${box.h}px`);

    active?.classList.remove('morph-menu__item--active');
    item.classList.add('morph-menu__item--active');
    active = item;
    cardBox = box;
    bar.classList.add('morph-menu--open');
  };

  const closeSoon = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  };

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => (panelOf(item) ? open(item) : close()));
    item.addEventListener('focusin', () => (panelOf(item) ? open(item) : close()));
  });
  card.addEventListener('animationend', () => bar.classList.remove('morph-menu--entering'));
  bar.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  bar.addEventListener('mouseleave', closeSoon);
  bar.addEventListener('focusout', (e) => {
    if (!bar.contains(e.relatedTarget)) close();
  });
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  window.addEventListener('resize', close);
}

/**
 * @param {ShadowRoot} root the shadow root the AEM mega menu is mounted in
 * replaces the full-width dropdowns of the AEM mega menu with one morphing card
 */
export default function morphMegaMenu(root) {
  const container = root.querySelector('.mega-menu__container');
  if (!container) return;

  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = new URL('./morph-menu.css', import.meta.url).href;
  root.append(styles);

  container.classList.add('morph-menu');
  container.querySelectorAll('.mega-menu__second-level').forEach(morphBar);
}
