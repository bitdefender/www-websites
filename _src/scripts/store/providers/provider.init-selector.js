import { STORE_LOCALE } from "../store.js";
import { INGNORE_CAMPAIGN, Provider } from "./provider.base.js";
const countriesMapping = new Map([
    ["gb", "uk"],
    ["ch", "de"],
    ["at", "de"],
    ["us", "us"],
    ["mx", "en"],
    ["nz", "au"]
]);
const getCountry = (country) => countriesMapping.get(country) ?? country;
export class InitSelectorProvider extends Provider {
    country;
    language;
    constructor(config) {
        super(config);
        const [language, country] = this.store[STORE_LOCALE].split("-");
        this.language = language;
        this.country = getCountry(country);
    }
    async fetch({ id, campaign }) {
        const adaptedId = (await this.adaptTo({ id })).id;
        const computedCampaign = await this.getCampaign(adaptedId, campaign);
        const payload = this.buildPayload(id, computedCampaign);
        const apiURL = this.buildApiURL();
        let fetchResponse;
        try {
            const formData = new FormData();
            formData.append("data", payload);
            const response = await fetch(apiURL.href, {
                method: "post",
                body: formData
            });
            if (!response.ok)
                return undefined;
            fetchResponse = await response.json();
            // Ensure variations exist.
            if (!fetchResponse.data.product.variations ||
                Object.keys(fetchResponse.data.product.variations).length === 0) {
                return undefined;
            }
        }
        catch (error) {
            console.error("Failed to fetch product:", error);
            return undefined;
        }
        // Process variations into option data.
        const { options, platformId, currency } = await this.processVariations(id, fetchResponse.data.product.variations, computedCampaign);
        // Return an UnboundProductData.
        return {
            id: adaptedId,
            name: fetchResponse.data.product.product_name,
            campaign: computedCampaign,
            currency,
            platformId,
            options
        };
    }
    buildPayload(id, campaign) {
        const config = { country_code: this.country };
        if (INGNORE_CAMPAIGN.includes(String(campaign))) {
            config.ignore_promotions = true;
        }
        else {
            config.extra_params = { pid: campaign || null };
        }
        return JSON.stringify({
            ev: 1,
            product_id: id,
            config
        });
    }
    buildApiURL() {
        const url = new URL("https://www.bitdefender.com/site/Store/ajax");
        url.searchParams.set("force_country", this.country);
        return url;
    }
    async processVariations(id, variations, campaign) {
        const options = new Map();
        let platformId = "";
        let currency = "";
        // Loop through devices and subscriptions.
        for (const [devices, devicesValue] of Object.entries(variations)) {
            for (const [subscription, subscriptionsValue] of Object.entries(devicesValue)) {
                const adaptedVariation = await this.adaptTo({
                    id,
                    subscription: Number(subscription),
                    devices: Number(devices)
                });
                const variationData = {
                    devices: adaptedVariation.devices,
                    subscription: adaptedVariation.subscription,
                    price: Number(subscriptionsValue.price),
                    discountedPrice: Number(subscriptionsValue.discount?.discounted_price || 0),
                    buyLink: "" // To be computed below.
                };
                // Capture common info.
                platformId = subscriptionsValue.platform_product_id;
                currency = subscriptionsValue.currency_iso;
                campaign = campaign || subscriptionsValue.promotion;
                //compute buy link
                variationData.buyLink = this.buildBuyLink(id, variationData, subscriptionsValue, campaign);
                options.set(`${adaptedVariation.devices}-${adaptedVariation.subscription}`, variationData);
            }
        }
        return { options, platformId, currency };
    }
    buildBuyLink(id, variation, subscriptionsValue, campaign) {
        const buyLinkRouteParams = ["buy", id, variation.devices, variation.subscription].join("/");
        // Build base URL; include campaign pid if available.
        const pathSuffix = campaign ? `pid.${campaign}` : "";
        const url = new URL(`https://www.bitdefender.com/site/Store/${buyLinkRouteParams}/${pathSuffix}`);
        url.searchParams.set("CURRENCY", subscriptionsValue.currency_iso);
        url.searchParams.set("DCURRENCY", subscriptionsValue.currency_iso);
        url.searchParams.set("CART", "1");
        url.searchParams.set("CARD", "2");
        url.searchParams.set("SHORT_FORM", "1");
        url.searchParams.set("LANG", this.language);
        url.searchParams.set("force_country", this.country);
        return url.href;
    }
}
//# sourceMappingURL=provider.init-selector.js.map