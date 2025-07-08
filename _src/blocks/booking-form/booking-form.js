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

    const isStandalone = ['title', 'success_message', 'recaptcha', 'normal_text', 'textarea', 'submit', 'checkbox'].includes(fieldType);

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
      inputBox.classList.add('normal_text');
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
          ${fieldNameEl?.innerHTML}
        </label>
        <em class="input-err">${fieldValidation}</em>
      `;
    } else if (fieldType === 'checkboxes') {
      inputBox.classList.add('checkboxes');
      const labelNameEl = fieldNameEl?.querySelector('p');
      const labelChecksEl = fieldNameEl?.querySelector('ul');
      const checkItems = labelChecksEl ? Array.from(labelChecksEl.querySelectorAll('li')) : [];

      let checkboxesHTML = '';
      checkItems.forEach((item, index) => {
        const checkboxId = `input-${name}-${index}`;
        checkboxesHTML += `
          <label class="input-checkbox">
            <input type="checkbox" id="${checkboxId}" name="${name}" ${isMandatory ? 'required' : ''}>
            ${item.innerHTML}
          </label>
        `;
      });

      inputBox.innerHTML = `
        <p class="fake_label">${labelNameEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
        <div class="all-checks">
          ${checkboxesHTML}
        </div>
        <em class="input-err">${fieldValidation}</em>
      `;
    } else if (fieldType === 'select') {
      inputBox.classList.add('selectors');
      const labelNameEl = fieldNameEl?.querySelector('p');
      const selectOptionsEl = fieldNameEl?.querySelector('ul');
      const options = selectOptionsEl ? Array.from(selectOptionsEl.querySelectorAll('li')) : [];

      const selectId = `select-${name}`;
      let optionsHTML = options.map((item) => {
        return `<option value="${item.textContent.trim()}">${item.innerHTML}</option>`;
      }).join('');

      inputBox.innerHTML = `
        <p class="fake_label">${labelNameEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
        <select id="${selectId}" name="${name}" ${isMandatory ? 'required' : ''}>
          ${optionsHTML}
        </select>
        <em class="input-err">${fieldValidation}</em>
      `;
    } else if (fieldType === 'fake_input') {
      inputBox.classList.add('fake_input');
      inputBox.innerHTML = `
        <label for="input-fake"></label>
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
    const inputs = formBox.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const inputBox = input.closest('.inputBox') || input.closest('.checkboxes') || input.closest('.selectors');
      const errorEl = inputBox?.querySelector('.input-err');
      if (!errorEl) return;

      let showError = false;

      if (input.type === 'checkbox' && input.required && !input.checked) {
        console.log('1', input)
        showError = true;
      } else if (input.tagName === 'SELECT' && input.required && (!input.value || input.value.trim() === '')) {
        showError = true;
        console.log('2')
      } else if (input.tagName === 'TEXTAREA' && input.required && !input.value.trim()) {
        showError = true;
        console.log('3')
      } else if (input.hasAttribute('required') && !input.value.trim()) {
        showError = true;
        console.log('4')
      } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
          showError = true;
          console.log('5')
        }
      } else if (input.type === 'number' && input.value && isNaN(input.value)) {
        showError = true;
        console.log('6')
      }

      if (showError) {
        errorEl.style.display = 'block';
        isValid = false;
        console.log('isValid 1')
      } else {
        errorEl.style.display = 'none';
      }
    });

    // Checkbox groups (checkboxes)
    const checkboxGroups = formBox.querySelectorAll('.checkboxes');
    checkboxGroups.forEach((group) => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const errorEl = group.querySelector('.input-err');
      const isRequired = Array.from(checkboxes).some(cb => cb.required);

      if (isRequired) {
        const isChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (!isChecked) {
          errorEl.style.display = 'block';
          isValid = false;
          console.log('isValid 2')
        } else {
          errorEl.style.display = 'none';
        }
      }
    });

    if (isValid) {
      const formData = new FormData(formBox);
      console.log('formData ', formData)

      try {
        console.log('✅ Email trimis cu succes!');
        formBox.reset();

        // Afișează mesajul de succes, dacă există un bloc de tip success_message
        const successMsg = formBox.querySelector('#successMessage');
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error('❌ Eroare rețea la trimitere', err);
      }
    }
  });


  block.innerHTML = '';
  block.appendChild(formBox);
}
