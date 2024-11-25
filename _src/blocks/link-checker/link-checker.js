class StatusMessageFactory {
  static createMessage(status, url) {
    const messages = {
      safe: { text: 'The link is safe with no signs of harmful activity. You can go ahead and keep staying cautious online.', className: 'result safe' },
      so_far_so_good_1: { text: 'We haven\'t seen any suspicious activity from this link.', className: 'result safe' },
      so_far_so_good_2: { text: `This link looks safe, but the domain '${url.hostname}' has been connected to harmful links in the past. To stay protected, check any other links from this domain using our tool and keep your security software updated.`, className: 'result safe' },
      phishing: { text: 'This link leads to a phishing site designed to steal personal information like passwords or financial data. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      malware: { text: 'This link is known to distribute malware. Accessing it may harm your device, steal your data, or allow unauthorized access. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      untrusted: { text: 'This link appears suspicious and may not be trustworthy. It’s best to avoid accessing it. Keep your security software active and steer clear of the site.', className: 'result warning' },
      fraud: { text: 'This link directs to a fraudulent site intended to trick users and steal sensitive data. Stay away from the site and ensure your security software is active.', className: 'result danger' },
      spam: { text: 'This link has been identified in spam emails, which often contain malicious content. Avoid clicking on it, as it may lead to harmful sites or scams. Ensure your security measures are in place.', className: 'result warning' },
      pua: { text: 'This link is associated with apps that could slow down your device or compromise your privacy. It’s best to avoid the site and make sure your security settings are active.', className: 'result danger' },
      miner: { text: 'This URL is linked to cryptocurrency mining activities, which may use your device\'s resources without your consent. Avoid visiting the site and ensure your security protections are in place.', className: 'result danger' },
      'malware-hd': { text: 'This URL is likely to contain malware, posing a significant threat. It\'s strongly advised to avoid accessing it and ensure your security protections are active and up to date.', className: 'result danger' },
      homograph: { text: 'This link is designed to look like a trusted site using tricky characters. Don’t click the link and make sure your security software is updated to protect your device.', className: 'result danger' },
      'c&c': { text: 'This URL is linked to a server used to command and control malware on infected devices. Don’t click the link and make sure your security software is up to date to keep your device safe.', className: 'result danger' },
      'miner-server': { text: 'This URL is linked to crypto mining activity, which could use your device\'s resources if accessed. It’s recommended not to click the link and ensure your security software is up to date.', className: 'result danger' },
      malvertising: { text: 'This link is connected to harmful ads that could affect your device and expose your personal data, such as your passwords, credit card information, email addresses, or browsing history. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger' },
      other: { text: 'This link is unsafe and could harm your device or steal your personal information. Avoid clicking on it and keep your security software updated to stay safe.', className: 'result danger' },
    };
    return messages[status] || { text: `Status: ${status}`, className: 'result warning' };
  }
}

async function checkLink(input, result) {
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

  const status = data.status[0];
  const message = StatusMessageFactory.createMessage(status, url);
  result.textContent = message.text;
  result.className = message.className;
}

export default function decorate(block) {
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  block.appendChild(inputContainer);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter URL to check';
  inputContainer.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'Check URL';
  inputContainer.appendChild(button);

  const result = document.createElement('div');
  result.textContent = 'Add your link or paste it from the device’s clipboard.';
  result.className = 'result';
  block.appendChild(result);

  button.addEventListener('click', () => checkLink(input, result));
}
