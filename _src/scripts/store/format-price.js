export const formatPrice = ({ price, currency, locale = "en-us" }) => {
    if (!price) {
        return "";
    }
    if (!currency) {
        return price;
    }
    return new Intl
        .NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
        .format(price);
};
//# sourceMappingURL=format-price.js.map