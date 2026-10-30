import { target } from "../../scripts/target.js";
import { ProductInfo, Store } from "../../scripts/libs/store/store.js";
// src/blocks/exit-popup/exit-popup.js
async function decorate(block) {
	const parentSelector = block.closest(".section");
	const { product, custompid } = parentSelector.dataset;
	if (product) {
		const [alias, devices, years] = product.split(",");
		const exitPopupPromotion = (await target.getOffers({ mboxNames: "exitPopupPid-mbox" }))?.promotion;
		const productItem = (await Store.getProducts([new ProductInfo(alias, "consumer", exitPopupPromotion || custompid, true)]))[alias];
		const productCurrency = productItem.currency;
		const productRegionId = productItem.regionId;
		const variation = productItem.getOption(Number(devices), Number(years));
		const percentPrice = variation.getDiscount("percentage");
		const newPrice = variation.priceDiscounted;
		const oldPrice = variation.price;
		const tileDiscountEl = block.querySelector("h5");
		if (tileDiscountEl) tileDiscountEl.innerHTML = tileDiscountEl.innerHTML.replace(/50\s?%/, `${percentPrice}%`);
		const buyBtnEl = block.querySelector("p.button-container a");
		if (buyBtnEl) {
			buyBtnEl.textContent = buyBtnEl.textContent.replace(/50\s?%/, `${percentPrice}%`);
			buyBtnEl.setAttribute("href", await variation.getStoreUrl());
			buyBtnEl.setAttribute("data-product", alias);
			buyBtnEl.setAttribute("data-buy-price", newPrice);
			buyBtnEl.setAttribute("data-old-price", oldPrice);
			buyBtnEl.setAttribute("data-currency", productCurrency);
			buyBtnEl.setAttribute("data-region", productRegionId);
			buyBtnEl.setAttribute("data-variation", `${devices}u-${years}y`);
			buyBtnEl.setAttribute("title", `${buyBtnEl.textContent.replace(/50\s?%/, `${percentPrice}%`)}`);
		}
	}
	const exitEl = document.createElement("span");
	exitEl.id = "exit-action";
	exitEl.innerHTML = "<img src=\"/_src/icons/close_x.JPG\" alt=\"Bitdefender\">";
	block.appendChild(exitEl);
	const POPUP_DISPLAY_LIMIT = 2;
	let popupDisplayCount = parseInt(localStorage.getItem("popupDisplayCount") || 0, 10);
	const lastPopupDate = parseInt(localStorage.getItem("lastPopupDate") || 0, 10);
	function hasThirtyDaysPassed(lastDisplayDate) {
		return Date.now() - lastDisplayDate > 2592e6;
	}
	if (lastPopupDate && hasThirtyDaysPassed(lastPopupDate)) {
		localStorage.removeItem("popupDisplayCount");
		localStorage.removeItem("lastPopupDate");
		popupDisplayCount = 0;
	}
	document.addEventListener("mouseout", (event) => {
		if (popupDisplayCount < POPUP_DISPLAY_LIMIT && event.clientY < 0 && parentSelector) {
			parentSelector.style.display = "block";
			document.dispatchEvent(new Event("exit_popup_display"));
			window.exit_popup_display = true;
			popupDisplayCount += 1;
			localStorage.setItem("popupDisplayCount", popupDisplayCount.toString());
			localStorage.setItem("lastPopupDate", Date.now().toString());
		}
	});
	const closePopup = () => {
		const popup = document.querySelector("main .exit-popup-container");
		if (popup) popup.style.display = "none";
	};
	if (exitEl) exitEl.addEventListener("click", closePopup);
	parentSelector.addEventListener("click", closePopup);
}
export { decorate as default };
