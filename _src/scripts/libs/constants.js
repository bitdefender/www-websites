export const Constants = {
  DEV_BASE_URL: ['localhost', 'stage', '.hlx.'].some((domain) => 
    window.location.hostname.includes(domain)) ? 'https://www.bitdefender.com' : '',

  FINGERPRINT_LOCAL_STORAGE_NAME: 'rhvID',

  NO_FINGERPRINT_COOKIE_NAME: 'fgpnoneBD',

  LOGIN_LOGGED_USER_EXPIRY_COOKIE_NAME: 'bdcslue',

  ZUROA_LOCALES: ['nl-nl', 'nl-be'],

  DEV_DOMAINS: ['localhost', 'stage', '.hlx.'],

  PRODUCT_ID_MAPPINGS: {
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
  },

  PRODUCT_ID_NAME_MAPPINGS: {
	pass: "Bitdefender Password Manager",
	pass_sp: "Bitdefender Password Manager Shared Plan",
	passm: "Bitdefender Password Manager",
	pass_spm: "Bitdefender Password Manager Shared Plan"
  }
}