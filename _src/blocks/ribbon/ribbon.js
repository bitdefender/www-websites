export default function decorate(block) {
  const [, backgroundEl] = block.children;
  block.innerHTML = block.innerText.replace(/0\s*%/g, `<span data-store-text-variable>{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}</span>`);

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
