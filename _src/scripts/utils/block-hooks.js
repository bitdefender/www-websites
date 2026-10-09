/**
 * Component tests delivered by Adobe Target, one mbox per block type: the hero block's tests
 * arrive on "hero-mbox", the tabs block's on "tabs-mbox", and so on.
 *
 * An offer is a <script> that registers a hook for one instance of one block:
 *
 *   (window.bdBlockHooks = window.bdBlockHooks || []).push({
 *     name: 'ts-hero-v2',                    // becomes a class on <body>
 *     block: 'hero',                         // the block type, same as the mbox
 *     match: '#bitdefender-total-security',  // which instance: an id inside it, or its text
 *     run: async (block, decorate) => {
 *       // before: edit the authored rows, then await decorate();
 *       // after:  await decorate(); then adjust the rendered block
 *       // replace: never call decorate; build the block from its authored rows
 *     },
 *   });
 *
 * The hook replaces the call to the block's own decorate(). Its section is still hidden at that
 * point (lib-franklin shows a section only once all its blocks are loaded), so whatever the hook
 * does is never seen in its original form.
 *
 * Two hooks change the page's structure instead, and are applied by applyStructuralHooks() to the
 * HTML as authored, before decorateMain — so everything that later reads the page (the sticky
 * navigation's links, which hero is the LCP block, every block's own code) sees the result as if
 * it had been authored that way:
 *
 *   { name, block, match, remove: true }
 *     removes the block, and its section too if nothing else is in it
 *   { name, block, match, remove: 'section' }
 *     removes the block's whole section
 *   { name, block, match, insert: { html, position: 'after' | 'before' } }
 *     adds a section next to the block's section; html is that section's authored content,
 *     e.g. a fragment: <div class="fragment"><div><div>/en-us/fragments/…</div></div></div>
 *
 * On pages with target-experiment-location metadata the offers are fetched and injected in
 * loadEager, before any block loads. Without that metadata no block mbox is requested.
 */

const QUEUE = 'bdBlockHooks';
const VALID_NAME = /^[A-Za-z][\w-]*$/;

/**
 * @typedef {'applied' | 'removed' | 'inserted' | 'failed' | 'ambiguous' | 'conflict' | 'missed'
 *   | 'invalid'} HookStatus
 * @typedef {(name: string, status: HookStatus, detail?: string) => void} HookReporter
 */

/** What each block instance said before any code touched it: its text and the ids inside it. */
const authored = new WeakMap();
/** Every block instance seen so far, in page order. */
const instances = [];
/** hook -> final status, so each hook is reported once. */
const settled = new Map();
/** block element -> the hook that claimed it. */
const claimed = new WeakMap();

let report = /** @type {HookReporter} */ (() => {});

const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim();

/** Marks a section a hook added, so other hooks never match the copies it may contain. */
const INSERTED = 'targetInsertedBy';

function remember(block) {
  // A block inside an inserted section is not part of the authored page: matching it could make
  // another hook's match ambiguous, or retarget it to the copy.
  if (authored.has(block) || block.closest('[data-target-inserted-by]')) return;
  authored.set(block, {
    text: normalize(block.textContent),
    ids: new Set([...block.querySelectorAll('[id]')].map((el) => el.id)),
  });
  instances.push(block);
}

function rememberAll() {
  document.querySelectorAll('.block[data-block-name]').forEach(remember);
}

function settle(hook, status, detail) {
  if (settled.has(hook)) return;
  settled.set(hook, status);
  const name = typeof hook?.name === 'string' ? hook.name : '(unnamed)';
  const log = status === 'applied' ? 'info' : 'warn';
  // eslint-disable-next-line no-console
  console[log](`[block-hooks] ${name}: ${status}${detail ? ` (${detail})` : ''}`);
  try {
    report(name, status, detail);
  } catch { /* reporting must never affect the page */ }
}

const isRemoval = (hook) => hook?.remove === true || hook?.remove === 'section';
const isInsertion = (hook) => typeof hook?.insert?.html === 'string'
  && ['after', 'before', undefined].includes(hook.insert.position);
const isStructural = (hook) => hook?.remove !== undefined || hook?.insert !== undefined;

/** A name, a block, a match, and exactly one of run / remove / insert. */
function isValid(hook) {
  const actions = [typeof hook?.run === 'function', isRemoval(hook), isInsertion(hook)]
    .filter(Boolean).length;
  return VALID_NAME.test(hook?.name ?? '')
    && typeof hook.block === 'string' && hook.block
    && typeof hook.match === 'string' && normalize(hook.match)
    && actions === 1
    && (hook.run === undefined || typeof hook.run === 'function')
    && (hook.remove === undefined || isRemoval(hook))
    && (hook.insert === undefined || isInsertion(hook))
    && (hook.instance === undefined || Number.isInteger(hook.instance));
}

const INVALID = 'needs name, block, match and exactly one of run(), remove or insert: { html }';

/** An id ("#hero-title") must be inside the instance; anything else must be in its text. */
function matches(block, match) {
  const { text, ids } = authored.get(block);
  return match.startsWith('#') ? ids.has(match.slice(1)) : text.includes(normalize(match));
}

/** The one instance a hook is meant for, or a reason there is not exactly one. */
function resolve(hook) {
  const candidates = instances.filter((block) => block.dataset.blockName === hook.block
    && matches(block, hook.match));
  if (hook.instance !== undefined) return { target: candidates[hook.instance] };
  if (candidates.length > 1) return { ambiguous: candidates.length };
  return { target: candidates[0] };
}

