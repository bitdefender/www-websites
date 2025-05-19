import{decorateButtons as u}from"../../scripts/lib-franklin.js";async function m(o,i){i&&(o=o.querySelector(".block"),o.closest(".section").classList.add("we-container"));const[s,a]=[...o.children],r=a.textContent.trim(),n=r.split(".").pop(),{videoPlayerSettings:c,videoPlayerPoster:d}=o.closest(".section").dataset;function l(){const e=document.createElement("link"),t=document.createElement("link");e.rel="preload",e.as="video",e.href=r,e.type=`video/${n}`,t.rel="preload",t.as="image",t.href=d,document.head.prepend(t),document.head.prepend(e)}l();const p=c.split(",").map(e=>{let t=e;return t.includes("=")?(t=e.replace("=",'="'),t=`${t}"`,t):t.trim()}).join(" ");o.innerHTML=`
    <div class="video-wrapper">
        <video ${p} poster="${d}">
          <source src="${r}" type="video/${n}">
        </video>
    </div>
    <div class="default-content-wrapper">
        ${s.innerHTML}
    </div>
  `,o.querySelectorAll(".button-container > a").forEach(e=>{e.target="_blank",e.rel="noopener noreferrer"}),u(o),window.dispatchEvent(new CustomEvent("shadowDomLoaded"),{bubbles:!0,composed:!0})}export{m as default};
//# sourceMappingURL=banner-vsb.js.map
