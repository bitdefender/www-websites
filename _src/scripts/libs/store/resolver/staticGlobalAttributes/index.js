import { resolve as globalTextVariable } from "./globalTextVariable.js";

/**
 * Global Attributes are computed based on the products from the page
 * They work on the whole "body" element and are parsed once
 */

export const staticGlobalAttributesResolvers = [
    globalTextVariable
];