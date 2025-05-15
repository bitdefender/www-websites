function decorate(block) {
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

export { decorate as default };
//# sourceMappingURL=blog-insert.js.map
