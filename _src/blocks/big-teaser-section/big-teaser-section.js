import{getDatasetFromSection as a}from"../../scripts/utils/utils.js";async function p(t){const[n,c]=[...t.children],s=a(t),{desktopPicture:o,mobilePicture:m}=s,i=document.createElement("picture"),r=document.createElement("img");r.setAttribute("src",`${m}?format=webply&optimize=medium`),r.setAttribute("alt","picture");const e=document.createElement("source");e.setAttribute("media","(min-width: 768px)"),e.setAttribute("type","image/webp"),e.setAttribute("srcset",`${o}?format=webply&optimize=medium`),i.prepend(r),i.prepend(e),t.innerHTML=`
    <div class="wrapper default-content-wrapper">
        <div class="rte">${n.children[0].innerHTML}</div>

        <div class="imgs-wrapper">
            <div class="main-img img-container">
                ${i.outerHTML}
            </div>

            ${c?.querySelector("picture")??""}
            <div class="second-img img-container">
                ${c?.querySelector("picture")?.innerHTML??""}
            </div>
        </div>
    </div>
  `}export{p as default};
//# sourceMappingURL=big-teaser-section.js.map
