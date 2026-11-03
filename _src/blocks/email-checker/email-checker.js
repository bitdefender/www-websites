import page_default from "../../scripts/page.js";
// src/blocks/email-checker/email-checker.js
function changeTexts(block, result, statusTitles, numberOfLeaks) {
	const titleText = statusTitles?.[result]?.replace("0", numberOfLeaks);
	const h1 = block.querySelector("h1");
	if (h1) h1.innerHTML = titleText;
}
async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchData(url, body) {
	const json = await (await fetch(url, {
		method: "POST",
		body: JSON.stringify(body)
	})).json();
	return json.result || json;
}
async function checkLink(block, input, result, statusMessages, statusTitles) {
	const email = input.value.trim();
	const { invalidEmailText } = block.closest(".section").dataset;
	const isValidEmail = (emailInput) => {
		return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.toLowerCase());
	};
	if (!email || !isValidEmail(email)) {
		result.textContent = `${invalidEmailText ?? ""}`;
		result.className = "result danger";
		return;
	}
	input.closest(".input-container").classList.add("loader-circle");
	const firstRequest = await fetchData("https://nimbus.bitdefender.net/lid/privacy_check", {
		id: 1,
		jsonrpc: "2.0",
		method: "on_demand_scan",
		params: {
			app_id: "com.bitdefender.vpn",
			type: "emails",
			value: email
		}
	});
	if (firstRequest.error) {
		if (firstRequest.error.data.code !== 41004) result.innerHTML = `${statusMessages.server_error ?? ""}`;
		else result.innerHTML = `${statusMessages.error ?? ""}`;
		result.className = "result danger no-response";
		input.closest(".input-container").classList.remove("loader-circle");
		return;
	}
	await sleep(1e3);
	const secondRequest = await fetchData("https://nimbus.bitdefender.net/lid/privacy_check", {
		id: 2,
		jsonrpc: "2.0",
		method: "get_on_demand_issues",
		params: { scan_id: firstRequest.scan_id }
	});
	if (secondRequest.error) {
		if (secondRequest.error.data.code !== 41004) result.innerHTML = `${statusMessages.server_error ?? ""}`;
		else result.innerHTML = `${statusMessages.error ?? ""}`;
		result.className = "result danger no-response";
		input.closest(".input-container").classList.remove("loader-circle");
		return;
	}
	await sleep(1e3);
	let statusCode;
	let message;
	let className;
	const leaksNumber = secondRequest.total_count;
	if (leaksNumber === 0) {
		statusCode = "safe";
		message = statusMessages.safe;
		className = "result safe";
	} else {
		statusCode = "leaks";
		message = statusMessages.leaks;
		className = "result danger";
	}
	const resultPagePath = statusCode === "safe" ? "/safe" : "/not-safe";
	if (resultPagePath) {
		sessionStorage.setItem("emailCheckerResult", JSON.stringify({
			email,
			message,
			statusCode,
			className,
			statusTitles,
			leaksNumber
		}));
		window.location.href = `${window.location.pathname}${resultPagePath}`;
	}
}
function createStatusMessages(block) {
	const statusMessages = {};
	const divWithStatusMessages = Array.from(block.querySelectorAll("div")).find((div) => {
		const firstParagraph = div.querySelector("p");
		return firstParagraph && firstParagraph.textContent.includes("<status-messages>");
	});
	if (!divWithStatusMessages) return statusMessages;
	divWithStatusMessages.querySelectorAll("p").forEach((p, index) => {
		if (index === 0) return;
		const parts = p.innerHTML.split(":");
		if (parts.length >= 2) {
			const status = parts[0].trim().replace("<br>", "");
			const message = parts.slice(1).join(":").trim().replace("<br>", "");
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
	if (!divWithstatusTitles) return statusTitles;
	divWithstatusTitles.classList.add("status-titles");
	divWithstatusTitles.querySelectorAll("p").forEach((p, index) => {
		if (index === 0) return;
		const parts = p.innerHTML.replace(/<br\s*\/?>/gi, "").trim().split(":");
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
			const link = p.querySelector("a");
			if (link.href.includes("#check-another")) {
				p.querySelector("a").classList.add("check-another-button");
				link.addEventListener("click", (e) => {
					e.preventDefault();
					window.location.replace(`${window.location.origin}/${page_default.locale}/consumer/digital-footprint-checker`);
				});
			}
			divWithButtons.appendChild(p);
		});
	}
}
function createExternalInput(inputDiv) {
	const buttons = document.querySelectorAll("a[href*=\"#external-input\"]");
	const mainInput = document.querySelector("#email-checker-input");
	if (!mainInput) return;
	const allInputs = [mainInput];
	buttons.forEach((button) => {
		const container = button.closest(".button-container");
		if (!container || !inputDiv) return;
		const clone = inputDiv.cloneNode(true);
		container.replaceWith(clone);
		const externalInput = clone.querySelector("input");
		const scrollButton = clone.querySelector("button");
		if (scrollButton) scrollButton.addEventListener("click", (e) => {
			e.preventDefault();
			mainInput.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			mainInput.focus();
		});
		if (!externalInput) return;
		allInputs.push(externalInput);
	});
	allInputs.forEach((input) => {
		input.addEventListener("input", () => {
			const { value } = input;
			allInputs.forEach((otherInput) => {
				if (otherInput !== input) otherInput.value = value;
			});
		});
	});
}
function displayStoredResult(block, statusMessages, statusTitles) {
	const storedData = sessionStorage.getItem("emailCheckerResult");
	if (!storedData) return false;
	try {
		const resultData = JSON.parse(storedData);
		if (Date.now() - resultData.timestamp > 36e5) {
			sessionStorage.removeItem("emaiCheckerResult");
			return false;
		}
		const input = block.querySelector("#email-checker-input");
		const result = block.querySelector(".result");
		if (!input || !result) return false;
		input.value = resultData.url;
		input.setAttribute("disabled", "");
		document.getElementById("inputDiv").textContent = resultData.email;
		result.innerHTML = resultData.message;
		result.className = resultData.className;
		block.closest(".section").classList.add(resultData.className.split(" ")[1]);
		const { statusCode, leaksNumber } = resultData;
		changeTexts(block, statusCode, statusTitles, leaksNumber);
		const buttonsContainer = block.querySelector(".buttons-container");
		if (buttonsContainer) buttonsContainer.style.display = "flex";
		return true;
	} catch (error) {
		sessionStorage.removeItem("linkCheckerResult");
		return false;
	}
}
function decorate(block) {
	const { checkButtonText, placeholder, signature } = block.closest(".section").dataset;
	const privacyPolicyDiv = block.querySelector(":scope > div:nth-child(3)");
	privacyPolicyDiv.classList.add("privacy-policy");
	if (signature) {
		const signatureElement = document.createElement("div");
		signatureElement.classList.add("signature");
		signatureElement.textContent = signature;
		privacyPolicyDiv?.after(signatureElement);
	}
	const statusMessages = createStatusMessages(block);
	const statusTitles = createStatusTitles(block);
	const formContainer = document.createElement("div");
	formContainer.classList.add("email-checker-form");
	const inputContainer = document.createElement("div");
	inputContainer.classList.add("input-container");
	formContainer.appendChild(inputContainer);
	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = `${placeholder ?? ""}`;
	input.id = "email-checker-input";
	const inputDiv = document.createElement("p");
	inputDiv.setAttribute("id", "inputDiv");
	const divContainer = document.createElement("div");
	divContainer.className = "input-container__container";
	divContainer.appendChild(input);
	block.prepend(inputDiv);
	inputContainer.appendChild(divContainer);
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
	createButtonsContainer(block);
	createExternalInput(inputContainer);
	const currentPath = window.location.pathname;
	if (currentPath.includes("digital-footprint-checker/safe") || currentPath.includes("digital-footprint-checker/not-safe")) {
		if (!displayStoredResult(block, statusMessages, statusTitles)) {
			window.location.replace(`${window.location.origin}/${page_default.locale}/consumer/digital-footprint-checker`);
			return;
		}
		window.addEventListener("beforeunload", () => {
			if (performance.getEntriesByType("navigation")[0]?.type !== "reload") sessionStorage.removeItem("emailCheckerResult");
		});
	}
	input.addEventListener("input", () => {
		if (input.value.trim() === "") {
			result.textContent = "";
			result.className = "";
		}
	});
	document.querySelectorAll("button.check-url").forEach((checkButton) => checkButton.addEventListener("click", () => checkLink(block, input, result, statusMessages, statusTitles)));
}
export { decorate as default };
