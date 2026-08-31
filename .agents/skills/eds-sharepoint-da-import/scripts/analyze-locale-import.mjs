#!/usr/bin/env node
/* eslint-disable no-await-in-loop, no-console, no-continue */
/* eslint-disable no-promise-executor-return, no-restricted-syntax */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULTS = {
  sourceOrg: 'bitdefender',
  sourceRepo: 'www-websites',
  sourceBranch: 'main',
  destOrg: 'bitdefender',
  destRepo: 'www-doc-authoring',
  format: 'report',
  localeConcurrency: 2,
  timeoutMs: 120000,
};

const LOCALE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function usage() {
  return `Usage:
  node analyze-locale-import.mjs --locale <locale> [options]
  node analyze-locale-import.mjs --locales <locale,locale,...> [options]

Options:
  --locale <locale>           Locale route; repeat for multiple locales
  --locales <locale,...>      Comma-separated locale routes
  --indexless                 Expect every requested locale to have no query index
  --indexless-locales <list>  Comma-separated indexless locales in a mixed batch
  --locale-concurrency <n>    Locales analyzed concurrently (default: 2; max: 5)
  --source-org <org>          Source AEM organization (default: bitdefender)
  --source-repo <repo>        Source AEM site/repository (default: www-websites)
  --source-branch <branch>    Source branch (default: main)
  --dest-org <org>            Destination DA organization (default: bitdefender)
  --dest-repo <repo>          Destination DA site (default: www-doc-authoring)
  --live-origin <url>         Override the source aem.live origin
  --preview-origin <url>      Override the source aem.page origin
  --query-index <url>         Override the query index. For multiple locales,
                              include a {locale} placeholder in the URL.
  --token-file <path>         Override the cached DA token file
  --timeout-ms <number>       Bulk-status timeout (default: 120000)
  --output-dir <path>         Write one report per locale and a batch summary
  --format report|urls|json
  --help

The command is read-only: it inventories source and destination content but
never starts a DA import, preview, or publish operation. Existing DA paths are
reported as overwrite state and remain import candidates.`;
}

