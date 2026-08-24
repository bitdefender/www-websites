#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const DEFAULTS = {
  sourceOrg: 'bitdefender',
  sourceRepo: 'www-websites',
  sourceBranch: 'main',
  destOrg: 'bitdefender',
  destRepo: 'www-doc-authoring',
  format: 'report',
  timeoutMs: 120000,
};

function usage() {
  return `Usage:
  node analyze-locale-import.mjs --locale <locale> [options]

Options:
  --source-org <org>       Source AEM organization (default: bitdefender)
  --source-repo <repo>     Source AEM site/repository (default: www-websites)
  --source-branch <branch> Source branch (default: main)
  --dest-org <org>         Destination DA organization (default: bitdefender)
  --dest-repo <repo>       Destination DA site (default: www-doc-authoring)
  --live-origin <url>      Override the source aem.live origin
  --preview-origin <url>   Override the source aem.page origin
  --query-index <url>      Override the locale query-index URL
  --token-file <path>      Override the cached DA token file
  --timeout-ms <number>    Bulk-status timeout (default: 120000)
  --format report|urls|json
  --help

The command is read-only: it inventories source and destination content but
never starts a DA import, preview, or publish operation.`;
}

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  const keys = {
    '--locale': 'locale',
    '--source-org': 'sourceOrg',
    '--source-repo': 'sourceRepo',
    '--source-branch': 'sourceBranch',
    '--dest-org': 'destOrg',
    '--dest-repo': 'destRepo',
    '--live-origin': 'liveOrigin',
    '--preview-origin': 'previewOrigin',
    '--query-index': 'queryIndex',
    '--token-file': 'tokenFile',
    '--timeout-ms': 'timeoutMs',
    '--format': 'format',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help') {
      args.help = true;
      continue;
    }
    const key = keys[arg];
    if (!key) throw new Error(`Unknown option: ${arg}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    args[key] = key === 'timeoutMs' ? Number(value) : value;
    index += 1;
  }

  if (args.help) return args;
  if (!args.locale) throw new Error('--locale is required');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.locale)) {
    throw new Error(`Unsafe locale value: ${args.locale}`);
  }
  if (!['report', 'urls', 'json'].includes(args.format)) {
    throw new Error('--format must be report, urls, or json');
  }
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1000) {
    throw new Error('--timeout-ms must be at least 1000');
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
    throw new Error(`${options.method || 'GET'} ${url} returned ${response.status}${detail}`);
  }
  return response;
}

async function fetchJson(url, options = {}) {
  return (await fetchResponse(url, options)).json();
}

function normalizePath(path) {
  const normalized = path
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '');
  return normalized || '/';
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
          robots: readRobots(html),
        };
      } catch (error) {
        return {
          path,
          status: 0,
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
        throw new Error(`GET ${url} returned ${response.status}: ${body.slice(0, 500)}`);
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

function renderReport(report) {
  const lines = [
    `Locale: ${report.locale}`,
    `Inventory resources: ${report.counts.resources}`,
    `Query-index documents: ${report.counts.indexed}`,
    `Published documents: ${report.counts.publishedDocuments}`,
    `Preview documents: ${report.counts.previewDocuments}`,
    `Published documents missing from index: ${report.counts.publishedMissingFromIndex}`,
    `Published noindex documents: ${report.counts.publishedNoindex}`,
    `Published noindex documents already in DA: ${report.counts.alreadyInDA}`,
    `Recommended missing published noindex documents: ${report.counts.recommended}`,
    `Preview-only documents missing from index: ${report.counts.previewOnly}`,
    `Preview-only noindex documents: ${report.counts.previewOnlyNoindex}`,
    `Broken/non-200 published URLs: ${report.counts.failedPublished}`,
    '',
    'Recommended groups:',
    `  webviews: ${report.groupCounts.webviews}`,
    `  fragments: ${report.groupCounts.fragments}`,
    `  nav/footer: ${report.groupCounts.navFooter}`,
    `  other: ${report.groupCounts.other}`,
    '',
    `Recommended URLs (${report.recommendedUrls.length}):`,
    ...report.recommendedUrls,
  ];
  return lines.join('\n');
}

async function analyze(options) {
  const token = await readToken(options);
  const headers = { Authorization: `Bearer ${token}` };
  const liveOrigin = options.liveOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.live`;
  const previewOrigin = options.previewOrigin
    || `https://${options.sourceBranch}--${options.sourceRepo}--${options.sourceOrg}.aem.page`;
  const queryIndex = options.queryIndex
    || `${liveOrigin}/${options.locale}/query-index.json?limit=-1`;

  const [statusJob, query] = await Promise.all([
    startStatusJob(options, headers),
    fetchJson(queryIndex),
  ]);
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
  const queryPaths = new Set((query.data || []).map(({ path }) => normalizePath(path)));
  const documents = resources.filter(isExtensionlessDocument);
  const publishedDocuments = documents.filter((resource) => (
    resource.publishLastModified && !isRedirect(resource, 'publish')
  ));
  const previewDocuments = documents.filter((resource) => (
    resource.previewLastModified && !isRedirect(resource, 'preview')
  ));
  const publishedMissing = publishedDocuments.filter(({ path }) => !queryPaths.has(normalizePath(path)));
  const previewOnlyMissing = previewDocuments.filter((resource) => (
    !resource.publishLastModified && !queryPaths.has(normalizePath(resource.path))
  ));

  const [publishedInspection, previewInspection] = await Promise.all([
    inspectPages(publishedMissing, liveOrigin),
    inspectPages(previewOnlyMissing, previewOrigin),
  ]);
  const publishedNoindex = publishedInspection.filter(({ status, robots }) => (
    status === 200 && /noindex/i.test(robots)
  ));
  const alreadyInDA = publishedNoindex.filter(({ path }) => destinationDocuments.has(normalizePath(path)));
  const recommended = publishedNoindex
    .filter(({ path }) => !destinationDocuments.has(normalizePath(path)))
    .sort((a, b) => a.path.localeCompare(b.path));
  const recommendedPaths = recommended.map(({ path }) => path);
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
    },
    destination: {
      org: options.destOrg,
      repo: options.destRepo,
    },
    counts: {
      resources: resources.length,
      indexed: queryPaths.size,
      publishedDocuments: publishedDocuments.length,
      previewDocuments: previewDocuments.length,
      publishedMissingFromIndex: publishedMissing.length,
      publishedNoindex: publishedNoindex.length,
      alreadyInDA: alreadyInDA.length,
      recommended: recommended.length,
      previewOnly: previewOnlyMissing.length,
      previewOnlyNoindex: previewInspection.filter(({ status, robots }) => (
        status === 200 && /noindex/i.test(robots)
      )).length,
      failedPublished: publishedInspection.filter(({ status }) => status !== 200).length,
    },
    groupCounts: Object.fromEntries(Object.entries(groups).map(([name, paths]) => [name, paths.length])),
    recommendedPaths,
    recommendedUrls: recommendedPaths.map((path) => `${liveOrigin}${path}`),
    alreadyInDA: alreadyInDA.map(({ path }) => path).sort(),
    previewOnly: previewInspection.sort((a, b) => a.path.localeCompare(b.path)),
    publishedNonNoindex: publishedInspection
      .filter(({ robots }) => !/noindex/i.test(robots))
      .sort((a, b) => a.path.localeCompare(b.path)),
    failedPublished: publishedInspection
      .filter(({ status }) => status !== 200)
      .sort((a, b) => a.path.localeCompare(b.path)),
  };
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    process.exit(0);
  }
  const report = await analyze(options);
  if (options.format === 'json') console.log(JSON.stringify(report, null, 2));
  else if (options.format === 'urls') console.log(report.recommendedUrls.join('\n'));
  else console.log(renderReport(report));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
