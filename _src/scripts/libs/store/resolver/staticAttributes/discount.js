import{writeValue as r}from"../resolver.js";const a=(t,{option:e})=>{if(!(!t.dataset.storeDiscount||!e))switch(t.dataset.storeDiscount){case"value":e.getDiscount("valueWithCurrency")&&r(t,e.getDiscount("valueWithCurrency"));break;case"percentage":e.getDiscount("percentageWithProcent")&&r(t,e.getDiscount("percentageWithProcent"));break}};export{a as resolve};
//# sourceMappingURL=discount.js.map
