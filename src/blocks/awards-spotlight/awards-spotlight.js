import { load } from '@repobit/dex-system-design/loader';
import {
  fullWidthOnPhone, getSectionContent, liftSectionHeader, wrapSectionInDsSection,
} from '../../scripts/utils/utils.js';

/*
 * The Proven section's awards carousel, on the design system's
 * <bd-awards layout="spotlight">, under the section header. Authored one
 * award a row: an h3, a paragraph, and the award's mark (a picture), in any
 * cell order; each is a bd-award. The section's button links (Consumer /
 * Enterprise Recognition), which liftSectionHeader leaves under the header,
 * become primary bd-buttons.
 */

// The award marks are exported at 1.5x the size the design draws them (160 wide).
const ASSET_SCALE = 1.5;

// What 3.x's spotlight drew without being told, and 4.0 leaves to the page:
// the carousel's and its dots' accessible names, and its 6s slide
const LABEL = 'Awards and recognition';
const ITEM_LABEL = 'Go to award';
const AUTOPLAY_DELAY = '6000';

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

/** A row as a bd-award: its mark the logo bd-img, its h3 the title, its paragraph the text. */
const buildAward = (row) => {
  const title = row.querySelector('h1, h2, h3, h4, h5, h6');
  const img = row.querySelector('picture img, img');
  const body = [...row.querySelectorAll('p')].find((p) => text(p) && !p.querySelector('picture, img'));
  if (!title && !img) return null;

  const award = document.createElement('bd-award');
  if (img) {
    const logo = document.createElement('bd-img');
    logo.slot = 'media';
    logo.setAttribute('src', img.currentSrc || img.src);
    logo.setAttribute('alt', img.getAttribute('alt') || '');
    const width = Number(img.getAttribute('width'));
    const height = Number(img.getAttribute('height'));
    if (width && height) {
      logo.setAttribute('width', String(Math.round(width / ASSET_SCALE)));
      logo.setAttribute('height', String(Math.round(height / ASSET_SCALE)));
    }
    // the mark whole in its column, as 3.x's spotlight drew it
    logo.setAttribute('fit', 'contain');
    award.append(logo);
  }
  if (text(title)) {
    // an h3 under the section's h2, the level 3.x's spotlight drew
    const heading = document.createElement('bd-h');
    heading.slot = 'title';
    heading.setAttribute('as', 'h3');
    heading.textContent = text(title);
    award.append(heading);
  }
  // the paragraph is the award's default slot
  if (text(body)) award.append(text(body));
  return award;
};

/**
 * The section's authored button links, as a row of primary DS buttons under
 * the header. The links stay as they are if the buttons fail to load.
 */
const liftActions = async (block) => {
  const section = block.closest('.section');
  const wrapper = section && getSectionContent(section).querySelector(':scope > .default-content-wrapper');
  const containers = [...(wrapper?.querySelectorAll(':scope > .button-container') || [])];
  if (!containers.length) return;

  const actions = document.createElement('div');
  actions.className = 'awards-spotlight-actions ds-page-column';
  const buttons = containers.map((container) => {
    const link = container.querySelector('a');
    const button = document.createElement('bd-button');
    button.setAttribute('appearance', 'primary');
    button.setAttribute('href', link?.getAttribute('href') || '');
    button.textContent = text(link);
    return button;
  });
  actions.append(...buttons);
  fullWidthOnPhone(...buttons);
  try {
    await load(actions);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('awards-spotlight: DSN import failed, keeping the authored links', err);
    return;
  }
  containers[0].before(actions);
  containers.forEach((container) => container.remove());
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  // the section's heading and lead, as bd-section-header: Proven is centred in
  // every frame, so the block asks for it rather than leaving it to metadata
  const header = liftSectionHeader(block, { layout: 'centered' });

  const spotlight = document.createElement('bd-awards');
  spotlight.setAttribute('layout', 'spotlight');
  spotlight.setAttribute('autoplay', '');
  spotlight.setAttribute('autoplay-delay', AUTOPLAY_DELAY);
  // the carousel has no title of its own to name it: the section header is outside it
  spotlight.setAttribute('label', LABEL);
  spotlight.setAttribute('item-label', ITEM_LABEL);
  spotlight.append(...[...block.children].map(buildAward).filter(Boolean));
  try {
    await load(spotlight);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('awards-spotlight: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }
  block.replaceChildren(spotlight);

  await header;
  await liftActions(block);
}
