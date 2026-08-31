---
name: eds-sharepoint-da-import
description: Inventory and migrate one or many locale routes from a SharePoint-backed AEM Edge Delivery Services site into DA, including indexed pages, published pages omitted from query indexes, and locales with no query index. Use for multi-locale SharePoint-to-DA imports, verified post-import Confluence documentation, per-locale audit reports, direct DA Source API uploads, and paste-ready URL batches.
---

# SharePoint-backed EDS to DA import

Use this skill for the Bitdefender migration from the SharePoint-backed
`bitdefender/www-websites` project to `bitdefender/www-doc-authoring` in DA.
It supports one or many exact locale route IDs (`ro-ro`, `en-us`, and so on).
Country names are not route IDs; resolve the requested countries to exact
locale routes before analysis, and ask only when that mapping is ambiguous.

The source SharePoint library is read through the existing AEM preview/live
rendering pipeline. Never edit, move, or delete the SharePoint source as part
of this workflow.

## Defaults

- Source project: `bitdefender/www-websites`, branch `main`
- Destination DA project: `bitdefender/www-doc-authoring`
- Live origin: `https://main--www-websites--bitdefender.aem.live`
- Preview origin: `https://main--www-websites--bitdefender.aem.page`
- Locale query index: `/<locale>/query-index.json?limit=-1`

Allow the user to override any of these values. Do not silently reuse the
defaults for an unrelated project.

## Required supporting guidance

Before using authenticated DA or AEM Admin APIs, load the available
`da-auth` and `da-content` skills. Load the browser-control skill when the
user explicitly requests the DA Import UI, when the Source API path is
unavailable, or when the post-import Confluence documentation step applies.

## Workflow

### 1. Establish scope

Resolve:

- one or more exact locale route IDs, preserving the user's order and removing
  duplicates;
- discovery only, paste-ready URLs, or an authorized import;
- any source, destination, or origin overrides.

Treat imports as destination mutations. Discovery, report generation, and URL
generation are read-only with respect to AEM and DA and must not start an
import. For multiple locales, analyze every locale first and present one
aggregate go/no-go checkpoint before any mutation.

### 2. Run the deterministic analyzer

Single locale:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro --format report
```

Multiple locales can be comma-separated or supplied with repeated `--locale`
arguments:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locales ro-ro,en-us,de-de --format report

node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro --locale en-us --format json
```

For a locale that is expected to have no query index, use explicit indexless
mode. It verifies that the query-index URL returns 404, treats the indexed set
as empty, and evaluates every published page as non-indexed:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale el-gr --indexless --format report
```

In a mixed batch, use `--indexless-locales el-gr,xx-yy`. Do not silently
convert a query-index failure into indexless mode: an unexpected missing index
remains a stop condition.

Use `--output-dir <path>` when separate report files are required. Report and
JSON modes write `<locale>-import-audit.txt` or `.json`, plus
`multi-locale-summary.txt` or `.json`. URL mode writes one
`<locale>-non-indexed-urls.txt` file and a combined multi-locale URL file.

`--format urls` remains a paste-ready list of non-indexed follow-up URLs only.
Use report or JSON mode when indexed URLs and exclusions are needed. The
default locale concurrency is two and the maximum is five. Do not raise it
merely because the user requests many locales.

For a custom query-index URL with multiple locales, require a `{locale}`
placeholder:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locales ro-ro,en-us \
  --query-index 'https://example.com/{locale}/query-index.json?limit=-1'
```

The script:

1. Starts one read-only AEM bulk-status job per locale for `/<locale>/*` using
   the known-working `preview` and `live` inventory shape.
2. Loads each locale query index, or verifies its absence for an explicitly
   indexless locale, and recursively lists the matching DA locale.
3. Inspects rendered `robots` metadata for published documents missing from
   the query index.
4. Produces an isolated report for every successful locale and an aggregate
   summary. A failed locale is reported separately and never silently omitted.

