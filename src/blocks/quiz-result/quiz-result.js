import { getDatasetFromSection } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  const dataset = getDatasetFromSection(block);

  const { socialTitlePost } = dataset;

  block.classList.add('default-content-wrapper');
  block.children[0].children[0].classList.add('results-wrapper');
  block.children[0].children[0].lastElementChild.classList.add('social-wrapper');

  const resultPageUrl = window.location.href;

  const socialWrapperEl = block.querySelector('.social-wrapper');
  [...socialWrapperEl.querySelectorAll('a')].forEach((anchor) => {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';

    if (anchor.href.includes('twitter')) {
      const twitterBaseUrl = 'https://twitter.com/intent/post?';
      const twitterText = `text=${encodeURIComponent(socialTitlePost)}`;
      const twitterUrl = `&url=${encodeURIComponent(resultPageUrl)}`;
      const fullTwitterUrl = twitterBaseUrl + twitterText + twitterUrl;
      anchor.href = fullTwitterUrl;
    }
    if (anchor.href.includes('facebook')) {
      const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?';
      const facebookUrl = `u=${encodeURIComponent(resultPageUrl)}`;
      const fullFacebookUrl = facebookBaseUrl + facebookUrl;
      anchor.href = fullFacebookUrl;
    }
  });
}
