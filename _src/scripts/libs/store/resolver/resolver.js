import { AdobeDataLayerService } from "@repobit/dex-data-layer";
import { Store, ProductInfo, ProductOption } from "../store.js";
import { FranklinProductsLoadedEvent } from "../../data-layer.js";
import { staticAttributesResolvers, staticAttributes } from "./staticAttributes/index.js";
import { clickAttributeResolvers, clickAttributes } from "./clickAttributes/index.js";
import { staticGlobalAttributesResolvers } from "./staticGlobalAttributes/index.js";

export class GlobalContext {
	/**
	 * @type {import("../index.js").ProductOption[]}
	 */
	static variations = [];

	static solveStaticAttributes() {
		StoreResolver.resolveStaticGlobalAttributes(document.querySelector("main") || document.querySelector("body"));
	}
}

export class Context {
	constructor(product, devices, years, staticAttributes, clickAttributes, contexts, contextProducts, products, devicePropertiesMapping) {
		/**
		 * @type {import("../index.js").Product}
		 */
		this.products = products;
		/**
		 * @type {import("../index.js").Product}
		*/
		this._product = product;
		/**
		 * @type {HTMLElement[]}
		 */
		this.staticAttributes = staticAttributes;
		/**
		 * @type {HTMLElement[]}
		 */
		this.clickAttributes = clickAttributes;
		/**
		 * @type {Context[]}
		 */
		this.contexts = contexts;
		/**
		 * @type {import("../index.js").Product[]}
		*/
		this.contextProducts = contextProducts;
		/**
		 * @type {import("../index.js").ProductOption}
		 */
		this.bundle = null;
		this._devices = devices;
		this._years = years;
		/**
		 * @type {import("../index.js").ProductOption}
		 */
		this._option = product.getOption(devices, years);

		/**
		 * transform the Content fragment variables object from
		 * {"3": {
		 * 		"servers": 1
		 * 	}
		 * }
		 * into
		 * {"3": {
		 * 		"CFV_SERVERS": 1
		 * 	}
		 * }
		 */
		this.devicePropertiesMapping = Object.entries(devicePropertiesMapping).reduce((agregator, [key, value]) => {
			agregator[key] = Object.entries(value).reduce((agregator, [key, value]) => {
				agregator[`CFV_${key.toUpperCase()}`] = value;
				return agregator;
			}, {});
			return agregator;
		}, {});

		this.devicePropertiesVariables = Object.keys(Object.values(this.devicePropertiesMapping)[0] || {});
		this._option.deviceMapping = this.devicePropertiesMapping[this.devices];
	}

	/**
	 * @type {number}
	*/
	get years() {
		return this._years;
	}

	/**
	 * @param {number} value
	 */
	set years(value) {
		/**
		 * @type {import("../index.js").ProductOption}
		 */
		const option = this.product.getOption(this._devices, Number(value)) ||
			this.product.getOption(this.product.getSubscriptions("years", Number(value))[0], Number(value));
		if (!option) { return; }
		this._years = Number(value);
		this._option = option;
		this.solveStaticAttributes();
	}

	/**
	 * @type {number}
	*/
	get devices() {
		return this._devices;
	}

	/**
	 * @param {number} value
	 */
	set devices(value) {
		/**
		 * @type {import("../index.js").ProductOption}
		 */
		const option = this.product.getOption(Number(value), this._years) ||
			this.product.getOption(Number(value), this.product.getSubscriptions("years", Number(value))[0]);
		if (!option) { return; }
		this._devices = Number(value);
		this._option = option;
		this._option.deviceMapping = this.devicePropertiesMapping[this.devices];
		this.solveStaticAttributes();
	}

	/**
	 * @type {import("../index.js").ProductOption}
	 */
	get option() {
		if (this.bundle) {
			const variation = this.product.getOption(this.devices, this.years, this.bundle);
			variation.deviceMapping = this.devicePropertiesMapping[this.devices];

			return variation;
		}
		return this._option;
	}

