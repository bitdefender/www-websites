const s=(e,r)=>{e.dataset.storeClickIncrement&&e.addEventListener("click",()=>{e.dataset.storeClickIncrement==="devices"&&r.devices<(Number(e.dataset.storeMax)||Number.MAX_SAFE_INTEGER)&&(r.devices+=1),e.dataset.storeClickIncrement==="years"&&r.years<(Number(e.dataset.storeMax)||Number.MAX_SAFE_INTEGER)&&(r.years+=1)})};export{s as resolve};
//# sourceMappingURL=increment.js.map
