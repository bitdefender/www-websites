function p(n,t,f=2){if(!t||typeof t!="object"||f<=0)return t;if(n&&Object.keys(t).length===0)return n;const c={...n};for(const o in t)Object.prototype.hasOwnProperty.call(t,o)&&(c[o]=p(c[o],t[o],f-1));return c}export{p as merge};
//# sourceMappingURL=merge.js.map
