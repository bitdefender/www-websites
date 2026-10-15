#!/usr/bin/env node
/**
 * Change detector for the sitemap generator.
 *
 * `create.js` takes ~3 hours to run, because it probes every hreflang alternate with a
 * deliberate 1-3s delay. This script answers the cheap question first: "has anything that
 * create.js actually reads changed since the last run?" — in about a second.
 *
 * Inputs watched:
 *  - every {locale}/query-index.json, restricted to the four fields create.js consumes
 *  - 404-redirects.json from the private bitdefender/locale-router repo (see DEX-28341)
 *
 * Usage:
 *   node check-index.js            compare against index-state.json and report
 *   node check-index.js --write    same, then persist the new fingerprints
 *   node check-index.js --json     emit the machine-readable diff on stdout
 *
 * In GitHub Actions it also writes `changed` / `summary` to $GITHUB_OUTPUT.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(HERE, 'index-state.json');

const LOCALES_URL = 'https://www.bitdefender.com/p-api/v1/locales-and-countries';
const QUERY_INDEX_URL = 'https://www.bitdefender.com/{locale}/query-index.json';
const REDIRECTS_404_URL = 'https://api.github.com/repos/bitdefender/locale-router/contents/src/404-handling/404-redirects.json';

/**
 * Only the fields create.js reads when building a sitemap entry. Fingerprinting the whole
 * row would rebuild for a title or description edit, which cannot change the output.
 * @see processLocaleSitemap in create.js
 */
const SIGNIFICANT_FIELDS = ['path', 'robots', 'priority', 'lastModifiedTimestamp'];

const STATE_VERSION = 1;
const CONCURRENCY = 12;
const ATTEMPTS = 3;
const UNIT_SEPARATOR = '\u0000';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const sortCanonical = (rows) => {
  const key = (row) => JSON.stringify(row);
  return [...rows].sort((a, b) => {
    const [ka, kb] = [key(a), key(b)];
    if (ka === kb) return 0;
    return ka < kb ? -1 : 1;
  });
};

/**
 * Reduces a query-index payload to a stable fingerprint. Row order in the feed is not
 * guaranteed, so rows are canonicalised and sorted before hashing.
 * @param {Array<Object>} rows
 * @returns {string} sha256 hex digest
 */
function fingerprintRows(rows) {
  const canonical = sortCanonical(
    rows.map((row) => SIGNIFICANT_FIELDS
      .map((field) => (row[field] === undefined || row[field] === null ? '' : String(row[field])))
      .join(UNIT_SEPARATOR)),
  );
  return sha256(JSON.stringify(canonical));
}

/**
 * Mirrors the /pages/ filter create.js applies, so redirects it ignores cannot trigger a rebuild.
 * @param {Array<{path: string, locales: string[]}>} redirects
 * @returns {string} sha256 hex digest
 */
function fingerprintRedirects(redirects) {
  const canonical = sortCanonical(
    redirects
      .filter(({ path: redirectPath }) => !String(redirectPath).startsWith('/pages/'))
      .map(({ path: redirectPath, locales }) => [
        String(redirectPath),
        [...(locales || [])].map((locale) => String(locale).toLowerCase()).sort(),
      ]),
  );
  return sha256(JSON.stringify(canonical));
}

async function fetchWithRetry(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30_000) });
      // 404 is a real answer (ja-jp has no index); 5xx is not, so it is worth retrying.
      if (response.ok || response.status === 404) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < ATTEMPTS) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => { setTimeout(resolve, 500 * attempt); });
    }
  }
  throw lastError;
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      // eslint-disable-next-line no-await-in-loop
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

/**
 * @returns {Promise<{status: 'ok'|'absent'|'failed', sha?: string, rows?: number, reason?: string}>}
 */
async function fetchLocaleIndex(locale) {
  const url = QUERY_INDEX_URL.replace('{locale}', locale);
  try {
    const response = await fetchWithRetry(url, {
      headers: process.env.X_CLIENT_ID ? { 'X-Client-Id': process.env.X_CLIENT_ID } : {},
    });
    if (response.status === 404) return { status: 'absent' };

    const payload = await response.json();
    if (!Array.isArray(payload?.data)) {
      return { status: 'failed', reason: 'response had no data array' };
    }
    return { status: 'ok', sha: fingerprintRows(payload.data), rows: payload.data.length };
  } catch (error) {
    return { status: 'failed', reason: error.message };
  }
}

async function fetchRedirectsFingerprint() {
  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) {
    return { status: 'failed', reason: 'GITHUB_TOKEN is not set' };
  }
  try {
    const response = await fetchWithRetry(REDIRECTS_404_URL, {
      headers: {
        Accept: 'application/vnd.github.raw+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) return { status: 'failed', reason: `HTTP ${response.status}` };

    const redirects = await response.json();
    if (!Array.isArray(redirects)) return { status: 'failed', reason: 'expected an array' };
    return { status: 'ok', sha: fingerprintRedirects(redirects), entries: redirects.length };
  } catch (error) {
    return { status: 'failed', reason: error.message };
  }
}

async function fetchLocales() {
  const response = await fetchWithRetry(LOCALES_URL);
  if (!response.ok) throw new Error(`Failed to list locales: HTTP ${response.status}`);
  const payload = await response.json();
  return [...new Set(payload.map((entry) => entry.locale.toLowerCase()))].sort();
}

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { version: STATE_VERSION, redirects: null, locales: {} };
  }
}

