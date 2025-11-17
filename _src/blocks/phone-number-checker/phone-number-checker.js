import page from '../../scripts/page.js';

let phoneUtil; let
  countries;

async function initValidatorLibrary() {
  // --- Step 0: dynamically load libphonenumber ---
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
  // --- Step 3: sanitize input ---
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

    // --- normalize to E.164 ---
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
    console.warn('Phone validation failed:', e);
    return invalid('please introduce a valid phone number');
  }
}

async function inlineFlagsInOptions() {
  await getCountryData();
  if (!countries) return null;
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

  const input = document.createElement('input');
  input.id = 'dropdown-input';
  input.type = 'text';
  input.value = defaultCountry.code;

  inputWrapper.append(triggerFlag, input);
  container.appendChild(inputWrapper);

  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown-list');
  container.appendChild(dropdown);

  function showDropdown() {
    dropdown.style.display = 'block';
    dropdown.classList.add('open');
  }

  function hideDropdown() {
    dropdown.style.display = 'none';
    dropdown.classList.remove('open');
  }

  function selectOption(country) {
    input.value = country.code;
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
        && !country.code.toLowerCase().includes(filter.toLowerCase())) return;

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

      const text = document.createElement('span');
      text.textContent = 'Invalid input';

      option.append(text);
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

  input.addEventListener('focus', () => {
    showDropdown();
    input.value = '';
    triggerFlag.src = '/_src/icons/search-icon.svg';
    input.placeholder = 'Search';
  });
  input.addEventListener('input', () => {
    renderOptions(input.value);
    triggerFlag.classList.remove('search-icon');
    showDropdown();
  });

  triggerFlag.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    input.value = '';
    triggerFlag.src = '/_src/icons/search-icon.svg';
    input.placeholder = 'Search';
  });

  input.addEventListener('keydown', (e) => {
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
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await resp.json();
  return json.result || json;
}

function xorEncode(input, key) {
  const bytes = [];
  for (let i = 0; i < input.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    bytes.push(charCode);
  }

  // Convert bytes array to base64 (browser-compatible)
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // btoa = base64 encode in browser
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

  const deviceId = 'test_device_id';
  const encryptedPhone = xorEncode(validated.sanitized, deviceId);

  console.log('Sanitized number:', validated.sanitized);
  console.log('Encrypted: ', encryptedPhone);
  const payload = {
    d: deviceId,
    v: '1.0.0-initial-version',
    phone: {
      phn: encryptedPhone,
      norm: encryptedPhone,
    },
  };

  const request = await fetchData(' https://internal.lambada.nmbapp.net/lambada/phone_checker/scan', payload);
  if (request.error) {
    if (request.erorr) {
      result.innerHTML = `${statusMessages.error ?? ''}`;
      result.className = 'result danger no-response';
      input.closest('.input-container').classList.remove('loader-circle');
      return;
    }
  }

  console.log('Received data:', request);

  let statusCode; let message; let className;
  if (request.status_code === 0) {
    statusCode = 'safe';
    message = statusMessages.safe;
    className = 'result safe';
  } else {
    statusCode = 'danger';
    message = statusMessages.danger;
    className = 'result danger';
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
        p.querySelector('a').classList.add('share-button');
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
    result.innerHTML = resultData.message;
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
  input.type = 'text';
  input.placeholder = `${placeholder ?? ''}`;
  input.id = 'phone-number-checker-input';

  const inputDiv = document.createElement('p');
  inputDiv.setAttribute('id', 'inputDiv');

  const divContainer = document.createElement('div');
  divContainer.className = 'input-container__container';
  divContainer.appendChild(input);
  block.prepend(inputDiv);

  const selectEl = await inlineFlagsInOptions();
  selectEl.value = page.country.toUpperCase();

  divContainer.prepend(selectEl);
  inputContainer.appendChild(divContainer);

  const button = document.createElement('button');
  button.textContent = checkButtonText ?? 'Check URL';
  button.classList.add('check-url');
  inputContainer.appendChild(button);

  const result = document.createElement('div');
  result.className = 'result';
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
    // Check if user has valid result data (came from digital-footprint-checker)
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

  button.addEventListener('click', () => checkPhoneNumber(block, input, result, statusMessages, statusTitles, statusSubtitles));

  input.addEventListener('paste', (event) => {
    event.preventDefault();

    const pastedText = event.clipboardData.getData('text');

    const country = detectCountry(parsePhoneNumber(pastedText, block));
    const countryData = countries.data.find((c) => c.ISO === country);
    const dropdownInput = block.querySelector('#dropdown-input');
    const dropdownFlag = block.querySelector('.dropdown-input-wrapper img');
    dropdownInput.value = countryData.code;
    input.value = pastedText.replace(countryData.code, '');
    dropdownFlag.src = countryData.flag;
  });
}
