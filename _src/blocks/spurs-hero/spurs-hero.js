import{adobeMcAppendVisitorId as a}from"../../scripts/target.js";async function o(e){const[t,i]=[...e.children[0].children];window.location.href.indexOf("scuderiaferrari")!==-1&&e.closest(".section").classList.add("hero-ferrari"),e.innerHTML=`
      <div class="rte-wrapper"></div>
      <div class="img-container">${i.querySelector("picture").outerHTML}</div>
      <div class="default-content-wrapper">
          ${t.outerHTML}
      </div>
    `,e.querySelectorAll(".button-container > a").forEach(r=>{r.target="_blank",r.rel="noopener noreferrer"}),a("header")}export{o as default};
//# sourceMappingURL=spurs-hero.js.map
