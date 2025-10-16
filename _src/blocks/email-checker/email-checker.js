import {
  WindowLoadStartedEvent,
  WindowLoadedEvent,
  UserDetectedEvent,
  AdobeDataLayerService,
} from '@repobit/dex-data-layer';

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
  let message;
  let className;
  if (secondRequest.total_count === 0) {
    message = statusMessages.safe;
    changeTexts(block, 'safe', statusTitles, secondRequest.total_count);
    className = 'result safe';
  } else {
    message = statusMessages.leaks;
    changeTexts(block, 'leaks', statusTitles, secondRequest.total_count);
    className = 'result danger';
  }

  result.className = className;
  result.innerHTML = message;
  block.closest('.section').classList.add(className.split(' ')[1]);
  input.setAttribute('disabled', '');
  document.getElementById('inputDiv').textContent = email;
  input.closest('.input-container').classList.remove('loader-circle');

  AdobeDataLayerService.push(new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name += '';
    return pageLoadStartedInfo;
  }));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

async function resetChecker(block, titleText = '') {
  const classesToRemove = ['danger', 'safe'];
  const section = block.closest('.section');

  // Iterate over the classes and remove them from the section
  classesToRemove.forEach((className) => {
    if (section.classList.contains(className)) {
      section.classList.remove(className);
    }
  });

  // Reset the input and result elements
  const input = block.querySelector('#email-checker-input');
  const result = block.querySelector('.result');
  const h1 = block.querySelector('h1');
  input.removeAttribute('disabled');
  input.value = '';
  result.className = 'result';
  if (h1) {
    h1.textContent = titleText;
  }

  AdobeDataLayerService.push(new WindowLoadStartedEvent({}));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
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
      const status = parts[0].trim();
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
  const titleText = block.querySelector('h1')?.innerText;
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
          resetChecker(block, titleText);
        });
      }

      divWithButtons.appendChild(p);
    });
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

  button.addEventListener('click', () => checkLink(block, input, result, statusMessages, statusTitles));

  createButtonsContainer(block);
}
