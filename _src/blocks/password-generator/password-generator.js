import { decorateIcons } from "../../scripts/lib-franklin.js";
import datastorePasswordService from "../../scripts/utils/pass_service.js";
// src/blocks/password-generator/password-generator.js
/**
* Finds a div element whose first paragraph contains the specified search text.
* When found, removes that paragraph and returns the parent div.
*
* @param {HTMLElement} block - The container to search within
* @param {string} searchText - The text to search for in the first paragraph
* @returns {HTMLElement|null} - The div containing the specified text, or null if not found
*/
function getDivBasedOnFirstParagraph(block, searchText) {
	return Array.from(block.querySelectorAll("div")).find((div) => {
		const firstParagraph = div.querySelector("p");
		if (firstParagraph?.textContent.includes(searchText)) {
			firstParagraph.remove();
			return true;
		}
		if (div.textContent.includes(searchText)) {
			div.remove();
			return true;
		}
		return false;
	}) || null;
}
function updatePasswordStrength(password, strengthElement) {
	const strongSpan = strengthElement.querySelector("#password-result");
	const thingIs = datastorePasswordService.ratePasswordFromPasswordInfo(password);
	const rating = datastorePasswordService.fromRating(thingIs);
	strongSpan.className = "";
	switch (rating) {
		case datastorePasswordService.SecurityReportConstants.passwordStrengthWeak:
			strongSpan.textContent = datastorePasswordService.SecurityReportConstants.passwordStrengthWeak;
			strongSpan.classList.add("weak");
			break;
		case datastorePasswordService.SecurityReportConstants.passwordStrengthPoor:
			strongSpan.textContent = datastorePasswordService.SecurityReportConstants.passwordStrengthPoor;
			strongSpan.classList.add("poor");
			break;
		case datastorePasswordService.SecurityReportConstants.passwordStrengthGood:
			strongSpan.textContent = datastorePasswordService.SecurityReportConstants.passwordStrengthGood;
			strongSpan.classList.add("good");
			break;
		default:
			strongSpan.textContent = datastorePasswordService.SecurityReportConstants.passwordStrengthStrong;
			strongSpan.classList.add("strong");
	}
}
function createSharePopup(element) {
	const sharePopup = document.createElement("div");
	sharePopup.classList.add("share-popup");
	element.insertAdjacentElement("beforeend", sharePopup);
	return sharePopup;
}
function copyToClipboard(block, caller, popupText, password) {
	const copyText = password;
	navigator.clipboard.writeText(copyText);
	if (block.querySelector(".button-container")) {
		const sharePopup = block.querySelector(".share-popup") || createSharePopup(caller);
		sharePopup.textContent = `${popupText}`;
		sharePopup.style = "opacity: 1";
		setTimeout(() => {
			sharePopup.style = "opacity:0;";
		}, 2e3);
	}
}
function adjustFontSize(input, password) {
	if (password.length > 25 && window.innerWidth < 991) input.style.fontSize = "calc(100% - 4px)";
	else input.style.fontSize = "";
}
function decorate(block) {
	const { clipboardText, selectAtLeastOneCheckboxText, signature } = block.closest(".section").dataset;
	const privacyPolicyRow = getDivBasedOnFirstParagraph(block, "<privacy-policy>");
	privacyPolicyRow?.classList.add("privacy-policy");
	if (signature) {
		const signatureElement = document.createElement("div");
		signatureElement.classList.add("signature");
		signatureElement.textContent = signature;
		privacyPolicyRow?.after(signatureElement);
	}
	const passwordGeneratorRow = getDivBasedOnFirstParagraph(block, "<password-generator>");
	passwordGeneratorRow.classList.add("password-generator-grid");
	const [columnText, button] = [...passwordGeneratorRow.children];
	const [passwordLengthText, checkboxList, passwordStrengthText] = [...columnText.children];
	columnText.remove();
	const strengthMatch = passwordStrengthText.innerHTML.split("strong-weak-text");
	const [weakText, poorText, goodText, strongText] = strengthMatch[1].split(",");
	datastorePasswordService.updatePasswordStrengthTexts(weakText, poorText, goodText, strongText);
	passwordStrengthText.innerHTML = `${strengthMatch[0]} <span id='password-result' class='strong'>${strongText}</span>`;
	const formElement = document.createElement("form");
	formElement.classList.add("password-generator--form");
	formElement.innerHTML = `
    <div class="password-generator--input-container">
      <input class="password-generator--input" readonly>
      <input type="submit" class="password-generator--input-retry">
    </div>
    <div class="password-generator--parameters">
        <div class="range-slider-container">
          <p>${passwordLengthText.innerText}</p>
          <input name="range" type="range" min="4" max="32" value="16" class="slider" id="password-range">
          <label for="range" id="range-label"></label>
        </div>
        <div class="form-checkboxes">
          <div>
            ${checkboxList.children[0]?.textContent ? `<input type="checkbox" id="uppercase" name="uppercase" checked />  
            <label for="uppercase">${checkboxList.children[0].textContent}</label>` : ""}
          </div>
          <div>
            ${checkboxList.children[1]?.textContent ? `<input type="checkbox" id="lowercase" name="lowercase" checked />  
            <label for="lowercase">${checkboxList.children[1].textContent}</label>` : ""}
          </div>
          <div>
            ${checkboxList.children[2]?.textContent ? `<input type="checkbox" id="numbers" name="numbers" checked />  
            <label for="numbers">${checkboxList.children[2].textContent}</label>` : ""}
          </div>
          <div>
            ${checkboxList.children[3]?.textContent ? ` <input type="checkbox" id="special" name="special" checked />  
            <label for="special">${checkboxList.children[3].textContent}</label> ` : ""}
          </div>
        </div>
        <p class="password-strength">${passwordStrengthText?.innerHTML}<p>
    </div>
  `;
	passwordGeneratorRow.prepend(formElement);
	decorateIcons(block);
	const passwordInput = block.querySelector(".password-generator--input");
	const generateButton = block.querySelector(".password-generator--input-retry");
	const copyPassword = block.querySelector("[href='#copy-link'], [href='#copy-password']");
	copyPassword.id = "copy-password";
	const slider = block.querySelector("#password-range");
	const rangeLabel = block.querySelector("#range-label");
	const uppercaseCheckbox = block.querySelector("#uppercase");
	const lowercaseCheckbox = block.querySelector("#lowercase");
	const numbersCheckbox = block.querySelector("#numbers");
	const specialCheckbox = block.querySelector("#special");
	const strengthElement = block.querySelector(".password-strength");
	rangeLabel.innerHTML = slider.value;
	slider.oninput = function updateRangeLabel() {
		rangeLabel.innerHTML = this.value;
	};
	let password = "";
	function generatePassword() {
		const settings = {
			passwordLength: parseInt(slider.value, 10),
			includeLettersUppercase: uppercaseCheckbox.checked,
			includeLettersLowercase: lowercaseCheckbox.checked,
			includeNumbers: numbersCheckbox.checked,
			includeSpecialChars: specialCheckbox.checked,
			passwordLettersUppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			passwordLettersLowercase: "abcdefghijklmnopqrstuvwxyz",
			passwordNumbers: "0123456789",
			passwordSpecialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?"
		};
		if (!settings.includeLettersUppercase && !settings.includeLettersLowercase && !settings.includeNumbers && !settings.includeSpecialChars) {
			if (!block.querySelector(".danger-selection")) {
				const notification = document.createElement("p");
				notification.textContent = selectAtLeastOneCheckboxText;
				notification.classList.add("danger-selection");
				block.prepend(notification);
				setTimeout(() => {
					notification.remove();
				}, 2e3);
			}
			return;
		}
		password = datastorePasswordService.generateWithSettings(settings);
		passwordInput.value = password;
		adjustFontSize(passwordInput, password);
		updatePasswordStrength(password, strengthElement);
	}
	generateButton.addEventListener("click", (e) => {
		e.preventDefault();
		generatePassword();
	});
	generatePassword();
	copyPassword.addEventListener("click", (e) => {
		e.preventDefault();
		copyToClipboard(block, copyPassword, clipboardText, password);
	});
	[
		slider,
		uppercaseCheckbox,
		lowercaseCheckbox,
		numbersCheckbox,
		specialCheckbox
	].forEach((element) => element.addEventListener("change", generatePassword));
}
export { decorate as default };
