import { createNanoBlock, createTag, openUrlForOs, renderNanoBlocks, wrapChildrenWithStoreContext } from "../../scripts/utils/utils.js";
// src/blocks/hero-aem/hero-aem.js
function createCardElementContainer(elements, mobileImage) {
	const cardElementContainer = document.createElement("div");
	cardElementContainer.classList.add("hero-aem__card");
	const cardElementText = document.createElement("div");
	cardElementText.classList.add("hero-aem__card-text");
	elements.forEach((sibling) => {
		if (mobileImage && sibling.contains(mobileImage)) cardElementContainer.appendChild(sibling);
		else cardElementText.appendChild(sibling);
	});
	cardElementContainer.appendChild(cardElementText);
	return cardElementContainer;
}
function createDropdownElement(paragraph, dropdownTagText, product) {
	let dropdownItems = paragraph.textContent.slice(1, -1).split(",").map((item) => item.trim());
	dropdownItems.shift();
	let dropdownContainer = document.createElement("div");
	dropdownContainer.classList.add("custom-dropdown-container");
	if (dropdownTagText) {
		let dropdownTagElement = document.createElement("div");
		dropdownTagElement.classList.add("custom-dropdown-tag");
		dropdownTagElement.textContent = dropdownTagText;
		dropdownContainer.appendChild(dropdownTagElement);
	}
	let dropdown = document.createElement("div");
	dropdown.classList.add("custom-dropdown");
	let dropdownButton = document.createElement("button");
	dropdownButton.classList.add("dropdown-button");
	dropdownButton.textContent = dropdownItems[0];
	dropdown.appendChild(dropdownButton);
	let dropdownOptions = document.createElement("div");
	dropdownOptions.classList.add("dropdown-options");
	dropdown.appendChild(dropdownOptions);
	dropdownItems.forEach((item, idx) => {
		let dropdownItem = document.createElement("div");
		dropdownItem.classList.add("custom-dropdown-item");
		const [prodName, prodUsers, prodYears] = product[idx].split("/");
		dropdownItem.textContent = item;
		dropdownItem.setAttribute("data-store-action", "");
		dropdownItem.setAttribute("data-store-set-id", `${prodName}`);
		dropdownItem.setAttribute("data-store-set-devices", prodUsers);
		dropdownItem.setAttribute("data-store-set-subscription", prodYears);
		dropdownOptions.appendChild(dropdownItem);
	});
	dropdownContainer.appendChild(dropdown);
	paragraph.replaceWith(dropdownContainer);
	dropdownButton.addEventListener("click", () => {
		let option = dropdownOptions.style.display === "block" ? "none" : "block";
		dropdownOptions.style.display = option;
		dropdownButton.classList.add("active");
	});
	const dropdownItemsNodes = dropdownOptions.querySelectorAll(".custom-dropdown-item");
	dropdownItemsNodes.forEach((item, index) => {
		item.addEventListener("click", function() {
			dropdownButton.textContent = this.textContent;
			dropdownOptions.style.display = "none";
			dropdownButton.classList.remove("active");
			dropdownItemsNodes.forEach((i) => i.classList.remove("selected"));
			this.classList.add("selected");
			const dex = document.querySelector(".dex-18076");
			if (dex) {
				const dropdownTag = dex.querySelector(".custom-dropdown-tag");
				const customDropdown = dex.querySelector(".custom-dropdown");
				if (index !== 0) {
					dropdownTag.style.display = "none";
					customDropdown.style.marginTop = "24px";
				} else {
					dropdownTag.style.display = "inline-block";
					customDropdown.style.marginTop = "0";
				}
			}
		});
	});
	document.addEventListener("click", (event) => {
		if (!dropdown.contains(event.target)) {
			dropdownOptions.style.display = "none";
			dropdownButton.classList.remove("active");
		}
	});
}
async function createPricesWebsites(buyLink, bluePillText, saveText, underPriceText, conditionText, trialDuration) {
	const pricesBox = document.createElement("div");
	pricesBox.classList.add("hero-aem__prices", "await-loader");
	pricesBox.innerHTML = `
          ${bluePillText ? `<p class="hero-aem__pill">${bluePillText}</p>` : ""}
          <div class="hero-aem__price mt-3">
            <div data-store-render data-store-hide="!it.option.price.discounted">
                <span class="prod-oldprice" data-store-render data-store-price="full"></span>
                <span class="prod-save">${saveText} {{=it.option.discount.value}}</span>
            </div>
            <div class="newprice-container mt-2">
              <span class="prod-newprice" data-store-render data-store-price="discounted||full"></span>
              <sup>${conditionText || ""}</sup>
            </div>
          </div>
          <p class="hero-aem__underPriceText">${underPriceText || ""}</p>`;
	buyLink.setAttribute("data-store-buy-link", trialDuration || "");
	buyLink.setAttribute("data-store-render", "");
	return pricesBox;
}
/**
* Nanoblock representing the price conditions below the Price
* @param text Conditions
* @returns Root node of the nanoblock
*/
function renderDevicesUsersText(text) {
	return createTag("div", { class: "devices-years-text" }, `<span>${text}</span>`);
}
createNanoBlock("devices-users-text", renderDevicesUsersText);
async function decorate(block, options) {
	const { product, conditionText, saveText, MacOS, Windows, Android, IOS, alignContent, height, type, dropdownProducts, bluePillText, underPriceText, dropdownTag, circleDiscount, signature, trialDuration } = block.closest(".section").dataset;
	renderNanoBlocks(block);
	if (options) {
		block = block.querySelector(".block");
		let blockParent = block.closest(".section");
		blockParent.classList.add("we-container");
		if (type) blockParent.classList.add(type);
	}
	let [richText, mainDesktopImage, richTextCard, columnsCard] = block.children;
	let pricesContainers = /* @__PURE__ */ new Map();
	let dropdownProductsArray = [];
	if (dropdownProducts) dropdownProductsArray = dropdownProducts.split(",").map((item) => item.trim());
	richText.classList.add("hero-aem__card__desktop", "col-md-6");
	if (alignContent === "center") richText.classList.add("hero-aem__card__desktop--center");
	if (height) Array.from(block.children).map((child) => {
		child.style.maxHeight = `${height}px`;
	});
	mainDesktopImage.classList.add("col-md-6");
	mainDesktopImage.children[0].classList.add("h-100");
	let mobileImage = block.querySelector(".hero-aem__card__desktop div > p > picture");
	if (mobileImage) mobileImage.classList.add("hero-aem__mobile-image");
	else mobileImage = "";
	if (circleDiscount) {
		const circleDiscountBox = document.createElement("div");
		circleDiscountBox.className = "circleDiscount";
		circleDiscountBox.innerHTML = `<p>${circleDiscount.replace(/0\s*%/g, "<span data-store-text-variable>{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}</span>")}</p>`;
		block.querySelector(".col-md-6:last-child").appendChild(circleDiscountBox);
	}
	const cardElementContainer = createCardElementContainer(Array.from(block.querySelectorAll("h1 ~ *")), mobileImage);
	if (product) {
		const [prodName, prodUsers, prodYears] = product.split("/");
		wrapChildrenWithStoreContext(cardElementContainer, {
			productId: prodName,
			devices: prodUsers,
			subscription: prodYears,
			storeEvent: "info"
		});
	}
	block.querySelector("h1")?.after(cardElementContainer);
	block.querySelector(".hero-aem > div > div > picture")?.classList.add("hero-aem__desktop-image");
	const buyLink = block.querySelector("a[href*=\"buylink\"]");
	if (product && !options) {
		let priceBox = await createPricesWebsites(buyLink, bluePillText, saveText, underPriceText, conditionText, trialDuration);
		const paragraphs = document.querySelectorAll("p");
		let insertPricesParagraph = null;
		paragraphs.forEach((paragraph) => {
			if (paragraph.textContent.includes("<insert-prices>")) insertPricesParagraph = paragraph;
		});
		if (insertPricesParagraph) insertPricesParagraph.replaceWith(priceBox);
		else buyLink.parentNode.parentNode.insertBefore(priceBox, buyLink.parentNode);
		pricesContainers.set(product, priceBox);
	}
	block.querySelectorAll("p").forEach((paragraph) => {
		if (paragraph.textContent.toLowerCase().includes("dropdown")) createDropdownElement(paragraph, dropdownTag, dropdownProductsArray);
	});
	let tables = block.querySelectorAll("table");
	for (const listTable of tables) {
		if (listTable && listTable.textContent.includes("benefit_list")) {
			listTable.classList.add("benefit_list");
			listTable.deleteRow(0);
		}
		if (listTable && listTable.textContent.includes("ratings")) {
			listTable.classList.add("ratings");
			listTable.deleteRow(0);
			const { decorateButtons } = await import("../../scripts/lib-franklin.js");
			decorateButtons(listTable);
		}
	}
	let freeDownloadButton = block.querySelector("a[href*=\"#free-download\"]");
	if (freeDownloadButton) {
		freeDownloadButton.classList.add("button", "free-download");
		openUrlForOs(MacOS, Windows, Android, IOS, freeDownloadButton);
	}
	if (columnsCard) {
		const columnsCardChildren = Array.from(columnsCard.children);
		const cardElement = document.createElement("div");
		cardElement.classList.add("aem-two-cards");
		const columnWidthMdClass = columnsCardChildren.length === 2 ? "col-md-6" : "col-md-4";
		const columnWidthLgClass = columnsCardChildren.length === 2 ? "col-lg-3" : "col-lg-3";
		const columnCardsHtml = columnsCardChildren.map((col) => `
      <div class="col-12 ${columnWidthMdClass} ${columnWidthLgClass}">
        <div class="aem-two-cards_card">
          ${col.innerHTML}
        </div>
      </div>`).join("");
		cardElement.innerHTML = `
      <div class="row justify-space-between">
        <div class="col-lg-3">
          ${richTextCard.innerHTML}
        </div>
        ${columnCardsHtml}
      </div>
    `;
		block.appendChild(cardElement);
		richTextCard.innerHTML = "";
		columnsCardChildren.forEach((col) => col.remove());
	}
	if (block.querySelector(".hero-aem-container .hero-aem .hero-aem__card-text p:last-child")) {}
	if (signature) {
		const signatureElement = createTag("div", { class: "signature" });
		signatureElement.textContent = signature;
		block.querySelector("h1")?.before(signatureElement);
	}
}
export { decorate as default };
