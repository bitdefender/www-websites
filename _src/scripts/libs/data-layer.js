import { UserAgent } from "./user-agent";
import { User } from "./user";

/**
 * 
 * @param {import("./store").ProductOption} option
 */
const getOptionInfo = (option) => {
  return {
    ID: option.getAvangateId(),
    name: option.getName(),
    devices: option.getId() === 'psm' ? 10 : option.getDevices(), //DEPRECATED content - please remove after Vlaicu implementation
    subscription: option.getSubscription("months"),
    version: option.getSubscription("months") === 1 ? "monthly" : "yearly",
    basePrice: option.getPrice("value"),
    discountValue: option.getDiscount("value"),
    discountRate: option.getDiscount("percentage"),
    currency: option.getCurrency(),
    priceWithTax: option.getDiscountedPrice("value") || option.getPrice("value"),
  };
};

/**
 * @param {any[]} entries 
 * @returns {any[]} filter out duplicates for dataLayer
 */
const uniqueEntries = (entries) => {
  return [...new Map(entries.map((item) => [`${item.ID}${item.devices}${item.subscription}`, item])).values()];
};

export class PageLoadStartedEvent {
  event = "page load started";
  pageInstanceID = "";
  page = null;

  /**
   * 
   * @param {any} overwriteObject 
   * @returns {Promise<PageLoadStartedEvent>}
   */
  constructor(overwriteObject = {}) {
    return this.#generatePageLoadedEventData(overwriteObject);
  };

  /**
   * Timezone Conversion
   * @param {"d" | "h" | "t" | "z"} type
  */
  #__time(type) {
    const c = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let h = c.getHours();

    if (h < 10) {
      h = '0' + h
    }

    let m = c.getMinutes();
    if (m < 10) {
      m = '0' + m
    }

    const d = days[c.getDay()];
    const z = c.getTimezoneOffset() / 60 * -1;
    let r = null;

    switch(type) {
      case "t":
        r = h + ':' + m;
        break;
      case "h":
        r = h + ':00-' + h + ':59'
        break;
      case "d":
        r = d;
        break;
      case "z":
        if (z == 0) {
          r = 'GMT'
        } else if (z > 0) {
          r = 'GMT +' + z
        } else {
          r = 'GMT ' + z
        }
        break;
      default:
        r = 'unavailable';
        break;
    }

    return r;
  }

  async #generatePageLoadedEventData(overwriteObject) {

    // Handling referral logic with cookie
    const dataLayerElement = document.getElementById('tracking-footer-data-layer');
    if (!dataLayerElement) {
      return this;
    }

    const dataLayer = dataLayerElement.dataset;
    const urlParams = getURLParameters();

    // Handling time
    const timeStr = this.#__time('t') + "|" + this.#__time('h') + "|" + this.#__time('d') + "|" + this.#__time('z');

    this.pageInstanceID = dataLayer.layerPageinstanceid;
    this.page = {
      "info": {
        "name": overwriteObject.name || dataLayer.layerPagename,
        "section": dataLayer.layerSection,
        "subSection": overwriteObject.subSection || dataLayer.layerSubsection,
        "subSubSection": overwriteObject.subSubSection || dataLayer.layerSubsubsection,
        "subSubSubSection": overwriteObject.subSubSubSection || dataLayer.layerSubsubsubsection,
        "destinationURL": window.location.href,
        "queryString": dataLayer.layerQuerystring?.replace("&amp;", "&"),
        "referringURL": urlParams['ref'] || urlParams['adobe_mc_ref'] || document.referrer,
        "serverName": window.location.hostname,
        "sysEnv": UserAgent.os,
        "language": dataLayer.layerLanguage,
        "geoRegion": await User.country
      },
      "attributes": {
        "promotionID": dataLayer.layerPromotionid,
        "internalPromotionID": dataLayer.layerInternalpromotionid,
        "trackingID": dataLayer.layerTrackingid,
        "time": timeStr,
        "date": dataLayer.layerDate,
        "domain": dataLayer.layerDomain,
        "domainPeriod": dataLayer.layerDomainperiod
      }
    };

    // CBS code from tracking-footer.html
    window.CBSTags = [];
    window.CBSGeoip = '';
    try {
      window.CBSTags = ["homepage", "theme:draco"];
      window.CBSGeoip = 'us';
    } catch (ex) {
      console.log('error in CBS tracking footer', ex);
    }

    return this;
  };
};

