/**
 * This class should hold all the page related information
 */
export default class Page {
  /**
   * @type {string} - 'us', 'mx'
   */
  static country;

  /**
   * @type {string} - 'en', 'es'
   */
  static language;

  /**
   * @type {string} - 'en-us', 'es-mx'
   */
  static locale;

  /**
   * @type {'dev' | 'stage' | 'prod'}
   */
  static environment

  static {

    this.locale = this.#getLocale();

    this.country = this.locale.split('-')[1];

    this.langauge = this.locale.split('-')[0];

    this.environment = this.#getEnvironment();
  }

  static #getLocale() {
    const regex = /\/([a-z]{2}-[a-z]{2})\//i; // match locale with slashes
    // extract locale without slashes
    const match = window.location.pathname.match(regex);
    const defaultLocale = 'en-us';
    if (match) {
      return match[1];
    }
  
    return defaultLocale;
  }

  /**
  * Returns the environment name based on the hostname
  * @returns {String}
  */
  static #getEnvironment() {
    const { hostname } = window.location;
    if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) {
      return 'stage';
    }
    if (hostname.includes('www.bitdefender')) {
      return 'prod';
    }
    return 'dev';
  }
}