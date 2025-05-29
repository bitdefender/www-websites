function getVideoElement(source, autoplay) {
  const video = document.createElement('video');
  video.classList.add('bck-video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  video.dataset.loading = 'true';

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
      <div class="video-wrapper">
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
      </div>
    </div>
    <button class="play-btn">
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#FF0000"/>
        <polygon points="40,30 70,50 40,70" fill="white"/>
      </svg>
      ${videoBtnText}
    </button>
    ${block.classList.contains('video-background') ? `
      <div class="video-background">
        <div class="iframe-container"></div>
      </div>
    ` : ''}
  `;

  // Make links open in new tab safely
  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });

  // Add event listener to play button
  if (block.classList.contains('video-background')) {
    const playBtn = block.querySelector('.play-btn');
    const iframeContainer = block.querySelector('.iframe-container');

    playBtn?.addEventListener('click', () => {
      if (isYouTube) {
        const autoplayUrl = `${baseEmbedUrl}&autoplay=1&mute=1`;
        iframeContainer.innerHTML = `
          <iframe
            src="${autoplayUrl}"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
            allowfullscreen
            scrolling="no"
            title="Autoplay Video"
            loading="lazy"></iframe>
        `;
      } else {
        const videoEl = getVideoElement(baseEmbedUrl, true);
        iframeContainer.innerHTML = '';
        iframeContainer.appendChild(videoEl);
        videoEl.addEventListener('ended', () => {
          iframeContainer.innerHTML = '';
          playBtn.style.display = 'flex';
        });
      }

      playBtn.style.display = 'none';
    });
  } else {
    block.querySelector('.play-btn').remove();
  }

  const signature = block.querySelector('h5 strong');
  signature.innerHTML = signature.innerHTML.replace('.', '.<br>');
}