function parseArgs(argv) {
  const args = { ...DEFAULTS, locales: [], indexlessLocales: [] };
  const keys = {
    '--source-org': 'sourceOrg',
    '--source-repo': 'sourceRepo',
    '--source-branch': 'sourceBranch',
    '--dest-org': 'destOrg',
    '--dest-repo': 'destRepo',
    '--live-origin': 'liveOrigin',
    '--preview-origin': 'previewOrigin',
    '--query-index': 'queryIndex',
    '--token-file': 'tokenFile',
    '--locale-concurrency': 'localeConcurrency',
    '--timeout-ms': 'timeoutMs',
    '--output-dir': 'outputDir',
    '--format': 'format',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help') {
      args.help = true;
      continue;
    }
    if (arg === '--indexless') {
      args.indexlessAll = true;
      continue;
    }
    if (arg === '--indexless-locales') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      args.indexlessLocales.push(...value.split(',')
        .map((locale) => locale.trim()).filter(Boolean));
      index += 1;
      continue;
    }
    if (arg === '--locale' || arg === '--locales') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      const locales = arg === '--locales' ? value.split(',') : [value];
      args.locales.push(...locales.map((locale) => locale.trim()).filter(Boolean));
      index += 1;
      continue;
    }
    const key = keys[arg];
    if (!key) throw new Error(`Unknown option: ${arg}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    args[key] = ['localeConcurrency', 'timeoutMs'].includes(key) ? Number(value) : value;
    index += 1;
  }

  if (args.help) return args;
  args.locales = [...new Set(args.locales)];
  if (!args.locales.length) throw new Error('--locale or --locales is required');
  args.locales.forEach((locale) => {
    if (!LOCALE_PATTERN.test(locale)) throw new Error(`Unsafe locale value: ${locale}`);
  });
  args.indexlessLocales = args.indexlessAll
    ? [...args.locales]
    : [...new Set(args.indexlessLocales)];
  args.indexlessLocales.forEach((locale) => {
    if (!LOCALE_PATTERN.test(locale)) throw new Error(`Unsafe indexless locale value: ${locale}`);
    if (!args.locales.includes(locale)) {
      throw new Error(`Indexless locale ${locale} is not in the requested locale set`);
    }
  });
  if (!['report', 'urls', 'json'].includes(args.format)) {
    throw new Error('--format must be report, urls, or json');
  }
  if (!Number.isInteger(args.localeConcurrency)
    || args.localeConcurrency < 1 || args.localeConcurrency > 5) {
    throw new Error('--locale-concurrency must be an integer between 1 and 5');
  }
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1000) {
    throw new Error('--timeout-ms must be at least 1000');
  }
  if (args.locales.length > 1 && args.queryIndex && !args.queryIndex.includes('{locale}')) {
    throw new Error('--query-index must include {locale} when analyzing multiple locales');
  }
  return args;
}

async function readToken(options) {
  if (process.env.DA_TOKEN) return process.env.DA_TOKEN;

  const candidates = [
    options.tokenFile,
    resolve(homedir(), '.aem/da-token.json'),
    resolve(process.cwd(), '.hlx/.da-token.json'),
  ].filter(Boolean);

  for (const path of candidates) {
    try {
      const cached = JSON.parse(await readFile(path, 'utf8'));
      const expiresAt = cached.expires_at || 0;
      if (cached.access_token && expiresAt > Date.now() + 60000) return cached.access_token;
    } catch {
      // Try the next supported token location.
    }
  }

  throw new Error('No valid DA token found. Run the da-auth workflow first.');
}

async function fetchResponse(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    const detail = body.trim() ? `: ${body.trim().slice(0, 500)}` : '';
    const error = new Error(`${options.method || 'GET'} ${url} returned ${response.status}${detail}`);
    error.status = response.status;
    throw error;
  }
  return response;
}

async function fetchJson(url, options = {}) {
  return (await fetchResponse(url, options)).json();
}

async function fetchQueryIndex(url, indexless) {
  const response = await fetch(url);
  if (indexless && response.status === 404) {
    return {
      query: { data: [] },
      available: false,
      status: response.status,
    };
  }
  if (!response.ok) {
    const body = await response.text();
    const detail = body.trim() ? `: ${body.trim().slice(0, 500)}` : '';
    const error = new Error(`GET ${url} returned ${response.status}${detail}`);
    error.status = response.status;
    throw error;
  }
  if (indexless) {
    throw new Error(`Expected no query index for indexless locale, but ${url} returned 200`);
  }
  return {
    query: await response.json(),
    available: true,
    status: response.status,
  };
}

function normalizePath(path) {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const normalized = withLeadingSlash
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '');
  return normalized || '/';
}

function sourceUrl(origin, path) {
  return `${origin}${normalizePath(path)}`;
}

function isQueryIndex(resource) {
  return /\/query-index(?:\.json)?$/.test(normalizePath(resource.path));
}

function isExtensionlessDocument(resource) {
  const name = resource.path.replace(/\/$/, '').split('/').pop();
  return Boolean(name) && !name.includes('.');
}

function isRedirect(resource, surface) {
  return Boolean(resource[`${surface}ConfigRedirectLocation`]);
}

function getAttribute(tag, name) {
  const doubleQuoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  if (doubleQuoted) return doubleQuoted[1];
  const singleQuoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, 'i'));
  return singleQuoted ? singleQuoted[1] : '';
}

function readRobots(html) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  const robots = metas.find((tag) => getAttribute(tag, 'name').toLowerCase() === 'robots');
  return robots ? getAttribute(robots, 'content') : '';
}

async function inspectPages(resources, origin, concurrency = 16) {
  const inspected = [];
  for (let index = 0; index < resources.length; index += concurrency) {
    const batch = resources.slice(index, index + concurrency);
    const results = await Promise.all(batch.map(async ({ path }) => {
      try {
        const response = await fetch(`${origin}${path}`, { redirect: 'follow' });
        const html = await response.text();
        return {
          path,
          status: response.status,
          finalUrl: response.url,
          redirected: response.redirected,
          robots: readRobots(html),
        };
      } catch (error) {
        return {
          path,
          status: 0,
          redirected: false,
          robots: '',
          error: error.message,
        };
      }
    }));
    inspected.push(...results);
  }
  return inspected;
}

async function startStatusJob(options, headers) {
  const endpoint = `https://admin.hlx.page/status/${options.sourceOrg}/${options.sourceRepo}/${options.sourceBranch}/${options.locale}/*`;
  return fetchJson(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      select: ['preview', 'live'],
      paths: [`/${options.locale}/*`],
    }),
  });
}

