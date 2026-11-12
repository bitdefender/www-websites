/**
 * Unit tests for the tabs block, in both of its authoring modes:
 *   tabs-group.mock.html  a `Tab group` row, its panels the sections that name
 *                         the group, as on /en-us/consumer/antivirus (a
 *                         features and an accordion section)
 *   tabs-table.mock.html  the table: h3 rows start a tab, h4 rows a column,
 *                         the rows under a column its accordion's items
 * The design system modules are replaced by an empty module, so these tests
 * check the markup the block builds, not the components' rendering; the icon
 * registry is a spy.
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

const { default: decorate } = await import('../../../blocks/tabs/tabs.js');

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Section Metadata, as an author adds it to the fixture's first section
const withFirstSectionStyle = (style) => (html) => html.replace('<div class="tabs', `<div class="section-metadata"><div><div>Style</div><div>${style}</div></div></div>
  <div class="tabs`);

async function renderFixture(file, transform = (html) => html) {
  const html = await readFile(path.join(__dirname, file), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');
  decorateSections(main);
  decorateBlocks(main);
  const block = main.querySelector('.tabs');
  await decorate(block);
  return block;
}

const titleOf = (el) => el.querySelector(':scope > bd-h[slot="title"]');

describe('tabs block, Tab group mode', () => {
  let block;
  let group;

  beforeAll(async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, text: async () => SVG })));
    // the panels' blocks load as lib-franklin loads any block: their module
    // from the code base, their stylesheet already on the page
    window.hlx = { codeBasePath: '' };
    ['features', 'accordion'].forEach((name) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/blocks/${name}/${name}.css`;
      document.head.append(link);
    });
    block = await renderFixture('tabs-group.mock.html');
    group = block.querySelector(':scope > bd-tab-group');
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    delete window.hlx;
    document.head.replaceChildren();
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    expect(block.closest('bd-section')).toBe(section.firstElementChild);
  });

  it('takes the section heading as the group\'s title, at the level the page wrote it', () => {
    const title = titleOf(group);
    expect(title.textContent).toBe('Best Antivirus Protection for Windows, macOS, iOS and Android');
    expect(title.getAttribute('as')).toBe('h2');
    expect(block.closest('bd-section').querySelector('.default-content-wrapper')).toBeNull();
  });

  it('takes the paragraph after it as the description, drawn by the group', () => {
    const description = group.querySelector(':scope > bd-p[slot="description"]');
    expect(description.textContent)
      .toBe('Bitdefender Antivirus Plus provides best-in-class protection against e-threats across all major operating systems.');
    expect(description.hasAttribute('appearance')).toBe(false);
  });

  it('makes each section that names the group a tab and its panel, in page order', () => {
    const tabs = [...group.querySelectorAll(':scope > bd-tab')];
    expect(tabs.map((tab) => [tab.textContent, tab.getAttribute('panel')]))
      .toEqual([['Windows', 'windows'], ['macOS', 'macos']]);
    const panels = [...group.querySelectorAll(':scope > bd-tab-panel')];
    expect(panels.map((panel) => panel.getAttribute('name'))).toEqual(['windows', 'macos']);
    expect(document.querySelectorAll('main > .section')).toHaveLength(1);
  });

  it('decorates the panels\' blocks in place, on the group\'s bd-section', () => {
    const [windows, macos] = group.querySelectorAll(':scope > bd-tab-panel');
    const column = windows.querySelector('.features-wrapper > .features > bd-feature-columns > bd-feature-column');
    expect(titleOf(column).getAttribute('as')).toBe('h3');
    expect(column.querySelector(':scope > bd-icon[slot="icon"]').getAttribute('name')).toBe('site-complete-protection');

    const accordion = macos.querySelector('.accordion-wrapper > .accordion > bd-accordion');
    // no look class: the faq look, as 3.x's bd-accordion-bg drew it in a panel too
    expect(accordion.getAttribute('appearance')).toBe('faq');
    expect(accordion.hasAttribute('without-padding')).toBe(false);
    expect(accordion.querySelector('bd-accordion-item').hasAttribute('open')).toBe(true);

    expect(document.querySelectorAll('bd-section')).toHaveLength(1);
  });

  it('draws no ground of its own on a plain section', () => {
    expect(group.hasAttribute('background')).toBe(false);
  });

  it('puts the brand wash behind the group in a section styled tabs-container-v2', async () => {
    const tinted = await renderFixture('tabs-group.mock.html', withFirstSectionStyle('tabs-container-v2'));
    expect(tinted.querySelector(':scope > bd-tab-group').getAttribute('background')).toBe('tint');
  });
});

describe('tabs block, table mode', () => {
  let block;
  let group;
  let columns;

  beforeAll(async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, text: async () => SVG })));
    block = await renderFixture('tabs-table.mock.html');
    group = block.querySelector(':scope > bd-tab-group');
    columns = [...group.querySelectorAll(':scope > bd-tab-panel > bd-feature-columns > bd-feature-column')];
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    expect(section.children).toHaveLength(1);
  });

  it('starts a tab at each h3 and a column at each h4', () => {
    expect([...group.querySelectorAll(':scope > bd-tab')].map((tab) => tab.textContent))
      .toEqual(['Windows', 'macOS']);
    expect(columns.map((col) => titleOf(col).textContent)).toEqual(['Protection', 'Privacy']);
  });

  it('sets the outline: the group\'s title as the page wrote it, its columns a level under, their items under them', () => {
    expect(titleOf(group).getAttribute('as')).toBe('h2');
    columns.forEach((col) => {
      expect(titleOf(col).getAttribute('as')).toBe('h3');
      col.querySelectorAll('bd-accordion-item').forEach((item) => expect(titleOf(item).getAttribute('as')).toBe('h4'));
    });
  });

  it('slots the icon as a bd-icon at the icon step nearest the size the cell names, in its colour', async () => {
    const icon = columns[0].querySelector(':scope > [slot="icon"]');
    expect(icon.tagName).toBe('BD-ICON');
    expect(icon.getAttribute('name')).toBe('site-complete-protection');
    expect(icon.getAttribute('size')).toBe('xl');
    expect(icon.style.color).toBe('rgb(10, 125, 57)');
    await vi.waitFor(() => expect(registerIcon).toHaveBeenCalledWith('site-complete-protection', expect.stringContaining('<svg')));
  });

  it('slots an authored image as a 40px bd-img', () => {
    const icon = columns[1].querySelector(':scope > [slot="icon"]');
    expect(icon.tagName).toBe('BD-IMG');
    expect(icon.getAttribute('src')).toBe('/media_privacy.png?width=750&format=png');
    expect(icon.getAttribute('alt')).toBe('');
    expect(icon.getAttribute('width')).toBe('40');
  });

  it('writes a bd-p per description paragraph, at bd-p\'s own appearance', () => {
    const first = [...columns[0].querySelectorAll(':scope > bd-p[slot="description"]')];
    expect(first.map((p) => p.textContent))
      .toEqual(['Multi-layered protection keeps your devices safe.', 'From viruses to ransomware.']);
    first.forEach((p) => expect(p.hasAttribute('appearance')).toBe(false));
    const second = [...columns[1].querySelectorAll(':scope > bd-p[slot="description"]')];
    expect(second.map((p) => p.textContent)).toEqual(['Keeps your browsing private.']);
  });

  it('fills each column\'s accordion from the rows under it, the first item open on first-open', () => {
    const items = [...columns[0].querySelectorAll(':scope > bd-accordion > bd-accordion-item')];
    expect(items.map((item) => titleOf(item).textContent)).toEqual(['Safe Files', 'Ransomware Remediation']);
    expect(items.map((item) => item.hasAttribute('open'))).toEqual([true, false]);
    expect(items[1].querySelector(':scope > bd-p').textContent).toBe('Restores files that ransomware encrypted.');
  });

  it('slots atoms only, with no inline sizing', () => {
    expect(block.querySelector('span[slot]')).toBeNull();
    expect(block.querySelector('[style*="width"], [style*="height"]')).toBeNull();
  });
});
