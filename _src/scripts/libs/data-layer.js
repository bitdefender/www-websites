import { UserAgent } from "./user-agent/index.js";
import { User } from "./user.js";
import Page from "./page.js";

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
  TARGET_TENANT = "bitdefender";

  /**
   * 
   * @param {any} overwriteObject 
   * @returns {Promise<PageLoadStartedEvent>}
   */
  constructor() {
    return this.#generatePageLoadStartedEventData();
  };

  /**
   * 
   * @param {string} name -> properties 
   * @returns {string} metadata
   */
  #getMetadata(name) {
    const attr = name && name.includes(':') ? 'property' : 'name';
    const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
    return meta || '';
  }

  /**
   * 
   * @param {string} param -> the parameter to be searched in the URL 
   * @returns {string} -> value of the parameter
   */
  #getParamValue(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * get experiment details from Target
   * @returns {object | null}
   */
  async #getTargetExperimentDetails() {
    let targetExperimentDetails = null;
    if (this.#getMetadata('target-experiment') !== '') {
      const { runTargetExperiment } = await import('../target.js');
      targetExperimentDetails = await runTargetExperiment(TARGET_TENANT);
    }

    return targetExperimentDetails;
  }

  /**
   * 
   * @returns {object} - get experiment information
   */
  #getExperimentDetails() {
    if (!window.hlx || !window.hlx.experiment) {
      return null;
    }
  
    const { id: experimentId, selectedVariant: experimentVariant } = window.hlx.experiment;
    return { experimentId, experimentVariant };
  }

  /**
   * 
   * @param {string} hostname 
   * @returns {{
   *  domain: string,
   *  domainPartsCount: number
   * }} get domain information
   */
  #getDomainInfo(hostname) {
    const domain = hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\\_]{3,}(\.|:)?(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/);
    return {
      domain: domain[1],
      domainPartsCount: domain[1].split('.').length,
    };
  }

  /**
   * 
   * @param {string[]} tags 
   * @returns {string[]} get all analytic tags
   */
  #getTags(tags) {
    return tags ? tags.split(':').filter((tag) => !!tag).map((tag) => tag.trim()) : [];
  }

  /**
   * Returns the current user time in the format HH:MM|HH:00-HH:59|dayOfWeek|timezone
   * @returns {String}
   */
  #getCurrentTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const dayOfWeek = date.getDay();
    const timezone = date.toTimeString().split(' ')[1];
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${hours}:${minutes}|${hours}:00-${hours}:59|${weekday[dayOfWeek]}|${timezone}`;
  }

  /**
   * Returns the current GMT date in the format DD/MM/YYYY
   * @returns {String}
   */
  #getCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * 
   * @param {object} pageSectionData
   * @param {string} pageSectionData.tagName
   * @param {string} pageSectionData.locale
   * @param {string} pageSectionData.subSection
   * @param {string} pageSectionData.subSubSection
   * @param {string} pageSectionData.subSubSubSection
   * @param {string} pageSectionData.domain
   * @param {number} pageSectionData.domainPartsCount
   * @param {object} pageSectionData.experimentDetails
   */
  #trackPageLoadStartedEventStatus(pageSectionData) {
    this.pageInstanceID = Page.environment;
    this.page = {
      info: {
        name: pageSectionData.tagName, // e.g. au:consumer:product:internet security
        section: pageSectionData.locale,
        subSection: pageSectionData.subSection,
        subSubSection: pageSectionData.subSubSection,
        subSubSubSection: pageSectionData.subSubSubSection,
        destinationURL: window.location.href,
        queryString: window.location.search,
        referringURL: this.#getParamValue('adobe_mc_ref') || this.#getParamValue('ref') || document.referrer || '',
        serverName: 'hlx.live', // indicator for AEM Success Edge
        language: pageSectionData.locale,
        sysEnv: UserAgent.os,
        ...(pageSectionData.experimentDetails &&
          { experimentDetails: pageSectionData.experimentDetails }),
      },
      attributes: {
        promotionID: this.#getParamValue('pid') || '',
        internalPromotionID: this.#getParamValue('icid') || '',
        trackingID: this.#getParamValue('cid') || '',
        time: this.#getCurrentTime(),
        date: this.#getCurrentDate(),
        domain: pageSectionData.domain,
        domainPeriod: pageSectionData.domainPartsCount,
      },
    };
  }

  /**
   * get the object to be inserted into the data layer as a Promise
   * @returns {Promise<PageLoadStartedEvent>}
   */
  async #generatePageLoadStartedEventData() {
    const {
      hostname,
      pathname
    } = window.location;
  
    if (!hostname) {
      return;
    }

    const experimentDetails = (await this.#getTargetExperimentDetails()) ?? this.#getExperimentDetails();
    // eslint-disable-next-line no-console
    console.debug(`Experiment details: ${JSON.stringify(experimentDetails)}`);
  
    const { domain, domainPartsCount } = this.#getDomainInfo(hostname);
    const METADATA_ANALYTICS_TAGS = 'analytics-tags';
    const tags = this.#getTags(this.#getMetadata(METADATA_ANALYTICS_TAGS));
    const locale = Page.locale;

    const pageSectionData = {
      tagName: null, // e.g. au:consumer:product:internet security
      locale: locale,
      subSection: null,
      subSubSection: null,
      subSubSubSection: null,
      domain: domain,
      domainPartsCount: domainPartsCount,
      experimentDetails: experimentDetails
    }
  
    if (tags.length) {
      pageSectionData.tagName = [locale, ...tags].join(':'); // e.g. au:consumer:product:internet security
      pageSectionData.subSection = tags[0] || '';
      pageSectionData.subSubSection = tags[1] || '';
      pageSectionData.subSubSubSection = tags[2] || '';
    } else {
      const allSegments = pathname.split('/').filter((segment) => segment !== '');
      const lastSegment = allSegments[allSegments.length - 1];
      let subSubSubSection = allSegments[allSegments.length - 1].replace('-', ' ');
      let subSection = pathname.indexOf('/consumer/') !== -1 ? 'consumer' : 'business';
  
      let subSubSection = 'product';
      let tagName = `${locale}:product:${subSubSubSection}`;
      if (lastSegment === 'consumer') {
        subSubSection = 'solutions';
        tagName = `${locale}:consumer:solutions`;
      }
  
      if (window.errorCode === '404') {
        tagName = `${locale}:404`;
        subSection = '404';
        subSubSection = undefined;
        subSubSubSection = undefined;
      }
  
      pageSectionData.tagName = tagName; // e.g. au:consumer:product:internet security
      pageSectionData.subSection = subSection;
      pageSectionData.subSubSection = subSubSection;
      pageSectionData.subSubSubSection = subSubSubSection;
    }

    this.#trackPageLoadStartedEventStatus(pageSectionData);
    return this;
  };
};

export class UserDetectedEvent {
  event = "user detected";
  user = null;

  constructor() {
    return this.#generateUserDetectedEventData();
  };

  /**
   * 
   * @returns {object} get an object with all the query parameters
   */
  #getURLParameters() {
    // Return object from URL parameter string
    const result = {};
    const params = new URLSearchParams(window.location.search);
    for(const [key, value] of params) { // each 'entry' is a [key, value] tupple
      result[key] = value;
    }

    return  result;
  }

  async #generateUserDetectedEventData() {
    const paramsUrl = this.#getURLParameters();
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

    const pageName = window.location.href.split('/').filter(Boolean).pop().toLowerCase();
    let productFinding = 'product pages';
    switch(pageName) {
      case 'consumer':
        productFinding = 'solutions page';
        break;
      case 'thank-you':
        productFinding = 'thank you page';
        break;
      case 'toolbox page':
        productFinding = 'toolbox page';
        break;
      case 'downloads':
        productFinding = 'downloads page';
        break;
    }

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
   * ButtonClickEvent | FormEvent | PromotionIdEvent | OneClickPurchaseEvent
   * PageErrorEvent | PageLoadedEvent} event 
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
    const isErrorPage = window.errorCode === '404';
    if(isErrorPage) {
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
  const currentPage = window.location.href.split('/').filter(Boolean).pop();
  if (currentPage === 'free-antivirus') {
    // on Free Antivirus page we should add Free Antivirus as the main product
    AdobeDataLayerService.push(new MainProductLoadedEvent({
      ID: '8430',
    }));
  }
}

/**
 * Resolve the data layer
 */
export const resolveNonProductsDataLayer = async () => {
  pageErrorHandling();
  AdobeDataLayerService.push(await new UserDetectedEvent());
  checkClickEventAfterRedirect();
  getFreeProductsEvents();
}