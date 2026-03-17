import { embedYoutube } from '../../scripts/utils/utils.js';
import YouTubeTracker from '../../scripts/utils/youtube-tracker.js';

function replacePlaceholderWithVideo(block, videoUrl) {
  const placeholderDiv = [...block.querySelectorAll('div')].find((div) => div.textContent.trim() === '{video}');
  if (!placeholderDiv) {
    return;
  }
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';

  const url = new URL(videoUrl);
  videoContainer.innerHTML = embedYoutube(url, false);

  const videoId = videoContainer.querySelector('iframe')?.getAttribute('id');
  const tracker = new YouTubeTracker(block, videoUrl, url, videoId);
  tracker.initialize();

  placeholderDiv.replaceWith(videoContainer);
}

export default function decorate(block) {
  const { video } = block.closest('.section').dataset;
  replacePlaceholderWithVideo(block, video);
}
