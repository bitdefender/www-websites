import { load } from '@repobit/dex-system-design/loader';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { slotIcon, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * Feature columns, on the design system's bd-feature-columns. Each cell is a
 * column: an icon, an h1-h3 title, a description, and h4 items, each with
 * the copy under it, as an accordion. An item title ending in [$WORD$] or
 * [WORD] carries that word as a green badge.
 */

/** One level under `level`, h6 at most. */
const below = (level) => Math.min(level + 1, 6);

const parseTrailingGreenPill = (text) => {
  const marker = text.match(/\[\$([^\]]+?)\$\]\s*$/);
  if (marker) {
    return {
      title: text.replace(/\s*\[\$[^\]]+?\$\]\s*$/, '').trim(),
      pill: marker[1].trim(),
    };
  }

  const bracket = text.match(/\[([^\]]+?)\]\s*$/);
  if (!bracket) return { title: text.trim(), pill: '' };

  const candidate = bracket[1].trim();
  if (!/^[A-Z0-9+&\- ]{2,}$/.test(candidate)) {
    return { title: text.trim(), pill: '' };
  }

  return {
    title: text.replace(/\s*\[[^\]]+?\]\s*$/, '').trim(),
    pill: candidate,
  };
};

const getTitleAndPill = (headingEl) => {
  const greenTag = headingEl.querySelector('.tag-green');
  if (greenTag) {
    const clone = headingEl.cloneNode(true);
    clone.querySelectorAll('.tag-green').forEach((tag) => tag.remove());
    return {
      title: clone.textContent.trim(),
      pill: greenTag.textContent.trim(),
    };
  }

  return parseTrailingGreenPill(headingEl.textContent.trim());
};

/**
 * The green pill an item's title carries, as bd-accordion-item's badge: the
 * success tone, filled and small, as the design system's Ultimate Security
 * page writes the badge beside a feature column item's title.
 * @param {string} pill
 */
const createGreenBadge = (pill) => {
  const badge = document.createElement('bd-badge');
  badge.setAttribute('slot', 'badge');
  badge.setAttribute('variant', 'success');
  badge.setAttribute('appearance', 'fill');
  badge.setAttribute('size', 'sm');
  badge.textContent = pill;
  return badge;
};

/**
 * A heading in a slot: the component around it sets its size, the page's
 * outline its level.
 * @param {string} text
 * @param {number} level 1 to 6
 */
const buildTitle = (text, level) => {
  const bdH = document.createElement('bd-h');
  bdH.setAttribute('slot', 'title');
  bdH.setAttribute('as', `h${level}`);
  bdH.textContent = text;
  return bdH;
};

/**
 * The column's icon, as bd-feature-column's icon slot takes it: the page's
 * inline SVG as a bd-icon (slotIcon), or its image as a 40px bd-img.
 * @param {HTMLElement} col the authored column
 * @returns {HTMLElement|null}
 */
const getIconElement = (col) => {
  // the page's own inline SVG: decorate() waited for the icon pass
  const iconSpan = col.querySelector('span.icon');
  if (iconSpan) {
    // a paragraph holding only a hex value is the column's icon colour
    const color = [...col.querySelectorAll('p')]
      .map((p) => p.textContent.trim())
      .find((text) => /^#[0-9a-fA-F]{3,6}$/.test(text));
    return slotIcon(iconSpan, { color });
  }

  const image = col.querySelector('img');
  if (!image) return null;
  const img = document.createElement('bd-img');
  img.slot = 'icon';
  img.setAttribute('src', image.currentSrc || image.getAttribute('src') || '');
  // it illustrates the title beside it
  img.setAttribute('alt', '');
  img.setAttribute('width', '40');
  img.setAttribute('height', '40');
  return img;
};

const buildFeatureCol = (col, firstOpen) => {
  const heading = col.querySelector('h1, h2, h3');
  const title = heading?.textContent?.trim() || '';
  // the column's title at the level the page wrote it; its items a level under
  const level = heading ? Number(heading.tagName[1]) : 3;

  const featureCol = document.createElement('bd-feature-column');
  if (title) featureCol.appendChild(buildTitle(title, level));

  const iconEl = getIconElement(col);
  if (iconEl) featureCol.appendChild(iconEl);

  const h4s = [...col.querySelectorAll('h4')];
  const firstH4 = h4s[0] || null;

  // the description: a bd-p per paragraph before the first item, but the
  // icon's and the colour's
  Array.from(col.children).some((child) => {
    if (child === firstH4) return true;
    if (child.tagName === 'P'
      && !child.querySelector('[class*="icon-"]')
      && child.textContent.trim()
      && !child.textContent.trim().match(/^#[0-9a-fA-F]{3,6}$/)) {
      const desc = document.createElement('bd-p');
      desc.setAttribute('slot', 'description');
      desc.innerHTML = child.innerHTML;
      featureCol.appendChild(desc);
    }
    return false;
  });

  if (h4s.length) {
    const accordion = document.createElement('bd-accordion');
    accordion.setAttribute('without-container', '');

    h4s.forEach((h4, index) => {
      const { title: itemTitle, pill } = getTitleAndPill(h4);
      const item = document.createElement('bd-accordion-item');
      item.appendChild(buildTitle(itemTitle || h4.textContent.trim(), below(level)));
      if (index === 0 && firstOpen) item.setAttribute('open', '');

      let next = h4.nextElementSibling;
      while (next && next.tagName !== 'H4') {
        if (next.textContent.trim()) {
          const bdP = document.createElement('bd-p');
          bdP.setAttribute('appearance', 'small');
          bdP.innerHTML = next.innerHTML;
          item.appendChild(bdP);
        }
        next = next.nextElementSibling;
      }

      if (pill) {
        item.appendChild(createGreenBadge(pill));
      }

      accordion.appendChild(item);
    });

    featureCol.appendChild(accordion);
  }

  return featureCol;
};

export default async function decorate(block) {
  // the section on the design system's rhythm; in a tab panel the section is
  // the tab group's, which already is
  wrapSectionInDsSection(block);
  // the icons are SVG before slotIcon reads them
  await decorateIcons(block);

  const firstOpen = block.classList.contains('first-open');
  const featuresEl = document.createElement('bd-feature-columns');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      featuresEl.appendChild(buildFeatureCol(col, firstOpen));
    });
  });

  try {
    await load(featuresEl);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('features: DSN import failed, continuing with native rendering', err);
  }
  block.replaceChildren(featuresEl);
}
