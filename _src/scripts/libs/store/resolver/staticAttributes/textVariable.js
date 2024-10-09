/**
 * @param {string} hideCondition
 * @param {import("../resolver").Context} context
 * @returns {boolean} if the hiding condition is true, the text will be hidden otherwise it will still be displayed
 */
const checkHidingCondition = (hideCondition, {option}) => {

    if (!hideCondition) {
        return false;
    }

    switch (hideCondition) {
        case ('no-price'):
            return !Boolean(option.getPrice());
        case ('no-price-discounted'):
            return !Boolean(option.getDiscountedPrice());
        default:
            return true;
    }
};

/**
 *
 * @param {string} text
 * @param {import("../resolver").Context} context
 * @param {string[]} variableParameters
 * @param {string} textVariable
 * @returns {string} returns the initial text with the replaced variable or the actual initial text when the variable cannot be replaced
 */
const replaceVariable = (text, context, variableParameters, textVariable) => {

    let stopVariableSearch = false;

    for (const variableParameter of variableParameters) {
        switch (variableParameter) {
            case "DEVICES":
                text = text.replaceAll(textVariable, context.option.getDevices());
                stopVariableSearch = true;
                break;
            case "YEARS":
                text = text.replaceAll(textVariable, context.option.getSubscription("years"));
                stopVariableSearch = true;
                break;
            case "PRICE_FULL":
                if (!context.option.getPrice("valueWithCurrency")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "PRICE_DISCOUNTED":
                if (!context.option.getDiscountedPrice("valueWithCurrency")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getDiscountedPrice("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "PRICE_FULL_MONTHLY":
                if (!context.option.getPrice("monthlyWithCurrency")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            case "PRICE_DISCOUNTED_MONTHLY":
                if (!context.option.getDiscountedPrice("monthlyWithCurrency")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getDiscountedPrice("monthlyWithCurrency"));
                stopVariableSearch = true;
                break;
            case "DISCOUNT_PERCENTAGE":
                if (!context.option.getDiscount("percentageWithProcent")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getDiscount("percentageWithProcent"));
                stopVariableSearch = true;
                break;
            case "DISCOUNT_VALUE":
                if (!context.option.getDiscount("valueWithCurrency")) {
                    break;
                }

                text = text.replaceAll(textVariable, context.option.getDiscount("valueWithCurrency"));
                stopVariableSearch = true;
                break;
            case "SMALLEST_PRICE_PER_MONTH":
                let smallestPrice = Number.MAX_SAFE_INTEGER;
                let currency = "";

                if (context.contexts.length === 0) { break; }

                for (const { product } of context.contexts) {
                    const productSmallestPrice = product.getSmallestPrice("monthly");
                    if (productSmallestPrice && productSmallestPrice < smallestPrice) {
                        smallestPrice = productSmallestPrice;
                        currency = product.getCurrency();
                    }
                }

                if (smallestPrice === Number.MAX_SAFE_INTEGER) { break; }

                text = text.replaceAll(textVariable, Store.placeSymbol(smallestPrice, currency));
                stopVariableSearch = true;
                break;
            case "SERVER_NUMBER":
            case "MAIL_BOX_NUMBER":
                const discount = variableParameters.find(variableParameter => variableParameter.includes("DISCOUNT="))?.split("=")[1];
                if (!discount && !Number(discount)) {
                    break;
                }

                text = text.replaceAll(textVariable, Math.ceil(context.option.getDevices() * Number(discount) / 100));
                stopVariableSearch = true;
                break;
            case "MINIMUM_DEVICES_NUMBER":
                text = text.replaceAll(textVariable, context.product.getMinMaxDeviceNumbers()[0]);
                stopVariableSearch = true;
                break;
            case "MAXIMUM_DEVICES_NUMBER":
                text = text.replaceAll(textVariable, context.product.getMinMaxDeviceNumbers()[1]);
                stopVariableSearch = true;
                break;
            default:
                break;
        }

        if (context.devicePropertiesVariables.includes(variableParameter)) {
            const deviceMapping = context.option.deviceMapping;
            if (deviceMapping) {
                text = text.replaceAll(textVariable, context.option.deviceMapping[variableParameter]);
            }
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
 * @param {import("../resolver").Context} context
 * @returns {string} return the initial text with all variables inside of it resolved. If some cannot be resoled, they will retain their variable form
 */
const replaceTextVariables = (text, context) => {
    //get all the textVariables defined using brackets
    const allTextVariables = [...new Set(text.match(/{.*?}/ig))];
    for (const textVariable of allTextVariables) {
        const variableParameters = textVariable.split(/{|}|\|\||;/).filter(Boolean);

        // get the hidingCondition and test it. If it is true remove the variable from the text
        const hideCondition = variableParameters.find(variableParameter => variableParameter.includes("hide="))?.split("=")[1];
        if (checkHidingCondition(hideCondition, context)) {
            text = text.replaceAll(textVariable, "");
            continue;
        }

        // replace the variable inside the text
        text = replaceVariable(text, context, variableParameters, textVariable);
    }

    return text;
};

/**
 *
 * @param {object} parent
 * @param {import("../resolver").Context} context
 * parse the data-cmp-data-layer object and for each string resolve every variable. This is for the data layer component
 */
const recursiveDataLayerParse = (parent, context) => {
    for (const key of Object.keys(parent)) {
        if (typeof parent[key] === 'string') {
            parent[key] = replaceTextVariables(parent[key], context);
        }

        if (typeof parent[key] === 'object') {
            recursiveDataLayerParse(parent[key], context);
        }
    }
};

/**
 * @param {HTMLElement} element
 * @param {import("../resolver").Context} context
 */
export const resolve = (element, context) => {
    if (element.dataset.storeTextVariable === undefined || !context.option) { return; }

    const children = [...element.childNodes];
    for (const child of children) {

        //resolve all text variables in the data layer attribute
        if (child.dataset && child.dataset.cmpDataLayer && !child.dataset.parsedDataLayer) {
            const dataLayerObject = JSON.parse(child.dataset.cmpDataLayer);
            recursiveDataLayerParse(dataLayerObject, context);
            child.setAttribute("data-cmp-data-layer", JSON.stringify(dataLayerObject));
            child.setAttribute("data-parsed-data-layer", true);
        }

        // resolve all text variables in text nodes
        if (child.nodeType === Node.TEXT_NODE) {
            if (!child.initialContent) {
                child.initialContent = child.textContent;
            }
            child.textContent = replaceTextVariables(child.initialContent, context);
        }

        children.push(...child.childNodes);
    }
}