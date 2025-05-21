function replacePlaceholderWithVideo(videoUrl) {
  const placeholderDiv = [...document.querySelectorAll('div')].find((div) => div.textContent.trim() === '{video}');
  if (!placeholderDiv) {
    return;
  }
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';

  const iframeElement = document.createElement('iframe');
  iframeElement.setAttribute('src', videoUrl);
  iframeElement.setAttribute('frameborder', '0');
  iframeElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframeElement.setAttribute('allowfullscreen', '');
  videoContainer.appendChild(iframeElement);
  placeholderDiv.replaceWith(videoContainer);
}

export default function decorate(block) {
  const { video } = block.closest('.section').dataset;
  replacePlaceholderWithVideo(video);
}
