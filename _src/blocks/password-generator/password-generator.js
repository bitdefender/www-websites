import { decorateIcons } from '../../scripts/lib-franklin.js';
import passwordService from '../../scripts/utils/pass_service.js';

/**
 * Finds a div element whose first paragraph contains the specified search text.
 * When found, removes that paragraph and returns the parent div.
 *
 * @param {HTMLElement} block - The container to search within
 * @param {string} searchText - The text to search for in the first paragraph
 * @returns {HTMLElement|null} - The div containing the specified text, or null if not found
 */
function getDivBasedOnFirstParagraph(block, searchText) {
  const allDivs = Array.from(block.querySelectorAll('div'));

  const targetDiv = allDivs.find((div) => {
    const firstParagraph = div.querySelector('p');
    if (firstParagraph?.textContent.includes(searchText)) {
      firstParagraph.remove();
      return true;
    }
    return false;
  });

  return targetDiv || null;
}

function updatePasswordStrength(password, strengthElement) {
  // Get the strength span elements
  const strongSpan = strengthElement.querySelector('#password-result');
  // Check if the password is strong enough using the password service
  const thingIs = passwordService.ratePasswordFromPasswordInfo(password);
  const rating = passwordService.fromRating(thingIs);
  // Update the strength indicator
  strongSpan.className = '';
  switch (rating) {
    case passwordService.SecurityReportConstants.passwordStrengthWeak:
      strongSpan.textContent = passwordService.SecurityReportConstants.passwordStrengthWeak;
      strongSpan.classList.add('weak');
      break;
    case passwordService.SecurityReportConstants.passwordStrengthPoor:
      strongSpan.textContent = passwordService.SecurityReportConstants.passwordStrengthPoor;
      strongSpan.classList.add('poor');
      break;
    case passwordService.SecurityReportConstants.passwordStrengthGood:
      strongSpan.textContent = passwordService.SecurityReportConstants.passwordStrengthGood;
      strongSpan.classList.add('good');
      break;
    default:
      strongSpan.textContent = passwordService.SecurityReportConstants.passwordStrengthStrong;
      strongSpan.classList.add('strong');
  }
}

function createSharePopup(element) {
  const sharePopup = document.createElement('div');
  sharePopup.classList.add('share-popup');
  element.insertAdjacentElement('beforeend', sharePopup);
  return sharePopup;
}

function copyToClipboard(block, caller, popupText) {
  const copyText = window.location.href;

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);
  const buttonsContainer = block.querySelector('.button-container');
  if (buttonsContainer) {
    const sharePopup = block.querySelector('.share-popup') || createSharePopup(caller);
    sharePopup.textContent = `${popupText}`;
    sharePopup.style = 'opacity: 1';
    setTimeout(() => {
      sharePopup.style = 'opacity:0;';
    }, 2000);
  }
}

// Function to adjust font size based on password length and screen width
function adjustFontSize(input, password) {
  if (password.length > 25 && window.innerWidth < 991) {
    input.style.fontSize = 'calc(100% - 4px)';
  } else {
    input.style.fontSize = ''; // Reset to default
  }
}

