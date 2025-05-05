import Target from "@repobit/dex-target";
import { Constants } from "@repobit/dex-utils";
import { User } from "@repobit/dex-utils";
import page from "../page.js";
import { PageLoadStartedEvent, UserDetectedEvent, ButtonClickEvent, PageErrorEvent, AdobeDataLayerService, ProductLoadedEvent } from "@repobit/dex-data-layer";
import {
  getTargetExperimentDetails,
  getExperimentDetails,
  generatePageLoadStartedName,
  getCampaignBasedOnLocale,
  getUrlPromotion,
  getProductFinding,
  getMetadata,
} from '../utils/utils.js';

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
 * Resolve the data layer
 */
export const resolveNonProductsDataLayer = async () => {
  const pageLoadStartedEvent = new PageLoadStartedEvent(
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
  );

  AdobeDataLayerService.push(pageLoadStartedEvent);
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

  // send cdp data
  try {
    await fetch(
      `${Constants.PUBLIC_URL_ORIGIN}/cdp/`,
      {
        method: 'POST',
        body: JSON.stringify({
          mcvisid: (await Target.visitorInfo)?.identity?.ECID || '',
          ...pageLoadStartedEvent.page
        })
      }
    );
  } catch (e) {
    console.warn(e);
  }
}