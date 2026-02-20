import page from "../page.js";

export class Constants {
	static BASE_URL_FOR_DEV = ['localhost', 'stage', '.hlx.', '.aem.'].some((domain) =>
		window.location.hostname.includes(domain)) ? 'https://www.bitdefender.com' : '';

	static BASE_URL_FOR_PROD = ['localhost', 'stage', '.hlx.', '.aem.'].some((domain) =>
		window.location.hostname.includes(domain)) ? '' : 'https://www.bitdefender.com';

	static FINGERPRINT_LOCAL_STORAGE_NAME = 'rhvID';

	static NO_FINGERPRINT_COOKIE_NAME = 'fgpnoneBD';

	static LOGIN_LOGGED_USER_EXPIRY_COOKIE_NAME = 'bdcslue';

	static ZUROA_LOCALES = ['nl-nl', 'nl-be', 'de-de', 'de-at'];

	static DEV_DOMAINS = ['localhost', 'stage', '.hlx.', '.aem.'];

	static PRODUCT_ID_MAPPINGS_CALL = this.#getVlaicuProductIdsMapping();

	/**
	* @typedef {Object} VlaicuDataEntry
	* @property {string} websiteId
	* @property {string} storeBundleId
	* @property {boolean} isMonthlyProduct
	* @property {string} campaign
	*/

	/**
	*
	* @typedef {{
	*		[key: string]: VlaicuDataEntry
	* }} VlaicuData
	*/

	/**
	 * @typedef {{
	 * 	campaign: string
	 * }} VlaicuDataCampaign
	 */

	/**
	* @type {VlaicuData & VlaicuDataCampaign | null}
	*/
	static PRODUCT_ID_MAPPINGS = null;

	static WRONG_DEVICES_PRODUCT_IDS = {
		'pass_sp': {
			contentDevices: 1,
			providerDevices: 4,
		},
		'pass_spm': {
			contentDevices: 1,
			providerDevices: 4,
		},
		'vpn': {
			contentDevices: 10,
			providerDevices: 1,
		},
		'vpn-monthly': {
			contentDevices: 10,
			providerDevices: 1,
		}
	};

	static DISABLE_TARGET_PARAMS = {
		key: "dotest",
		value: "1"
	};

	static TARGET_EXPERIMENT_METADATA_KEY = "target-experiment-location";

	static ADOBE_TARGET_SESSION_ID_PARAM = "adobeTargetSessionId";

	static TARGET_TENANT = "bitdefender";

	static PUBLIC_URL_ORIGIN = ['www.', 'stage.'].some(domain => window.location.hostname.includes(domain))
		? '' : 'https://www.bitdefender.com';

	static LOGIN_URL_ORIGIN = ['www.', 'stage.'].some(domain => window.location.hostname.includes(domain))
		? window.location.origin : 'https://www.bitdefender.com';

	static NO_PROMOTION = "";

	static NONE_PRODUCT_PAGES = ["renewal", "consumer"];

	static LAUNCH_EVENTS = {
		LIBRARY_LOADED: "at-library-loaded",
		LAUNCH_FAILED_TO_LOAD: "launchCannotLoad"
	}

	// TODO: please remove this once SOHO starts working correctly on zuora and de domains
	static SOHO_CORNER_CASES_LOCALSE = ["de-de", "de-at", "de-ch"];

	static DOMAINS_WITHOUT_ADOBE_MC = ["brand.bitdefender.com"];

	static HEADINGS_QUERY = "h1, h2, h3, h4, h5, h6";

	/**
	 * fetch all the product id mappings for Vlaicu from websites
	 */
	static async #getVlaicuProductIdsMapping() {
		try {
			const nameForVlaicuConfig = this.ZUROA_LOCALES.includes(page.locale) ? "vlaicuconfigzuora" : "vlaicuconfig";
			const IS_INSIDE_OAI_WINDOW = window.location.href.includes('oaiusercontent');
			const baseUrl = IS_INSIDE_OAI_WINDOW
				? `https://www.bitdefender.com/common/vlaicuconfig/`
				: `/common/vlaicuconfig/`;
			const response = await fetch(`${baseUrl}${nameForVlaicuConfig}.json`);
			if (!response.ok) {
				console.error(`Failed to fetch data.`);
				return;
			}

			/**
			* @type {{
			* 	websiteId: string,
			* 	bundleId: string,
			* 	isMonthlyProduct: boolean,
			* 	campaign: string
			* }[]}
			*/
			const data = (await response.json())?.data;
			if (!data) {
				return;
			}

			const vlaicuProductIdsMapping = data.reduce((accumulator, currentValue) => {
				accumulator[currentValue.websiteId] = {
					...currentValue,
					isMonthlyProduct: currentValue.isMonthlyProduct === "false" ? false : true
				};
				return accumulator;
			}, {});
			vlaicuProductIdsMapping.campaign = data[0].campaign || this.NO_PROMOTION;

			this.PRODUCT_ID_MAPPINGS = vlaicuProductIdsMapping;
		} catch (e) {
			console.error(`Failed to fetch data.`);
			return;
		}
	};
}
