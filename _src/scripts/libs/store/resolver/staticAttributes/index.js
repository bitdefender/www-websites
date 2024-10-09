import { resolve as buyLink } from "./buyLink";
import { resolve as devices } from "./devices";
import { resolve as discount} from "./discount";
import { resolve as hide } from "./hide";
import { resolve as price} from "./price";
import { resolve as subscription} from "./subscription";
import { resolve as textVariable} from "./textVariable";
import { resolve as addClass} from "./addClass";

export const staticAttributesResolvers = [
    hide,
    buyLink,
    devices,
    discount,
    price,
    subscription,
    textVariable,
    addClass
];

export const staticAttributes = {
    storePrice: "[data-store-price]",
    storeDiscount: "[data-store-discount]",
    storeHide: "[data-store-hide]",
    storeBuyLink: "[data-store-buy-link]",
    storeDevices: "[data-store-devices]",
    storeSubscription: "[data-store-subscription]",
    storeTextVariable: "[data-store-text-variable]",
    storeAddClass: "[data-store-add-class]"
};

