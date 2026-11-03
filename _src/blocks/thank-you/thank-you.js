// src/blocks/thank-you/thank-you.js
function dispatchShadowDomLoadedEvent() {
	const event = new CustomEvent("shadowDomLoaded", {
		bubbles: true,
		composed: true
	});
	window.dispatchEvent(event);
}
function decorate(block, options) {
	if (options) {
		block = block.querySelector(".block");
		block.closest(".section").classList.add("we-container");
	} else block.closest(".section").classList.add("we-container");
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
