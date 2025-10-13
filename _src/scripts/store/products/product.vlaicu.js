import { Product } from "../products/product.base.js";
import { STORE_LOCALE } from "../store.js";
export class VlaicuProduct extends Product {
    constructor(product) {
        super(product);
    }
    async bundle(base, options) {
        // Get the base bundle from common logic.
        const bundleOption = await super.bundle(base, options);
        const locale = this.getStore()[STORE_LOCALE];
        const campaign = this.getCampaign();
        const url = new URL(`https://www.bitdefender.com/p-api/v1/buy-links/locale/${locale}`);
        if (campaign) {
            url.searchParams.set("campaign", campaign);
        }
        const bundles = [base, ...options]
            .map(option => `${option.getProduct().getId()}|${option.getDevices()}|${option.getSubscription()}`)
            .join(",");
        if (bundles) {
            url.searchParams.set("bundles", bundles);
        }
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            bundleOption.buyLink = data.buyLink;
        }
        return bundleOption;
    }
}
//# sourceMappingURL=product.vlaicu.js.map