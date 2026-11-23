/**
 * Agent-view audit of purchase CTAs (DEX-29318).
 *
 * Loads every page of a locale the way a browsing agent does (fresh profile, desktop
 * viewport, no scrolling or clicking until the page settles) and checks that each
 * purchase CTA can be:
 * - found: exposed as a link or button, visible, not aria-hidden or inert;
 * - understood: a name that tells it apart from CTAs going elsewhere, and plan
 *   pickers whose options say which plan they belong to;
 * - activated: a real destination, focusable, enabled, not covered, and resolved
 *   (store buy links start as #buylink) soon after load.
 *
 * It never clicks a CTA, so it never opens checkout.
 *
 * Production sits behind a Cloudflare rate limit: 116 pages, four at a time, got this IP
 * HTTP 429 with Retry-After of a day. Run whole locales against an aem.page branch; the run
 * stops at the first 429.
 *
 * node audit.js [--base https://main--www-websites--bitdefender.aem.page] [--locale en-us]
 *               [--paths /en-us/a,/en-us/b | --paths-file index.json] [--concurrency 1]
 *               [--limit 10] [--out dir]
 */
import { chromium } from 'playwright-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import path from 'node:path';

const { values: args } = parseArgs({
  options: {
    // origin the pages are loaded from: an aem.page branch, localhost or (gently) production
    base: { type: 'string', default: 'https://main--www-websites--bitdefender.aem.page' },
    // origin the page list (query-index.json) is read from
    index: { type: 'string', default: 'https://main--www-websites--bitdefender.aem.page' },
    locale: { type: 'string', default: 'en-us' },
    paths: { type: 'string' },
    // a saved query-index.json, or one path per line
    'paths-file': { type: 'string' },
    exclude: { type: 'string', default: '/webview/,/experiment' },
    concurrency: { type: 'string', default: '1' },
    limit: { type: 'string' },
    out: { type: 'string' },
    'resolve-timeout': { type: 'string', default: '10000' },
    'slow-ms': { type: 'string', default: '5000' },
    headed: { type: 'boolean', default: false },
  },
});

const RESOLVE_TIMEOUT = Number(args['resolve-timeout']);
const SLOW_MS = Number(args['slow-ms']);

// what counts as a purchase CTA, matched against the accessible name
const CTA_PATTERN = String.raw`\b(buy|add to cart|get started|try|trial|free|subscribe|purchase|get it|get offer|upgrade|renew|order|download|checkout|save \d+%)\b|\d+% off`;

const ISSUES = {
  'not-exposed': 'Looks like a CTA but is not a link or button in the accessibility tree',
  'no-destination': 'Link has no real destination (missing, # or #buylink href)',
  'not-focusable': 'Link or button is removed from the tab order',
  disabled: 'Disabled, aria-disabled or pointer-events: none',
  covered: 'Another element sits on top of it, so a click lands elsewhere',
  'ambiguous-name': 'Same name as other CTAs that go to different plans or pages',
  'ambiguous-radio': 'Plan option whose name and group label repeat in another group',
  'slow-resolve': `Store buy links still #buylink more than ${SLOW_MS} ms after navigation`,
};

async function readIndex() {
  if (args['paths-file']) {
    const text = await readFile(args['paths-file'], 'utf-8');
    return text.trim().startsWith('{') ? JSON.parse(text).data.map((row) => row.path) : text.split('\n');
  }
  const response = await fetch(`${args.index}/${args.locale}/query-index.json?limit=10000`);
  if (!response.ok) throw new Error(`query-index.json: HTTP ${response.status}`);
  return (await response.json()).data.map((row) => row.path);
}

async function getPaths() {
  if (args.paths) return args.paths.split(',').map((p) => p.trim()).filter(Boolean);
  const excluded = args.exclude.split(',').filter(Boolean);
  const paths = (await readIndex()).map((p) => p.trim())
    .filter((p) => p && !excluded.some((part) => p.includes(part)))
    .sort();
  return args.limit ? paths.slice(0, Number(args.limit)) : paths;
}

class RateLimited extends Error {}

/**
 * Runs in the page before its own scripts: records when every store buy link
 * (authored as #buylink) last had a real href.
 */
function initScript() {
  const isPlaceholder = (a) => {
    const href = a.getAttribute('href');
    return !href || href === '#' || href.endsWith('#buylink');
  };
  window.agentAudit = { buyLinks: 0, resolvedAt: null };
  setInterval(() => {
    const links = [...document.querySelectorAll('a[data-store-buy-link], a[href$="#buylink"]')];
    window.agentAudit.buyLinks = Math.max(window.agentAudit.buyLinks, links.length);
    if (links.length && !links.some(isPlaceholder)) {
      window.agentAudit.resolvedAt ??= Math.round(performance.now());
    } else {
      window.agentAudit.resolvedAt = null;
    }
  }, 100);
}

