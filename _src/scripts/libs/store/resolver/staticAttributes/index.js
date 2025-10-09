import { resolve as buyLink } from "./buyLink.js";
import { resolve as devices } from "./devices.js";
import { resolve as discount} from "./discount.js";
import { resolve as hide } from "./hide.js";
import { resolve as price} from "./price.js";
import { resolve as subscription} from "./subscription.js";
import { resolve as textVariable} from "./textVariable.js";
import { resolve as addClass} from "./addClass.js";
import { resolve as trialLink} from "./trialLink.js";


export const staticAttributesResolvers = [
    hide,
    buyLink,
    devices,
    discount,
    price,
    subscription,
    textVariable,
    addClass,
    trialLink
];

export const staticAttributes = {
    storePrice: "[data-store-price]",
    storeDiscount: "[data-store-discount]",
    storeHide: "[data-store-hide]",
    storeBuyLink: "[data-store-buy-link]",
    storeDevices: "[data-store-devices]",
    storeSubscription: "[data-store-subscription]",
    storeTextVariable: "[data-store-text-variable]",
    storeAddClass: "[data-store-add-class]",
    storeTrial: "[data-store-trial-link]"
};

