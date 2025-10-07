import { decorateIcons } from '../../scripts/lib-franklin.js';
import { matchHeights } from '../../scripts/utils/utils.js';

export default async function decorate(block) {
  block.classList.add('global-styles');
  const cols = [...block.children[1].children];
  const middleSvgIcon = block.children[0].querySelector('span');

  block.innerHTML = `
    <div class="default-content-wrapper">
        ${cols.map((col, idx) => {
    const pictureEl = col.querySelector('picture');
    const richTextEls = col ? [...col.children] : '';
    richTextEls.shift();
    const [titleEl, subtitleEl, buttonEl] = richTextEls;

    return `
        <div class="col-container">
            <div class="card">
                <div class="img-container">
                    ${pictureEl?.outerHTML ?? ''}
                </div>
                <div class="box">
                    ${titleEl?.outerHTML}
                    <div>${subtitleEl?.innerHTML ?? ''}</div>
                    ${buttonEl?.outerHTML ?? ''}
                </div>
            </div>
            ${idx === 1 ? middleSvgIcon?.outerHTML : ''}
        </div>
    `;
  }).join('')}   
  `;

  decorateIcons(block);
  matchHeights(block, '.box');
}
