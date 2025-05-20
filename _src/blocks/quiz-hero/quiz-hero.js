import{adobeMcAppendVisitorId as t}from"../../scripts/target.js";async function n(e){const[r,i]=[...e.children[0].children];e.innerHTML=`
    <div class="rte-wrapper"></div>
    <div class="img-container">${i.querySelector("picture").innerHTML}</div>
    <div class="default-content-wrapper">
        ${r.outerHTML}
    </div>
  `,t("header")}export{n as default};
//# sourceMappingURL=quiz-hero.js.map
