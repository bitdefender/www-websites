export default function decorate(block) {
  const section = block.closest('.section');
  const columns = [...block.children];

  // Info message
  if (columns.length === 1 && section?.classList.contains('grey-bck')) {
    return;
  }

  // Tracking preferences
  if (columns.length !== 4) {
    return;
  }

  const yesText = columns[0].textContent.trim();
  const noText = columns[1].textContent.trim();
  const confirmText = columns[2].textContent.trim();
  const savedText = columns[3].textContent.trim();

  const options = document.createElement('div');
  options.className = 'tracking-options';

  const createOption = (text, value, checked = false) => {
    const label = document.createElement('label');
    label.className = 'tracking-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'email-tracking';
    input.value = value;
    input.checked = checked;

    const radio = document.createElement('span');
    radio.className = 'tracking-radio';

    const textElement = document.createElement('span');
    textElement.className = 'tracking-option-text';
    textElement.textContent = text;

    label.append(input, radio, textElement);

    return label;
  };

  options.append(
    createOption(yesText, 'yes'),
    createOption(noText, 'no', true),
  );

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'tracking-confirm';
  confirmButton.textContent = confirmText;

  const savedMessage = document.createElement('div');
  savedMessage.className = 'tracking-saved';
  savedMessage.textContent = savedText;
  savedMessage.hidden = true;

  block.replaceChildren(
    options,
    confirmButton,
    savedMessage,
  );

  confirmButton.addEventListener('click', () => {
    const selected = block.querySelector(
      'input[name="email-tracking"]:checked',
    );

    if (!selected) {
      return;
    }

    options.hidden = true;
    confirmButton.hidden = true;
    savedMessage.hidden = false;
  });
}
