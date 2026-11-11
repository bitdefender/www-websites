/**
 * Unit tests for the partner-banner block: the Ferrari section on the design
 * system's bd-partner-banner. The fixture is section 6 as authored on /en-us/.
 * The design system modules are replaced by an empty module, so these tests
 * check the markup the block builds, not the components' rendering.
 */
import {
  beforeAll, describe, expect, it,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections,
} from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// what a component's named slot holds, among its own children
const inSlot = (host, slot) => host.querySelector(`:scope > [slot="${slot}"]`);

// the default slot's text: the host's own text nodes
const defaultText = (host) => [...host.childNodes]
  .filter((node) => node.nodeType === Node.TEXT_NODE)
  .map((node) => node.textContent)
  .join('')
  .trim();

async function renderFixture(prepare = () => {}) {
  const html = await readFile(path.join(__dirname, 'partner-banner.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');
  prepare(main);

  // as on the page: decorateButtons turns the bold link into a.button.primary
  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.partner-banner');
  const { default: decorate } = await import('../../../blocks/partner-banner/partner-banner.js');
  await decorate(block);
  return block;
}

describe('partner-banner block', () => {
  let block;
  let banner;

  beforeAll(async () => {
    block = await renderFixture();
    banner = block.querySelector(':scope > bd-partner-banner');
  });

  it('replaces the authored rows with one bd-partner-banner', () => {
    expect(block.children).toHaveLength(1);
    expect(banner).toBeTruthy();
  });

  it('reads the heading, quote, attribution and lead by role', () => {
    const title = inSlot(banner, 'title');
    expect(title.localName).toBe('bd-h');
    expect(title.textContent).toBe('Trusted by Ferrari as their Exclusive Cybersecurity Partner.');
    expect(title.getAttribute('as')).toBe('h2');
    // the quote is the default slot's text
    expect(defaultText(banner)).toBe('“I’m proud to have Bitdefender riding with me in 2026.”');
    const caption = inSlot(banner, 'caption');
    expect(caption.localName).toBe('span');
    expect(caption.textContent).toBe('Lewis Hamilton, Scuderia Ferrari HP Driver');
    const lead = inSlot(banner, 'description');
    expect(lead.localName).toBe('bd-p');
    expect(lead.textContent).toMatch(/^The same intelligence trusted by Ferrari/);
  });

  it('slots the photo, and the picture beside the heading as the lockup', () => {
    const photo = banner.querySelector(':scope > picture[slot="media"] img');
    const lockup = banner.querySelector(':scope > bd-img[slot="lockup"]');
    expect(photo.getAttribute('src')).toContain('media_128904cd1012fa400a2922b5e441accfa51aec3a7');
    expect(lockup.getAttribute('src')).toContain('media_120424e57c3116faae453028e2872507c0818174b');
    // the image's ratio and its (decorative) alt carry over
    expect([lockup.getAttribute('width'), lockup.getAttribute('height')]).toEqual(['598', '70']);
    expect(lockup.getAttribute('alt')).toBe('');
  });

  it('puts the section on the design system rhythm', () => {
    const bdSection = block.closest('.section').querySelector(':scope > bd-section');
    expect(bdSection.contains(block)).toBe(true);
  });

  it('slots the copy as atoms the banner draws, with no look of their own', () => {
    ['title', 'description'].forEach((slot) => {
      const atom = inSlot(banner, slot);
      ['visual-level', 'color', 'font-weight', 'appearance']
        .forEach((name) => expect(atom.hasAttribute(name)).toBe(false));
    });
  });

  it('makes the bold link the white button and the plain one outline-white', () => {
    const buttons = [...banner.querySelectorAll(':scope > bd-button[slot="actions"]')];
    expect(buttons.map((button) => [button.textContent, button.getAttribute('appearance')])).toEqual([
      ['Read more', 'white'],
      ['Watch the Ferrari story', 'outline-white'],
    ]);
    expect(buttons[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/ferrari/');
  });
});

// DEX-29311 case 5: the author leaves the h2 out
describe('partner-banner block without a heading', () => {
  it('still slots the partner lockup', async () => {
    const block = await renderFixture((main) => main.querySelector('.partner-banner h2').remove());
    const banner = block.querySelector('bd-partner-banner');

    expect(inSlot(banner, 'title')).toBeNull();
    expect(banner.querySelector('[slot="lockup"]')).not.toBeNull();
    expect(banner.querySelector('[slot="media"]')).not.toBeNull();
  });
});
