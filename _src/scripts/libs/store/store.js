import { Constants } from "../constants.js";
import { Target, Visitor } from "../data-layer.js";
import { GLOBAL_V2_LOCALES, setUrlParams } from "../../utils/utils.js";
import Page from "../page.js";
import { getMetadata } from "../../utils/utils.js";
import { User } from "../../libs/user.js"

export const monthlyProducts = {
	"ultsecm": "ultsecm",
	"ultsecplusm": "ultsecplusm",
	"psm": "psm",
	"pspm": "pspm",
	"vpn-monthly": "vpn-monthly",
	"passm": "passm",
	"idtheftsm": "idtheftsm",
	"idtheftpm": "idtheftpm",
	"dipm": "dipm",
	"smarthome_m": "smarthome_m",
	"vipsupport_m": "vipsupport_m",
	"pctuneup_m": "pctuneup_m",
	"pass_spm": "pass_spm",
	"us_i_m": "us_i_m",
	"us_f_m": "us_f_m",
	"us_pf_m": "us_pf_m",
	"us_pi_m": "us_pi_m",
	"us_pie_m": "us_pie_m",
	"us_pfe_m": "us_pfe_m",
	"secpassm": "secpassm",
	"vbsm": "vbsm",
	"scm": "scm",
}

export const loadScript = (baseUrl, url) => {
	return new Promise(function (resolve) {
		const script = document.createElement("script");

		script.src = `${baseUrl}${url}`;
		document.head.appendChild(script);
		script.onload = () => {
			resolve();
		};
	});
};

export class ProductInfo {
	/**
	 *
	 * @param {string} id
	 * @param {string} department
	 * @param {string} promotion
	 */
	constructor(id, department, promotion = null) {
		this.id = id;
		this.department = department;
		this.promotion = promotion;
	}
}

export class ProductOption {
	/**
	 *
	 * @param {{
	 * 	price: number,
	 *	priceDiscounted: number,
	 *	buyLink: string | Function,
	 *	isDiscounted: boolean,
	 *	currency: string,
	 *	symbol: string,
	 *	name: string,
	 *	id: string,
	 *	product_id: string,
	 *	product_alias: string,
	 *	department: string,
	 *	devices: number,
	 *	subscription: number,
	 *	avangateId: string,
	 * }} option
	 */
	constructor(option) {
		this.price = option.price;
		this.priceDiscounted = option.priceDiscounted;
		this.buyLink = option.buyLink;
		this.isDiscounted = option.isDiscounted;
		this.currency = option.currency;
		this.symbol = option.symbol;
		this.devices = option.devices;
		this.subscription = option.subscription;
		this.id = option.id;
		this.productId = option.productId;
		this.productAlias = option.productAlias;
		this.department = option.department;
		this.name = option.name;
		this.avangateId = option.avangateId;
	}

	/**
	 *
	 * @returns {string} - Product Id : VPN-Y, TSMD2021
	 */
	getId() {
		return this.id;
	}

	/**
	 * Returns product API ID
	 * @returns {string} - Product Id : 8003
	 */
	getProductId() {
		return this.productId;
	}

	/**
	 * Returns product API ALIAS
	 * @returns {string} - Product Id : tsmd/com.bitdefender.cl.tsmd
	 */
	getProductAlias() {
		return this.productAlias;
	}

	/**
	 *
	 * @returns {string} - Product Avangate Id
	 */
	getAvangateId() {
		return this.avangateId;
	}

	/**
	 *
	 * @returns {string} - Product Name
	 */
	getName() {
		return this.name;
	}

	/**
	 *
	 * @returns {string} - USD | EUR ...
	 */
	getCurrency() {
		return this.currency;
	}

	/**
	 *
	 * @returns {string} - $ | € ...
	 */
	getSymbol() {
		return this.symbol;
	}

	/**
	 *
	 * @returns {string} - consumer | business
	 */
	getDepartment() {
		return this.department;
	}

	/**
	 * @return {string} - product variation (ex. 10u-1y)
	 */
	getVariation() {
		return `${this.devices}u-${this.getSubscription()}y`;
	}

