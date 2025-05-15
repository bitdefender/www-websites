async function decorate(block) {
  const [rte, videoUrl] = [...block.children];
  const url = new URL(videoUrl.textContent.trim());
  const usp = new URLSearchParams(url.search);
  const suffix = '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;

  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  block.innerHTML = `
    <div class="default-content-wrapper">
        <div class="rte-wrapper">${rte.innerHTML}</div>
        <div class="video-wrapper">
            <iframe 
              src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
              allowfullscreen="" 
              scrolling="no"
              title="Content from Youtube"
              loading="lazy"></iframe>
        </div>
    </div>
  `;

  block.querySelectorAll('.button-container > a').forEach((anchorEl) => {
    anchorEl.target = '_blank';
    anchorEl.rel = 'noopener noreferrer';
  });
}

export { decorate as default };
//# sourceMappingURL=trusted-hero.js.map
