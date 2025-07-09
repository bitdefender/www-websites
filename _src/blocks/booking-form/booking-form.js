function createForm(block) {
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

    switch (fieldType) {
      case 'title':
        inputBox.id = 'titleBox';
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      case 'success_message':
        inputBox.id = 'successMessage';
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      case 'recaptcha' : {
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
        break;
      } 
      case 'normal_text':
        inputBox.classList.add('normal_text');
        inputBox.innerHTML = fieldNameEl?.innerHTML;
        break;
      case 'textarea':
        inputBox.classList.add('inputTextarea');
        inputBox.innerHTML = `
          <label for="input-${name}">
            ${fieldName}${isMandatory ? '<span>*</span>' : ''}
          </label>
          <textarea id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}></textarea>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      case 'button':
        inputBox.innerHTML = `
          <input type="submit" id="input-submit" name="${name}" class="submit-btn" value="${fieldName}">
        `;
        break;
      case 'checkbox':
        inputBox.innerHTML = `
          <label class="input-checkbox">
            <input type="checkbox" id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''}>
            ${fieldNameEl?.innerHTML}
          </label>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      case 'checkboxes':
        inputBox.classList.add('checkboxes');
        const labelNameEl = fieldNameEl?.querySelector('p');
        const labelChecksEl = fieldNameEl?.querySelector('ul');
        const checkItems = labelChecksEl ? Array.from(labelChecksEl.querySelectorAll('li')) : [];

        let checkboxesHTML = '';
        checkItems.forEach((item, i) => {
          checkboxesHTML += `
            <label class="input-checkbox">
              <input type="checkbox" id="input-${name}-${i}" name="${name}" ${isMandatory ? 'required' : ''}>
              ${item.innerHTML}
            </label>
          `;
        });

        inputBox.innerHTML = `
          <p class="fake_label">${labelNameEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
          <div class="all-checks">${checkboxesHTML}</div>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      case 'select':
        inputBox.classList.add('selectors');
        const labelEl = fieldNameEl?.querySelector('p');
        const selectList = fieldNameEl?.querySelector('ul');
        const options = selectList ? Array.from(selectList.querySelectorAll('li')) : [];

        inputBox.innerHTML = `
          <p class="fake_label">${labelEl?.innerText || ''}${isMandatory ? '<span>*</span>' : ''}</p>
          <select id="select-${name}" name="${name}" ${isMandatory ? 'required' : ''}>
            ${options.map(item => `<option value="${item.textContent.trim()}">${item.innerHTML}</option>`).join('')}
          </select>
          <em class="input-err">${fieldValidation}</em>
        `;
        break;
      case 'fake_input':
        inputBox.classList.add('fake_input');
        inputBox.innerHTML = `<label for="input-fake"></label>`;
        break;
      default:
        inputBox.innerHTML = `
          <label for="input-${name}" placeholder="${fieldValidation}">
            ${fieldName}${isMandatory ? '<span>*</span>' : ''}
          </label>
          <input id="input-${name}" name="${name}" ${isMandatory ? 'required' : ''} type="${fieldType}" value="">
          <em class="input-err">${fieldValidation}</em>
        `;
    }

    const row = document.createElement('div');
    row.className = 'inputRow';
    if (fieldType !== 'title' && fieldType !== 'success_message') row.classList.add('inputRow2');

    if (isStandalone) {
      row.appendChild(inputBox);
      formBox.appendChild(row);
      pendingPair = null;
    } else {
      if (!pendingPair) {
        pendingPair = inputBox;
      } else {
        row.appendChild(pendingPair);
        row.appendChild(inputBox);
        formBox.appendChild(row);
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

  return formBox;
}

function handleSubmit(formBox) {
  formBox.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const inputs = formBox.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const container = input.closest('.inputBox') || input.closest('.checkboxes') || input.closest('.selectors');
      const errorEl = container?.querySelector('.input-err');
      if (!errorEl) return;

      let showError = false;
      const value = input.value?.trim();

      if (!input.closest('.checkboxes') && input.type === 'checkbox' && input.required && !input.checked) showError = true;
      else if (input.tagName === 'SELECT' && input.required && !value) showError = true;
      else if (input.tagName === 'TEXTAREA' && input.required && !value) showError = true;
      else if (input.hasAttribute('required') && !value) showError = true;
      else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) showError = true;
      else if (input.type === 'number' && value && isNaN(value)) showError = true;

      errorEl.style.display = showError ? 'block' : 'none';
      if (showError) isValid = false;
    });

    formBox.querySelectorAll('.checkboxes').forEach(group => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const errorEl = group.querySelector('.input-err');
      const isRequired = Array.from(checkboxes).some(cb => cb.required);
      const isChecked = Array.from(checkboxes).some(cb => cb.checked);

      if (isRequired && !isChecked) {
        errorEl.style.display = 'block';
        isValid = false;
      } else {
        errorEl.style.display = 'none';
      }
    });

    if (!isValid) return;

    const locale = window.location.pathname.split('/')[1];
    const date = new Date().toISOString().split('T')[0];

    const getValue = (name) => {
      const el = formBox.querySelector(`[name="${name}"]`);
      return el?.value?.trim() || '';
    };

    // Create Turnstile container if missing
    let turnstileBox = formBox.querySelector('#TurnstileBox');
    if (!turnstileBox) {
      turnstileBox = document.createElement('div');
      turnstileBox.id = 'TurnstileBox';
      formBox.appendChild(turnstileBox);
    }

    window.onloadTurnstileCallback = function onloadTurnstileCallback() {
      if (window.turnstileWidgetId !== undefined) {
        try {
          window.turnstile.reset(window.turnstileWidgetId);
          return;
        } catch (e) {
          console.warn('Turnstile already rendered and cannot reset.');
          return;
        }
      }

      window.turnstile.render('#TurnstileBox', {
        sitekey: '0x4AAAAAABkTzSd63P7J-Tl_',
        async callback(token) {
          try {
            const requestData = {
              file: '/sites/creators-form-data.xlsx',
              table: 'Table1',
              row: {
                DATE: date,
                LOCALE: locale,
                FULL_NAME: getValue('fullname'),
                EMAIL: getValue('email'),
                TEAM_MEMBERS: getValue('teammembers'),
                FOLLOWERS: getValue('followers'),
                PLATFORMS: getValue('platforms'),
                COMMENTS: getValue('comments'),
                token,
              },
            };

            const response = await fetch('https://stage.bitdefender.com/form', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error(await response.text());

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) throw new Error(await response.text());

            const data = await response.json();
            console.log('Form submitted:', data);

            formBox.reset();
            const successMsg = formBox.querySelector('#successMessage');
            if (successMsg) {
              successMsg.style.display = 'block';
              successMsg.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (error) {
            console.error('Submission error:', error);
          }
        },
      });
    };

    // Load Turnstile script
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.defer = true;
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.onloadTurnstileCallback();
    }
  });
}

export default function decorate(block) {
  const formBox = createForm(block);
  block.innerHTML = '';
  block.appendChild(formBox);
  handleSubmit(formBox);
}
