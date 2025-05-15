import { resolve } from './classToggle.js';
import { resolve as resolve$1 } from './decrement.js';
import { resolve as resolve$2 } from './increment.js';
import { resolve as resolve$3 } from './setDevices.js';
import { resolve as resolve$4 } from './setOption.js';
import { resolve as resolve$5 } from './setYears.js';
import { resolve as resolve$6 } from './setProduct.js';
import { resolve as resolve$7 } from './toggleBundle.js';

const clickAttributeResolvers = [
    resolve,
    resolve$1,
    resolve$2,
    resolve$3,
    resolve$4,
    resolve$5,
    resolve$6,
    resolve$7
];

const clickAttributes = {
    storeClickIncrement: "[data-store-click-increment]",
    storeClickDecrement: "[data-store-click-decrement]",
    storeClickSetDevices: "[data-store-click-set-devices]",
    storeClickSetYears: "[data-store-click-set-years]",
    storeClickSetOption: "[data-store-click-set-option]",
    storeClickClassToggle: "[data-store-click-class-toggle]",
    storeClickSetProduct: "[data-store-click-set-product]",
    storeClickToggleBundle: "[data-store-click-toggle-bundle]"
};

export { clickAttributeResolvers, clickAttributes };
//# sourceMappingURL=index.js.map
