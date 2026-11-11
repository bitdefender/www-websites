/**
 * Unit tests for the blog-news block's multi-endpoint variant: the homepage's
 * Latest insights, the newest post of each RSS feed on the design system's
 * bd-post-card, under the section header. The fixture is the section as
 * authored on /en-us/. The feeds are stubbed and the design system modules
 * are replaced by an empty module, so these tests check the markup the block
 * builds, not the components' rendering.
 */
import {
  afterAll, beforeAll, describe, expect, it, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections,
} from '../../../scripts/lib-franklin.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rss = (channel, posts) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${channel}</title>
    ${posts.map(([title, link]) => `<item>
      <title>${title}</title>
      <link>${link}</link>
      <media:content url="${link}cover.jpg" medium="image"/>
    </item>`).join('')}
  </channel>
</rss>`;

const FEEDS = {
  hotforsecurity: rss('Consumer Insights', [
    ['Where to report a scam', 'https://www.bitdefender.com/en-us/blog/hotforsecurity/report-a-scam/'],
    ['An older consumer post', 'https://www.bitdefender.com/en-us/blog/hotforsecurity/older/'],
  ]),
  businessinsights: rss('Business Insights Cybersecurity Blog by Bitdefender', [
    ['Your attack surface is growing', 'https://www.bitdefender.com/en-us/blog/businessinsights/attack-surface/'],
  ]),
  labs: rss('Bitdefender Labs', [
    ['The rise of Midnight Mimosa', 'https://www.bitdefender.com/en-us/blog/labs/midnight-mimosa/'],
  ]),
};

async function renderFixture({ buttonText } = {}) {
  let html = await readFile(path.join(__dirname, 'blog-news.mock.html'), 'utf-8');
  if (buttonText) {
    html = html.replace('<div class="section-metadata">', `<div class="section-metadata"><div><div>Button-text</div><div>${buttonText}</div></div>`);
  }
  document.body.innerHTML = `<main>${html}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.blog-news');
  const { default: decorate } = await import('../../../blocks/blog-news/blog-news.js');
  await decorate(block);
  return block;
}

describe('blog-news block, multi-endpoint', () => {
  let block;
  let grid;
  let cards;
  let fetchSpy;

  beforeAll(async () => {
    fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
      const feed = Object.keys(FEEDS).find((name) => String(url).includes(`/rss/${name}/`));
      return new Response(FEEDS[feed], { status: 200, headers: { 'Content-Type': 'text/xml' } });
    });
    block = await renderFixture();
    grid = block.querySelector(':scope > bd-grid');
    cards = [...grid.querySelectorAll(':scope > bd-post-card')];
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('reads every endpoint in the section metadata', () => {
    // utils.js fetches its own config on import; only the feeds matter here
    const feeds = fetchSpy.mock.calls.map(([url]) => String(url)).filter((url) => url.includes('/rss/'));
    expect(feeds).toEqual([
      'https://www.bitdefender.com/nuxt/api/en-us/rss/hotforsecurity/',
      'https://www.bitdefender.com/nuxt/api/en-us/rss/businessinsights/',
      'https://www.bitdefender.com/nuxt/api/en-us/rss/labs/',
    ]);
  });

  it('lays the posts out on the page column, three across from lg', () => {
    expect(block.children).toHaveLength(1);
    expect(grid.classList.contains('ds-page-column')).toBe(true);
    expect(grid.getAttribute('cols')).toBe('1');
    expect(grid.getAttribute('cols-md')).toBe('1');
    expect(grid.getAttribute('cols-lg')).toBe('3');
  });

  it('takes the newest post of each feed, up to Articles-number', () => {
    const titles = cards.map((card) => card.querySelector(':scope > bd-h[slot="title"]'));
    expect(titles.map((title) => title.textContent)).toEqual([
      'Where to report a scam', 'Your attack surface is growing', 'The rise of Midnight Mimosa',
    ]);
    // the h3 the 3.x card drew
    expect(titles.every((title) => title.getAttribute('as') === 'h3')).toBe(true);
    expect(cards[0].getAttribute('href')).toBe('https://www.bitdefender.com/en-us/blog/hotforsecurity/report-a-scam/');
    const cover = cards[0].querySelector(':scope > bd-img[slot="media"]');
    expect(cover.getAttribute('src')).toBe('https://www.bitdefender.com/en-us/blog/hotforsecurity/report-a-scam/cover.jpg');
    // decorative and lazy, as the 3.x card drew its image
    expect(cover.getAttribute('alt')).toBe('');
    expect(cover.getAttribute('loading')).toBe('lazy');
    // the copy is slotted, not set as 3.x's attributes
    cards.forEach((card) => {
      ['heading', 'image', 'badge', 'read-more'].forEach((name) => expect(card.hasAttribute(name)).toBe(false));
    });
  });

  it('badges each card with its feed\'s channel title', () => {
    const badges = cards.map((card) => card.querySelector(':scope > bd-badge[slot="badge"]'));
    expect(badges.map((badge) => badge.textContent)).toEqual([
      'Consumer Insights', 'Business Insights Cybersecurity Blog by Bitdefender', 'Bitdefender Labs',
    ]);
    // the badge the 3.x card drew from its badge attribute
    badges.forEach((badge) => {
      expect(badge.getAttribute('variant')).toBe('info');
      expect(badge.getAttribute('appearance')).toBe('shade');
      expect(badge.getAttribute('size')).toBe('sm');
    });
  });

  it('writes the read-more cue 3.x drew by default where Button-text is unset', () => {
    expect(cards.map((card) => card.querySelector(':scope > span[slot="read-more"]')?.textContent))
      .toEqual(['Read more', 'Read more', 'Read more']);
  });

  it('lifts the section header', () => {
    const header = block.closest('.section').querySelector('bd-section-header');
    const title = header.querySelector(':scope > bd-h[slot="title"]');
    expect(title.textContent).toBe('Latest cybersecurity insights');
    expect(title.getAttribute('as')).toBe('h2');
  });
});

describe('blog-news block, multi-endpoint with Button-text', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('writes the section\'s Button-text as each card\'s read-more cue', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
      const feed = Object.keys(FEEDS).find((name) => String(url).includes(`/rss/${name}/`));
      return new Response(FEEDS[feed], { status: 200, headers: { 'Content-Type': 'text/xml' } });
    });
    const block = await renderFixture({ buttonText: 'Read the story' });
    const cues = [...block.querySelectorAll('bd-post-card > span[slot="read-more"]')];
    expect(cues.map((cue) => cue.textContent)).toEqual(['Read the story', 'Read the story', 'Read the story']);
  });
});
