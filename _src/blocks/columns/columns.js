import { addScript, createTag, matchHeights, renderNanoBlocks, wrapChildrenWithStoreContext } from "../../scripts/utils/utils.js";
import { UserAgent, debounce } from "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, ButtonClickEvent } from "../../vendor/repobit/dex-data-layer.js";
// src/blocks/columns/columns.js
function getItemsToShow() {
	return window.innerWidth <= 767 ? 1 : 3;
}
function countSlides(carouselContent) {
	return Math.ceil(carouselContent.children.length - getItemsToShow() + 1);
}
function showSlides(carousel, slideNumber) {
	const carouselContent = carousel.querySelector(".columns.carousel > div:first-child");
	const itemsToShow = getItemsToShow();
	const translateXValue = -(carousel.clientWidth * slideNumber) / itemsToShow;
	carouselContent.style.transform = `translateX(${translateXValue}px)`;
	carouselContent.style.transition = "transform 0.5s ease";
}
function hideExcessElements(carousel) {
	showSlides(carousel, 0);
}
function setActiveButton(button, buttonsWrapper) {
	buttonsWrapper.querySelector(".active-button")?.classList.remove("active-button");
	button.classList.add("active-button");
}
function createNavigationButtons(numberOfSlides, carousel) {
	const buttonsWrapper = document.createElement("div");
	buttonsWrapper.className = "carousel-buttons";
	Array.from({ length: numberOfSlides }, (_, i) => {
		const button = document.createElement("button");
		button.setAttribute("aria-label", `Slide ${i + 1}`);
		button.addEventListener("click", () => {
			if (!button.classList.contains("active-button")) {
				showSlides(carousel, i);
				setActiveButton(button, buttonsWrapper);
			}
		});
		buttonsWrapper.appendChild(button);
		return button;
	});
	buttonsWrapper.firstChild?.classList.add("active-button");
	return buttonsWrapper;
}
function setupCarousel(carousel, resetSlidePosition = false) {
	const carouselContent = carousel.querySelector(".columns.carousel > div");
	if (resetSlidePosition) carouselContent.style.transform = "translateX(0px)";
	const buttonsWrapper = createNavigationButtons(countSlides(carouselContent), carousel);
	carousel.querySelector(".carousel-buttons")?.remove();
	carousel.appendChild(buttonsWrapper);
	hideExcessElements(carousel);
}
function setImageAsBackgroundImage() {
	document.querySelectorAll(".columns.text-over-image > div > div").forEach((column) => {
		const image = column.querySelector("img");
		if (image) {
			const src = image.getAttribute("src");
			column.style.backgroundImage = `url(${src})`;
			const pContainer = image.closest("p");
			if (pContainer) pContainer.remove();
		}
	});
}
function setDynamicLink(dynamicLink, dynamicLinks, dynamicProducts) {
	switch (UserAgent.os) {
		case "android":
			dynamicLink.href = dynamicLinks.androidLink ?? dynamicLinks.defaultLink;
			if (dynamicProducts.storeIdAndroid) AdobeDataLayerService.push(new ButtonClickEvent("trial downloaded", { productId: dynamicProducts.storeIdAndroid }));
			break;
		case "ios":
			dynamicLink.href = dynamicLinks.iosLink ?? dynamicLinks.defaultLink;
			if (dynamicProducts.storeIdIos) AdobeDataLayerService.push(new ButtonClickEvent("trial downloaded", { productId: dynamicProducts.storeIdIos }));
			break;
		case "Windows":
			dynamicLink.href = dynamicLinks.windowsLink ?? dynamicLinks.defaultLink;
			break;
		case "Mac/iOS":
			dynamicLink.href = dynamicLinks.macosLink ?? dynamicLinks.defaultLink;
			break;
		default:
			dynamicLink.href = dynamicLinks.defaultLink;
			if (dynamicProducts.storeId) AdobeDataLayerService.push(new ButtonClickEvent("trial downloaded", { productId: dynamicProducts.storeId }));
	}
}
var slug = (s) => s?.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "tab";
function setupTabs({ block, firstTab }) {
	const section = block.closest(".section");
	const wrapper = block.closest(".columns-wrapper");
	const label = wrapper.previousElementSibling?.closest(".default-content-wrapper")?.textContent?.trim() || "Tab";
	const id = slug(label);
	section.classList.add("columns-tabs");
	if (!section.classList.contains("hide-tabs")) {
		let tabsList = section.querySelector(".tabs-section");
		if (!tabsList) {
			tabsList = document.createElement("div");
			tabsList.className = "tabs-section default-content-wrapper";
			tabsList.addEventListener("click", (e) => {
				const tab = e.target.closest("span[data-tab]");
				if (tab && tab && tab.dataset?.tab) {
					const showAll = tab.dataset.tab === firstTab.toLowerCase();
					section.querySelectorAll(".section-el").forEach((el) => {
						el.hidden = !showAll && !el.classList.contains(`section-${tab.dataset.tab}`);
					});
					tabsList.querySelectorAll("span").forEach((el) => {
						el.classList.toggle("active", el === tab);
					});
					AdobeDataLayerService.push(new ButtonClickEvent("click", { asset: tab.dataset.tab }));
				}
			});
			const all = document.createElement("span");
			all.className = "tag active";
			all.dataset.tab = firstTab.toLowerCase();
			all.textContent = firstTab;
			tabsList.appendChild(all);
			section.prepend(tabsList);
		}
		const tab = document.createElement("span");
		tab.className = "tag";
		tab.dataset.tab = id;
		tab.textContent = label;
		tabsList.appendChild(tab);
	}
	wrapper.classList.add("section-el", `section-${id}`);
	wrapper.previousElementSibling?.classList.add("section-el", `section-${id}`);
}
function initLottieAnimations(block) {
	const marqueeEl = block.querySelector(".marquee");
	if (marqueeEl) lottie.loadAnimation({
		container: marqueeEl,
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "/_src/scripts/vendor/lottie/marquee-data.json"
	});
	const dnsEl = block.querySelector(".dns");
	if (dnsEl) lottie.loadAnimation({
		container: dnsEl,
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "/_src/scripts/vendor/lottie/dns-data.json"
	});
	const dnsBgEl = block.querySelector(".dns-background");
	if (dnsBgEl) lottie.loadAnimation({
		container: dnsBgEl,
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "/_src/scripts/vendor/lottie/dns-background-data.json"
	});
}
var count = 0;
function decorate(block) {
	const parentSection = block.closest(".section");
	const { linksOpenInNewTab, type, bckImage, firstTab, maxElementsInColumn, products, aliases, defaultLink, iosLink, androidLink, windowsLink, macosLink, storeId, storeIdIos, storeIdAndroid, seeMoreBtn, signature, trialDuration } = parentSection.dataset;
	const cols = [...block.firstElementChild.children];
	block.classList.add(`columns-${cols.length}-cols`);
	if (bckImage) {
		block.style.backgroundImage = `url("${bckImage}")`;
		block.style.backgroundRepeat = "no-repeat";
		block.style.backgroundPosition = "right";
		block.style.backgroundSize = "auto 100%";
	}
	[...block.children].forEach((row, idxRow) => {
		[...row.children].forEach((col) => {
			const pic = col.querySelector("picture");
			if (pic) {
				const picWrapper = pic.closest("div");
				if (picWrapper && picWrapper.children.length === 1) picWrapper.classList.add("columns-img-col", "columns-col");
			} else {
				const children = [...row.children];
				if (children.length === 1) col.closest("div").classList.add("columns-title-col", "columns-col");
				else {
					const firstParentIndex = children.indexOf(col.closest("div"));
					col.closest("div").classList.add("columns-text-col", "columns-col");
					if (firstParentIndex) col.closest("div").classList.add("columns-right-col", "columns-col");
					else col.closest("div").classList.add("columns-left-col", "columns-col");
				}
			}
			renderNanoBlocks(col, void 0, idxRow);
		});
	});
	const productsAsList = products?.split(",");
	const trialDurations = trialDuration?.split(",")?.map((t) => t.trim()) || [];
	if (productsAsList) [...block.children].forEach((row, _) => {
		[...row.children].forEach((col, colNumber) => {
			const [prodName, prodYears, prodUsers] = productsAsList[colNumber].trim().split("/");
			wrapChildrenWithStoreContext(col, {
				productId: prodName,
				devices: prodUsers,
				subscription: prodYears,
				storeEvent: ""
			});
			col.querySelector("a[href*=\"#buylink\"]")?.setAttribute("data-store-buy-link", trialDurations[colNumber] || "");
			col.querySelector("a[href*=\"#buylink\"]")?.setAttribute("data-store-render", "");
		});
	});
	aliases?.split(",").forEach((alias, i) => {
		[...block.children].forEach((row) => {
			const buttonModal = row.children[i]?.querySelector("a.button.modal");
			buttonModal?.setAttribute("product-id", alias.trim());
			buttonModal?.setAttribute("data-store-id", alias.trim());
		});
	});
	if (linksOpenInNewTab === "true") block.querySelectorAll(".button-container a").forEach((anchorEl) => {
		anchorEl.target = "_blank";
		anchorEl.rel = "noopener noreferrer";
	});
	if (block.classList.contains("text-over-image")) setImageAsBackgroundImage();
	if (block.classList.contains("carousel")) setupCarousel(block);
	window.addEventListener("resize", debounce(() => {
		if (block.classList.contains("carousel")) setupCarousel(block, true);
	}, 250));
	window.dispatchEvent(new Event("resize"));
	const sectionDiv = document.querySelector(".columns-container[data-bg-image]");
	if (sectionDiv) {
		const bgImageUrl = sectionDiv.getAttribute("data-bg-image");
		if (bgImageUrl) sectionDiv.style.setProperty("--bg-image-url", `url(${bgImageUrl})`);
	}
	if (type && type === "video_left") {
		parentSection.classList.add("video-left");
		const leftCol = block.querySelector(".columns-img-col");
		const cell = leftCol.querySelector("tr:last-of-type");
		if (!cell) return;
		const raw = cell.innerHTML;
		const decoded = (() => {
			const t = document.createElement("textarea");
			t.innerHTML = raw;
			return t.value;
		})();
		const temp = document.createElement("div");
		temp.innerHTML = decoded;
		const iframe = temp.querySelector("iframe");
		if (iframe && iframe.src.includes("youtube.com/embed")) {
			const id = iframe.src.match(/\/embed\/([^?]+)/)?.[1];
			if (!id) return;
			leftCol.innerHTML = `
        <div class="yt-preview">
          <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="Bitdefender">
          <button class="yt-play-btn">Play</button>
        </div>
      `;
			leftCol.firstElementChild.onclick = () => {
				iframe.src += iframe.src.includes("?") ? "&autoplay=1" : "?autoplay=1";
				leftCol.innerHTML = "";
				leftCol.appendChild(iframe);
			};
			return;
		}
		const videoPath = cell.innerText.trim();
		if (/\.(mp4|webm|ogg)$/i.test(videoPath)) {
			const poster = leftCol.querySelector("img")?.src || "";
			leftCol.innerHTML = `
        <video
          src="${videoPath}"
          controls
          playsinline
          ${poster ? `poster="${poster}"` : ""}>
        </video>
      `;
			return;
		}
		leftCol.innerHTML = decoded;
	}
	if (parentSection.classList.contains("chat-options")) {
		block.querySelectorAll(".columns > div > div").forEach((card) => {
			const buttonContainer = card.querySelector(".button-container");
			if (!buttonContainer) return;
			buttonContainer.previousElementSibling.classList.add("chat-options-text");
			buttonContainer.querySelector("a").addEventListener("click", () => {
				const h4Title = card?.querySelector("h4").textContent || "";
				window.adobeDataLayer.push(new ButtonClickEvent("click", { asset: `chat on ${h4Title.trim().toLowerCase()}` }));
			});
		});
		matchHeights(block, ".chat-options-text");
		matchHeights(block, "table");
	}
	block.querySelectorAll("h3")?.forEach((element) => {
		if (element.textContent.includes("{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}")) {
			element.innerHTML = element.innerHTML.replace("{GLOBAL_BIGGEST_DISCOUNT_PERCENTAGE}", "{{=it.state.discount.percentage.max}}");
			element.classList.add("await-loader");
		}
	});
	const dynamicLink = parentSection.querySelector("a[href*=\"#os-dynamic-link\"]");
	if (dynamicLink) setDynamicLink(dynamicLink, {
		defaultLink,
		iosLink,
		androidLink,
		windowsLink,
		macosLink
	}, {
		storeId,
		storeIdAndroid,
		storeIdIos
	});
	if (parentSection.classList.contains("v-5") && maxElementsInColumn) {
		let cards = block.querySelectorAll(".columns-text-col");
		if (block.classList.contains("cards-with-img")) cards = block.querySelectorAll(".columns > div > div");
		cards.forEach((element) => {
			element.style["grid-row"] = `span ${maxElementsInColumn}`;
		});
		matchHeights(block, ".columns-container.v-5 .columns-wrapper .columns > div > div img");
	}
	if (type && type === "tabs") setupTabs({
		block,
		firstTab
	});
	if (seeMoreBtn) {
		const [seeMoreText, seeLessText, itemsNoRaw] = seeMoreBtn.split("|");
		const itemsNo = parseInt(itemsNoRaw, 10);
		const items = Array.from(block.children);
		items.slice(itemsNo).forEach((item) => {
			item.style.display = "none";
		});
		if (items.length > itemsNo) {
			const btnSeeMore = document.createElement("button");
			btnSeeMore.className = "load-more";
			btnSeeMore.innerText = seeMoreText.trim();
			let expanded = false;
			btnSeeMore.addEventListener("click", () => {
				expanded = !expanded;
				if (expanded) {
					items.slice(itemsNo).forEach((item) => {
						item.style.display = "";
					});
					btnSeeMore.innerText = seeLessText.trim();
				} else {
					items.slice(itemsNo).forEach((item) => {
						item.style.display = "none";
					});
					btnSeeMore.innerText = seeMoreText.trim();
				}
			});
			block.closest(".columns-wrapper").appendChild(btnSeeMore);
		}
	}
	if (block.classList.contains("sidebar")) {
		const videoP = cols[1].querySelector("p");
		const content = videoP.innerText;
		if (content.startsWith("https://www.youtube.com/embed/")) {
			videoP.classList.add("iframe");
			cols[1].querySelector("p").innerHTML = `<iframe width="100%" height="232" src="${content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
		}
	}
	if (parentSection.classList.contains("columns-as-tabs")) {
		count += 1;
		const firstColumnPrev = parentSection.querySelectorAll("div.columns-wrapper:first-of-type .columns-text-col");
		if (count === 1 && firstColumnPrev) firstColumnPrev[0].classList.add("active");
		if (count === 2) {
			const columnsIcons = block.querySelectorAll(".columns-col");
			const firstColumnsIcon = columnsIcons[0];
			if (firstColumnsIcon) firstColumnsIcon.classList.add("active");
			columnsIcons.forEach((item, k) => {
				item.addEventListener("click", () => {
					columnsIcons.forEach((icon) => icon.classList.remove("active"));
					item.classList.add("active");
					firstColumnPrev.forEach((prev) => prev.classList.remove("active"));
					if (firstColumnPrev[k]) firstColumnPrev[k].classList.add("active");
				});
			});
		}
	}
	if (signature && block.classList.contains("creators-banner")) {
		const signatureElement = createTag("div", { class: "signature" });
		signatureElement.textContent = signature;
		document.querySelector("div.creators-banner div div:first-child").prepend(signatureElement);
	}
	matchHeights(block, "h3");
	matchHeights(block, "h4");
	if (parentSection.classList.contains("dex-carousel-cards")) {
		matchHeights(block, "div > div:not(:first-of-type) p:first-of-type");
		matchHeights(block, "div > div:not(:first-of-type) ul");
	}
	matchHeights(block, "div > div > p:first-of-type > strong");
	if (block.classList.contains("text-over-image")) matchHeights(block, ".columns > div > div");
	if (parentSection.classList.contains("multi-blocks")) {
		matchHeights(parentSection, ".columns");
		matchHeights(parentSection, "table");
		matchHeights(parentSection, "p:nth-last-of-type(2)");
		matchHeights(parentSection, ".columns > div");
	}
	if (parentSection.classList.contains("fix-tables-heights")) {
		matchHeights(block, "div.columns-text-col > table:nth-of-type(1)");
		matchHeights(block, "div.columns-text-col > table:nth-of-type(2)");
	}
	if (block.classList.contains("awards-fragment")) matchHeights(block, "p:last-of-type");
	if (parentSection.classList.contains("responsible-ai")) {
		if (block.classList.contains("anchor-cards")) block.querySelectorAll(".columns > div > div").forEach((card) => {
			const anchorCard = document.createElement("a");
			anchorCard.classList.add("card");
			anchorCard.href = card.querySelector("a")?.href || "#";
			anchorCard.innerHTML = card.innerHTML;
			card.replaceWith(anchorCard);
		});
		matchHeights(block, "p:first-of-type");
		matchHeights(block, "p:nth-of-type(2)");
		matchHeights(block, ".columns > div > div");
	}
	if (parentSection.classList.contains("online-safe-animated")) block.querySelector("span.icon-online-safe-animated").closest("p").innerHTML = `<div id="lottieAnimation" class="security-window">
      <div class="security-window__header">
        <span class="security-window__dot security-window__dot--red"></span>
        <span class="security-window__dot security-window__dot--yellow"></span>
        <span class="security-window__dot security-window__dot--green"></span>
      </div>
      <div class="security-window__body">
         <div id="dns" class="dns lottie-container  mask">
           <div class="dns-background" class="lottie-container mask"></div>
         </div>
          <div class="marquee-wrap">
            <div class="marquee"></div>
          </div>
      </div>
    </div>
    
    <style>
      #lottieAnimation.security-window {
        max-height: 266px;
        overflow: hidden;
        border-radius: 14px;
        background: #0a3d91;
        margin-top: 2em;
      }

      #lottieAnimation .security-window__header {
        height: 36px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #063a86;
      }

      #lottieAnimation .security-window__dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      #lottieAnimation .security-window__dot--red {
        background: #ff5f56;
      }

      #lottieAnimation .security-window__dot--yellow {
        background: #ffbd2e;
      }

      #lottieAnimation .security-window__dot--green {
        background: #27c93f;
      }

      #lottieAnimation .security-window__body {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 40px;
        flex-direction: column;
        background: linear-gradient(135deg,
            #0a4fb3 0%,
            #1b6fe0 50%,
            #1f82ff 100%);
      }

      #lottieAnimation .dns {
        height: 150px;
      }

      #lottieAnimation .dns-background {
        top: 0;
        svg {
          width: 100px;
        }
        position: absolute;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 100%);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
      }

      #lottieAnimation .dns svg {
        width: 230px !important;
      }

      #lottieAnimation .marquee svg {
        width: 940px !important;
      }

      #lottieAnimation .marquee-gradient {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 100%);
        mix-blend-mode: multiply;
        opacity: 0.9;
      }

      #lottieAnimation .marquee-wrap {
        position: relative;
        height: auto;
        margin-top: 1em;
      }

      #lottieAnimation .marquee {
        width: 100%;
        height: 100%;
        -webkit-mask-image: linear-gradient(180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 100%);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-image: linear-gradient(180deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 100%);
        mask-repeat: no-repeat;
        mask-size: 100% 100%;
      }

      #lottieAnimation .marquee svg {
        width: 100%;
        height: 100%;
      }
    </style>
    `;
	addScript("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js", {}, "defer", () => {
		if (typeof window.lottie !== "undefined") initLottieAnimations(block);
	}, "module");
	if (block.classList.contains("scam-protection")) {
		const statsObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.querySelectorAll("h1", "h6").forEach((stat) => {
					const originalText = stat.textContent.trim();
					const normalized = originalText.replace(/[^0-9.,\s]/g, "").replace(/\s/g, "").replace(/,/g, ".").replace(/(\.\d*)\./g, "$1");
					const numericValue = parseFloat(normalized);
					if (Number.isNaN(numericValue)) return;
					stat.setAttribute("data-original", originalText);
					let current = 0;
					const increment = numericValue / 100;
					const animation = setInterval(() => {
						current += increment;
						if (current >= numericValue) {
							stat.textContent = originalText;
							clearInterval(animation);
							return;
						}
						const lower = originalText.toLowerCase();
						const suffixes = {
							trillion: [
								"trillion",
								"billón",
								"billion",
								"兆",
								"B"
							],
							billion: [
								"billion",
								"milliard",
								"mil millones",
								"亿"
							],
							million: [
								"million",
								"millón",
								"百万",
								"M"
							]
						};
						const formatValue = (num) => new Intl.NumberFormat(void 0, { maximumFractionDigits: 3 }).format(num);
						let matchedWord = null;
						Object.entries(suffixes).some(([, words]) => words.some((word) => {
							if (lower.includes(word.toLowerCase())) {
								matchedWord = word;
								return true;
							}
							return false;
						}));
						let formatted = formatValue(current);
						if (matchedWord) formatted = `${formatted} ${matchedWord}`;
						stat.textContent = formatted;
					}, 20);
				});
				statsObserver.unobserve(entry.target);
			});
		}, { threshold: .2 });
		statsObserver.observe(parentSection);
		matchHeights(parentSection, "h1");
	}
}
export { decorate as default };
