import { load } from '@repobit/dex-system-design/loader';
import { wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * Copy beside media, a bd-features-tab a row: one cell holds a heading, the
 * body and a button, the other a picture, a video or a YouTube link.
 * `alternating` puts the media on alternate sides, `reverse` on the left.
 */

const VIDEO_EXTS = /\.(mp4|webm|ogg)(\?.*)?$/i;
const YOUTUBE_RE = /(?:youtube\.com|youtu\.be)/i;
const IFRAME_SRC_RE = /<iframe[^>]+\bsrc=["']([^"']+)["']/i;

const isMediaCell = (cell) => !!(
  cell.querySelector('picture, video, iframe')
    || VIDEO_EXTS.test(cell.textContent.trim())
    || YOUTUBE_RE.test(cell.textContent.trim())
);

const buildMediaSlot = (cell) => {
  const picture = cell.querySelector('picture');
  const iframe = cell.querySelector('iframe');
  const video = cell.querySelector('video');

  let videoSrc = null;
  if (iframe) {
    videoSrc = iframe.getAttribute('src');
  } else if (video) {
    videoSrc = video.getAttribute('src');
  } else {
    const urlText = cell.textContent.trim();
    const iframeMatch = IFRAME_SRC_RE.exec(urlText);
    if (iframeMatch) {
      [, videoSrc] = iframeMatch;
    } else if (VIDEO_EXTS.test(urlText) || YOUTUBE_RE.test(urlText)) {
      videoSrc = urlText;
    }
  }

  if (videoSrc) {
    const thumbImg = picture?.querySelector('img');
    // use bd-video-player only for YouTube or when a thumb is available
    if (YOUTUBE_RE.test(videoSrc) || thumbImg) {
      const player = document.createElement('bd-video-player');
      player.setAttribute('slot', 'media');
      player.setAttribute('src', videoSrc);
      // bd-video-player names nothing itself: the thumbnail's alt, the play and
      // close controls, and the frame
      if (thumbImg) {
        player.setAttribute('thumb', thumbImg.src);
        player.setAttribute('thumb-alt', thumbImg.alt || 'Video preview');
        player.setAttribute('play-label', 'Play video');
        player.setAttribute('close-label', 'Close video');
      }
      if (YOUTUBE_RE.test(videoSrc)) player.setAttribute('video-title', 'Video player');
      return player;
    }

    const vid = document.createElement('video');
    vid.setAttribute('src', videoSrc);
    vid.setAttribute('controls', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('slot', 'media');
    return vid;
  }

  if (picture) {
    const clone = picture.cloneNode(true);
    clone.setAttribute('slot', 'media');
    return clone;
  }

  return null;
};

// bd-features-tab sets its title's size and ink; the level is the author's
const buildTitle = (headingEl) => {
  const bdH = document.createElement('bd-h');
  bdH.setAttribute('slot', 'title');
  bdH.setAttribute('as', headingEl.tagName.toLowerCase());
  bdH.innerHTML = headingEl.innerHTML;
  return bdH;
};

const buildListItem = (li) => {
  const bdLi = document.createElement('bd-li');
  bdLi.setAttribute('appearance', 'bullet');
  bdLi.setAttribute('size', 'md');
  const bdP = document.createElement('bd-p');
  bdP.setAttribute('appearance', 'regular');
  bdP.innerHTML = li.innerHTML;
  bdLi.appendChild(bdP);
  return bdLi;
};

const buildList = (listEl) => {
  const bdList = document.createElement('bd-list');
  bdList.setAttribute('type', listEl.tagName === 'OL' ? 'ordered' : 'unordered');
  bdList.setAttribute('spacing', 'md');
  bdList.setAttribute('appearance', 'default');
  bdList.setAttribute('orientation', 'vertical');
  Array.from(listEl.querySelectorAll(':scope > li')).forEach((li) => {
    bdList.appendChild(buildListItem(li));
  });
  return bdList;
};

// the body: bd-features-tab's default slot takes its atoms as they are
const buildContent = (cell, headingEl) => {
  const atoms = [];

  Array.from(cell.children).forEach((child) => {
    if (headingEl && (child === headingEl || child.contains(headingEl))) return;
    if (child.classList.contains('button-container')) return;

    if (child.tagName === 'UL' || child.tagName === 'OL') {
      atoms.push(buildList(child));
      return;
    }

    if ((child.tagName === 'P' || child.tagName === 'DIV') && child.textContent.trim()) {
      const bdP = document.createElement('bd-p');
      bdP.setAttribute('appearance', 'regular');
      bdP.innerHTML = child.innerHTML;
      atoms.push(bdP);
    }
  });

  return atoms;
};

const buildActions = (cell) => {
  const anchor = cell.querySelector('.button-container a');
  if (!anchor) return null;

  const bdBtn = document.createElement('bd-button');
  bdBtn.setAttribute('slot', 'actions');
  bdBtn.setAttribute('href', anchor.getAttribute('href') || '#');
  // the accent fill a conversion CTA takes, unless the author made the button
  // secondary; its size is bd-button's responsive default
  bdBtn.setAttribute('appearance', anchor.classList.contains('secondary') ? 'secondary' : 'accent');
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
  if (headingEl) bdFT.appendChild(buildTitle(headingEl));

  bdFT.append(...buildContent(contentCell, headingEl));

  const cta = buildActions(contentCell);
  if (cta) bdFT.appendChild(cta);

  const mediaSlot = buildMediaSlot(mediaCell);
  if (mediaSlot) bdFT.appendChild(mediaSlot);

  return bdFT;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
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

  try {
    await load(fragment);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('media-feature: DSN import failed', err);
  }
  block.replaceChildren(fragment);
}
