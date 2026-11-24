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

  it('puts its section on the design system rhythm, in a bd-section', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
  });

  it('slots the title as the section\'s h2 and the description as a bd-p, for the band to size', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const spotlight = block.querySelector('bd-spotlight');
    const title = spotlight.querySelector(':scope > bd-h[slot="title"]');
    expect(title.getAttribute('as')).toBe('h2');
    expect(title.textContent).toBe('Bitdefender joined the Global Anti-Scam Alliance');
    ['visual-level', 'color', 'font-weight'].forEach((name) => expect(title.hasAttribute(name)).toBe(false));
    const description = spotlight.querySelector(':scope > bd-p[slot="description"]');
    expect(description.textContent)
      .toBe('The Global Anti-Scam Alliance unites organisations, experts and law enforcement.');
  });

  it('slots the logo above the description, as a bd-img', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const icon = block.querySelector('bd-spotlight > bd-img[slot="icon"]');
    expect(icon.getAttribute('src')).toBe('./media_gasa.png');
    expect(icon.getAttribute('alt')).toBe('GASA');
    expect(block.querySelector('bd-spotlight > picture, bd-spotlight > img')).toBeNull();
  });

  it('draws an icon span as the logo when there is no picture', async () => {
    const block = setupSpotlight(AUTHORED.replace(
      /<p><picture>.*<\/picture><\/p>/,
      '<p><span class="icon icon-gasa-logo"></span></p>',
    ));

    await decorate(block);

    const icon = block.querySelector('bd-spotlight > bd-img[slot="icon"]');
    expect(icon.getAttribute('src')).toBe('/common/icons/gasa-logo.svg');
    expect(icon.getAttribute('alt')).toBe('');
  });

  it('puts each cell\'s buttons under its column, white first and outline after', async () => {
    const block = setupSpotlight();

    await decorate(block);

    const spotlight = block.querySelector('bd-spotlight');
    const [learn] = spotlight.querySelectorAll(':scope > bd-button[slot="actions"]');
    const [report] = spotlight.querySelectorAll(':scope > bd-button[slot="description-actions"]');
    expect(learn.getAttribute('href')).toBe('https://www.gasa.org/');
    expect(learn.getAttribute('appearance')).toBe('white');
    expect(learn.getAttribute('size')).toBe('sm');
    // the label is the button's text, which names it
    expect(learn.textContent).toBe('Learn more');
    expect(learn.hasAttribute('label')).toBe(false);
    expect(learn.children).toHaveLength(0);
    expect(report.getAttribute('href')).toBe('https://www.gasa.org/report');
    expect(report.getAttribute('appearance')).toBe('outline-white');
  });
});