	/**
	 *
	 * @param {"value"|"valueWithCurrency"|"monthly"|"monthlyWithCurrency"} [modifier=valueWithCurrency]
	 * @return {number|string}
	 */
	getPrice(modifier = "valueWithCurrency") {
		switch (modifier) {
			case "value":
				return this.price;
			case "valueWithCurrency":
				return Store.placeSymbol(this.price, this.currency);
			case "monthly":
				return this.subscription === 1 ? this.price : Number(Number(this.price / this.subscription).toFixed(2));
			case "monthlyWithCurrency":
				return this.subscription === 1
					? Store.placeSymbol(this.price, this.currency)
					: Store.placeSymbol(Number(Number(this.price / this.subscription).toFixed(2)), this.currency);
			default:
				break;
		}
	}

	/**
	 *
	 * @param {"value"|"valueWithCurrency"|"monthly"|"monthlyWithCurrency"} [modifier=valueWithCurrency]
	 * @return {number|string}
	 */
	getDiscountedPrice(modifier = "valueWithCurrency") {
		switch (modifier) {
			case "value":
				return this.priceDiscounted;
			case "valueWithCurrency":
				return Store.placeSymbol(this.priceDiscounted, this.currency);
			case "monthly":
				return this.subscription === 1 ? this.priceDiscounted : Number(Number(this.priceDiscounted / this.subscription).toFixed(2));
			case "monthlyWithCurrency":
				return this.subscription === 1
					? Store.placeSymbol(this.priceDiscounted, this.currency)
					: Store.placeSymbol(Number(Number(this.priceDiscounted / this.subscription).toFixed(2)), this.currency);
			default:
				break;
		}
	}

	/**
	 *
	 * @param {"value"|"valueWithCurrency"|"percentage"|"percentageWithProcent"} [modifier=value] - Modifier string for value
	 * @return {number|string}
	 */
	getDiscount(modifier = 'value') {
		const value = Math.round((this.price - this.priceDiscounted + Number.EPSILON) * 100) / 100 || 0;
		const percentage = Math.round(((this.price - this.priceDiscounted) / this.price * 100)) || 0;
		switch (modifier) {
			case 'value':
				return value;
			case 'valueWithCurrency':
				return Store.placeSymbol(value, this.currency);
			case "percentage":
				return percentage;
			case "percentageWithProcent":
				return `${percentage}%`
			default:
				return "";
		}
	}

	/**
	 *
	 * @param {string[]} params
	 * @return {Promise<string>}
	 */
	async getStoreUrl(params) {
		if (!params) { return this.buyLink; }

		if (!Array.isArray(params)) {
			console.error(`params must be an Array but you provided an ${typeof params}`);
			return this.buyLink;
		}

		return await Visitor.appendVisitorIDsTo(
			setUrlParams(this.buyLink, params)
		);
	}

	getDevices() {
		return this.devices;
	}

	/**
	 *
	 * @param {"years"|"months"} [modifier=years]
	 * @return {number}
	 */
	getSubscription(modifier = "years") {
		switch (modifier) {
			case "years":
				return monthlyProducts[this.id] ? this.subscription : this.subscription / 12;
			case "months":
				return this.subscription;
		}
	}
}

export class Product {
	constructor(product) {
		this.id = product.id;
		this.productId = product.product_id;
		this.productAlias = product.product_alias;
		this.name = product.product_name;
		this.options = product.variations;
		this.department = product.department;
		this.promotion = product.promotion || (GLOBAL_V2_LOCALES.find(domain => Page.locale === domain) ? 'global_v2' : '');
		const option = Object.values(Object.values(product.variations)[0])[0];
		this.currency = option.currency_iso;
		this.avangateId = Object.values(Object.values(product.variations)[0])[0]?.platform_product_id;
		this.yearDevicesMapping = Object.entries(this.options).reduce((acc, [deviceKey, values]) => {
			Object.keys(values).forEach(yearKey => {
				if (!acc[yearKey]) {
					acc[yearKey] = [Number(deviceKey)];
					return;
				}

				acc[yearKey].push(Number(deviceKey));
			});

			return acc;
		}, {});

		// TODO: remove this if after finishing Vlaicu migration. It is used because in init selector the variation
		// is wrongly placed as 1-1 instead of 4-1 as it should be for 'pass_sp' and 'pass_spm'
		// for 'vpn' in init selector it was 10-1 which also needs to be changed
		if (Store.config.provider === 'vlaicu'
			&& Object.keys(Constants.WRONG_DEVICES_PRODUCT_IDS).includes(product.product_alias)) {
			const contentDevices = Constants.WRONG_DEVICES_PRODUCT_IDS[product.product_alias].contentDevices;
			const providerDevices = Constants.WRONG_DEVICES_PRODUCT_IDS[product.product_alias].providerDevices

			this.options[contentDevices] = this.options[providerDevices];
			if (!this.yearDevicesMapping[contentDevices]) {
				this.yearDevicesMapping[contentDevices] = [providerDevices]
			} else {
				this.yearDevicesMapping[contentDevices].push(providerDevices);
			}	
		}
	}

