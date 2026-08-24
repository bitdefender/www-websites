---
name: eds-sharepoint-da-import
description: Inventory and migrate locale content from a SharePoint-backed AEM Edge Delivery Services site into DA, including published robots:noindex pages omitted from query indexes. Use for locale-by-locale SharePoint-to-DA imports, missing-page discovery, deduplication against DA, direct DA Source API uploads, and paste-ready URL batches.
---

# SharePoint-backed EDS to DA import

Use this skill for the Bitdefender migration from the SharePoint-backed
`bitdefender/www-websites` project to `bitdefender/www-doc-authoring` in DA.
The locale is variable (`ro-ro`, `en-us`, and so on).

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
`da-auth` and `da-content` skills. Load the browser-control skill only when
the user explicitly requests the DA Import UI or the Source API path is
unavailable.

## Workflow

### 1. Establish scope

Resolve the locale and whether the user wants discovery only, a paste-ready
URL list, or an authorized import. Treat imports as destination mutations.
Discovery and URL generation are read-only and must not start an import.

### 2. Choose the import method

Use the authenticated DA Source API by default. Do not open or automate the
DA Import web UI for a normal migration. The UI is a manual fallback when the
API path is unavailable or the user explicitly requests it.

For a Source API import:

1. Run the analyzer first and remove destination paths already present in DA.
2. For each approved page URL, fetch its `.md` representation and convert it
   with the same md2da conversion used by DA Import (`mdToDocDom` followed by
   `docDomToAemHtml`). Upload the converted EDS HTML, not the source markdown.
3. Discover and queue same-origin linked fragments and binary assets using the
   same rules as DA Import. Preserve binary content types and file extensions.
4. Upload with a multipart `data` field using `PUT` to
   `https://admin.da.live/source/{destination-org}/{destination-site}{path}`.
   Page routes map to `.html` (a trailing slash maps to `index.html`); asset
   routes keep their original extension.
5. Use bounded concurrency (five workers is the default), retry only transient
   `429`/`5xx` responses, and record every source URL, destination path,
   status, redirect, and error. Never retry a failed mutation blindly.

Direct Source API writes preserve the original locale paths, can overwrite a
matching destination path, and do not preview or publish content. Follow the
`da-content` skill for the exact HTML and Source API contract.

### 3. Manual DA Import UI fallback

For the first batch, use the locale query index in DA Import:

- Query index: `<live-origin>/<locale>/query-index.json?limit=-1`
- Linked content: `Import`
- Production domain: `<live-origin>`
- Organization: destination organization
- Site: destination site

The importer writes documents to their original locale paths. It does not
support an arbitrary destination prefix in this UI. Explain this before the
first import if matching DA paths already exist.

After completion, report total, successes, redirects, and errors. Identify
each failed source URL and status. Do not preview or publish unless the user
separately requests it.

### 4. Discover content omitted from the query index

Run the deterministic analyzer:

```bash
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro
```

Useful output modes:

```bash
# Human-readable inventory and recommendation
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro --format report

# Paste-ready URLs only
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro --format urls

# Structured audit output
node .agents/skills/eds-sharepoint-da-import/scripts/analyze-locale-import.mjs \
  --locale ro-ro --format json
```

The script:

1. Starts a read-only AEM bulk-status job for `/<locale>/*` using `preview`
   and `live` inventory.
2. Removes media, sheets, redirects, and query-index documents.
3. Reads rendered `robots` metadata from missing documents.
4. Recursively lists the destination DA locale.
5. Removes documents already imported directly or as linked content.
6. Recommends only missing, published `robots:noindex` documents.
7. Reports preview-only content separately.

The project currently rejects bulk-status requests that add `edit` or
`pathsOnly`; keep the analyzer's known-working `preview`/`live` request shape
unless the API behavior is re-verified.

### 5. Present a go/no-go checkpoint

Before importing the follow-up batch, report:

- indexed document count;
- published documents missing from the index;
- published `noindex` count;
- how many are already present in DA;
- final recommended URL count;
- preview-only count and representative names;
- broken or non-200 URLs.

Recommend importing only missing published `noindex` documents. Exclude by
default:

- preview-only documents, especially `copy`, `old`, `modified`, `test`, and
  `sandbox` paths;
- `404` pages unless explicitly requested;
- source URLs returning non-200 responses;
- content already present in DA.

Ask for a go/no-go decision before starting the follow-up import. If the user
asks only for the list, provide the `--format urls` result and do not import.

### 6. Follow-up import

Import the approved full URL set through the direct DA Source API by default,
using the same linked-content discovery and original-path rules as the first
batch. If the UI fallback is required, paste the URLs into DA Import's **By
URL** field and use the same linked-content, production-domain, organization,
and site settings as the query-index batch.

Afterward, rerun the analyzer. A clean result has no remaining recommended
published `noindex` URLs. Report any errors without retrying destructive
operations automatically.

## Invariants

- The SharePoint source remains unchanged.
- DA import may overwrite matching destination paths; never call it a merge.
- Importing into DA does not preview or publish content.
- Direct Source API uploads use the multipart `data` field and original locale
  paths; they do not preview or publish content.
- Preserve and verify `robots:noindex` metadata before any later publish.
- Never print, persist in project files, or expose the Adobe IMS token.
- Authentication failures, unexpected inventory shrinkage, or a destination
  mismatch are stop conditions; report them instead of guessing.
