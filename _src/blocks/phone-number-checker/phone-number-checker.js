import { UserAgent } from '@repobit/dex-utils';
import page from '../../scripts/page.js';
import { BotPrevention } from '../../scripts/utils/bot-prevention.js';

let phoneUtil; let
  countries;

const sharedPrefixMap = {
  '+1': 'United States',
  '+358': 'Finland',
  '+61': 'Australia',
  '+599': 'Curaçao',
  '+590': 'Guadeloupe',
  '+44': 'United Kingdom',
  '+39': 'Italy',
  '+212': 'Morocco',
  '+262': 'Réunion',
  '+47': 'Norway',
  '+7': 'Russia',
};

async function initValidatorLibrary() {
  // load libphonenumber
  if (typeof window.libphonenumber === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/google-libphonenumber@3.2.31/dist/libphonenumber.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  phoneUtil = window.libphonenumber.PhoneNumberUtil.getInstance();
}

function detectCountry(number) {
  return phoneUtil.getRegionCodeForNumber(number);
}

function parsePhoneNumber(number, block) {
  // sanitize input
  const sanitized = number.replace(/[\s\-.()]/g, '');
  const countryPrefix = block.querySelector('#dropdown-input').value;
  let parsed;
  if (sanitized.startsWith('+')) {
    parsed = phoneUtil.parse(sanitized);
  } else {
    parsed = phoneUtil.parse(`${countryPrefix}${sanitized}`);
  }

  return parsed;
}

async function getCountryData() {
  const url = '/common/country-codes.json';
  const res = await fetch(url);
  if (!res.ok) countries = null;
  const countriesData = await res.json();
  countries = countriesData;
}

function changeTexts(block, result, statusTitles, statusSubtitles) {
  const h1 = block.querySelector('h1');
  const subtitle = block.querySelector('p:not(:has(img)):not(#inputDiv)');

  if (h1) {
    h1.innerHTML = statusTitles?.[result] ?? '';
  }

  if (subtitle) {
    subtitle.innerHTML = statusSubtitles?.[result] ?? '';
  }
}

function invalid(msg) {
  return {
    isValid: false,
    sanitized: null,
    countryCode: null,
    countryIso: null,
    error: msg,
  };
}

function validatePhoneNumber(input, block) {
  if (/[a-zA-Z]/.test(input)) {
    return invalid('please introduce a valid phone number 2');
  }

  try {
    const parsed = parsePhoneNumber(input, block);

    const isValid = phoneUtil.isValidNumber(parsed);
    if (!isValid) return invalid('please introduce a valid phone number 3');

    // normalize to E.164
    const e164 = phoneUtil.format(parsed, window.libphonenumber.PhoneNumberFormat.E164);
    const countryCode = `+${parsed.getCountryCode()}`;
    const countryIso = phoneUtil.getRegionCodeForNumber(parsed);

    return {
      isValid: true,
      sanitized: e164,
      countryCode,
      countryIso,
    };
  } catch (e) {
    return invalid('please introduce a valid phone number');
  }
}

async function createDropdown(block) {
  await getCountryData();
  if (!countries) return null;
  const { dropdownPlaceholder, dropdownNotFound } = block.closest('.section').dataset;
  const defaultCountryISO = page?.country?.toUpperCase();
  const defaultCountry = countries.data.find((c) => c.ISO === defaultCountryISO)
   || countries.data[0];

  const container = document.createElement('div');
  container.classList.add('country-dropdown-container');

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('dropdown-input-wrapper');

  const triggerFlag = document.createElement('img');
  triggerFlag.classList.add('flag');
  triggerFlag.src = defaultCountry.flag;

  const dropdownInput = document.createElement('input');
  dropdownInput.setAttribute('autocomplete', 'off');
  dropdownInput.id = 'dropdown-input';
  dropdownInput.type = 'text';
  dropdownInput.value = defaultCountry.code;

  inputWrapper.append(triggerFlag, dropdownInput);
  container.appendChild(inputWrapper);

  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown-list');
  container.appendChild(dropdown);

  function showDropdown() {
    dropdown.style.display = 'block';
    dropdown.classList.add('open');
    dropdown.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  function activateSearchState() {
    triggerFlag.src = '/_src/icons/search-icon.svg';
    dropdownInput.placeholder = dropdownPlaceholder ?? '';
    dropdownInput.value = '';
  }

  function hideDropdown() {
    dropdown.style.display = 'none';
    dropdown.classList.remove('open');
  }

  function selectOption(country) {
    dropdownInput.value = country.code;
    triggerFlag.src = country.flag;
    hideDropdown();
  }

  let options = [];
  let highlightedIndex = -1;

  function renderOptions(filter = '') {
    dropdown.innerHTML = '';
    options = [];
    countries.data.forEach((country) => {
      if (!country.country.toLowerCase().startsWith(filter.toLowerCase())
        && !country.code.toLowerCase().includes(filter.toLowerCase())
        && !country.ISO.toLowerCase().startsWith(filter.toLowerCase())) return;

      const option = document.createElement('div');
      option.classList.add('dropdown-option');
      option.name = country.country;

      const text = document.createElement('span');
      text.textContent = country.code;

      const name = document.createElement('span');
      name.textContent = country.country;

      const flag = document.createElement('img');
      flag.src = country.flag;

      option.append(flag, text, name);
      dropdown.appendChild(option);
      options.push(option);

      option.addEventListener('click', () => selectOption(country));
    });

    if (!options.length) {
      const option = document.createElement('div');
      option.classList.add('dropdown-option');

      const notfoundText = document.createElement('span');
      notfoundText.classList.add('not-found');
      notfoundText.textContent = dropdownNotFound ?? '';

      option.append(notfoundText);
      dropdown.appendChild(option);
      options.push(option);
    }

    highlightedIndex = -1;
  }

  function updateHighlight() {
    options.forEach((opt, i) => {
      opt.style.background = i === highlightedIndex ? '#e0e0e0' : '#fff';
    });

    if (highlightedIndex >= 0 && options[highlightedIndex]) {
      options[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  dropdownInput.addEventListener('focus', () => {
    showDropdown();
    activateSearchState();
  });

  dropdownInput.addEventListener('input', () => {
    renderOptions(dropdownInput.value);
    triggerFlag.classList.remove('search-icon');
    showDropdown();
  });

  triggerFlag.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    activateSearchState();
  });

  dropdownInput.addEventListener('keydown', (e) => {
    if (dropdown.style.display !== 'block') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (highlightedIndex < options.length - 1) highlightedIndex += 1;
      updateHighlight();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (highlightedIndex > 0) highlightedIndex -= 1;
      updateHighlight();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        options[highlightedIndex].click();
      }
    }

    if (e.key === 'Tab') {
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        options[highlightedIndex].click();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) hideDropdown();
  });

  renderOptions();

  return container;
}

async function fetchData(url, body) {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nimbus-ClientID': '95171ee6-2565-4033-859d-42c790048a24',
      },
      body: JSON.stringify(body),
    });
    const json = await resp.json();
    return json.result || json;
  } catch {
    return {
      error: true,
    };
  }
}