export default function decorate(block) {
  const { clipboardText, selectAtLeastOneCheckboxText } = block.closest('.section').dataset;

  // const breadcrumb = createTag('div', { class: 'breadcrumb' });
  // block.closest('.section').prepend(breadcrumb);

  const privacyPolicyRow = getDivBasedOnFirstParagraph(block, '<privacy-policy>');
  privacyPolicyRow.classList.add('privacy-policy');

  const passwordGeneratorRow = getDivBasedOnFirstParagraph(block, '<password-generator>');
  passwordGeneratorRow.classList.add('password-generator-grid');
  const passwordGeneratorColumns = [...passwordGeneratorRow.children];
  // eslint-disable-next-line no-unused-vars
  const [columnText, button] = passwordGeneratorColumns;
  const [passwordLengthText, checkboxList, passwordStrengthText] = [...columnText.children];
  columnText.remove();
  // Process the password strength text to extract the strong and weak values

  // expected output is 'Password strength strong-weak-text Strong, Weak
  // parse the paragraph into my desired outcome
  const strengthMatch = passwordStrengthText.innerHTML.split('strong-weak-text');
  const [weakText, poorText, goodText, strongText] = strengthMatch[1].split(',');
  passwordService.updatePasswordStrengthTexts(weakText, poorText, goodText, strongText);

  passwordStrengthText.innerHTML = `${strengthMatch[0]} <span id='password-result' class='strong'>${strongText}</span>`;
  const formElement = document.createElement('form');
  formElement.classList.add('password-generator--form');
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
            <input type="checkbox" id="uppercase" name="uppercase" checked />  
            <label for="uppercase">${checkboxList.children[0].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="lowercase" name="lowercase" checked />  
            <label for="lowercase">${checkboxList.children[1].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="numbers" name="numbers" checked />  
            <label for="numbers">${checkboxList.children[2].textContent}</label>
          </div>
          <div>
            <input type="checkbox" id="special" name="special" checked />  
            <label for="special">${checkboxList.children[3].textContent}</label>
          </div>
        </div>
        <p class="password-strength">${passwordStrengthText.innerHTML}<p>
    </div>
  `;

  passwordGeneratorRow.prepend(formElement);
  decorateIcons(block);

  const passwordInput = block.querySelector('.password-generator--input');
  const generateButton = block.querySelector('.password-generator--input-retry');
  const copyPassword = block.querySelector("[href='#copy-link'], [href='#copy-password']");
  copyPassword.id = 'copy-password';
  const slider = block.querySelector('#password-range');
  const rangeLabel = block.querySelector('#range-label');
  const uppercaseCheckbox = block.querySelector('#uppercase');
  const lowercaseCheckbox = block.querySelector('#lowercase');
  const numbersCheckbox = block.querySelector('#numbers');
  const specialCheckbox = block.querySelector('#special');
  const strengthElement = block.querySelector('.password-strength');

  // Display the default slider value
  rangeLabel.innerHTML = slider.value;

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function updateRangeLabel() {
    rangeLabel.innerHTML = this.value;
  };

  function generatePassword() {
    const settings = {
      passwordLength: parseInt(slider.value, 10),
      includeLettersUppercase: uppercaseCheckbox.checked,
      includeLettersLowercase: lowercaseCheckbox.checked,
      includeNumbers: numbersCheckbox.checked,
      includeSpecialChars: specialCheckbox.checked,
      passwordLettersUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      passwordLettersLowercase: 'abcdefghijklmnopqrstuvwxyz',
      passwordNumbers: '0123456789',
      passwordSpecialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    // Ensure at least one character type is selected
    if (!settings.includeLettersUppercase
        && !settings.includeLettersLowercase
        && !settings.includeNumbers
        && !settings.includeSpecialChars) {
      if (!block.querySelector('.danger-selection')) {
        const notification = document.createElement('p');
        notification.textContent = selectAtLeastOneCheckboxText;
        notification.classList.add('danger-selection');
        block.prepend(notification);
        setTimeout(() => {
          notification.remove();
        }, 2000);
      }
      return;
    }

    // Generate the password
    const password = passwordService.generateWithSettings(settings);

    // Display the password
    passwordInput.value = password;

    // Adjust font size based on password length
    adjustFontSize(passwordInput, password);

    // Update the password strength indicator
    updatePasswordStrength(password, strengthElement);
  }

  generateButton.addEventListener('click', (e) => {
    e.preventDefault();
    generatePassword();
  });

  // Generate a password on page load
  generatePassword();

  copyPassword.addEventListener('click', (e) => {
    e.preventDefault();
    copyToClipboard(block, copyPassword, clipboardText, password);
  });

  // Update password when settings change
  [slider, uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, specialCheckbox].forEach(
    (element) => element.addEventListener('change', generatePassword),
  );
}
