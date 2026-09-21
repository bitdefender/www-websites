import { Store } from '@repobit/dex-store';
import { target } from './target.js';
import page from './page.js';
import { getUrlPromotion, getMetadata, getCampaignBasedOnLocale } from './utils/utils.js';
import getTrialLinkMap from './trialLinkMap.js';

const trialLinkMap = await getTrialLinkMap();
export default new Store({
  campaign: async ({ campaign }) => (await target.configMbox)?.promotion || getUrlPromotion() || campaign || getMetadata('pid') || getCampaignBasedOnLocale(),
  locale: page.locale.includes('global') ? 'en-us' : page.locale,
  provider: { name: 'vlaicu' },
  trialLinks: trialLinkMap,
  transformers: {
    buyLink: async (param) => {
      const products = (await target.configMbox)?.products;
      const { buyLink, product, option } = param;
      const monthsToYears = option.subscription / (option.subscription === 1 ? 1 : 12);
      const targetOverride = products?.[product.alias]?.[`${option.devices}-${monthsToYears}`];

      const buyLinkURL = new URL(targetOverride?.buyLink || buyLink);
      buyLinkURL.searchParams.set('REF', product.campaign && product.campaign !== 'ignore' ? `WEBSITES_${product.campaign}` : 'N/A');

      targetOverride?.extraParameters.forEach(({ key, value }) => {
        buyLinkURL.searchParams.set(key, value);
      });

      return buyLinkURL.href;
    },
    trialLink: async (param) => {
      const {
        buyLink, option, trialLink,
      } = param;

      if (!trialLink) {
        return undefined;
      }

      const optionBuyLink = new URL(buyLink);
      const pageCoupon = page.getParamValue('coupon') || getMetadata('coupon');
      const coupon = pageCoupon || option.coupon;
      const matchBuyLinkURL = new URL(trialLink);
      optionBuyLink.searchParams.forEach((value, key) => {
        if (['LANG', 'CURRENCY', 'DCURRENCY', 'COUPON'].includes(key)) {
          matchBuyLinkURL.searchParams.set(key, value);
        }
      });
      matchBuyLinkURL.searchParams.set('SRC', window.location.origin + window.location.pathname);
      if (coupon) matchBuyLinkURL.searchParams.set('COUPON', coupon);

      return matchBuyLinkURL.href;
    },
  },
});
