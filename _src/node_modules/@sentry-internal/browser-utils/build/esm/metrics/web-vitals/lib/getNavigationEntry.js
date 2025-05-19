import{WINDOW as n}from"../../../types.js";const o=(r=!0)=>{const t=n.performance?.getEntriesByType?.("navigation")[0];if(!r||t&&t.responseStart>0&&t.responseStart<performance.now())return t};export{o as getNavigationEntry};
//# sourceMappingURL=getNavigationEntry.js.map
