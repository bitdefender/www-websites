import"../../node_modules/@repobit/dex-utils/dist/src/index.js";import{decorateIcons as y}from"../../scripts/lib-franklin.js";import{isView as x}from"../../scripts/utils/utils.js";import{debounce as M}from"../../node_modules/@repobit/dex-utils/dist/src/utils.js";async function H(e){const[g,...l]=[...e.children];let i=0;const n=l.length;let a=`has-${n}-items`;n>3&&n<7&&(a="has-3-7-items"),n>7&&(a="has-more-items"),e.classList.add(a);const c=e.closest(".section").classList.contains("testimonials"),p={margin:20};function o(){return i===0}function d(){return i===l.length-3}function u(r,s){const t=e.querySelector(".carousel-item");s.style.transform=`translateX(${-1*r*(t.offsetWidth+p.margin)}px)`}function v(){return e.querySelector(".carousel")}function f(){const r=e.querySelector(".left-arrow"),s=e.querySelector(".right-arrow");if(r.classList.remove("disabled"),s.classList.remove("disabled"),d()){e.querySelector(".right-arrow").classList.add("disabled");return}o()&&e.querySelector(".left-arrow").classList.add("disabled")}function h(r){r.preventDefault(),!o()&&(i-=1,u(i,v()),f())}function w(r){r.preventDefault(),!d()&&(i+=1,u(i,v()),f())}function L(){return e.classList.remove("scrollable"),x("desktop")?window.innerWidth>767?`
      <a href class="arrow disabled left-arrow">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0,752) scale(0.1,-0.1)">
            <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
            l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
            109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
            -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
            896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
            16z"></path>
          </g>
        </svg>
      </a>
      <a href class="arrow right-arrow">
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 752 752" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0,752) scale(0.1,-0.1)">
            <path fill="#000" d="M4415 5430 c-92 -20 -148 -113 -125 -203 10 -37 83 -114 638 -669
            l627 -628 -2011 0 -2011 0 -43 -23 c-73 -38 -108 -129 -79 -204 15 -42 68 -92
            109 -103 22 -6 753 -10 2035 -10 l2000 0 -611 -604 c-354 -351 -618 -619 -628
            -639 -70 -149 79 -302 222 -228 21 11 374 358 804 788 843 845 803 799 778
            896 -10 37 -95 125 -788 820 -427 428 -788 784 -802 791 -35 18 -79 24 -115
            16z"></path>
          </g>
        </svg>
      </a>
    `:"":(e.classList.add("scrollable"),"")}function m(){e.classList.add("default-content-wrapper"),e.innerHTML=`
    <div class="carousel-header">
      <div class="title">${g?.children[0]?.innerHTML}</div>
      <div class="arrows d-flex">${L()}</div>
    </div>

    <div class="carousel-container">
        <div class="carousel">
          ${l.map(t=>`
            <div class="carousel-item">
                ${c?`
                  <div class="img-container">
                    ${t.children[0]?.children[0]?.innerHTML}
                  </div>
                `:t.children[0]?.children[0]?.innerHTML}

                <p class="title">
                    ${t.children[0]?.children[1]?.textContent}
                </p>

                ${c?`
                  <div class="subtitle-secondary">
                    ${t.children[0]?.children[2]?.innerHTML}
                  </div>

                  <div class="subtitle">
                    ${t.children[0]?.children[3]?.innerHTML}
                  </div>
                `:`
                   <div class="subtitle">
                      ${t.children[0]?.children[2]?.innerHTML}
                   </div>
                `}
            </div>
          `).join("")}
        </div>
    </div>
  `,y(e);const r=e.querySelector(".left-arrow"),s=e.querySelector(".right-arrow");r&&s&&(r.removeEventListener("click",h),s.removeEventListener("click",w),r.addEventListener("click",h),s.addEventListener("click",w))}m(),window.addEventListener("resize",M(m,250))}export{H as default};
//# sourceMappingURL=box-carousel.js.map
