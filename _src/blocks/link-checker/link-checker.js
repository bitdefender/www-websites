import page_default from "../../scripts/page.js";
import { BotPrevention } from "../../scripts/utils/bot-prevention.js";
import { UserAgent } from "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, UserDetectedEvent, WindowLoadStartedEvent, WindowLoadedEvent } from "../../vendor/repobit/dex-data-layer.js";
// src/blocks/link-checker/link-checker.js
var StatusMessageFactory = class {
	static createMessage(status, url, statusMessages) {
		let urlObject = url;
		if (!/^https?:\/\//i.test(url)) urlObject = `http://${url}`;
		urlObject = new URL(urlObject);
		if (!urlObject.hostname.startsWith("www.")) urlObject.hostname = `www.${urlObject.hostname}`;
		const numberToStatusMap = {
			1: "safe",
			2: "so_far_so_good_1",
			3: "so_far_so_good_2",
			4: "malware &amp; phishing",
			5: "malware",
			6: "c&amp;c",
			7: "malvertising &amp; fraud &amp; phishing",
			8: "fraud",
			9: "phishing",
			10: "malvertising",
			11: "pua",
			12: "homograph",
			13: "miner",
			14: "miner-server",
			15: "spam",
			16: "malware-hd",
			17: "untrusted",
			18: "malicious",
			other: "other"
		};
		const mappedStatus = numberToStatusMap[status] || numberToStatusMap.other;
		const isSafe = mappedStatus.includes("safe") || mappedStatus.includes("so_far_so_good_1") || mappedStatus.includes("so_far_so_good_2");
		let msg;
		if (statusMessages[mappedStatus.toLowerCase()]) msg = statusMessages[mappedStatus.toLowerCase()];
		if (!statusMessages[mappedStatus.toLowerCase()] && isSafe) msg = statusMessages["default-good"];
		if (!statusMessages[mappedStatus.toLowerCase()] && !isSafe) msg = statusMessages.default;
		msg = msg.replace("<domain-name>", urlObject.hostname);
		if (msg) return {
			text: msg,
			className: isSafe ? "result safe" : "result danger",
			status: mappedStatus
		};
		return {
			text: `Status: ${mappedStatus}`,
			className: "result warning"
		};
	}
};
function changeTexts(block, result, statusTitles) {
	const titleText = statusTitles[result.status.toLowerCase()] || statusTitles.default;
	const h1 = block.querySelector("h1");
	if (h1) h1.textContent = titleText;
}
function getResultPagePath(status, mappedStatus) {
	if (status === 1 || mappedStatus.includes("safe")) return `/${page_default.locale}/consumer/link-checker/safe`;
	if (status === 2 || status === 3 || mappedStatus.includes("so_far_so_good_1") || mappedStatus.includes("so_far_so_good_2")) return `/${page_default.locale}/consumer/link-checker/sofarsogood`;
	return `/${page_default.locale}/consumer/link-checker/malicious`;
}
function displayStoredResult(block, statusMessages, statusTitles) {
	const storedData = sessionStorage.getItem("linkCheckerResult");
	if (!storedData) return false;
	try {
		const resultData = JSON.parse(storedData);
		if (Date.now() - resultData.timestamp > 36e5) {
			sessionStorage.removeItem("linkCheckerResult");
			return false;
		}
		const input = block.querySelector("#link-checker-input");
		const result = block.querySelector(".result");
		if (!input || !result) return false;
		input.value = resultData.url;
		input.setAttribute("disabled", "");
		document.getElementById("inputDiv").textContent = resultData.url;
		result.innerHTML = resultData.message;
		result.className = resultData.className;
		block.closest(".section").classList.add(resultData.className.split(" ")[1]);
		changeTexts(block, { status: resultData.mappedStatus }, statusTitles);
		const buttonsContainer = block.querySelector(".buttons-container");
		if (buttonsContainer) buttonsContainer.style.display = "flex";
		return true;
	} catch (error) {
		sessionStorage.removeItem("linkCheckerResult");
		return false;
	}
}
var isValidUrl = (urlString) => {
	return (/* @__PURE__ */ new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*(\\?[;&a-z\\d%\\/_@.~+=-]*)?(\\#(!|\\/)?[-a-z\\d%_.~+@\\/?&=;]*)?$", "i")).test(urlString);
};
async function checkLink(block, input, result, statusMessages, statusTitles) {
	const inputUrl = input.value.trim();
	if (!inputUrl || !isValidUrl(inputUrl)) {
		result.textContent = "Please enter a valid URL";
		result.className = "result danger";
		return;
	}
	input.closest(".input-container").classList.add("loader-circle");
	let response;
	response = await fetch("https://eu.nimbus.bitdefender.net/tools/link-checker", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Nimbus-ClientID": "81b10964-a3c1-44f6-b5ac-7eac82db3ab1"
		},
		body: JSON.stringify({ url: inputUrl })
	});
	if (response.status === 401) {
		const challengeData = await response.json();
		const solvedChallenge = await BotPrevention.solveChallange(challengeData);
		response = await fetch("https://eu.nimbus.bitdefender.net/tools/link-checker", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Nimbus-ClientID": "81b10964-a3c1-44f6-b5ac-7eac82db3ab1"
			},
			body: JSON.stringify({
				url: inputUrl,
				pow_challenge: challengeData.pow_challenge,
				pow_solution: solvedChallenge.nonces
			})
		});
	}
	if (!response.ok) {
		result.innerHTML = `
      <strong>Something went wrong</strong><br>
      The system encountered an error while trying to check the link you provided. Please try again in a few minutes.`;
		result.className = "result danger no-response";
		input.closest(".input-container").classList.remove("loader-circle");
		return;
	}
	const { status } = await response.json();
	const message = StatusMessageFactory.createMessage(status, inputUrl, statusMessages);
	const resultPagePath = getResultPagePath(status, message.status);
	if (resultPagePath) {
		sessionStorage.setItem("linkCheckerResult", JSON.stringify({
			url: inputUrl,
			status,
			mappedStatus: message.status,
			message: message.text,
			className: message.className,
			timestamp: Date.now()
		}));
		const testParam = window.location.href.includes("dotest=1");
		const resultUrl = new URL(resultPagePath, window.location.origin);
		if (testParam) resultUrl.searchParams.set("dotest", "1");
		window.location.href = resultUrl.href;
		return;
	}
	result.innerHTML = message.text;
	result.className = message.className;
	block.closest(".section").classList.add(message.className.split(" ")[1]);
	input.setAttribute("disabled", "");
	document.getElementById("inputDiv").textContent = inputUrl;
	changeTexts(block, message, statusTitles);
	input.closest(".input-container").classList.remove("loader-circle");
	AdobeDataLayerService.push(new WindowLoadStartedEvent((pageLoadStartedInfo) => {
		pageLoadStartedInfo.name += `:${message.status}`;
		return pageLoadStartedInfo;
	}));
	AdobeDataLayerService.push(new UserDetectedEvent());
	AdobeDataLayerService.push(new WindowLoadedEvent());
}
async function resetChecker(block, titleText = "") {
	const classesToRemove = ["danger", "safe"];
	const section = block.closest(".section");
	classesToRemove.forEach((className) => {
		if (section.classList.contains(className)) section.classList.remove(className);
	});
	const input = block.querySelector("#link-checker-input");
	const result = block.querySelector(".result");
	const h1 = block.querySelector("h1");
	input.removeAttribute("disabled");
	input.value = "";
	result.className = "result";
	if (h1) h1.textContent = titleText;
	AdobeDataLayerService.push(new WindowLoadStartedEvent({}));
	AdobeDataLayerService.push(new UserDetectedEvent());
	AdobeDataLayerService.push(new WindowLoadedEvent());
}
function createStatusMessages(block) {
	const statusMessages = {};
	Array.from(block.querySelectorAll("div")).find((div) => {
		const firstParagraph = div.querySelector("p");
		return firstParagraph && firstParagraph.textContent.includes("<status-messages>");
	}).querySelectorAll("p").forEach((p, index) => {
		if (index === 0) return;
		const parts = p.innerHTML.split(":");
		if (parts.length >= 2) {
			const status = parts[0].trim();
			const message = parts.slice(1).join(":").trim();
			statusMessages[status.toLowerCase()] = message;
		}
	});
	return statusMessages;
}
function createStatusTitles(block) {
	const statusTitles = {};
	const divWithstatusTitles = Array.from(block.querySelectorAll("div")).find((div) => {
		const firstParagraph = div.querySelector("p");
		return firstParagraph && firstParagraph.textContent.includes("<titles-change>");
	});
	divWithstatusTitles.classList.add("status-titles");
	divWithstatusTitles.querySelectorAll("p").forEach((p, index) => {
		if (index === 0) return;
		const parts = p.textContent.split(":");
		if (parts.length >= 2) {
			const status = parts[0].trim();
			const message = parts.slice(1).join(":").trim();
			statusTitles[status.toLowerCase()] = message;
		}
	});
	divWithstatusTitles.remove();
	return statusTitles;
}
function createButtonsContainer(block) {
	const titleText = block.querySelector("h1")?.innerText;
	const divWithButtons = Array.from(block.querySelectorAll("div")).find((div) => {
		const firstParagraph = div.querySelector("p");
		return firstParagraph && firstParagraph.textContent.includes("<buttons>");
	});
	if (divWithButtons) {
		divWithButtons.classList.add("buttons-container");
		const pElements = divWithButtons.querySelectorAll("p");
		divWithButtons.querySelector("div").remove();
		pElements.forEach((p, index) => {
			if (index === 0) {
				p.remove();
				return;
			}
			if (index === 1) {
				const button = p.querySelector("a");
				button.classList.add("share-button");
				if (UserAgent.isAndroid || UserAgent.isIos) {
					const { mobileLink } = block.closest(".section").dataset;
					if (mobileLink) {
						const newButton = button.cloneNode(true);
						newButton.href = mobileLink;
						newButton.classList.add("mobile-link-button");
						button.setAttribute("target", "_blank");
						button.replaceWith(newButton);
					}
				}
			}
			if (index === 2) p.querySelector("a").classList.add("check-another-button");
			divWithButtons.appendChild(p);
			const link = p.querySelector("a");
			if (link.href.includes("#check-another")) link.addEventListener("click", (e) => {
				e.preventDefault();
				if (window.location.pathname.includes("/link-checker/")) window.location.href = `/${page_default.locale}/consumer/link-checker`;
				else resetChecker(block, titleText);
			});
		});
	}
}
function decorate(block) {
	const { checkButtonText, product, pasteLinkText, signature } = block.closest(".section").dataset;
	const privacyPolicyDiv = block.querySelector(":scope > div:nth-child(3)");
	privacyPolicyDiv.classList.add("privacy-policy");
	if (signature) {
		const signatureElement = document.createElement("div");
		signatureElement.classList.add("signature");
		signatureElement.textContent = signature;
		privacyPolicyDiv.after(signatureElement);
	}
	if (product) {
		const [productName, productUsers, productYears] = product.split("/");
		block.setAttribute("product-id", productName);
	}
	const statusMessages = createStatusMessages(block);
	const statusTitles = createStatusTitles(block);
	const formContainer = document.createElement("div");
	formContainer.classList.add("link-checker-form");
	const inputContainer = document.createElement("div");
	inputContainer.classList.add("input-container");
	formContainer.appendChild(inputContainer);
	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = pasteLinkText ?? "example-url.com";
	input.id = "link-checker-input";
	const copyElement = document.createElement("span");
	copyElement.id = "copy-to-clipboard";
	const inputDiv = document.createElement("p");
	inputDiv.setAttribute("id", "inputDiv");
	const divContainer = document.createElement("div");
	divContainer.className = "input-container__container";
	divContainer.appendChild(input);
	block.prepend(inputDiv);
	divContainer.appendChild(copyElement);
	inputContainer.appendChild(divContainer);
	copyElement.addEventListener("click", async () => {
		try {
			const text = await navigator.clipboard.readText();
			input.value += text;
		} catch (error) {}
	});
	const button = document.createElement("button");
	button.textContent = checkButtonText ?? "Check URL";
	button.classList.add("check-url");
	inputContainer.appendChild(button);
	const result = document.createElement("div");
	result.className = "result";
	formContainer.appendChild(result);
	block.querySelectorAll(":scope > div")[1].replaceWith(formContainer);
	const [safeImage, dangerImage] = block.querySelectorAll("picture");
	safeImage.classList.add("safe-image");
	dangerImage.classList.add("danger-image");
	button.addEventListener("click", () => checkLink(block, input, result, statusMessages, statusTitles));
	createButtonsContainer(block);
	const currentPath = window.location.pathname;
	if (currentPath.includes("/link-checker/safe") || currentPath.includes("/link-checker/sofarsogood") || currentPath.includes("/link-checker/malicious")) {
		if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
			sessionStorage.removeItem("linkCheckerResult");
			window.location.replace(`/${page_default.locale}/consumer/link-checker`);
			return;
		}
		if (!displayStoredResult(block, statusMessages, statusTitles)) {
			window.location.replace(`/${page_default.locale}/consumer/link-checker`);
			return;
		}
		window.addEventListener("beforeunload", () => {
			if (performance.getEntriesByType("navigation")[0]?.type !== "reload") sessionStorage.removeItem("linkCheckerResult");
		});
	}
	input.addEventListener("input", () => {
		if (input.value.trim() === "") {
			result.textContent = "";
			result.className = "";
		}
	});
	input.addEventListener("paste", () => {
		result.textContent = "";
		result.className = "";
	});
}
export { decorate as default };
