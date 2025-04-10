import Target from "@repobit/dex-target";
import { User } from "@repobit/dex-utils";
import page from "../page.js";
import { PageLoadStartedEvent, UserDetectedEvent, ButtonClickEvent, PageErrorEvent, AdobeDataLayerService } from "@repobit/dex-data-layer";
import {
  getTargetExperimentDetails,
  getExperimentDetails,
  generatePageLoadStartedName,
  getCampaignBasedOnLocale,
  getUrlPromotion,
  getProductFinding,
} from './utils/utils.js';

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
  const currentPage = page.name;
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
  AdobeDataLayerService.push(new PageLoadStartedEvent(
    page,
    {
      name: generatePageLoadStartedName(),
      geoRegion: await User.country,
      experimentDetails: (await getTargetExperimentDetails()) ?? getExperimentDetails(),
      serverName: 'hlx.live', // indicator for AEM Success Edge
    },
    {
      promotionID: (await Target.configMbox)?.promotion
                  || getUrlPromotion()
                  || getMetadata('pid')
                  || getCampaignBasedOnLocale()
                  || '',
      internalPromotionID: page.getParamValue('icid') || '',
      trackingID: page.getParamValue('cid') || '',
    },
  ));
  pageErrorHandling();
  AdobeDataLayerService.push(new UserDetectedEvent(
    page,
    {
      ID: await User.fingerprint,
      productFinding: getProductFinding()
    }
  ));
  checkClickEventAfterRedirect();
  getFreeProductsEvents();
}