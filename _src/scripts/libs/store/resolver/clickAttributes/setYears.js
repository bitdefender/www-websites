const s=(e,r)=>{if(e.dataset.storeClickSetYears!==void 0){if(e.nodeName==="SELECT"){e.addEventListener("change",a=>{r.years=a.target.value});return}e.addEventListener("click",()=>{r.years=e.dataset.storeClickSetYears})}};export{s as resolve};
//# sourceMappingURL=setYears.js.map
