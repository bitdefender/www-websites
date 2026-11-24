const SUBSCRIPTION_MONTHS = 12;
const DEFAULT_CAMPAIGN = 'default';

const TRIAL_LINKS_URL = 'https://www.bitdefender.com/common/triallinks.json';

const warnNoTrials = (reason, error) => {
  // eslint-disable-next-line no-console
  console.warn(`Trial links: ${reason}, continuing without them.`, ...(error ? [error] : []));
};

/**
 * Fetches the trial links sheet. Never rejects: store.js awaits this at the top level,
 * so a failure here (CORS on previews and localhost, network errors) would blank the page.
 * On any failure it warns and returns an empty list; only trial CTAs lose their mapping.
 *
 * @returns {Promise<Array<Record<string, string>>>}
 */
const getTrials = async () => {
  let res;
  try {
    res = await fetch(TRIAL_LINKS_URL);
  } catch (error) {
    warnNoTrials(`request to ${TRIAL_LINKS_URL} failed`, error);
    return [];
  }

  if (!res.ok) {
    warnNoTrials(`${TRIAL_LINKS_URL} answered ${res.status}`);
    return [];
  }

  try {
    const { data } = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    warnNoTrials(`${TRIAL_LINKS_URL} returned invalid JSON`, error);
    return [];
  }
};

const getLocale = () => {
  const locale = (window.location.pathname.split('/')[1]?.split('-')[1] || '').toLowerCase();
  return !locale || locale === 'us' ? 'COM' : locale.toUpperCase();
};

let trialMapCache = null;

/**
 * Builds and caches a trial link lookup map from the remote trial links sheet.
 *
 * Structure:
 * {
 *   [productId]: {
 *     [campaign]: {
 *       [`${devices}-${subscriptionMonths}`]: buyLink
 *     }
 *   }
 * }
 *
 * Campaign is always 'default' (no campaign field in the source data).
 * Subscription months is always 12 (annual).
 * When multiple trial durations exist for the same product/devices, the first entry wins.
 *
 * @returns {Promise<Partial<Record<string, Record<string, Record<string, string>>>>>}
 */
export default async function getTrialLinkMap() {
  if (trialMapCache) return trialMapCache;

  const trials = await getTrials();
  if (!trials?.length) {
    trialMapCache = {};
    return trialMapCache;
  }

  const locale = getLocale();
  const map = trials.reduce((acc, {
    product, devices, buy_link: buyLink, locale: rowLocale, duration,
  }) => {
    if (!product || !devices || !buyLink) return acc;
    if (rowLocale?.toUpperCase() !== locale) return acc;

    const variantKey = `${devices}-${SUBSCRIPTION_MONTHS}`;

    acc[product] ??= {};
    acc[product][DEFAULT_CAMPAIGN] ??= {};
    acc[product][DEFAULT_CAMPAIGN][variantKey] ??= {};
    acc[product][DEFAULT_CAMPAIGN][variantKey][duration] ??= buyLink;

    return acc;
  }, {});

  trialMapCache = map;
  return map;
}
