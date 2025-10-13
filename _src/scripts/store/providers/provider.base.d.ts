import { Product, UnboundProductData } from "../products/product.base.js";
import { ProductSelector, Store } from "../store.js";
export type ProviderData = {
    store: Store;
};
export declare const INGNORE_CAMPAIGN: string[];
export declare abstract class Provider {
    protected store: Store;
    constructor({ store }: ProviderData);
    getProduct(param: ProductSelector): Promise<Product | undefined>;
    private applyOverrides;
    private applyTransformers;
    getCampaign(id: string, campaign?: string): Promise<string | undefined>;
    adaptTo(param: {
        id: string;
    }): Promise<{
        id: string;
    }>;
    adaptTo(param: {
        id: string;
        devices: number;
        subscription: number;
    }): Promise<{
        id: string;
        devices: number;
        subscription: number;
    }>;
    protected abstract fetch(product: ProductSelector): Promise<UnboundProductData | undefined>;
}
