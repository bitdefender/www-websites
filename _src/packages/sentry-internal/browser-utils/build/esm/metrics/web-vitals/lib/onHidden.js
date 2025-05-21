import{WINDOW as t}from"../../../types.js";const o=d=>{const e=i=>{(i.type==="pagehide"||t.document?.visibilityState==="hidden")&&d(i)};t.document&&(addEventListener("visibilitychange",e,!0),addEventListener("pagehide",e,!0))};export{o as onHidden};
//# sourceMappingURL=onHidden.js.map
