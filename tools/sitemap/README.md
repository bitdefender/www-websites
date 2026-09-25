# Sitemap generator

## Setup

1. Copy `.env.dist` to `.env`.
2. Set `X_CLIENT_ID`. Talk to your manager for the value of this header.
3. Set `GITHUB_TOKEN` to a GitHub personal access token that can read the private `bitdefender/locale-router` repository:
	- For a fine-grained token, grant access to `bitdefender/locale-router` with read-only `Contents` permission.
	- For a classic token, enable the `repo` scope.
	- Authorize either token for organization SSO when required.
4. Install dependencies with `npm install`.
5. Run the generator with `npm start`.

The generator requires `GITHUB_TOKEN` because it downloads `src/404-handling/404-redirects.json` from `bitdefender/locale-router`. Never commit `.env` or the token.

## Change detection (`check-index.js`)

`npm start` takes roughly **three hours**: `create.js` probes every hreflang alternate
through `checkUrlExists`, which sleeps a random 1–3s per URL, sequentially. That is about
5,500 unique requests against production.

`check-index.js` answers the cheap question first — *has anything that `create.js` actually
reads changed?* — in about a second.

```sh
node check-index.js          # compare against index-state.json and report
node check-index.js --write  # same, then persist the new fingerprints
node check-index.js --json   # machine-readable diff on stdout
```

It watches two inputs:

- every `{locale}/query-index.json`, reduced to the **only four fields `create.js` reads**:
  `path`, `robots`, `priority`, `lastModifiedTimestamp`. A title or description edit cannot
  change the sitemap, so it deliberately does not trigger a rebuild.
- `404-handling/404-redirects.json` from `bitdefender/locale-router`, which `create.js` uses
  to exclude paths (DEX-28341). A change there affects every locale.

Fingerprints live in `index-state.json`, which is committed so the baseline survives runner
and cache churn. Rows are canonicalised and sorted before hashing, so feed reordering is not
mistaken for a change.

Notes on behaviour worth knowing:

- `HEAD` on `query-index.json` returns 500 and the responses carry no `ETag` or
  `Last-Modified`, so the bodies have to be fetched. All 47 locales in parallel is ~1.4 MB.
- A locale that **404s** (currently `ja-jp`) is treated as legitimately absent.
- A locale that fails with a 5xx or network error keeps its previous fingerprint and is
  reported as a warning. A transient failure can therefore never be mistaken for a removed
  locale, nor silently advance the baseline.
- The very first run has nothing to compare against, so it records a baseline and reports
  no change.

## Automation

`.github/workflows/sitemap-refresh.yaml` runs the checker hourly and only regenerates when
something changed. On a change it regenerates all sitemaps, verifies that every file was
actually rewritten, updates `index-state.json`, and opens a PR against `main` for review.

Repeated detections force-push to the same `chore/sitemap-refresh` branch, so an unmerged
refresh PR is updated in place rather than duplicated.

It can also be started by hand from the Actions tab, with a `force` input that regenerates
even when nothing changed.

### Required repository secrets

| Secret | Purpose |
| --- | --- |
| `X_CLIENT_ID` | the `X-Client-Id` header both scripts send to `www.bitdefender.com` |
| `LOCALE_ROUTER_TOKEN` | PAT that can read `bitdefender/locale-router`; the default Actions token cannot read another private repo |

The workflow also needs **Settings → Actions → General → Workflow permissions → "Allow
GitHub Actions to create and approve pull requests"** to be enabled.
