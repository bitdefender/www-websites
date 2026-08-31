/* eslint-disable no-await-in-loop, no-console, no-continue, no-restricted-syntax */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { homedir } from 'node:os';
import { JSDOM } from 'jsdom';

const browserDom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = browserDom.window;
globalThis.document = browserDom.window.document;
globalThis.DOMParser = browserDom.window.DOMParser;

const { mdToDocDom, docDomToAemHtml } = await import('./da-converters.mjs');

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const PAGE_CONCURRENCY = 5;
const BINARY_EXTENSIONS = new Set(['json', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'pdf']);
const BINARY_SELECTORS = [
  'a[href*="/fragments/"]',
  'a[href*=".mp4"]',
  'a[href*=".pdf"]',
  'a[href*=".svg"]',
  'img[alt*=".mp4"]',
];
const SVG_URL_REGEX = /https:\/\/[^"'\s]+\.svg/g;
const MIME_BY_EXTENSION = {
  json: 'application/json',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
};

function usage() {
  return `Usage:
  node import-locale.mjs --manifest <multi-locale-summary.json>
    --locales <locale,locale,...> --output-dir <directory> [options]

Options:
  --dry-run                 Prepare and validate without DA mutations
  --include-linked          Opt in to same-locale linked fragments/assets
  --dest-org <org>          Destination organization (default: bitdefender)
  --dest-repo <repo>        Destination site (default: www-doc-authoring)
  --live-origin <url>       Source live origin override
  --preview-origin <url>    Source preview origin override
  --token-file <path>       Cached DA token file override
  --help                    Show this message`;
}

function parseArgs(argv) {
  const args = {};
  const booleanOptions = new Set(['dry-run', 'help', 'include-linked']);
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (booleanOptions.has(key)) {
      args[key] = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    args[key] = value;
    i += 1;
  }
  if (args.help) return args;
  for (const required of ['manifest', 'output-dir', 'locales']) {
    if (!args[required]) throw new Error(`Missing --${required}`);
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelay(response, attempt) {
  const retryAfter = Number(response?.headers?.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter >= 0) return retryAfter * 1000;
  return 1000 * (2 ** (attempt - 1));
}

async function fetchWithRetry(url, options = {}, label = 'request') {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!RETRYABLE_STATUS.has(response.status) || attempt === 3) return response;
      await sleep(retryDelay(response, attempt));
    } catch (error) {
      lastError = error;
      if (attempt === 3) throw new Error(`${label}: ${error.message}`);
      await sleep(1000 * (2 ** (attempt - 1)));
    }
  }
  throw lastError || new Error(`${label}: request failed`);
}

async function getToken(tokenFile) {
  if (process.env.DA_TOKEN) return process.env.DA_TOKEN;
  const tokenPath = tokenFile || `${homedir()}/.aem/da-token.json`;
  const cached = JSON.parse(await readFile(tokenPath, 'utf8'));
  if (!cached.access_token || cached.expires_at <= Date.now() + 300000) {
    throw new Error('DA token is missing or expires within five minutes');
  }
  return cached.access_token;
}

function normalizeRoutePath(pathname) {
  let path = decodeURIComponent(pathname || '/');
  path = path.replace(/\/index$/, '').replace(/\/+$/, '');
  return path || '/';
}

function pathUrl(origin, pathname) {
  return `${origin}${pathname}`;
}

function sourceMarkdownUrl(pageUrl) {
  const url = new URL(pageUrl);
  const pathname = url.pathname.endsWith('/')
    ? `${url.pathname}index.md`
    : `${url.pathname}.md`;
  return `${url.origin}${pathname}`;
}

function sourceMarkdownUrls(pageUrl) {
  const url = new URL(pageUrl);
  const pathname = url.pathname;
  if (pathname.endsWith('/')) return [sourceMarkdownUrl(pageUrl)];
  return [sourceMarkdownUrl(pageUrl), `${url.origin}${pathname}/index.md`];
}

