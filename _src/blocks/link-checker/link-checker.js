import {
  AdobeDataLayerService,
  PageLoadedEvent,
  PageLoadStartedEvent,
  UserDetectedEvent,
} from '../../scripts/libs/data-layer.js';
import {
  BotPrevention,
} from '../../scripts/utils/bot-prevention.js';

class StatusMessageFactory {
  static createMessage(status, url) {
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

    const messages = {
      1: { text: 'The link is safe with no signs of harmful activity. You can go ahead and keep staying cautious online.', className: 'result safe', status: 'safe' },
      2: { text: 'We haven\'t seen any suspicious activity from this link.', className: 'result safe', status: 'so_far_so_good_1' },
      3: { text: `This link looks safe, but the domain '${urlObject.hostname}' has been connected to harmful links in the past. To stay protected, check any other links from this domain using our tool and keep your security software updated.`, className: 'result safe', status: 'so_far_so_good_2' },
      4: { text: 'This link is dangerous and can compromise your personal information or harm your device. Do not click it, and ensure your security software is up-to-date to stay protected from threats.', className: 'result danger', status: 'malware & phishing' },
      5: { text: 'This link is known to distribute malware. Accessing it may harm your device, steal your data, or allow unauthorized access. Stay away from the site and ensure your security software is active.', className: 'result danger', status: 'malware' },
      6: { text: 'This URL is linked to a server used to command and control malware on infected devices. Don’t click the link and make sure your security software is up to date to keep your device safe.', className: 'result danger', status: 'c&c' },
      7: { text: 'This link is a threat, exposing you to malicious ads and phishing attempts that can steal your information and damage your device. Do not interact with it, and ensure your security software is updated.', className: 'result danger', status: 'malvertising & fraud & phishing' },
      8: { text: 'This link directs to a fraudulent site intended to trick users and steal sensitive data. Stay away from the site and ensure your security software is active.', className: 'result danger', status: 'fraud' },
      9: { text: 'This link leads to a phishing site designed to steal personal information like passwords or financial data. Stay away from the site and ensure your security software is active.', className: 'result danger', status: 'phishing' },
      10: { text: 'This link is connected to harmful ads that could affect your device and expose your personal data, such as your passwords, credit card information, email addresses, or browsing history. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger', status: 'malvertising' },
      11: { text: 'This link is associated with apps that could slow down your device or compromise your privacy. It’s best to avoid the site and make sure your security settings are active.', className: 'result danger', status: 'pua' },
      12: { text: 'This link is designed to look like a trusted site using tricky characters. Don’t click the link and make sure your security software is updated to protect your device.', className: 'result danger', status: 'homograph' },
      13: { text: 'This URL is linked to cryptocurrency mining activities, which may use your device\'s resources without your consent. Avoid visiting the site and ensure your security protections are in place.', className: 'result danger', status: 'miner' },
      14: { text: 'This URL is linked to crypto mining activity, which could use your device\'s resources if accessed. It’s recommended not to click the link and ensure your security software is up to date.', className: 'result danger', status: 'miner-server' },
      15: { text: 'This link has been identified in spam emails, which often contain malicious content. Avoid clicking on it, as it may lead to harmful sites or scams. Ensure your security measures are in place.', className: 'result danger', status: 'spam' },
      16: { text: 'This URL is likely to contain malware, posing a significant threat. It\'s strongly advised to avoid accessing it and ensure your security protections are active and up to date.', className: 'result danger', status: 'malware-hd' },
      17: { text: 'This link appears suspicious and may not be trustworthy. It’s best to avoid accessing it. Keep your security software active and steer clear of the site.', className: 'result danger', status: 'untrusted' },
      18: { text: 'This link is unsafe and could harm your device or steal your personal information. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger', status: 'malicious' },
      other: { text: 'This link is unsafe and could harm your device or steal your personal information. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger', status: 'other' },
    };
    return messages[status] || { text: `Status: ${status}`, className: 'result warning' };
  }
}

function changeTexts(block, result) {
  switch (result.status) {
    case 'safe':
      block.querySelector('h1').textContent = "You're safe";
      break;
    case 'so_far_so_good_1':
      block.querySelector('h1').textContent = 'So far, so good';
      break;
    case 'so_far_so_good_2':
      block.querySelector('h1').textContent = 'So far, so good';
      break;
    default:
      block.querySelector('h1').textContent = 'Definitely Don’t Go There';
      break;
  }
}

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' // validate protocol
      + '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|' // validate domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // validate OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // validate port and path
      + '(\\?[;&a-z\\d%\\/_.~+=-]*)?' // validate query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return urlPattern.test(urlString);
};

async function checkLink(block, input, result) {
  const url = input.value.toLowerCase().trim();
  if (!url || !isValidUrl(url)) {
    result.textContent = 'Please enter a valid URL';
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');
  let response = await fetch('https://beta.nimbus.bitdefender.net/tools/link-checker', {
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
    response = await fetch('https://beta.nimbus.bitdefender.net/tools/link-checker', {
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
  const message = StatusMessageFactory.createMessage(status, url);
  result.textContent = message.text;
  result.className = message.className;
  block.closest('.section').classList.add(message.className.split(' ')[1]);
  input.setAttribute('disabled', '');
  document.getElementById('inputDiv').textContent = url;

  changeTexts(block, message);
  input.closest('.input-container').classList.remove('loader-circle');

  const newObject = await new PageLoadStartedEvent();
  newObject.page.info.name = `${newObject.page.info.name}:${message.status}`;
  AdobeDataLayerService.push(newObject);
  AdobeDataLayerService.push(await new UserDetectedEvent());
  AdobeDataLayerService.push(new PageLoadedEvent());
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

  const newObject = await new PageLoadStartedEvent();
  AdobeDataLayerService.push(newObject);
  AdobeDataLayerService.push(await new UserDetectedEvent());
  AdobeDataLayerService.push(new PageLoadedEvent());
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

export default function decorate(block) {
  const { clipboardText } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(3)');
  privacyPolicyDiv.classList.add('privacy-policy');

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
  block.querySelectorAll(':scope > div')[1].replaceWith(formContainer);
  const [safeImage, dangerImage] = block.querySelectorAll('picture');
  safeImage.classList.add('safe-image');
  dangerImage.classList.add('danger-image');

  button.addEventListener('click', () => checkLink(block, input, result));
  checkAnother.addEventListener('click', () => resetChecker(block));
  shareButton.addEventListener('click', (e) => {
    e.preventDefault();
    copyToClipboard(block, shareButton, clipboardText);
  });
}
