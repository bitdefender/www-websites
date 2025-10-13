import { UnboundProductData } from "../products/product.base.js";
import { ProductSelector } from "../store.js";
import { Provider, ProviderData } from "./provider.base.js";
export interface FetchResponse {
    code: number;
    message: string;
    campaign: string;
    campaignType: string;
    platformProductId: string;
    verifoneProductCode: string;
    product: ProductData;
}
export interface ProductData {
    productId: string;
    productName: string;
    options: OptionData[];
}
export interface OptionData {
    slots: number;
    months: number;
    currency: string;
    price: number;
    discountedPrice: number;
    discountAmount: number;
    discountPercentage: number;
    buyLink: string;
}
export declare class VlaicuProvider extends Provider {
    constructor(param: ProviderData);
    fetch({ id, campaign }: ProductSelector): Promise<UnboundProductData | undefined>;
    private buildApiURL;
    private processVariations;
}
