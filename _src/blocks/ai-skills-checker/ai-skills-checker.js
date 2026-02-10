import {
  WindowLoadStartedEvent,
  WindowLoadedEvent,
  UserDetectedEvent,
  AdobeDataLayerService,
} from '@repobit/dex-data-layer';

import page from '../../scripts/page.js';

function changeTexts(block, statusCode, statusTitles) {
  const titleText = statusTitles[statusCode] || statusTitles.default;
  const h1 = block.querySelector('h1');
  if (h1) {
    h1.textContent = titleText;
  }
}

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' // validate protocol
      + '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|' // validate domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // validate OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' // validate port and path
      + '(\\?[;&a-z\\d%\\/_@.~+=-]*)?' // validate query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return urlPattern.test(urlString);
};

async function checkSkillLink(block, input, result, statusMessages, statusTitles) {
  const inputUrl = input.value.trim();
  if (!inputUrl || !isValidUrl(inputUrl)) {
    result.textContent = 'Please enter a valid URL';
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');

  const response = await fetch('https://nimbus.bitdefender.net/skills/checker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'scan_url',
      url: inputUrl,
    }),
  });

  if (!response.ok) {
    result.textContent = 'Please enter a valid skill URL';
    result.className = 'result danger';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  const data = await response.json();
  let message; let statusCode; let
    className;

  switch (data.risk_level) {
    case 'CLEAN':
      statusCode = 'safe';
      message = statusMessages.safe;
      className = 'result safe';
      break;

    case 'CRITICAL':
      statusCode = 'danger';
      message = statusMessages.default;
      className = 'result danger';
      break;

    default:
      result.innerHTML = `${statusMessages.error ?? ''}`;
      result.className = 'result danger no-response';
      input.closest('.input-container').classList.remove('loader-circle');
      break;
  }

  result.innerHTML = message;
  if (data.risk_level !== 'CLEAN') {
    result.innerHTML = `${data.findings.map((finding) => `<code>${finding.content ?? ''}</code><br>
      <strong>Description: ${finding.description ?? ''}</strong><hr>`).join('')} 
      ${message}`;
  }

  result.className = className;
  block.closest('.section').classList.add(className.split(' ')[1]);
  input.setAttribute('disabled', '');
  document.getElementById('inputDiv').textContent = inputUrl;

  changeTexts(block, statusCode, statusTitles);
  input.closest('.input-container').classList.remove('loader-circle');

  AdobeDataLayerService.push(new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name += `:${statusCode}`;
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
  const input = block.querySelector('#ai-skills-checker-input');
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

  const pElements = divWithStatusMessages.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<status-messages>"
  pElements.forEach((p, index) => {
    if (index === 0) {
      return;
    }

    const parts = p.innerHTML.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim();
      const message = parts.slice(1).join(':').trim();
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

  divWithstatusTitles.classList.add('status-titles');
  const pElements = divWithstatusTitles.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<titles-change>"
  pElements.forEach((p, index) => {
    if (index === 0) {
      return;
    }

    const parts = p.textContent.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim();
      const message = parts.slice(1).join(':').trim();
      statusTitles[status.toLowerCase()] = message;
    }
  });

  // remove the div from the dom, as it is already parsed and we don't need it anymore
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
      if (!link) return;
      
      if ( link.href.includes('/fragments/')) {
        p.querySelector('a').classList.add('share-button');
      }

      divWithButtons.appendChild(p);
      if (link.href.includes('#check-another')) {
        link.classList.add('check-another-button');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const currentPath = window.location.pathname;
          if (currentPath.includes('/ai-skills-checker/') && page.locale === 'en-us') {
            window.location.href = '/en-us/consumer/ai-skills-checker';
          } else {
            resetChecker(block, titleText);
          }
        });
      }
    });
  }
}

export default function decorate(block) {
  const { checkButtonText, product, pasteLinkText } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(3)');
  privacyPolicyDiv.classList.add('privacy-policy');

  if (product) {
    // eslint-disable-next-line no-unused-vars
    const [productName, productUsers, productYears] = product.split('/');
    block.setAttribute('data-store-id', productName);
  }

  const statusMessages = createStatusMessages(block);
  const statusTitles = createStatusTitles(block);

  const formContainer = document.createElement('div');
  formContainer.classList.add('ai-skills-checker-form');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  formContainer.appendChild(inputContainer);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = pasteLinkText ?? 'example-url.com';
  input.id = 'ai-skills-checker-input';

  const copyElement = document.createElement('span');
  copyElement.id = 'copy-to-clipboard';

  const inputDiv = document.createElement('p');
  inputDiv.setAttribute('id', 'inputDiv');

  const divContainer = document.createElement('div');
  divContainer.className = 'input-container__container';
  divContainer.appendChild(input);
  block.prepend(inputDiv);
  divContainer.appendChild(copyElement);

  inputContainer.appendChild(divContainer);

  copyElement.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value += text;
    } catch (error) {
      // continue regardless of error
    }
  });

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

  button.addEventListener('click', () => checkSkillLink(block, input, result, statusMessages, statusTitles));

  createButtonsContainer(block);

  // if the text is cleared, do not display any error
  input.addEventListener('input', () => {
    const url = input.value.trim();
    // If the input is cleared, reset the result text and class
    if (url === '') {
      result.textContent = '';
      result.className = '';
    }
  });
  input.addEventListener('paste', () => {
    result.textContent = '';
    result.className = '';
  });
}
