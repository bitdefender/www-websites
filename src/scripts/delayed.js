// eslint-disable-next-line import/no-cycle
import {
  sampleRUM,
  getMetadata,
} from './lib-franklin.js';

import { openUrlForOs } from './utils/utils.js';
import probeBlocker from './utils/blocker-probe.js';
import page from './page.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// Blocker share, counted by Cloudflare: only production traffic, so previews don't skew it
if (page.environment === 'prod') probeBlocker();

// Get the open URL for the user's OS
const urlMacos = getMetadata('open-url-macos');
const urlWindows = getMetadata('open-url-windows');
const urlAndroid = getMetadata('open-url-android');
const urlIos = getMetadata('open-url-ios');

if (urlMacos || urlWindows || urlAndroid || urlIos) {
  openUrlForOs(urlMacos, urlWindows, urlAndroid, urlIos);
}
