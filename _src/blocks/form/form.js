async function fetchData(url) {
  const resp = await fetch(url);
  const json = await resp.json();
  return json.data;
}

/**
 * 
 * @param {String} email 
 * @returns {Boolean} wether the email passed is valid or not
 */
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

/**
 * 
 * @param {HTMLFormElement} form
 * set the onChange function for all the form inputs 
 */
function onChange(form) {
  // Targeting the anchor inside .button-container
  const submitButton = form.querySelector('input[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');

  // set the initial values for normal Forms (except DIP)
  let emailPopulatedCorrectly = emailInput.value.trim() !== '';

  // real time field validation for the email field (For DIP only)
  // NEEDS TO BE EXTENDED TO WORK FOR ALL FIELDS
  if (emailInput.classList.contains('input-with-error-field')) {
    const emailInputErrorField = emailInput.parentElement.querySelector('.input-error-field');

    if (!emailPopulatedCorrectly || !validateEmail(emailInput.value)) {
      emailInputErrorField.classList.remove('global-display-none');
      return;
    }

    emailInputErrorField.classList.add('global-display-none');
  }

  const allCheckboxesChecked = [...form.querySelectorAll('input[type="checkbox"]:required')].every((checkbox) => checkbox.checked);
  submitButton.disabled = !((allCheckboxesChecked && emailPopulatedCorrectly));
}

async function handleSubmit(e, handler) {
  e.preventDefault();
  try {
    const mod = await import(handler);
    if (mod.default) await mod.default(e);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('failed to load module for lib-identity-exposed-onsubmit', error);
  }
}

/**
 * 
 * @param {HTMLInputElement} input the input to be adde inside the div wrapper
 * @param {HTMLDivElement} newDivParent the div wrapper to hold the input
 */
const wrapInputInsideDiv = (input, newDivParent) => {
  const label = input.nextElementSibling;

  //if the input has a label, also add it inside the wrapper
  if (label && label.tagName === 'LABEL') {
    input.before(newDivParent);
    newDivParent.append(input, label);
  } else {
    input.after(newDivParent);
    newDivParent.append(input);
  }
}

/**
 * 
 * @param {string} formURL url to form html
 * @returns {Promise<HTMLFormElement>} returns the form
 */
export async function createForm(formURL) {
  const { pathname, search } = new URL(formURL);
  const data = await fetchData(`${pathname}${search}`);
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
      form.addEventListener('submit', (e) => handleSubmit(e, field.Value));
    }

    if (field.Type === 'checkbox') {
      const newDivWrapper = document.createElement('div');
      newDivWrapper.classList.add('checkbox');

      wrapInputInsideDiv(input, newDivWrapper);
    }

    if (field.Error) {
      const newDivWrapper = document.createElement('div');
      newDivWrapper.classList.add('input-container-with-error');

      //add the error field
      const errorField = document.createElement('p');
      errorField.classList.add('input-error-field', 'global-display-none');
      errorField.textContent = field.Error;
      newDivWrapper.appendChild(errorField);
      input.classList.add('input-with-error-field');

      wrapInputInsideDiv(input, newDivWrapper);
    }
  });
  return form;
}

export default async function decorate(block) {
  const form = await createForm(block.textContent.trim());
  if (form) block.append(form);
}
