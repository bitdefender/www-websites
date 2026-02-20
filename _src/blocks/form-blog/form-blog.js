import { Cookies } from '@repobit/dex-utils';
import { FormEvent, AdobeDataLayerService } from '@repobit/dex-data-layer';

function onChange(form) {
  // Targeting the anchor inside .button-container
  const submitButton = form.querySelector('input[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');

  const allCheckboxesChecked = [...form.querySelectorAll('input[type="checkbox"]:required')].every((checkbox) => checkbox.checked);
  const emailPopulated = emailInput.value.trim() !== '';

  submitButton.disabled = !((allCheckboxesChecked && emailPopulated));
}

async function hashEmail(email) {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function solvePoW(challenge, difficulty) {
  const targetPrefix = '0'.repeat(difficulty);
  let nonce = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const input = challenge + nonce;
    // eslint-disable-next-line no-await-in-loop
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hashHex.startsWith(targetPrefix)) {
      return { nonce, hash: hashHex };
    }
    // eslint-disable-next-line no-plusplus
    nonce++;
  }
}

async function handleSubmitNewsletter(e, form, flow, successMessage, failMessage, formType = 'newsletter') {
  e.preventDefault();
  // Get challenge from server
  const challengeRes = await fetch('https://www.bitdefender.com/site/Store/challenge');
  const { challenge, difficulty } = await challengeRes.json();

  // Solve challenge
  const { nonce } = await solvePoW(challenge, difficulty);

  // Send the data with the challenge solved
  const formData = new FormData(form);
  const email = formData.get('email');
  const name = formData.get('name');
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ')[1] || '';
  const update = formData.get('checkbox');

  const jsonObject = {
    email,
    flow,
    first_name: firstName,
    last_name: lastName,
    update,
    nonce,
    challenge,
    difficulty,
  };

  const response = await fetch('https://www.bitdefender.com/site/Store/offerSubscribe', {
    method: 'POST',
    body: JSON.stringify(jsonObject),
  });
  const formParent = form.parentElement;
  if (response.ok) {
    const hashedEmail = await hashEmail(email);
    AdobeDataLayerService.push(new FormEvent(
      'form completed',
      {
        form: formType,
        formID: hashedEmail,
      },
    ));

    formParent.innerHTML = '';
    formParent.appendChild(successMessage);

    Cookies.set('newsLetterIntentShown', '1');
  } else {
    formParent.innerHTML = '';
    formParent.appendChild(failMessage);
  }
}

function parseHTML(html) {
  // Regular expressions to match text inside curly braces and square brackets
  const curlyRegex = /{{(.*?)}}/g;
  const squareRegex = /\[\[(.*?)\]\]/g;

  const insideCurlyBrackets = [];
  const insideSquareBrackets = [];

  // Match all occurrences of the curly braces regex
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = curlyRegex.exec(html)) !== null) {
    insideCurlyBrackets.push(match[1].trim());
  }

  // Match all occurrences of the square brackets regex
  // eslint-disable-next-line no-cond-assign
  while ((match = squareRegex.exec(html)) !== null) {
    insideSquareBrackets.push(match[1].trim());
  }

  return {
    insideCurlyBrackets,
    insideSquareBrackets,
  };
}

// Function to create the form
async function createForm(types, labels, flow, successMessage, failMessage, formType) {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');

  for (let i = 0; i < types.length; i += 1) {
    const type = types[i].toLowerCase();
    const input = document.createElement('input');
    input.id = `form-${i}-${type}`;
    input.addEventListener('change', () => onChange(form));
    input.addEventListener('input', () => onChange(form));

    if (type === 'name') {
      input.setAttribute('type', 'text');
    } else {
      input.setAttribute('type', type);
    }

    input.setAttribute('name', type);
    input.setAttribute('placeholder', labels[i]);
    input.setAttribute('required', '');
    input.setAttribute('aria-required', 'true');

    form.append(input);
    if (type === 'submit') {
      input.classList.add('disabled');
      input.disabled = true;
    }

    if (type === 'checkbox') {
      const div = document.createElement('div');
      div.classList.add('checkbox');

      const label = document.createElement('label');
      label.setAttribute('for', `form-${i}-${type}`);
      label.innerHTML = labels[i];
      input.before(div);
      div.append(input, label);
    }
  }

  // if (captchaKey) {
  //   // create function to render the captcha
  //   window.onRecaptchaLoadCallback = () => {
  //     window.clientId = window.grecaptcha.render('inline-badge', {
  //       sitekey: captchaKey,
  //       badge: 'inline',
  //       size: 'invisible',
  //     });
  //   };

  //   // add capthca script
  //   const captchaScript = document.createElement('script');
  //   captchaScript.classList.add('grecaptcha-v3');
  //   captchaScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoadCallback';
  //   captchaScript.defer = true;
  //   form.appendChild(captchaScript);

  //   // add captcha container
  //   const captchaContainer = document.createElement('div');
  //   captchaContainer.id = 'inline-badge';
  //   form.appendChild(captchaContainer);
  // }

  form.addEventListener('submit', (e) => handleSubmitNewsletter(e, form, flow, successMessage, failMessage, formType));
  return form;
}

export default async function decorate(block, options) {
  const {
    template, flow, captchaKey,
  } = block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const formDataHTML = block.children[1];
  const successMessage = block.children[2].children[1];
  const failMessage = block.children[3].children[1];
  const formData = parseHTML(formDataHTML.innerHTML);
  const [types, labels] = [formData.insideCurlyBrackets, formData.insideSquareBrackets];
  let form = null;
  if (options) {
    form = await createForm(
      types,
      labels,
      flow,
      successMessage,
      failMessage,
      options.formType,
      captchaKey,
    );
  } else {
    form = await createForm(types, labels, flow, successMessage, failMessage, 'newsletter', captchaKey);
  }

  if (form) block.append(form);
  block.children[1].innerHTML = '';
  block.children[2].innerHTML = '';
  block.children[3].innerHTML = '';
  if (template === 'blog') {
    block.classList.add('blog-template');
  }

  const privacyPolicyLink = block.querySelector('a[href*="privacy-policy"]');
  if (privacyPolicyLink) {
    privacyPolicyLink.setAttribute('target', '_blank');
  }

  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
