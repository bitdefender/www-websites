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

export async function createForm(formURL, flow) {
  const { pathname, search } = new URL(formURL);

  let data;

  const form = document.createElement('form');
  form.setAttribute('method', 'post');

  data.forEach((field, index) => {
    const input = document.createElement('input');
    input.id = `form-${index}-${field.Field}`;
    input.addEventListener('change', () => onChange(form));
    input.addEventListener('input', () => onChange(form));
    input.setAttribute('type', field.Type);
    input.setAttribute('name', field.Field);
    input.setAttribute('placeholder', field.Default);
    input.setAttribute('value', field.Value);

    if (field.Required && field.Required.toLowerCase() === 'true') {
      input.setAttribute('required', '');
      input.setAttribute('aria-required', 'true');
    }

    form.append(input);

    // Only create a label if the field.Label is not null
    if (field.Label) {
      const label = document.createElement('label');
      label.setAttribute('for', input.id);
      label.textContent = field.Label;
      form.append(label);
    }

    if (field.Type === 'submit') {
      input.classList.add('disabled');
      input.disabled = true;
    }

    if (field.Field === 'handler') {
      switch (field.Value) {
        case 'blog':
          form.addEventListener('submit', (e) => handleSubmitNewsletter(e, form, flow));
          break;
        default:
          form.addEventListener('submit', (e) => handleSubmit(e, field.Value));
      }
    }

    if (field.Type === 'checkbox') {
      const div = document.createElement('div');
      div.classList.add('checkbox');

      const label = input.nextElementSibling;
      if (label && label.tagName === 'LABEL') {
        input.before(div);
        div.append(input, label);
      } else {
        input.after(div);
        div.append(input);
      }
    }
  });
  return form;
}

async function handleSubmitNewsletter(e, form, flow, successMessage, failMessage) {
  e.preventDefault();
  console.log('tasad');
  console.log(form);
  const formData = new FormData(form);
  console.log(formData);
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
  };
  console.log(jsonObject);

  const response = await fetch('https://www.bitdefender.com/site/Store/offerSubscribe', {
    method: 'POST',
    body: JSON.stringify(jsonObject),
  });

  if (response.ok) {
    const hashedEmail = await hashEmail(email);
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push({
      event: 'form completed',
      user: {
        form: 'newsletter',
        formID: hashedEmail,
      },
    });

    form.replaceWith(successMessage);
  } else {
    form.replaceWith(failMessage);
  }
}

function parseHTML(html) {
  // Regular expression to match text inside and outside double curly braces
  // Regular expressions to match text inside curly braces and square brackets
  const curlyRegex = /{{(.*?)}}/g;
  const squareRegex = /\[\[(.*?)\]\]/g;

  const insideCurlyBrackets = [];
  const insideSquareBrackets = [];

  // Match all occurrences of the curly braces regex
  let match;
  while ((match = curlyRegex.exec(html)) !== null) {
    insideCurlyBrackets.push(match[1].trim());
  }

  // Match all occurrences of the square brackets regex
  while ((match = squareRegex.exec(html)) !== null) {
    insideSquareBrackets.push(match[1].trim());
  }

  console.log('Inside curly brackets:', insideCurlyBrackets);
  console.log('Inside square brackets:', insideSquareBrackets);

  // Return the parsed data
  return {
    insideCurlyBrackets,
    insideSquareBrackets,
  };
}

// Function to create the form
async function createFormCool(types, labels, flow, successMessage, failMessage) {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');

  for (let i = 0; i < types.length; i++) {
    const type = types[i].toLowerCase();
    console.log(type);
    const input = document.createElement('input');
    input.id = `form-${i}-${type}`;
    input.addEventListener('change', () => onChange(form));
    input.addEventListener('input', () => onChange(form));
    input.setAttribute('type', type);
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

      const label = labels[i];
      input.before(div);
      div.append(input, label);
    }
  }

  form.addEventListener('submit', (e) => handleSubmitNewsletter(e, form, flow, successMessage, failMessage));
  return form;
}

export default async function decorate(block, options) {
  const {
    template, flow,
  } = options ? options.metadata : block.closest('.section').dataset;

  if (options) {
    // eslint-disable-next-line no-param-reassign
    block = block.querySelector('.block');
    const blockParent = block.closest('.section');
    blockParent.classList.add('we-container');
  }

  const formDataHTML = block.children[1];
  const successMessage = block.children[2].children[1].innerHTML;
  const failMessage = block.children[3].children[1].innerHTML;
  console.log(formDataHTML, typeof formDataHTML, typeof formDataHTML.innerHTML);
  const formData = parseHTML(formDataHTML.innerHTML);
  const [types, labels] = [formData.insideCurlyBrackets, formData.insideSquareBrackets];
  console.log(formData);
  console.log(block.children);
  const form = await createFormCool(types, labels, flow, successMessage, failMessage);
  if (form) block.append(form);
  block.children[1].innerHTML = '';
  block.children[2].innerHTML = '';
  block.children[3].innerHTML = '';
  if (template === 'blog') {
    block.classList.add('blog-template');
  }
}