	/**
	 * @param {string} value
	 */
	set option(value) {
		const [devices, years] = parseKey(value);
		/**
		 * @type {import("../index.js").ProductOption}
		 */
		const option = this.product.getOption(devices, years);
		if (!option) { return; }
		this._devices = devices;
		this._years = years;
		this._option = option;
		this._option.deviceMapping = this.devicePropertiesMapping[this.devices];
		this.solveStaticAttributes();
	}

	/**
	 * @type {import("../index.js").Product}
	*/
	get product() {
		return this._product;
	}

	/**
	 * @param {string} value
	 */
	set product(value) {
		if (this.products[value]) {
			this._product = this.products[value];
		}
	}

	solveStaticAttributes() {
		this.staticAttributes.forEach(attribute => StoreResolver.resolveStaticAttributes(attribute, this));
	}

	setBundle(id, option) {
		if (!id) {
			this.bundle = null;
			this.solveStaticAttributes();
			return;
		}

		const product = this.products[id];
		const bundle = product?.getOption(
			...parseKey(option)
		);
		if (!bundle) { return; }

		this.bundle = bundle;
		this.solveStaticAttributes();
	}
}

/**
 * @param {HTMLElement} element
 * @param {number|string} value
 */
export const writeValue = (element, value) => {
	switch (element.nodeName) {
		case "INPUT":
			element.value = value
			break;
		default:
			element.innerHTML = value
			break;
	}
}

/**
 *
 * @param {string} key
 * @returns {number[]}
 */
export const parseKey = (key) => {
	const keys = key.split('-');
	if (keys.length < 2) { return [1, 1] };

	let index = keys.length > 2 ? 1 : 0;
	const nrDevices = keys[index++].replace(/\D/g, "");
	const [nrYears] = keys[index].split(/[ym]/);
	return [Number(nrDevices), Number(nrYears)];
}

window.parseKey = parseKey;

export class StoreResolver {
	static contextAttributes = {
		storeId: "[data-store-id]",
		storeDepartment: "[data-store-department]",
		storeOption: "[data-store-option]",
		storePromotion: "[data-store-promotion]",
		storeEvent: "[data-store-event]",
		storeKey: "[data-store-key]",
		storeContext: "[data-store-context]",
		storeDevicePropertiesMapping: "[data-store-device-properties-mapping]"
	}

	static staticAttributes = staticAttributes;
	static clickAttributes = clickAttributes;

