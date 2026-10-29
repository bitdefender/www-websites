import { getDsnBase, liftSectionHeader, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * The homepage's Latest insights, on the design system's bd-post-card, under
 * the section header. Authored one post a row: [cover picture] [category,
 * h3 with the post's link], in any cell order.
 */

// the design system's lg (992): the cards go three across
const DESKTOP = '(min-width: 992px)';

const text = (el) => el?.textContent.replace(/\s+/g, ' ').trim() || '';

const buildCard = (row) => {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = heading?.querySelector('a') || row.querySelector('a');
  if (!heading && !link) return null;
  const category = [...row.querySelectorAll('p')]
    .find((p) => text(p) && !p.querySelector('picture') && !p.contains(link));

  const card = document.createElement('bd-post-card');
  card.setAttribute('heading', text(heading || link));
  if (heading) card.setAttribute('as', heading.tagName.toLowerCase());
  if (link) card.setAttribute('href', link.getAttribute('href') || '');
  if (category) card.setAttribute('badge', text(category));

  const picture = row.querySelector('picture');
  if (picture) {
    picture.setAttribute('slot', 'image');
    // the cover illustrates the title beside it
    picture.querySelector('img')?.setAttribute('alt', '');
    card.append(picture);
  }
  return card;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  // the section's heading, as bd-section-header
  const header = liftSectionHeader(block);
  const base = getDsnBase();
  try {
    await Promise.all([
      import(`${base}post-card`),
      import(`${base}grid`),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('post-feed: DSN import failed, keeping the authored content', err);
    await header;
    return;
  }

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
  grid.append(...[...block.children].map(buildCard).filter(Boolean));

  block.replaceChildren(grid);
  await header;
}
