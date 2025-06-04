function getVideoElement(source, autoplay) {
  const video = document.createElement('video');
  video.classList.add('bck-video');
  video.setAttribute('controls', '');
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
  const [rte, videoUrl] = [...block.children];
  const url = new URL(videoUrl.textContent.trim());
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;

  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
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
      <svg width="114" height="114" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#FF0000"/>
        <polygon points="40,30 70,50 40,70" fill="white"/>
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
          <div class="video-modal-inner"></div>
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
      modalInner.innerHTML = isYouTube
        ? `<iframe src="${baseEmbedUrl}&autoplay=1"
                allow="autoplay; fullscreen"
                allowfullscreen
                loading="lazy"
                title="Video Modal"></iframe>`
        : getVideoElement(baseEmbedUrl, true).outerHTML;

      if (!modal.open) modal.showModal();
    });
  }

  const signature = block.querySelector('h5 strong');
  signature.innerHTML = signature.innerHTML.replace('.', '.<br>');
}
