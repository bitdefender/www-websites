class StatusMessageFactory {
  static createMessage(status, url) {
    console.log(status);
    const messages = {
      1: { text: 'The link is safe with no signs of harmful activity. You can go ahead and keep staying cautious online.', className: 'result safe' },
      2: { text: 'We haven\'t seen any suspicious activity from this link.', className: 'result safe' },
      3: { text: `This link looks safe, but the domain '${url.hostname}' has been connected to harmful links in the past. To stay protected, check any other links from this domain using our tool and keep your security software updated.`, className: 'result safe' },
      5: { text: 'This link is known to distribute malware. Accessing it may harm your device, steal your data, or allow unauthorized access. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      17: { text: 'This link appears suspicious and may not be trustworthy. It’s best to avoid accessing it. Keep your security software active and steer clear of the site.', className: 'result danger' },
      8: { text: 'This link directs to a fraudulent site intended to trick users and steal sensitive data. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      15: { text: 'This link has been identified in spam emails, which often contain malicious content. Avoid clicking on it, as it may lead to harmful sites or scams. Ensure your security measures are in place.', className: 'result danger' },
      11: { text: 'This link is associated with apps that could slow down your device or compromise your privacy. It’s best to avoid the site and make sure your security settings are active.', className: 'result danger' },
      13: { text: 'This URL is linked to cryptocurrency mining activities, which may use your device\'s resources without your consent. Avoid visiting the site and ensure your security protections are in place.', className: 'result danger' },
      16: { text: 'This URL is likely to contain malware, posing a significant threat. It\'s strongly advised to avoid accessing it and ensure your security protections are active and up to date.', className: 'result danger' },
      12: { text: 'This link is designed to look like a trusted site using tricky characters. Don’t click the link and make sure your security software is updated to protect your device.', className: 'result danger' },
      6: { text: 'This URL is linked to a server used to command and control malware on infected devices. Don’t click the link and make sure your security software is up to date to keep your device safe.', className: 'result danger' },
      14: { text: 'This URL is linked to crypto mining activity, which could use your device\'s resources if accessed. It’s recommended not to click the link and ensure your security software is up to date.', className: 'result danger' },
      10: { text: 'This link is connected to harmful ads that could affect your device and expose your personal data, such as your passwords, credit card information, email addresses, or browsing history. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger' },
      18: { text: 'This link is unsafe and could harm your device or steal your personal information. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger' },
      4: { text: 'This link is dangerous and can compromise your personal information or harm your device. Do not click it, and ensure your security software is up-to-date to stay protected from threats.', className: 'result danger' },
      7: { text: 'This link is a threat, exposing you to malicious ads and phishing attempts that can steal your information and damage your device. Do not interact with it, and ensure your security software is updated.', className: 'result danger' },
      9: { text: 'This link leads to a phishing site designed to steal personal information like passwords or financial data. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      other: { text: 'This link is unsafe and could harm your device or steal your personal information. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger' },
    };
    return messages[status] || { text: `Status: ${status}`, className: 'result warning' };
  }
}

function changeTexts(block, result) {
  switch (result) {
    case 'safe':
      block.querySelector('h2').textContent = "You're safe";
      break;
    case 'danger':
      block.querySelector('h2').textContent = 'Definitely Don’t Go There';
      break;
    default:
      break;
  }
}

async function checkLink(block, input, result) {
  let url = input.value.trim();
  if (!url) {
    result.textContent = 'Please enter a URL.';
    result.className = 'result warning';
    return;
  }

  try {
    url = new URL(`http://${url}`);
  } catch (_) {
    result.textContent = 'Please enter a valid URL.';
    result.className = 'result warning';
    return;
  }

  const response = await fetch('https://beta.nimbus.bitdefender.net/tools/link-checker', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    result.textContent = 'Something went wrong on our end';
    return;
  }

  const data = await response.json();
  const { status } = data;
  const message = StatusMessageFactory.createMessage(status, url);
  result.textContent = message.text;
  result.className = message.className;
  block.closest('.section').classList.add(message.className.split(' ')[1]);
  input.setAttribute('disabled', '');

  changeTexts(block, message.className.split(' ')[1]);
}

function resetChecker(block) {
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
  const h2 = block.querySelector('h2');
  input.removeAttribute('disabled');
  result.textContent = 'Add your link or paste it from the device’s clipboard.';
  result.className = 'result';
  h2.textContent = 'Is This Link Really Safe?';
}

function createSharePopup(buttonsContainer) {
  const shareButton = buttonsContainer.querySelector('.share-button');
  shareButton.style.maxWidth = `${shareButton.offsetWidth}px`;
  const sharePopup = document.createElement('div');
  sharePopup.classList.add('share-popup');
  shareButton.insertAdjacentElement('beforeend', sharePopup);
  return sharePopup;
}

function copyToClipboard(block, caller) {
  // Get the text field
  const copyText = document.getElementById('link-checker-input');

  // Select the text field
  copyText?.select();
  copyText?.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
  const buttonsContainer = block.querySelector('.buttons-container');
  if (buttonsContainer) {
    const sharePopup = block.querySelector('.share-popup') || createSharePopup(buttonsContainer);
    sharePopup.textContent = `Copied the text: ${copyText.value}`;
    const translateXValue = Math.abs((sharePopup.offsetWidth - caller.offsetWidth) / 2);
    sharePopup.style = `transform:translateX(-${translateXValue}px); opacity: 1`;
    setTimeout(() => {
      sharePopup.style = `transform:translateX(-${translateXValue}px); opacity:0;`;
    }, 2000);
  }
}

export default function decorate(block) {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  block.appendChild(inputContainer);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter URL to check';
  input.id = 'link-checker-input';
  inputContainer.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'Check URL';
  button.classList.add('check-url');
  inputContainer.appendChild(button);

  const result = document.createElement('div');
  result.textContent = 'Add your link or paste it from the device’s clipboard.';
  result.className = 'result';
  block.appendChild(result);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const shareButton = document.createElement('button');
  shareButton.innerHTML = '<span>Share Result</span>';
  shareButton.classList.add('share-button');

  const checkAnother = document.createElement('button');
  checkAnother.innerHTML = '<span>Check Another Link</span>';
  checkAnother.classList.add('check-another-button');

  buttonsContainer.appendChild(shareButton);
  buttonsContainer.appendChild(checkAnother);

  block.appendChild(buttonsContainer);

  const [safeImage, dangerImage] = block.querySelectorAll('picture');
  safeImage.classList.add('safe-image');
  dangerImage.classList.add('danger-image');

  button.addEventListener('click', () => checkLink(block, input, result));
  checkAnother.addEventListener('click', () => resetChecker(block));
  shareButton.addEventListener('click', (e) => {
    e.preventDefault();
    copyToClipboard(block, shareButton);
  });
}
