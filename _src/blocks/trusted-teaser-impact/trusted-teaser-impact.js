import"../../node_modules/@repobit/dex-utils/dist/src/index.js";import{decorateIcons as d}from"../../scripts/lib-franklin.js";import{matchHeights as s}from"../../scripts/utils/utils.js";import{debounce as c}from"../../node_modules/@repobit/dex-utils/dist/src/utils.js";async function h(e){const[n,...r]=[...e.children];function t(){e.classList.add("default-content-wrapper"),e.innerHTML=`
    <div class="carousel-header">
      <div class="title">${n.children[0].innerHTML}</div>
    </div>
    
    <div class="box-wrapper">
        ${r.map(i=>`
            <div class="box-item">
                ${i.children[0].children[0].innerHTML}
            
                <div class="title">
                    ${i.children[0].children[1].textContent}
                </div>
                
                <p class="subtitle">
                    ${i.children[0].children[2].innerHTML}
                 </p>
            </div>
          `).join("")}
    </div>
  `,d(e)}t(),window.addEventListener("resize",c(t,250)),s(e,".box-item .title")}export{h as default};
//# sourceMappingURL=trusted-teaser-impact.js.map
