export default function decorate(block) {
  const allFields = [...block.children];
  const formBox = document.createElement('form');
  formBox.setAttribute('novalidate', 'novalidate');
  let pendingPair = null;

  allFields.forEach((field, index) => {
    if (index === 0) return;

    const divs = field.querySelectorAll('div');
    const [fieldNameEl, fieldTypeEl, fieldValidationEl, fieldMandatoryEl] = divs;
    const fieldName = fieldNameEl?.innerText || '';
    const fieldType = fieldTypeEl?.innerText.toLowerCase() || 'text';
    const fieldValidation = fieldValidationEl?.innerText || '';
    const fieldMandatory = fieldMandatoryEl?.innerText || '';
    const name = fieldName.toLowerCase().replace(/\s+/g, '');
    const isMandatory = fieldMandatory.trim() === '*';

    const isStandalone = ['title', 'success_message', 'recaptcha', 'normaltext', 'textarea', 'submit', 'checkbox'].includes(fieldType);

    const inputBox = document.createElement('div');
    inputBox.className = 'inputBox';

    if (fieldType === 'title') {
      inputBox.id = 'titleBox';
      inputBox.innerHTML = fieldNameEl?.innerHTML;
    } else if (fieldType === 'success_message') {
      inputBox.id = 'successMessage';
      inputBox.innerHTML = fieldNameEl?.innerHTML;
    } else if (fieldType === 'recaptcha') {
      inputBox.id = 'captchaBox';
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoadCallback';
      recaptchaScript.defer = true;
      document.body.appendChild(recaptchaScript);

      window.onRecaptchaLoadCallback = () => {
        window.clientId = grecaptcha.render('captchaBox', {
          sitekey: '6LcEH5onAAAAAH4800Uc6IYdUvmqPLHFGi_nOGeR',
          badge: 'inline',
          size: 'invisible',
        });
      };
    } else if (fieldType === 'normal_text') {
      inputBox.classList.add('normalText');
      inputBox.innerHTML = fieldNameEl?.innerHTML;
    } else if (fieldType === 'textarea') {
      inputBox.classList.add('inputTextarea');
      inputBox.innerHTML = `
        <label for="input-${name}">
          ${fieldName}${isMandatory ? '<span>*</span>' : ''}
        </label>
        <textarea id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}></textarea>
        <em class="input-err">${fieldValidation}</em>
      `;
    } else if (fieldType === 'button') {
      inputBox.innerHTML = `
        <input type="submit" id="input-submit" name="${name}" class="submit-btn" value="${fieldName}">
      `;
    } else if (fieldType === 'checkbox') {
      inputBox.innerHTML = `
        <label class="input-checkbox">
          <input type="checkbox" id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}>
          ${fieldName}
        </label>
        <em class="input-err">${fieldValidation}</em>
      `;
    } else {
      inputBox.innerHTML = `
        <label for="input-${name}" placeholder="${fieldValidation}">
          ${fieldName}${isMandatory ? '<span>*</span>' : ''}
        </label>
        <input id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''} type="${fieldType}" value="">
        <em class="input-err">${fieldValidation}</em>
      `;
    }

    if (isStandalone) {
      const standaloneRow = document.createElement('div');
      standaloneRow.className = 'inputRow';
      if (fieldType !== 'title' || fieldType !== 'success_message') standaloneRow.classList.add('inputRow2');
      standaloneRow.appendChild(inputBox);
      formBox.appendChild(standaloneRow);
      pendingPair = null;
    } else {
      if (!pendingPair) {
        pendingPair = inputBox;
      } else {
        const pairRow = document.createElement('div');
        pairRow.className = 'inputRow';
        if (fieldType !== 'title' || fieldType !== 'success_message') pairRow.classList.add('inputRow2');
        pairRow.appendChild(pendingPair);
        pairRow.appendChild(inputBox);
        formBox.appendChild(pairRow);
        pendingPair = null;
      }
    }
  });

  if (pendingPair) {
    const finalRow = document.createElement('div');
    finalRow.className = 'inputRow inputRow2';
    finalRow.appendChild(pendingPair);
    formBox.appendChild(finalRow);
  }

  // Validation logic
  formBox.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const inputs = formBox.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      const errorEl = input.closest('.inputBox')?.querySelector('.input-err');
      if (!errorEl) return;

      let message = '';
      if (input.hasAttribute('required') && !input.value.trim()) {
        message = 'This field is required.';
      } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
          message = 'Invalid email format.';
        }
      } else if (input.type === 'number') {
        if (input.value && isNaN(input.value)) {
          message = 'Must be a number.';
        }
      }

      if (message) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        isValid = false;
      } else {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    });

    if (isValid) {
      console.log('✅ Form is valid. Now send with fetch() or show confirmation.');
      // const formData = new FormData(formBox);
      // const response = await fetch('/submit-endpoint', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      // console.log(result);
    }
  });

  block.innerHTML = '';
  block.appendChild(formBox);
}