async function run(hook, block, decorate) {
  const authoredHtml = block.innerHTML;
  let decorated = false;
  const original = async () => {
    if (decorated) return;
    decorated = true;
    await decorate(block);
  };

  try {
    await hook.run(block, original);
    document.body.classList.add(hook.name);
    settle(hook, 'applied');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[block-hooks] ${hook.name} threw`, error);
    settle(hook, 'failed', error?.message);
    // A broken test must leave visitors with the normal component, never an empty one.
    if (!decorated) {
      block.innerHTML = authoredHtml;
      await original();
    }
  }
}

/**
 * Decorate one block, through the hook registered for it if there is one.
 * @param {string} blockName
 * @param {(block: Element) => Promise<void> | void} decorate the block's own default export
 * @param {Element} block
 */
export async function decorateWithHooks(blockName, decorate, block) {
  rememberAll();
  remember(block);

  const hooks = Array.isArray(window[QUEUE]) ? window[QUEUE] : [];
  let chosen;

  hooks.forEach((hook) => {
    if (settled.has(hook)) return;
    if (!isValid(hook)) {
      settle(hook, 'invalid', INVALID);
      return;
    }
    // Structural hooks were applied before decoration; one still unsettled found no block.
    if (isStructural(hook) || hook.block !== blockName) return;

    const { target, ambiguous } = resolve(hook);
    if (ambiguous) {
      settle(hook, 'ambiguous', `"${hook.match}" is in ${ambiguous} ${blockName} blocks; set instance or a more specific match`);
    } else if (target === block) {
      if (chosen || claimed.has(block)) {
        settle(hook, 'conflict', `another hook already changes this ${blockName} block`);
      } else {
        chosen = hook;
        claimed.set(block, hook);
      }
    }
    // Otherwise it is for another instance, possibly one not loaded yet.
  });

  if (chosen) {
    await run(chosen, block, decorate);
  } else {
    await decorate(block);
  }
}

/**
 * Report every hook that never found its block, so a test that silently changes nothing is
 * visible. Call once the page is complete.
 */
export function reportUnappliedHooks() {
  const hooks = Array.isArray(window[QUEUE]) ? window[QUEUE] : [];
  hooks.forEach((hook) => {
    if (!isValid(hook)) {
      settle(hook, 'invalid', INVALID);
    } else {
      settle(hook, 'missed', `no ${hook.block} block contains "${hook.match}"`);
    }
  });
}

/**
 * Apply every remove and insert hook to main as authored. Call after the offers have run and
 * before decorateMain: sections are still plain <div>s and blocks are <div class="name">.
 * @param {Element} main
 */
export function applyStructuralHooks(main) {
  const hooks = Array.isArray(window[QUEUE]) ? window[QUEUE] : [];
  // Every target is found on the page as authored before anything changes, so one hook's
  // insertions or removals cannot change what another hook matches.
  const planned = [];
  hooks.forEach((hook) => {
    if (settled.has(hook) || !isStructural(hook)) return;
    if (!isValid(hook)) {
      settle(hook, 'invalid', INVALID);
      return;
    }

    const match = normalize(hook.match);
    const candidates = [...main.querySelectorAll(':scope > div > div[class]')]
      .filter((el) => el.classList[0] === hook.block)
      .filter((el) => (match.startsWith('#')
        ? [...el.querySelectorAll('[id]')].some((child) => child.id === match.slice(1))
        : normalize(el.textContent).includes(match)));

    if (hook.instance === undefined && candidates.length > 1) {
      settle(hook, 'ambiguous', `"${hook.match}" is in ${candidates.length} ${hook.block} blocks; set instance or a more specific match`);
      return;
    }
    const target = candidates[hook.instance ?? 0];
    if (!target) return; // reported as missed once the page is complete
    planned.push({ hook, target, section: target.parentElement });
  });

  /** anchor section -> the last section inserted after it, so inserts keep their order. */
  const lastAfter = new Map();
  planned.forEach(({ hook, target, section }) => {
    if (isRemoval(hook)) {
      const rest = [...section.children]
        .filter((el) => el !== target && el.classList[0] !== 'section-metadata');
      if (hook.remove === 'section' || !rest.length) section.remove();
      else target.remove();
      settle(hook, 'removed');
    } else if (!section.isConnected) {
      settle(hook, 'missed', 'the section it anchors to was removed by another hook');
      return;
    } else {
      const added = document.createElement('div');
      added.dataset[INSERTED] = hook.name;
      added.innerHTML = hook.insert.html;
      if (hook.insert.position === 'before') {
        section.before(added);
      } else {
        (lastAfter.get(section) ?? section).after(added);
        lastAfter.set(section, added);
      }
      settle(hook, 'inserted');
    }
    document.body.classList.add(hook.name);
  });
}

/**
 * The block mboxes to request for a page: one per block type in main, read before decoration.
 * @param {Element} main
 * @returns {string[]}
 */
export function blockMboxNames(main) {
  const names = new Set();
  main.querySelectorAll(':scope > div > div[class]').forEach((el) => {
    const blockName = el.classList[0];
    if (blockName && blockName !== 'section-metadata') names.add(`${blockName}-mbox`);
  });
  return [...names];
}

/**
 * Route every block's decoration through decorateWithHooks.
 * @param {{ report?: HookReporter }} [options]
 */
export function installBlockHooks({ report: reporter } = {}) {
  if (reporter) report = reporter;
  window.hlx = window.hlx || {};
  window.hlx.blockDecorator = decorateWithHooks;
}

/** Test seam: forget everything seen so far. */
export function resetBlockHooks() {
  instances.length = 0;
  settled.clear();
  report = () => {};
}
