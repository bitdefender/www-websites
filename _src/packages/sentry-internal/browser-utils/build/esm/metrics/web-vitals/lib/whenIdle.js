import{WINDOW as t}from"../../../types.js";import{onHidden as i}from"./onHidden.js";import{runOnce as n}from"./runOnce.js";const s=e=>{const r=t.requestIdleCallback||t.setTimeout;let o=-1;return e=n(e),t.document?.visibilityState==="hidden"?e():(o=r(e),i(e)),o};export{s as whenIdle};
//# sourceMappingURL=whenIdle.js.map
