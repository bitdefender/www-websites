function l(){const e=new CustomEvent("shadowDomLoaded",{bubbles:!0,composed:!0});window.dispatchEvent(e)}function h(e,t){t&&(e=e.querySelector(".block")),e.closest(".section").classList.add("we-container");const[n,c]=e.children,[i,s]=n.children,[r,o]=c.children,d=`
      <div class="content-left">
        ${i.innerHTML}
        <div class="qr-content">
          ${r.innerHTML}
          <div class="qr-code">
            ${o.innerHTML}
          </div>
        </div>
      </div>
      <div class="content-right">
        ${s.innerHTML}
      </div>
  `;e.innerHTML=d,l()}export{h as default};
//# sourceMappingURL=thank-you.js.map
