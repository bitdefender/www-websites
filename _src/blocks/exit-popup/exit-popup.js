// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
  const parentSelector = block.closest('.section');
  const { product, custompid } = parentSelector.dataset;
  const [alias, variant] = product.split(',');

  block.setAttribute('data-store-context', '');
  block.setAttribute('data-store-id', alias);
  block.setAttribute('data-store-department', 'consumer');
  block.setAttribute('data-store-option', variant);

  // add custom pid
  if (custompid) {
    block.setAttribute('data-store-promotion', custompid);
  }

  // config percennt from title
  const tileDiscountEl = block.querySelector('h5');
  if (tileDiscountEl) tileDiscountEl.setAttribute('data-store-text-variable', '');

  // config buy btn
  const buyBtnEl = block.querySelector('p.button-container a');
  if (buyBtnEl) {
    buyBtnEl.setAttribute('data-store-buy-link', '');
    buyBtnEl.querySelector('span').setAttribute('data-store-text-variable', '');
    buyBtnEl.setAttribute('title', 'Bitdefender');
  }

  // create exit x element
  const existEl = document.createElement('span');
  existEl.id = 'exit-action';
  existEl.innerHTML = '<img src="/_src/icons/close_x.JPG" alt="Bitdefender">';
  parentSelector.appendChild(existEl);

  // exit action:
  // Constants for logic
  const POPUP_DISPLAY_LIMIT = 2;
  const POPUP_TIMEOUT_DAYS = 30;
  let popupDisplayCount = localStorage.getItem('popupDisplayCount') || 0;
  const lastPopupDate = localStorage.getItem('lastPopupDate') || 0;

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
    popupDisplayCount = 0; // Reset count for the session
  }

  // Mouseout event to display the popup
  document.addEventListener('mouseout', (event) => {
    // Check if popup can still be shown
    if (popupDisplayCount < POPUP_DISPLAY_LIMIT && event.clientY < 0 && parentSelector) {
      parentSelector.style.display = 'block';

      // add the count
      popupDisplayCount += 1;
      localStorage.setItem('popupDisplayCount', popupDisplayCount);

      // store last display time
      localStorage.setItem('lastPopupDate', new Date().getTime());
    }
  });

  // Close the popup
  if (existEl) {
    existEl.addEventListener('click', () => {
      const popup = document.querySelector('main .exit-popup-container');
      if (popup) popup.style.display = 'none';
    });
  }
}
