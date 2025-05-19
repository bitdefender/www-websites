async function s(r){const[a,i]=[...r.children],e=new URL(i.textContent.trim()),n=new URLSearchParams(e.search),c="";let t=n.get("v")?encodeURIComponent(n.get("v")):"";const l=e.pathname;e.origin.includes("youtu.be")&&([,t]=e.pathname.split("/")),r.innerHTML=`
    <div class="default-content-wrapper">
        <div class="rte-wrapper">${a.innerHTML}</div>
        <div class="video-wrapper">
            <iframe 
              src="https://www.youtube.com${t?`/embed/${t}?rel=0&v=${t}${c}`:l}"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture"
              allowfullscreen="" 
              scrolling="no"
              title="Content from Youtube"
              loading="lazy"></iframe>
        </div>
    </div>
  `,r.querySelectorAll(".button-container > a").forEach(o=>{o.target="_blank",o.rel="noopener noreferrer"})}export{s as default};
//# sourceMappingURL=trusted-hero.js.map
