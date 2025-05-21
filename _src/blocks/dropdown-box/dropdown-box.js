function a(i){const t=i.closest(".section"),{type:r,topBackgroundColor:o,topTextColor:s}=t.dataset;if(i.querySelectorAll(".dropdown-box-container .block > div > div:nth-child(1)").forEach(e=>{e.innerHTML=e.innerHTML.replace("[",'<span class="greenTag">'),e.innerHTML=e.innerHTML.replace("]","</span>")}),i.querySelectorAll(".dropdown-box-container .block > div:first-child").forEach(e=>{e.parentNode.classList.remove("inactive"),e.addEventListener("click",()=>{e.parentNode.classList.toggle("inactive")})}),i.children.length>=2){const e=i.children[1].children.length;i.classList.add(`has${e}divs`),o&&(i.querySelector("div:nth-child(1) > div > div").style.backgroundColor=o),s&&(i.querySelector("div:nth-child(1) > div").style.color=s)}if(r==="slider"){i.closest(".dropdown-box-container").classList.add("container","dropdown-slider","has-load-bar");const e=document.createElement("div");e.className="slider-box";const n=i.children[0].children[0],d=i.children[1].children[0];e.innerHTML=`
          <div class="row">
            <div class="col-12 col-md-5 title">
              <div class="loading-bar"></div>
              ${n.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${d.innerHTML}</div>
          </div>
      `,i.closest(".dropdown-box-container").appendChild(e)}if(r==="slider-no-load-bar"){i.closest(".dropdown-box-container").classList.add("container","dropdown-slider","no-load-bar");const e=document.createElement("div");e.className="slider-box";const n=i.children[0].children[0],d=i.children[1].children[0];e.innerHTML=`
          <div class="row">
            <div class="col-12 col-md-5 title">
              ${n.innerHTML}
            </div>
            <div class="col-12 col-md-7 description">${d.innerHTML}</div>
          </div>
      `,i.closest(".dropdown-box-container").appendChild(e)}}export{a as default};
//# sourceMappingURL=dropdown-box.js.map
