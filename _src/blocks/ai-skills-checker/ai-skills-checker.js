import {
  WindowLoadStartedEvent,
  WindowLoadedEvent,
  UserDetectedEvent,
  AdobeDataLayerService,
} from '@repobit/dex-data-layer';

function changeTexts(block, statusCode, statusTitles) {
  const titleText = statusTitles[statusCode] || statusTitles.default;
  const h1 = block.querySelector('h1');
  if (h1) {
    h1.textContent = titleText;
  }
}

const isValidUrl = (urlString) => {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' // validate protocol
      + '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|' // validate domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // validate OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' // validate port and path
      + '(\\?[;&a-z\\d%\\/_@.~+=-]*)?' // validate query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return urlPattern.test(urlString);
};

async function checkSkillLink(block, input, result, statusMessages, statusTitles, fileInput) {
  const maxArchiveSizeBytes = 10 * 1024 * 1024;
  const inputUrl = input.value.trim();
  const file = fileInput?.files && fileInput.files[0];

  if (!inputUrl && !file) {
    result.textContent = 'Please provide a URL or upload an archive';
    result.className = 'result danger';
    return;
  }

  if (file) {
    if (file.size > maxArchiveSizeBytes) {
      result.textContent = 'File exceeds the 10MB limit';
      result.className = 'result danger';
      return;
    }
  } else if (inputUrl && !isValidUrl(inputUrl)) {
    result.textContent = 'Please enter a valid URL';
    result.className = 'result danger';
    return;
  }

  input.closest('.input-container').classList.add('loader-circle');

  let response;
  try {
    if (file) {
      const form = new FormData();
      form.append('file', file, file.name);
      form.append('action', 'scan_archive');

      response = await fetch('https://nimbus.bitdefender.net/skills/checker', {
        method: 'POST',
        body: form,
      });
    } else {
      response = await fetch('https://nimbus.bitdefender.net/skills/checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan_url', url: inputUrl }),
      });
    }
  } catch (err) {
    result.textContent = statusMessages.error ?? 'An error occurred';
    result.className = 'result danger';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  if (!response || !response.ok) {
    result.textContent = statusMessages.error ?? 'Please enter a valid skill URL or upload a valid archive';
    result.className = 'result danger';
    input.closest('.input-container').classList.remove('loader-circle');
    return;
  }

  const data = await response.json();
  // determine risk level (prefer adjusted if present)
  const rawRisk = data.adjusted_risk_level ?? data.risk_level ?? 'UNKNOWN';
  const risk = String(rawRisk).toUpperCase();

  // map to existing visuals
  let statusCode = 'default';
  let className = 'result danger';
  if (risk.includes('CLEAN')) {
    statusCode = 'safe';
    className = 'result safe';
  } else if (risk.includes('LOW') || risk.includes('MEDIUM') || risk.includes('HIGH')) {
    statusCode = 'intermediate';
    className = 'result danger';
  } else if (risk.includes('CRITICAL')) {
    statusCode = 'danger';
    className = 'result danger';
  }

  // build result card HTML per spec
  const skillName = data.skill_name ?? data.name ?? inputUrl ?? file?.name ?? '';
  const llmSummary = data.llm_summary ?? data.summary ?? '';
  const findings = Array.isArray(data.findings) ? data.findings : [];
  const findingsCount = (typeof data.findings_count === 'number') ? data.findings_count : findings.length;

  let findingsHtml = '';
  if (findingsCount === 0) {
    findingsHtml = '<p>No security findings detected.</p>';
  } else {
    findingsHtml = `<ol>${findings.map((f) => {
      const descr = f.description ?? 'No description';
      // prefer file_name or path or content as filename display
      const filename = f.file_name ?? f.filename ?? f.path ?? f.content ?? '';
      const fileCode = filename ? `<code>${filename}</code>` : '';
      return `<li><strong>${descr}</strong> <br>${fileCode}</li>`;
    }).join('')}</ol>`;
  }

  result.innerHTML = `
    <p><strong>Skill Scan:</strong> ${skillName}</p>
    <h4>Summary</h4>
    <p>${llmSummary}</p>
    <h4>Findings (${findingsCount})</h4>
    ${findingsHtml}
  `;

  result.className = className;
  block.closest('.section').classList.add(className.split(' ')[1]);
  input.setAttribute('disabled', '');
  if (fileInput) fileInput.setAttribute('disabled', '');
  const inputDiv = document.getElementById('inputDiv');
  if (inputDiv) {
    inputDiv.textContent = file ? file.name : inputUrl;
  }

  changeTexts(block, statusCode, statusTitles);
  input.closest('.input-container').classList.remove('loader-circle');

  AdobeDataLayerService.push(new WindowLoadStartedEvent((pageLoadStartedInfo) => {
    pageLoadStartedInfo.name += `:${statusCode}`;
    return pageLoadStartedInfo;
  }));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

async function resetChecker(block, titleText = '', inputsState = {}) {
  const classesToRemove = ['danger', 'safe'];
  const section = block.closest('.section');

  // Iterate over the classes and remove them from the section
  classesToRemove.forEach((className) => {
    if (section.classList.contains(className)) {
      section.classList.remove(className);
    }
  });

  // Reset the input and result elements
  const input = block.querySelector('#ai-skills-checker-input');
  const fileInput = block.querySelector('#ai-skills-checker-file');
  const result = block.querySelector('.result');
  const h1 = block.querySelector('h1');
  const uploadText = block.querySelector('.upload-text');

  input.removeAttribute('disabled');
  if (fileInput) {
    fileInput.removeAttribute('disabled');
    fileInput.value = '';
  }
  input.value = '';
  result.className = 'result';
  const inputDiv = block.querySelector('#inputDiv');
  if (inputDiv) inputDiv.textContent = '';
  if (h1) h1.textContent = titleText;
  if (uploadText && inputsState) uploadText.textContent = inputsState.upload || '';

  AdobeDataLayerService.push(new WindowLoadStartedEvent({}));
  AdobeDataLayerService.push(new UserDetectedEvent());
  AdobeDataLayerService.push(new WindowLoadedEvent());
}

function createStatusMessages(block) {
  const statusMessages = {};

  const divWithStatusMessages = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<status-messages>');
  });

  const pElements = divWithStatusMessages.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<status-messages>"
  pElements.forEach((p, index) => {
    if (index === 0) {
      return;
    }

    const parts = p.innerHTML.split(':');
    if (parts.length >= 2) {
      const status = parts[0].trim();
      const message = parts.slice(1).join(':').trim();
      statusMessages[status.toLowerCase()] = message;
    }
  });

  return statusMessages;
}