The project currently rejects bulk-status requests that add `edit` or
`pathsOnly`; keep the analyzer's known-working `preview`/`live` request shape
unless the API behavior is re-verified.

### 3. Apply the report contract

Every locale report must contain these complete lists, not just counts:

- **Indexed:** query-index page URLs. These are import candidates.
- **Non-indexed:** published, HTTP 200 page URLs missing from the query index.
  For a normal locale they must also render `robots:noindex`; for an explicitly
  indexless locale, every published HTTP-200 non-redirect page qualifies.
- **Exclusions:** every other inventoried route or resource, with one explicit
  reason and relevant HTTP status or redirect target.

Stable exclusion reasons are:

- `preview_only` — available only on preview;
- `non_200` — the live route did not return HTTP 200, including 404;
- `not_noindex` — on a normal indexed locale, a published route omitted from
  the index does not render `robots:noindex`; this reason does not apply in
  indexless mode;
- `redirect` — configured or observed redirect;
- `query_index` — the query-index control document itself, not a page listed
  inside that index;
- `unsupported_resource` — media, sheet, or other non-page resource;
- `not_published` — no usable live or preview document state.

Report destination presence as `alreadyInDA` state on indexed and non-indexed
candidates. It is informational, never an exclusion: matching DA paths remain
eligible and will be overwritten if the user authorizes the import.

### 4. Present the go/no-go checkpoint

For each locale and in the aggregate, report:

- indexed document count;
- non-indexed import-candidate count;
- exclusion count grouped by reason;
- total import-candidate count;
- how many candidates already exist in DA and would be overwritten;
- any locale analysis failures.

Recommend importing indexed and non-indexed candidates. Exclude all exclusion
categories by default. An excluded route requires separate, explicit user
approval before import, especially preview-only paths containing `copy`,
`old`, `modified`, `test`, or `sandbox`, 404 pages, and redirects.

Ask for one go/no-go decision covering the displayed locale set and candidate
counts. The user may authorize all locales or a named subset. If the user asks
only for reports or URLs, do not import.

### 5. Import the authorized locale batch

Use the authenticated DA Source API by default. Process locales independently
and keep per-locale results. Use at most five page workers within the active
locale; process locale mutations sequentially unless the user explicitly asks
for greater concurrency.

For each approved indexed and non-indexed page URL:

1. Fetch its `.md` representation and convert it with the same md2da conversion
   used by DA Import (`mdToDocDom` followed by `docDomToAemHtml`). Upload the
   converted EDS HTML, not the source markdown. If the fetched representation
   is `/path/index.md`, write `/path/index.html`; if it is `/path.md`, write
   `/path.html`.
2. Do not discover linked pages or assets by default. The reusable uploader
   requires `--include-linked` to opt into linked dependencies. When enabled,
   linked fragment pages must remain within the active locale; a cross-locale
   linked page is an error, not an import candidate. Preserve binary content
   types and file extensions.
3. Upload with a multipart `data` field using `PUT` to
   `https://admin.da.live/source/{destination-org}/{destination-site}{path}`.
   Page routes map to `.html`, except index documents, which map to
   `/index.html`; asset routes keep their original extension.
4. Keep existing DA paths in the batch. A matching `PUT` is an intentional
   overwrite, not a merge. Record whether each destination existed beforehand.
5. Record every source URL, destination path, status, redirect, and error.
   Retry only transient `429`/`5xx` responses and never retry a failed mutation
   blindly.

Direct Source API writes preserve original locale paths and do not preview or
publish content. Follow the `da-content` skill for the exact HTML and Source
API contract.

Use the reusable uploader at
`.agents/skills/eds-sharepoint-da-import/scripts/import-locale.mjs`; do not
recreate the upload logic ad hoc. It consumes the aggregate analyzer JSON and
the sibling per-locale JSON reports:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/import-locale.mjs \
  --manifest /path/to/multi-locale-summary.json \
  --locales ro-ro,en-us,de-de \
  --output-dir /path/to/import-results
