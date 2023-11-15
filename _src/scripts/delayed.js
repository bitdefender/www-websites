// eslint-disable-next-line import/no-cycle
import {
  loadScript,
  sampleRUM,
  fetchPlaceholders,
  getMetadata,
} from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import {
  getLanguageCountryFromPath,
  pushProductsToDataLayer,
  pushToDataLayer,
  getEnvironment,
  openUrlForOs,
} from './scripts.js';
import { loadBreadcrumbs } from './breadcrumbs.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const LANGUAGE_COUNTRY = getLanguageCountryFromPath(window.location.pathname);
const LAUNCH_URL = 'https://assets.adobedtm.com';
const ENVIRONMENT = getEnvironment(window.location.hostname, LANGUAGE_COUNTRY.country);

// Load Adobe Experience platform data collection (Launch) script
const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();
switch (ENVIRONMENT) {
  case 'prod':
    loadScript(LAUNCH_URL + launchProdScript); break;
  case 'stage':
    loadScript(LAUNCH_URL + launchStageScript); break;
  default:
    loadScript(LAUNCH_URL + launchDevScript); break;
}

pushProductsToDataLayer();
pushToDataLayer('page loaded');

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
