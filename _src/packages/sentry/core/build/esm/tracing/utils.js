import{addNonEnumerableProperty as e}from"../utils-hoist/object.js";const t="_sentryScope",n="_sentryIsolationScope";function c(o,S,r){o&&(e(o,n,r),e(o,t,S))}function p(o){return{scope:o[t],isolationScope:o[n]}}export{p as getCapturedScopesOnSpan,c as setCapturedScopesOnSpan};
//# sourceMappingURL=utils.js.map
