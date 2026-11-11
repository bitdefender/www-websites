import { load } from '@repobit/dex-system-design/loader';
import { wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * A two-column band on the design system's bd-spotlight. Authored as one
 * row: [title heading, buttons] [logo, description, buttons]. The logo is
 * the block's first picture, else an icon span or a :name: marker.
 */

const toImg = (src, alt) => {
  const img = document.createElement('bd-img');
  img.setAttribute('src', src);
  img.setAttribute('alt', alt);
  return img;
};

/** The logo, as a bd-img the band sizes. */
const getIcon = (block) => {
  const image = block.querySelector('img');
  const src = image && (image.currentSrc || image.getAttribute('src'));
  if (src) return toImg(src, image.getAttribute('alt') || '');

  const icon = block.querySelector('[class*="icon-"]');
  const iconName = icon && Array.from(icon.classList)
    .find((className) => className.startsWith('icon-'))
    ?.substring(5);
  const iconMarker = block.textContent.match(/:([a-z0-9-]+):/i);
  const markerName = iconMarker?.[1];

  if (!iconName && !markerName) return null;
  return toImg(`/common/icons/${iconName || markerName}.svg`, '');
};

const getContentCells = (block, heading) => {
  const headingCell = heading && [...block.querySelectorAll('div')].find(
    (cell) => cell.contains(heading) && cell.parentElement?.parentElement === block,
  );
  const row = headingCell?.parentElement;
  const descriptionCell = row && [...row.children].find(
    (cell) => cell !== headingCell && cell.textContent.trim(),
  );

  return { headingCell, descriptionCell };
};

const getDescription = (block, heading, descriptionCell) => {
  const description = descriptionCell || [...block.querySelectorAll('p')].find(
    (paragraph) => paragraph.textContent.trim(),
  );

  if (!description) return '';

  const cleanedDescription = description.cloneNode(true);
  cleanedDescription.querySelectorAll(
    'svg, picture, img, [class*="icon-"], .button-container, a.button',
  ).forEach(
    (element) => element.remove(),
  );
  return cleanedDescription.textContent
    .replace(/:[a-z0-9-]+:/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/* A column's buttons, white on the band: the title column's first one
   filled, the rest and the description column's outlined. */
const appendButtons = (banner, cell, slot) => {
  if (!cell) return;

  cell.querySelectorAll('.button-container a, a.button').forEach((link, index) => {
    const button = document.createElement('bd-button');
    button.setAttribute('slot', slot);
    button.setAttribute('href', link.getAttribute('href') || '');
    button.setAttribute(
      'appearance',
      slot === 'description-actions' || index > 0 || link.classList.contains('secondary')
        ? 'outline-white'
        : 'white',
    );
    button.setAttribute('size', 'sm');
    button.textContent = link.textContent.trim();
    banner.append(button);
  });
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const { headingCell, descriptionCell } = getContentCells(block, heading);
  const description = getDescription(block, heading, descriptionCell);
  const spotlightSection = document.createElement('bd-spotlight');
  const title = heading?.textContent.trim();

  if (title) {
    // the band's title, a page section's h2; the band sets its size and ink
    const titleHeading = document.createElement('bd-h');
    titleHeading.slot = 'title';
    titleHeading.setAttribute('as', 'h2');
    titleHeading.textContent = title;
    spotlightSection.append(titleHeading);
  }
  if (description) {
    const descriptionText = document.createElement('bd-p');
    descriptionText.slot = 'description';
    descriptionText.textContent = description;
    spotlightSection.append(descriptionText);
  }

  const icon = getIcon(block);
  if (icon) {
    icon.slot = 'icon';
    spotlightSection.append(icon);
  }

  // the buttons under the title, then those under the description
  appendButtons(spotlightSection, headingCell, 'actions');
  appendButtons(spotlightSection, descriptionCell, 'description-actions');

  try {
    await load(spotlightSection);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('spotlight-section: DSN import failed, continuing with native rendering', err);
  }
  block.replaceChildren(spotlightSection);
}
