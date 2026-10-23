import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { liftSectionHeader } from '../../scripts/utils/utils.js';

// a section as decorateSections leaves it: default content, then a block
function setupSection({ content, header = '', blocks = 1 }) {
  document.body.innerHTML = `
    <main>
      <div class="section" ${header ? `data-header="${header}"` : ''}>
        <div class="default-content-wrapper">${content}</div>
        ${Array.from({ length: blocks }, (_, i) => `
          <div class="demo-wrapper"><div class="demo block" data-index="${i}"></div></div>`).join('')}
      </div>
    </main>`;
  return [...document.querySelectorAll('.demo')];
}

const PROVEN = `
  <h2 id="proven">Proven by Independent Testing</h2>
  <p>Independent analysts <a href="/awards/">recognize</a> Bitdefender.</p>
  <p class="button-container"><a class="button primary" href="/consumer/">Consumer Recognition</a></p>`;

/* The design system loads from esm.sh, which a test cannot reach: the import
   fails, the helper logs it, and still builds the header. */
describe('liftSectionHeader', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('turns eyebrow, heading and lead into a bd-section-header in place', async () => {
    const [block] = setupSection({ content: `<p>25 years</p>${PROVEN}` });

    const header = await liftSectionHeader(block);

    const wrapper = document.querySelector('.default-content-wrapper');
    expect(wrapper.firstElementChild).toBe(header);
    expect(header.getAttribute('eyebrow')).toBe('25 years');
    expect(header.getAttribute('heading')).toBe('Proven by Independent Testing');
    expect(header.getAttribute('as')).toBe('h2');
    expect(header.getAttribute('layout')).toBe('stacked');
    expect(header.id).toBe('proven');
    expect(wrapper.querySelector('h2')).toBeNull();
  });

  it('slots the lead with its link as an underlined bd-link', async () => {
    const [block] = setupSection({ content: PROVEN });

    const header = await liftSectionHeader(block);

    const lead = header.querySelector(':scope > p[slot="lead"]');
    expect(lead.textContent).toBe('Independent analysts recognize Bitdefender.');
    const link = lead.querySelector('bd-link');
    expect(link.getAttribute('href')).toBe('/awards/');
    expect(link.hasAttribute('inline')).toBe(true);
    expect(link.hasAttribute('underline')).toBe(true);
    expect(header.hasAttribute('eyebrow')).toBe(false);
  });

  it('leaves the button links under the header', async () => {
    const [block] = setupSection({ content: PROVEN });

    const header = await liftSectionHeader(block);

    expect(header.nextElementSibling.matches('p.button-container')).toBe(true);
  });

  it('takes the layout from Section Metadata, falling back to stacked', async () => {
    let [block] = setupSection({ content: PROVEN, header: 'Centered' });
    expect((await liftSectionHeader(block)).getAttribute('layout')).toBe('centered');

    [block] = setupSection({ content: PROVEN, header: 'sideways' });
    expect((await liftSectionHeader(block)).getAttribute('layout')).toBe('stacked');

    [block] = setupSection({ content: PROVEN, header: 'centered' });
    expect((await liftSectionHeader(block, { layout: 'split' })).getAttribute('layout')).toBe('split');
  });

  it('lifts one header per section, for the first block that asks', async () => {
    const [first, second] = setupSection({ content: PROVEN, blocks: 2 });

    expect(await liftSectionHeader(first)).not.toBeNull();
    expect(await liftSectionHeader(second)).toBeNull();
    expect(document.querySelectorAll('bd-section-header')).toHaveLength(1);
  });

  it('does nothing without a heading', async () => {
    const [block] = setupSection({ content: '<p>Just a paragraph</p>' });

    expect(await liftSectionHeader(block)).toBeNull();
    expect(document.querySelector('.default-content-wrapper').innerHTML).toContain('Just a paragraph');
  });
});
