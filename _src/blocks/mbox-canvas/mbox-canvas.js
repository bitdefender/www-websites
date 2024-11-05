import { Target } from '../../scripts/libs/data-layer.js';
import { decorateMain , detectModalButtons } from '../../scripts/scripts.js';
import { loadBlock, loadBlocks } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.innerHTML += `
        <div data-mbox="something">

        </div>
    `;
  const offer = await Target.getMbox('something');
  console.log(offer)
  console.log(offer.content.offer)
  const page = await fetch(`http://localhost:3000/en-us/webview/webview-table.plain.html`);
  const aemHeaderHtml = await page.text();
  console.log(offer)
  console.log(aemHeaderHtml);
  let newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);
  await loadBlocks(newHtml);
  // console.log(aemHeaderHtml);
  console.log(newHtml);
  block.querySelector('[data-mbox=something]').innerHTML = newHtml.outerHTML;
}
