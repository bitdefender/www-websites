import { getDsnBase } from '../../scripts/utils/utils.js';

// The logo assets are exported at 1.5x the size Figma draws them.
const ASSET_SCALE = 1.5;

const VARIANTS = {
  default: { duration: '18', gap: '48' },
  awards: { duration: '10', gap: '24' },
};

/* bd-logo-marquee clones its items into its shadow root, where block CSS does
   not reach, so anything the copies must share is set inline on the item. */
const sizeLogo = (picture) => {
  const img = picture.querySelector('img');
  if (!img) return null;
  const width = Number(img.getAttribute('width'));
  const height = Number(img.getAttribute('height'));
  img.style.display = 'block';
  img.style.maxWidth = 'none';
  if (width && height) {
    img.style.width = `${Math.round(width / ASSET_SCALE)}px`;
    img.style.height = `${Math.round(height / ASSET_SCALE)}px`;
  }
  return picture;
};

// "**#1** most awarded": the bold part is the display figure, the rest its label.
const buildTextItem = (cell) => {
  const strong = cell.querySelector('strong, b');
  const figure = strong?.textContent.trim() || '';
  const rest = cell.cloneNode(true);
  rest.querySelector('strong, b')?.remove();
  const label = rest.querySelector('p') || rest;

  const item = document.createElement('span');
  item.style.cssText = 'display: inline-flex; align-items: center; gap: var(--spacing-8); --bd-paragraph-margin-bottom: 0;';

  if (figure) {
    const display = document.createElement('bd-display');
    display.setAttribute('variant', 'md');
    display.textContent = figure;
    item.append(display);
  }

  if (label.textContent.trim()) {
    const p = document.createElement('bd-p');
    p.setAttribute('variant', 'small');
    // one word a line, as Figma stacks "most / awarded"
    p.style.width = 'min-content';
    p.append(...label.childNodes);
    item.append(p);
  }

  return item.childElementCount ? item : null;
};

const getLabel = (block, textItem) => {
  if (textItem) return textItem.textContent.replace(/\s+/g, ' ').trim();
  const heading = block.closest('.section')
    ?.querySelector(':scope > .default-content-wrapper :is(h1, h2, h3)');
  return heading?.textContent.trim() || '';
};

export default async function decorate(block) {
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}logo-marquee`),
      import(`${base}display`),
      import(`${base}paragraph`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('logo-marquee: DSN import failed, continuing with native rendering', err);
  }

  // Logos can be one per row or several in one cell; keep the authored order.
  const items = [];
  let textItem = null;
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const pictures = [...cell.querySelectorAll('picture')];
    if (pictures.length) {
      pictures.forEach((picture) => {
        const logo = sizeLogo(picture);
        if (logo) items.push(logo);
      });
      return;
    }
    if (!cell.textContent.trim()) return;
    const item = buildTextItem(cell);
    if (!item) return;
    if (!textItem) textItem = item;
    items.push(item);
  });

  if (!items.length) {
    block.replaceChildren();
    return;
  }

  const { duration, gap } = block.classList.contains('awards') ? VARIANTS.awards : VARIANTS.default;
  const marquee = document.createElement('bd-logo-marquee');
  marquee.setAttribute('duration', duration);
  marquee.setAttribute('gap', gap);
  const label = getLabel(block, textItem);
  if (label) marquee.setAttribute('label', label);
  marquee.append(...items);

  block.replaceChildren(marquee);
}
