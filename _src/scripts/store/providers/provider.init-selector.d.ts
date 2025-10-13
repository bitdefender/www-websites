import { UnboundProductData } from "../products/product.base.js";
import { ProductSelector } from "../store.js";
import { Provider, ProviderData } from "./provider.base.js";
export interface FetchResponse {
    code: number;
    data: {
        product: ProductData;
        config: ConfigData;
    };
}
export interface ProductData {
    product_id: string;
    product_name: string;
    product_type: string;
    product_alias: string;
    product_active: string;
    base_uri: string;
    variations: VariationsData;
}
export type VariationsData = Record<string, Record<string, VariationData>>;
export interface VariationData {
    product_id: string;
    region_id: string;
    variation_id: string;
    platform_id: string;
    platform_product_id: string;
    price: string;
    currency_id: string;
    in_selector: string;
    active_platform: string;
    variation_active: string;
    avangate_variation_prefix: string;
    variation: VariationDetail;
    currency_label: string;
    currency_iso: string;
    discount?: DiscountData;
    promotion?: string;
    promotion_functions?: string;
}
export interface VariationDetail {
    variation_id: string;
    variation_name: string;
    dimension_id: string;
    dimension_value: string;
    years: string;
}
export interface DiscountData {
    discounted_price: string;
    discount_value: string;
    discount_type: number;
}
export interface ConfigData {
    country_code: string;
    extra_params: {
        pid: string | null;
    };
}
export declare class InitSelectorProvider extends Provider {
    private country;
    private language;
    constructor(config: ProviderData);
    fetch({ id, campaign }: ProductSelector): Promise<UnboundProductData | undefined>;
    private buildPayload;
    private buildApiURL;
    private processVariations;
    private buildBuyLink;
}
