import { Product } from "../products/product.base.js";
const bundleIds = {
    "smallbs.bs_nadrm.bs_wadc": {
        id: "b_wa_na",
        coupon: "COUPON.GravityZone-30OFF"
    },
    "smallbs.bs_wadc.bs_nadrm": {
        id: "b_wa_na",
        coupon: "COUPON.GravityZone-30OFF"
    },
    "smallbs.bs_wadc": {
        id: "b_wa",
        coupon: "COUPON.GravityZone-30OFF"
    },
    "smallbs.bs_nadrm": {
        id: "b_na",
        coupon: "COUPON.GravityZone-30OFF"
    }
};
export class InitSelectorProduct extends Product {
    constructor(product) {
        super(product);
    }
    async bundle(base, options) {
        // Get the base bundle from common logic.
        const bundleOption = await super.bundle(base, options);
        // First, check for a VPN bundle override.
        if (this.hasVpnOption(base, options)) {
            bundleOption.buyLink = this.applyVpnBundle(bundleOption.buyLink);
            return bundleOption;
        }
        // Otherwise, check if there's a small business bundle mapping.
        const mapping = this.getSmallBusinessBundleMapping(base, options);
        if (mapping) {
            bundleOption.buyLink = this.applySmallBusinessBundle(bundleOption.buyLink, mapping);
        }
        return bundleOption;
    }
    // Returns true if any option is for the VPN product.
    hasVpnOption(base, options) {
        const isVpnInOptions = options.some(option => option.getProduct().getId() === "com.bitdefender.vpn");
        const isBaseVpn = base.getProduct().getId() === "com.bitdefender.vpn";
        return isVpnInOptions || isBaseVpn;
    }
    // For VPN bundles, we adjust the buyLink by replacing "buy" with "buybundle".
    applyVpnBundle(buyLink) {
        return buyLink.replace("buy", "buybundle");
    }
    // Build the key and lookup a small business bundle mapping, if any.
    getSmallBusinessBundleMapping(base, options) {
        const baseId = base.getProduct().getId();
        const optionsBundleId = options
            .map(option => option.getProduct().getId())
            .join(".");
        const key = `${baseId}.${optionsBundleId}`;
        return bundleIds[key];
    }
    // Adjust the buyLink using the small business bundle mapping.
    applySmallBusinessBundle(originalBuyLink, mapping) {
        // Create a URL from the original buyLink.
        const url = new URL(originalBuyLink, globalThis?.location?.origin);
        // Split the pathname and filter out empty parts.
        const pathParts = url.pathname.split("/").filter(Boolean);
        // Expecting a pathname structure like: [site, store, method, _, devices, subscription, pid?]
        if (pathParts.length < 6) {
            // If the structure is unexpected, return the original link.
            return originalBuyLink;
        }
        // Destructure expected parts.
        const [site, store, method, , devices, subscription, pid] = pathParts;
        // Build the new path with the bundle mapping's id.
        const newPath = `/${[site, store, method, mapping.id, devices, subscription, pid || mapping.coupon].join("/")}`;
        url.pathname = newPath;
        return url.href;
    }
}
//# sourceMappingURL=product.init-selector.js.map