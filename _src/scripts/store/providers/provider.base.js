import { Product } from "../products/product.base.js";
import { STORE_ADAPTER, STORE_CAMPAIGN, STORE_OVERRIDES, STORE_TRANSFORMERS } from "../store.js";
export const INGNORE_CAMPAIGN = ["ignore", "none", "0"];
export class Provider {
    store;
    constructor({ store }) {
        this.store = store;
    }
    async getProduct(param) {
        let product = await this.fetch(param);
        product = await this.applyOverrides(product);
        product = await this.applyTransformers(product);
        return product ? new Product({ ...product, store: this.store }) : product;
    }
    async applyOverrides(product) {
        if (!product) {
            return product;
        }
        const ovProduct = this.store[STORE_OVERRIDES]?.[product.id];
        if (!ovProduct) {
            return product;
        }
        for (const [variation, ovOption] of Object.entries(ovProduct.options)) {
            const option = product.options.get(variation);
            if (!ovOption) {
                product.options.delete(variation);
            }
            else {
                product.options.set(variation, { ...option, ...ovOption });
            }
        }
        return product;
    }
    async applyTransformers(product) {
        if (!product) {
            return product;
        }
        for (const option of product.options.values()) {
            if (this.store[STORE_TRANSFORMERS]?.option?.buyLink) {
                option.buyLink = await this.store[STORE_TRANSFORMERS]?.option?.buyLink(option.buyLink);
            }
        }
        return product;
    }
    async getCampaign(id, campaign) {
        return this.store[STORE_OVERRIDES]?.[id]?.campaign || await this.store[STORE_CAMPAIGN]({ id, campaign });
    }
    async adaptTo(param) {
        const adaptor = await this.store[STORE_ADAPTER];
        return await adaptor.adaptTo(param);
    }
}
//# sourceMappingURL=provider.base.js.map