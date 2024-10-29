function replacePlaceholderWithVideo(videoUrl) {
  // Find the div that contains the {video} text
  const placeholderDiv = [...document.querySelectorAll('div')].find((div) => div.textContent.trim() === '{video}');

  if (!placeholderDiv) {
    return;
  }
  // Create a new video container
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';

  // Create an iframe element for embedding YouTube video
  const iframeElement = document.createElement('iframe');
  iframeElement.setAttribute('src', videoUrl);
  iframeElement.setAttribute('frameborder', '0');
  iframeElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframeElement.setAttribute('allowfullscreen', '');

  // Add the iframe to the container
  videoContainer.appendChild(iframeElement);

  // Replace the placeholder div with the video container
  placeholderDiv.replaceWith(videoContainer);
}

export default function decorate(block) {
  const { video } = block.closest('.section').dataset;
  replacePlaceholderWithVideo(video);
}
