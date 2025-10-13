import { Product } from "../products/product.base.js";
import { ProductSelector, Store } from "../store.js";
export type ProviderData = {
    store: Store;
};
export declare const INGNORE_CAMPAIGN: string[];
export interface Provider {
    getProduct(param: ProductSelector): Promise<Product | undefined>;
}
