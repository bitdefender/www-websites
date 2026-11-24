import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import { liftSectionHeader, splitAroundHeading } from '../../scripts/utils/utils.js';

// a section as decorateSections leaves it: default content, then a block
function setupSection({
  content, header = '', style = '', blocks = 1,
}) {
  document.body.innerHTML = `
    <main>
      <div class="section ${style}" ${header ? `data-header="${header}"` : ''}>
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

/* The design system modules are an empty stub in tests (vitest.config.js):
   the bd-* elements stay un-upgraded, the tests check the header the helper
   builds. */
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
    expect(header.querySelector(':scope > span[slot="eyebrow"]').textContent).toBe('25 years');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Proven by Independent Testing');
    expect(title.getAttribute('as')).toBe('h2');
    expect(header.hasAttribute('as')).toBe(false);
    expect(header.hasAttribute('heading')).toBe(false);
    expect(header.getAttribute('layout')).toBe('stacked');
    expect(header.id).toBe('proven');
    expect(wrapper.querySelector('h2')).toBeNull();
  });

  it('slots the lead as a bd-p description, its link an underlined bd-link', async () => {
    const [block] = setupSection({ content: PROVEN });

    const header = await liftSectionHeader(block);

    expect(header.querySelector('[slot="lead"]')).toBeNull();
    const lead = header.querySelector(':scope > bd-p[slot="description"]');
    expect(lead.textContent).toBe('Independent analysts recognize Bitdefender.');
    const link = lead.querySelector('bd-link');
    expect(link.getAttribute('href')).toBe('/awards/');
    expect(link.hasAttribute('inline')).toBe(true);
    expect(link.hasAttribute('underline')).toBe(true);
    expect(header.querySelector('[slot="eyebrow"]')).toBeNull();
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

  it('takes the layout from a section-header-<layout> Section Metadata style', async () => {
    let [block] = setupSection({ content: PROVEN, style: 'section-header-split' });
    expect((await liftSectionHeader(block)).getAttribute('layout')).toBe('split');

    [block] = setupSection({ content: PROVEN, style: 'section-header-split', header: 'centered' });
    expect((await liftSectionHeader(block)).getAttribute('layout')).toBe('split');

    [block] = setupSection({ content: PROVEN, style: 'section-header-split' });
    expect((await liftSectionHeader(block, { layout: 'centered' })).getAttribute('layout')).toBe('centered');
  });

  it('lifts one header per section, for the first block that asks', async () => {
    const [first, second] = setupSection({ content: PROVEN, blocks: 2 });

    expect(await liftSectionHeader(first)).not.toBeNull();
    expect(await liftSectionHeader(second)).toBeNull();
    expect(document.querySelectorAll('bd-section-header')).toHaveLength(1);
  });

  it('lifts a lone paragraph as the lead when there is no heading', async () => {
    const [block] = setupSection({ content: '<p>Just a paragraph</p>' });

    const header = await liftSectionHeader(block);

    expect(header.querySelector('[slot="title"]')).toBeNull();
    expect(header.querySelector('[slot="eyebrow"]')).toBeNull();
    expect(header.querySelector('[slot="description"]').textContent).toBe('Just a paragraph');
    expect(document.querySelector('.default-content-wrapper > p')).toBeNull();
  });

  it('reads the first of two paragraphs as the eyebrow when there is no heading', async () => {
    const [block] = setupSection({
      content: '<p>15+ years of AI-driven security innovation</p><p>Bitdefender is applying AI.</p>',
      style: 'section-header-split',
    });

    const header = await liftSectionHeader(block);

    expect(header.querySelector('[slot="eyebrow"]').textContent).toBe('15+ years of AI-driven security innovation');
    expect(header.querySelector('[slot="description"]').textContent).toBe('Bitdefender is applying AI.');
    expect(header.getAttribute('layout')).toBe('split');
  });

  it('leaves a picture where it is and lifts the copy under it', async () => {
    const [block] = setupSection({
      content: '<p><picture><img src="logo.png" alt=""></picture></p><p>Whatever you protect.</p>',
    });

    const header = await liftSectionHeader(block);
    const wrapper = document.querySelector('.default-content-wrapper');

    expect(header.querySelector('[slot="description"]').textContent).toBe('Whatever you protect.');
    expect(wrapper.firstElementChild.querySelector('picture')).not.toBeNull();
    expect(wrapper.lastElementChild).toBe(header);
  });

  it('does nothing when there is no heading and no copy', async () => {
    const [block] = setupSection({
      content: '<p class="button-container"><a class="button" href="/">Go</a></p>',
    });

    expect(await liftSectionHeader(block)).toBeNull();
    expect(document.querySelector('bd-section-header')).toBeNull();
  });
});

describe('splitAroundHeading', () => {
  const copy = (html) => {
    const root = document.createElement('div');
    root.innerHTML = html;
    return [root, [...root.querySelectorAll('p')]];
  };

  it('splits the copy at the heading', () => {
    const [root, paragraphs] = copy('<p>Eyebrow</p><h3>Title</h3><p>Body</p><p>More</p>');

    const { heading, before, after } = splitAroundHeading(root, paragraphs);

    expect(heading.textContent).toBe('Title');
    expect(before.map((p) => p.textContent)).toEqual(['Eyebrow']);
    expect(after.map((p) => p.textContent)).toEqual(['Body', 'More']);
  });

  it('reads a lone paragraph as the copy after a missing heading', () => {
    const [root, paragraphs] = copy('<p>Body</p>');

    expect(splitAroundHeading(root, paragraphs))
      .toEqual({ heading: null, before: [], after: paragraphs });
  });

  it('reads the first of two or more as the copy before a missing heading', () => {
    const [root, paragraphs] = copy('<p>Badge</p><p>Body</p><p>More</p>');

    const { before, after } = splitAroundHeading(root, paragraphs);

    expect(before).toEqual([paragraphs[0]]);
    expect(after).toEqual(paragraphs.slice(1));
  });
});
