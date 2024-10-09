import { resolve as classToggle } from "./classToggle";
import { resolve as decrement } from "./decrement";
import { resolve as increment } from "./increment";
import { resolve as setDevices } from "./setDevices";
import { resolve as setOption } from "./setOption";
import { resolve as setYears} from "./setYears";
import { resolve as setProduct} from "./setProduct";
import { resolve as toggleBundle} from "./toggleBundle";

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