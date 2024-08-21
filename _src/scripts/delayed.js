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
import { GLOBAL_EVENTS } from './utils/utils.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

const LANGUAGE_COUNTRY = getLanguageCountryFromPath(window.location.pathname);
const LAUNCH_URL = 'https://assets.adobedtm.com';
const ENVIRONMENT = getEnvironment(window.location.hostname, LANGUAGE_COUNTRY.country);

// Load Adobe Experience platform data collection (Launch) script
const { launchProdScript, launchStageScript, launchDevScript } = await fetchPlaceholders();

(async () => {
  const ADOBE_MC_URL_ENV_MAP = new Map([
    ['prod', launchProdScript],
    ['stage', launchStageScript],
  ]);

  const adobeMcScriptUrl = `${LAUNCH_URL}${ADOBE_MC_URL_ENV_MAP.get(ENVIRONMENT) || launchDevScript}`;
  await loadScript(adobeMcScriptUrl);

  document.dispatchEvent(new Event(GLOBAL_EVENTS.ADOBE_MC_LOADED));
  window.ADOBE_MC_EVENT_LOADED = true;
})();

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
