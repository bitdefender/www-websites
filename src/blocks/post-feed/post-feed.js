import { load } from '@repobit/dex-system-design/loader';
import { liftSectionHeader, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The homepage's Latest insights, on the design system's bd-post-card, under
 * the section header. Authored one post a row: [cover picture] [category,
 * h3 with the post's link], in any cell order.
 */

// the cue under the title; bd-post-card draws no words of its own
const READ_MORE = 'Read more';

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

const slotted = (tag, slot, words) => {
  const el = document.createElement(tag);
  el.slot = slot;
  el.textContent = words;
  return el;
};

/* The cover, as the bd-img the card's media slot takes: the picture's image,
   the one the browser already picked, else its webp, else its fallback. It
   illustrates the title beside it, so it has no alt of its own. */
const buildCover = (row) => {
  const picture = row.querySelector('picture');
  const img = picture?.querySelector('img');
  const webp = picture?.querySelector('source[type="image/webp"]:not([media])')?.getAttribute('srcset');
  const src = img?.currentSrc || webp || img?.getAttribute('src');
  if (!img || !src) return null;
  const cover = document.createElement('bd-img');
  cover.slot = 'media';
  cover.setAttribute('src', src);
  ['width', 'height', 'loading'].forEach((name) => {
    if (img.hasAttribute(name)) cover.setAttribute(name, img.getAttribute(name));
  });
  cover.setAttribute('alt', '');
  return cover;
};

const buildCard = (row) => {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = heading?.querySelector('a') || row.querySelector('a');
  if (!heading && !link) return null;
  const category = [...row.querySelectorAll('p')]
    .find((p) => text(p) && !p.querySelector('picture') && !p.contains(link));

  const card = document.createElement('bd-post-card');
  if (link) card.setAttribute('href', link.getAttribute('href') || '');
  const cover = buildCover(row);
  if (cover) card.append(cover);
  if (category) {
    // the category over the cover, as the card's badge
    const badge = slotted('bd-badge', 'badge', text(category));
    [['variant', 'info'], ['appearance', 'shade'], ['size', 'sm']]
      .forEach(([name, value]) => badge.setAttribute(name, value));
    card.append(badge);
  }
  // the author's level, else h3: the posts are items under the section's h2
  const title = slotted('bd-h', 'title', text(heading || link));
  title.setAttribute('as', heading ? heading.tagName.toLowerCase() : 'h3');
  card.append(title);
  // drawn only with an href
  if (link) card.append(slotted('span', 'read-more', READ_MORE));
  return card;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  // the section's heading, as bd-section-header
  const header = liftSectionHeader(block);

  const grid = document.createElement('bd-grid');
  // the design system's page column (styles.css), on the same edges as the sections around it
  grid.className = 'ds-page-column';
  // one post a row, three across from lg
  [['cols', '1'], ['cols-sm', '1'], ['cols-md', '1'], ['cols-lg', '3'], ['gap', 'md']]
    .forEach(([name, value]) => grid.setAttribute(name, value));
  grid.append(...[...block.children].map(buildCard).filter(Boolean));

  // the cards are built from copies, so the authored rows are whole until they replace them
  try {
    await load(grid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('post-feed: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }
  block.replaceChildren(grid);
  await header;
}
