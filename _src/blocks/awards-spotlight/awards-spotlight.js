import { getDsnBase, liftSectionHeader } from '../../scripts/utils/utils.js';

/*
 * The homepage's Proven carousel, rendered with the design system's
 * bd-awards-spotlight: one award a slide. Authored one award a row; the row
 * holds an h3, its paragraph and the award's mark (a picture), in one cell or
 * spread over two, in any order. The section's header is centred unless
 * Section Metadata `Header` says otherwise, and its button links become the
 * two primary buttons under it.
 */

// The award marks are exported at 1.5x the size Figma draws them.
const ASSET_SCALE = 1.5;

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

/** The mark at twice its drawn width, as webp, when it is an EDS media URL. */
const logoSrc = (img, width) => {
  const url = new URL(img.getAttribute('src'), window.location.href);
  if (url.searchParams.has('width') && width) {
    url.searchParams.set('width', String(width * 2));
    url.searchParams.set('format', 'webply');
  }
  return url.href;
};

const readAward = (row) => {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const img = row.querySelector('picture img, img');
  const body = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && text(p))
    .map(text)
    .join(' ');
  if (!heading && !body) return null;

  const award = { title: text(heading), body };
  if (img) {
    const width = Math.round(Number(img.getAttribute('width')) / ASSET_SCALE) || undefined;
    const height = Math.round(Number(img.getAttribute('height')) / ASSET_SCALE) || undefined;
    Object.assign(award, {
      logo: logoSrc(img, width),
      logoAlt: img.getAttribute('alt') || '',
      logoWidth: width,
      logoHeight: height,
    });
  }
  return award;
};

/** The header's button links, as primary bd-button-links side by side. */
const buildActions = (section) => {
  const wrapper = section?.querySelector(':scope > .default-content-wrapper');
  const buttons = [...(wrapper?.querySelectorAll(':scope > p.button-container') || [])]
    .filter((p) => p.querySelector('a'));
  if (!buttons.length) return;

  const actions = document.createElement('div');
  actions.className = 'awards-spotlight-actions';
  buttons.forEach((p) => {
    const link = p.querySelector('a');
    const button = document.createElement('bd-button-link');
    button.setAttribute('variant', 'primary');
    button.setAttribute('size', 'lg');
    button.setAttribute('fullwidth', '');
    button.setAttribute('href', link.getAttribute('href') || '');
    if (link.target) button.setAttribute('target', link.target);
    button.textContent = text(link);
    actions.append(button);
  });
  buttons[0].replaceWith(actions);
  buttons.slice(1).forEach((p) => p.remove());
};

export default async function decorate(block) {
  const section = block.closest('.section');
  // Proven is drawn centred; an author's Section Metadata still wins
  const header = liftSectionHeader(block, { layout: section?.dataset.header || 'centered' });
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}awards-spotlight`),
      import(`${base}button`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('awards-spotlight: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }

  const rows = [...block.children];
  const awards = rows.map(readAward).filter(Boolean);
  const heading = rows.map((row) => row.querySelector('h1, h2, h3, h4, h5, h6')).find(Boolean);

  const spotlight = document.createElement('bd-awards-spotlight');
  spotlight.awards = awards;
  spotlight.setAttribute('autoplay', '');
  if (heading) spotlight.setAttribute('as', heading.tagName.toLowerCase());

  buildActions(section);
  block.replaceChildren(spotlight);

  // the carousel is named after the section, in the page's language
  const sectionHeader = await header;
  const label = sectionHeader?.getAttribute('heading');
  if (label) spotlight.setAttribute('label', label);
}