/**
 * Runs in the page once it settled. Approximates the accessibility tree (role, name)
 * for the markup we ship, across open shadow roots, and hit-tests every CTA.
 * @param {string} ctaSource CTA_PATTERN
 */
function collect(ctaSource) {
  const CTA = new RegExp(ctaSource, 'i');
  const INTERACTIVE = 'a[href], button, input[type=button], input[type=submit], [role=button], [role=link], summary';
  const LOOKALIKE = 'a, [onclick], [class*="button"], [class*="btn"], [class*="cta"], [tabindex]';

  const parentOf = (node) => node.parentElement || node.getRootNode().host || null;
  const composedClosest = (node, selector) => {
    for (let n = node; n; n = parentOf(n)) if (n.nodeType === 1 && n.matches(selector)) return n;
    return null;
  };
  const composedContains = (outer, inner) => {
    for (let n = inner; n; n = parentOf(n)) if (n === outer) return true;
    return false;
  };
  const textOf = (node) => {
    let text = '';
    const visit = (n) => {
      if (n.nodeType === Node.TEXT_NODE) { text += n.textContent; return; }
      if (n.nodeType !== Node.ELEMENT_NODE) return;
      if (['STYLE', 'SCRIPT', 'TEMPLATE'].includes(n.tagName) || n.getAttribute('aria-hidden') === 'true') return;
      if (getComputedStyle(n).display === 'none') return;
      if (n.tagName === 'SLOT') { n.assignedNodes({ flatten: true }).forEach(visit); return; }
      if (n.tagName === 'IMG') { text += ` ${n.alt || ''} `; return; }
      (n.shadowRoot ? n.shadowRoot.childNodes : n.childNodes).forEach(visit);
    };
    visit(node);
    return text.replace(/\s+/g, ' ').trim();
  };
  const nameOf = (el) => {
    const root = el.getRootNode();
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const name = labelledBy.split(/\s+/).map((id) => root.getElementById?.(id) || document.getElementById(id))
        .filter(Boolean).map(textOf).join(' ').trim();
      if (name) return name;
    }
    const label = el.getAttribute('aria-label')?.trim();
    if (label) return label;
    if (el.labels?.length) return [...el.labels].map(textOf).join(' ').trim();
    let name = textOf(el);
    // a design-system button renders its label through a slot of its host
    if (!name && root.host) name = textOf(root.host);
    return name || el.getAttribute('title')?.trim() || '';
  };
  const roleOf = (el) => {
    const explicit = el.getAttribute('role');
    if (explicit) return explicit.split(/\s+/)[0];
    if (el.tagName === 'A') return el.hasAttribute('href') ? 'link' : 'generic';
    if (el.tagName === 'BUTTON' || el.tagName === 'SUMMARY') return 'button';
    if (el.tagName === 'INPUT') {
      if (['button', 'submit', 'reset', 'image'].includes(el.type)) return 'button';
      return el.type === 'radio' || el.type === 'checkbox' ? el.type : 'textbox';
    }
    return 'generic';
  };
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0
      && el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  };
  const describe = (el) => {
    if (!el) return 'nothing';
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const consent = composedClosest(el, '#usercentrics-root, [id*="usercentrics"], [id*="onetrust"], [class*="cookie"], [id*="cookie"], [class*="consent"]');
    return `${consent ? 'consent banner: ' : ''}${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}`;
  };
  const blockOf = (el) => composedClosest(el, '[data-block-name]')?.dataset.blockName
    || composedClosest(el, '.section')?.className.split(/\s+/).find((c) => c.endsWith('-container'))
    || composedClosest(el, 'header, footer, main')?.tagName.toLowerCase();
  const deepHit = (x, y) => {
    let hit = document.elementFromPoint(x, y);
    while (hit?.shadowRoot) {
      const inner = hit.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === hit) break;
      hit = inner;
    }
    return hit;
  };
  const destinationOf = (el, role) => {
    if (role === 'button' || (role === 'link' && el.tagName !== 'A')) return { kind: 'action', key: null };
    if (role !== 'link') return { kind: 'none', key: null };
    const raw = el.getAttribute('href') || '';
    if (!raw || raw === '#' || raw.endsWith('#buylink') || raw.startsWith('javascript:')) return { kind: 'none', key: null };
    const url = new URL(el.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) return { kind: 'anchor', key: url.hash };
    if (/checkout\.|\/buy\//.test(url.href)) {
      const plan = ['product_id', 'payment_period'].map((p) => url.searchParams.get(p)).filter(Boolean).join(' ');
      return { kind: 'checkout', key: plan || `${url.host}${url.pathname}` };
    }
    return { kind: 'page', key: `${url.host}${url.pathname}` };
  };

  const elements = [];
  const walk = (root) => root.querySelectorAll('*').forEach((el) => {
    elements.push(el);
    if (el.shadowRoot) walk(el.shadowRoot);
  });
  walk(document.body);

  // light children, shadow children and slotted elements: what renders inside el
  const containsControl = (el) => {
    const stack = [...el.children, ...(el.shadowRoot?.children || [])];
    while (stack.length) {
      const n = stack.pop();
      if (n.matches('a, button, input, [role=button], [role=link]')) return true;
      if (n.tagName === 'SLOT') stack.push(...n.assignedElements({ flatten: true }));
      stack.push(...n.children, ...(n.shadowRoot?.children || []));
    }
    return false;
  };
  const candidates = elements.filter((el) => {
    const isInteractive = el.matches(INTERACTIVE);
    if (!isInteractive && !el.matches(LOOKALIKE)) return false;
    // keep the outermost control: skip a lookalike wrapping a control, or anything inside one,
    // and a design-system host whose shadow root renders the control
    if (!isInteractive && containsControl(el)) return false;
    if (parentOf(el) && composedClosest(parentOf(el), INTERACTIVE)) return false;
    if (el.shadowRoot?.querySelector(INTERACTIVE)) return false;
    // disclosure toggles (FAQ questions) aren't CTAs, even when they mention trying or buying
    if (el.matches('[aria-expanded], [aria-controls]')) return false;
    if (!visible(el) || composedClosest(el, '[aria-hidden="true"], [inert]')) return false;
    // judge what it shows, not its name: a CTA labelled with its plan has a long name
    const shown = textOf(el) || (el.getRootNode().host ? textOf(el.getRootNode().host) : '');
    if (shown.length > 60 || shown.endsWith('?')) return false;
    // a lookalike is button-sized: not a section that happens to mention "buy"
    if (!isInteractive && el.querySelectorAll('*').length > 10) return false;
    return CTA.test(nameOf(el));
  });

  const ctas = candidates.map((el) => {
    const role = roleOf(el);
    const name = nameOf(el);
    const destination = destinationOf(el, role);
    const issues = [];
    if (!['link', 'button'].includes(role)) {
      const why = el.tagName === 'A' ? `<a> without href${el.getAttribute('location') ? ` (location=${el.getAttribute('location')})` : ''}` : `<${el.tagName.toLowerCase()}> role=${role}`;
      issues.push({ code: 'not-exposed', detail: why });
    }
    if (role === 'link' && destination.kind === 'none') issues.push({ code: 'no-destination', detail: `href="${el.getAttribute('href')}"` });
    if (['link', 'button'].includes(role) && el.tabIndex < 0) issues.push({ code: 'not-focusable', detail: `tabindex=${el.getAttribute('tabindex')}` });
    if (el.matches('[disabled], [aria-disabled="true"]') || getComputedStyle(el).pointerEvents === 'none') {
      issues.push({ code: 'disabled', detail: el.getAttribute('aria-disabled') ? 'aria-disabled' : 'disabled or pointer-events' });
    }
    el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
    const rect = el.getBoundingClientRect();
    const hit = deepHit(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // a hit on the shadow host that renders el is a hit on el
    const reached = hit && (composedContains(el, hit) || (composedContains(hit, el) && hit.shadowRoot?.contains(el)));
    if (!reached) issues.push({ code: 'covered', detail: describe(hit) });
    return {
      name: name.slice(0, 120),
      role,
      tag: el.tagName.toLowerCase(),
      block: blockOf(el),
      href: el.getAttribute('href') ?? el.getAttribute('location'),
      destination,
      issues,
    };
  });
  window.scrollTo(0, 0);

  // the same name for different plans or pages: an agent has to guess which one it wants
  const byName = new Map();
  ctas.filter((c) => ['link', 'button'].includes(c.role) && ['checkout', 'page'].includes(c.destination.kind))
    .forEach((c) => byName.set(c.name.toLowerCase(), [...(byName.get(c.name.toLowerCase()) || []), c]));
  byName.forEach((group) => {
    const keys = new Set(group.map((c) => c.destination.key));
    if (keys.size > 1) {
      group.forEach((c) => c.issues.push({ code: 'ambiguous-name', detail: `${group.length} CTAs named "${c.name}" go to ${keys.size} destinations` }));
    }
  });

  // plan pickers: "Yearly" means nothing if three products each have one
  const radios = elements.filter((el) => el.matches('input[type=radio], [role=radio]'))
    .filter((el) => visible(el) || [...(el.labels || [])].some(visible))
    .map((el) => {
      const group = composedClosest(el, 'fieldset, [role=radiogroup]');
      const groupLabel = group
        ? (group.tagName === 'FIELDSET' ? textOf(group.querySelector('legend') || document.createElement('i')) : '') || nameOf(group)
        : '';
      return {
        name: nameOf(el), groupLabel: groupLabel.slice(0, 120), group: el.getAttribute('name') || group, block: blockOf(el), issues: [],
      };
    });
  const radioKeys = new Map();
  radios.forEach((r) => {
    const key = `${r.groupLabel.toLowerCase()}|${r.name.toLowerCase()}`;
    radioKeys.set(key, new Set([...(radioKeys.get(key) || []), r.group]));
  });
  radios.forEach((r) => {
    const groups = radioKeys.get(`${r.groupLabel.toLowerCase()}|${r.name.toLowerCase()}`);
    if (groups.size > 1) {
      r.issues.push({ code: 'ambiguous-radio', detail: `"${r.name}" in ${groups.size} groups${r.groupLabel ? ` labelled "${r.groupLabel}"` : ' with no group label'}` });
    }
    delete r.group;
  });

  return { ctas, radios: radios.filter((r) => r.issues.length) };
}