function encodedPath(pathname) {
  return pathname.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function sourceApiUrl(destOrg, destRepo, pathname) {
  return `https://admin.da.live/source/${encodeURIComponent(destOrg)}/${encodeURIComponent(destRepo)}${encodedPath(pathname)}`;
}

function pageDestinationPath(pathname) {
  const route = normalizeRoutePath(pathname);
  return route === '/' ? '/index.html' : `${route}.html`;
}

function indexPageDestinationPath(pathname) {
  let route = decodeURIComponent(pathname || '/').replace(/\/+$/, '') || '/';
  route = route.replace(/\/index$/, '') || '/';
  return route === '/' ? '/index.html' : `${route}/index.html`;
}

function assetDestinationPath(pathname) {
  return normalizeRoutePath(pathname);
}

function extension(pathname) {
  const match = pathname.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] || '';
}

function mimeType(pathname, response) {
  const header = response.headers.get('content-type')?.split(';', 1)[0].trim();
  return header || MIME_BY_EXTENSION[extension(pathname)] || 'application/octet-stream';
}

function isAllowedSourceHost(url, sourceLiveOrigin, sourcePreviewOrigin) {
  const live = new URL(sourceLiveOrigin);
  const preview = new URL(sourcePreviewOrigin);
  return url.protocol === 'https:' && (url.origin === live.origin || url.origin === preview.origin);
}

function canonicalLinkedUrl(rawHref, pageUrl, sourceLiveOrigin, sourcePreviewOrigin) {
  if (!rawHref || rawHref.startsWith('#') || /^(mailto|tel|javascript):/i.test(rawHref)) return null;
  const normalized = rawHref.replaceAll('.hlx.', '.aem.');
  let url;
  try {
    url = new URL(normalized, pageUrl);
  } catch {
    return null;
  }
  if (!isAllowedSourceHost(url, sourceLiveOrigin, sourcePreviewOrigin)) return null;
  url.hash = '';
  url.search = '';
  return url;
}

function isLocalePath(pathname, locale) {
  const route = normalizeRoutePath(pathname);
  return route === `/${locale}` || route.startsWith(`/${locale}/`);
}

function discoveredTasks(html, pageUrl, sourceLiveOrigin, sourcePreviewOrigin, knownPaths, locale, includeLinked) {
  if (!includeLinked) return [];
  const parsed = new JSDOM(html).window.document;
  const elements = [...parsed.querySelectorAll(BINARY_SELECTORS.join(', '))];
  const rawHrefs = elements.map((element) => element.getAttribute('href') || element.getAttribute('alt'));
  rawHrefs.push(...(html.match(SVG_URL_REGEX) || []));

  const tasks = [];
  for (const rawHref of rawHrefs) {
    const url = canonicalLinkedUrl(rawHref, pageUrl, sourceLiveOrigin, sourcePreviewOrigin);
    if (!url || url.pathname.includes('query-index') || /\.(xml|html)$/i.test(url.pathname)) continue;
    const ext = extension(url.pathname);
    const isAsset = BINARY_EXTENSIONS.has(ext);
    const isFragment = url.pathname.includes('/fragments/') && !isAsset;
    if (!isAsset && !isFragment) continue;
    if (isFragment && !isLocalePath(url.pathname, locale)) {
      const error = new Error(`linked page outside active locale ${locale}: ${url.pathname}`);
      error.code = 'OUT_OF_SCOPE';
      throw error;
    }
    const key = url.pathname;
    if (knownPaths.has(key)) continue;
    knownPaths.add(key);
    tasks.push({
      kind: isAsset ? 'asset' : 'page',
      sourceUrl: url.href,
      sourcePath: url.pathname,
      destinationPath: isAsset ? assetDestinationPath(url.pathname) : pageDestinationPath(url.pathname),
      discoveredFrom: pageUrl,
      alreadyInDA: false,
    });
  }
  return tasks;
}

function wrapForDA(html, sourceLiveOrigin) {
  const inner = html
    .replaceAll('./media', `${sourceLiveOrigin}/media`)
    .replaceAll('href="/', `href="${sourceLiveOrigin}/`);
  return `<body><header></header><main>${inner}</main><footer></footer></body>`;
}

