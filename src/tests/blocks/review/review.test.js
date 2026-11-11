/**
 * Unit tests for the review block: reviews on the design system's
 * bd-review-grid, under the section's title, in a section on bd-section's
 * rhythm. The design system modules are an empty stub in tests
 * (vitest.config.js), so these tests check the markup the block builds, not
 * the components' rendering.
 */
import { describe, expect, it } from 'vitest';

import { decorateBlocks, decorateSections } from '../../../scripts/lib-franklin.js';
import decorate from '../../../blocks/review/review.js';

const AUTHORED = `
  <div>
    <h3 id="what-the-experts-say">What the experts say</h3>
    <div class="review">
      <div>
        <div>
          <p><span class="icon icon-quote"></span></p>
          <p>Bitdefender is <strong>excellent</strong> protection that is easy to install and use.</p>
          <h4>PCMag</h4>
          <p>March 2026</p>
        </div>
        <div>
          <p>The best antivirus we tested this year.</p>
          <h4>AV-Test</h4>
          <p>February 2026</p>
        </div>
      </div>
    </div>
  </div>`;

async function render(html = AUTHORED) {
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');
  decorateSections(main);
  decorateBlocks(main);
  const block = main.querySelector('.review');
  await decorate(block);
  return block;
}

describe('review', () => {
  it('puts its section on the design system rhythm, in a bd-section', async () => {
    const block = await render();
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
  });

  it('slots the section\'s heading as the grid\'s h2 and drops the wrapper it leaves empty', async () => {
    const block = await render();
    const title = block.querySelector('bd-review-grid > bd-h[slot="title"]');
    expect(title.textContent).toBe('What the experts say');
    expect(title.getAttribute('as')).toBe('h2');
    expect(title.hasAttribute('visual-level')).toBe(false);
    expect(block.closest('bd-section').querySelector('.default-content-wrapper')).toBeNull();
  });

  it('builds a review per cell: the quote, its source and its date', async () => {
    const block = await render();
    const reviews = [...block.querySelectorAll('bd-review-grid > bd-review')];
    expect(reviews).toHaveLength(2);
    const [first] = reviews;
    expect(first.querySelector(':scope > span:not([slot])').innerHTML)
      .toBe('Bitdefender is <strong>excellent</strong> protection that is easy to install and use.');
    expect(first.querySelector(':scope > [slot="caption"]').textContent).toBe('PCMag');
    expect(first.querySelector(':scope > [slot="date"]').textContent).toBe('March 2026');
    // the review's own ground, the brand wash, unless the block says otherwise
    reviews.forEach((review) => expect(review.hasAttribute('background')).toBe(false));
  });

  it('puts the neutral style\'s reviews on the container ground', async () => {
    const block = await render(AUTHORED.replace('class="review"', 'class="review neutral"'));
    block.querySelectorAll('bd-review')
      .forEach((review) => expect(review.getAttribute('background')).toBe('container'));
  });

  it('renders no title without a heading', async () => {
    const block = await render(AUTHORED.replace(/<h3[^>]*>.*<\/h3>/, ''));
    expect(block.querySelector('[slot="title"]')).toBeNull();
    expect(block.querySelectorAll('bd-review')).toHaveLength(2);
  });
});
