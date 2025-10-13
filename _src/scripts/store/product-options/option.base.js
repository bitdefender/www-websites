import { formatPrice } from "../format-price.js";
export class ProductOption {
    product;
    price;
    discountedPrice;
    devices;
    subscription;
    currency;
    buyLink;
    discount;
    constructor(option) {
        this.product = option.product;
        this.price = {
            value: option.price,
            monthly: Number(Number(option.price / option.subscription).toFixed(2))
        };
        this.discountedPrice = {
            value: option.discountedPrice,
            monthly: Number(Number(option.discountedPrice / option.subscription).toFixed(2))
        };
        this.devices = option.devices;
        this.subscription = option.subscription;
        this.currency = option.product.getCurrency();
        this.buyLink = option.buyLink;
        this.discount = {
            value: Math.round((option.price - option.discountedPrice + Number.EPSILON) * 100) / 100,
            percentage: Math.round(((option.price - option.discountedPrice) / option.price * 100))
        };
    }
    getProduct() {
        return this.product;
    }
    getVariation() {
        return `${this.devices}-${this.subscription}`;
    }
    getPrice(param) {
        const { monthly = false, currency = true } = param ?? {};
        const rawPrice = monthly ? this.price.monthly : this.price.value;
        if (currency) {
            return formatPrice({ price: rawPrice, currency: this.currency });
        }
        return rawPrice;
    }
    getDiscountedPrice(param) {
        const { monthly = false, currency = true } = param ?? {};
        const rawPrice = monthly ? this.discountedPrice.monthly : this.discountedPrice.value;
        if (currency) {
            return formatPrice({ price: rawPrice, currency: this.currency });
        }
        return rawPrice;
    }
    getDiscount(param) {
        const { percentage = false, symbol = true } = param ?? {};
        const rawValue = percentage ? this.discount.percentage : this.discount.value;
        if (symbol) {
            return percentage
                ? `${rawValue}%`
                : formatPrice({ price: rawValue, currency: this.currency });
        }
        return rawValue;
    }
    getBuyLink() {
        return this.buyLink;
    }
    getDevices() {
        return this.devices;
    }
    getSubscription() {
        return this.subscription;
    }
}
//# sourceMappingURL=option.base.js.map