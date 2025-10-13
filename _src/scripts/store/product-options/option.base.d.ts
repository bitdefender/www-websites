import { Product } from "../products/product.base.js";
export type ProductOptionData = {
    product: Product;
    price: number;
    discountedPrice: number;
    devices: number;
    subscription: number;
    buyLink: string;
};
export declare class ProductOption {
    private product;
    private price;
    private discountedPrice;
    private devices;
    private subscription;
    private currency?;
    private buyLink;
    private discount;
    constructor(option: ProductOptionData);
    getProduct(): Product;
    getVariation(): string;
    getPrice(): string;
    getPrice(param: {
        monthly?: boolean;
        currency: true;
    }): string;
    getPrice(param: {
        monthly?: boolean;
        currency?: false;
    }): number;
    getDiscountedPrice(): string;
    getDiscountedPrice(param: {
        monthly?: boolean;
        currency: true;
    }): string;
    getDiscountedPrice(param: {
        monthly?: boolean;
        currency?: false;
    }): number;
    getDiscount(): number;
    getDiscount(param: {
        percentage?: boolean;
        symbol: true;
    }): string;
    getDiscount(param: {
        percentage?: boolean;
        symbol?: false;
    }): number;
    getBuyLink(): string;
    getDevices(): number;
    getSubscription(): number;
}
