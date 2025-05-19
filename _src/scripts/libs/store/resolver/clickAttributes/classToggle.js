const l=(s,a)=>{s.dataset.storeClickClassToggle&&s.addEventListener("click",()=>{a.clickAttributes.forEach(e=>e.dataset.storeClickClassToggle&&e.classList.remove(s.dataset.storeClickClassToggle)),s.classList.add(s.dataset.storeClickClassToggle)})};export{l as resolve};
//# sourceMappingURL=classToggle.js.map