function createKeyValueMap(block, searchKey, { className, useInnerHTML = false } = {}) {
  const mappedValues = {};

  const targetDiv = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes(searchKey);
  });

  if (!targetDiv) {
    return mappedValues;
  }

  if (className) {
    targetDiv.classList.add(className);
  }

  const pElements = targetDiv.querySelectorAll('p');
  // Skip the first <p> if it contains a header like "<tabs>" or "<inputs>"
  pElements.forEach((p, index) => {
    if (index === 0) {
      return;
    }

    const source = useInnerHTML ? p.innerHTML : p.textContent;
    const parts = source.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      mappedValues[key.toLowerCase()] = value;
    }
  });

  targetDiv.remove();
  return mappedValues;
}

function createButtonsContainer(block, inputsState) {
  const titleText = block.querySelector('h1')?.innerText;
  const divWithButtons = Array.from(block.querySelectorAll('div')).find((div) => {
    const firstParagraph = div.querySelector('p');
    return firstParagraph && firstParagraph.textContent.includes('<buttons>');
  });

  if (divWithButtons) {
    divWithButtons.classList.add('buttons-container');
    const pElements = divWithButtons.querySelectorAll('p');
    divWithButtons.querySelector('div').remove();
    // Skip the first <p> if it contains a header like "<titles-change>"
    pElements.forEach((p, index) => {
      if (index === 0) {
        p.remove();
        return;
      }

      const link = p.querySelector('a');
      if (!link) return;

      if (link.href.includes('/fragments/')) {
        p.querySelector('a').classList.add('share-button');
      }

      divWithButtons.appendChild(p);
      if (link.href.includes('#check-another')) {
        link.classList.add('check-another-button');
        link.addEventListener('click', () => {
          resetChecker(block, titleText, inputsState);
        });
      }
    });
  }
}

