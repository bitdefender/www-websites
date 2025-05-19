import{sampleRUM as t,getMetadata as o}from"./lib-franklin.js";import{loadBreadcrumbs as a}from"./breadcrumbs.js";import{openUrlForOs as d}from"./utils/utils.js";t("cwv");a();const r=o("open-url-macos"),n=o("open-url-windows"),s=o("open-url-android"),l=o("open-url-ios");(r||n||s||l)&&d(r,n,s,l);
//# sourceMappingURL=delayed.js.map
