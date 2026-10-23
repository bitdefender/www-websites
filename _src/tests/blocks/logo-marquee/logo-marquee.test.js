import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import decorate from '../../../blocks/logo-marquee/logo-marquee.js';

const logo = (name, width, height) => `
  <picture>
    <source type="image/webp" srcset="./media_${name}.png?width=750&format=webply&optimize=medium">
    <img loading="lazy" alt="${name}" src="./media_${name}.png?width=750&format=png&optimize=medium" width="${width}" height="${height}">
  </picture>`;

// the trusted line as authored on /en-us/: the text item, then every logo in one cell
const TRUSTED_CONTENT = `
  <div><div><strong>#1</strong> most awarded</div></div>
  <div><div>${logo('ferrari', 152, 32)}${logo('spurs', 126, 66)}</div></div>`;

function setupMarquee({ content = TRUSTED_CONTENT, variant = '', header = '' } = {}) {
  document.body.innerHTML = `
    <main>
      <div class="section logo-marquee-container">
        ${header ? `<div class="default-content-wrapper">${header}</div>` : ''}
        <div class="logo-marquee-wrapper">
          <div class="logo-marquee ${variant} block">${content}</div>
        </div>
      </div>
    </main>`;

  return document.querySelector('.logo-marquee');
}

/* The design system loads from esm.sh, which a test cannot reach: the import
   fails, the block logs it, and still builds the bd-* tree. */
describe('logo-marquee', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds the trusted line with the default timing', async () => {
    const block = setupMarquee();

    await decorate(block);

    const marquee = block.querySelector(':scope > bd-logo-marquee');
    expect(block.children).toHaveLength(1);
    expect(marquee.getAttribute('duration')).toBe('18');
    expect(marquee.getAttribute('gap')).toBe('48');
    expect(marquee.getAttribute('label')).toBe('#1 most awarded');
  });

  it('turns the bold figure and its words into display and label atoms', async () => {
    const block = setupMarquee();

    await decorate(block);

    const [text] = block.querySelector('bd-logo-marquee').children;
    expect(text.tagName).toBe('SPAN');
    expect(text.querySelector('bd-display').getAttribute('variant')).toBe('md');
    expect(text.querySelector('bd-display').textContent).toBe('#1');
    expect(text.querySelector('bd-p').getAttribute('variant')).toBe('small');
    expect(text.querySelector('bd-p').textContent.trim()).toBe('most awarded');
  });

  it('slots each picture in authored order, sized inline to the Figma size', async () => {
    const block = setupMarquee();

    await decorate(block);

    const pictures = [...block.querySelectorAll('bd-logo-marquee > picture')];
    expect(pictures.map((p) => p.querySelector('img').alt)).toEqual(['ferrari', 'spurs']);
    const [ferrari, spurs] = pictures.map((p) => p.querySelector('img').style);
    expect([ferrari.width, ferrari.height]).toEqual(['101px', '21px']);
    expect([spurs.width, spurs.height]).toEqual(['84px', '44px']);
    expect(pictures[0].querySelector('source')).not.toBeNull();
  });

  it('reads one logo per row as well', async () => {
    const block = setupMarquee({
      content: `<div><div>${logo('idc', 120, 48)}</div></div><div><div>${logo('gartner', 120, 28)}</div></div>`,
    });

    await decorate(block);

    expect(block.querySelectorAll('bd-logo-marquee > picture')).toHaveLength(2);
  });

  it('runs the awards variant faster and tighter, named by the section heading', async () => {
    const block = setupMarquee({
      variant: 'awards',
      header: '<h2>Proven by Independent Testing</h2>',
      content: `<div><div>${logo('idc', 120, 48)}</div></div>`,
    });

    await decorate(block);

    const marquee = block.querySelector('bd-logo-marquee');
    expect(marquee.getAttribute('duration')).toBe('10');
    expect(marquee.getAttribute('gap')).toBe('24');
    expect(marquee.getAttribute('label')).toBe('Proven by Independent Testing');
  });

  it('empties the block when there is nothing to show', async () => {
    const block = setupMarquee({ content: '<div><div></div></div>' });

    await decorate(block);

    expect(block.children).toHaveLength(0);
  });
});