async function waitForJob(url, headers, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const job = await fetchJson(url, { headers });
    if (job.state === 'stopped') return job;
    if (job.state === 'failed') throw new Error(`Bulk-status job failed: ${url}`);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 1000));
  }
  throw new Error(`Bulk-status job did not finish within ${timeoutMs}ms`);
}

async function listDestinationDocuments(options, headers) {
  const queue = [options.locale];
  const seen = new Set();
  const documents = [];

  while (queue.length) {
    const batch = queue.splice(0, 12).filter((path) => !seen.has(path));
    batch.forEach((path) => seen.add(path));

    const listings = await Promise.all(batch.map(async (path) => {
      const url = `https://admin.da.live/list/${options.destOrg}/${options.destRepo}/${path}`;
      const response = await fetch(url, { headers });
      if (response.status === 404) return [];
      if (!response.ok) {
        const body = await response.text();
        const error = new Error(`GET ${url} returned ${response.status}: ${body.slice(0, 500)}`);
        error.status = response.status;
        throw error;
      }
      return response.json();
    }));

    listings.flat().forEach((item) => {
      const prefix = `/${options.destOrg}/${options.destRepo}/`;
      const relative = item.path.startsWith(prefix) ? item.path.slice(prefix.length) : item.path;
      if (item.ext === 'html') documents.push(`/${relative.replace(/\.html$/, '')}`);
      else if (!item.ext) queue.push(relative);
    });
  }

  return new Set(documents.map(normalizePath));
}

function groupPaths(paths) {
  const groups = {
    webviews: [],
    fragments: [],
    navFooter: [],
    other: [],
  };
  paths.forEach((path) => {
    if (path.includes('/webview/')) groups.webviews.push(path);
    else if (path.includes('/fragments/')) groups.fragments.push(path);
    else if (/\/(nav|footer)$/.test(path)) groups.navFooter.push(path);
    else groups.other.push(path);
  });
  return groups;
}

function uniqueResources(resources) {
  const byPath = new Map();
  resources.forEach((resource) => {
    if (!resource.path) return;
    const path = normalizePath(resource.path);
    byPath.set(path, { ...(byPath.get(path) || {}), ...resource, path });
  });
  return [...byPath.values()];
}

function inspectionFor(resource, inspections, origin) {
  const path = normalizePath(resource.path);
  const inspected = inspections.get(path) || {
    path,
    status: 0,
    redirected: false,
    robots: '',
    error: 'No inspection result was returned',
  };
  return {
    ...inspected,
    path,
    url: sourceUrl(origin, path),
  };
}

function exclusionForResource(resource, liveOrigin, previewOrigin) {
  const path = normalizePath(resource.path);
  const published = Boolean(resource.publishLastModified);
  const surface = published ? 'live' : 'preview';
  const origin = published ? liveOrigin : previewOrigin;
  let reason = 'not_published';

  if (isQueryIndex(resource)) reason = 'query_index';
  else if (isRedirect(resource, 'publish') || isRedirect(resource, 'preview')) reason = 'redirect';
  else if (!isExtensionlessDocument(resource)) reason = 'unsupported_resource';
  else if (resource.previewLastModified) reason = 'preview_only';

  const redirect = resource.publishConfigRedirectLocation
    || resource.previewConfigRedirectLocation;
  return {
    path,
    url: sourceUrl(origin, path),
    reason,
    surface,
    ...(redirect ? { redirect } : {}),
  };
}

function isNonIndexedCandidate(inspection, indexless) {
  return inspection.status === 200
    && !inspection.redirected
    && (indexless || /noindex/i.test(inspection.robots));
}

