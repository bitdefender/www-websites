import { getDsnBase } from '../../scripts/utils/utils.js';

const getIconElement = (col) => {
  const iconSpan = col.querySelector('[class*="icon-"]');
  if (iconSpan) {
    const iconName = Array.from(iconSpan.classList)
      .find((cls) => cls.startsWith('icon-'))
      ?.substring(5);
    if (iconName) {
      // Plain img with slot="icon" — bd-individual-icon has no <slot> so
      // children placed inside it would never be rendered.
      const img = document.createElement('img');
      img.src = `/common/icons/${iconName}.svg`;
      img.setAttribute('slot', 'icon');
      img.setAttribute('width', '32');
      img.setAttribute('height', '32');
      return img;
    }
  }

  const picture = col.querySelector('picture');
  if (picture) {
    // Set slot="icon" on the picture directly so bd-card-item._renderIcon()
    // clones and renders the correct authored image for each card.
    const clone = picture.cloneNode(true);
    clone.setAttribute('slot', 'icon');
    return clone;
  }

  return null;
};

const buildCardItem = (row) => {
  const heading = row.querySelector('h4, h3, h2, h1');
  const title = heading?.textContent?.trim() || '';

  const item = document.createElement('bd-card-item');
  item.setAttribute('title', title);

  const iconEl = getIconElement(row);
  if (iconEl) item.appendChild(iconEl);

  const paragraphs = [...row.querySelectorAll('p')].filter(
    (p) => !p.querySelector('picture') && !p.querySelector('[class*="icon-"]') && p.textContent.trim(),
  );
  paragraphs.forEach((p) => {
    const bdP = document.createElement('bd-p');
    bdP.setAttribute('kind', 'regular');
    bdP.textContent = p.textContent;
    item.appendChild(bdP);
  });

  return item;
};

export default async function decorate(block) {
  const base = getDsnBase();
  try {
    await Promise.all([
      // Use full src paths — 'cards' is not in the package.json exports map
      // so the short name fails on ESM.sh.
      import(`${base}src/components/cards/card.js`),
      import(`${base}paragraph`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('four-cards: DSN import failed, continuing with native rendering', err);
  }

  const {
    // eslint-disable-next-line no-unused-vars
    margintop,
  } = block.closest('.section').dataset;

  if (margintop) {
    const blockParent = block.closest('.section');
    blockParent.style.marginTop = `${margintop}px`;
  }

  const rows = [...block.children];

  // If the first row contains only a heading (no picture/icon) treat it as the
  // section title; otherwise all rows are card items.
  const firstRowHasMedia = rows[0]?.querySelector('picture, img, [class*="icon-"]');
  const sectionTitle = !firstRowHasMedia
    ? rows[0]?.querySelector('h1,h2,h3,h4,h5,h6,p')?.textContent?.trim() || ''
    : '';
  const cardRows = firstRowHasMedia ? rows : rows.slice(1);

  const cardSection = document.createElement('bd-card-section');
  if (sectionTitle) cardSection.setAttribute('title', sectionTitle);

  cardRows.forEach((row) => {
    cardSection.appendChild(buildCardItem(row));
  });

  block.replaceChildren(cardSection);
}
