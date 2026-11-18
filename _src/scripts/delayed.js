import { getMetadata, sampleRUM } from "./lib-franklin.js";
import { openUrlForOs } from "./utils/utils.js";
// src/scripts/delayed.js
sampleRUM("cwv");
var urlMacos = getMetadata("open-url-macos");
var urlWindows = getMetadata("open-url-windows");
var urlAndroid = getMetadata("open-url-android");
var urlIos = getMetadata("open-url-ios");
if (urlMacos || urlWindows || urlAndroid || urlIos) openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