	static async resolve(root = document, configMbox = null) {
		await Promise.allSettled([
			this.#resolveRootElement(root, configMbox),
			...[...root.querySelectorAll("[data-shadow-dom]")].map(element => this.#resolveRootElement(element.shadowRoot, configMbox))
		]);
	}

	static async #resolveRootElement(root, configMbox) {
		const products = root.querySelectorAll(`${this.contextAttributes.storeId}${this.contextAttributes.storeDepartment}`);
		if (products.length === 0) { return; }

		const productsInfo = [...products, ...this.getAdditionalProducts(root)].map(element => {
			try {
				return new ProductInfo(
					element.dataset.storeId,
					element.dataset.storeDepartment,
					element.dataset.storePromotion,
				)
			} catch (error) {
				console.error(error.message)
				return null;
			}
		}).filter(element => !!element);

		const storeProducts = await Store.getProducts(productsInfo, configMbox);
		const contexts = root.querySelectorAll(`${this.contextAttributes.storeContext}`);

		for (const context of contexts) {
			const products = this.getAllProducts(context);
			const globalStaticAttributes = context.dataset.storeId ? [] : this.getAllAttributes(context, this.staticAttributes);
			const globalClickAttributes = context.dataset.storeId ? [] : this.getAllAttributes(context, this.clickAttributes);

			const pageContexts = [];
			const contextProducts = [...products, ...this.getAdditionalProducts(context)].map(product =>storeProducts[product.dataset.storeId])
			for (const product of products) {
				const storeProduct = storeProducts[product.dataset.storeId];
				const productDataMapping = JSON.parse(product.dataset?.storeDevicePropertiesMapping || '{}');
				if (!storeProduct) { continue; }

				const options = this.getAllOptions(product);
				const productStaticAttributes = product.dataset.storeOption ? [] : this.getAllAttributes(product, this.staticAttributes);
				const productClickAttributes = product.dataset.storeOption ? [] : this.getAllAttributes(product, this.clickAttributes);

				for (const option of options) {
					const optionStaticAttributes = [...this.getAllAttributes(option, this.staticAttributes), ...productStaticAttributes, ...globalStaticAttributes];
					const optionClickAttributes = [...this.getAllAttributes(option, this.clickAttributes), ...productClickAttributes, ...globalClickAttributes];
					const [devices, years] = parseKey(option.dataset.storeOption);
					const storeOption = storeProduct.getOption(devices, years);
					if (!storeOption) { continue; }

					const context = new Context(
						storeProduct,
						devices,
						years,
						optionStaticAttributes,
						optionClickAttributes,
						pageContexts,
						contextProducts,
						storeProducts,
						productDataMapping
					);

					pageContexts.push(context);
					if (!product.dataset.storeNotGlobal) GlobalContext.variations.push(...this.getAllVariationsFromContext(context));
					optionStaticAttributes.forEach(staticAttribute => this.resolveStaticAttributes(staticAttribute, context));
					optionClickAttributes.forEach(clickAttribute => this.resolveClickAttributes(clickAttribute, context));

					switch(option.dataset.storeEvent) {
						case "product-loaded":
							AdobeDataLayerService.push(new FranklinProductsLoadedEvent(storeOption, 'all'));
							break;
						case "main-product-loaded":
							AdobeDataLayerService.push(new FranklinProductsLoadedEvent(storeOption, 'info'));
							break;
						case "product-comparison":
							AdobeDataLayerService.push(new FranklinProductsLoadedEvent(storeOption, 'comparison'));
							break;
					}
				}
			}
		}

		GlobalContext.solveStaticAttributes();
	}

	/**
	 *
	 * @param {HTMLElement} element
	 * @param {Context} context
	 */
	static resolveStaticAttributes(element, context) {
		staticAttributesResolvers.forEach(attribute => {
			try {
				attribute(element, context);
			} catch (error) {
				console.error(error);
			}
		});
	}

	/**
	 *
	 * @param {HTMLElement} button
	 * @param {Context} context
	 */
	static resolveClickAttributes(button, context) {
		clickAttributeResolvers.forEach(attribute => {
			try {
				attribute(button, context);
			} catch (error) {
				console.log(error);
			}
		});
	}

	/**
	 *
	 * @param {HTMLElement} element
	 */
	static resolveStaticGlobalAttributes(element) {
		staticGlobalAttributesResolvers.forEach(attribute => {
			try {
				attribute(element);
			} catch (error) {
				console.log(error);
			}
		});
	}