/**
 * Builds the new state. Locales that failed to fetch keep their previous fingerprint, so a
 * transient 5xx can never be mistaken for "this locale was removed".
 */
function buildState(previous, localeResults, redirects) {
  const locales = {};
  const failures = [];

  localeResults.forEach(({ locale, result }) => {
    if (result.status === 'ok') {
      locales[locale] = { sha: result.sha, rows: result.rows };
      return;
    }
    if (result.status === 'absent') return;

    failures.push({ locale, reason: result.reason });
    if (previous.locales?.[locale]) locales[locale] = previous.locales[locale];
  });

  let redirectState = previous.redirects ?? null;
  if (redirects.status === 'ok') {
    redirectState = { sha: redirects.sha, entries: redirects.entries };
  } else {
    failures.push({ locale: '404-redirects.json', reason: redirects.reason });
  }

  return {
    state: {
      version: STATE_VERSION,
      generatedAt: new Date().toISOString(),
      redirects: redirectState,
      locales: Object.fromEntries(Object.keys(locales).sort().map((k) => [k, locales[k]])),
    },
    failures,
  };
}

function diffStates(previous, next, failedLocales) {
  const skip = new Set(failedLocales);
  const before = previous.locales ?? {};
  const after = next.locales ?? {};

  const added = Object.keys(after).filter((l) => !before[l] && !skip.has(l));
  const removed = Object.keys(before).filter((l) => !after[l] && !skip.has(l));
  const modified = Object.keys(after)
    .filter((l) => before[l] && !skip.has(l) && before[l].sha !== after[l].sha)
    .map((l) => ({ locale: l, rowsBefore: before[l].rows, rowsAfter: after[l].rows }));

  const redirectsChanged = Boolean(next.redirects)
    && previous.redirects?.sha !== next.redirects.sha;

  return {
    added,
    removed,
    modified,
    redirectsChanged,
    changed: added.length > 0 || removed.length > 0 || modified.length > 0 || redirectsChanged,
  };
}

function formatSummary(diff, failures, isFirstRun) {
  const lines = [];
  if (isFirstRun) {
    lines.push('No previous state found — recording a baseline, nothing to regenerate.');
  } else if (!diff.changed) {
    lines.push('No change in any locale index or in 404-redirects.json.');
  } else {
    if (diff.redirectsChanged) lines.push('- `404-redirects.json` changed (affects every locale)');
    diff.added.forEach((l) => lines.push(`- \`${l}\` added`));
    diff.removed.forEach((l) => lines.push(`- \`${l}\` removed`));
    diff.modified.forEach(({ locale, rowsBefore, rowsAfter }) => {
      const delta = rowsBefore === rowsAfter ? `${rowsAfter} rows` : `${rowsBefore} -> ${rowsAfter} rows`;
      lines.push(`- \`${locale}\` changed (${delta})`);
    });
  }
  failures.forEach(({ locale, reason }) => lines.push(`- :warning: \`${locale}\` could not be checked (${reason}); previous fingerprint kept`));
  return lines.join('\n');
}

async function writeGithubOutputs(diff, summary) {
  const { GITHUB_OUTPUT, GITHUB_STEP_SUMMARY } = process.env;
  if (GITHUB_OUTPUT) {
    const delimiter = `EOF_${Date.now()}`;
    await appendFile(
      GITHUB_OUTPUT,
      `changed=${diff.changed}\nsummary<<${delimiter}\n${summary}\n${delimiter}\n`,
    );
  }
  if (GITHUB_STEP_SUMMARY) {
    await appendFile(GITHUB_STEP_SUMMARY, `## Sitemap index check\n\n${summary}\n`);
  }
}

(async () => {
  const shouldWrite = process.argv.includes('--write');
  const asJson = process.argv.includes('--json');

  const previous = await loadState();
  const isFirstRun = Object.keys(previous.locales ?? {}).length === 0;

  const locales = await fetchLocales();
  const localeResults = await mapWithConcurrency(
    locales,
    CONCURRENCY,
    async (locale) => ({ locale, result: await fetchLocaleIndex(locale) }),
  );
  const redirects = await fetchRedirectsFingerprint();

  const { state, failures } = buildState(previous, localeResults, redirects);
  const diff = diffStates(previous, state, failures.map((f) => f.locale));
  // A baseline run has nothing to compare against, so it must not trigger a 3-hour rebuild.
  if (isFirstRun) diff.changed = false;

  const summary = formatSummary(diff, failures, isFirstRun);

  if (asJson) {
    console.log(JSON.stringify({ ...diff, failures }, null, 2));
  } else {
    console.log(`Checked ${locales.length} locales in ${Object.keys(state.locales).length} indices.`);
    console.log(summary);
  }

  if (shouldWrite) {
    await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
    console.log(`Wrote ${path.relative(process.cwd(), STATE_FILE)}`);
  }

  await writeGithubOutputs(diff, summary);
})().catch((error) => {
  console.error('Index check failed:', error.message);
  process.exit(1);
});
