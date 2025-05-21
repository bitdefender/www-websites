import"../../packages/repobit/dex-utils/dist/src/index.js";import{isView as p}from"../../scripts/utils/utils.js";import{debounce as I}from"../../packages/repobit/dex-utils/dist/src/utils.js";async function y(r){const d=[...r.children],i={viewport:"desktop",slideDelay:3*1e3},s={currentStep:0,carouselIsFocused:!1,currentInterval:null},u=d.map(e=>e.children[0].firstElementChild.textContent);r.classList.add("default-content-wrapper"),r.innerHTML=`
    <div class="navigation-wrapper">
        <div class="first-nav">
          ${u.map((e,t)=>`<div class="nav-item ${t===0?"active":""}">${e}</div>`).join("")}
        </div>
        
        <div class="second-nav">
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
        </div>
    </div>
    
    <div class="content-wrapper">
        ${d.map((e,t)=>`
        <div class="slide ${t===0?"active":""}">
            ${e.innerHTML}
        </div>
        `).join("")}
    </div>
  `;const f=r.querySelector(".content-wrapper"),n=r.querySelectorAll(".nav-item"),v=r.querySelectorAll(".slide"),m=r.querySelector(".left-arrow"),w=r.querySelector(".right-arrow");function S(e){n.forEach(t=>t.classList.remove("active")),n[e].classList.add("active")}function g(e){v.forEach(t=>t.classList.remove("active")),v[e].classList.add("active")}function L(e){r.classList.add("scrolling");const t=-100*e,o=50*e;f.style.transform=`translateX(calc(${t}% - ${o}px ))`,setTimeout(()=>{r.classList.remove("scrolling")},200)}function a(e){s.currentStep=e,S(e),g(e),L(e)}function c(e){clearInterval(e||s.currentInterval)}function l(){if(c(),s.carouselIsFocused||!p(i.viewport))return;const e=setInterval(()=>{const o=s.currentStep===n.length-1?0:s.currentStep+1;a(o),(!p(i.viewport)||s.carouselIsFocused)&&c(e)},i.slideDelay);s.currentInterval=e}function h(){r.addEventListener("mouseenter",()=>{s.carouselIsFocused=!0,c()}),r.addEventListener("mouseleave",()=>{s.carouselIsFocused=!1,l()}),n.forEach((e,t)=>{e.addEventListener("click",()=>{a(t)})}),m.addEventListener("click",e=>{e.preventDefault(),s.currentStep!==0&&a(s.currentStep-1)}),w.addEventListener("click",e=>{e.preventDefault(),s.currentStep!==n.length-1&&a(s.currentStep+1)})}h(),l(),window.addEventListener("resize",I(l,250))}export{y as default};
//# sourceMappingURL=trusted-main-carousel.js.map
