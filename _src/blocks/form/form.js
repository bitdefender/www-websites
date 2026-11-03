import { debounce } from "../../vendor/repobit/dex-utils.js";
// src/blocks/form/form.js
async function fetchData(url) {
	return (await (await fetch(url)).json()).data;
}
/**
*
* @param {String} email
* @returns {Boolean} wether the email passed is valid or not
*/
var validateEmail = (email) => {
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
};
/**
*
* @param {HTMLInputElement} inputElement
* @returns {Boolean} validation status of the field
*/
var checkInputValue = (inputElement) => {
	switch (inputElement.type) {
		case "email":
			if (!validateEmail(inputElement.value)) return false;
			break;
		case "checkbox": if (!inputElement.checked && inputElement.required) return false;
	}
	return true;
};
/**
*
* @param {HTMLInputElement} inputElement
*/
var displayInputError = (inputElement) => {
	const inputElementError = inputElement.parentElement.querySelector(".input-error-field");
	if (inputElementError) inputElementError.classList.remove("global-display-none");
};
/**
*
* @param {HTMLInputElement} inputElement
*/
var hideInputError = (inputElement) => {
	const inputElementError = inputElement.parentElement.querySelector(".input-error-field");
	if (inputElementError) inputElementError.classList.add("global-display-none");
};
/**
*
* @param {HTMLFormElement} form
* set the onChange function for all the form inputs
*/
function checkFormValues(form) {
	const submitButton = form.querySelector("input[type=\"submit\"]");
	const allInputFields = form.querySelectorAll("input:not([type=\"hidden\"])");
	let disabledStatus = false;
	allInputFields.forEach((inputField) => {
		if (!disabledStatus && !checkInputValue(inputField)) disabledStatus = true;
	});
	submitButton.disabled = disabledStatus;
}
async function handleSubmit(e, handler) {
	e.preventDefault();
	try {
		const mod = await import(handler);
		if (mod.default) await mod.default(e);
	} catch (error) {
		console.log("failed to load module for lib-identity-exposed-onsubmit", error);
	}
}
/**
*
* @param {HTMLInputElement} input the input to be adde inside the div wrapper
* @param {HTMLDivElement} newDivParent the div wrapper to hold the input
*/
var wrapInputInsideDiv = (input, newDivParent) => {
	const label = input.nextElementSibling;
	if (label && label.tagName === "LABEL") {
		input.before(newDivParent);
		newDivParent.append(input, label);
	} else {
		input.after(newDivParent);
		newDivParent.append(input);
	}
};
/**
*
* @param {HTMLInputElement} input
* @param {HTMLFormElement} form
* add the validations which get triggered whenever an input is filled with data
*/
var addInputValidation = (input, form) => {
	if (input.dataset.containsErrorField && checkInputValue(input)) hideInputError(input);
	else if (input.dataset.containsErrorField) displayInputError(input);
	checkFormValues(form);
};
/**
*
* @param {string} formURL url to form html
* @returns {Promise<HTMLFormElement>} returns the form
*/
async function createForm(formURL) {
	const { pathname, search } = new URL(formURL);
	const data = await fetchData(`${pathname}${search}`);
	const form = document.createElement("form");
	form.setAttribute("method", "post");
	data.forEach((field, index) => {
		const input = document.createElement("input");
		input.id = `form-${index}-${field.Field}`;
		input.setAttribute("type", field.Type);
		input.setAttribute("name", field.Field);
		input.setAttribute("placeholder", field.Default);
		input.setAttribute("value", field.Value);
		input.setAttribute("data-contains-error-field", Boolean(field.Error));
		input.addEventListener("input", debounce(() => addInputValidation(input, form), 100, false));
		if (field.Required && field.Required.toLowerCase() === "true") {
			input.setAttribute("required", "");
			input.setAttribute("aria-required", "true");
		}
		form.append(input);
		if (field.Label) {
			const label = document.createElement("label");
			label.setAttribute("for", input.id);
			label.textContent = field.Label;
			form.append(label);
		}
		if (field.Type === "submit") {
			input.classList.add("disabled");
			input.disabled = true;
		}
		if (field.Field === "handler") form.addEventListener("submit", (e) => handleSubmit(e, field.Value));
		if (field.Type === "checkbox") {
			const newDivWrapper = document.createElement("div");
			newDivWrapper.classList.add("checkbox");
			wrapInputInsideDiv(input, newDivWrapper);
		}
		if (field.Error) {
			const newDivWrapper = document.createElement("div");
			newDivWrapper.classList.add("input-container-with-error");
			const errorField = document.createElement("p");
			errorField.classList.add("input-error-field", "global-display-none");
			errorField.textContent = field.Error;
			newDivWrapper.appendChild(errorField);
			input.classList.add("input-with-error-field");
			wrapInputInsideDiv(input, newDivWrapper);
		}
	});
	return form;
}
async function decorate(block) {
	const form = await createForm(block.textContent.trim());
	if (form) block.append(form);
}
export { createForm, decorate as default };