async function fetchPageTask(task) {
  const markdownUrls = sourceMarkdownUrls(task.sourceUrl);
  let sourceUrl = markdownUrls[0];
  let response = await fetchWithRetry(sourceUrl, { redirect: 'follow' }, `GET ${sourceUrl}`);
  const initialRedirectPath = response.redirected ? normalizeRoutePath(new URL(response.url).pathname) : null;
  const sameRouteRedirect = initialRedirectPath === normalizeRoutePath(task.sourcePath);
  if (response.redirected && !sameRouteRedirect) {
    const error = new Error(`source redirect ${task.sourceUrl} -> ${response.url}`);
    error.code = 'REDIRECT';
    error.details = {
      sourceUrl: task.sourceUrl,
      fetchUrl: sourceUrl,
      kind: 'page',
      destinationPath: task.destinationPath,
      sourceStatus: response.status,
      sourceFinalUrl: response.url,
      sourceRedirected: true,
    };
    throw error;
  }
  if ((response.status === 404 || sameRouteRedirect) && markdownUrls[1]) {
    sourceUrl = markdownUrls[1];
    response = await fetchWithRetry(sourceUrl, { redirect: 'follow' }, `GET ${sourceUrl}`);
  }
  const usesIndexDocument = sourceUrl.endsWith('/index.md');
  const result = {
    sourceUrl: task.sourceUrl,
    fetchUrl: sourceUrl,
    kind: 'page',
    destinationPath: usesIndexDocument
      ? indexPageDestinationPath(task.sourcePath)
      : task.destinationPath,
    sourceStatus: response.status,
    sourceFinalUrl: response.url,
    sourceRedirected: response.redirected,
  };
  if (response.redirected) {
    const error = new Error(`source redirect ${task.sourceUrl} -> ${response.url}`);
    error.code = 'REDIRECT';
    error.details = result;
    throw error;
  }
  if (!response.ok) throw new Error(`source returned HTTP ${response.status} for ${task.sourceUrl}`);
  const markdown = await response.text();
  const html = docDomToAemHtml(mdToDocDom(markdown));
  return { ...task, ...result, html };
}

async function fetchAssetTask(task) {
  const response = await fetchWithRetry(task.sourceUrl, { redirect: 'follow' }, `GET ${task.sourceUrl}`);
  const result = {
    sourceUrl: task.sourceUrl,
    kind: 'asset',
    destinationPath: task.destinationPath,
    sourceStatus: response.status,
    sourceFinalUrl: response.url,
    sourceRedirected: response.redirected,
  };
  const ext = extension(task.sourcePath);
  if (response.redirected && !['mp4', 'png', 'jpg'].includes(ext)) {
    throw new Error(`source redirect ${task.sourceUrl} -> ${response.url}`);
  }
  if (!response.ok) throw new Error(`source returned HTTP ${response.status} for ${task.sourceUrl}`);
  const bytes = await response.arrayBuffer();
  return { ...task, ...result, bytes, mime: mimeType(task.sourcePath, response) };
}

async function listDAPaths({ destOrg, destRepo, locale, token }) {
  const queue = [locale];
  const seen = new Set();
  const paths = new Set();
  while (queue.length) {
    const batch = queue.splice(0, 12).filter((path) => !seen.has(path));
    batch.forEach((path) => seen.add(path));
    const results = await Promise.all(batch.map(async (path) => {
      const listPath = path.replace(/^\/+/, '');
      const url = `https://admin.da.live/list/${encodeURIComponent(destOrg)}/${encodeURIComponent(destRepo)}/${encodedPath(listPath)}`;
      const response = await fetchWithRetry(url, { headers: { Authorization: `Bearer ${token}` } }, `GET ${url}`);
      if (response.status === 404) return [];
      if (!response.ok) throw new Error(`destination list returned HTTP ${response.status} for ${url}`);
      return response.json();
    }));
    results.flat().forEach((item) => {
      const prefix = `/${destOrg}/${destRepo}/`;
      const itemPath = item.path?.startsWith(prefix) ? item.path.slice(prefix.length) : item.path;
      if (!itemPath) return;
      if (item.ext) paths.add(`/${itemPath}`);
      else queue.push(itemPath);
    });
  }
  return paths;
}

