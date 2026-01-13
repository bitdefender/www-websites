import { target } from '../../scripts/target.js';
import { ProductInfo, Store } from '../../scripts/libs/store/store.js';
// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  const parentSelector = block.closest('.section');
  const { product, custompid } = parentSelector.dataset;

  if (product) {
    const [alias, devices, years] = product.split(',');
    // eslint-disable-next-line no-undef
    const exitPopupPromotion = (await target.getOffers({ mboxNames: 'exitPopupPid-mbox' }))?.promotion;
    const products = await Store.getProducts([new ProductInfo(alias, 'consumer', exitPopupPromotion || custompid, true)]);
    const productItem = products[alias];
    const productCurrency = productItem.currency;
    const productRegionId = productItem.regionId;
    const variation = productItem.getOption(Number(devices), Number(years));
    const percentPrice = variation.getDiscount('percentage');
    const newPrice = variation.priceDiscounted;
    const oldPrice = variation.price;

    // discount in the title
    const tileDiscountEl = block.querySelector('h5');
    if (tileDiscountEl) tileDiscountEl.innerHTML = tileDiscountEl.innerHTML.replace(/50\s?%/, `${percentPrice}%`);

    // buy button
    const buyBtnEl = block.querySelector('p.button-container a');
    if (buyBtnEl) {
      buyBtnEl.textContent = buyBtnEl.textContent.replace(/50\s?%/, `${percentPrice}%`);
      buyBtnEl.setAttribute('href', await variation.getStoreUrl());
      buyBtnEl.setAttribute('data-product', alias);
      buyBtnEl.setAttribute('data-buy-price', newPrice);
      buyBtnEl.setAttribute('data-old-price', oldPrice);
      buyBtnEl.setAttribute('data-currency', productCurrency);
      buyBtnEl.setAttribute('data-region', productRegionId);
      buyBtnEl.setAttribute('data-variation', `${devices}u-${years}y`);
    }
  }

  // exit element: x
  const exitEl = document.createElement('span');
  exitEl.id = 'exit-action';
  exitEl.innerHTML = '<img src="/_src/icons/close_x.JPG" alt="Bitdefender">';
  block.appendChild(exitEl);

  // popup configuration:
  const POPUP_DISPLAY_LIMIT = 2;
  const POPUP_TIMEOUT_DAYS = 30;
  let popupDisplayCount = parseInt(localStorage.getItem('popupDisplayCount') || 0, 10);
  const lastPopupDate = parseInt(localStorage.getItem('lastPopupDate') || 0, 10);

  // if 30 days have passed
  function hasThirtyDaysPassed(lastDisplayDate) {
    const thirtyDaysInMs = POPUP_TIMEOUT_DAYS * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return now - lastDisplayDate > thirtyDaysInMs;
  }

  // reset count if 30 days have passed
  if (lastPopupDate && hasThirtyDaysPassed(lastPopupDate)) {
    localStorage.removeItem('popupDisplayCount');
    localStorage.removeItem('lastPopupDate');
    popupDisplayCount = 0; // Reset count for the session
  }

  // event: mouseout -> display the popup
  document.addEventListener('mouseout', (event) => {
    if (popupDisplayCount < POPUP_DISPLAY_LIMIT && event.clientY < 0 && parentSelector) {
      parentSelector.style.display = 'block';
      document.dispatchEvent(new Event('exit_popup_display'));
      window.exit_popup_display = true;

      // add to the count
      popupDisplayCount += 1;
      localStorage.setItem('popupDisplayCount', popupDisplayCount.toString());

      // last display time
      localStorage.setItem('lastPopupDate', Date.now().toString());
    }
  });

  // Close the popup: x-icon + background
  const closePopup = () => {
    const popup = document.querySelector('main .exit-popup-container');
    if (popup) popup.style.display = 'none';
  };

  if (exitEl) exitEl.addEventListener('click', closePopup);
  parentSelector.addEventListener('click', closePopup);
}
