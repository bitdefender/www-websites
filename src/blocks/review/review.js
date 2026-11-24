import { load } from '@repobit/dex-system-design/loader';
import { getSectionContent, wrapSectionInDsSection } from '../../scripts/utils/utils.js';

/*
 * Reviews on the design system's bd-review-grid, which sets them in a row
 * under the section's title. Authored one review a cell: the quote, the
 * source as a heading, and the date as the last paragraph; icon paragraphs
 * are left out. The `neutral` style puts the reviews on the container ground
 * instead of the brand wash.
 */

const buildReview = (cell, neutral) => {
  const paragraphs = [...cell.querySelectorAll('p')].filter(
    (p) => !p.querySelector('[class*="icon-"]') && p.textContent.trim(),
  );
  const [quoteP, dateP] = [paragraphs[0], paragraphs[paragraphs.length - 1]];
  const source = cell.querySelector('h1, h2, h3, h4, h5, h6');

  if (!quoteP) return null;

  const review = document.createElement('bd-review');
  if (neutral) review.setAttribute('background', 'container');

  // the quote is the review's own content, its default slot
  const quote = document.createElement('span');
  quote.innerHTML = quoteP.innerHTML;
  review.append(quote);

  if (source) {
    const sourceEl = document.createElement('span');
    sourceEl.setAttribute('slot', 'caption');
    sourceEl.textContent = source.textContent.trim();
    review.append(sourceEl);
  }

  if (dateP && dateP !== quoteP) {
    const dateEl = document.createElement('span');
    dateEl.setAttribute('slot', 'date');
    dateEl.textContent = dateP.textContent.trim();
    review.append(dateEl);
  }

  return review;
};

export default async function decorate(block) {
  wrapSectionInDsSection(block);
  const section = block.closest('.section');
  const wrapper = getSectionContent(section)?.querySelector(':scope > .default-content-wrapper');
  const heading = wrapper?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent.trim() || '';
  const neutral = block.classList.contains('neutral');

  const reviewGrid = document.createElement('bd-review-grid');
  if (title) {
    // the section's title, an h2 in the page outline; the grid sets its size
    const titleEl = document.createElement('bd-h');
    titleEl.setAttribute('slot', 'title');
    titleEl.setAttribute('as', 'h2');
    titleEl.textContent = title;
    reviewGrid.append(titleEl);
  }

  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    const review = buildReview(cell, neutral);
    if (review) reviewGrid.append(review);
  });

  try {
    await load(reviewGrid);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('review: DSN import failed, continuing with native rendering', err);
  }
  block.replaceChildren(reviewGrid);

  if (title) {
    heading.remove();
    // an empty wrapper would still take a place in the section's rhythm
    if (!wrapper.textContent.trim()) wrapper.remove();
  }
}