export default function decorate(block) {
  const acceptedArchiveInputValue = [
    '.zip',
    '.tar',
    '.tgz',
    '.tar.gz',
    '.tar.bz2',
    '.tbz2',
    '.tar.xz',
    '.gz',
    '.bz2',
    '.7z',
    '.rar',
    'application/zip',
    'application/x-tar',
    'application/gzip',
    'application/x-bzip2',
    'application/x-xz',
    'application/x-7z-compressed',
    'application/vnd.rar',
  ].join(',');

  const { checkButtonText, product, pasteLinkText } = block.closest('.section').dataset;

  const privacyPolicyDiv = block.querySelector(':scope > div:nth-child(5)');
  privacyPolicyDiv.classList.add('privacy-policy');

  if (product) {
    // eslint-disable-next-line no-unused-vars
    const [productName, productUsers, productYears] = product.split('/');
    block.setAttribute('data-store-id', productName);
  }

  const statusMessages = createStatusMessages(block);
  const statusTitles = createKeyValueMap(block, '<titles-change>', { className: 'status-titles' });
  const tabsTitles = createKeyValueMap(block, '<tabs>');
  const inputsState = createKeyValueMap(block, '<inputs>');

  const formContainer = document.createElement('div');
  formContainer.classList.add('ai-skills-checker-form');

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  formContainer.appendChild(inputContainer);

  const copyElement = document.createElement('span');
  copyElement.id = 'copy-to-clipboard';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = pasteLinkText ?? 'example-url.com';
  input.id = 'ai-skills-checker-input';
  input.appendChild(copyElement);

  // file input for archive uploads
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'ai-skills-checker-file';
  fileInput.accept = acceptedArchiveInputValue;
  fileInput.title = 'Upload archive (max 10MB)';

  const inputDiv = document.createElement('p');
  inputDiv.setAttribute('id', 'inputDiv');

  // tabs (Link / Upload)
  const tabs = document.createElement('div');
  tabs.className = 'ai-tabs';
  const tabLink = document.createElement('button');
  tabLink.type = 'button';
  tabLink.className = 'tab tab-link active';
  tabLink.textContent = tabsTitles.link ?? '';
  const tabUpload = document.createElement('button');
  tabUpload.type = 'button';
  tabUpload.className = 'tab tab-upload';
  tabUpload.textContent = tabsTitles.upload ?? '';
  tabs.appendChild(tabLink);
  tabs.appendChild(tabUpload);

  const inputPair = document.createElement('div');
  inputPair.className = 'input-pair';

  inputPair.appendChild(fileInput);
  inputPair.appendChild(input);
  inputPair.appendChild(copyElement);

  // upload drop area (hidden by default)
  const uploadDrop = document.createElement('div');
  uploadDrop.className = 'upload-drop';
  uploadDrop.innerHTML = `
    <div class="upload-inner">
      <div class="upload-icon">⬆</div>
      <div class="upload-text">${inputsState.upload ?? ''}</div>
    </div>
  `;

  const divContainer = document.createElement('div');
  divContainer.className = 'input-container__container';
  divContainer.appendChild(tabs);
  inputPair.appendChild(uploadDrop);
  divContainer.appendChild(inputPair);

  block.prepend(inputDiv);

  inputContainer.appendChild(divContainer);

  // default view: show link input, hide upload area and file input
  uploadDrop.style.display = 'none';
  fileInput.style.display = 'none';

  copyElement.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value += text;
    } catch (error) {
      // continue regardless of error
    }
  });

  // tab handlers
  const showLink = () => {
    tabLink.classList.add('active');
    tabUpload.classList.remove('active');
    input.style.display = '';
    fileInput.style.display = 'none';
    uploadDrop.style.display = 'none';
  };
  const showUpload = () => {
    tabUpload.classList.add('active');
    tabLink.classList.remove('active');
    input.style.display = 'none';
    fileInput.style.display = '';
    uploadDrop.style.display = '';
  };
  tabLink.addEventListener('click', showLink);
  tabUpload.addEventListener('click', showUpload);

  // upload drop interactions
  uploadDrop.addEventListener('click', (e) => { e.preventDefault(); fileInput.click(); });
  uploadDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDrop.classList.add('dragover');
  });
  uploadDrop.addEventListener('dragleave', () => uploadDrop.classList.remove('dragover'));
  uploadDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDrop.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
    }
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      input.value = '';
      const fname = fileInput.files[0].name;
      uploadDrop.querySelector('.upload-text').innerHTML = `${inputsState.uploadsuccess.replace('{FILE_NAME}', fname)}`;
    }
  });

  const button = document.createElement('button');
  button.textContent = checkButtonText ?? 'Check URL';
  button.classList.add('check-url');

  inputContainer.appendChild(button);

  const result = document.createElement('div');
  result.className = 'result';
  formContainer.appendChild(result);

  block.querySelectorAll(':scope > div')[1].replaceWith(formContainer);
  const [safeImage, dangerImage] = block.querySelectorAll('picture');
  safeImage.classList.add('safe-image');
  dangerImage.classList.add('danger-image');

  button.addEventListener('click', () => checkSkillLink(block, input, result, statusMessages, statusTitles, fileInput));

  createButtonsContainer(block, inputsState);

  // if the text is cleared, do not display any error
  input.addEventListener('input', () => {
    const url = input.value.trim();
    // If the input is cleared, reset the result text and class
    if (url === '') {
      result.textContent = '';
      result.className = '';
    }
  });
  input.addEventListener('paste', () => {
    result.textContent = '';
    result.className = '';
  });
  fileInput.addEventListener('change', () => {
    // clear URL input when a file is selected
    if (fileInput.files && fileInput.files.length > 0) {
      input.value = '';
      result.textContent = '';
      result.className = '';
    }
  });
}
