import { GlobalContext } from "../resolver.js";
import { Constants } from "../../../constants.js";

/**
 * @param {string} hideCondition
 * @returns {boolean} if the hiding condition is true, the text will be hidden otherwise it will still be displayed
 */
const checkHidingCondition = (hideCondition) => {

    if (!hideCondition) {
        return false;
    }

    switch (hideCondition) {
        case ('no-price'):
            return !GlobalContext.variations.some(option => option.getPrice("value"));
        case ('no-price-discounted'):
            return !GlobalContext.variations.some(option => option.getDiscountedPrice("value"));
        default:
            return true;
    }
};

/**
 *  @param {"min"|"max"} value
 *  @param {import("../../index.js").ProductOption[]} options
 *  @param {function} fn
 *  @returns {import("../../index.js").ProductOption}
 */
const getMinOrMax = (value, options, fn, isPercentage) => {
    let minOrMax = value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    let productValue = null;

    for (const option of options) {
        let localValue = fn(option);
        localValue = Constants.PRODUCT_ID_MAPPINGS[option.getId()].isMonthlyProduct && !isPercentage ? localValue * 12 : localValue;
        if (localValue && (value === "min" && localValue < minOrMax) || (value === "max" && localValue > minOrMax)) {
            minOrMax = localValue;
            productValue = option;
        }
    }

    return productValue;
}

/**
 *
 * @param {string} text
 * @param {string[]} variableParameters
 * @param {string} textVariable
 * @returns {string} returns the initial text with the replaced variable or the actual initial text when the variable cannot be replaced
 */
const replaceVariable = (text, variableParameters, textVariable) => {

    /**
     * @type {import("../../index.js").ProductOption[]}
     */
    const options = GlobalContext.variations;
    let stopVariableSearch = false;
    let option = null;

    if (options.length === 0) {
        return;
    }

    for (const variableParameter of variableParameters) {
        switch (variableParameter) {
            case "GLOBAL_SMALLEST_PRICE_FULL":
                option = getMinOrMax("min", options, option => option.getPrice("value"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_PRICE_FULL":
                option = getMinOrMax("max", options, option => option.getPrice("value"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_SMALLEST_PRICE_DISCOUNTED":
                option = getMinOrMax("min", options, option => option.getDiscountedPrice("value"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscountedPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_PRICE_DISCOUNTED":
                option = getMinOrMax("max", options, option => option.getDiscountedPrice("value"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscountedPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_SMALLEST_DISCOUNT_PERCENTAGE":
                option = getMinOrMax("min", options, option => option.getDiscount("percentage"), true)
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscount("percentageWithProcent"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE":
                option = getMinOrMax("max", options, option => option.getDiscount("percentage"), true);
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscount("percentageWithProcent"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_SMALLEST_DISCOUNT_VALUE":
                option = getMinOrMax("min", options, option => option.getDiscount("value"), true)
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscount("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_DISCOUNT_VALUE":
                option = getMinOrMax("max", options, option => option.getDiscount("value"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscount("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_SMALLEST_PRICE_PER_MONTH":
                option = getMinOrMax("min", options, option => option.getPrice("monthly"))
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_PRICE_PER_MONTH":
                option = getMinOrMax("max", options, option => option.getPrice("monthly"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_SMALLEST_PRICE_DISCOUNTED_PER_MONTH":
                option = getMinOrMax("min", options, option => option.getDiscountedPrice("monthly"))
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscountedPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            case "GLOBAL_BIGGEST_PRICE_DISCOUNTED_PER_MONTH":
                option = getMinOrMax("max", options, option => option.getDiscountedPrice("monthly"));
                if (!option) {
                    break;
                }

                text = text.replaceAll(textVariable, option.getDiscountedPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            default:
                break;
        }

        if (stopVariableSearch) {
            break;
        }
    }

    return text;
};

/**
 *
 * @param {string} text
 * @returns {string} return the initial text with all variables inside of it resolved. If some cannot be resoled, they will retain their variable form
 */
const replaceTextVariables = (text) => {
    //get all the textVariables defined using brackets
    const allTextVariables = [...new Set(text.match(/{.*?}/ig))];
    for (const textVariable of allTextVariables) {
        const variableParameters = textVariable.split(/{|}|\|\||;/);

        // get the hidingCondition and test it. If it is true remove the variable from the text
        const hideCondition = variableParameters.find(variableParameter => variableParameter.includes("hide="))?.split("=")[1];
        if (checkHidingCondition(hideCondition)) {
            text = text.replaceAll(textVariable, "");
            continue;
        }

        // replace the variable inside the text
        text = replaceVariable(text, variableParameters, textVariable);
    }

    return text;
};

/**
 *
 * @param {object} parent
 * parse the data-cmp-data-layer object and for each string resolve every variable. This is for the data layer component
 */
const recursiveDataLayerParse = (parent) => {
    for (const key of Object.keys(parent)) {
        if (typeof parent[key] === 'string') {
            parent[key] = replaceTextVariables(parent[key]);
        }

        if (typeof parent[key] === 'object') {
            recursiveDataLayerParse(parent[key]);
        }
    }
};

/**
 * @param {HTMLElement} element
 */
export const resolve = (element) => {

    const children = [...element.childNodes];
    for (const child of children) {

        //resolve all text variables in the data layer attribute
        if (child.dataset && child.dataset.cmpDataLayer && !child.dataset.parsedDataLayer) {
            const dataLayerObject = JSON.parse(child.dataset.cmpDataLayer);
            recursiveDataLayerParse(dataLayerObject);
            child.setAttribute("data-cmp-data-layer", JSON.stringify(dataLayerObject));
            child.setAttribute("data-parsed-data-layer", true);
        }

        // resolve all text variables in text nodes
        if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = replaceTextVariables(child.textContent);
        }

        children.push(...child.childNodes);
    }
}