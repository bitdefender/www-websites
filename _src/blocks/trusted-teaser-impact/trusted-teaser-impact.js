import { debounce } from '@repobit/dex-utils';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const [titleEl, ...boxes] = [...block.children];

  function render() {
    block.classList.add('default-content-wrapper');

    block.innerHTML = `
    <div class="carousel-header">
      <div class="title">${titleEl.children[0].innerHTML}</div>
    </div>
    
    <div class="box-wrapper">
        ${boxes.map((box) => `
            <div class="box-item">
                ${box.children[0].children[0].innerHTML}
            
                <div class="title">
                    ${box.children[0].children[1].textContent}
                </div>
                
                <p class="subtitle">
                    ${box.children[0].children[2].innerHTML}
                 </p>
            </div>
          `).join('')}
    </div>
  `;

    decorateIcons(block);
  }

  render();

  window.addEventListener('resize', debounce(render, 250));
}
