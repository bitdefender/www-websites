const s=(e,r)=>{e.dataset.storeClickDecrement&&e.addEventListener("click",()=>{e.dataset.storeClickDecrement==="devices"&&r.devices>(Number(e.dataset.storeMin)||Number.MIN_SAFE_INTEGER)&&(r.devices-=1),e.dataset.storeClickDecrement==="years"&&r.years>(Number(e.dataset.storeMin)||Number.MIN_SAFE_INTEGER)&&(r.years-=1)})};export{s as resolve};
//# sourceMappingURL=decrement.js.map
