import {
  describe, it, expect, beforeEach, vi,
} from 'vitest';
import {
  applyStructuralHooks,
  blockMboxNames,
  decorateWithHooks,
  installBlockHooks,
  reportUnappliedHooks,
  resetBlockHooks,
} from '../../scripts/utils/block-hooks.js';

/** Two hero instances and a tabs block, as decorateMain leaves them: authored, not loaded. */
const PAGE = `
  <main>
    <div class="section">
      <div class="hero block" data-block-name="hero">
        <div><div><h1 id="total-security">Total Security</h1><p>Protect every device</p></div></div>
      </div>
    </div>
    <div class="section">
      <div class="hero block" data-block-name="hero">
        <div><div><h2 id="mobile">Mobile Security</h2><p>Protect every device</p></div></div>
      </div>
      <div class="tabs block" data-block-name="tabs"><div><div>Tab one</div></div></div>
    </div>
  </main>`;

/** Stand-in for a block's own decorate(): wraps the authored content, as real blocks do. */
const heroDecorate = vi.fn(async (block) => {
  block.innerHTML = `<div class="hero-rendered">${block.innerHTML}</div>`;
});

const register = (hook) => {
  window.bdBlockHooks = window.bdBlockHooks || [];
  window.bdBlockHooks.push(hook);
};
const heroes = () => [...document.querySelectorAll('[data-block-name="hero"]')];

