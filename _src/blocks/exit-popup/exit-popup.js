import { getMetadata } from "../../scripts/lib-franklin.js";
import { GLOBAL_V2_LOCALES, getLocale, getPriceLocalMapByLocale, getBuyLinkCountryPrefix } from '../../scripts/utils/utils.js';

function dynamicBuyLink (buyLinkSelector, prodName, ProdUsers, prodYears, pid = null) {
  if (!buyLinkSelector) {
    return null;
  }
  const url = new URL(window.location.href);
  let buyLinkPid = pid || url.searchParams.get('pid') || getMetadata('pid') || '';

  if (GLOBAL_V2_LOCALES.includes(getLocale())) {
    buyLinkPid = 'pid.global_v2';
  }

  const forceCountry = getPriceLocalMapByLocale().country_code;
  let buyLinkHref = new URL(`${getBuyLinkCountryPrefix()}/${prodName.trim()}/${ProdUsers}/${prodYears}/${buyLinkPid}?force_country=${forceCountry}`);
  buyLinkSelector.setAttribute('href', buyLinkHref);
  // return buyLinkHref;
}

// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  const parentSelector = block.closest('.section');
  const { product } = parentSelector.dataset;
  const url = new URL(window.location.href);
  const pid = url.searchParams.get('pid') || getMetadata('pid') || '';
  const productData = product ? product.split('/') : [];
  const [prodName, prodUsers, prodYears] = productData;
  const variant = `${prodUsers}u-${prodYears}y`;
  const buyLinkSelector = block.querySelector('p.button-container a');

  // create exit x element
  const existEl = document.createElement('span');
  existEl.id = 'exitAction';
  existEl.innerHTML = '<img src="/_src/icons/close_x.JPG" alt="Bitdefender">';
  parentSelector.appendChild(existEl);

  // add buyLink
  dynamicBuyLink(buyLinkSelector, prodName, prodUsers, prodYears, pid);

  // fetch product data
  const fetchProductData = async (prodName, variant, pid) => {
    const { fetchProduct } = await import('../../scripts/utils/utils.js');
    return await fetchProduct(prodName, variant, pid);
  };

  try {
    const fetchProduct = await fetchProductData(prodName, variant, pid);
    const { price, discount } = fetchProduct;
    const discountPercentage = Math.round((1 - discount.discounted_price / price) * 100);
    block.innerHTML = block.innerHTML.replace(/0%/g, `${discountPercentage}%`);
  } catch (error) {
    console.error('Error fetching product data:', error);
  }

  // exit action:
  // Constants for logic
  const POPUP_DISPLAY_LIMIT = 2;
  const POPUP_TIMEOUT_DAYS = 30;
  let popupDisplayCount = parseInt(localStorage.getItem('popupDisplayCount')) || 0;
  const lastPopupDate = parseInt(localStorage.getItem('lastPopupDate')) || 0;

  // Utility function to check if 30 days have passed
  function hasThirtyDaysPassed(lastDisplayDate) {
    const thirtyDaysInMs = POPUP_TIMEOUT_DAYS * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    return (now - lastDisplayDate) > thirtyDaysInMs;
  }

  // If 30 days have passed, reset the count
  if (lastPopupDate && hasThirtyDaysPassed(lastPopupDate)) {
    localStorage.removeItem('popupDisplayCount');
    localStorage.removeItem('lastPopupDate');
    popupDisplayCount = 0;  // Reset count for the session
  }

  // Mouseout event to display the popup
  document.addEventListener('mouseout', function(event) {
    // Check if popup can still be shown
    if (popupDisplayCount < POPUP_DISPLAY_LIMIT && event.clientY < 0 && parentSelector) {
      parentSelector.style.display = 'block';

      // add the count
      popupDisplayCount++;
      localStorage.setItem('popupDisplayCount', popupDisplayCount);

      // store last display time
      localStorage.setItem('lastPopupDate', new Date().getTime());
    }
  });

  // Close the popup
  if (existEl) {
    existEl.addEventListener('click', function() {
      const popup = document.querySelector('main .exit-popup-container');
      if (popup) popup.style.display = 'none';
    });
  }
}