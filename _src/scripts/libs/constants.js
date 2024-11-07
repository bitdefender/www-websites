export const Constants = {
  DEV_BASE_URL: ["localhost", "stage", ".hlx."].some((domain) => 
    window.location.hostname.includes(domain)) ? 'https://www.bitdefender.com' : '',

  FINGERPRINT_LOCAL_STORAGE_NAME: 'rhvID',

  NO_FINGERPRINT_COOKIE_NAME: 'fgpnoneBD',

  LOGIN_LOGGED_USER_EXPIRY_COOKIE_NAME: 'bdcslue',

  ZUROA_LOCALES: ['nl-nl', 'nl-be'],

  DEV_DOMAINS: ["localhost", "stage", ".hlx."],

  DISABLE_TARGET_PARAMS: {
    key: "dotest",
    value: "1"
  },

  TARGET_EXPERIMENT_METADATA_KEY: "target-experiment-location"
}