	/**
	 * @param {Context} context
	 * @return {import("../index.js").ProductOption}
	 */
	static getAllVariationsFromContext(context) {
		/**
		 * @param {HTMLElement} attribute
		 * @returns {import("../index.js").ProductOption[]}
		 */
		const parseNodeName = (attribute) => {
			const options = [];

				if (attribute.nodeName === "INPUT" && attribute.type === 'range') {
					if (attribute.dataset.storeClickSetDevices !== undefined) {
						const [min, max] = context.product.getMinMaxDeviceNumbers();

						for (let devices = min; devices <= max; devices++) {
							options.push(context.product.getOption(devices, context.years));
						}
					}
				}

				if(attribute.nodeName === "SELECT") {
					if (attribute.dataset.storeClickSetDevices !== undefined) {
						[...attribute.options].forEach(option => options.push(
							context.product.getOption(Number(option.value), context.years)
						));
					}
					if (attribute.dataset.storeClickSetYears !== undefined) {
						[...attribute.options].forEach(option => options.push(
							context.product.getOption(context.devices, Number(option.value))
						));
					}
					if (attribute.dataset.storeClickSetProduct !== undefined) {
						[...attribute.options].forEach(option => {
							const [devices, years] = parseKey(option.dataset.storeProductOption || `${context.devices}-${context.years}` );
							options.push(context
								.products[option.dataset.storeProductId]
								?.getOption(devices, years)
							)
						});
					}
				}
				
				if (attribute.dataset.storeClickSetDevices !== undefined) {
					options.push(context.product.getOption(Number(attribute.dataset.storeClickSetDevices), context.years));
				}
				if (attribute.dataset.storeClickSetYears !== undefined) {
					options.push(context.product.getOption(context.devices, Number(attribute.dataset.storeClickSetYears)));
				}
				if (attribute.dataset.storeClickSetOption) {
					const [devices, years] = parseKey(attribute.dataset.storeClickSetOption);
					options.push(context.product.getOption(devices, years));
				}

				if (attribute.dataset.storeClickSetProduct !== undefined) {
					const [devices, years] = parseKey(attribute.dataset.storeProductOption || `${context.devices}-${context.years}`);
					options.push(context
						.products[attribute.dataset.storeProductId]
						?.getOption(devices, years)
					)
				}

				if (attribute.dataset.storeClickToggleBundle !== undefined) {
					const [devices, years] = parseKey(attribute.dataset.storeBundleOption);
					options.push(context
						.products[attribute.dataset.storeBundleId]
						?.getOption(devices, years)
					)
				}

			return options.filter(option => Boolean(option));
		}

		/**
		 * @param {import("../index.js").ProductOption} baseOption
		 * @param {import("../index.js").ProductOption} varyToOption
		 * @param {"devices"|"subscription"|"all"|"bundle"} modfier
		 * @returns {import("../index.js").ProductOption|null}
		 */
		const vary = (baseOption, varyToOption, modfier) => {
			let devices;
			let subscription;

			switch (modfier) {
				case "devices":
					devices = varyToOption.getDevices();
					subscription = baseOption.getSubscription("years");
					break;
				case "subscription":
					devices = baseOption.getDevices();
					subscription = varyToOption.getSubscription("years");
					break;
				case "all":
					devices = varyToOption.getDevices();
					subscription = varyToOption.getSubscription("years");
					break;
				case "none":
					devices = baseOption.getDevices();
					subscription = baseOption.getSubscription("years");
					break;
				default:
					return null;
			}

			return context.products[baseOption.getId()].getOption(
				devices,
				subscription,
				modfier === "bundle" ? varyToOption : null
			);
		}

		const setDevices = context.clickAttributes
			.filter(attribute => attribute.dataset.storeClickSetDevices !== undefined)
			.reduce((acc, attribute) => acc.concat(parseNodeName(attribute)), []);

		const setYears = context.clickAttributes
			.filter(attribute => attribute.dataset.storeClickSetYears !== undefined)
			.reduce((acc, attribute) => acc.concat(parseNodeName(attribute)), []);

		const setOption = context.clickAttributes
			.filter(attribute => attribute.dataset.storeClickSetOption)
			.reduce((acc, attribute) => acc.concat(parseNodeName(attribute)), []);

		const setProduct = context.clickAttributes
			.filter(attribute => attribute.dataset.storeClickSetProduct !== undefined)
			.reduce((acc, attribute) => acc.concat(parseNodeName(attribute)), []);

		const setBundle = context.clickAttributes
			.filter(attribute => attribute.dataset.storeClickToggleBundle !== undefined)
			.reduce((acc, attribute) => acc.concat(parseNodeName(attribute)), []);

		const devicesAndYearVariations = setYears
			.reduce((acc, baseOption) => acc.concat(
				setDevices.map(varyToOption => vary(baseOption, varyToOption, "devices")),
			), [])
			.concat(setYears.length === 0 ? setDevices : [], setOption, [context.option])
			.filter(option => Boolean(option));

		const [selectDevices, selectYears] = context.clickAttributes
			.filter(attribute => attribute.nodeName === "SELECT"
				&& (attribute.dataset.storeClickSetYears !== undefined || attribute.dataset.storeClickSetDevices !== undefined)
			)
			.sort((a,) => a.dataset.storeClickSetDevices !== undefined ? -1 : 1)

		const generateDynamicVariationsAfterProductSelect = (baseOption) => {
			const product = context.products[baseOption.getId()];

			if (selectDevices && selectYears) {
				return product.getAllOptions();
			}

			if (selectDevices) {
				return product
					.getSubscriptions("years", baseOption.getDevices())
					.map(years => product.getOption(baseOption.getDevices(), years))
			}

			if (selectYears) {
				return product
					.getDevices(baseOption.getSubscription("years"))
					.map(devices => product.getOption(devices, baseOption.getSubscription("years")))
			}

			return null;
		}

		const productVariations = setProduct
			.filter(option => Boolean(option));

		const bundleVariations = [
			...devicesAndYearVariations,
			...productVariations
		]
			.reduce((acc, baseOption) => acc.concat(
				setBundle.map(bundle => vary(baseOption, bundle, "bundle")),
			), [])
			.filter(option => Boolean(option));

		return [
			...devicesAndYearVariations,
			...productVariations,
			...bundleVariations
		].filter(option => option instanceof ProductOption);
	}

