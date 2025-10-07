export default async function decorate(block) {
  block.classList.add('global-styles');
  const boxes = [...block.children[0].children];

  block.innerHTML = `
    <div class="default-content-wrapper">
        ${boxes.map((box) => `
          <div class="col"><div class="img-wrapper">${box.innerHTML}</div></div>
        `).join('')}
    </div>
  `;
}
