import{SDK_VERSION as m}from"../utils-hoist/version.js";function p(t,e,n=[e],r="npm"){const a=t._metadata||{};a.sdk||(a.sdk={name:`sentry.javascript.${e}`,packages:n.map(s=>({name:`${r}:@sentry/${s}`,version:m})),version:m}),t._metadata=a}export{p as applySdkMetadata};
//# sourceMappingURL=sdkMetadata.js.map
