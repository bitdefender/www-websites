import { STORE_LOCALE } from "../store.js";
import { INGNORE_CAMPAIGN, Provider } from "./provider.base.js";
export class VlaicuProvider extends Provider {
    constructor(param) {
        super(param);
    }
    async fetch({ id, campaign }) {
        const adaptedId = (await this.adaptTo({ id })).id;
        const computedCampaign = await this.getCampaign(adaptedId, campaign);
        const apiURL = this.buildApiURL(adaptedId, this.store[STORE_LOCALE], computedCampaign);
        let fetchResponse;
        try {
            const response = await fetch(apiURL.href, {
                method: "get",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok)
                return undefined;
            fetchResponse = await response.json();
        }
        catch (error) {
            console.error("Failed to fetch product:", error);
            return undefined;
        }
        // Process variations into option data.
        const { options, currency } = await this.processVariations(adaptedId, fetchResponse.product.options);
        // Return an UnboundProductData.
        return {
            id: adaptedId,
            name: fetchResponse.product.productName,
            campaign: computedCampaign || fetchResponse.campaign,
            campaignType: fetchResponse.campaignType || '',
            currency,
            platformId: fetchResponse.platformProductId,
            options
        };
    }
    buildApiURL(id, locale, campaign) {
        const apiParams = ["products", id, "locale", locale];
        if (campaign) {
            apiParams.push("campaign", INGNORE_CAMPAIGN.includes(String(campaign)) ? "null" : campaign);
        }
        const url = new URL(`https://www.bitdefender.com/p-api/v1/${apiParams.join("/")}`);
        return url;
    }
    async processVariations(id, variations) {
        const options = new Map();
        let currency = "";
        // Loop through devices and subscriptions.
        for (const variation of variations) {
            const adaptedVariation = await this.adaptTo({
                id,
                subscription: Number(variation.months),
                devices: Number(variation.slots)
            });
            const variationData = {
                devices: adaptedVariation.devices,
                subscription: adaptedVariation.subscription,
                price: Number(variation.price),
                discountedPrice: Number(variation.discountedPrice || 0),
                buyLink: variation.buyLink
            };
            // Capture common info.
            currency = variation.currency;
            options.set(`${adaptedVariation.devices}-${adaptedVariation.subscription}`, variationData);
        }
        return { options, currency };
    }
}
//# sourceMappingURL=provider.vlaicu.js.map