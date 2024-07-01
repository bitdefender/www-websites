// Function to dispatch 'shadowDomLoaded' event
function dispatchShadowDomLoadedEvent() {
  const event = new CustomEvent('shadowDomLoaded', {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
  window.dispatchEvent(event);
}

export default function decorate(block, options) {
  const {
    product, conditionText, saveText, MacOS, Windows, Android, IOS, mainProduct,
    alignContent, height, type, send2datalayer,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    let blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
    if (type) blockParent.classList.add(type);
  }

  let [richTextPicture, richTextQR] = block.children;
  
  block.innerHtml = `<div class="content">
                <div class="content-left">
                    ${richTextPicture.children[0].outerHTML}
                    ${richTextQR}
                </div>
                <div class="content-right">
                    ${richTextPicture.children[0].outerHTML}
                </div>
            </div>
        `;
}