async function auditPage(browser, userAgent, pagePath) {
  const url = new URL(pagePath, args.base).href;
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent, locale: 'en-US' });
  const page = await context.newPage();
  await page.addInitScript(initScript);
  const result = { path: pagePath, url };
  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    result.status = response?.status();
    if (result.status === 429) {
      throw new RateLimited(`HTTP 429, retry-after ${response.headers()['retry-after'] ?? '?'} s`);
    }
    if (result.status >= 400) throw new Error(`HTTP ${result.status}`);
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    // in the EU the consent dialog covers the page; an agent dismisses it first, and so do we,
    // with the privacy-preserving choice
    const deny = page.locator('#usercentrics-root, #usercentrics-cmp-ui')
      .getByRole('button', { name: /deny|reject|decline|refuse/i }).first();
    const shown = await deny.waitFor({ state: 'visible', timeout: 3000 }).then(() => true, () => false);
    result.consent = shown ? await deny.click({ timeout: 3000 }).then(() => 'denied', () => 'not dismissed') : 'none';
    if (shown) await page.waitForTimeout(500);
    await page.waitForFunction(
      () => window.agentAudit.resolvedAt !== null || (window.agentAudit.buyLinks === 0 && performance.now() > 4000),
      null,
      { timeout: RESOLVE_TIMEOUT, polling: 200 },
    ).catch(() => {});
    // scripts.js marks the body once it decorated the page; without it we'd grade raw markup
    if (!await page.evaluate(() => document.body.classList.contains('appear'))) {
      throw new Error('the site code did not run (no body.appear)');
    }
    const { buyLinks, resolvedAt } = await page.evaluate(() => window.agentAudit);
    result.buyLinks = buyLinks;
    result.resolvedMs = resolvedAt;
    Object.assign(result, await page.evaluate(collect, CTA_PATTERN));
    if (buyLinks && (resolvedAt === null || resolvedAt > SLOW_MS)) {
      result.pageIssues = [{ code: 'slow-resolve', detail: resolvedAt === null ? `not resolved within ${RESOLVE_TIMEOUT} ms` : `${resolvedAt} ms` }];
    }
    result.snapshot = await page.locator('main').ariaSnapshot({ timeout: 10000 }).catch(() => null);
  } catch (error) {
    if (error instanceof RateLimited) throw error;
    result.error = error.message.split('\n')[0];
  } finally {
    await context.close();
  }
  return result;
}

