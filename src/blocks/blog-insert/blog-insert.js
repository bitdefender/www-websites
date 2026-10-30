function runDefaultLogic(block) {
  const urlDiv = block.querySelector('div > div:nth-child(2) > div');
  const url = urlDiv.textContent.trim();

  // Get the picture element
  const pictureElement = block.querySelector('picture');

  // Create a new anchor element
  const anchorElement = document.createElement('a');
  anchorElement.href = url;

  // Wrap the picture element with the anchor element
  pictureElement.parentNode.insertBefore(anchorElement, pictureElement);
  anchorElement.appendChild(pictureElement);

  block.textContent = '';
  block.append(anchorElement);
}

function runIosBannerLogic(block) {
  block.classList.add('ios-banner');

  const card = block.querySelector(':scope > div > div');
  if (!card) return;

  card.classList.add('blog-insert-card');
  card.querySelector('h2')?.classList.add('blog-insert-title');

  const paragraphs = card.querySelectorAll(':scope > p');
  paragraphs[0]?.classList.add('blog-insert-description');

  const offer = paragraphs[paragraphs.length - 1];
  const cta = offer?.querySelector('a');
  if (offer && cta) {
    offer.classList.add('blog-insert-offer');
    cta.classList.add('blog-insert-cta');
  }
}

/**
 * Applies the blog insert logic for the authored section variation.
 * @param {String} blogInsertMetadata The blog insert variation or none
 * @param {Element} blogInsert The blog insert block
 */
function applyBlogInsertLogic(blogInsertMetadata, blogInsert) {
  switch (blogInsertMetadata) {
    case 'ios-banner':
      runIosBannerLogic(blogInsert);
      break;
    default:
      runDefaultLogic(blogInsert);
      break;
  }
}

export default function decorate(block) {
  const blogInsertMetadata = block.closest('.section')?.dataset.blogInsertVariation;
  applyBlogInsertLogic(blogInsertMetadata, block);
}
