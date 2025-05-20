import{createTag as s}from"../../scripts/utils/utils.js";import{decorateIcons as u}from"../../scripts/lib-franklin.js";function d(r){const e=Array.from(r.querySelectorAll("p")).find(t=>!t.querySelector("strong, em")&&t.textContent.trim()!==""),n=r.querySelector("p > strong"),l=r.querySelector("p > em");if(!e)return null;const a=l.textContent;let c=0;for(let t=0;t<a.length;t++)a[t]==="*"&&(c+=1);const i=s("div",{class:"quote-stars-container"});for(let t=0;t<c;t++){const p=s("span",{class:"star"});i.append(p)}return s("div",{class:"quote-container"},`<div class="quote-img">
        <span class="icon icon-dark-blue-quote"/>
    </div>
    <div class="quote-content">
        <p class="stars">${i?.innerHTML}</p>
        <p class="description">${e?.innerHTML}</p>
        <p class="author">${n?.innerHTML}</p>
    </div>`)}async function g(r){const o=s("div",{class:"quote-wrap"});[...r.children].forEach(e=>{const n=d(e);n&&o.append(n)}),r.replaceChildren(o),u(r)}export{g as default};
//# sourceMappingURL=quote.js.map
