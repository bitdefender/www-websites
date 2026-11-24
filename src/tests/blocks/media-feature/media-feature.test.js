/**
 * Unit tests for the media-feature block: two alternating rows, one with a
 * picture and a primary button, one with a YouTube link and a secondary
 * button. The design system modules are replaced by an empty module, so
 * these tests check the markup the block builds, not the components'
 * rendering.
 */
import {
  beforeAll, describe, expect, it,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { decorateBlocks, decorateButtons, decorateSections } from '../../../scripts/lib-franklin.js';

const { default: decorate } = await import('../../../blocks/media-feature/media-feature.js');

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(path.join(__dirname, 'media-feature.mock.html'), 'utf-8');

describe('media-feature block', () => {
  let block;
  let rows;

  beforeAll(async () => {
    document.body.innerHTML = `<main>${fixture}</main>`;
    const main = document.querySelector('main');
    decorateButtons(main);
    decorateSections(main);
    decorateBlocks(main);
    block = main.querySelector('.media-feature');
    await decorate(block);
    rows = [...block.querySelectorAll(':scope > bd-features-tab')];
  });

  it('puts its section on the design system rhythm, in a bd-section', () => {
    const section = block.closest('.section');
    expect(section.children).toHaveLength(1);
    expect(section.firstElementChild.tagName).toBe('BD-SECTION');
    expect(block.closest('bd-section')).toBe(section.firstElementChild);
  });

  it('writes a bd-features-tab a row, alternating the media\'s side', () => {
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.hasAttribute('reverse'))).toEqual([false, true]);
  });

  it('slots the heading at the level the page wrote it, with no colour of its own', () => {
    const titles = rows.map((row) => row.querySelector(':scope > bd-h[slot="title"]'));
    expect(titles.map((title) => title.getAttribute('as'))).toEqual(['h2', 'h3']);
    expect(titles[0].textContent).toBe('Keep your loved ones protected.');
    titles.forEach((title) => expect(title.hasAttribute('color')).toBe(false));
  });

  it('writes the body as atoms in the default slot', () => {
    const [first] = rows;
    expect(first.querySelector(':scope > bd-p:not([slot])').textContent)
      .toBe('As the Subscription Manager, you can oversee and adjust online safety through an intuitive dashboard.');
    expect(first.querySelectorAll(':scope > bd-list > bd-li')).toHaveLength(2);
  });

  it('writes the button into actions in the accent fill, or secondary as authored, at bd-button\'s own size', () => {
    const [primary, secondary] = rows.map((row) => row.querySelector(':scope > bd-button[slot="actions"]'));
    expect(primary.getAttribute('appearance')).toBe('accent');
    expect(primary.getAttribute('href')).toBe('/en-us/consumer/family#buy');
    expect(primary.textContent).toBe('Stay worry free');
    expect(secondary.getAttribute('appearance')).toBe('secondary');
    [primary, secondary].forEach((button) => {
      expect(button.hasAttribute('size')).toBe(false);
      expect(button.hasAttribute('strong')).toBe(false);
    });
  });

  it('slots the picture, or a YouTube link as a named bd-video-player, as the media', () => {
    expect(rows[0].querySelector(':scope > picture[slot="media"] img').getAttribute('alt')).toBe('A family on a sofa');
    const player = rows[1].querySelector(':scope > bd-video-player[slot="media"]');
    expect(player.getAttribute('src')).toBe('https://www.youtube.com/embed/abc123');
    expect(player.getAttribute('video-title')).toBe('Video player');
  });
});
