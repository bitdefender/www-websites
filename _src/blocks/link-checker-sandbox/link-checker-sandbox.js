import page_default from "../../scripts/page.js";
import { BotPrevention } from "../../scripts/utils/bot-prevention.js";
// src/blocks/link-checker-sandbox/link-checker-sandbox.js
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
function getResultPagePath(status = null, mappedStatus = null) {
	if (!status || !mappedStatus) return null;
	return null;
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
	return (/* @__PURE__ */ new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*(\\?[;&a-z\\d%\\/_@.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i")).test(urlString);
};
async function checkLink(block, input, result, statusMessages, statusTitles) {
	const url = input.value.trim();
	if (!url || !isValidUrl(url)) {
		result.textContent = "Please enter a valid URL";
		result.className = "result danger";
		return;
	}
	input.closest(".input-container").classList.add("loader-circle");
	let response = await fetch("https://eu.nimbus.bitdefender.net/tools/link-checker", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Nimbus-ClientID": "76a496bc-3536-4306-8802-7c6a5e81fb5f"
		},
		body: JSON.stringify({ url })
	});
	if (response.status === 401) {
		const challengeData = await response.json();
		const solvedChallenge = await BotPrevention.solveChallange(challengeData);
		response = await fetch("https://eu.nimbus.bitdefender.net/tools/link-checker", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Nimbus-ClientID": "76a496bc-3536-4306-8802-7c6a5e81fb5f"
			},
			body: JSON.stringify({
				url,
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
	const message = StatusMessageFactory.createMessage(status, url, statusMessages);
	const resultPagePath = getResultPagePath(status, message.status);
	if (resultPagePath) {
		sessionStorage.setItem("linkCheckerResult", JSON.stringify({
			url,
			status,
			mappedStatus: message.status,
			message: message.text,
			className: message.className,
			timestamp: Date.now()
		}));
		window.location.href = resultPagePath;
		return;
	}
	result.innerHTML = message.text;
	result.className = message.className;
	block.closest(".section").classList.add(message.className.split(" ")[1]);
	input.setAttribute("disabled", "");
	block.querySelector("#inputDiv").textContent = url;
	changeTexts(block, message, statusTitles);
	input.closest(".input-container").classList.remove("loader-circle");
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
				p.querySelector("a").classList.add("share-button");
				p.querySelector("a").addEventListener("click", (e) => {
					e.preventDefault();
					window.open(e.target.href, "_blank");
				});
			}
			if (index === 2) p.querySelector("a").classList.add("check-another-button");
			divWithButtons.appendChild(p);
			const link = p.querySelector("a");
			if (link.href.includes("#check-another")) link.addEventListener("click", (e) => {
				e.preventDefault();
				if (window.location.pathname.includes("/link-checker/") && page_default.locale === "en-us") window.location.href = "/en-us/consumer/link-checker";
				else resetChecker(block, titleText);
			});
		});
	}
}
async function decorate(block, onDataLoaded) {
	const structuredContent = await onDataLoaded;
	const linkToCheck = structuredContent?.linkToCheck || "";
	const responseText = structuredContent?.responseText || "";
	const { checkButtonText, product } = block.closest(".section").dataset;
	block.querySelector(":scope > div:nth-child(3)").classList.add("privacy-policy");
	if (product) {
		const [productName, productUsers, productYears] = product.split("/");
		block.setAttribute("data-store-id", productName);
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
	input.placeholder = "example-url.com";
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
	if ((currentPath.includes("/link-checker/safe") || currentPath.includes("/link-checker/sofarsogood") || currentPath.includes("/link-checker/malicious")) && page_default.locale === "en-us") {
		if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
			sessionStorage.removeItem("linkCheckerResult");
			window.location.replace("/en-us/consumer/link-checker");
			return;
		}
		if (!displayStoredResult(block, statusMessages, statusTitles)) {
			window.location.replace("/en-us/consumer/link-checker");
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
	if (responseText) {
		const { status } = JSON.parse(responseText);
		const message = StatusMessageFactory.createMessage(status, linkToCheck, statusMessages);
		result.innerHTML = message.text;
		result.className = message.className;
		block.closest(".section").classList.add(message.className.split(" ")[1]);
		input.setAttribute("disabled", "");
		block.querySelector("#inputDiv").textContent = linkToCheck;
		changeTexts(block, message, statusTitles);
		return;
	}
	if (linkToCheck) {
		input.value = linkToCheck;
		await checkLink(block, input, result, statusMessages, statusTitles);
	}
}
export { decorate as default };