function getPrefix(block) {
  const prefixInput = block.querySelector('#dropdown-input');
  return prefixInput?.value;
}

// eslint-disable-next-line max-len
async function checkPhoneNumber(block, input, result, statusMessages, statusTitles, statusSubtitles) {
  const phoneNumberInput = input.value.trim();
  const prefix = getPrefix(block);
  const { invalidEmailText } = block.closest('.section').dataset;
  if (!phoneNumberInput || !prefix) {
    result.textContent = `${invalidEmailText ?? ''}`;
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');

  const phoneNumber = `${prefix}${phoneNumberInput}`;
  const validated = validatePhoneNumber(phoneNumber, block);

  if (!validated.isValid) {
    result.textContent = `${invalidEmailText ?? ''}`;
    result.className = 'result danger';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  const payload = {
    jsonrpc: '2.0',
    id: 112,
    method: 'checkPhone',
    params: {
      connect_source: {
        app_id: 'com.bitdefender.website',
        device_id: 'website',
      },
      phone: `${phoneNumber}`,
    },
  };
  const request = await fetchData('https://eu.nimbus.bitdefender.net/phone-checker', payload);
  if (request.error) {
    result.innerHTML = `${statusMessages.error ?? ''}`;
    result.className = 'result danger no-response';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  const solvedChallenge = await BotPrevention.solveChallange(request);

  const solutionPayload = {
    jsonrpc: '2.0',
    id: 112,
    method: 'checkPhone',
    params: {
      connect_source: {
        app_id: 'com.bitdefender.website',
        device_id: 'website',
      },
      pow_challenge: request.pow_challenge,
      pow_solution: solvedChallenge.nonces,
      phone: `${phoneNumber}`,
    },
  };

  const secondRequest = await fetchData('https://eu.nimbus.bitdefender.net/phone-checker', solutionPayload);

  let statusCode; let message; let className;

  switch (secondRequest.status_code) {
    case 0:
      statusCode = 'safe';
      message = statusMessages.safe;
      className = 'result safe';
      break;

    case 1:
      statusCode = 'danger';
      message = statusMessages.danger;
      className = 'result danger';
      break;

    default:
      result.innerHTML = `${statusMessages.error ?? ''}`;
      result.className = 'result danger no-response';
      input.closest('.input-container').classList.remove('loader-circle');
      break;
  }

  const resultPagePath = statusCode === 'safe' ? '/might-be-safe' : '/marked-as-spam-or-scam';
  if (resultPagePath) {
    // Store the result data for the result page
    sessionStorage.setItem('phoneCheckerResult', JSON.stringify({
      phoneNumber,
      statusTitles,
      statusSubtitles,
      message,
      statusCode,
      className,
    }));

    window.location.href = `${window.location.pathname}${resultPagePath}`;
  }
}

function getTrialMessage(block, message) {
  const { iosTrial, androidTrial, desktopTrial } = block.closest('.section').dataset;
  if (!iosTrial || !androidTrial || !desktopTrial) return '';
  let trialProduct; let trialPeriod;
  switch (UserAgent.os) {
    case 'ios':
      [trialProduct, trialPeriod] = iosTrial.split('-');
      break;
    case 'android':
      [trialProduct, trialPeriod] = androidTrial.split('-');
      break;
    default:
      [trialProduct, trialPeriod] = desktopTrial.split('-');
      break;
  }

  return message.replace('{PROD}', trialProduct).replace('0', trialPeriod.trim());
}

function createStatusSubtitles(block) {
  const statusSubtitles = {};

  const divWithstatusSubtitles = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<status-subtitles>');
  });

  if (!divWithstatusSubtitles) return statusSubtitles;

  const pElements = divWithstatusSubtitles.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<status-subtitles>"
  pElements.forEach((p, index) => {
    if (index === 0) return;
    const parts = p.innerHTML.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim().replace('<br>', '');
      const substitle = parts.slice(1).join(':').trim().replace('<br>', '');
      statusSubtitles[status.toLowerCase()] = substitle;
    }
  });

  divWithstatusSubtitles.remove();
  return statusSubtitles;
}

