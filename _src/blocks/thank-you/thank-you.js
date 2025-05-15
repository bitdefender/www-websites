// Function to dispatch 'shadowDomLoaded' event
function dispatchShadowDomLoadedEvent() {
  const event = new CustomEvent('shadowDomLoaded', {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
  window.dispatchEvent(event);
}

function decorate(block, options) {
  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  } else {
    // eslint-disable-next-line no-param-reassign
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const [richTextPicture, richTextQR] = block.children;
  const [richTextPictureText, richTextPicturePicture] = richTextPicture.children;
  const [richTextQRText, richTextQRPicture] = richTextQR.children;
  const html = `
      <div class="content-left">
        ${richTextPictureText.innerHTML}
        <div class="qr-content">
          ${richTextQRText.innerHTML}
          <div class="qr-code">
            ${richTextQRPicture.innerHTML}
          </div>
        </div>
      </div>
      <div class="content-right">
        ${richTextPicturePicture.innerHTML}
      </div>
  `;

  block.innerHTML = html;

  dispatchShadowDomLoadedEvent();
}

export { decorate as default };
//# sourceMappingURL=thank-you.js.map