async function prepareLocale(report, options, token) {
  const initial = [...report.indexed, ...report.nonIndexed].map((candidate) => ({
    kind: 'page',
    sourceUrl: candidate.url,
    sourcePath: new URL(candidate.url).pathname,
    destinationPath: pageDestinationPath(new URL(candidate.url).pathname),
    alreadyInDA: candidate.alreadyInDA,
  }));
  const knownPaths = new Set(initial.map((task) => task.sourcePath));
  const tasks = [...initial];
  const prepared = [];
  const skipped = [];
  let nextIndex = 0;
  let failure;

  async function worker() {
    while (!failure) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= tasks.length) return;
      const task = tasks[index];
      try {
        const result = task.kind === 'page' ? await fetchPageTask(task) : await fetchAssetTask(task);
        if (task.kind === 'page') {
          const pageUrl = new URL(task.sourceUrl);
          const linked = discoveredTasks(
            result.html,
            pageUrl,
            options.liveOrigin,
            options.previewOrigin,
            knownPaths,
            report.locale,
            options.includeLinked,
          );
          tasks.push(...linked);
          result.html = wrapForDA(result.html, options.liveOrigin);
        }
        prepared[index] = result;
      } catch (error) {
        if (error.code === 'REDIRECT') {
          skipped.push({
            ...task,
            ...error.details,
            status: 'skipped',
            error: error.message,
          });
          continue;
        }
        if (task.discoveredFrom && /source returned HTTP 404/.test(error.message)) {
          const status = Number(error.message.match(/HTTP (\d+)/)?.[1]) || 404;
          skipped.push({
            ...task,
            status: 'skipped',
            reason: 'non_200',
            sourceStatus: status,
            error: error.message,
          });
          continue;
        }
        failure = { task, error: error.message };
        return;
      }
    }
  }

  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, () => worker()));
  if (failure) {
    return {
      locale: report.locale,
      ok: false,
      failure,
      skipped,
      prepared: prepared.filter(Boolean),
      initialCount: initial.length,
      discoveredCount: prepared.filter(({ discoveredFrom }) => Boolean(discoveredFrom)).length,
      totalTasks: tasks.length,
    };
  }
  const existingPaths = await listDAPaths({ destOrg: options.destOrg, destRepo: options.destRepo, locale: report.locale, token });
  prepared.filter(Boolean).forEach((task) => {
    task.alreadyInDA = existingPaths.has(task.destinationPath);
  });
  return {
    locale: report.locale,
    ok: true,
    prepared: prepared.filter(Boolean),
    skipped,
    existingPaths,
    initialCount: initial.length,
    discoveredCount: prepared.filter(({ discoveredFrom }) => Boolean(discoveredFrom)).length,
  };
}

function validatePreparedScope(preparedLocale, options) {
  const discoveredPages = preparedLocale.prepared.filter((task) => task.kind === 'page' && task.discoveredFrom);
  if (!options.includeLinked && discoveredPages.length) {
    throw new Error(`prepared ${discoveredPages.length} linked pages without --include-linked`);
  }
  const outOfScope = discoveredPages.filter((task) => !isLocalePath(task.sourcePath, preparedLocale.locale));
  if (outOfScope.length) {
    throw new Error(`prepared linked pages outside ${preparedLocale.locale}: ${outOfScope.map(({ sourcePath }) => sourcePath).join(', ')}`);
  }
}

async function uploadTask(task, options, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const url = sourceApiUrl(options.destOrg, options.destRepo, task.destinationPath);
  const form = new FormData();
  const body = task.kind === 'page' ? task.html : task.bytes;
  const mime = task.kind === 'page' ? 'text/html' : task.mime;
  form.append('data', new Blob([body], { type: mime }), basename(task.destinationPath));
  const response = await fetchWithRetry(url, { method: 'PUT', headers, body: form }, `PUT ${url}`);
  const result = {
    sourceUrl: task.sourceUrl,
    fetchUrl: task.fetchUrl,
    destinationPath: task.destinationPath,
    kind: task.kind,
    alreadyInDA: task.alreadyInDA,
    sourceStatus: task.sourceStatus,
    sourceFinalUrl: task.sourceFinalUrl,
    sourceRedirected: task.sourceRedirected,
    discoveredFrom: task.discoveredFrom,
    status: response.status,
    redirected: response.redirected,
    finalUrl: response.url,
  };
  if (!response.ok) {
    const detail = (await response.text()).trim().slice(0, 500);
    throw new Error(`PUT returned HTTP ${response.status}${detail ? `: ${detail}` : ''}`);
  }
  return result;
}

async function uploadLocale(preparedLocale, options, token) {
  const tasks = preparedLocale.prepared;
  const results = new Array(tasks.length);
  let nextIndex = 0;
  let failure;
  async function worker() {
    while (!failure) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= tasks.length) return;
      try {
        results[index] = await uploadTask(tasks[index], options, token);
      } catch (error) {
        failure = { task: tasks[index], error: error.message };
      }
    }
  }
  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, () => worker()));
  return { ...preparedLocale, uploadResults: results.filter(Boolean), uploadFailure: failure || null };
}

