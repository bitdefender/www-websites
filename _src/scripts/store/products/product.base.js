import { formatPrice } from "../format-price.js";
import { ProductOption } from "../product-options/option.base.js";
import { STORE_ADAPTER } from "../store.js";
export const SET_OPTION = Symbol("setOption");
export class Product {
    store;
    name;
    campaign;
    campaignType;
    id;
    currency;
    options;
    platformId;
    devices;
    subscriptions;
    discount;
    price;
    discountedPrice;
    constructor(product) {
        this.store = product.store;
        this.name = product.name;
        this.campaign = product.campaign;
        this.campaignType = product.campaignType;
        this.id = product.id;
        this.platformId = product.platformId;
        this.currency = product.currency;
        this.devices = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            values: []
        };
        this.subscriptions = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            values: []
        };
        this.discount = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            percentage: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        };
        this.price = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            monthly: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        };
        this.discountedPrice = {
            min: Number.MAX_SAFE_INTEGER,
            max: Number.MIN_SAFE_INTEGER,
            monthly: {
                min: Number.MAX_SAFE_INTEGER,
                max: Number.MIN_SAFE_INTEGER
            }
        };
        this.options = new Map();
        const devices = new Set();
        const subscriptions = new Set();
        for (const [key, option] of product.options.entries()) {
            const productOption = new ProductOption({ ...option, product: this });
            this.options.set(key, productOption);
            this.price.min = Math.min(productOption.getPrice({ currency: false }), this.price.min);
            this.price.max = Math.max(productOption.getPrice({ currency: false }), this.price.max);
            this.price.monthly.min = Math.min(productOption.getPrice({ monthly: true, currency: false }), this.price.monthly.min);
            this.price.monthly.max = Math.max(productOption.getPrice({ monthly: true, currency: false }), this.price.monthly.max);
            this.discountedPrice.min = Math.min(productOption.getDiscountedPrice({ currency: false }), this.discountedPrice.min);
            this.discountedPrice.max = Math.max(productOption.getDiscountedPrice({ currency: false }), this.discountedPrice.max);
            this.discountedPrice.monthly.min = Math.min(productOption.getDiscountedPrice({ monthly: true, currency: false }), this.discountedPrice.monthly.min);
            this.discountedPrice.monthly.max = Math.max(productOption.getDiscountedPrice({ monthly: true, currency: false }), this.discountedPrice.monthly.max);
            this.devices.min = Math.min(productOption.getDevices(), this.devices.min);
            this.devices.max = Math.max(productOption.getDevices(), this.devices.max);
            devices.add(productOption.getDevices());
            this.subscriptions.min = Math.min(productOption.getSubscription(), this.subscriptions.min);
            this.subscriptions.max = Math.max(productOption.getSubscription(), this.subscriptions.max);
            subscriptions.add(productOption.getSubscription());
            this.discount.min = Math.min(productOption.getDiscount({ symbol: false }), this.discount.min);
            this.discount.max = Math.max(productOption.getDiscount({ symbol: false }), this.discount.max);
            this.discount.percentage.min = Math.min(productOption.getDiscount({ percentage: true, symbol: false }), this.discount.percentage.min);
            this.discount.percentage.max = Math.max(productOption.getDiscount({ percentage: true, symbol: false }), this.discount.percentage.max);
        }
        this.devices.values = [...devices];
        this.subscriptions.values = [...subscriptions];
    }
    getStore() {
        return this.store;
    }
    getId() {
        return this.id;
    }
    getPlatformId() {
        return this.platformId;
    }
    getName() {
        return this.name;
    }
    getCampaign() {
        return this.campaign;
    }
    getCampaignType() {
        return this.campaignType;
    }
    getCurrency() {
        return this.currency;
    }
    async getOption(param) {
        const adaptor = await this.store[STORE_ADAPTER];
        const { devices, subscription } = await adaptor.adaptTo({
            id: this.id,
            subscription: Number(param?.subscription),
            devices: Number(param?.devices)
        });
        const bundle = param?.bundle?.filter((option) => Boolean(option));
        const makeBundle = async (option, bundle) => new ProductOption({ ...(await this.bundle(option, bundle)), product: this });
        if (Number(devices) && Number(subscription)) {
            const option = this.options.get(`${devices}-${subscription}`);
            if (!option)
                return undefined;
            //bundle with the option
            if (bundle) {
                return await makeBundle(option, bundle);
            }
            else {
                return option;
            }
        }
        if (bundle) {
            const optionsWithBundle = [...this.options.values()].map(option => makeBundle(option, bundle));
            const settled = await Promise.allSettled(optionsWithBundle);
            return settled
                .map((result) => result.status === "fulfilled" ? result.value : undefined);
        }
        //return all options
        return [...this.options.values()];
    }
    [SET_OPTION](param) {
        const options = Array.isArray(param.options) ? param.options : [param.options];
        for (const option of options) {
            const devices = option.getDevices();
            const subscription = option.getSubscription();
            this.options.set(`${devices}-${subscription}`, option);
        }
    }
    getPrice(param) {
        const { monthly = false, currency = true } = param ?? {};
        const price = monthly
            ? this.price.monthly
            : this.price;
        if (currency) {
            return {
                min: formatPrice({ price: price.min, currency: this.currency }),
                max: formatPrice({ price: price.max, currency: this.currency })
            };
        }
        return {
            min: price.min,
            max: price.max
        };
    }
    getDiscountedPrice(param) {
        const { monthly = false, currency = true } = param ?? {};
        const discountedPrice = monthly
            ? this.discountedPrice.monthly
            : this.discountedPrice;
        if (currency) {
            return {
                min: formatPrice({ price: discountedPrice.min, currency: this.currency }),
                max: formatPrice({ price: discountedPrice.max, currency: this.currency })
            };
        }
        return {
            min: discountedPrice.min,
            max: discountedPrice.max
        };
    }
    getDiscount(param) {
        const { percentage = false, symbol = true } = param ?? {};
        const discountValue = percentage
            ? this.discount.percentage
            : this.discount;
        if (percentage) {
            return symbol
                ? { min: `${discountValue.min}%`, max: `${discountValue.max}%` }
                : { min: discountValue.min, max: discountValue.max };
        }
        return symbol
            ? {
                min: formatPrice({ price: discountValue.min, currency: this.currency }),
                max: formatPrice({ price: discountValue.max, currency: this.currency })
            }
            : {
                min: discountValue.min,
                max: discountValue.max
            };
    }
    getDevices() {
        return this.devices;
    }
    getSubscriptions() {
        return this.subscriptions;
    }
    async bundle(base, options) {
        const round = (n) => Number(n.toFixed(2));
        // Start with the first option as the base
        const bundledOption = {
            price: base.getPrice({ currency: false }),
            discountedPrice: base.getDiscountedPrice({ currency: false }),
            buyLink: base.getBuyLink(),
            subscription: base.getSubscription(),
            devices: base.getDevices()
        };
        // Process the remaining options
        for (const option of options.slice(1)) {
            const optionPrice = option.getPrice({ currency: false });
            const optionDiscountedPrice = option.getDiscountedPrice({ currency: false });
            // Always add the option's price to the bundled price
            bundledOption.price = round(bundledOption.price + optionPrice);
            if (optionDiscountedPrice) {
                if (bundledOption.discountedPrice) {
                    // Both exist: add them together
                    bundledOption.discountedPrice = round(bundledOption.discountedPrice + optionDiscountedPrice);
                }
                else {
                    // If no current discountedPrice, base it on the updated price
                    bundledOption.discountedPrice = round(bundledOption.price + optionDiscountedPrice);
                }
            }
            else if (bundledOption.discountedPrice) {
                // If option lacks a discountedPrice but bundledOption already has one,
                // update the bundled price using the existing discounted value.
                bundledOption.price = round(bundledOption.discountedPrice + optionPrice);
            }
        }
        return bundledOption;
    }
}
//# sourceMappingURL=product.base.js.map