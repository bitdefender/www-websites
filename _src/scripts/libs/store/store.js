import { Constants } from "../constants.js";
import { Target, Visitor } from "../data-layer.js";
import { GLOBAL_V2_LOCALES, setUrlParams } from "../../utils/utils.js";
import Page from "../page.js";
import { getMetadata } from "../../utils/utils.js";

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
	"us_pfe_m": "us_pfe_m"
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
		this.promotion = product.promotion || (GLOBAL_V2_LOCALES.find(domain => Page.locale === domain) ? 'global_v2' : null);
		const option = Object.values(Object.values(product.variations)[0])[0];
		this.currency = option.currency_iso;
		this.symbol = option.currency_label;
		this.regionId = option.region_id;
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
	 * @returns {string}
	 */
	getRegionId() {
		return this.regionId;
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
		const devicesOption = this.options[devices];
		const yearsOption = devicesOption && devicesOption[years];

		if (!yearsOption) { return null; }

		const buyCart = new URL(`https://www.bitdefender.com/site/Store/buy/${this.id}/${devices}/${years}/${this.promotion ? `pid.${this.promotion}` : ""}`);
		buyCart.searchParams.set("CURRENCY", this.currency);
		buyCart.searchParams.set("DCURRENCY", this.currency);
		buyCart.searchParams.set("CART", "1");
		buyCart.searchParams.set("CARD", "2");
		buyCart.searchParams.set("SHORT_FORM", "1");
		buyCart.searchParams.set("LANG", Page.langauge);
		buyCart.searchParams.set("force_country", Store.getCountry());

		if (window.UC_UI) {
			buyCart.searchParams.set("ucControllerId", window.UC_UI.getControllerId());
		}

		const option = new ProductOption({
			price: Number(Number(yearsOption.price).toFixed(2)),
			priceDiscounted: Number(Number(yearsOption.discount?.discounted_price).toFixed(2)),
			buyLink: buyCart.href,
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

		//Init Selector Settings
		if (Store.config.provider === "init") {
			if (bundle) {
				option.buyLink = option.buyLink.replace("buy", "buybundle");
			}

			return option;
		}

		//Zuora settings
		const windowURL = new URL(window.location.href)
		const zuoraCart = new URL("/index.html:step=cart?theme=light", Store.config.zuora.cartUrl)

		if (this.promotion) {
			zuoraCart.searchParams.set("campaign", this.promotion);
		}
		if (windowURL.searchParams.has("lang")) {
			zuoraCart.searchParams.set("language", windowURL.searchParams.get("lang"));
		}
		if (windowURL.searchParams.has("language")) {
			zuoraCart.searchParams.set("language", windowURL.searchParams.get("language"));
		}
		if (windowURL.searchParams.has("event")) {
			zuoraCart.searchParams.set("event", windowURL.searchParams.get("event"));
		}
		if (windowURL.searchParams.has("channel")) {
			zuoraCart.searchParams.set("channel", windowURL.searchParams.get("channel"));
		}
		zuoraCart.searchParams.set("product_id", this.productId);
		zuoraCart.searchParams.set("payment_period", monthlyProducts[this.id] ? `${devices}d1m` : `${devices}d${years}y`);
		zuoraCart.searchParams.set("country", "NL");
		zuoraCart.searchParams.set("language", "nl_NL");
		zuoraCart.searchParams.set("client", "8f768650-6915-11ed-83e3-e514e761ac46");

		if (bundle) {
			zuoraCart.searchParams.set("bundle_id", this.productId);
			zuoraCart.searchParams.set("bundle_payment_period", monthlyProducts[bundle.id]
				? `${bundle.getDevices()}d1m`
				: `${bundle.getDevices()}d${bundle.getSubscription("years")}y`);
		}

		option.buyLink = zuoraCart.href;

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

class BitCheckout {

	static monthlyProducts = ["psm", "pspm", "vpn-monthly", "passm", "pass_spm", "dipm", "us_i_m",
		"us_f_m", "us_pf_m", "us_pi_m", "us_pie_m", "us_pfe_m"]

	// this products come with device_no set differently from the init-selector api where they are set to 1
	static wrongDeviceNumber = ["bms", "mobile", "ios", "mobileios", "psm", "passm"]

	static productId = {
		av: "com.bitdefender.cl.av",
		is: "com.bitdefender.cl.is",
		tsmd: "com.bitdefender.cl.tsmd",
		fp: "com.bitdefender.fp",
		ps: "com.bitdefender.premiumsecurity",
		psm: "com.bitdefender.premiumsecurity",
		psp: "com.bitdefender.premiumsecurityplus",
		pspm: "com.bitdefender.premiumsecurityplus",
		soho: "com.bitdefender.soho",
		mac: "com.bitdefender.avformac",
		vpn: "com.bitdefender.vpn",
		"vpn-monthly": "com.bitdefender.vpn",
		pass: "com.bitdefender.passwordmanager",
		passm: "com.bitdefender.passwordmanager",
		pass_sp: "com.bitdefender.passwordmanager",
		pass_spm: "com.bitdefender.passwordmanager",
		bms: "com.bitdefender.bms",
		mobile: "com.bitdefender.bms",
		ios: "com.bitdefender.iosprotection",
		mobileios: "com.bitdefender.iosprotection",
		dip: "com.bitdefender.dataprivacy",
		dipm: "com.bitdefender.dataprivacy",
		avpm: 'com.bitdefender.cl.avplus.v2',
		// DLP
		ts_i: 'com.bitdefender.tsmd.v2',
		ts_f: 'com.bitdefender.tsmd.v2',
		ps_i: 'com.bitdefender.premiumsecurity.v2',
		ps_f: 'com.bitdefender.premiumsecurity.v2',
		us_i: 'com.bitdefender.ultimatesecurityeu.v2',
		us_i_m: 'com.bitdefender.ultimatesecurityeu.v2',
		us_f: 'com.bitdefender.ultimatesecurityeu.v2',
		us_f_m: 'com.bitdefender.ultimatesecurityeu.v2',
		us_pf: 'com.bitdefender.ultimatesecurityeu.v2',
		us_pf_m: 'com.bitdefender.ultimatesecurityeu.v2',
		us_pi: 'com.bitdefender.ultimatesecurityplusus.v2',
		us_pi_m: 'com.bitdefender.ultimatesecurityplusus.v2',
		us_pie: 'com.bitdefender.ultimatesecurityplusus.v2',
		us_pie_m: 'com.bitdefender.ultimatesecurityplusus.v2',
		us_pfe: 'com.bitdefender.ultimatesecurityplusus.v2',
		us_pfe_m: 'com.bitdefender.ultimatesecurityplusus.v2',
	}

	static names = {
		pass: "Bitdefender Password Manager",
		pass_sp: "Bitdefender Password Manager Shared Plan",
		passm: "Bitdefender Password Manager",
		pass_spm: "Bitdefender Password Manager Shared Plan"
	}

	static getKey() {
		const hostname = window.location.hostname;
		if (/^(author-p23952-e68330|www|new)/.test(hostname)) {
			return 'bb22f980-fa19-11ed-b443-87a99951e6d5';
		}
		if (/^(localhost|local.bitdefender.com)/.test(hostname)) {
			return '3405af40-c88e-11ed-9a49-e17059797c0c';
		}
		if (/^(author-p23952-e81192|dev1|.hlx.)/.test(hostname)) {
			return '91d619d0-c88e-11ed-9ff9-3bfdc38b7fc4';
		}
		if (/^(author-p23952-e68355|stage)/.test(hostname)) {
			return '213462b0-c88d-11ed-87f8-99121213a0e3';
		}
	}

	static config(key) {
		return {
			key: key || this.getKey(),
			country: 'NL',
			language: 'nl_NL',
			debug: false,
			request_timeout: 15000, //default value if not set 3500
			default_scenario: 'www.checkout.v1',
			disable_auto_generated_new_session: false,
			return_url: document.referrer ? document.referrer : window.location.href,
			central: true
		};
	}

	static async getProductVariations(productId, campaign) {
		const endpoint = new URL("/v1/info/variations/price", Store.config.zuora.endpoint);
		endpoint.searchParams.set("product_id", productId);
		if (campaign !== Store.NO_PROMOTION) {
			endpoint.searchParams.set("campaign", campaign);
		}
		endpoint.searchParams.set("country_code", "NL");

		try {
			const response = await fetch(
				endpoint.href,
				{
					method: "GET",
					headers: {
						"X-Public-Key": Store.config.zuora.key,
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
		let payload = (await this.getProductVariations(this.productId[id], campaignId))?.payload;

		if (!payload || payload.length === 0) {
			return null
		}

		/**
		 * this rules splits one product into multiple products
		 * for example com.bitdefender.passwordmanager maps 2 products
		 * Password Manager and Password Manager Shared Plan
		 */
		if (this.names[id]) {
			payload = payload.filter(product => product.name === this.names[id])
		}

		window.StoreProducts.product[id] = {
			product_alias: id,
			product_id: this.productId[id],
			product_name: payload[0].name,
			variations: {}
		}

		payload.forEach(period => {
			let billingPeriod;
			switch (period.billing_period) {
				case "Month":
					billingPeriod = 0;
					break;
				case "Annual":
					billingPeriod = 1;
					break;
				case "Two_Years":
					billingPeriod = 2;
					break;
				case "Three_Years":
					billingPeriod = 3;
					break;
				case "Five_Years":
					billingPeriod = 5;
					break;
				default:
					billingPeriod = 10;
			}

			if (this.monthlyProducts.indexOf(id) === -1 && billingPeriod === 0 || this.monthlyProducts.indexOf(id) !== -1 && billingPeriod !== 0) {
				return;
			}

			if (this.monthlyProducts.indexOf(id) !== -1) {
				billingPeriod = 1;
			}

			period.pricing.forEach(devices => {
				let devices_no = devices.devices_no;

				if (this.wrongDeviceNumber.includes(id)) {
					devices_no = 1;
				}
				const devicesObj = {
					currency_iso: devices.currency,
					currency_label: "€",
					product_id: this.productId[id],
					platform_product_id: this.productId[id],
					promotion: campaignId,
					region_id: 22,
					platform_id: 16,
					price: devices.price,
					variation: {
						variation_name: `${devices_no}u-${billingPeriod}y`,
						years: billingPeriod,
						billing_period: period.billing_period,
						payment_period: period.payment_period
					}
				}
				if (devices.discount > 0) {
					devicesObj['discount'] = {
						discounted_price: devices.total,
						discount_value: devices.discount,
					}
				}

				window.StoreProducts.product[id].variations[devices_no] = window.StoreProducts.product[id].variations[devices_no] ? window.StoreProducts.product[id].variations[devices_no] : {}
				window.StoreProducts.product[id].variations[devices_no][billingPeriod] = devicesObj
			})
		})
		return window.StoreProducts.product[id];
	}

	static async loadProduct(id, campaign) {
		window.StoreProducts = window.StoreProducts || [];
		window.StoreProducts.product = window.StoreProducts.product || {}
		return await this.getProductVariationsPrice(id, campaign);
	}
}

class StoreConfig {

	constructor() {
		/**
		 * Api used to fetch the prices
		 * @type {"init"|"zuora"}
		 */
		this.provider = Constants.ZUROA_LOCALES.includes(Page.locale) ? "zuora" : "init";

		/**
		 * default promotion for zuora
		 * @type {Promise<string>}
		 */
		this.zuoraCampaign = this.#getZuoraCampaign();

		/**
		 * @type {{
		 * cartUrl: string
		 * key: string,
		 * endpoint: string
		 * }}
		 */
		this.zuora = {
			cartUrl: "https://checkout.bitdefender.com",
			key: "bb22f980-fa19-11ed-b443-87a99951e6d5",
			endpoint: "https://checkout-service.bitdefender.com"
		};

		/**
		 * @type {"POST"}
		 */
		this.httpMethod = "POST";
	}

	async #getZuoraCampaign() {
		if (!Constants.ZUROA_LOCALES.includes(Page.locale)) {
			return "";
		}

		const jsonFilePath = 'https://www.bitdefender.com/pages/fragment-collection/zuoracampaign.json';

		const resp = await fetch(jsonFilePath);
		if (!resp.ok) {
			console.error(`Failed to fetch data. Status: ${resp.status}`);
			return '';
		}
		const data = await resp.json();

		return data.data[0].CAMPAIGN_NAME;
	}
}

export class Store {
	static countriesMapping = {
		gb: "uk",
		ch: "de",
		at: "de",
		us: "en",
		mx: "en",
		nz: "au",
	}

	static consumer = "consumer";
	static business = "business";
	static NO_PROMOTION = "ignore";
	static products = {};
	/** country equals the geographic location given by IP */
	static country = Page.country;
	static mappedCountry = this.getCountry();
	/** Private variables */
	static baseUrl = Constants.DEV_BASE_URL;

	static config = new StoreConfig();

	/**
	 * Get a product from the api.2checkout.com
	 * @async
	 * @param {ProductInfo[]} productsInfo - objects describing the product to be fetched
	 * @returns {Promise<Product>}
	 */
	static async getProducts(productsInfo) {
		if (!Array.isArray(productsInfo)) { return null; }

		// remove duplicates by id
		productsInfo = [...new Map(productsInfo.map((product) => [`${product.id}`, product])).values()];

		this.products = (await Promise
			.allSettled(
				productsInfo.map(async product => {
					//url > produs > global_campaign
					product.promotion = await Target.getCampaign()
						|| this.#getUrlPromotion()
						|| product.promotion
						|| getMetadata("pid")
						|| await this.config.zuoraCampaign;

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
		if (this.config.provider === "zuora") {
			try {
				const product = await BitCheckout.loadProduct(productInfo.id, productInfo.promotion);

				if (!product) {
					return null
				}

				return {
					...product,
					...productInfo
				}
			} catch (error) {
				return null;
			}
		}

		const data = JSON.stringify({
			ev: 1,
			product_id: productInfo.id,
			config: {
				country_code: this.country,
				...(productInfo.promotion !== Store.NO_PROMOTION && { extra_params: { pid: productInfo.promotion } }),
				...(productInfo.promotion === Store.NO_PROMOTION && { ignore_promotions: true })
			}
		});

		const apiURL = new URL(`https://www.bitdefender.com/site/Store/ajax${this.config.httpMethod === "GET" ? `/${encodeURI(btoa(data))}/` : ""
			}`);

		apiURL.searchParams.set("force_country", this.mappedCountry);

		try {
			let response

			switch (this.config.httpMethod) {
				case "POST":
					const formData = new FormData();
					formData.append('data', data);
					response = await fetch(apiURL.href,
						{
							body: formData,
							method: "post"
						}
					);
					break;
				case "GET":
					response = await fetch(apiURL.href);
					break;
				default:
					return null;
			}

			if (!response.ok) {
				return null;
			}

			const product = await response.json();

			if (!product.data.product.variations || product.data.product.variations.length === 0) {
				return null;
			}

			return {
				...product.data.product,
				...productInfo
			}
		} catch (error) {
			console.error(error);
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
window.BitCheckout = BitCheckout;