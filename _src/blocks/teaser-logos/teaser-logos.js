// src/blocks/teaser-logos/teaser-logos.js
async function decorate(block) {
	block.innerHTML = `
    <div class="default-content-wrapper">
        ${[...block.children[0].children].map((box) => `
          <div class="col"><div class="img-wrapper">${box.innerHTML}</div></div>
        `).join("")}
    </div>
  `;
}
export { decorate as default };
