/**
 * Unit tests for the features block. The fixture is a features section
 * modelled on /en-us/consumer/antivirus: columns with the site's inline-SVG
 * icons (one coloured by a hex paragraph), one with an authored image, and one
 * whose icon file does not load. The design system modules are replaced by an
 * empty module, so these tests check the markup the block builds, not the
 * components' rendering; the icon registry is a spy.
 */
import {
  afterAll, beforeAll, describe, expect, it, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { decorateBlocks, decorateSections } from '../../../scripts/lib-franklin.js';

// every @repobit/dex-system-design module is the one stub (vitest.config.js),
// so the mock stands for the loader as well as the icon registry
const { registerIcon } = vi.hoisted(() => ({ registerIcon: vi.fn(() => true) }));
vi.mock('@repobit/dex-system-design/icons/registry', () => ({
  load: async () => {},
  autoload: () => () => {},
  registerIcon,
}));

const SVG = '<svg viewBox="0 0 100.9 89.6" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10H0z" fill="currentColor"></path></svg>';

const { default: decorate } = await import('../../../blocks/features/features.js');

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(path.join(__dirname, 'features.mock.html'), 'utf-8');

const titleOf = (el) => el.querySelector(':scope > bd-h[slot="title"]');

describe('features block', () => {
  let block;
  let columns;

  beforeAll(async () => {
    // the icons' files: decorateIcons inlines them; missing-file is not found
    vi.stubGlobal('fetch', vi.fn(async (url) => (String(url).includes('missing-file')
      ? { ok: false }
      : { ok: true, text: async () => SVG })));
    document.body.innerHTML = `<main>${fixture}</main>`;
    const main = document.querySelector('main');
    decorateSections(main);
    decorateBlocks(main);
    block = main.querySelector('.features');
    await decorate(block);
    columns = [...block.querySelectorAll(':scope > bd-feature-columns > bd-feature-column')];
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    expect(block.closest('bd-section')).toBe(section.firstElementChild);
  });

  it('writes a bd-feature-column per authored column', () => {
    expect(columns.map((col) => titleOf(col).textContent))
      .toEqual(['Protection', 'Privacy', 'Identity', 'Performance']);
  });

  it('takes the column title at the level the page wrote it, and the items a level under', () => {
    expect(titleOf(columns[0]).getAttribute('as')).toBe('h3');
    const items = [...columns[0].querySelectorAll(':scope > bd-accordion > bd-accordion-item')];
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(titleOf(item).getAttribute('as')).toBe('h4'));
  });

  it('slots the site\'s inline SVG as a bd-icon, registered under a site- name', async () => {
    const icon = columns[0].querySelector(':scope > [slot="icon"]');
    expect(icon.tagName).toBe('BD-ICON');
    expect(icon.getAttribute('name')).toBe('site-complete-protection');
    expect(icon.getAttribute('size')).toBe('2xl');
    // no ink of its own: the text's around it
    expect(icon.style.color).toBe('');

    await vi.waitFor(() => expect(registerIcon).toHaveBeenCalledWith('site-complete-protection', expect.stringContaining('viewBox="0 0 100.9 89.6"')));
  });

  it('inks the icon in the colour a hex paragraph names, which is no description', () => {
    const icon = columns[1].querySelector(':scope > bd-icon[slot="icon"]');
    expect(icon.getAttribute('name')).toBe('site-online-privacy');
    expect(icon.style.color).toBe('rgb(10, 125, 57)');
    const descriptions = [...columns[1].querySelectorAll(':scope > bd-p[slot="description"]')];
    expect(descriptions.map((p) => p.textContent)).toEqual([
      'Bitdefender Antivirus Plus takes care of your online privacy and personal information.',
      'Your browsing stays your own.',
    ]);
  });

  it('slots an authored image as a 40px bd-img that illustrates the title', () => {
    const icon = columns[2].querySelector(':scope > [slot="icon"]');
    expect(icon.tagName).toBe('BD-IMG');
    expect(icon.getAttribute('src')).toBe('/media_identity.png?width=750&format=png');
    expect(icon.getAttribute('alt')).toBe('');
    expect(icon.getAttribute('width')).toBe('40');
    expect(icon.getAttribute('height')).toBe('40');
  });

  it('leaves the icon out when its file did not load', async () => {
    expect(columns[3].querySelector(':scope > [slot="icon"]')).toBeNull();
    await vi.waitFor(() => expect(registerIcon).toHaveBeenCalledWith('site-online-privacy', expect.any(String)));
    expect(registerIcon.mock.calls.map(([name]) => name))
      .toEqual(['site-complete-protection', 'site-online-privacy']);
  });

  it('slots atoms only, with no inline styling', () => {
    expect(block.querySelector('span[slot]')).toBeNull();
    expect(block.querySelector('[style*="width"], [style*="font"], [style*="background"]')).toBeNull();
  });

  it('writes each description paragraph as a bd-p at bd-p\'s own appearance', () => {
    const [description] = columns[0].querySelectorAll(':scope > bd-p[slot="description"]');
    expect(description.textContent).toContain('multi-layered protection');
    expect(description.hasAttribute('appearance')).toBe(false);
  });

  it('carries a title\'s [$WORD$] or [WORD] as a green bd-badge', () => {
    const [improved] = columns[0].querySelectorAll(':scope > bd-accordion > bd-accordion-item');
    expect(titleOf(improved).textContent).toBe('Complete Real-Time Data Protection');
    const badge = improved.querySelector(':scope > bd-badge[slot="badge"]');
    expect(badge.textContent).toBe('IMPROVED');
    expect(badge.getAttribute('variant')).toBe('success');
    expect(badge.getAttribute('appearance')).toBe('fill');
    expect(badge.getAttribute('size')).toBe('sm');

    const identity = columns[2].querySelector(':scope > bd-accordion > bd-accordion-item');
    expect(titleOf(identity).textContent).toBe('Identity Theft Protection');
    expect(identity.querySelector(':scope > bd-badge[slot="badge"]').textContent).toBe('NEW');
  });

  it('opens the first item of each column on first-open', () => {
    const opened = columns.slice(0, 3).map((col) => [...col.querySelectorAll('bd-accordion-item')]
      .map((item) => item.hasAttribute('open')));
    expect(opened).toEqual([[true, false], [true], [true]]);
  });
});
