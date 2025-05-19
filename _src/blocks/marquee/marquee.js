import"../../vendor/repobit/dex-utils/dist/src/index.js";import{getDatasetFromSection as m,isView as g}from"../../scripts/utils/utils.js";import{debounce as v}from"../../vendor/repobit/dex-utils/dist/src/utils.js";async function y(d){const r="#004299",s={MOBILE:125,TABLET_UP:125},u=.6,[S,...i]=[...d.children];function c(){return g("mobile")?s.MOBILE:s.TABLET_UP}function p(){const e={duplicatedSlides:null,slidesToShift:null},t=c(),l=window.innerWidth,n=l-i.length*t;if(n<0)return e.duplicatedSlides=i.concat(i),e.slidesToShift=i.length,e;const o=parseInt(n/t,10),T=l%t!==0;return e.duplicatedSlides=Array(o).fill(i).flatMap(h=>h),T?(e.duplicatedSlides=e.duplicatedSlides.concat(i),e.slidesToShift=e.duplicatedSlides.length,e.duplicatedSlides=e.duplicatedSlides.concat(e.duplicatedSlides),e):(e.duplicatedSlides=e.duplicatedSlides.concat(e.duplicatedSlides),e.slidesToShift=e.duplicatedSlides.length,e)}function f(e){const t=d.querySelector(".marquee-content");t.style.animationDuration=`${e/u}s`,t.style.setProperty("--translateX",`${c()*e}px`)}function a(){const e=m(d),{background_color:t}=e;d.style.background=t||r;const{duplicatedSlides:l,slidesToShift:n}=p();d.innerHTML=`
      <div class="default-content-wrapper"><div class="title">${S.textContent}</div></div>
      <div class="outer-wrapper">
          <div class="marquee-content">
              ${l.map(o=>`<div class="marquee-item img-container">${o.querySelector("picture").outerHTML}</div>`).join("")}
          </div>
      </div>
  `,f(n)}a(),window.addEventListener("resize",v(a,250))}export{y as default};
//# sourceMappingURL=marquee.js.map
