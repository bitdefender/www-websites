import {
  WindowLoadStartedEvent,
  WindowLoadedEvent,
  UserDetectedEvent,
  AdobeDataLayerService,
} from '@repobit/dex-data-layer';
import {
  BotPrevention,
} from '../../scripts/utils/bot-prevention.js';

class StatusMessageFactory {
  static createMessage(status, url, statusMessages) {
    let urlObject = url;
    // Ensure the URL has a protocol
    if (!/^https?:\/\//i.test(url)) {
      urlObject = `http://${url}`;
    }
    urlObject = new URL(urlObject);

    // Ensure the URL contains www
    if (!urlObject.hostname.startsWith('www.')) {
      urlObject.hostname = `www.${urlObject.hostname}`;
    }

    // Manually defined mapping of number keys to status strings
    const numberToStatusMap = {
      1: 'safe',
      2: 'so_far_so_good_1',
      3: 'so_far_so_good_2',
      4: 'malware &amp; phishing',
      5: 'malware',
      6: 'c&amp;c',
      7: 'malvertising &amp; fraud &amp; phishing',
      8: 'fraud',
      9: 'phishing',
      10: 'malvertising',
      11: 'pua',
      12: 'homograph',
      13: 'miner',
      14: 'miner-server',
      15: 'spam',
      16: 'malware-hd',
      17: 'untrusted',
      18: 'malicious',
      other: 'other',
    };
    const mappedStatus = numberToStatusMap[status] || numberToStatusMap.other;
    const isSafe = mappedStatus.includes('safe')
                 || mappedStatus.includes('so_far_so_good_1')
                 || mappedStatus.includes('so_far_so_good_2');
    let msg;
    if (statusMessages[mappedStatus.toLowerCase()]) {
      msg = statusMessages[mappedStatus.toLowerCase()];
    }
    if (!statusMessages[mappedStatus.toLowerCase()] && isSafe) {
      msg = statusMessages['default-good'];
    }
    if (!statusMessages[mappedStatus.toLowerCase()] && !isSafe) {
      msg = statusMessages.default;
    }

    msg = msg.replace('<domain-name>', urlObject.hostname);
    if (msg) {
      return { text: msg, className: isSafe ? 'result safe' : 'result danger', status: mappedStatus };
    }
    return { text: `Status: ${mappedStatus}`, className: 'result warning' };
  }
}

function changeTexts(block, result, statusTitles) {
  const titleText = statusTitles[result.status.toLowerCase()] || statusTitles.default;
  block.querySelector('h1').textContent = titleText;
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

async function checkLink(block, input, result, statusMessages, statusTitles) {
  const url = input.value.trim();
  if (!url || !isValidUrl(url)) {
    result.textContent = 'Please enter a valid URL';
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');
  let response = await fetch('https://eu.nimbus.bitdefender.net/tools/link-checker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nimbus-ClientID': '81b10964-a3c1-44f6-b5ac-7eac82db3ab1',
    },
    body: JSON.stringify({ url }),
  });

  if (response.status === 401) {
    const challengeData = await response.json();
    const solvedChallenge = await BotPrevention.solveChallange(challengeData);
    response = await fetch('https://eu.nimbus.bitdefender.net/tools/link-checker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nimbus-ClientID': '81b10964-a3c1-44f6-b5ac-7eac82db3ab1',
      },
      // eslint-disable-next-line max-len
      body: JSON.stringify({ url, pow_challenge: challengeData.pow_challenge, pow_solution: solvedChallenge.nonces }),
    });
  }

  if (!response.ok) {
    result.innerHTML = `
      <strong>Something went wrong</strong><br>
      The system encountered an error while trying to check the link you provided. Please try again in a few minutes.`;
    result.className = 'result danger no-response';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  const data = await response.json();
  const { status } = data;
  const message = StatusMessageFactory.createMessage(status, url, statusMessages);
  result.innerHTML = message.text;
  result.className = message.className;
  block.closest('.section').classList.add(message.className.split(' ')[1]);
  input.setAttribute('disabled', '');
  document.getElementById('inputDiv').textContent = url;

  changeTexts(block, message, statusTitles);
  input.closest('.input-container').classList.remove('loader-circle');

  AdobeDataLayerService.push(new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name += `:${message.status}`;
    return pageLoadStartedInfo;
  }));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

async function resetChecker(block) {
  const classesToRemove = ['danger', 'safe'];
  const section = block.closest('.section');

  // Iterate over the classes and remove them from the section
  classesToRemove.forEach((className) => {
    if (section.classList.contains(className)) {
      section.classList.remove(className);
    }
  });

  // Reset the input and result elements
  const input = block.querySelector('#link-checker-input');
  const result = block.querySelector('.result');
  const h1 = block.querySelector('h1');
  input.removeAttribute('disabled');
  input.value = '';
  result.className = 'result';
  h1.textContent = 'Is This Link Really Safe?';

  AdobeDataLayerService.push(new WindowLoadStartedEvent({}));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

function createSharePopup(element) {
  element.style.maxWidth = `${element.offsetWidth}px`;
  element.style.maxHeight = `${element.offsetHeight}px`;
  const sharePopup = document.createElement('div');
  sharePopup.classList.add('share-popup');
  element.insertAdjacentElement('beforeend', sharePopup);
  return sharePopup;
}

function copyToClipboard(block, caller, popupText) {
  const copyText = window.location.href;

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);
  const buttonsContainer = block.querySelector('.buttons-container');
  if (buttonsContainer) {
    const sharePopup = block.querySelector('.share-popup') || createSharePopup(caller);
    sharePopup.textContent = `${popupText}`;
    const translateXValue = Math.abs((sharePopup.offsetWidth - caller.offsetWidth) / 2);
    sharePopup.style = `transform:translateX(-${translateXValue}px); opacity: 1`;
    setTimeout(() => {
      sharePopup.style = `transform:translateX(-${translateXValue}px); opacity:0;`;
    }, 2000);
  }
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

function createButtonsContainer(block, formContainer, clipboardText) {
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

      if (index === 2) {
        p.querySelector('a').classList.add('check-another-button');
      }
      divWithButtons.appendChild(p);
      const link = p.querySelector('a');
      if (link.href.includes('#check-another')) {
        link.addEventListener('click', () => resetChecker(block));
      }
    });

    return;
  }

  // this remains here for compatibility purposes
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const shareButton = document.createElement('button');
  shareButton.innerHTML = '<span>Share Link Checker</span>';
  shareButton.classList.add('share-button');

  const checkAnother = document.createElement('button');
  checkAnother.innerHTML = '<span>Check Another Link</span>';
  checkAnother.classList.add('check-another-button');

  buttonsContainer.appendChild(shareButton);
  buttonsContainer.appendChild(checkAnother);
  formContainer.appendChild(buttonsContainer);

  checkAnother.addEventListener('click', () => resetChecker(block));
  if (clipboardText) {
    shareButton.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(block, shareButton, clipboardText);
    });
  }
}

export default function decorate(block) {
  block.classList.add('global-styles');
  const { clipboardText } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(3)');
  privacyPolicyDiv.classList.add('privacy-policy');

  const statusMessages = createStatusMessages(block);
  const statusTitles = createStatusTitles(block);

  const formContainer = document.createElement('div');
  formContainer.classList.add('link-checker-form');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  formContainer.appendChild(inputContainer);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'example-url.com';
  input.id = 'link-checker-input';

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
  button.textContent = 'Check URL';
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

  createButtonsContainer(block, formContainer, clipboardText);
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
