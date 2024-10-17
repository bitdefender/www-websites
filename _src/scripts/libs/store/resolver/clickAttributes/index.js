import { resolve as classToggle } from "./classToggle.js";
import { resolve as decrement } from "./decrement.js";
import { resolve as increment } from "./increment.js";
import { resolve as setDevices } from "./setDevices.js";
import { resolve as setOption } from "./setOption.js";
import { resolve as setYears} from "./setYears.js";
import { resolve as setProduct} from "./setProduct.js";
import { resolve as toggleBundle} from "./toggleBundle.js";

export const clickAttributeResolvers = [
    classToggle,
    decrement,
    increment,
    setDevices,
    setOption,
    setYears,
    setProduct,
    toggleBundle
];

export const clickAttributes = {
    storeClickIncrement: "[data-store-click-increment]",
    storeClickDecrement: "[data-store-click-decrement]",
    storeClickSetDevices: "[data-store-click-set-devices]",
    storeClickSetYears: "[data-store-click-set-years]",
    storeClickSetOption: "[data-store-click-set-option]",
    storeClickClassToggle: "[data-store-click-class-toggle]",
    storeClickSetProduct: "[data-store-click-set-product]",
    storeClickToggleBundle: "[data-store-click-toggle-bundle]"
}