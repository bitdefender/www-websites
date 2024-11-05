import { Target } from '../../scripts/libs/data-layer.js';
import { decorateMain , detectModalButtons } from '../../scripts/scripts.js';
import { loadBlock, loadBlocks } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.innerHTML += `
        <div data-mbox="something">

        </div>
    `;
  const offer = await Target.getMbox('something');
  const page = await fetch(`http://localhost:3000/en-us/webview/webview-table.plain.html`);
  const aemHeaderHtml = await page.text();
  let newHtml = document.createElement('div');
  newHtml.innerHTML = aemHeaderHtml;
  decorateMain(newHtml);
  detectModalButtons(newHtml);
  block.querySelector('[data-mbox=something]').innerHTML = newHtml.innerHTML;
  await loadBlocks(block.querySelector('[data-mbox=something]'));
}