function summarizeLocale(result) {
  const uploads = result.uploadResults || [];
  return {
    locale: result.locale,
    candidates: result.initialCount || 0,
    prepared: result.prepared?.length || 0,
    discovered: result.discoveredCount || 0,
    uploaded: uploads.length,
    pagesUploaded: uploads.filter(({ kind }) => kind === 'page').length,
    assetsUploaded: uploads.filter(({ kind }) => kind === 'asset').length,
    overwrites: uploads.filter(({ alreadyInDA }) => alreadyInDA).length,
    results: uploads,
    skipped: result.skipped || [],
    failed: result.failure || result.uploadFailure || null,
  };
}

const args = parseArgs(process.argv);
if (args.help) {
  console.log(usage());
  process.exit(0);
}
const manifest = JSON.parse(await readFile(args.manifest, 'utf8'));
const token = await getToken(args['token-file']);
const manifestDir = args.manifest.slice(0, args.manifest.lastIndexOf('/'));
const requestedLocales = args.locales.split(',').map((locale) => locale.trim()).filter(Boolean);
const reports = (Array.isArray(manifest.reports) ? manifest.reports : null) || await Promise.all(requestedLocales.map(async (locale) => (
  JSON.parse(await readFile(`${manifestDir}/${locale}-import-audit.json`, 'utf8'))
)));
if (!reports.length || manifest.failures?.length) throw new Error('Manifest has no complete successful locale reports');

const options = {
  destOrg: args['dest-org'] || 'bitdefender',
  destRepo: args['dest-repo'] || 'www-doc-authoring',
  liveOrigin: args['live-origin'] || 'https://main--www-websites--bitdefender.aem.live',
  previewOrigin: args['preview-origin'] || 'https://main--www-websites--bitdefender.aem.page',
  includeLinked: Boolean(args['include-linked']),
};
await mkdir(args['output-dir'], { recursive: true });
const output = {
  startedAt: new Date().toISOString(),
  source: options.liveOrigin,
  destination: `${options.destOrg}/${options.destRepo}`,
  previewOrPublishTriggered: false,
  locales: [],
};

for (const report of reports) {
  const prepared = await prepareLocale(report, options, token);
  if (!prepared.ok) {
    output.locales.push(summarizeLocale(prepared));
    continue;
  }
  validatePreparedScope(prepared, options);
  if (args['dry-run']) {
    output.locales.push({
      ...summarizeLocale(prepared),
      pagesPrepared: prepared.prepared.filter(({ kind }) => kind === 'page').length,
      assetsPrepared: prepared.prepared.filter(({ kind }) => kind === 'asset').length,
      existingDestinations: prepared.prepared.filter(({ alreadyInDA }) => alreadyInDA).length,
    });
    continue;
  }
  const uploaded = await uploadLocale(prepared, options, token);
  output.locales.push(summarizeLocale(uploaded));
  if (uploaded.uploadFailure?.error?.includes('HTTP 401') || uploaded.uploadFailure?.error?.includes('HTTP 403')) {
    throw new Error(`Authentication/destination authorization failure in ${report.locale}: ${uploaded.uploadFailure.error}`);
  }
}

output.finishedAt = new Date().toISOString();
output.totals = output.locales.reduce((acc, locale) => ({
  prepared: acc.prepared + locale.prepared,
  uploaded: acc.uploaded + locale.uploaded,
  pagesUploaded: acc.pagesUploaded + locale.pagesUploaded,
  assetsUploaded: acc.assetsUploaded + locale.assetsUploaded,
  overwrites: acc.overwrites + locale.overwrites,
  failures: acc.failures + (locale.failed ? 1 : 0),
}), { prepared: 0, uploaded: 0, pagesUploaded: 0, assetsUploaded: 0, overwrites: 0, failures: 0 });
await writeFile(`${args['output-dir']}/import-results.json`, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  destination: output.destination,
  previewOrPublishTriggered: output.previewOrPublishTriggered,
  locales: output.locales,
  totals: output.totals,
  report: `${args['output-dir']}/import-results.json`,
}, null, 2));
