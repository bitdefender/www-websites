import { renderTurnstile, submitWithTurnstile } from '../../scripts/utils/utils.js';

function createForm(block) {
  const allFields = [...block.children];
  const formBox = document.createElement('form');
  formBox.setAttribute('novalidate', 'novalidate');
  let pendingPair = null;

  // close btn
  const closeBtn = document.createElement('span');
  closeBtn.className = 'modal-close-btn';
  closeBtn.innerText = '×';
  formBox.appendChild(closeBtn);

  closeBtn.addEventListener('click', () => {
    formBox.closest('.section').style.display = 'none';
  });

  // create fields
  allFields.forEach((field, index) => {
    if (index === 0) return;

    const divs = field.querySelectorAll('div');
    const [fieldNameEl, fieldTypeEl, fieldValidationEl, fieldMandatoryEl, fieldNameVal] = divs;
    const fieldName = fieldNameEl?.innerText || '';
    const fieldType = fieldTypeEl?.innerText.toLowerCase() || 'text';
    const fieldValidation = fieldValidationEl?.innerText || '';
    const fieldMandatory = fieldMandatoryEl?.innerText || '';
    const name = fieldNameVal?.innerText.toLowerCase().replace(/\s+/g, '') || '';
    const isMandatory = fieldMandatory.trim() === '*';
    const isStandalone = ['title', 'success_message', 'normal_text', 'textarea', 'submit', 'checkbox'].includes(fieldType);

    const inputBox = document.createElement('div');
    if (!['title', 'success_message', 'submit'].includes(fieldType)) inputBox.className = 'input-box';

    switch (fieldType) {
      case 'title': {
        inputBox.id = 'title-box';
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      }

      case 'success_message': {
        inputBox.id = 'success-message';
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      }

      case 'normal_text': {
        inputBox.classList.add('normal_text');
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      }

      case 'textarea': {
        inputBox.classList.add('input-textarea');
        inputBox.innerHTML = `
          <label for="input-${name}">
            ${fieldName}${isMandatory ? '<span>*</span>' : ''}
          </label>
          <textarea id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}></textarea>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      }

      case 'button': {
        const turnstileDiv = document.createElement('div');
        turnstileDiv.id = 'turnstile-container';
        turnstileDiv.className = 'turnstile-box';
        inputBox.appendChild(turnstileDiv);

        inputBox.innerHTML += `
          <input type="submit" id="input-submit" name="${name}" class="submit-btn" value="${fieldName}">
        `;
        break;
      }

      case 'checkbox': {
        inputBox.innerHTML = `
          <label class="input-checkbox">
            <input type="checkbox" id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}>
            ${fieldNameEl?.innerHTML}
          </label>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      }

      case 'checkboxes': {
        inputBox.classList.add('checkboxes');
        const labelNameEl = fieldNameEl?.querySelector('p');
        const labelChecksEl = fieldNameEl?.querySelector('ul');
        const checkItems = labelChecksEl ? Array.from(labelChecksEl.querySelectorAll('li')) : [];

        let checkboxesHTML = '';
        checkItems.forEach((item, i) => {
          checkboxesHTML += `
            <label class="input-checkbox">
              <input type="checkbox" id="input-${name}-${i}" name="${name}" value="${item.innerHTML}" ${isMandatory ? 'required' : ''}>
              ${item.innerHTML}
            </label>
          `;
        });

        inputBox.innerHTML = `
          <p class="fake-label">${labelNameEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
          <div class="all-checks">${checkboxesHTML}</div>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      }

      case 'select': {
        inputBox.classList.add('selectors');
        const labelEl = fieldNameEl?.querySelector('p');
        const selectList = fieldNameEl?.querySelector('ul');
        const options = selectList ? Array.from(selectList.querySelectorAll('li')) : [];

        inputBox.innerHTML = `
          <p class="fake-label">${labelEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
          <select id="select-${name}" name="${name}" ${isMandatory ? 'required' : ''}>
            ${options.map((item) => `<option value="${item.textContent.trim()}">${item.innerHTML}</option>`).join('')}
          </select>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      }

      case 'fake_input': {
        inputBox.classList.add('fake_input');
        inputBox.innerHTML = '<label for="input-fake"></label>';
        break;
      }

      default: {
        inputBox.innerHTML = `
          <label for="input-${name}" placeholder="${fieldValidation}">
            ${fieldName}${isMandatory ? '<span>*</span>' : ''}
          </label>
          <input id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''} type="${fieldType}" value="">
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      }
    }

    const row = document.createElement('div');
    row.className = 'input-row';
    if (fieldType !== 'title' && fieldType !== 'success_message') row.classList.add('input-row2');

    if (isStandalone) {
      row.appendChild(inputBox);
      formBox.appendChild(row);
      pendingPair = null;
      return;
    }

    if (!pendingPair) {
      pendingPair = inputBox;
    } else {
      row.appendChild(pendingPair);
      row.appendChild(inputBox);
      formBox.appendChild(row);
      pendingPair = null;
    }
  });

  if (pendingPair) {
    const finalRow = document.createElement('div');
    finalRow.className = 'input-row input-row2';
    finalRow.appendChild(pendingPair);
    formBox.appendChild(finalRow);
  }

  return formBox;
}

function sanitizeDataMap(dataMap) {
  const riskyPattern = /^\d{1,2}[-/]\d{1,2}$/;
  return Object.fromEntries(
    [...dataMap.entries()].map(([k, v]) => [
      k,
      typeof v === 'string' && riskyPattern.test(v) ? `'${v}` : v,
    ]),
  );
}

function handleSubmit(formBox, widgetId, token) {
  const locale = window.location.pathname.split('/')[1] || 'en';
  const validateFields = () => {
    let isValid = true;
    const inputs = formBox.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const container = input.closest('.input-box') || input.closest('.checkboxes') || input.closest('.selectors');

      const errorEl = container?.querySelector('.input-err');
      if (!errorEl) return;

      let showError = false;
      const value = input.value?.trim();

      if (!input.closest('.checkboxes') && input.type === 'checkbox' && input.required && !input.checked) {
        showError = true;
      } else if (input.tagName === 'SELECT' && input.required && !value) {
        showError = true;
      } else if (input.tagName === 'TEXTAREA' && input.required && !value) {
        showError = true;
      } else if (input.hasAttribute('required') && !value) {
        showError = true;
      } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError = true;
      } else if (input.type === 'number' && value && Number.isNaN(Number(value))) {
        showError = true;
      }

      errorEl.style.display = showError ? 'block' : 'none';
      if (showError) isValid = false;
    });

    // Checkbox group validation
    formBox.querySelectorAll('.checkboxes').forEach((group) => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const errorEl = group.querySelector('.input-err');

      const isRequired = Array.from(checkboxes).some((cb) => cb.required);
      const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

      if (errorEl) {
        if (isRequired && !isChecked) {
          errorEl.style.display = 'block';
          isValid = false;
        } else {
          errorEl.style.display = 'none';
        }
      }
    });

    return isValid;
  };

  formBox.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    formBox.classList.add('loading');
    const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const data = new Map();

    // set date and locale
    data.set('DATE', date);
    data.set('LOCALE', locale);

    formBox.querySelectorAll('.input-box').forEach((box) => {
      const field = box.querySelector('input[name], select[name], textarea[name]');
      if (!field || !field.name || data.has(field.name.toUpperCase())) return;

      const { name } = field;
      const key = name.toUpperCase().replace(/-/g, '_');

      if (field.type === 'checkbox') {
        const group = formBox.querySelectorAll(`input[type="checkbox"][name="${name}"]`);
        const values = Array.from(group)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value.trim());
        data.set(key, values.length ? values.join(', ') : 'No');
      } else if (field.type === 'radio') {
        const selected = formBox.querySelector(`input[type="radio"][name="${name}"]:checked`);
        data.set(key, selected ? selected.value.trim() : '');
      } else {
        data.set(key, field.value?.trim() || '');
      }
    });

    // convert Map to ordered object:
    const orderedData = sanitizeDataMap(data);
    const fileName = formBox.closest('.section').getAttribute('data-savedata');

    await submitWithTurnstile({
      widgetId,
      token,
      data: orderedData,
      fileName,
      successCallback: () => {
        formBox.reset();
        const successMsg = formBox.querySelector('#success-message');
        if (successMsg) {
          formBox.classList.remove('loading');
          formBox.classList.add('form-submitted');
          formBox.querySelector('#title-box').innerHTML = successMsg.innerHTML;
          successMsg.scrollIntoView({ behavior: 'smooth' });
        }
      },
    });
  });
}

export default function decorate(block) {
  const formBox = createForm(block);
  block.innerHTML = '';
  block.appendChild(formBox);

  renderTurnstile('turnstile-container', { invisible: false })
    .then(({ widgetId, token }) => {
      handleSubmit(formBox, widgetId, token);
    })
    .catch((error) => {
      throw new Error(`Turnstile render failed: ${error.message}`);
    });

  // if param d is set display the popup form
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('d') === 'book-a-meeting') block.closest('.section').classList.add('show');
}
