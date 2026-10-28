import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
  getSectionContent, liftSectionHeader, wrapSectionsInDsSection,
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
   fails and the helper logs it, but the sections are still wrapped. */
describe('wrapSectionsInDsSection', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('puts every section\'s wrappers into one bd-section, in order', () => {
    const main = setupMain();

    wrapSectionsInDsSection(main);

    const sections = [...main.querySelectorAll(':scope > .section')];
    expect(sections).toHaveLength(2);
    sections.forEach((section) => {
      expect(section.children).toHaveLength(1);
      expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    });
    expect([...sections[0].firstElementChild.children].map((el) => el.className))
      .toEqual(['default-content-wrapper', 'demo-wrapper']);
  });

  it('turns an edge off from the Section Metadata style', () => {
    const main = setupMain('no-padding-top');

    wrapSectionsInDsSection(main);

    const [first, second] = main.querySelectorAll('bd-section');
    expect(first.hasAttribute('no-padding-top')).toBe(true);
    expect(first.hasAttribute('no-padding-bottom')).toBe(false);
    expect(second.hasAttribute('no-padding-top')).toBe(false);
  });

  it('still lets a block lift its section header', async () => {
    const main = setupMain();
    wrapSectionsInDsSection(main);

    const header = await liftSectionHeader(main.querySelector('.demo'));

    expect(header?.getAttribute('heading')).toBe('AI Across Bitdefender');
  });
});

describe('getSectionContent', () => {
  it('is the bd-section when the section has one, the section otherwise', () => {
    const main = setupMain();
    const section = main.querySelector('.section');
    expect(getSectionContent(section)).toBe(section);

    wrapSectionsInDsSection(main);

    expect(getSectionContent(section).tagName).toBe('BD-SECTION');
  });
});
