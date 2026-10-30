/**
 * Unit tests for the bento-cards block: the homepage AI cards on the design
 * system's bd-bento-grid. The fixture is section 3 as authored on /en-us/,
 * still with its section-header block table. The design system modules are
 * replaced by an empty module, so these tests check the markup the block
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

async function renderFixture(transform = (html) => html) {
  const html = await readFile(path.join(__dirname, 'bento-cards.mock.html'), 'utf-8');
  document.body.innerHTML = `<main>${transform(html)}</main>`;
  const main = document.querySelector('main');

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);

  const block = main.querySelector('.bento-cards');
  const { default: decorate } = await import('../../../blocks/bento-cards/bento-cards.js');
  await decorate(block);
  return block;
}

describe('bento-cards block', () => {
  let block;
  let grid;
  let cards;

  beforeAll(async () => {
    block = await renderFixture();
    grid = block.querySelector(':scope > bd-bento-grid');
    cards = [...grid.querySelectorAll(':scope > bd-bento-item')];
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('replaces the authored rows with one 50/50 bento grid', () => {
    expect(block.children).toHaveLength(1);
    expect(grid.getAttribute('wide-share')).toBe('0.5');
    expect(grid.getAttribute('min-card-width')).toBe('440');
    expect(cards).toHaveLength(3);
  });

  it('builds each card on the brand tone from its copy cell', () => {
    const [consumer] = cards;
    expect(consumer.getAttribute('tone')).toBe('brand');
    expect(consumer.getAttribute('badge')).toBe('AI for Consumers');
    expect(consumer.getAttribute('title')).toBe('AI for Digital Life Protection');
    expect(consumer.getAttribute('as')).toBe('h3');
    expect(consumer.getAttribute('body')).toMatch(/^Smarter protection for everyday digital life\. .* threats\.$/);
  });

  it('turns the link into an outline-white CTA at the responsive size', () => {
    const cta = cards[0].querySelector(':scope > bd-button-link');
    expect(cta.getAttribute('variant')).toBe('outline-white');
    // no size: the design system's default is md below lg and lg from it
    expect(cta.hasAttribute('size')).toBe(false);
    expect(cta.getAttribute('href')).toBe('https://www.bitdefender.com/en-us/consumer/ai/');
    expect(cta.textContent).toBe('Explore Consumer AI');
  });

  it('maps each art name to the attribute its labels go in', () => {
    const art = cards.map((card) => card.querySelector(':scope > bd-motion-art[slot="media"]'));
    expect(art.map((el) => el.getAttribute('object'))).toEqual(['mesh-globe', 'layer-stack', 'geo-core']);
    expect(art[0].getAttribute('badges')).toBe('Scams|Child Safety|Fraud');
    expect(art[1].getAttribute('labels')).toBe('Manage|Respond|Prevent|AI Foundation');
    expect(art[2].getAttribute('label')).toBe('LABS');
  });

  it('features the odd card out', () => {
    expect(cards.map((card) => card.getAttribute('priority'))).toEqual([null, null, 'featured']);
  });

  it('lifts the section-header table into a split bd-section-header', () => {
    const section = block.closest('.section');
    const header = section.querySelector(':scope > bd-section > .default-content-wrapper > bd-section-header');
    expect(header.getAttribute('layout')).toBe('split');
    expect(header.getAttribute('eyebrow')).toBe('15+ years of AI-driven security innovation');
    expect(header.getAttribute('heading')).toBe('AI Across Bitdefender');
    expect(header.id).toBe('ai-across-bitdefender');
    expect(section.querySelector('.section-header')).toBeNull();
  });

  it('keeps an even set unfeatured and skips unknown art', async () => {
    const twoCards = await renderFixture((html) => html
      .replace(/<p>geo-core<\/p>/, '<p>unknown-art</p>')
      .replace(/(<div class="bento-cards">[\s\S]*?)<div>\s*<div>\s*<p>Bitdefender Labs[\s\S]*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*$/, '$1</div></div>'));
    const items = [...twoCards.querySelectorAll('bd-bento-item')];
    expect(items).toHaveLength(2);
    expect(items.some((item) => item.hasAttribute('priority'))).toBe(false);
  });
});