function createStatusMessages(block) {
  const statusMessages = {};

  const divWithStatusMessages = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<status-messages>');
  });

  if (!divWithStatusMessages) return statusMessages;

  const pElements = divWithStatusMessages.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<status-messages>"
  pElements.forEach((p, index) => {
    if (index === 0) return;
    const parts = p.innerHTML.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim().replace('<br>', '');
      const message = parts.slice(1).join(':').trim().replace('<br>', '');
      statusMessages[status.toLowerCase()] = message;
    }
  });

  return statusMessages;
}

function createStatusTitles(block) {
  const statusTitles = {};

  const divWithstatusTitles = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<titles-change>');
  });

  if (!divWithstatusTitles) return statusTitles;

  divWithstatusTitles.classList.add('status-titles');
  const pElements = divWithstatusTitles.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<titles-change>"
  pElements.forEach((p, index) => {
    if (index === 0) return;

    // Remove <br> tags and trim spaces
    const cleanText = p.innerHTML.replace(/<br\s*\/?>/gi, '').trim();
    const parts = cleanText.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim();
      const message = parts.slice(1).join(':').trim();
      statusTitles[status.toLowerCase()] = message;
    }
  });

  // Remove the div from the DOM after parsing
  divWithstatusTitles.remove();
  return statusTitles;
}

