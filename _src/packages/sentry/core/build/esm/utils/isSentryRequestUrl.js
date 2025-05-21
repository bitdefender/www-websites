function o(n,e){const u=e?.getDsn(),c=e?.getOptions().tunnel;return i(n,u)||r(n,c)}function r(n,e){return e?t(n)===t(e):!1}function i(n,e){return e?n.includes(e.host):!1}function t(n){return n[n.length-1]==="/"?n.slice(0,-1):n}export{o as isSentryRequestUrl};
//# sourceMappingURL=isSentryRequestUrl.js.map
