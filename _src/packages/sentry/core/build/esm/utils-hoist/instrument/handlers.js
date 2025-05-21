import{DEBUG_BUILD as a}from"../../debug-build.js";import{logger as m}from"../logger.js";import{getFunctionName as s}from"../stacktrace.js";const o={},i={};function g(r,n){o[r]=o[r]||[],o[r].push(n)}function l(r,n){if(!i[r]){i[r]=!0;try{n()}catch(t){a&&m.error(`Error while instrumenting ${r}`,t)}}}function h(r,n){const t=r&&o[r];if(t)for(const e of t)try{e(n)}catch(c){a&&m.error(`Error while triggering instrumentation handler.
Type: ${r}
Name: ${s(e)}
Error:`,c)}}export{g as addHandler,l as maybeInstrument,h as triggerHandlers};
//# sourceMappingURL=handlers.js.map