```

Run the same command with `--dry-run` before an authorized mutation. Linked
dependency discovery is disabled unless `--include-linked` is supplied. The
script uses the bundled DA markdown converter, handles canonical trailing-slash
Markdown fallbacks, records per-document results, and writes
`import-results.json` to the output directory. Set `DA_TOKEN` or use
`--token-file`; never print or persist the token. It performs no preview or
publish operation. Before any upload, it aborts if linked pages are present
without the opt-in flag or if a linked page leaves the active locale.

### 6. Manual DA Import UI fallback

Use the UI only when the Source API path is unavailable or the user explicitly
requests it. Run one locale at a time with:

- Query index: `<live-origin>/<locale>/query-index.json?limit=-1`
- Linked content: `Import`
- Production domain: `<live-origin>`
- Organization: destination organization
- Site: destination site

The importer writes documents to original locale paths and cannot apply an
arbitrary destination prefix. Matching paths may be overwritten. After the
indexed batch, paste the approved non-indexed URLs into **By URL**. Report
totals, successes, redirects, errors, and overwritten destinations per locale.
Do not preview or publish unless separately requested.

An indexless locale has no indexed batch. Import its approved non-indexed URLs
through the Source API, or entirely through **By URL** when using the UI.

### 7. Verify and report

After import, rerun the analyzer for the same exact locale set and compare it
with the preflight report. Because existing DA content remains eligible for
overwrite, a clean result does **not** have zero non-indexed candidates.
Instead, verify that every successful destination path is present in DA and
that counts did not shrink unexpectedly. Report per-locale and aggregate
successes, overwrites, redirects, errors, and excluded routes.

Discovery failures are isolated to their locale and must appear in the batch
summary. Never import a failed locale. Authentication failures, destination
mismatches, or unexpected inventory shrinkage stop the entire batch rather
than allowing later locales to continue.

### 8. Update migration documentation after successful verification

When the request includes migration-documentation maintenance, do this only
after step 7 succeeds for the complete authorized locale batch. Do not update
the documentation for a failed or partially verified import.

Use the existing signed-in Chrome session and the project migration page:

`https://bitdefender.atlassian.net/wiki/spaces/WWW/pages/edit-v2/4065427612`

Append one completed locale section per imported locale, matching the existing
`de-de` and `en-us` sections. Each section must include the locale status,
source and DA destination links, import/verification totals, and a three-column
inventory table with:

- `Indexed pages (n)`;
- `Published no-index pages (n)`; and
- `Exclusions (n)`.

The documentation's Exclusions column is page-only: include extensionless page
routes and omit non-page resources such as `.svg`, `.png`, `.jpg`, `.json`, and
other file-extension paths. Recalculate the displayed exclusion count and
summary from the filtered page list without changing the source audit report.
Preserve existing documentation and append the new locale sections at the end.
After pasting, verify that every requested locale heading and table is present
and that the new exclusion columns contain no file-resource rows. Confluence
editing is a separate external mutation: ask for confirmation before clicking
`Update`; if the user asks only to paste, leave the changes unsaved for them to
review and save.

## Invariants

- The SharePoint source remains unchanged.
- DA import may overwrite matching destination paths; never call it a merge.
- Existing DA content is report state, not an exclusion or deduplication rule.
- By default, every page upload must come from the report's indexed or
  non-indexed candidate lists; linked dependency imports require explicit
  opt-in and linked page paths must remain within the active locale.
- Indexless mode must be explicit and must verify that the query index is absent.
- Importing into DA does not preview or publish content.
- Direct Source API uploads use the multipart `data` field and original locale
  paths; they do not preview or publish content.
- Preserve and verify `robots:noindex` metadata before any later publish.
- Never print, persist in project files, or expose the Adobe IMS token.
- Authentication failures, unexpected inventory shrinkage, or a destination
  mismatch are stop conditions; report them instead of guessing.
