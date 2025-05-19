const o=(r,s,t)=>{try{if(PerformanceObserver.supportedEntryTypes.includes(r)){const e=new PerformanceObserver(n=>{Promise.resolve().then(()=>{s(n.getEntries())})});return e.observe(Object.assign({type:r,buffered:!0},t||{})),e}}catch{}};export{o as observe};
//# sourceMappingURL=observe.js.map
