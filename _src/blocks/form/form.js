async function fetchData(url) {
  const resp = await fetch(url);
  const json = await resp.json();
  return json.data;
}

function onChange(form) {
  // Targeting the anchor inside .button-container
  const submitButton = form.querySelector('input[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');

  const allCheckboxesChecked = [...form.querySelectorAll('input[type="checkbox"]:required')].every((checkbox) => checkbox.checked);
  const emailPopulated = emailInput.value.trim() !== '';

  submitButton.disabled = !((allCheckboxesChecked && emailPopulated));
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

async function handleSubmitEmarsys(e, form) {
  e.preventDefault();
  const formData = new FormData(form);

  const jsonObject = {
    email: 'jdoe@bitdefender.com',
    flow: 'EMM_DIP_POPUP_OFFER',
    first_name: 'John',
    last_name: 'Doe',
    update: 'true',
  };

  const response = await fetch('https://www.bitdefender.com/site/Store/offerSubscribe', {
    method: 'POST',
    body: JSON.stringify(jsonObject),
  });

  if (response.ok) {
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  } else {
    console.error('Failed to submit form');
  }
}

export async function createForm(formURL) {
  const { pathname, search } = new URL(formURL);

  // check if the window is dev3.bitdefender.com
  let data;
  if (window.location.hostname === 'dev3.bitdefender.com' || window.location.hostname === 'dev3.bitdefender.co.uk') {
    data = await fetchData(formURL);
  } else {
    data = await fetchData(`${pathname}${search}`);
  }

  const form = document.createElement('form');
  console.log(data);
  form.setAttribute('method', 'post');

  data.forEach((field, index) => {
    console.log(field.Default);
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
    } else {
      form.addEventListener('submit', (e) => handleSubmitEmarsys(e, form));
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

export default async function decorate(block, options) {
  const {
    isModalForm,
  } = options ? options.metadata : block.closest('.section').dataset;

  console.log(block.textContent);
  const form = await createForm(block.textContent.trim());

  if (form) block.append(form);
}
