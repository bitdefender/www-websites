import { Store } from '@repobit/dex-store';
import { target } from './target.js';
import page from './page.js';
import { getUrlPromotion, getMetadata, getCampaignBasedOnLocale } from './utils/utils.js';

export default new Store({
  campaign: async ({ campaign }) => (await target.configMbox)?.promotion || getUrlPromotion() || campaign || getMetadata('pid') || getCampaignBasedOnLocale(),
  locale: page.locale,
  provider: { name: 'vlaicu' },
  transformers: {
    buyLink: async (param) => {
      const products = (await target.configMbox)?.products;
      const { buyLink, product, option } = param;
      const buyLinkURL = new URL(buyLink);
      buyLinkURL.searchParams.set('REF', product.campaign && product.campaign !== 'ignore' ? `WEBSITES_${product.campaign}` : 'N/A');
      if (products) {
        const monthsToYears = option.subscription / (option.subscription === 1 ? 1 : 12);
        const extraParameters = products[product.alias]?.[`${option.devices}-${monthsToYears}`]?.extraParameters || [];
        extraParameters.forEach(({ key, value }) => {
          buyLinkURL.searchParams.set(key, value);
        });
      }

      return buyLinkURL.href;
    },
  },
});
