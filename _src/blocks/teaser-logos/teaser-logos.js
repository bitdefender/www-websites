async function decorate(block) {
  const boxes = [...block.children[0].children];

  block.innerHTML = `
    <div class="default-content-wrapper">
        ${boxes.map((box) => `
          <div class="col"><div class="img-wrapper">${box.innerHTML}</div></div>
        `).join('')}
    </div>
  `;
}

export { decorate as default };
//# sourceMappingURL=teaser-logos.js.map
