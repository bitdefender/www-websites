export default class Cookie {
  /**
   * Set cookie
   * @param {String} name - cookie name
   * @param {String} value - cookie value
   * @param {number} days - cookie lifetime in days (optional)
   */
  static set(name, value, days = null) {
    const d = new Date();
    if (days) {
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    }

    document.cookie = `${name}=${value}${
      days ? `;expires=${d.toUTCString()}` : ''
    };path=/;secure`;
  }

  /**
   * Get cookie
   * @param {String} name - cookie name
   * @return {String}
   */
  static get(name) {
    const cookie = {};
    document.cookie.split(';').forEach((el) => {
      const [key, value] = el.split('=');
      cookie[key.trim()] = value;
    });
    return cookie[name];
  }

  /**
   * Check Cookie
   * @param {string} name - cookie name
   * @returns {boolean} existance of cookie name (cname)
   */
  static has(name) {
    const cookieChecked = this.get(name);
    if (cookieChecked !== '' && typeof cookieChecked !== 'undefined') {
      return true;
    }

    return false;
  }
}

window.Cookie = Cookie;
