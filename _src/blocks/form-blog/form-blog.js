import { Cookies } from "../../vendor/repobit/dex-utils.js";
import { AdobeDataLayerService, FormEvent } from "../../vendor/repobit/dex-data-layer.js";
// src/blocks/form-blog/form-blog.js
function onChange(form) {
	const submitButton = form.querySelector("input[type=\"submit\"]");
	submitButton.disabled = !(form.querySelector("input[type=\"email\"]").value.trim() !== "");
}
async function hashEmail(email) {
	const data = new TextEncoder().encode(email);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function solvePoW(challenge, difficulty) {
	const targetPrefix = "0".repeat(difficulty);
	let nonce = 0;
	while (true) {
		const input = challenge + nonce;
		const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
		const hashHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
		if (hashHex.startsWith(targetPrefix)) return {
			nonce,
			hash: hashHex
		};
		nonce++;
	}
}
async function handleSubmitNewsletter(e, form, flow, successMessage, failMessage, formType = "newsletter") {
	e.preventDefault();
	const { challenge, difficulty } = await (await fetch("https://www.bitdefender.com/site/Store/challenge")).json();
	const { nonce } = await solvePoW(challenge, difficulty);
	const formData = new FormData(form);
	const email = formData.get("email");
	const name = formData.get("name");
	const jsonObject = {
		email,
		flow,
		first_name: name.split(" ")[0],
		last_name: name.split(" ")[1] || "",
		non_optin: true,
		...Boolean(formData.get("checkbox")) ? {
			com_optin: true,
			newsletter_comercial_optin: true
		} : {},
		nonce,
		challenge,
		difficulty
	};
	const response = await fetch("https://www.bitdefender.com/site/Store/offerSubscribe", {
		method: "POST",
		body: JSON.stringify(jsonObject)
	});
	const formParent = form.parentElement;
	if (response.ok) {
		const hashedEmail = await hashEmail(email);
		AdobeDataLayerService.push(new FormEvent("form completed", {
			form: formType,
			formID: hashedEmail
		}));
		formParent.innerHTML = "";
		formParent.appendChild(successMessage);
		Cookies.set("newsLetterIntentShown", "1");
	} else {
		formParent.innerHTML = "";
		formParent.appendChild(failMessage);
	}
}
function parseHTML(html) {
	const curlyRegex = /{{(.*?)}}/g;
	const squareRegex = /\[\[(.*?)\]\]/g;
	const insideCurlyBrackets = [];
	const insideSquareBrackets = [];
	let match;
	while ((match = curlyRegex.exec(html)) !== null) insideCurlyBrackets.push(match[1].trim());
	while ((match = squareRegex.exec(html)) !== null) insideSquareBrackets.push(match[1].trim());
	return {
		insideCurlyBrackets,
		insideSquareBrackets
	};
}
async function createForm(types, labels, flow, successMessage, failMessage, formType) {
	const form = document.createElement("form");
	form.setAttribute("method", "post");
	for (let i = 0; i < types.length; i += 1) {
		const type = types[i].toLowerCase();
		const input = document.createElement("input");
		input.id = `form-${i}-${type}`;
		input.addEventListener("change", () => onChange(form));
		input.addEventListener("input", () => onChange(form));
		if (type === "name") input.setAttribute("type", "text");
		else input.setAttribute("type", type);
		input.setAttribute("name", type);
		input.setAttribute("placeholder", labels[i]);
		if (type !== "checkbox") {
			input.setAttribute("required", "");
			input.setAttribute("aria-required", "true");
		}
		form.append(input);
		if (type === "submit") {
			input.setAttribute("value", labels[i]);
			input.classList.add("disabled");
			input.disabled = true;
		}
		if (type === "checkbox") {
			const div = document.createElement("div");
			div.classList.add("checkbox");
			const label = document.createElement("label");
			label.setAttribute("for", `form-${i}-${type}`);
			label.innerHTML = labels[i];
			input.before(div);
			div.append(input, label);
		}
	}
	form.addEventListener("submit", (e) => handleSubmitNewsletter(e, form, flow, successMessage, failMessage, formType));
	return form;
}
async function decorate(block, options) {
	const { template, flow, captchaKey } = block.closest(".section").dataset;
	if (options) {
		block = block.querySelector(".block") || block;
		block.closest(".section").classList.add("we-container");
	}
	const formDataHTML = block.children[1];
	const successMessage = block.children[2].children[1];
	const failMessage = block.children[3].children[1];
	const underEmailTextSource = block.children[4].children[1];
	let underEmailText = null;
	if (underEmailTextSource) {
		underEmailText = document.createElement("p");
		underEmailText.innerHTML = underEmailTextSource.innerHTML;
		[...underEmailTextSource.attributes].forEach((attribute) => {
			underEmailText.setAttribute(attribute.name, attribute.value);
		});
	}
	const formData = parseHTML(formDataHTML.innerHTML);
	const [types, labels] = [formData.insideCurlyBrackets, formData.insideSquareBrackets];
	let form = null;
	if (options) form = await createForm(types, labels, flow, successMessage, failMessage, options.formType, captchaKey);
	else form = await createForm(types, labels, flow, successMessage, failMessage, "newsletter", captchaKey);
	if (form) block.append(form);
	if (block.children[1]) block.children[1].innerHTML = "";
	if (block.children[2]) block.children[2].innerHTML = "";
	if (block.children[3]) block.children[3].innerHTML = "";
	if (block.children[4]) block.children[4].innerHTML = "";
	const emailField = block.querySelector("#form-1-email");
	if (emailField && underEmailText) emailField.insertAdjacentElement("afterend", underEmailText);
	if (template === "blog") block.classList.add("blog-template");
	const privacyPolicyLink = block.querySelector("a[href*=\"privacy-policy\"]");
	if (privacyPolicyLink) privacyPolicyLink.setAttribute("target", "_blank");
	window.dispatchEvent(new CustomEvent("shadowDomLoaded"), {
		bubbles: true,
		composed: true
	});
}
export { decorate as default };
