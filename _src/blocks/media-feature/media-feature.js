import { getDsnBase } from '../../scripts/utils/utils.js';

const VIDEO_EXTS = /\.(mp4|webm|ogg)(\?.*)?$/i;

const isMediaCell = (cell) => !!(
  cell.querySelector('picture, video, iframe')
  || VIDEO_EXTS.test(cell.textContent.trim())
);

const buildMediaSlot = (cell) => {
  const picture = cell.querySelector('picture');
  if (picture) {
    const clone = picture.cloneNode(true);
    clone.setAttribute('slot', 'image');
    return clone;
  }

  const video = cell.querySelector('video');
  if (video) {
    const clone = video.cloneNode(true);
    clone.setAttribute('slot', 'image');
    return clone;
  }

  const iframe = cell.querySelector('iframe');
  if (iframe) {
    const clone = iframe.cloneNode(true);
    clone.setAttribute('slot', 'image');
    return clone;
  }

  const url = cell.textContent.trim();
  if (VIDEO_EXTS.test(url)) {
    const vid = document.createElement('video');
    vid.src = url;
    vid.controls = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('slot', 'image');
    return vid;
  }

  return null;
};

const buildHeadingSlot = (headingEl) => {
  const bdH = document.createElement('bd-h');
  bdH.setAttribute('slot', 'heading');
  bdH.setAttribute('as', headingEl.tagName.toLowerCase());
  bdH.setAttribute('color', 'var(--color-blue-500)');
  bdH.innerHTML = headingEl.innerHTML;
  return bdH;
};

const buildContentSlot = (cell, headingEl) => {
  const slot = document.createElement('div');
  slot.setAttribute('slot', 'content');

  Array.from(cell.children).forEach((child) => {
    if (headingEl && (child === headingEl || child.contains(headingEl))) return;
    if (child.classList.contains('button-container')) return;

    if (child.tagName === 'UL' || child.tagName === 'OL') {
      slot.appendChild(child.cloneNode(true));
      return;
    }

    if ((child.tagName === 'P' || child.tagName === 'DIV') && child.textContent.trim()) {
      const bdP = document.createElement('bd-p');
      bdP.setAttribute('kind', 'regular');
      bdP.innerHTML = child.innerHTML;
      slot.appendChild(bdP);
    }
  });

  return slot.children.length ? slot : null;
};

const buildCtaSlot = (cell) => {
  const anchor = cell.querySelector('.button-container a');
  if (!anchor) return null;

  const bdBtn = document.createElement('bd-button-link');
  bdBtn.setAttribute('slot', 'cta');
  bdBtn.setAttribute('href', anchor.getAttribute('href') || '#');
  bdBtn.setAttribute('kind', anchor.classList.contains('secondary') ? 'secondary' : 'danger');
  bdBtn.setAttribute('size', 'md');
  bdBtn.setAttribute('strong', '');
  bdBtn.textContent = anchor.textContent.trim();

  if (anchor.target === '_blank') {
    bdBtn.setAttribute('target', '_blank');
    bdBtn.setAttribute('rel', 'noopener noreferrer');
  }

  return bdBtn;
};

const buildFeaturesTab = (row, shouldReverse) => {
  const cells = Array.from(row.children);
  if (cells.length < 2) return null;

  // auto-detect media cell; fall back to second cell
  const mediaIndex = isMediaCell(cells[0]) ? 0 : 1;
  const contentIndex = mediaIndex === 0 ? 1 : 0;

  const mediaCell = cells[mediaIndex];
  const contentCell = cells[contentIndex];

  // reverse attr: media on left (slot layout is left=content, right=image by default)
  const applyReverse = shouldReverse !== null
    ? shouldReverse
    : mediaIndex === 0;

  const bdFT = document.createElement('bd-features-tab');
  if (applyReverse) bdFT.setAttribute('reverse', '');

  const headingEl = contentCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (headingEl) bdFT.appendChild(buildHeadingSlot(headingEl));

  const contentSlot = buildContentSlot(contentCell, headingEl);
  if (contentSlot) bdFT.appendChild(contentSlot);

  const cta = buildCtaSlot(contentCell);
  if (cta) bdFT.appendChild(cta);

  const mediaSlot = buildMediaSlot(mediaCell);
  if (mediaSlot) bdFT.appendChild(mediaSlot);

  return bdFT;
};

export default async function decorate(block) {
  const base = getDsnBase();
  try {
    await import(`${base}features-tab`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('media-feature: DSN import failed', err);
  }

  const isAlternating = block.classList.contains('alternating');
  const forceReverse = block.classList.contains('reverse') ? true : null;

  const rows = Array.from(block.children);
  const fragment = document.createDocumentFragment();

  rows.forEach((row, idx) => {
    let shouldReverse = forceReverse;
    if (isAlternating) shouldReverse = idx % 2 !== 0;

    const tab = buildFeaturesTab(row, shouldReverse);
    if (tab) fragment.appendChild(tab);
  });

  block.replaceChildren(fragment);
}