	/**
	 * Returns the id as provided Store.getProducts
	 * @returns {string} - Product Id : tsmd
	 */
	getId() {
		return this.id;
	}

	/**
	 * Returns product API ID
	 * @returns {string} - Product Id : 8003
	 */
	getProductId() {
		return this.productId;
	}

	/**
	 * Returns product API ALIAS
	 * @returns {string} - Product Id : tsmd/com.bitdefender.cl.tsmd
	 */
	getProductAlias() {
		return this.productAlias;
	}

	/**
	 *
	 * @returns {string} - Product Avangate Id
	 */
	getAvangateId() {
		return this.avangateId;
	}

	/**
	 *
	 * @returns {string} - Product Name
	 */
	getName() {
		return this.name;
	}

	/**
	 *
	 * @returns {string} - USD | EUR ...
	 */
	getCurrency() {
		return this.currency;
	}

	/**
	 *
	 * @returns {string} - consumer | business
	 */
	getDepartment() {
		return this.department;
	}

	/**
	 * @return {Boolean} - return true if there is at least one price set
	 */
	hasSomePrice() {
		for (const devices of Object.values(this.options)) {
			for (const years of Object.values(devices)) {
				if (Number(years.price)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * @return {Boolean} - return true if there is at least on discounted price set
	 */
	hasSomeDiscountedPrice() {
		for (const devices of Object.values(this.options)) {
			for (const years of Object.values(devices)) {
				if (Number(years.discount?.discounted_price)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 *
	 * @param {number} devices - Number of devices
	 * @param {number} years - Subscription period in years
	 * @param {ProductOption} bundle - Product to be bundled with the current option
	 * @returns {ProductOption} - option containing price, discounted price and store url
	 */
	getOption(devices, years, bundle) {
		const productVariation = `${devices}-${years}`;
		const devicesOption = this.options[devices];
		const yearsOption = devicesOption && devicesOption[years];

		if (!yearsOption) { return null; }

		const option = new ProductOption({
			price: Number(Number(yearsOption.price).toFixed(2)),
			priceDiscounted: Number(Number(yearsOption.discount?.discounted_price).toFixed(2)),
			isDiscounted: yearsOption.discount?.discounted_price ? true : false,
			currency: this.currency,
			symbol: this.symbol,
			name: this.name,
			id: this.id,
			productId: this.productId,
			productAlias: this.productAlias,
			department: this.department,
			devices,
			subscription: monthlyProducts[this.id] ? 1 : years * 12,
			avangateId: this.avangateId
		});

		if (bundle) {
			if (option.priceDiscounted && bundle.priceDiscounted) {
				option.price = Number(Number(option.price + bundle.price).toFixed(2));
				option.priceDiscounted = Number(Number(option.priceDiscounted + bundle.priceDiscounted).toFixed(2));
			}

			if (option.priceDiscounted && !bundle.priceDiscounted) {
				option.price = Number(Number(option.price + bundle.price).toFixed(2));
				option.priceDiscounted = Number(Number(option.priceDiscounted + bundle.price).toFixed(2));
			}

			if (!option.priceDiscounted && bundle.priceDiscounted) {
				option.price = Number(Number(option.price + bundle.priceDiscounted).toFixed(2));
			}

			if (!option.priceDiscounted && !bundle.priceDiscounted) {
				option.price = Number(Number(option.price + bundle.price).toFixed(2));
			}
		}

		let buyLink = new URL(yearsOption.buyLink);
		buyLink.searchParams.set("SHOPURL", `${window.location.origin}/${window.location.pathname.split('/')[1]}/`);
		buyLink.searchParams.set("REF", this.promotion && this.promotion !== Store.NO_PROMOTION ? `WEBSITES_${this.promotion}` : "N/A");
		buyLink.searchParams.set("SRC", `${window.location.origin}${window.location.pathname}`);

		// replace the buy links with target links if they exist and return the option
		if (Store.targetBuyLinkMappings[this.productAlias]
			&& Store.targetBuyLinkMappings[this.productAlias][productVariation]) {
			buyLink = new URL(Store.targetBuyLinkMappings[this.productAlias][productVariation]);
		}

		if (window.UC_UI) {
			buyLink.searchParams.set("ucControllerId", window.UC_UI.getControllerId());
		}
		option.buyLink = buyLink.href;

		return option;
	}

	/**
	 * @returns {ProductOption[]} - option containing price, discounted price and store url
	 * this is used primarily for renewal (when there are many combinations of devices / years)
	 */
	getAllOptions() {
		const allOptions = [];
		Object.entries(this.options).forEach(([deviceNumber, yearsMapping]) => {
			Object.keys(yearsMapping).forEach(yearNumber => {
				allOptions.push(this.getOption(deviceNumber, yearNumber));
			});
		});

		return allOptions;
	}

	/**
	 * @param {"min"|"max"} value
	 * @param {"value"|"valueWithCurrency"|"monthly"|"monthlyWithCurrency"} [modifier=valueWithCurrency]
	 * @return {number|string}
	 */
	getPrice(value, modifier = "valueWithCurrency") {
		let price = value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
		let subscription = 1;

		for (const devices of Object.values(this.options)) {
			for (const [years, entries] of Object.entries(devices)) {
				const priceFull = Number(Number(entries.price).toFixed(2));
				if ((value === "min" && priceFull < price) || (value === "max" && priceFull > price)) {
					price = priceFull;
					subscription = monthlyProducts[this.id] ? 1 : Number(years) * 12;
				}
			}
		}

		if (price === (value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER)) {
			return NaN;
		}

		switch (modifier) {
			case "value":
				return price;
			case "valueWithCurrency":
				return Store.placeSymbol(price, this.currency);
			case "monthly":
				return subscription === 1 ? price : Number(Number(price / subscription).toFixed(2));
			case "monthlyWithCurrency":
				return subscription === 1
					? Store.placeSymbol(price, this.currency)
					: Store.placeSymbol(Number(Number(price / subscription).toFixed(2)), this.currency);
			default:
				break;
		}
	}

	/**
	 * @param {"min"|"max"} value
	 * @param {"value"|"valueWithCurrency"|"monthly"|"monthlyWithCurrency"} [modifier=valueWithCurrency]
	 * @return {number|string}
	 */
	getDiscountedPrice(value, modifier = "valueWithCurrency") {
		let price = value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
		let subscription = 1;

		for (const devices of Object.values(this.options)) {
			for (const [years, entry] of Object.entries(devices)) {
				const priceDiscounted = Number(Number(entry.discount?.discounted_price).toFixed(2));
				if ((value === "min" && priceDiscounted < price) || (value === "max" && priceDiscounted > price)) {
					price = priceDiscounted;
					subscription = monthlyProducts[this.id] ? 1 : Number(years) * 12;
				}
			}
		}

		if (price === (value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER)) {
			return NaN;
		}

		switch (modifier) {
			case "value":
				return price;
			case "valueWithCurrency":
				return Store.placeSymbol(price, this.currency);
			case "monthly":
				return subscription === 1 ? price : Number(Number(price / subscription).toFixed(2));
			case "monthlyWithCurrency":
				return subscription === 1
					? Store.placeSymbol(price, this.currency)
					: Store.placeSymbol(Number(Number(price / subscription).toFixed(2)), this.currency);
			default:
				break;
		}
	}

	/**
	 * @param {"min"|"max"} value
	 * @param {"value"|"valueWithCurrency"|"percentage"|"percentageWithProcent"} [modifier=value] - Modifier string for value
	 * @return {number|string}
	 */
	getDiscount(value, modifier = 'value') {
		let discountValue = value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
		let discountPercentage = NaN;

		for (const devices of Object.values(this.options)) {
			for (const entry of Object.values(devices)) {
				const priceDiscounted = Number(Number(entry.discount?.discounted_price).toFixed(2));
				const priceFull = Number(Number(entry.price).toFixed(2));
				const valueDiscount = Math.round((priceFull - priceDiscounted + Number.EPSILON) * 100) / 100 || 0;
				const percentageDiscount = Math.round(((priceFull - priceDiscounted) / priceFull * 100)) || 0;

				if ((value === "min" && valueDiscount < discountValue) || (value === "max" && valueDiscount > discountValue)) {
					discountValue = valueDiscount;
					discountPercentage = percentageDiscount;
				}
			}
		}

		if (discountValue === (value === "max" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER)) {
			return NaN;
		}

		switch (modifier) {
			case 'value':
				return discountValue;
			case 'valueWithCurrency':
				return Store.placeSymbol(discountValue, this.currency);
			case "percentage":
				return discountPercentage;
			case "percentageWithProcent":
				return `${discountPercentage}%`
			default:
				return "";
		}
	}

	/**
	 *
	 * @param {"value"|"valueWithCurrency"|"monthly"|"monthlyWithCurrency"} [modifier=valueWithCurrency]
	 * @return {number|string}
	 */
	getSmallestPrice(modifier = "valueWithCurrency") {
		let price = Number.MAX_SAFE_INTEGER;
		let subscription = 1;

		for (const devices of Object.values(this.options)) {
			for (const [years, value] of Object.entries(devices)) {
				const priceDiscounted = Number(Number(value.discount?.discounted_price || value.price).toFixed(2));
				if (priceDiscounted < price) {
					price = priceDiscounted;
					subscription = monthlyProducts[this.id] ? 1 : Number(years) * 12;
				}
			}
		}

		if (price === Number.MAX_SAFE_INTEGER) {
			return NaN;
		}

		switch (modifier) {
			case "value":
				return price;
			case "valueWithCurrency":
				return Store.placeSymbol(price, this.currency);
			case "monthly":
				return subscription === 1 ? price : Number(Number(price / subscription).toFixed(2));
			case "monthlyWithCurrency":
				return subscription === 1
					? Store.placeSymbol(price, this.currency)
					: Store.placeSymbol(Number(Number(price / subscription).toFixed(2)), this.currency);
			default:
				break;
		}
	}

	/**
	 * @return {[number, number]}
	 */
	getMinMaxDeviceNumbers() {
		let minDeviceNumber = Number.MAX_SAFE_INTEGER;
		let maxDeviceNumber = 0;

		for (const devices of Object.keys(this.options)) {
			const noDevices = Number(devices);
			if (noDevices < minDeviceNumber) {
				minDeviceNumber = noDevices;
			}

			if (noDevices > maxDeviceNumber) {
				maxDeviceNumber = noDevices;
			}
		}

		return [minDeviceNumber, maxDeviceNumber];
	};

	/**
	* @return {[number, number]}
	*/
	getMinMaxYearNumbers() {
		let minYearNumber = Number.MAX_SAFE_INTEGER;
		let maxYearNumber = 0;

		const firstDeviceVariation = Object.values(this.options)[0];

		for (const year of Object.keys(firstDeviceVariation)) {
			const noYears = Number(year);
			if (noYears < minYearNumber) {
				minYearNumber = noYears;
			}

			if (noYears > maxYearNumber) {
				maxYearNumber = noYears;
			}
		}

		return [minYearNumber, maxYearNumber];
	};

	/**
	 * @return {[number]}
	 */
	getDevices(noYears) {
		return this.yearDevicesMapping[noYears];
	}

	/**
	 * @param {"years"|"months"} [modifier=years]
	 * @return {[number]}
	 */
	getSubscriptions(modifier = "years", noDevices) {
		const subscriptions = Object.keys(this.options[noDevices]);
		switch (modifier) {
			case "years":
				return subscriptions.map(subscription => Number(subscription));
			case "months":
				return monthlyProducts[this.id]
					? subscriptions.map(subscription => Number(subscription))
					: subscriptions.map(subscription => Number(subscription) * 12);
		}
	}
}

class Vlaicu {

	static defaultPromotionPath = "/p-api/v1/products/{bundleId}/locale/{locale}";
	static promotionPath = "/p-api/v1/products/{bundleId}/locale/{locale}/campaign/{campaignId}";

	/**
	 * TODO: please remove this function and all its calls once digital river works correctly
	 * @param {string} productId 
	 * @returns {boolean} -> check if the product is soho and the domain is de-de
	 */
	static #isSohoCornerCase = (productId) =>
	 	Constants.SOHO_CORNER_CASES_LOCALSE.includes(Page.locale) && productId === "com.bitdefender.soho"

	static $getGeoIpFlag = async () => {
		const offer = await Target.getOffer('vlaicu-flag-mbox');

		if (offer && offer.content && typeof offer.content.geoIpPrice !== 'undefined') {
            return offer.content.geoIpPrice;
		}

		return null;
	}

	static async getProductVariations(productId, campaign) {
		let locale = this.#isSohoCornerCase(productId) ? "en-mt" : Page.locale;
		let geoIpFlag = await this.$getGeoIpFlag();
		if (geoIpFlag) {
			locale = await User.locale;
		}
		const pathVariablesResolverObject = {
			// TODO: please remove the ternary operators below and only use Page.locale
			// and campaign once digital river works correctly
			"{locale}": locale,
			"{bundleId}": productId,
			"{campaignId}": this.#isSohoCornerCase(productId) ? "SOHO_DE" : campaign
		};

		// get the correct path to get the prices
		let productPath = campaign !== Constants.NO_PROMOTION ? this.promotionPath : this.defaultPromotionPath;

		// replace all variables from the path
		const pathVariablesRegex = new RegExp(Object.keys(pathVariablesResolverObject).join("|"),"gi");
		productPath = productPath.replace(pathVariablesRegex, (matched) => {
			return pathVariablesResolverObject[matched]
		});

		const endpoint = new URL(productPath, Store.config.vlaicuEndpoint);

		try {
			const response = await fetch(
				endpoint.href,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			if (!response.ok) {
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	static async getProductVariationsPrice(id, campaignId) {
		const productInfoResponse = await this.getProductVariations(Constants.PRODUCT_ID_MAPPINGS[id.trim()], campaignId);
		const productInfo = productInfoResponse?.product;
		if (!productInfo) {
			return null;
		}
		const isReceivedPromotionValid = productInfoResponse.campaign &&
			productInfoResponse.campaignType &&
			productInfoResponse.campaignType === "def";

		let payload = productInfo?.options;
		if (!payload || !payload.length) {
			return null;
		}

		window.StoreProducts.product[id] = {
			product_alias: id,
			product_id: Constants.PRODUCT_ID_MAPPINGS[id],
			product_name: productInfo.productName,
			promotion: isReceivedPromotionValid ? productInfoResponse.campaign : campaignId, 
			variations: {}
		}

		payload.forEach(productVariation => {

			/**
			 * for monthly products only add the monthly variations
			 * e.g for vpn-monthly we do not care about the product variation if it passes 12 months (more than a year)
			 */ 
			if (Constants.MONTHLY_PRODUCTS.includes(id) && productVariation.months >= 12) {
				return;
			}

			/**
			 * for yearly products only add the yearly variations
			 * e.g for tsmd we do not care about the product variation if it is below 12 months (less than a year)
			 */

			if (!Constants.MONTHLY_PRODUCTS.includes(id) && productVariation.months < 12) {
				return;
			}

			const yearsSubscription = Math.ceil(productVariation.months / 12);
			const devices_no = productVariation.slots;

			const devicesObj = {
				currency_iso: productVariation.currency,
				product_id: Constants.PRODUCT_ID_MAPPINGS[id],
				platform_product_id: productInfoResponse.platformProductId || Constants.PRODUCT_ID_MAPPINGS[id],
				promotion: isReceivedPromotionValid ?
					productInfoResponse.campaign :
					campaignId,
				price: productVariation.price,
				buyLink: productVariation.buyLink,
				variation: {
					variation_name: `${devices_no}u-${yearsSubscription}y`,
					years: yearsSubscription,
				}
			}

			if (productVariation.discountAmount > 0) {
				devicesObj['discount'] = {
					discounted_price: productVariation.discountedPrice,
					discount_value: productVariation.discountAmount,
				}
			}

			window.StoreProducts.product[id].variations[devices_no] = window.StoreProducts.product[id].variations[devices_no]
				? window.StoreProducts.product[id].variations[devices_no]
				: {};
			window.StoreProducts.product[id].variations[devices_no][yearsSubscription] = devicesObj;
		});

		// for the cases where there is no variation available in the price call
		if (!Object.keys(window.StoreProducts.product[id].variations).length) {
			return null;
		}

		return window.StoreProducts.product[id];
	}

	static async loadProduct(id, campaign) {
		window.StoreProducts = window.StoreProducts || [];
		window.StoreProducts.product = window.StoreProducts.product || {};
		return await this.getProductVariationsPrice(id, campaign);
	}
}

class StoreConfig {

	constructor() {
		/**
		 * Api used to fetch the prices
		 * @type {"vlaicu"}
		 */
		this.provider = "vlaicu";

		/**
		 * default promotion
		 * @type {Promise<string>}
		 */
		this.campaign = this.#getCampaign();

		/**
		 * @type {string}
		 */
		this.vlaicuEndpoint = Constants.DEV_DOMAINS.some(domain => window.location.hostname.includes(domain))
			? "https://www.bitdefender.com"
			: window.location.origin;

		/**
		 * @type {"GET"}
		 */
		this.httpMethod = "GET";
	}

	async #getCampaign() {
		if (GLOBAL_V2_LOCALES.find(domain => Page.locale === domain)) {
			return "global_v2";
		}

		if (!Constants.ZUROA_LOCALES.includes(Page.locale)) {
			return Constants.NO_PROMOTION;
		}

		try {
			const response = await fetch(`${Constants.PUBLIC_URL_ORIGIN}/nl-nl/consumer/zuoraconfig.json`);
			if (!response.ok) {
				console.error(`Failed to fetch data.`);
				return Constants.NO_PROMOTION;
			}

			const { data = [] } = await response.json();
			return data[0].CAMPAIGN_NAME ? data[0].CAMPAIGN_NAME : Constants.NO_PROMOTION;
		} catch(e) {
			console.error(`Failed to fetch data.`);
			return Constants.NO_PROMOTION;
		}
	}
}

export class Store {
	static countriesMapping = {
		gb: "uk",
		ch: "de",
		at: "de",
		us: "us",
		mx: "en",
		nz: "au",
	}

	static consumer = "consumer";
	static business = "business";
	static products = {};
	/** country equals the geographic location given by IP */
	static country = Page.country;
	static mappedCountry = this.getCountry();
	/** Private variables */
	static baseUrl = Constants.DEV_BASE_URL;

	/**
	 * @type {StoreConfig}
	 */
	static config = new StoreConfig();
	static targetBuyLinkMappings = null;

	/**
	 * Get a product from the api.2checkout.com
	 * @async
	 * @param {ProductInfo[]} productsInfo - objects describing the product to be fetched
	 * @returns {Promise<Product>}
	 */
	static async getProducts(productsInfo) {
		if (!Array.isArray(productsInfo)) { return null; }

		// get the target buyLink mappings
		if (!this.targetBuyLinkMappings) {
			this.targetBuyLinkMappings = await Target.getBuyLinksMapping();
		}

		// remove duplicates by id
		productsInfo = [...new Map(productsInfo.map((product) => [`${product.id}`, product])).values()];

		this.products = (await Promise
			.allSettled(
				productsInfo.map(async product => {
					// target > url > produs > global_campaign > default campaign
					product.promotion = await Target.getCampaign()
						|| this.#getUrlPromotion()
						|| product.promotion
						|| getMetadata("pid")
						|| await this.config.campaign;

					return await this.#apiCall(
						product
					);
				})))
			.filter(product => product.status === "fulfilled" && !!product.value)
			.map(product => new Product(product.value))
			.reduce((acc, product) => { acc[product.getId()] = product; return acc; }, {});

		return this.products;
	}

	/**
	 * @async
	 * @param {ProductInfo} productInfo
	 * @returns {Promise<Product>}
	 */
	static async #apiCall(productInfo) {
		try {
			const product = await Vlaicu.loadProduct(productInfo.id, productInfo.promotion);

			if (!product) {
				return null;
			}

			return {
				...productInfo,
				...product
			}
		} catch (error) {
			return null;
		}
	}

	/**
	 * Returns the geografic country of the client
	 * @returns {Promise<string>} - country as 2 letter ISO code
	 */
	static getCountry() {
		return this.countriesMapping[Page.country] || Page.country
	}

	/**
	 * Returns the promotion/campaign found in the URL
	 * @returns {string|null}
	 */
	static #getUrlPromotion() {
		const searchParams = (new URL(window.location)).searchParams;

		if (searchParams.has("pid")) { return searchParams.get("pid"); }
		if (searchParams.has("promotionId")) { return searchParams.get("promotionId"); }
		if (searchParams.has("campaign")) { return searchParams.get("campaign"); }
		return null;
	}

	static placeSymbol(price, currency) {
		if (!price) { return ""; }

		return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
			price,
		);
	}
}

window.Store = Store;
window.Product = Product;
window.ProductOption = ProductOption;
window.ProductInfo = ProductInfo;