	/**
	 *
	 * @param {HTMLElement} context
	 */
	static getAllProducts(context) {
		/**
		 * @type {HTMLElement[]}
		 */
		const children = [...context.children];
		const products = [];

		for (const child of children) {
			if (child.dataset.storeContext) { continue };

			if (child.dataset.storeId && child.dataset.storeDepartment) {
				products.push(child);
				continue;
			}

			children.push(...child.children);
		}

		if (context.dataset.storeId && context.dataset.storeDepartment) {
			products.push(context);
		}

		return products;
	}

	/**
	 *
	 * @param {HTMLElement} product
	 */
	static getAllOptions(product) {
		/**
		 * @type {HTMLElement[]}
		 */
		const children = [...product.children];
		const options = [];

		for (const child of children) {
			if (child.dataset.storeId) { continue };

			if (child.dataset.storeOption) {
				options.push(child);
				continue;
			}

			children.push(...child.children);
		}

		if (product.dataset.storeOption) {
			options.push(product);
		}

		return options;
	}

	/**
	 *
	 * @param {HTMLElement} product
	 */
	static getAllAttributes(product, attributes) {
		/**
		 * @type {HTMLElement[]}
		 */
		const children = [...product.children];
		const attributesInOption = [];

		for (const child of children) {
			if (child.dataset.storeId || child.dataset.storeOption || child.dataset.storeContext) { continue };

			for (const attribute of Object.keys(child.dataset)) {
				if (Object.keys(attributes).includes(attribute)) {
					attributesInOption.push(child)
					break;
				}
			}

			children.push(...child.children);
		}

		for (const attribute of Object.keys(product.dataset)) {
			if (Object.keys(attributes).includes(attribute)) {
				attributesInOption.push(product)
				break;
			}
		}

		return attributesInOption;
	}

	static getAdditionalProducts(root) {
		return [...root.querySelectorAll(`[data-store-product-id], [data-store-bundle-id]`)]
			.map(button => {
				const newButton = document.createElement("div");
				newButton.setAttribute("data-store-id", button.dataset.storeProductId || button.dataset.storeBundleId);
				newButton.setAttribute("data-store-option", button.dataset.storeProductOption || button.dataset.storeBundleOption || "");
				newButton.setAttribute("data-store-department", button.dataset.storeProductDepartment || button.dataset.storeBundleDepartment);
				newButton.setAttribute("data-store-promotion", button.dataset.storeProductPromotion || button.dataset.storeBundlePromotion || "");
				newButton.setAttribute("data-store-region", button.dataset.storeProductRegion || button.dataset.storeBundleRegion || 0);
				newButton.setAttribute("data-store-platform", button.dataset.storeProductPlatform || button.dataset.storeBundlePlatform || 0);
				return newButton;
			});
	}
}

window.StoreResolverWebsites = StoreResolver;