function issuesOf(result) {
  return [
    ...(result.pageIssues || []).map((i) => ({ ...i, name: '(page)', block: '' })),
    ...(result.ctas || []).flatMap((c) => c.issues.map((i) => ({ ...i, name: c.name, block: c.block }))),
    ...(result.radios || []).flatMap((r) => r.issues.map((i) => ({ ...i, name: r.name, block: r.block }))),
  ];
}

const cell = (text) => String(text).replace(/\|/g, '\\|');

function toMarkdown(results, startedAt) {
  const all = results.flatMap((r) => issuesOf(r).map((i) => ({ ...i, path: r.path })));
  const lines = [
    `# Agent CTA audit: ${args.base}/${args.locale}/`,
    '',
    `${startedAt.toISOString()} · ${results.length} pages · ${results.filter((r) => r.ctas?.length).length} with CTAs · ${results.reduce((n, r) => n + (r.ctas?.length || 0), 0)} CTAs · ${results.filter((r) => r.error).length} failed to load`,
    '',
    ...(rateLimited ? [`**Incomplete: stopped when rate limited at ${rateLimited}.**`, ''] : []),
    '| Issue | What it means | CTAs | Pages | Blocks |',
    '| --- | --- | ---: | ---: | --- |',
    ...Object.entries(ISSUES).map(([code, meaning]) => {
      const hits = all.filter((i) => i.code === code);
      const blocks = [...new Set(hits.map((i) => i.block).filter(Boolean))].join(', ');
      return `| \`${code}\` | ${meaning} | ${hits.length} | ${new Set(hits.map((i) => i.path)).size} | ${blocks} |`;
    }),
    '',
    '## Pages',
    '',
    '| Page | CTAs | Buy links resolved | Issues |',
    '| --- | ---: | ---: | --- |',
    ...results.map((r) => {
      const counts = Object.entries(issuesOf(r).reduce((acc, i) => ({ ...acc, [i.code]: (acc[i.code] || 0) + 1 }), {}))
        .map(([code, n]) => `${code} ×${n}`).join(', ');
      const resolved = r.buyLinks ? (r.resolvedMs === null ? 'never' : `${r.resolvedMs} ms`) : '–';
      return `| [${r.path}](${r.url}) | ${r.ctas?.length ?? '–'} | ${resolved} | ${r.error ? `**error:** ${cell(r.error)}` : counts || 'ok'} |`;
    }),
    '',
    '## Details',
  ];
  results.filter((r) => issuesOf(r).length).forEach((r) => {
    lines.push('', `### ${r.path}`, '');
    issuesOf(r).forEach((i) => lines.push(`- \`${i.code}\` "${cell(i.name)}"${i.block ? ` (${i.block})` : ''}: ${cell(i.detail)}`));
  });
  return `${lines.join('\n')}\n`;
}

