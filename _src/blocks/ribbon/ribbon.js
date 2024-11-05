export default function decorate(block) {
  const [, backgroundEl] = block.children;

  if (backgroundEl) {
    const backgroundImgEl = backgroundEl.querySelector('img');
    const backgroundImgSrc = backgroundImgEl?.getAttribute('src');

    if (backgroundImgSrc) {
      block.closest('.section').style.backgroundImage = `url("${backgroundImgSrc}")`;
      // Remove the row after setting background
      backgroundEl.remove();
    }
  }
}