export class UserDetectedEvent {
  event = "user detected";
  user = null;

  constructor() {
    return this.#generateUserDetectedEventData();
  };

  async #generateUserDetectedEventData() {
    const paramsUrl = getURLParameters();
    this.user = { loggedIN: false };

    if (Object.keys(paramsUrl).length > 0) {
      if (typeof paramsUrl['ems-uid'] !== 'undefined') {
        this.user.emarsysID = paramsUrl['ems-uid'];
      } else if (typeof paramsUrl['sc_uid'] !== 'undefined') {
        this.user.emarsysID = paramsUrl['sc_uid'];
      }
    }

    const fingerprint = await User.fingerprint;
    if (fingerprint) {
      this.user.ID = fingerprint;
      this.user.loggedIN = true;
    }

    const productFinding = document.getElementById('tracking-footer-data-layer')?.dataset.layerProductFinding;
    if (productFinding) {
      this.user.productFinding = productFinding;
    }

    return this;
  }
};

export class ProductsLoadedEvent  {
  event = "product loaded";
  product = {
    info: [],
    all: [],
    comparison: []
  };
  type = "";

  /**
   * 
   * @param {import("./store").ProductOption | {ID: string}} option
   * @param {string} type
   */
  constructor(option, type = "all") {
    this.type = type;
    if (option.ID) {
      this.product[type].push(option);
    } else {
      this.product[type].push(getOptionInfo(option));
    }
  }
};

export class MainProductLoadedEvent extends ProductsLoadedEvent {

  /**
   * 
   * @param {import("./store").ProductOption | {ID: string}} option 
   */
  constructor(option) {
    super(option, "info");
  }
};

export class ProductComparisonEvent extends ProductsLoadedEvent {

  /**
   * 
   * @param {import("./store").ProductOption | {ID: string}} option 
   */
  constructor(option) {
    super(option, "comparison");
  }
};

export class ButtonClickEvent {
  event = "";
  product = {};

  /**
   * 
   * @param {string} clickEvent
   * @param {string} productId 
   */
  constructor(clickEvent, productId) {
    this.event = clickEvent;
    const clickEventsMappings = [
      {clickEvent: "trial downloaded", productKey: "trial"},
      {clickEvent: "product downloaded", productKey: "downloaded"},
    ];
    const productKey = clickEventsMappings.find(
      clickEventsMapping => clickEventsMapping.clickEvent === clickEvent
    )?.productKey;

    if(productKey) {
      this.product[productKey] = [{
        ID: productId
      }];
    }
  }
};

export class ComponentLoadedEvent {
  component = null;

  /**
   * 
   * @param {Object} component 
   */
  constructor(component) {
    this.component = component;
  }
};

export class FormEvent {
  event = "";
  user = null;

  /**
   * 
   * @param {string} event 
   * @param {any} userObject 
   */
  constructor(event, userObject) {
    this.event = event;
    this.user = userObject;
  }
};

export class PromotionIdEvent {
  page = null;

  /**
   * 
   * @param {any} pageObject 
   */
  constructor(pageObject) {
    this.page = pageObject;
  }
};

export class OneClickPurchaseEvent {
  event = "";
  cart = null;
  transaction = null;

  /**
   * 
   * @param {string} event 
   * @param {any} cart 
   * @param {any} transaction 
   */
  constructor(event, cart, transaction) {
    this.event = event;
    this.cart = cart;
    this.transaction = transaction;

    if (!this.cart) {
      delete this.cart;
    }
    
    if (!this.transaction) {
      delete this.transaction;
    }
  }
};

export class PageErrorEvent {
  event = "page error";
};

export class PageLoadedEvent {
  event = "page loaded";
};

export class AdobeDataLayerService {
  static #dataLayer = {};
  static {
    window.adobeDataLayer = window.adobeDataLayer || [];
  }

