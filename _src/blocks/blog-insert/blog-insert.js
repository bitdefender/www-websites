export default function decorate(block) {
  const metadata = block.closest('.section').dataset;

  const urlDiv = block.querySelector('div > div:nth-child(2) > div');
  const url = urlDiv.textContent.trim();

  // Get the picture element
  const pictureElement = block.querySelector('picture');
  const imageElement = pictureElement.querySelector('img');
  if (imageElement && metadata.alt) {
    imageElement.alt = metadata.alt;
  }

  // Create a new anchor element
  const anchorElement = document.createElement('a');
  anchorElement.href = url;

  // Wrap the picture element with the anchor element
  pictureElement.parentNode.insertBefore(anchorElement, pictureElement);
  anchorElement.appendChild(pictureElement);

  block.textContent = '';
  block.append(anchorElement);
}