const startedAt = new Date();
const out = args.out || path.join('reports', `${new URL(args.base).hostname}-${startedAt.toISOString().replace(/[:.]/g, '-')}`);
const paths = await getPaths();

// an aem.page host for a branch that was never pushed serves the pages but no code
const code = await fetch(new URL('/_src/scripts/scripts.js', args.base)).catch(() => null);
if (!code?.ok) {
  console.error(`No site code at ${args.base} (/_src/scripts/scripts.js: ${code ? `HTTP ${code.status}` : 'unreachable'}). Push the branch, or audit localhost.`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: 'chrome', headless: !args.headed });
// a regular desktop Chrome user agent, as browsing agents send, not HeadlessChrome
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version().split('.')[0]}.0.0.0 Safari/537.36`;

const slots = new Array(paths.length);
let next = 0;
let rateLimited = null;
await Promise.all(Array.from({ length: Number(args.concurrency) }, async () => {
  while (next < paths.length && !rateLimited) {
    const index = next;
    next += 1;
    try {
      slots[index] = await auditPage(browser, userAgent, paths[index]);
    } catch (error) {
      if (!(error instanceof RateLimited)) throw error;
      // retrying only extends the block: stop, and keep what was audited so far
      rateLimited = `${paths[index]}: ${error.message}`;
      break;
    }
    const issueCount = issuesOf(slots[index]).length;
    console.log(`[${index + 1}/${paths.length}] ${paths[index]}: ${slots[index].error || `${slots[index].ctas.length} CTAs, ${issueCount} issues`}`);
  }
}));
await browser.close();
const results = slots.filter(Boolean);
if (rateLimited) console.error(`\nStopped, rate limited at ${rateLimited}. ${results.length} of ${paths.length} pages audited.`);

await mkdir(path.join(out, 'snapshots'), { recursive: true });
await Promise.all(results.filter((r) => r.snapshot).map((r) => writeFile(
  path.join(out, 'snapshots', `${r.path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'root'}.yml`),
  r.snapshot,
)));
await writeFile(path.join(out, 'report.json'), JSON.stringify(results.map(({ snapshot, ...r }) => r), null, 2));
await writeFile(path.join(out, 'report.md'), toMarkdown(results, startedAt));
console.log(`\nReport: ${path.resolve(out, 'report.md')}`);
process.exitCode = rateLimited || results.some((r) => r.error || issuesOf(r).length) ? 1 : 0;
