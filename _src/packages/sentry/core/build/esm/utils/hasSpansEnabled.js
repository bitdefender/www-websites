import{getClient as n}from"../currentScopes.js";function a(t){if(typeof __SENTRY_TRACING__=="boolean"&&!__SENTRY_TRACING__)return!1;const e=t||n()?.getOptions();return!!e&&(e.tracesSampleRate!=null||!!e.tracesSampler)}export{a as hasSpansEnabled};
//# sourceMappingURL=hasSpansEnabled.js.map
