import Page from "./page"

export const Constants = {
  DEV_BASE_URL: ['localhost', 'stage', '.hlx.'].some((domain) => 
    window.location.hostname.includes(domain)) ? 'https://www.bitdefender.com' : '',

  FINGERPRINT_LOCAL_STORAGE_NAME: 'rhvID',

  NO_FINGERPRINT_COOKIE_NAME: 'fgpnoneBD',

  LOGIN_LOGGED_USER_EXPIRY_COOKIE_NAME: 'bdcslue',

  ZUROA_LOCALES: ['nl-nl', 'nl-be'],

  DEV_DOMAINS: ['localhost', 'stage', '.hlx.'],

  PRODUCT_ID_MAPPINGS_ZUORA: {
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
		ultsec: "com.bitdefender.ultimatesecurityus",
		ultsecplus: "com.bitdefender.ultimatesecurityplusus",
		ultsecm: "com.bitdefender.ultimatesecurityus",
		ultsecplusm: "com.bitdefender.ultimatesecurityplusus",
		idthefts: "com.bitdefender.idtheftstandard",
		idtheftp: "com.bitdefender.idtheftpremium",
		idtheftsm: "com.bitdefender.idtheftstandard",
		idtheftpm: "com.bitdefender.idtheftpremium",
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
  },

  PRODUCT_ID_MAPPINGS_VLAICU: {
	av: "com.bitdefender.cl.av",
	is: "com.bitdefender.cl.is",
	tsmd: "com.bitdefender.cl.tsmd",
	fp: ['nl-nl', 'nl-be'].includes(Page.locale) ? "com.bitdefender.fp" : "com.bitdefender.cl.fp",
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
	ultsec: "com.bitdefender.ultimatesecurityus",
	ultsecplus: "com.bitdefender.ultimatesecurityplusus",
	ultsecm: "com.bitdefender.ultimatesecurityus",
	ultsecplusm: "com.bitdefender.ultimatesecurityplusus",
	idthefts: "com.bitdefender.idtheftstandard",
	idtheftp: "com.bitdefender.idtheftpremium",
	idtheftsm: "com.bitdefender.idtheftstandard",
	idtheftpm: "com.bitdefender.idtheftpremium",
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
},

  PRODUCT_ID_NAME_MAPPINGS: {
	pass: "Bitdefender Password Manager",
	pass_sp: "Bitdefender Password Manager Shared Plan",
	passm: "Bitdefender Password Manager",
	pass_spm: "Bitdefender Password Manager Shared Plan"
  },

  MONTHLY_PRODUCTS: ["psm", "pspm", "vpn-monthly", "passm", "pass_spm", "dipm", "us_i_m", "us_f_m", "us_pf_m", "us_pi_m", "us_pie_m", "us_pfe_m", "ultsecm", "ultsecplusm", "idtheftsm", "idtheftpm"],

  WRONG_DEVICES_PRODUCT_IDS: {
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
	},

  DISABLE_TARGET_PARAMS: {
    key: "dotest",
    value: "1"
  },

  TARGET_EXPERIMENT_METADATA_KEY: "target-experiment-location",

  ADOBE_TARGET_SESSION_ID_PARAM: "adobeTargetSessionId",

  TARGET_TENANT: "bitdefender",

  PUBLIC_URL_ORIGIN: ['www.', 'stage.'].some(domain => window.location.hostname.includes(domain))
    ? '' : 'https://www.bitdefender.com',
  
  LOGIN_URL_ORIGIN: ['www.', 'stage.'].some(domain => window.location.hostname.includes(domain))
    ? window.location.origin : 'https://www.bitdefender.com',
}