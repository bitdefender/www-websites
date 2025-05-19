import{decorateIcons as l}from"../../scripts/lib-franklin.js";import{matchHeights as u}from"../../scripts/utils/utils.js";async function h(t){const r=[...t.children[1].children],n=t.children[0].querySelector("span");t.innerHTML=`
    <div class="default-content-wrapper">
        ${r.map((e,c)=>{const o=e.querySelector("picture"),i=e?[...e.children]:"";i.shift();const[s,d,a]=i;return`
        <div class="col-container">
            <div class="card">
                <div class="img-container">
                    ${o?.outerHTML??""}
                </div>
                <div class="box">
                    ${s?.outerHTML}
                    <div>${d?.innerHTML??""}</div>
                    ${a?.outerHTML??""}
                </div>
            </div>
            ${c===1?n?.outerHTML:""}
        </div>
    `}).join("")}   
  `,l(t),u(t,".box")}export{h as default};
//# sourceMappingURL=dual-teaser.js.map