  /**
   * 
   * @param { ProductsLoadedEvent | MainProductLoadedEvent | ProductComparisonEvent | PageLoadStartedEvent | UserDetectedEvent |
   * ButtonClickEvent | ComponentLoadedEvent | FormEvent | PromotionIdEvent | 
   * OneClickPurchaseEvent | PageErrorEvent | PageLoadedEvent} event 
   */
  static push(event) {

    /**
     * keep adding values to the already existing event
     */
    if ([ProductsLoadedEvent, MainProductLoadedEvent, ProductComparisonEvent].some(eventType => event instanceof eventType)) {

      /**
       * start constructing an object for the local dataLayer where the event name is the key
       * Example: {
       *  "product loaded": new ProductsLoadedEvent
       * }
       */
      const eventName = event.event;
      if (!this.#dataLayer[eventName]) {
        delete event.type;
        this.#dataLayer[eventName] = event;
        return;
      }

      //For these entries we do not want duplicate entries
      this.#dataLayer[eventName]["product"][event.type] = uniqueEntries([
        ...this.#dataLayer[eventName]["product"][event.type],
        ...event["product"][event.type]
      ]);

      return;
    }

    window.adobeDataLayer.push({ ...event });
  }

  /**
   * add the values from the local object to adobeDataLayer
   */
  static pushEventsToDataLayer() {
    const eventName = "product loaded";
    if (this.#dataLayer[eventName]) {
      const productObject = this.#dataLayer[eventName]["product"];
      productObject.all = productObject.all.filter(product =>
        !productObject.info.some(mainProduct => product.ID === mainProduct.ID)
      );

      Object.keys(productObject).forEach(key => {
        if (!productObject[key].length) {
          delete productObject[key];
        }
      });

      window.adobeDataLayer.push({ ...this.#dataLayer[eventName]});
    }
  };
};

export class Visitor {
  static #instanceID = '0E920C0F53DA9E9B0A490D45@AdobeOrg';
  static #instance = null;
  static #staticInit = new Promise(resolve => {
    if (window.Visitor) {
      Visitor.#instance = window.Visitor.getInstance(Visitor.#instanceID);
      resolve();
      return;
    }

    window.addEventListener("load", () => {
      if (window.Visitor) {
        Visitor.#instance = window.Visitor.getInstance(Visitor.#instanceID);
      }
      resolve();
    })
  });

  /**
   *
   * @param {string} url 
   * @returns {Promise<string>}
   */
  static async appendVisitorIDsTo(url) {
    await this.#staticInit;
    return !this.#instance || url.includes("adobe_mc") ? url : this.#instance.appendVisitorIDsTo(url);
  }

  /**
   *
   * @returns {Promise<string>}
   */
  static async getConsumerId() {
    await this.#staticInit;
    return this.#instance?._supplementalDataIDCurrent ? this.#instance._supplementalDataIDCurrent : "";
  }

  /**
   *
   * @returns {Promise<string>}
   */
  static async getMarketingCloudVisitorId() {
    await this.#staticInit;
    return this.#instance ? this.#instance.getMarketingCloudVisitorID() : "";
  }
};

window._Visitor = Visitor;

export class Target {
  static events = {
    LIBRARY_LOADED: "at-library-loaded",
    REQUEST_START: "at-request-start",
    REQUEST_SUCCEEDED: "at-request-succeeded",
    REQUEST_FAILED: "at-request-failed",
    CONTENT_RENDERING_START: "at-content-rendering-start",
    CONTENT_RENDERING_SUCCEEDED: "at-content-rendering-succeeded",
    CONTENT_RENDERING_FAILED: "at-content-rendering-failed",
    CONTENT_RENDERING_NO_OFFERS: "at-content-rendering-no-offers",
    CONTENT_RENDERING_REDIRECT: "at-content-rendering-redirect"
  }

  /**
   * Mbox describing an offer
   * @typedef {{content: {offer: string, block:string} | {pid}, type: string|null}} Mbox
   */

  /**
   * @type {Mbox}
   */
  static offers = null;

  static #staticInit = new Promise(resolve => {
    /** Target is loaded and we wait for it to finish so we can get the offer */
    if (window.adobe?.target) {
      this.#getOffers().then(resolve);
      return;
    }

    /** 
     * Semaphor to mark that the offer call was made 
     * This helps avoid doubled call fot the getOffer
     * Set before any 'await' as those triggered jumps in the code
     */
    let offerCallMade = false;

    /** Target wasn't loaded we wait for events from it */
    [this.events.CONTENT_RENDERING_SUCCEEDED, this.events.CONTENT_RENDERING_NO_OFFERS]
      .forEach(event => document.addEventListener(event, async () => {
        if (!offerCallMade) {
          offerCallMade = true;
          await this.#getOffers();
          resolve();
        }
      }, { once: true }));

    [this.events.CONTENT_RENDERING_FAILED, this.events.REQUEST_FAILED]
      .forEach(event => document.addEventListener(event, async () => {
        if (!offerCallMade) {
          offerCallMade = true;
          resolve();
        }
      }, { once: true }));

