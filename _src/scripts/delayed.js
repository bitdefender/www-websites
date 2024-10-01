// eslint-disable-next-line import/no-cycle
import {
  loadScript,
  sampleRUM,
  fetchPlaceholders,
  getMetadata,
} from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import {
  openUrlForOs,
} from './scripts.js';
import { loadBreadcrumbs } from './breadcrumbs.js';

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
