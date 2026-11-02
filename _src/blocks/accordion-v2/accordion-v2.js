const DESKTOP_QUERY = '(min-width: 768px)';
const MAX_DESKTOP_COLUMNS = 4;

let instanceCount = 0;

/**
 * Builds one item from a row: [icon + title, description (+ duplicate icon)]
 * @param {HTMLElement} row - Authored row
 * @param {string} idPrefix - Unique prefix for the button/panel ids
 * @returns {HTMLElement|null} The item, or null for an empty row
 */
function buildItem(row, idPrefix) {
  const [headCell, bodyCell] = row.children;
  if (!headCell) return null;

  const picture = headCell.querySelector('picture') || bodyCell?.querySelector('picture');
  const title = (headCell.querySelector('strong, h1, h2, h3, h4, h5, h6') || headCell).textContent.trim();
  if (!title) return null;

  const item = document.createElement('div');
  item.className = 'accordion-v2-item';

  const heading = document.createElement('h3');
  heading.className = 'accordion-v2-title';

  const button = document.createElement('button');
  button.type = 'button';
  button.id = `${idPrefix}-button`;
  button.innerHTML = '<span class="accordion-v2-icon"></span><span class="accordion-v2-label"></span>';
  if (picture) button.querySelector('.accordion-v2-icon').append(picture);
  else button.querySelector('.accordion-v2-icon').remove();
  button.querySelector('.accordion-v2-label').textContent = title;
  heading.append(button);
  item.append(heading);

  // the description cell repeats the icon; keep only the text
  bodyCell?.querySelectorAll('picture').forEach((pic) => pic.remove());
  if (!bodyCell?.textContent.trim()) {
    item.classList.add('no-panel');
    return item;
  }

  const panel = document.createElement('div');
  panel.className = 'accordion-v2-panel';
  panel.id = `${idPrefix}-panel`;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', button.id);
  if (bodyCell.querySelector('p, ul, ol')) {
    panel.append(...bodyCell.childNodes);
  } else {
    const p = document.createElement('p');
    p.innerHTML = bodyCell.innerHTML.trim();
    panel.append(p);
  }
  item.append(panel);

  const chevron = document.createElement('span');
  chevron.className = 'accordion-v2-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  button.append(chevron);
  button.setAttribute('aria-controls', panel.id);

  return item;
}

/**
 * Mobile: accordion, first item open. Desktop: all items shown as cards.
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  instanceCount += 1;
  const items = [...block.querySelectorAll(':scope > div')]
    .map((row, idx) => buildItem(row, `accordion-v2-${instanceCount}-${idx}`))
    .filter(Boolean);
  block.replaceChildren(...items);

  // desktop columns: at most 4 per row, rows as even as possible (5 -> 3 + 2, 6 -> 3 + 3)
  if (items.length) {
    const rows = Math.ceil(items.length / MAX_DESKTOP_COLUMNS);
    block.style.setProperty('--accordion-v2-columns', Math.ceil(items.length / rows));
  }

  const toggles = items
    .map((item) => ({
      button: item.querySelector('button'),
      panel: item.querySelector('.accordion-v2-panel'),
    }))
    .filter(({ panel }) => panel);

  const setOpen = ({ button, panel }, open) => {
    button.setAttribute('aria-expanded', open);
    panel.hidden = !open;
  };

  toggles.forEach((toggle, idx) => {
    setOpen(toggle, idx === 0);
    toggle.button.addEventListener('click', () => {
      setOpen(toggle, toggle.button.getAttribute('aria-expanded') !== 'true');
    });
  });

  // on desktop every panel is shown (see CSS), so the buttons do nothing
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const syncButtons = () => {
    toggles.forEach(({ button }) => { button.disabled = desktop.matches; });
  };
  desktop.addEventListener('change', syncButtons);
  syncButtons();
}
