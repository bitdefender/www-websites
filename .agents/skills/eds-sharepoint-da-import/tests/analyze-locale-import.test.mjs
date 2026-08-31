import assert from 'node:assert/strict';
import {
  mkdtemp, readFile, readdir, rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

/* eslint-disable import/extensions */
import {
  buildSummary,
  createLocaleReport,
  parseArgs,
  renderLocaleReport,
  writeReports,
} from '../scripts/analyze-locale-import.mjs';

function createTestReport(locale = 'ro-ro') {
  const liveOrigin = 'https://main--www-websites--bitdefender.aem.live';
  const previewOrigin = 'https://main--www-websites--bitdefender.aem.page';
  const path = (name) => `/${locale}/${name}`;
  const published = (name, extra = {}) => ({
    path: path(name),
    publishLastModified: '2026-08-27T10:00:00Z',
    ...extra,
  });
  const preview = (name) => ({
    path: path(name),
    previewLastModified: '2026-08-27T10:00:00Z',
  });
  const inspected = (name, extra = {}) => ({
    path: path(name),
    status: 200,
    finalUrl: `${liveOrigin}${path(name)}`,
    redirected: false,
    robots: '',
    ...extra,
  });

  return createLocaleReport({
    options: {
      locale,
      sourceOrg: 'bitdefender',
      sourceRepo: 'www-websites',
      sourceBranch: 'main',
      destOrg: 'bitdefender',
      destRepo: 'www-doc-authoring',
      liveOrigin,
      previewOrigin,
    },
    resources: [
      published('indexed'),
      published('indexed-existing'),
      published('noindex'),
      published('noindex-existing'),
      published('ordinary'),
      published('broken'),
      published('observed-redirect'),
      preview('preview-only'),
      published('configured-redirect', { publishConfigRedirectLocation: `/${locale}/target` }),
      published('query-index'),
      published('image.png'),
      { path: path('unavailable') },
    ],
    query: {
      data: [
        { path: path('indexed') },
        { path: path('indexed-existing') },
      ],
    },
    destinationDocuments: new Set([
      path('indexed-existing'),
      path('noindex-existing'),
    ]),
    publishedInspection: [
      inspected('noindex', { robots: 'noindex, follow' }),
      inspected('noindex-existing', { robots: 'noindex' }),
      inspected('ordinary', { robots: 'index, follow' }),
      inspected('broken', { status: 404 }),
      inspected('observed-redirect', {
        redirected: true,
        finalUrl: `${liveOrigin}${path('redirect-target')}`,
        robots: 'noindex',
      }),
    ],
    previewInspection: [
      {
        ...inspected('preview-only', { robots: 'noindex' }),
        finalUrl: `${previewOrigin}${path('preview-only')}`,
      },
    ],
  });
}

test('parses, deduplicates, and preserves multiple locale routes', () => {
  const options = parseArgs([
    '--locales', 'ro-ro,en-us,ro-ro',
    '--locale', 'de-de',
    '--locale-concurrency', '3',
  ]);

  assert.deepEqual(options.locales, ['ro-ro', 'en-us', 'de-de']);
  assert.equal(options.localeConcurrency, 3);
});

test('requires a locale placeholder for multi-locale query-index overrides', () => {
  assert.throws(() => parseArgs([
    '--locales', 'ro-ro,en-us',
    '--query-index', 'https://example.com/query-index.json',
  ]), /must include \{locale\}/);
});

test('supports explicit indexless locales in single and mixed batches', () => {
  assert.deepEqual(
    parseArgs(['--locale', 'el-gr', '--indexless']).indexlessLocales,
    ['el-gr'],
  );
  assert.deepEqual(
    parseArgs([
      '--locales', 'el-gr,ro-ro',
      '--indexless-locales', 'el-gr',
    ]).indexlessLocales,
    ['el-gr'],
  );
  assert.throws(() => parseArgs([
    '--locale', 'ro-ro',
    '--indexless-locales', 'el-gr',
  ]), /is not in the requested locale set/);
});

test('keeps existing DA paths as candidates and classifies exclusions', () => {
  const report = createTestReport();

  assert.equal(report.counts.indexed, 2);
  assert.equal(report.counts.nonIndexed, 2);
  assert.equal(report.counts.importCandidates, 4);
  assert.equal(report.counts.alreadyInDA, 2);
  assert.equal(report.indexed.find(({ path }) => path.endsWith('indexed-existing')).alreadyInDA, true);
  assert.equal(report.nonIndexed.find(({ path }) => path.endsWith('noindex-existing')).alreadyInDA, true);
  assert.deepEqual(new Set(report.exclusions.map(({ reason }) => reason)), new Set([
    'non_200',
    'not_noindex',
    'not_published',
    'preview_only',
    'query_index',
    'redirect',
    'unsupported_resource',
  ]));
  assert.equal(report.exclusions.some(({ reason }) => reason === 'already_in_da'), false);

  const rendered = renderLocaleReport(report);
  assert.match(rendered, /Indexed URLs \(2\):/);
  assert.match(rendered, /Non-indexed URLs \(2\):/);
  assert.match(rendered, /Exclusions \(8\):/);
  assert.match(rendered, /already in DA; overwrite allowed/);
  assert.match(rendered, /observed-redirect.*redirect-target/);
});

test('treats every published 200 page as a candidate in indexless mode', () => {
  const liveOrigin = 'https://main--www-websites--bitdefender.aem.live';
  const report = createLocaleReport({
    options: {
      locale: 'el-gr',
      sourceOrg: 'bitdefender',
      sourceRepo: 'www-websites',
      sourceBranch: 'main',
      destOrg: 'bitdefender',
      destRepo: 'www-doc-authoring',
      liveOrigin,
      previewOrigin: 'https://main--www-websites--bitdefender.aem.page',
      indexless: true,
      queryIndexAvailable: false,
    },
    resources: [
      { path: '/el-gr/ordinary', publishLastModified: '2026-08-27T10:00:00Z' },
      { path: '/el-gr/noindex', publishLastModified: '2026-08-27T10:00:00Z' },
      { path: '/el-gr/broken', publishLastModified: '2026-08-27T10:00:00Z' },
    ],
    query: { data: [] },
    destinationDocuments: new Set(),
    publishedInspection: [
      {
        path: '/el-gr/ordinary',
        status: 200,
        finalUrl: `${liveOrigin}/el-gr/ordinary`,
        redirected: false,
        robots: 'index, follow',
      },
      {
        path: '/el-gr/noindex',
        status: 200,
        finalUrl: `${liveOrigin}/el-gr/noindex`,
        redirected: false,
        robots: 'noindex',
      },
      {
        path: '/el-gr/broken',
        status: 404,
        finalUrl: `${liveOrigin}/el-gr/broken`,
        redirected: false,
        robots: '',
      },
    ],
    previewInspection: [],
  });

  assert.equal(report.source.queryIndexAvailable, false);
  assert.deepEqual(report.nonIndexedPaths, ['/el-gr/noindex', '/el-gr/ordinary']);
  assert.deepEqual(report.exclusions.map(({ reason }) => reason), ['non_200']);
  assert.equal(report.exclusions.some(({ reason }) => reason === 'not_noindex'), false);
  assert.match(renderLocaleReport(report), /Query index: absent \(indexless mode\)/);
});

test('builds an aggregate summary and writes isolated locale reports', async (context) => {
  const reports = [createTestReport('ro-ro'), createTestReport('en-us')];
  const locales = reports.map(({ locale }) => locale);
  const failures = [];
  const summary = buildSummary(locales, reports, failures);
  const outputDir = await mkdtemp(join(tmpdir(), 'eds-locale-import-'));
  context.after(() => rm(outputDir, { recursive: true, force: true }));

  assert.equal(summary.localesSucceeded, 2);
  assert.equal(summary.counts.indexed, 4);
  assert.equal(summary.counts.nonIndexed, 4);
  await writeReports({
    locales, reports, failures, summary,
  }, {
    outputDir,
    format: 'report',
  });

  assert.deepEqual((await readdir(outputDir)).sort(), [
    'en-us-import-audit.txt',
    'multi-locale-summary.txt',
    'ro-ro-import-audit.txt',
  ]);
  assert.match(await readFile(join(outputDir, 'ro-ro-import-audit.txt'), 'utf8'), /Locale: ro-ro/);
  assert.match(await readFile(join(outputDir, 'multi-locale-summary.txt'), 'utf8'), /Locales succeeded: 2/);
});
