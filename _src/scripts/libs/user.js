import Cookie from "./cookie.js";
import { Constants } from "./constants.js";
import { UserAgent } from "./user-agent/index.js";

export class User {

  static #staticInit = this.#staticInitialise();

  static fingerprint = this.#getFingerprint();

  static country = this.#getGeolocation();

  static async #staticInitialise() {

    if (!Cookie.has(Constants.LOGIN_LOGGED_USER_EXPIRY_COOKIE_NAME)) {
      return null;
    }

    try {
      const userDataResponse = await fetch(`${Constants.PUBLIC_URL}/bin/login/userInfo.json`);
      return userDataResponse.ok ? (await userDataResponse.json()).result : null;
    } catch {
      return null;
    }
}

  /**
   * 
   * @returns {Promise<string | null>}
   */
  static async #getFingerprint() {

      // Try to grab the fingeprint from localstoraage
      const storageFingerprint = localStorage.getItem(Constants.FINGERPRINT_LOCAL_STORAGE_NAME);
      if (storageFingerprint) {
        return storageFingerprint;
      }

      // Try to grab fingerprint from login data
      const loginData = await this.#staticInit;
      if (loginData) {
        localStorage.setItem(Constants.FINGERPRINT_LOCAL_STORAGE_NAME, loginData.fingerprint);
        return loginData.fingerprint;
      }
  
      // Try to grab fingerprint from dummyPost (from user local antivirus instance)
      const fingerprintNotExist = Cookie.has(Constants.NO_FINGERPRINT_COOKIE_NAME);
      const getCorrectDummyPostDomain = () => {
        if (window.location.hostname.includes("www.")) {
          return "";
        }
    
        return "https://www.bitdefender.com";
      };

      if(!fingerprintNotExist && UserAgent.isWindows){
        try {
          const fingerprintReq = await fetch(`${getCorrectDummyPostDomain()}/site/Main/dummyPost?${Math.random()}`, {
            method: "POST",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
              "Pragma": "no-cache",
              "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
              "Expires": "Tue, 01 Jan 1971 02:00:00 GMT",
              "BDUS_A312C09A2666456D9F2B2AA5D6B463D6": "check.bitdefender"
            }
          });
          const fingerprintHeader = "BDUSRH_8D053E77FD604F168345E0F77318E993";
  
          if (fingerprintReq.ok && fingerprintReq.headers.has(fingerprintHeader)) {
            const fingerprint = fingerprintReq.headers.get(fingerprintHeader);
            localStorage.setItem(Constants.FINGERPRINT_LOCAL_STORAGE_NAME, fingerprint);
            return fingerprint;
          } else {
            Cookie.set(Constants.NO_FINGERPRINT_COOKIE_NAME, true, 1);
          }
        } catch { }
      }
  
      return null;
  };

    /**
   * Handling User Geolocation
   * This wil fetch the user's country
   * @return {Promise<string>}
   */
  static async #getGeolocation() {
    try {
      const response = await fetch(`${Constants.PUBLIC_URL}/geoip`);

      if (!response.ok) {
        return "us";
      }

      const country = await response.json();
      if (country.error_code) {
        return "us";
      }

      return country["country"].toLowerCase();

    } catch(err) {
      return "us";
    }
  }

  /**
  * 
  * @returns {Promise<{
	*   fingerprint: string,
  *   email: string,
  *   firstname: string
  * } | null>}
  */
  static async getUserInfo() {
    return await this.#staticInit;
  }
};