function createButtonsContainer(block) {
  const divWithButtons = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<buttons>');
  });

  if (divWithButtons) {
    divWithButtons.classList.add('buttons-container');
    const pElements = divWithButtons.querySelectorAll('p');
    divWithButtons.querySelector('div').remove();
    // Skip the first <p> if it contains a header like "<titles-change>"
    pElements.forEach((p, index) => {
      if (index === 0) {
        p.remove();
        return;
      }

      if (index === 1) {
        const button = p.querySelector('a');
        button.classList.add('share-button');
        button.setAttribute('data-layer-ignore', 'true');
      }

      const checkAnotherButton = p.querySelector('a');
      if (checkAnotherButton?.href.includes('#check-another')) {
        p.querySelector('a').classList.add('check-another-button');
        checkAnotherButton.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.replace(`${window.location.origin}/${page.locale}/consumer/reverse-phone-lookup`);
        });
      }

      divWithButtons.appendChild(p);
    });
  }
}

function displayStoredResult(block, statusMessages, statusTitles, statusSubtitles) {
  // Check if we have stored result data
  const storedData = sessionStorage.getItem('phoneCheckerResult');
  if (!storedData) {
    return false;
  }

  try {
    const resultData = JSON.parse(storedData);

    // Check if the data is not too old (expires after 1 hour)
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - resultData.timestamp > oneHour) {
      sessionStorage.removeItem('phoneCheckerResult');
      return false;
    }

    // Get form elements
    const input = block.querySelector('#phone-number-checker-input');
    const dropdown = block.querySelector('.country-dropdown-container');
    if (dropdown) dropdown.remove();

    const result = block.querySelector('.result');

    if (!input || !result) {
      return false;
    }

    // Display the stored result
    input.value = resultData.url;
    input.setAttribute('disabled', '');
    document.getElementById('inputDiv').textContent = resultData.phoneNumber;
    result.innerHTML = getTrialMessage(block, resultData.message);
    result.className = resultData.className;
    block.closest('.section').classList.add(resultData.className.split(' ')[1]);

    // Update titles
    const { statusCode } = resultData;
    changeTexts(block, statusCode, statusTitles, statusSubtitles);

    // Show buttons and hide input elements for result display
    const buttonsContainer = block.querySelector('.buttons-container');
    if (buttonsContainer) {
      buttonsContainer.style.display = 'flex';
    }

    // Don't clear the stored data here - keep it for reload detection
    // It will be cleared when user reloads or after 1 hour expiration

    return true;
  } catch (error) {
    // If there's an error parsing the data, clean up
    sessionStorage.removeItem('phoneCheckerResult');
    return false;
  }
}

