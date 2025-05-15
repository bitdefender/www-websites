import '../node_modules/@repobit/dex-utils/dist/src/index.js';
import Page from '../node_modules/@repobit/dex-utils/dist/src/page.js';

/**
 * @returns {`${string}-${string}`} page locale
 */
const getPageLocale = () => {
  const regex = /\/([a-z]{2}-[a-z]{2})\//i; // match locale with slashes
  // extract locale without slashes
  const match = window.location.pathname.match(regex);
  const defaultLocale = 'en-us';
  if (match) {
    return match[1];
  }

  return defaultLocale;
};

/**
 * @returns {'dev' | 'stage' | 'prod'}
 */
const getEnvironment = () => {
  const { hostname } = window.location;
  if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) {
    return 'stage';
  }
  if (hostname.includes('www.bitdefender')) {
    return 'prod';
  }
  return 'dev';
};

/**
 * @returns {string} page name
 */
const getPageName = () => window.location.pathname.split('/').filter(Boolean).pop();

const page = new Page(getPageLocale(), getPageName(), getEnvironment());

export { page as default };
//# sourceMappingURL=page.js.map
