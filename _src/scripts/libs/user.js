import Cookie from "./cookie.js";
import { Constants } from "./constants.js";
import { UserAgent } from "./user-agent/index.js";

export class User {

  static fingerprint = this.#getFingerprint();

  static country = this.#getGeolocation();

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
   * This wil fetch the cf-ipcountry
   * @return {Promise<string>}
   */
  static async #getGeolocation() {
    const countryCookie = Cookie.country;
    if (countryCookie && countryCookie !== "undefined") {
      return countryCookie.toLowerCase();
    }

    try {
      const response = await fetch(`${Constants.DEV_BASE_URL}/bin/json/v1/geolocation?timestamp=${Date.now()}`);

      if (!response.ok) {
        console.error(`FETCH-GEO-COOKIE-ERROR-CODE:${response.status} MESSAGE:${response.statusText}`);
        return "us";
      }

      const country = await response.json();
      if (country.error_code) {
        console.error(`FETCH-GEO-COOKIE:${country.error_code} MESSAGE:${country.message}`);
        return "us";
      }

      Cookie.set("cf-ipcountry", country["cf-ipcountry"], 0.02);
      return country["cf-ipcountry"].toLowerCase();

    } catch(err) {
      console.warn('FETCH-GEO-COOKIE-ERROR');
      return "us";
    }
  }
};