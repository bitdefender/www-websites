import { load } from '@repobit/dex-system-design/loader';

const buildReview = (cell, background) => {
  const paragraphs = [...cell.querySelectorAll('p')].filter(
    (p) => !p.querySelector('[class*="icon-"]') && p.textContent.trim(),
  );
  const [quoteP, dateP] = [paragraphs[0], paragraphs[paragraphs.length - 1]];
  const source = cell.querySelector('h1, h2, h3, h4, h5, h6');

  if (!quoteP) return null;

  const review = document.createElement('bd-review');
  review.setAttribute('background', background);

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
  const sectionEl = block.closest('.section');
  const wrapper = sectionEl?.querySelector('.default-content-wrapper');
  const heading = wrapper?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent.trim() || '';

  // the container ground, or the brand wash
  const background = block.classList.contains('neutral') ? 'container' : 'tint';

  const reviewGrid = document.createElement('bd-review-grid');
  if (title) {
    // the level 3.x drew the grid's title at
    const titleEl = document.createElement('bd-h');
    titleEl.setAttribute('slot', 'title');
    titleEl.setAttribute('as', 'h2');
    titleEl.textContent = title;
    reviewGrid.append(titleEl);
  }

  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    const review = buildReview(cell, background);
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
    if (!wrapper.textContent.trim()) wrapper.remove();
  }
}