describe('Target block hooks', () => {
  let report;

  beforeEach(() => {
    resetBlockHooks();
    delete window.bdBlockHooks;
    document.body.className = '';
    document.body.innerHTML = PAGE;
    heroDecorate.mockClear();
    report = vi.fn();
    installBlockHooks({ report });
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('lists one mbox per block type on the page, before decoration', () => {
    document.body.innerHTML = `<main>
      <div><div class="hero"></div><div class="section-metadata"></div></div>
      <div><div class="tabs blue-heading"></div><div class="hero dark"></div><p>text</p></div>
    </main>`;
    expect(blockMboxNames(document.querySelector('main'))).toEqual(['hero-mbox', 'tabs-mbox']);
  });

  it('decorates normally when no hook is registered', async () => {
    const [first] = heroes();
    await decorateWithHooks('hero', heroDecorate, first);
    expect(heroDecorate).toHaveBeenCalledOnce();
    expect(first.querySelector('.hero-rendered')).not.toBeNull();
  });

  it('before: edits authored content, then renders it normally', async () => {
    register({
      name: 'ts-hero-v1',
      block: 'hero',
      match: '#total-security',
      run: async (block, decorate) => {
        block.querySelector('h1').textContent = 'Total Security, total peace of mind';
        await decorate();
      },
    });
    const [first, second] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);
    await decorateWithHooks('hero', heroDecorate, second);

    expect(first.querySelector('.hero-rendered h1').textContent).toBe('Total Security, total peace of mind');
    expect(second.querySelector('h2').textContent).toBe('Mobile Security');
    expect(document.body.classList.contains('ts-hero-v1')).toBe(true);
    expect(report).toHaveBeenCalledWith('ts-hero-v1', 'applied', undefined);
  });

  it('after: adjusts the rendered block', async () => {
    register({
      name: 'ts-hero-badge',
      block: 'hero',
      match: 'Mobile Security',
      run: async (block, decorate) => {
        await decorate();
        block.querySelector('.hero-rendered').insertAdjacentHTML('beforeend', '<span class="badge">New</span>');
      },
    });
    const [, second] = heroes();

    await decorateWithHooks('hero', heroDecorate, second);

    expect(second.querySelector('.hero-rendered .badge')).not.toBeNull();
  });

  it('replace: builds its own structure without the original decorate', async () => {
    register({
      name: 'ts-hero-replaced',
      block: 'hero',
      match: '#total-security',
      run: (block) => {
        const title = block.querySelector('h1').textContent;
        block.innerHTML = `<section class="hero-v2"><h1>${title}</h1></section>`;
      },
    });
    const [first] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);

    expect(heroDecorate).not.toHaveBeenCalled();
    expect(first.querySelector('.hero-v2 h1').textContent).toBe('Total Security');
  });

  it('falls back to the original block when a hook throws before rendering', async () => {
    register({
      name: 'ts-broken',
      block: 'hero',
      match: '#total-security',
      run: (block) => {
        block.innerHTML = '<p>half-done</p>';
        throw new Error('boom');
      },
    });
    const [first] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);

    expect(first.querySelector('.hero-rendered h1').textContent).toBe('Total Security');
    expect(report).toHaveBeenCalledWith('ts-broken', 'failed', 'boom');
    expect(document.body.classList.contains('ts-broken')).toBe(false);
  });

  it('refuses a match found in more than one instance instead of guessing', async () => {
    register({
      name: 'ts-ambiguous', block: 'hero', match: 'Protect every device', run: vi.fn(),
    });
    const [first, second] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);
    await decorateWithHooks('hero', heroDecorate, second);

    expect(window.bdBlockHooks[0].run).not.toHaveBeenCalled();
    expect(report).toHaveBeenCalledWith('ts-ambiguous', 'ambiguous', expect.stringContaining('in 2 hero blocks'));
  });

  it('uses instance as the tiebreaker when it is given', async () => {
    const run = vi.fn((block, decorate) => decorate());
    register({
      name: 'ts-second', block: 'hero', match: 'Protect every device', instance: 1, run,
    });
    const [first, second] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);
    await decorateWithHooks('hero', heroDecorate, second);

    expect(run).toHaveBeenCalledOnce();
    expect(run.mock.calls[0][0]).toBe(second);
  });

  it('matches on what was authored, not on what an earlier block rendered', async () => {
    register({
      name: 'ts-tabs', block: 'tabs', match: 'Tab one', run: (block, decorate) => decorate(),
    });
    const tabs = document.querySelector('[data-block-name="tabs"]');
    const [first] = heroes();

    await decorateWithHooks('hero', heroDecorate, first);
    tabs.textContent = 'already changed by something else';
    await decorateWithHooks('tabs', heroDecorate, tabs);

    expect(report).toHaveBeenCalledWith('ts-tabs', 'applied', undefined);
  });

  it('lets only the first hook change an instance', async () => {
    register({
      name: 'first', block: 'hero', match: '#total-security', run: (b, d) => d(),
    });
    register({
      name: 'second', block: 'hero', match: 'Total Security', run: vi.fn(),
    });

    await decorateWithHooks('hero', heroDecorate, heroes()[0]);

    expect(report).toHaveBeenCalledWith('second', 'conflict', expect.any(String));
  });

  it('reports hooks that never found their block, and malformed ones', async () => {
    register({
      name: 'ts-gone', block: 'hero', match: '#renamed-heading', run: vi.fn(),
    });
    register({ name: 'no match', block: 'hero', run: vi.fn() });

    await decorateWithHooks('hero', heroDecorate, heroes()[0]);
    reportUnappliedHooks();

    expect(report).toHaveBeenCalledWith('ts-gone', 'missed', expect.stringContaining('#renamed-heading'));
    expect(report).toHaveBeenCalledWith('no match', 'invalid', expect.any(String));
  });

  describe('structural hooks, applied to the authored HTML before decoration', () => {
    /** Raw sections: no .section class yet, blocks are <div class="name">. */
    const AUTHORED = `
      <main>
        <div><div class="hero"><div><div><h1 id="ts">Total Security</h1></div></div></div></div>
        <div>
          <h2 id="compare">Compare plans</h2>
          <div class="product-comparison-table"><div><div><h3 id="premium">Premium</h3></div></div></div>
          <div class="section-metadata"><div><div>Sticky-navigation</div><div>Compare</div></div></div>
        </div>
        <div><div class="columns"><div><div>Alone</div></div></div><div class="section-metadata"></div></div>
      </main>`;
    const main = () => document.querySelector('main');
    const sections = () => [...main().children];

    beforeEach(() => { document.body.innerHTML = AUTHORED; });

    it('removes only the block when its section has other content', () => {
      register({
        name: 'no-table', block: 'product-comparison-table', match: '#premium', remove: true,
      });
      applyStructuralHooks(main());

      expect(document.querySelector('.product-comparison-table')).toBeNull();
      expect(document.querySelector('#compare')).not.toBeNull();
      expect(report).toHaveBeenCalledWith('no-table', 'removed', undefined);
      expect(document.body.classList.contains('no-table')).toBe(true);
    });

    it('removes the section too when the block was all it held', () => {
      register({
        name: 'no-columns', block: 'columns', match: 'Alone', remove: true,
      });
      applyStructuralHooks(main());

      expect(sections()).toHaveLength(2);
    });

    it('removes the whole section on request, heading and navigation label included', () => {
      register({
        name: 'no-compare', block: 'product-comparison-table', match: '#premium', remove: 'section',
      });
      applyStructuralHooks(main());

      expect(document.querySelector('#compare')).toBeNull();
      expect(sections()).toHaveLength(2);
    });

    it('inserts a section after or before the matched block\'s section', () => {
      register({
        name: 'trust-after-hero',
        block: 'hero',
        match: '#ts',
        insert: { html: '<div class="fragment"><div><div>/en-us/fragments/awards/trustpilot</div></div></div>' },
      });
      register({
        name: 'banner-before-hero', block: 'hero', match: '#ts', insert: { html: '<p>Top</p>', position: 'before' },
      });
      applyStructuralHooks(main());

      const [first, second, third] = sections();
      expect(first.textContent).toBe('Top');
      expect(second.querySelector('.hero')).not.toBeNull();
      expect(third.querySelector('.fragment').textContent).toBe('/en-us/fragments/awards/trustpilot');
      expect(report).toHaveBeenCalledWith('trust-after-hero', 'inserted', undefined);
    });

    it('is not touched again when the block later decorates', async () => {
      register({
        name: 'no-table', block: 'product-comparison-table', match: '#premium', remove: true,
      });
      applyStructuralHooks(main());
      const hero = document.querySelector('.hero');
      hero.classList.add('block');
      hero.dataset.blockName = 'hero';

      await decorateWithHooks('hero', heroDecorate, hero);
      reportUnappliedHooks();

      expect(report).toHaveBeenCalledTimes(1);
    });

    it('refuses a hook with more than one action, and reports one that found nothing', () => {
      register({
        name: 'both', block: 'hero', match: '#ts', remove: true, run: vi.fn(),
      });
      register({
        name: 'gone', block: 'columns', match: 'Not on this page', remove: true,
      });
      applyStructuralHooks(main());
      reportUnappliedHooks();

      expect(report).toHaveBeenCalledWith('both', 'invalid', expect.any(String));
      expect(report).toHaveBeenCalledWith('gone', 'missed', expect.any(String));
      expect(sections()).toHaveLength(3);
    });

    it('keeps two sections added after the same block in the order they were registered', () => {
      register({
        name: 'first', block: 'hero', match: '#ts', insert: { html: '<p>One</p>' },
      });
      register({
        name: 'second', block: 'hero', match: '#ts', insert: { html: '<p>Two</p>' },
      });
      applyStructuralHooks(main());

      expect(sections().slice(0, 3).map((s) => s.textContent.trim())).toEqual(
        ['Total Security', 'One', 'Two'],
      );
    });

    it('does not let an added copy make another hook\'s match ambiguous', async () => {
      register({
        name: 'copy-hero',
        block: 'columns',
        match: 'Alone',
        insert: { html: '<div class="hero"><div><div><h1 id="ts">Total Security</h1></div></div></div>' },
      });
      register({
        name: 'restyle-original', block: 'hero', match: '#ts', run: (b, d) => d(),
      });
      applyStructuralHooks(main());
      const [original, copy] = [...document.querySelectorAll('.hero')];
      [original, copy].forEach((h) => { h.classList.add('block'); h.dataset.blockName = 'hero'; });

      await decorateWithHooks('hero', heroDecorate, original);
      await decorateWithHooks('hero', heroDecorate, copy);

      expect(report).toHaveBeenCalledWith('restyle-original', 'applied', undefined);
      expect(document.body.classList.contains('restyle-original')).toBe(true);
    });

    it('finds every target before changing anything, and reports an insert whose anchor was removed', () => {
      register({
        name: 'drop', block: 'product-comparison-table', match: '#premium', remove: 'section',
      });
      register({
        name: 'next-to-dropped', block: 'product-comparison-table', match: '#premium', insert: { html: '<p>X</p>' },
      });
      applyStructuralHooks(main());

      expect(report).toHaveBeenCalledWith('drop', 'removed', undefined);
      expect(report).toHaveBeenCalledWith('next-to-dropped', 'missed', expect.stringContaining('removed by another hook'));
      expect(document.body.textContent).not.toContain('X');
    });
  });
});
