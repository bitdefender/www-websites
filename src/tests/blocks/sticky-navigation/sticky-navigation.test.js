/**
 * Unit tests for the sticky-navigation block's CTA. The fixture is the sticky
 * section as authored on /en-us/consumer/ultimate-security-new: one link to a
 * fragment, which should open that fragment as a modal like any other
 * a.button.modal on the page.
 * The design system modules are replaced by an empty module, so these tests
 * check the markup the block builds, not the components' rendering.
 */
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  decorateBlocks, decorateButtons, decorateSections,
} from '../../../scripts/lib-franklin.js';

// scripts.js runs loadPage() on import. The mock keeps what the block depends
// on: detectModalButtons runs on main before blocks load and moves a modal
// link's href to `location`.
vi.mock('../../../scripts/scripts.js', () => ({
  openModal: vi.fn(),
  detectModalButtons: (main) => {
    main.querySelectorAll('a.button.modal').forEach((link) => {
      link.setAttribute('location', link.getAttribute('href'));
      link.removeAttribute('href');
    });
  },
}));

const { openModal, detectModalButtons } = await import('../../../scripts/scripts.js');
const { default: decorate } = await import('../../../blocks/sticky-navigation/sticky-navigation.js');

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = await readFile(path.join(__dirname, 'sticky-navigation.mock.html'), 'utf-8');

/** Decorates the fixture in page order; `ctaHref` replaces the authored link. */
async function renderFixture(ctaHref) {
  document.body.innerHTML = `<main>${fixture}</main>`;
  const main = document.querySelector('main');
  if (ctaHref) main.querySelector('.sticky-navigation a').setAttribute('href', ctaHref);

  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);
  detectModalButtons(main);

  const block = main.querySelector('.sticky-navigation');
  await decorate(block);
  return block.querySelector('bd-anchor-nav bd-button[slot="actions"]');
}

function click(element) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

describe('sticky-navigation CTA', () => {
  beforeEach(() => {
    openModal.mockClear();
  });

  it('keeps the fragment link that detectModalButtons moved off the anchor', async () => {
    const cta = await renderFixture();

    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('/en-us/consumer/fragments/trial-us');
    expect(cta.textContent).toBe('Try for free');
  });

  it('draws the CTA in the accent appearance, 3.x\'s danger kind, without a section data-kind', async () => {
    const cta = await renderFixture();

    expect(cta.getAttribute('appearance')).toBe('accent');
    expect(cta.hasAttribute('kind')).toBe(false);
  });

  it('opens the fragment as a modal instead of navigating', async () => {
    const cta = await renderFixture();

    const event = click(cta);

    expect(event.defaultPrevented).toBe(true);
    expect(openModal).toHaveBeenCalledOnce();
    expect(openModal).toHaveBeenCalledWith('/en-us/consumer/fragments/trial-us', false);
  });

  it('navigates normally when the link is not a fragment', async () => {
    const cta = await renderFixture('/en-us/consumer/ultimate-security#buy');

    const event = click(cta);

    expect(cta.getAttribute('href')).toBe('/en-us/consumer/ultimate-security#buy');
    expect(event.defaultPrevented).toBe(false);
    expect(openModal).not.toHaveBeenCalled();
  });
});

describe('sticky-navigation items', () => {
  it('writes each section as an item whose words are its label, in a named nav', async () => {
    await renderFixture();
    const nav = document.querySelector('.sticky-navigation bd-anchor-nav');
    const items = [...nav.querySelectorAll(':scope > bd-anchor-nav-item')];

    expect(nav.getAttribute('aria-label')).toBe('Section navigation');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Live your digital life confidently');
    expect(items[0].getAttribute('href')).toBe('#nav-section-1');
    expect(document.getElementById('nav-section-1')).toBe(document.querySelectorAll('main > .section')[1]);
    expect(items[0].hasAttribute('title')).toBe(false);
  });
});