    /** 
     * Worst case the load event is triggered before the event from Target
     * as such we try to make the offer call again checking if at least the library was loaded
     */
    window.addEventListener("load", async () => {
      if (!offerCallMade) {

        if (window.adobe?.target) {
          offerCallMade = true;
          await this.#getOffers();
          resolve();
        } else if (window.location.hostname !== 'localhost') {
          /** 
           * Wait for 4 seconds and check if adobe launch was loaded and triggered the offer call
           */
          setTimeout(() => {
            if (!offerCallMade) {
              offerCallMade = true;
              resolve();
            }
          }, 4000);
        } else {
          resolve();
        }
      }
    }, { once: true });
  });

  /**
   * https://bitdefender.atlassian.net/wiki/spaces/WWW/pages/1661993460/Activating+Promotions+Enhancements+Target
   * @returns {Promise<string|null>}
   */
  static async getCampaign() {
    await this.#staticInit;
    return this.offers?.["initSelector-mbox"]?.content?.pid || null
  }

  /**
   * Awaits Target to apply load and apply its changes
   * @returns {Promise<void>}
   */
  static async loadAndRun() {
    await this.#staticInit;
  }

  /**
   * @returns {[string]}
   */
  static #getAllMboxes() {
    const mboxes = [...document.querySelectorAll("[data-mboxes]")]
      .map(mboxes => {
        try {
          return JSON.parse(mboxes.dataset.mboxes)
        } catch (error) {
          console.warn(error);
          return null;
        }
      })
      .filter(Boolean)
      .reduce((acc, mboxes) => {
        mboxes.forEach(mbox => acc.add(mbox));
        return acc;
      }, new Set());

    if (!mboxes) {
      return [];
    }

    return [...mboxes].map((name, index) => { return { index: ++index, name } });
  }

  static async #getOffers() {
    const mboxes = this.#getAllMboxes();

    try {
      this.offers = await window.adobe?.target?.getOffers({
        consumerId: await Visitor.getConsumerId(),
        request: {
          id: {
            marketingCloudVisitorId: await Visitor.getMarketingCloudVisitorId()
          },
          execute: {
            mboxes: [
              { index: 0, name: "initSelector-mbox" },
              ...mboxes
            ]
          }
        }
      });

      this.offers = this.offers?.execute?.mboxes?.reduce((acc, mbox) => {
        acc[mbox.name] = {};
        acc[mbox.name].content = mbox?.options?.[0]?.content;
        acc[mbox.name].type = mbox?.options?.[0]?.type;
        return acc;
      }, {});

    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * 
   * @param {string} mbox 
   * @returns {Promise<Mbox|null>}
   */
  static async getMbox(mbox) {
    await this.#staticInit;
    return this.offers?.[mbox];
  }
};

window.Target = Target;

/**
 * Page Error Handling
 */
const pageErrorHandling = () => {
    const notFoundInstance = document.getElementsByClassName("404 page-not-found");
    if(notFoundInstance && notFoundInstance.length) {
        AdobeDataLayerService.push(new PageErrorEvent());
    }
}

/**
 * Add click events to the data layer after page redirect
 */
const checkClickEventAfterRedirect = () => {
  if(localStorage.getItem("clickEvent") !== null) {
    const clickEvent = JSON.parse(localStorage.getItem("clickEvent"));

    if(clickEvent?.clickEvent) {
      AdobeDataLayerService.push(new ButtonClickEvent(clickEvent.clickEvent, clickEvent.productId));
    }

    localStorage.removeItem("clickEvent");
  }
}

/**
 * Add entry for free products
 */
const getFreeProductsEvents = () => {
  const dataLayers = document.querySelectorAll(".data-layer div");

  if (dataLayers.length <= 0) {
    return;
  }

  for (const dataLayer of dataLayers) {
    switch (dataLayer.dataset.event) {
      case "product loaded":
        AdobeDataLayerService.push(new MainProductLoadedEvent(
          {ID: dataLayer.dataset.productId}
        ));
        break;
      default:
        break;
    }
  }
}

/**
 * Resolve the data layer
 */
export const resolveDataLayer = async () => {
  pageErrorHandling();

  AdobeDataLayerService.push(await new UserDetectedEvent());
  checkClickEventAfterRedirect();

  getFreeProductsEvents();
}