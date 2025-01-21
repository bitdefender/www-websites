// eslint-disable-next-line import/no-cycle
import {
  sampleRUM,
  getMetadata,
} from './lib-franklin.js';

import { loadBreadcrumbs } from './breadcrumbs.js';
import { openUrlForOs } from './utils/utils.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// Load breadcrumbs
loadBreadcrumbs();

// Get the open URL for the user's OS
const urlMacos = getMetadata('open-url-macos');
const urlWindows = getMetadata('open-url-windows');
const urlAndroid = getMetadata('open-url-android');
const urlIos = getMetadata('open-url-ios');

if (urlMacos || urlWindows || urlAndroid || urlIos) {
  openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
}
