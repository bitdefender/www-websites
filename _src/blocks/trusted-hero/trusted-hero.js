import { decorateIcons } from '../../scripts/lib-franklin.js';

function getVideoElement(source, autoplay) {
  const video = document.createElement('video');
  video.classList.add('bck-video');
  video.setAttribute('disableremoteplayback', '');
  video.setAttribute('loop', '');
  video.dataset.loading = 'true';

  if (autoplay) {
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.muted = true; // programmatic mute for autoplay to work reliably
  }

  video.addEventListener('loadedmetadata', () => {
    delete video.dataset.loading;
  });

  const sourceEl = document.createElement('source');
  const fileType = source.split('.').pop();
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${fileType}`);
  video.append(sourceEl);

  return video;
}

export default async function decorate(block) {
  const { videoBtnText } = block.closest('.section').dataset;
  const [rte, videoUrl, modalLink] = [...block.children];
  const url = new URL(videoUrl.textContent.trim());
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;

  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const rteTable = rte.querySelector('table');
  if (rteTable) {
    rte.querySelector('table').remove();
    rte.insertAdjacentElement('beforeend', rteTable);
  }

  const isYouTube = videoUrl.textContent.includes('youtube') || url.host.includes('youtu.be');
  const baseEmbedUrl = isYouTube
    ? `https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}` : embed}`
    : videoUrl.textContent.trim();

  block.innerHTML = `
    <div class="default-content-wrapper">
      <div class="rte-wrapper">${rte.innerHTML}</div> 
     
      ${!block.classList.contains('video-background') ? `<div class="video-wrapper">
        ${isYouTube ? `
          <iframe 
            src="${baseEmbedUrl}"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
            allowfullscreen 
            scrolling="no"
            title="Content from Youtube"
            loading="lazy"></iframe>
        ` : `
          ${getVideoElement(baseEmbedUrl, false).outerHTML}
        `}
      </div>` : ''}
    </div>
    ${videoBtnText ? `<button class="play-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="114" height="114" viewBox="0 0 114 114" fill="none">
        <circle cx="57" cy="57" r="57" fill="#FF0004"/>
        <path d="M81.25 53.1025C84.1563 54.7805 84.2472 58.8973 81.5225 60.7275L81.25 60.8975L48.25 79.9492C45.2501 81.6812 41.5001 79.5167 41.5 76.0527L41.5 37.9473C41.5001 34.5915 45.0194 32.4549 47.9668 33.8994L48.25 34.0508L81.25 53.1025Z" fill="white" stroke="white"/>
      </svg>
      ${videoBtnText}
    </button>` : ''}  
    ${block.classList.contains('video-background') ? `<div class="video-wrapper">
        ${isYouTube ? `
          <iframe 
            src="${baseEmbedUrl}"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
            allowfullscreen
            scrolling="no"
            title="Content from Youtube"
            loading="lazy"></iframe>
        ` : `
          ${getVideoElement(baseEmbedUrl, true).outerHTML}
        `}
      </div>` : ''} 
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  const playBtn = block.querySelector('.play-btn');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      let modal = block.querySelector('dialog.video-modal');

      if (!modal) {
        modal = document.createElement('dialog');
        modal.classList.add('video-modal');

        modal.innerHTML = `
          <div class="video-modal-content">
            <button class="video-modal-close" aria-label="Close video modal">&times;</button>
            <div class="video-modal-inner" style="height:100%"></div>
          </div>
        `;

        block.appendChild(modal);

        modal.querySelector('.video-modal-close').addEventListener('click', () => {
          modal.close();
        });

        modal.addEventListener('click', (e) => {
          const content = modal.querySelector('.video-modal-content');
          if (!content.contains(e.target)) modal.close();
        });

        modal.addEventListener('close', () => {
          modal.remove();
        });
      }

      const modalInner = modal.querySelector('.video-modal-inner');
      const embedUrl = new URL(modalLink.innerText.trim());
      embedUrl.searchParams.set('autoplay', '1');
      modalInner.innerHTML = `<iframe 
        src="${embedUrl.toString()}"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
        allowfullscreen 
        scrolling="no"
        title="Content from Youtube"
        loading="lazy"></iframe>`;
      if (!modal.open) modal.showModal();
    });
  }

  const signature = block.querySelector('h5 strong');

  if (signature) {
    if (window.innerWidth > 992) signature.innerHTML = signature.innerHTML.replace('.', '.<br>');
  }

  decorateIcons(block);
}
