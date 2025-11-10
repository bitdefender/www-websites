import page from '../../scripts/page.js';

function changeTexts(block, result, statusTitles, numberOfLeaks) {
  const titleText = statusTitles?.[result]?.replace('0', numberOfLeaks);
  const h1 = block.querySelector('h1');
  if (h1) {
    h1.innerHTML = titleText;
  }
}

async function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData(url, body) {
  const resp = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  const json = await resp.json();
  return json.result || json;
}

async function checkLink(block, input, result, statusMessages, statusTitles) {
  const email = input.value.trim();
  const { invalidEmailText } = block.closest('.section').dataset;
  const isValidEmail = (emailInput) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailInput.toLowerCase());
  };

  if (!email || !isValidEmail(email)) {
    result.textContent = `${invalidEmailText ?? ''}`;
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');

  const firstRequest = await fetchData('https://nimbus.bitdefender.net/lid/privacy_check', {
    id: 1,
    jsonrpc: '2.0',
    method: 'on_demand_scan',
    params: {
      app_id: 'com.bitdefender.vpn',
      type: 'emails',
      value: email,
    },
  });

  if (firstRequest.erorr) {
    result.innerHTML = `${statusMessages.error ?? ''}`;
    result.className = 'result danger no-response';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  await sleep(1000);

  const secondRequest = await fetchData('https://nimbus.bitdefender.net/lid/privacy_check', {
    id: 2,
    jsonrpc: '2.0',
    method: 'get_on_demand_issues',
    params: { scan_id: firstRequest.scan_id },
  });

  if (secondRequest.error) {
    result.innerHTML = `${statusMessages.error ?? ''}`;
    result.className = 'result danger no-response';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  await sleep(1000);
  let statusCode; let message; let className;
  const leaksNumber = secondRequest.total_count;
  if (leaksNumber === 0) {
    statusCode = 'safe';
    message = statusMessages.safe;
    className = 'result safe';
  } else {
    statusCode = 'leaks';
    message = statusMessages.leaks;
    className = 'result danger';
  }

  const resultPagePath = statusCode === 'safe' ? '/safe' : '/not-safe';
  if (resultPagePath) {
    // Store the result data for the result page
    sessionStorage.setItem('emailCheckerResult', JSON.stringify({
      email,
      message,
      statusCode,
      className,
      statusTitles,
      leaksNumber,
    }));

    // Redirect to the appropriate result page
    window.location.href = `${window.location.pathname}${resultPagePath}`;
  }
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
      const link = p.querySelector('a');
      if (link.href.includes('#check-another')) {
        p.querySelector('a').classList.add('check-another-button');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.replace(`${window.location.origin}/${page.locale}/consumer/digital-footprint-checker`);
        });
      }

      divWithButtons.appendChild(p);
    });
  }
}

function createExternalInput(inputDiv) {
  const buttons = document.querySelectorAll('a[href*="#external-input"]');
  const mainInput = document.querySelector('#email-checker-input');

  if (!mainInput) return;

  // Keep track of all inputs for syncing
  const allInputs = [mainInput];

  buttons.forEach((button) => {
    const container = button.closest('.button-container');
    if (!container || !inputDiv) return;

    // Clone the inputDiv (keep HTML as-is)
    const clone = inputDiv.cloneNode(true);
    container.replaceWith(clone);

    const externalInput = clone.querySelector('input');
    const scrollButton = clone.querySelector('button');
    if (scrollButton) {
      scrollButton.addEventListener('click', (e) => {
        e.preventDefault();
        mainInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        mainInput.focus();
      });
    }
    if (!externalInput) return;
    allInputs.push(externalInput);
  });

  // Add event listeners to sync all inputs
  allInputs.forEach((input) => {
    input.addEventListener('input', () => {
      const { value } = input;
      allInputs.forEach((otherInput) => {
        if (otherInput !== input) otherInput.value = value;
      });
    });
  });
}

function displayStoredResult(block, statusMessages, statusTitles) {
  // Check if we have stored result data
  const storedData = sessionStorage.getItem('emailCheckerResult');

  if (!storedData) {
    return false;
  }

  try {
    const resultData = JSON.parse(storedData);

    // Check if the data is not too old (expires after 1 hour)
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - resultData.timestamp > oneHour) {
      sessionStorage.removeItem('emaiCheckerResult');
      return false;
    }

    // Get form elements
    const input = block.querySelector('#email-checker-input');
    const result = block.querySelector('.result');

    if (!input || !result) {
      return false;
    }

    // Display the stored result
    input.value = resultData.url;
    input.setAttribute('disabled', '');
    document.getElementById('inputDiv').textContent = resultData.email;
    result.innerHTML = resultData.message;
    result.className = resultData.className;
    block.closest('.section').classList.add(resultData.className.split(' ')[1]);

    // Update titles
    const { statusCode, leaksNumber } = resultData;
    changeTexts(block, statusCode, statusTitles, leaksNumber);

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
    sessionStorage.removeItem('linkCheckerResult');
    return false;
  }
}

export default function decorate(block) {
  const { checkButtonText, placeholder } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(3)');
  privacyPolicyDiv.classList.add('privacy-policy');

  const statusMessages = createStatusMessages(block);
  const statusTitles = createStatusTitles(block);

  const formContainer = document.createElement('div');
  formContainer.classList.add('email-checker-form');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  formContainer.appendChild(inputContainer);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `${placeholder ?? ''}`;
  input.id = 'email-checker-input';

  const inputDiv = document.createElement('p');
  inputDiv.setAttribute('id', 'inputDiv');

  const divContainer = document.createElement('div');
  divContainer.className = 'input-container__container';
  divContainer.appendChild(input);
  block.prepend(inputDiv);
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
  createExternalInput(inputContainer);

  // Check if we're on a result page and should display stored results
  const currentPath = window.location.pathname;
  const isResultPage = currentPath.includes('digital-footprint-checker/safe') || currentPath.includes('digital-footprint-checker/not-safe');

  if (isResultPage) {
    // Check if user has valid result data (came from digital-footprint-checker)
    const hasValidResult = displayStoredResult(block, statusMessages, statusTitles);

    if (!hasValidResult) {
      // No valid result data means direct URL access - redirect to main page
      window.location.replace(`${window.location.origin}/${page.locale}/consumer/digital-footprint-checker`);
      return;
    }

    // Set up cleanup when user navigates away (but not on reload)
    window.addEventListener('beforeunload', () => {
      // Only clear data if it's not a reload (navigation away)
      const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      if (navigationType !== 'reload') {
        sessionStorage.removeItem('emailCheckerResult');
      }
    });
  }

  // if the text is cleared, do not display any error
  input.addEventListener('input', () => {
    const url = input.value.trim();
    // If the input is cleared, reset the result text and class
    if (url === '') {
      result.textContent = '';
      result.className = '';
    }
  });

  document.querySelectorAll('button.check-url').forEach((checkButton) => checkButton.addEventListener('click', () => checkLink(block, input, result, statusMessages, statusTitles)));
}
