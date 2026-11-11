/**
 * Unit tests for the accordion block. The fixture is three sections modelled
 * on /en-us/consumer/antivirus: the FAQ under its heading, a system
 * requirements accordion with no heading and no look of its own, and a terms
 * of use accordion with a note after it. The design system modules are
 * replaced by an empty module, so these tests check the markup the block
 * builds, not the components' rendering.
 */
import {
  beforeAll, describe, expect, it,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { decorateBlocks, decorateSections } from '../../../scripts/lib-franklin.js';

const { default: decorate } = await import('../../../blocks/accordion/accordion.js');

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(path.join(__dirname, 'accordion.mock.html'), 'utf-8');

const titleOf = (el) => el.querySelector(':scope > bd-h[slot="title"]');

describe('accordion block', () => {
  let faq;
  let requirements;
  let terms;

  beforeAll(async () => {
    document.body.innerHTML = `<main>${fixture}</main>`;
    const main = document.querySelector('main');
    decorateSections(main);
    decorateBlocks(main);
    const blocks = [...main.querySelectorAll('.accordion.block')];
    // in page order, as lib-franklin loads them
    await blocks.reduce((done, block) => done.then(() => decorate(block)), Promise.resolve());
    [faq, requirements, terms] = blocks.map((block) => block.querySelector(':scope > bd-accordion'));
  });

  it('puts each section on the design system rhythm, in a bd-section', () => {
    [faq, requirements, terms].forEach((accordion) => {
      const section = accordion.closest('.section');
      expect(section.children).toHaveLength(1);
      expect(section.firstElementChild.tagName).toBe('BD-SECTION');
      expect(accordion.closest('bd-section')).toBe(section.firstElementChild);
    });
  });

  it('draws the FAQ look: no band, each item a card on the brand wash', () => {
    expect(faq.getAttribute('appearance')).toBe('faq');
    expect(faq.getAttribute('background')).toBe('none');
    const items = [...faq.querySelectorAll(':scope > bd-accordion-item')];
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(item.getAttribute('background')).toBe('tint'));
  });

  it('takes the section heading as its title, at the level the page wrote it, and the questions a level under', () => {
    const title = titleOf(faq);
    expect(title.textContent).toBe('Frequently asked questions');
    expect(title.getAttribute('as')).toBe('h2');
    expect(faq.closest('bd-section').querySelector('.default-content-wrapper')).toBeNull();

    const item = faq.querySelector(':scope > bd-accordion-item');
    expect(titleOf(item).getAttribute('as')).toBe('h3');
    expect(titleOf(item).textContent)
      .toBe('How does Bitdefender Antivirus Plus protect me against viruses and other cyber threats?');
  });

  it('writes the answers as atoms: a bd-p per paragraph, a bd-list for a list', () => {
    const [first, second] = faq.querySelectorAll(':scope > bd-accordion-item');
    const paragraphs = first.querySelectorAll(':scope > bd-p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[1].textContent).toContain('a wealth of advanced security features');

    const list = second.querySelector(':scope > bd-list');
    expect(list.getAttribute('type')).toBe('unordered');
    expect(list.querySelectorAll(':scope > bd-li > bd-p')).toHaveLength(2);
  });

  it('keeps bd-accordion\'s own look where the author picked none', () => {
    expect(requirements.hasAttribute('appearance')).toBe(false);
    expect(requirements.hasAttribute('background')).toBe(false);
    expect(titleOf(requirements)).toBeNull();
    requirements.querySelectorAll(':scope > bd-accordion-item').forEach((item) => {
      expect(item.hasAttribute('background')).toBe(false);
      expect(titleOf(item).getAttribute('as')).toBe('h3');
    });
  });

  it('opens the first item only on first-open', () => {
    const items = [...requirements.querySelectorAll(':scope > bd-accordion-item')];
    expect(items.map((item) => item.hasAttribute('open'))).toEqual([true, false]);
    expect([...faq.querySelectorAll(':scope > bd-accordion-item')].some((item) => item.hasAttribute('open')))
      .toBe(false);
  });

  it('draws the terms look in .terms-of-use, its title at the page\'s level', () => {
    expect(terms.getAttribute('appearance')).toBe('terms');
    expect(terms.hasAttribute('background')).toBe(false);
    expect(titleOf(terms).textContent).toBe('Terms of use');
    expect(titleOf(terms).getAttribute('as')).toBe('h2');
  });

  it('writes the section\'s other paragraphs as footer notes', () => {
    const notes = [...terms.querySelectorAll(':scope > bd-p[slot="footer"]')];
    expect(notes.map((note) => note.textContent)).toEqual(['* Prices include VAT.']);
    expect(terms.closest('bd-section').querySelector('.default-content-wrapper')).toBeNull();
  });
});
