import{matchHeights as m}from"../../scripts/utils/utils.js";async function p(t,n,o){const e=t.querySelector(".blog-grid");try{const l=await(await fetch(n)).text(),u=new window.DOMParser().parseFromString(l,"text/xml").querySelectorAll("item");let a=0;u.forEach(c=>{if(a++,a>o)return;const i=c.querySelector("link").textContent,d=c.querySelector("title").textContent,g=c.querySelector("content").getAttribute("url"),r=document.createElement("a");r.setAttribute("href",i),r.classList.add("blog-card"),r.innerHTML=`
          <img src="${g}" alt="${d}">
          <div class="blog-card-content">
              <p>${d}</p>
              <a href="${i}">Find out more</a>
          </div>
      `,e.appendChild(r)})}catch(s){console.error(s)}}function x(t){const{endpoint:n,articlesNumber:o}=t.closest(".section").dataset,e=document.createElement("div");t.appendChild(e),e.classList.add("blog-grid"),p(t,n,o),m(t,"p")}export{x as default};
//# sourceMappingURL=blog-news.js.map
