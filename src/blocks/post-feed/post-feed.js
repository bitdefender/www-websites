import { load } from '@repobit/dex-system-design/loader';
import { liftSectionHeader, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The homepage's Latest insights, on the design system's bd-post-card, under
 * the section header. Authored one post a row: [cover picture] [category,
 * h3 with the post's link], in any cell order.
 */

// the design system's lg (992): the cards go three across
const DESKTOP = '(min-width: 992px)';

// the cue under the title; bd-post-card draws no words of its own
const READ_MORE = 'Read more';

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

const slotted = (tag, slot, words) => {
  const el = document.createElement(tag);
  el.slot = slot;
  el.textContent = words;
  return el;
};

const buildCard = (row) => {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = heading?.querySelector('a') || row.querySelector('a');
  if (!heading && !link) return null;
  const category = [...row.querySelectorAll('p')]
    .find((p) => text(p) && !p.querySelector('picture') && !p.contains(link));

  const card = document.createElement('bd-post-card');
  if (link) card.setAttribute('href', link.getAttribute('href') || '');
  if (category) {
    // the category over the cover, as the card's badge
    const badge = slotted('bd-badge', 'badge', text(category));
    [['variant', 'info'], ['appearance', 'shade'], ['size', 'sm']]
      .forEach(([name, value]) => badge.setAttribute(name, value));
    card.append(badge);
  }
  // the author's level, else the h3 the card drew
  const title = slotted('bd-h', 'title', text(heading || link));
  title.setAttribute('as', heading ? heading.tagName.toLowerCase() : 'h3');
  card.append(title);
  // drawn only with an href
  if (link) card.append(slotted('span', 'read-more', READ_MORE));
  return card;
};

const addCover = (card, row) => {
  const picture = row.querySelector('picture');
  if (!picture) return;
  picture.setAttribute('slot', 'media');
  // the cover illustrates the title beside it
  picture.querySelector('img')?.setAttribute('alt', '');
  card.append(picture);
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  // the section's heading, as bd-section-header
  const header = liftSectionHeader(block);

  const grid = document.createElement('bd-grid');
  // the design system's page column (styles.css), on the hero's edges
  grid.className = 'ds-page-column';
  [['cols', '1'], ['cols-sm', '1'], ['cols-md', '1'], ['cols-lg', '3']]
    .forEach(([name, value]) => grid.setAttribute(name, value));
  // phone and tablet stack the posts 16 apart; the desktop row sets them 24 apart
  const desktop = window.matchMedia?.(DESKTOP);
  const setGap = () => grid.setAttribute('gap', !desktop || desktop.matches ? 'md' : 'sm');
  setGap();
  desktop?.addEventListener('change', setGap);
  const posts = [...block.children]
    .map((row) => ({ row, card: buildCard(row) }))
    .filter(({ card }) => card);
  grid.append(...posts.map(({ card }) => card));

  try {
    await load(grid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('post-feed: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }

  // the covers move only now, so a failed load leaves them in the authored rows
  posts.forEach(({ row, card }) => addCover(card, row));
  block.replaceChildren(grid);
  await header;
}
