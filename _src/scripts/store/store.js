import { Adaptor } from "./adaptors/adaptor.base.js";
import { SET_OPTION } from "./products/product.base.js";
import { InitSelectorProvider } from "./providers/provider.init-selector.js";
import { VlaicuProvider } from "./providers/provider.vlaicu.js";
const BuiltInProviders = {
    init: InitSelectorProvider,
    vlaicu: VlaicuProvider
};
export const STORE_LOCALE = Symbol("locale");
export const STORE_ADAPTER = Symbol("adapter");
export const STORE_CAMPAIGN = Symbol("campaign");
export const STORE_TRANSFORMERS = Symbol("transformers");
export const STORE_OVERRIDES = Symbol("overrides");
class Cache {
    products;
    provider;
    store;
    constructor(param) {
        this.products = new Map();
        this.provider = param.provider;
        this.store = param.store;
    }
    async get({ id, campaign }) {
        const adaptor = await this.store[STORE_ADAPTER];
        const { id: adaptedId } = await adaptor.adaptTo({ id });
        const productKey = `${adaptedId}-${campaign}`;
        // Check if we already have a cached entry.
        const cacheEntry = this.products.get(productKey);
        if (cacheEntry) {
            // If this id has already been added, simply return the cached product.
            if (cacheEntry.ids.has(id)) {
                return await cacheEntry.base;
            }
            // Otherwise, add the new id and update the cached base promise.
            cacheEntry.ids.add(id);
            // Create an updated promise that aggregates new options.
            const updatedProductPromise = (async () => {
                const baseProduct = await cacheEntry.base;
                // Get the new product option for the new id.
                const newProduct = await this.provider.getProduct({ id, campaign });
                // If both exist, aggregate the new options into the base product.
                if (baseProduct && newProduct) {
                    // This assumes that setOption aggregates the options into baseProduct.
                    baseProduct[SET_OPTION]({ options: await newProduct.getOption() });
                }
                return baseProduct;
            })();
            // Update the cached promise so that future calls will wait for aggregation.
            cacheEntry.base = updatedProductPromise;
            return await updatedProductPromise;
        }
        // If no cache entry exists, call the provider and cache the result.
        const productPromise = this.provider.getProduct({ id, campaign });
        this.products.set(productKey, { base: productPromise, ids: new Set([id]) });
        return await productPromise;
    }
}
export class Store {
    cache;
    [STORE_LOCALE];
    [STORE_ADAPTER];
    [STORE_CAMPAIGN];
    [STORE_TRANSFORMERS];
    [STORE_OVERRIDES];
    constructor(config) {
        const defaultCampaign = async ({ campaign }) => campaign;
        this[STORE_LOCALE] = config.locale;
        this[STORE_ADAPTER] = Adaptor.create();
        this[STORE_CAMPAIGN] = config.campaign ?? defaultCampaign;
        this[STORE_TRANSFORMERS] = config.transformers;
        this[STORE_OVERRIDES] = config.overrides;
        this.cache = new Cache({
            provider: this.getProvider(config.provider),
            store: this
        });
    }
    async getProduct(param) {
        const productListToFetch = Array.isArray(param) ? param : [param];
        const productListToReturn = productListToFetch.map(product => this.cache.get(product));
        const products = (await Promise.allSettled(productListToReturn))
            .filter((promise) => promise.status === "fulfilled" && !!promise.value)
            .map(promise => promise.value);
        if (Array.isArray(param)) {
            return products;
        }
        else {
            return products.pop();
        }
    }
    getProvider(param) {
        // If provider is a string, use the corresponding built‑in constructor.
        const { name: provider } = param ?? {};
        if (typeof provider === "string") {
            const ctor = BuiltInProviders[provider];
            if (ctor) {
                return new ctor({ store: this });
            }
            throw new Error(`Unknown provider string: ${provider}`);
        }
        // Otherwise, assume provider is a constructor (a class definition).
        // This must be a concrete subclass of the abstract Provider.
        return new provider({ store: this });
    }
}
//# sourceMappingURL=store.js.map