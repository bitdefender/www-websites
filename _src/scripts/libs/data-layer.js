import { target } from "../target.js";
import { User } from "@repobit/dex-utils";
import page from "../page.js";
import { PageLoadStartedEvent, UserDetectedEvent, ButtonClickEvent, PageErrorEvent, AdobeDataLayerService, ProductLoadedEvent } from "@repobit/dex-data-layer";
import {
  getExperimentDetails,
  generatePageLoadStartedName,
  getCampaignBasedOnLocale,
  getUrlPromotion,
  getProductFinding,
  getMetadata,
} from '../utils/utils.js';
import { getTargetExperimentDetails } from "../target.js";

export class FranklinProductsLoadedEvent extends ProductLoadedEvent{
  getOptionInfo(option) {
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
    AdobeDataLayerService.push(new FranklinProductsLoadedEvent({
      ID: '8430',
    }, 'info'));
  }
}

/**
 * push the pageLoadStartedEvent
 * and send data to CDP
 */
const resolvePageLoadStartedEvent = async () => {
  // push the pageLoadStartedEvent to the Adobe Data Layer
  AdobeDataLayerService.push(new PageLoadStartedEvent(
    page,
    {
      name: generatePageLoadStartedName(),
      experimentDetails: (await getTargetExperimentDetails()) ?? getExperimentDetails(),
      geoRegion: await User.country,
      serverName: 'hlx.live', // indicator for AEM Success Edge
    },
    {
      promotionID: (await target.configMbox)?.promotion
        || getUrlPromotion()
        || getMetadata('pid')
        || getCampaignBasedOnLocale()
        || '',
      internalPromotionID: page.getParamValue('icid') || '',
      trackingID: page.getParamValue('cid') || '',
    },
  ));
};

/**
 * push the userDetectedEvent to the Data Layer
 */
const resolveUserDetectedEvent = async () => {
  AdobeDataLayerService.push(new UserDetectedEvent(
    page,
    {
      ID: await User.fingerprint,
      productFinding: getProductFinding()
    }
  ));
};

/**
 * Resolve the data layer
 */
export const resolveNonProductsDataLayer = async () => {
  await resolvePageLoadStartedEvent();
  pageErrorHandling();
  await resolveUserDetectedEvent();
  checkClickEventAfterRedirect();
  getFreeProductsEvents();
}