function createLocaleReport({
  options,
  resources,
  query,
  destinationDocuments,
  publishedInspection,
  previewInspection,
}) {
  const liveOrigin = options.liveOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.live`;
  const previewOrigin = options.previewOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.page`;
  const queryIndex = options.queryIndex
    ? options.queryIndex.replaceAll('{locale}', options.locale)
    : `${liveOrigin}/${options.locale}/query-index.json?limit=-1`;
  const indexless = Boolean(options.indexless);
  const inventory = uniqueResources(resources);
  const queryPaths = [...new Set((query.data || [])
    .filter(({ path }) => path)
    .map(({ path }) => normalizePath(path)))]
    .sort((a, b) => a.localeCompare(b));
  const queryPathSet = new Set(queryPaths);
  const destinationPathSet = new Set([...destinationDocuments].map(normalizePath));
  const documents = inventory.filter((resource) => (
    isExtensionlessDocument(resource) && !isQueryIndex(resource)
  ));
  const publishedDocuments = documents.filter((resource) => (
    resource.publishLastModified && !isRedirect(resource, 'publish')
  ));
  const previewDocuments = documents.filter((resource) => (
    resource.previewLastModified && !isRedirect(resource, 'preview')
  ));
  const publishedMissing = publishedDocuments.filter(({ path }) => !queryPathSet.has(path));
  const previewOnlyMissing = previewDocuments.filter((resource) => (
    !resource.publishLastModified && !queryPathSet.has(resource.path)
  ));
  const publishedInspectionByPath = new Map(publishedInspection
    .map((item) => [normalizePath(item.path), item]));
  const previewInspectionByPath = new Map(previewInspection
    .map((item) => [normalizePath(item.path), item]));
  const inspectedPublished = publishedMissing
    .map((resource) => inspectionFor(resource, publishedInspectionByPath, liveOrigin));
  const inspectedPreview = previewOnlyMissing
    .map((resource) => inspectionFor(resource, previewInspectionByPath, previewOrigin));

  const indexed = queryPaths.map((path) => ({
    path,
    url: sourceUrl(liveOrigin, path),
    alreadyInDA: destinationPathSet.has(path),
  }));
  const nonIndexed = inspectedPublished
    .filter((inspection) => isNonIndexedCandidate(inspection, indexless))
    .map((item) => ({
      ...item,
      alreadyInDA: destinationPathSet.has(item.path),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const publishedExclusions = inspectedPublished
    .filter((inspection) => !isNonIndexedCandidate(inspection, indexless))
    .map((item) => {
      let reason = 'non_200';
      if (item.redirected) reason = 'redirect';
      else if (item.status === 200) reason = 'not_noindex';
      return {
        ...item,
        reason,
        surface: 'live',
      };
    });
  const previewExclusions = inspectedPreview.map((item) => ({
    ...item,
    reason: 'preview_only',
    surface: 'preview',
  }));
  const handledPaths = new Set([
    ...queryPaths,
    ...publishedMissing.map(({ path }) => path),
    ...previewOnlyMissing.map(({ path }) => path),
  ]);
  const resourceExclusions = inventory
    .filter(({ path }) => !handledPaths.has(path))
    .map((resource) => exclusionForResource(resource, liveOrigin, previewOrigin));
  const exclusions = [
    ...publishedExclusions,
    ...previewExclusions,
    ...resourceExclusions,
  ].sort((a, b) => a.reason.localeCompare(b.reason) || a.path.localeCompare(b.path));
  const exclusionCounts = exclusions.reduce((counts, { reason }) => ({
    ...counts,
    [reason]: (counts[reason] || 0) + 1,
  }), {});
  const importCandidates = [...indexed, ...nonIndexed];
  const alreadyInDA = importCandidates.filter((item) => item.alreadyInDA);
  const recommendedPaths = nonIndexed.map(({ path }) => path);
  const groups = groupPaths(recommendedPaths);

  return {
    locale: options.locale,
    source: {
      org: options.sourceOrg,
      repo: options.sourceRepo,
      branch: options.sourceBranch,
      liveOrigin,
      previewOrigin,
      queryIndex,
      queryIndexAvailable: options.queryIndexAvailable !== false,
      indexless,
    },
    destination: {
      org: options.destOrg,
      repo: options.destRepo,
      existingPathsAreImportCandidates: true,
    },
    counts: {
      resources: inventory.length,
      indexed: indexed.length,
      nonIndexed: nonIndexed.length,
      exclusions: exclusions.length,
      importCandidates: importCandidates.length,
      alreadyInDA: alreadyInDA.length,
      indexedAlreadyInDA: indexed.filter(({ alreadyInDA: exists }) => exists).length,
      nonIndexedAlreadyInDA: nonIndexed.filter(({ alreadyInDA: exists }) => exists).length,
      publishedDocuments: publishedDocuments.length,
      previewDocuments: previewDocuments.length,
      publishedMissingFromIndex: publishedMissing.length,
      publishedNoindex: inspectedPublished.filter(({ status, redirected, robots }) => (
        status === 200 && !redirected && /noindex/i.test(robots)
      )).length,
      recommended: nonIndexed.length,
      previewOnly: previewOnlyMissing.length,
      previewOnlyNoindex: inspectedPreview.filter(({ status, robots }) => (
        status === 200 && /noindex/i.test(robots)
      )).length,
      failedPublished: inspectedPublished.filter(({ status }) => status !== 200).length,
    },
    exclusionCounts,
    groupCounts: Object.fromEntries(Object.entries(groups)
      .map(([name, paths]) => [name, paths.length])),
    indexed,
    indexedPaths: indexed.map(({ path }) => path),
    indexedUrls: indexed.map(({ url }) => url),
    nonIndexed,
    nonIndexedPaths: recommendedPaths,
    nonIndexedUrls: nonIndexed.map(({ url }) => url),
    exclusions,
    recommendedPaths,
    recommendedUrls: nonIndexed.map(({ url }) => url),
    alreadyInDA: alreadyInDA.map(({ path }) => path).sort(),
    previewOnly: inspectedPreview.sort((a, b) => a.path.localeCompare(b.path)),
    publishedNonNoindex: inspectedPublished
      .filter(({ status, redirected, robots }) => (
        status === 200 && !redirected && !/noindex/i.test(robots)
      ))
      .sort((a, b) => a.path.localeCompare(b.path)),
    failedPublished: inspectedPublished
      .filter(({ status }) => status !== 200)
      .sort((a, b) => a.path.localeCompare(b.path)),
  };
}

function formatCandidate({ url, alreadyInDA }) {
  return `${url}${alreadyInDA ? ' [already in DA; overwrite allowed]' : ''}`;
}

function formatExclusion(exclusion) {
  const status = exclusion.status === undefined ? '' : ` [status ${exclusion.status}]`;
  const redirectTarget = exclusion.redirect
    || (exclusion.redirected ? exclusion.finalUrl : '');
  const redirect = redirectTarget ? ` -> ${redirectTarget}` : '';
  const error = exclusion.error ? ` [${exclusion.error}]` : '';
  return `[${exclusion.reason}] ${exclusion.url}${status}${redirect}${error}`;
}

function renderLocaleReport(report) {
  const reasonSummary = Object.entries(report.exclusionCounts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([reason, count]) => `  ${reason}: ${count}`);
  return [
    `Locale: ${report.locale}`,
    `Query index: ${report.source.queryIndexAvailable ? 'available' : 'absent (indexless mode)'}`,
    `Inventory resources: ${report.counts.resources}`,
    `Indexed import candidates: ${report.counts.indexed}`,
    `Non-indexed import candidates: ${report.counts.nonIndexed}`,
    `Excluded routes/resources: ${report.counts.exclusions}`,
    `Total import candidates: ${report.counts.importCandidates}`,
    `Already in DA (informational; overwrite allowed): ${report.counts.alreadyInDA}`,
    `Published documents missing from index: ${report.counts.publishedMissingFromIndex}`,
    `Preview-only documents missing from index: ${report.counts.previewOnly}`,
    `Broken/non-200 published URLs: ${report.counts.failedPublished}`,
    '',
    'Exclusions by reason:',
    ...(reasonSummary.length ? reasonSummary : ['  none: 0']),
    '',
    `Indexed URLs (${report.indexed.length}):`,
    ...report.indexed.map(formatCandidate),
    '',
    `Non-indexed URLs (${report.nonIndexed.length}):`,
    ...report.nonIndexed.map(formatCandidate),
    '',
    `Exclusions (${report.exclusions.length}):`,
    ...report.exclusions.map(formatExclusion),
  ].join('\n');
}

function buildSummary(locales, reports, failures) {
  const counts = reports.reduce((summary, report) => ({
    indexed: summary.indexed + report.counts.indexed,
    nonIndexed: summary.nonIndexed + report.counts.nonIndexed,
    exclusions: summary.exclusions + report.counts.exclusions,
    importCandidates: summary.importCandidates + report.counts.importCandidates,
    alreadyInDA: summary.alreadyInDA + report.counts.alreadyInDA,
  }), {
    indexed: 0,
    nonIndexed: 0,
    exclusions: 0,
    importCandidates: 0,
    alreadyInDA: 0,
  });
  const exclusionsByReason = reports
    .flatMap(({ exclusions }) => exclusions)
    .reduce((summary, { reason }) => ({
      ...summary,
      [reason]: (summary[reason] || 0) + 1,
    }), {});
  return {
    localesRequested: locales.length,
    localesSucceeded: reports.length,
    localesFailed: failures.length,
    counts,
    exclusionsByReason,
  };
}

function renderSummary(result) {
  const reasonSummary = Object.entries(result.summary.exclusionsByReason)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([reason, count]) => `  ${reason}: ${count}`);
  return [
    'Multi-locale summary',
    `Locales requested: ${result.summary.localesRequested}`,
    `Locales succeeded: ${result.summary.localesSucceeded}`,
    `Locales failed: ${result.summary.localesFailed}`,
    `Indexed import candidates: ${result.summary.counts.indexed}`,
    `Non-indexed import candidates: ${result.summary.counts.nonIndexed}`,
    `Excluded routes/resources: ${result.summary.counts.exclusions}`,
    `Total import candidates: ${result.summary.counts.importCandidates}`,
    `Already in DA (informational; overwrite allowed): ${result.summary.counts.alreadyInDA}`,
    '',
    'Exclusions by reason:',
    ...(reasonSummary.length ? reasonSummary : ['  none: 0']),
    ...(result.failures.length ? [
      '',
      'Failed locales:',
      ...result.failures.map(({ locale, error }) => `  ${locale}: ${error}`),
    ] : []),
  ].join('\n');
}

function renderBatchReport(result) {
  if (result.locales.length === 1 && result.reports.length === 1 && !result.failures.length) {
    return renderLocaleReport(result.reports[0]);
  }
  return [
    renderSummary(result),
    ...result.reports.map((report) => `\n=== ${report.locale} ===\n${renderLocaleReport(report)}`),
  ].join('\n');
}

async function analyzeLocale(options, headers) {
  const liveOrigin = options.liveOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.live`;
  const previewOrigin = options.previewOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.page`;
  const queryIndex = options.queryIndex
    ? options.queryIndex.replaceAll('{locale}', options.locale)
    : `${liveOrigin}/${options.locale}/query-index.json?limit=-1`;
  const [statusJob, queryResult] = await Promise.all([
    startStatusJob(options, headers),
    fetchQueryIndex(queryIndex, options.indexless),
  ]);
  const { query } = queryResult;
  const jobUrl = statusJob.links?.self;
  if (!jobUrl) throw new Error('Bulk-status response did not include links.self');
  await waitForJob(jobUrl, headers, options.timeoutMs);

  const [details, destinationDocuments] = await Promise.all([
    fetchJson(`${jobUrl}/details`, { headers }),
    listDestinationDocuments(options, headers),
  ]);
  if (details.data?.phase !== 'completed') {
    throw new Error(`Bulk-status job stopped without completing (phase: ${details.data?.phase})`);
  }

  const resources = details.data.resources || [];
  const queryPaths = new Set((query.data || [])
    .filter(({ path }) => path)
    .map(({ path }) => normalizePath(path)));
  const documents = uniqueResources(resources).filter((resource) => (
    isExtensionlessDocument(resource) && !isQueryIndex(resource)
  ));
  const publishedMissing = documents.filter((resource) => (
    resource.publishLastModified
    && !isRedirect(resource, 'publish')
    && !queryPaths.has(resource.path)
  ));
  const previewOnlyMissing = documents.filter((resource) => (
    resource.previewLastModified
    && !resource.publishLastModified
    && !isRedirect(resource, 'preview')
    && !queryPaths.has(resource.path)
  ));
  const [publishedInspection, previewInspection] = await Promise.all([
    inspectPages(publishedMissing, liveOrigin),
    inspectPages(previewOnlyMissing, previewOrigin),
  ]);

  return createLocaleReport({
    options: {
      ...options,
      liveOrigin,
      previewOrigin,
      queryIndex,
      queryIndexAvailable: queryResult.available,
    },
    resources,
    query,
    destinationDocuments,
    publishedInspection,
    previewInspection,
  });
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => run());
  await Promise.all(workers);
  return results;
}

async function analyzeLocales(options) {
  const token = await readToken(options);
  const headers = { Authorization: `Bearer ${token}` };
  let authenticationFailure;
  const outcomes = await mapWithConcurrency(
    options.locales,
    options.localeConcurrency,
    async (locale) => {
      if (authenticationFailure) {
        return {
          failure: {
            locale,
            error: `Skipped after authentication failure in ${authenticationFailure.locale}`,
            status: authenticationFailure.status,
          },
        };
      }
      try {
        return {
          report: await analyzeLocale({
            ...options,
            locale,
            indexless: options.indexlessLocales.includes(locale),
          }, headers),
        };
      } catch (error) {
        const failure = { locale, error: error.message, status: error.status };
        if ([401, 403].includes(error.status)) authenticationFailure = failure;
        return { failure };
      }
    },
  );
  const reports = outcomes.flatMap(({ report }) => (report ? [report] : []));
  const failures = outcomes.flatMap(({ failure }) => (failure ? [failure] : []));
  return {
    locales: options.locales,
    summary: buildSummary(options.locales, reports, failures),
    reports,
    failures,
  };
}

function outputForFormat(result, format) {
  if (format === 'json') {
    const output = result.locales.length === 1 && result.reports.length === 1
      && !result.failures.length ? result.reports[0] : result;
    return JSON.stringify(output, null, 2);
  }
  if (format === 'urls') {
    return result.reports.flatMap(({ nonIndexedUrls }) => nonIndexedUrls).join('\n');
  }
  return renderBatchReport(result);
}

async function writeReports(result, options) {
  if (!options.outputDir) return;
  const outputDir = resolve(options.outputDir);
  await mkdir(outputDir, { recursive: true });
  const extension = options.format === 'json' ? 'json' : 'txt';
  await Promise.all(result.reports.map(async (report) => {
    let content = renderLocaleReport(report);
    if (options.format === 'json') content = JSON.stringify(report, null, 2);
    else if (options.format === 'urls') content = report.nonIndexedUrls.join('\n');
    const suffix = options.format === 'urls' ? 'non-indexed-urls' : 'import-audit';
    await writeFile(resolve(outputDir, `${report.locale}-${suffix}.${extension}`), `${content}\n`);
  }));
  await Promise.all(result.failures.map(({ locale, error }) => (
    writeFile(resolve(outputDir, `${locale}-import-audit-error.txt`), `${error}\n`)
  )));
  if (result.locales.length > 1) {
    let content = renderSummary(result);
    if (options.format === 'json') {
      content = JSON.stringify({ summary: result.summary, failures: result.failures }, null, 2);
    } else if (options.format === 'urls') {
      content = result.reports.flatMap(({ nonIndexedUrls }) => nonIndexedUrls).join('\n');
    }
    const suffix = options.format === 'urls' ? 'non-indexed-urls' : 'summary';
    await writeFile(resolve(outputDir, `multi-locale-${suffix}.${extension}`), `${content}\n`);
  }
}

async function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(usage());
    return;
  }
  const result = await analyzeLocales(options);
  await writeReports(result, options);
  console.log(outputForFormat(result, options.format));
  if (result.failures.length) process.exitCode = 1;
}

const executableUrl = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === executableUrl) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

export {
  buildSummary,
  createLocaleReport,
  outputForFormat,
  parseArgs,
  renderBatchReport,
  renderLocaleReport,
  writeReports,
};
