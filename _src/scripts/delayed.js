import page_default from "./page.js";
import { getMetadata, sampleRUM } from "./lib-franklin.js";
import { openUrlForOs } from "./utils/utils.js";
import probeBlocker from "./utils/blocker-probe.js";
// src/scripts/delayed.js
sampleRUM("cwv");
if (page_default.environment === "prod") probeBlocker();
var urlMacos = getMetadata("open-url-macos");
var urlWindows = getMetadata("open-url-windows");
var urlAndroid = getMetadata("open-url-android");
var urlIos = getMetadata("open-url-ios");
if (urlMacos || urlWindows || urlAndroid || urlIos) openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