export default async function decorate(block) {
  await initValidatorLibrary();
  const { checkButtonText, placeholder } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(4)');
  privacyPolicyDiv.classList.add('privacy-policy');

  const statusMessages = createStatusMessages(block);
  const statusTitles = createStatusTitles(block);
  const statusSubtitles = createStatusSubtitles(block);

  const formContainer = document.createElement('div');
  formContainer.classList.add('phone-number-checker-form');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  formContainer.appendChild(inputContainer);

  const input = document.createElement('input');

  const result = document.createElement('div');
  result.className = 'result';

  // eslint-disable-next-line max-len
  const handler = () => checkPhoneNumber(block, input, result, statusMessages, statusTitles, statusSubtitles);

  input.type = 'text';
  input.placeholder = `${placeholder ?? ''}`;
  input.id = 'phone-number-checker-input';
  input.setAttribute('inputmode', 'numeric');
  input.addEventListener('input', () => {
    if (input.value.startsWith('00') || input.value.startsWith('+')) {
      const cleanedValue = input.value.replace('00', '+');
      const dropdownInput = block.querySelector('#dropdown-input');
      const dropdownFlag = block.querySelector('.dropdown-input-wrapper img');
      let foundCountry = sharedPrefixMap[cleanedValue];
      if (foundCountry) {
        foundCountry = countries.data.find((c) => c.country === foundCountry);
        if (foundCountry) {
          dropdownFlag.src = foundCountry.flag;
          dropdownInput.value = foundCountry.code;
          input.value = '';
        }
      } else {
        foundCountry = countries.data.find((c) => c.code === cleanedValue);
        if (foundCountry) {
          dropdownFlag.src = foundCountry.flag;
          dropdownInput.value = foundCountry.code;
          input.value = '';
        }
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handler();
    }
  });

  input.addEventListener('paste', (event) => {
    event.preventDefault();
    let pastedText = event.clipboardData.getData('text');

    try {
      if (pastedText.startsWith('00')) pastedText = pastedText.replace('00', '+');
      const country = detectCountry(parsePhoneNumber(pastedText, block));
      const countryData = countries.data.find((c) => c.ISO === country);
      const dropdownInput = block.querySelector('#dropdown-input');
      const dropdownFlag = block.querySelector('.dropdown-input-wrapper img');
      dropdownInput.value = countryData.code;
      input.value = pastedText.replace(countryData.code, '');
      dropdownFlag.src = countryData.flag;
    } catch (error) {
      // if the input is invalid or incomplete (prefix already selected)
      // phoneUtil will throw an error => fallback to standard paste
      input.value = pastedText;
    }
  });

  const inputDiv = document.createElement('p');
  inputDiv.setAttribute('id', 'inputDiv');

  const pasteElement = document.createElement('span');
  pasteElement.id = 'paste-from-clipboard';
  pasteElement.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();

      const data = new DataTransfer();
      data.setData('text/plain', text);

      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: data,
      });

      input.dispatchEvent(pasteEvent);
    } catch (err) {
      // do nothing
    }
  });

  const divContainer = document.createElement('div');
  divContainer.className = 'input-container__container';
  divContainer.appendChild(input);
  divContainer.appendChild(pasteElement);
  block.prepend(inputDiv);

  const selectEl = await createDropdown(block);
  selectEl.value = page.country.toUpperCase();

  divContainer.prepend(selectEl);
  inputContainer.appendChild(divContainer);

  const button = document.createElement('button');
  button.textContent = checkButtonText ?? 'Check URL';
  button.classList.add('check-url');
  inputContainer.appendChild(button);

  formContainer.appendChild(result);

  block.querySelectorAll(':scope > div')[1].replaceWith(formContainer);
  const [safeImage, dangerImage] = block.querySelectorAll('picture');
  safeImage.classList.add('safe-image');
  dangerImage.classList.add('danger-image');

  createButtonsContainer(block);

  // Check if we're on a result page and should display stored results
  const currentPath = window.location.pathname;
  const isResultPage = currentPath.includes('/reverse-phone-lookup/might-be-safe') || currentPath.includes('/reverse-phone-lookup/marked-as-spam-or-scam');

  if (isResultPage) {
    // Check if user has valid result data (came from reverse-phone-lookup)
    // eslint-disable-next-line max-len
    const hasValidResult = displayStoredResult(block, statusMessages, statusTitles, statusSubtitles);
    if (!hasValidResult) {
      // No valid result data means direct URL access - redirect to main page
      window.location.replace(`${window.location.origin}/${page.locale}/consumer/reverse-phone-lookup`);
      return;
    }

    // Set up cleanup when user navigates away (but not on reload)
    window.addEventListener('beforeunload', () => {
      // Only clear data if it's not a reload (navigation away)
      const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      if (navigationType !== 'reload') {
        sessionStorage.removeItem('phoneCheckerResult');
      }
    });
  }

  button.addEventListener('click', handler);
}
