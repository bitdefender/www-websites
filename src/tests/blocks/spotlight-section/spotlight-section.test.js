/**
 * Unit tests for the spotlight-section block: a two-column band on the design
 * system's bd-spotlight, the title and its buttons on one side, the logo, the
 * description and its buttons on the other. The design system modules are an
 * empty stub in tests (vitest.config.js), so these tests check the markup the
 * block builds, not the component's rendering.
 */
import { describe, expect, it } from 'vitest';

import decorate from '../../../blocks/spotlight-section/spotlight-section.js';

const AUTHORED = `
  <div>
    <div>
      <h3>Bitdefender joined the Global Anti-Scam Alliance</h3>
      <p class="button-container"><a class="button" href="https://www.gasa.org/">Learn more</a></p>
    </div>
    <div>
      <p><picture><img src="./media_gasa.png" alt="GASA"></picture></p>
      <p>The Global Anti-Scam Alliance unites organisations, experts and law enforcement.</p>
      <p class="button-container"><a class="button" href="https://www.gasa.org/report">Read the report</a></p>
    </div>
  </div>`;

function setupSpotlight(content = AUTHORED) {
  document.body.innerHTML = `
    <main>
      <div class="section">
        <div class="spotlight-section-wrapper">
          <div class="spotlight-section block">${content}</div>
        </div>
      </div>
    </main>`;
  return document.querySelector('.spotlight-section');
}

describe('spotlight-section', () => {
  it('replaces the block with one bd-spotlight', async () => {
    const block = setupSpotlight();

    await decorate(block);

    expect(block.children).toHaveLength(1);
    expect(block.firstElementChild.tagName).toBe('BD-SPOTLIGHT');
  });

  it('slots the title as a bd-h at the h2 3.x drew, and the description as a bd-p', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const spotlight = block.querySelector('bd-spotlight');
    const title = spotlight.querySelector(':scope > bd-h[slot="title"]');
    expect(title.getAttribute('as')).toBe('h2');
    expect(title.textContent).toBe('Bitdefender joined the Global Anti-Scam Alliance');
    const description = spotlight.querySelector(':scope > bd-p[slot="description"]');
    expect(description.textContent)
      .toBe('The Global Anti-Scam Alliance unites organisations, experts and law enforcement.');
    // the copy is slotted, not set as 3.x's attributes
    expect(spotlight.hasAttribute('title')).toBe(false);
    expect(spotlight.hasAttribute('description')).toBe(false);
  });

  it('slots the logo above the description', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const icon = block.querySelector('bd-spotlight > picture[slot="icon"]');
    expect(icon.querySelector('img').getAttribute('alt')).toBe('GASA');
  });

  it('puts each cell\'s buttons under its column, white first and outline after', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const spotlight = block.querySelector('bd-spotlight');
    const [learn] = spotlight.querySelectorAll(':scope > bd-button[slot="actions"]');
    const [report] = spotlight.querySelectorAll(':scope > bd-button[slot="description-actions"]');
    expect(learn.getAttribute('href')).toBe('https://www.gasa.org/');
    expect(learn.getAttribute('appearance')).toBe('white');
    expect(learn.getAttribute('label')).toBe('Learn more');
    expect(learn.getAttribute('size')).toBe('sm');
    expect(learn.textContent).toBe('Learn more');
    expect(report.getAttribute('href')).toBe('https://www.gasa.org/report');
    expect(report.getAttribute('appearance')).toBe('outline-white');
    // 3.x's kind and its left/right button slots are gone
    [learn, report].forEach((button) => expect(button.hasAttribute('kind')).toBe(false));
    expect(spotlight.querySelector('[slot="left-buttons"], [slot="right-buttons"]')).toBeNull();
  });
});
