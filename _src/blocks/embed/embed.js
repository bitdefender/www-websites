const l=(e,i,n)=>{const o=document.querySelector("head"),t=document.createElement("script");return t.src=e,t.onload=i,o.append(t),t},c=e=>`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${e.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${e.hostname}" loading="lazy">
    </iframe>
  </div>`,m=(e,i)=>{const n=new URLSearchParams(e.search),o=i?"&muted=1&autoplay=1":"";let t=encodeURIComponent(n.get("v"));const s=e.pathname;return e.origin.includes("youtu.be")&&([,t]=e.pathname.split("/")),`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${t?`/embed/${t}?rel=0&v=${t}${o}`:s}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`},u=(e,i)=>{const[,n]=e.pathname.split("/");return`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${n}${i?"?muted=1&autoplay=1":""}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`},p=e=>{const i=`<blockquote class="twitter-tweet"><a href="${e.href}"></a></blockquote>`;return l("https://platform.twitter.com/widgets.js"),i},a=(e,i,n)=>{if(e.classList.contains("embed-is-loaded"))return;const t=[{match:["youtube","youtu.be"],embed:m},{match:["vimeo"],embed:u},{match:["twitter"],embed:p}].find(r=>r.match.some(d=>i.includes(d))),s=new URL(i);t?(e.innerHTML=t.embed(s,n),e.classList=`block embed embed-${t.match[0]}`):(e.innerHTML=c(s),e.classList="block embed"),e.classList.add("embed-is-loaded")};function f(e){const i=e.querySelector("picture"),n=e.querySelector("a").href;if(e.textContent="",i){const o=document.createElement("div");o.className="embed-placeholder",o.innerHTML='<div class="embed-placeholder-play"><button title="Play"></button></div>',o.prepend(i),o.addEventListener("click",()=>{a(e,n,!0)}),e.append(o)}else{const o=new IntersectionObserver(t=>{t.some(s=>s.isIntersecting)&&(o.disconnect(),a(e,n,!0))});o.observe(e)}}export{f as default};
//# sourceMappingURL=embed.js.map
