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
    const link = p.querySelector('a');
    if (link) {
      const bdBtn = document.createElement('bd-button');
      bdBtn.setAttribute('kind', 'danger');
      bdBtn.setAttribute('href', link.getAttribute('href'));
      bdBtn.setAttribute('slot', 'cta');
      bdBtn.textContent = link.textContent.trim();
      item.appendChild(bdBtn);
    } else {
      const bdP = document.createElement('bd-p');
      bdP.setAttribute('kind', 'regular');
      bdP.innerHTML = p.innerHTML;
      item.appendChild(bdP);
    }
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
      import(`${base}button`),
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
  const firstRow = rows[0];
  const firstRowHasMedia = firstRow?.querySelector('picture, img, [class*="icon-"]');
  const firstRowHasDescription = [...(firstRow?.querySelectorAll('p') || [])].some(
    (p) => !p.querySelector('picture') && !p.querySelector('[class*="icon-"]') && p.textContent.trim(),
  );

  // Treat first row as section title only when it has a heading but no media
  // and no description paragraph — i.e. it is a heading-only row.
  const isSectionTitleRow = !firstRowHasMedia && !firstRowHasDescription;
  const sectionTitle = isSectionTitleRow
    ? firstRow?.querySelector('h1,h2,h3,h4,h5,h6')?.textContent?.trim() || ''
    : '';
  const cardRows = isSectionTitleRow ? rows.slice(1) : rows;

  const cardSection = document.createElement('bd-card-section');
  if (sectionTitle) cardSection.setAttribute('title', sectionTitle);

  cardRows.forEach((row) => {
    cardSection.appendChild(buildCardItem(row));
  });

  block.replaceChildren(cardSection);

  // Process default-content-wrapper siblings:
  // - headings → become the bd-card-section title (DS-styled)
  // - button links → become bd-button appended to bd-card-section
  const sectionEl = block.closest('.section');
  const allDefaultWrappers = [...(sectionEl?.querySelectorAll('.default-content-wrapper') || [])];

  allDefaultWrappers.forEach((wrapper) => {
    // Extract heading → set as DS-managed section title
    const heading = wrapper.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading && !cardSection.hasAttribute('title')) {
      cardSection.setAttribute('title', heading.textContent.trim());
      heading.remove();
    }

    // Extract button link → move into bd-card-section as bd-button
    const link = wrapper.querySelector('a');
    if (link) {
      const bdBtn = document.createElement('bd-button');
      bdBtn.setAttribute('kind', 'danger');
      bdBtn.setAttribute('href', link.getAttribute('href'));
      bdBtn.textContent = link.textContent.trim();
      cardSection.appendChild(bdBtn);
      const btnParagraph = link.closest('p') || link.parentElement;
      btnParagraph.remove();
    }

    // Remove wrapper if now empty
    if (!wrapper.textContent.trim()) wrapper.remove();
  });
}
