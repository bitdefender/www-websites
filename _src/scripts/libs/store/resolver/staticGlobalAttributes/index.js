import { resolve } from "./globalTextVariable.js";
// src/scripts/libs/store/resolver/staticGlobalAttributes/index.js
/**
* Global Attributes are computed based on the products from the page
* They work on the whole "body" element and are parsed once
*/
var staticGlobalAttributesResolvers = [resolve];
export { staticGlobalAttributesResolvers };
