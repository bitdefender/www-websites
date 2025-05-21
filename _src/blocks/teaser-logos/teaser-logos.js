async function a(e){const i=[...e.children[0].children];e.innerHTML=`
    <div class="default-content-wrapper">
        ${i.map(n=>`
          <div class="col"><div class="img-wrapper">${n.innerHTML}</div></div>
        `).join("")}
    </div>
  `}export{a as default};
//# sourceMappingURL=teaser-logos.js.map
