import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
  getSectionContent, liftSectionHeader, wrapSectionInDsSection,
} from '../../scripts/utils/utils.js';

// two sections as decorateSections leaves them: default content, then a block
function setupMain(firstClass = '') {
  document.body.innerHTML = `
    <main>
      <div class="section ${firstClass}">
        <div class="default-content-wrapper"><h2>AI Across Bitdefender</h2></div>
        <div class="demo-wrapper"><div class="demo block"></div></div>
      </div>
      <div class="section">
        <div class="demo-wrapper"><div class="demo block"></div></div>
      </div>
    </main>`;
  return document.querySelector('main');
}

/* The design system loads from esm.sh, which a test cannot reach: the import
   fails and the helper logs it, but the section is still wrapped. */
describe('wrapSectionInDsSection', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('puts the block\'s section wrappers into one bd-section, in order', () => {
    const main = setupMain();
    const [first, second] = main.querySelectorAll(':scope > .section');

    const bdSection = wrapSectionInDsSection(first.querySelector('.demo'));

    expect(first.children).toHaveLength(1);
    expect(first.firstElementChild).toBe(bdSection);
    expect([...bdSection.children].map((el) => el.className))
      .toEqual(['default-content-wrapper', 'demo-wrapper']);
    // a section without a design system block keeps its own layout
    expect(second.querySelector('bd-section')).toBeNull();
  });

  it('wraps a section once, however many of its blocks ask', () => {
    const main = setupMain();
    const section = main.querySelector('.section');
    const block = section.querySelector('.demo');

    const bdSection = wrapSectionInDsSection(block);

    expect(wrapSectionInDsSection(block)).toBe(bdSection);
    expect(section.querySelectorAll('bd-section')).toHaveLength(1);
  });

  it('turns an edge off from the Section Metadata style', () => {
    const main = setupMain('no-padding-top');
    const [first, second] = main.querySelectorAll('.demo');

    const top = wrapSectionInDsSection(first);
    const plain = wrapSectionInDsSection(second);

    expect(top.hasAttribute('no-padding-top')).toBe(true);
    expect(top.hasAttribute('no-padding-bottom')).toBe(false);
    expect(plain.hasAttribute('no-padding-top')).toBe(false);
  });

  it('still lets a block lift its section header', async () => {
    const main = setupMain();
    const block = main.querySelector('.demo');
    wrapSectionInDsSection(block);

    const header = await liftSectionHeader(block);

    expect(header?.getAttribute('heading')).toBe('AI Across Bitdefender');
  });
});

describe('getSectionContent', () => {
  it('is the bd-section when the section has one, the section otherwise', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const main = setupMain();
    const section = main.querySelector('.section');
    expect(getSectionContent(section)).toBe(section);

    wrapSectionInDsSection(section.querySelector('.demo'));

    expect(getSectionContent(section).tagName).toBe('BD-SECTION');
    vi.restoreAllMocks();
  });
});
