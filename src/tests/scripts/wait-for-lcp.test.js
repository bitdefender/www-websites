import {
  describe, it, expect, beforeEach,
} from 'vitest';
import { waitForLCP } from '../../scripts/lib-franklin.js';

/** A hero whose section metadata repeats the block's name as a style, as decorateMain leaves it. */
const PAGE = `
  <main>
    <div class="section hero-dropdown small-business-banner hero-dropdown-container">
      <div class="hero-dropdown-wrapper">
        <div class="hero-dropdown block" data-block-name="hero-dropdown" data-block-status="initialized">
          <div><div><h1>Small Office Security</h1></div></div>
        </div>
      </div>
    </div>
  </main>`;

describe('waitForLCP', () => {
  beforeEach(() => {
    window.hlx = { codeBasePath: '' };
    document.body.innerHTML = PAGE;
  });

  it('loads the LCP block, not a section styled with its name', () => {
    // loadBlock marks what it loads before its first await, so the call need not settle
    waitForLCP(['.hero', '.hero-dropdown']);
    const section = document.querySelector('.section');
    const block = document.querySelector('.block');

    expect(section.dataset.blockStatus).toBeUndefined();
    expect(block.dataset.blockStatus).toBe('loading');
    const requested = [...document.head.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'));
    expect(requested).toEqual(['/blocks/hero-dropdown/hero-dropdown.css']);
  });
});
