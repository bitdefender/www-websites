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

While a refresh PR is open, the checker compares against **that PR's** `index-state.json`
instead of `main`'s, because `main`'s baseline only advances on merge. A new upstream change
therefore regenerates once and force-pushes to the same `chore/sitemap-refresh` branch, so
the open PR is updated in place (with a comment listing what changed) rather than
duplicated, and an unchanged hour costs nothing. Closing the PR unmerged makes the next run
compare against `main` again and open a fresh PR.

It can also be started by hand from the Actions tab, with a `force` input that regenerates
even when nothing changed.

### Required repository secrets

| Secret | Purpose |
| --- | --- |
| `X_CLIENT_ID` | the `X-Client-Id` header both scripts send to `www.bitdefender.com` |
| `LOCALE_ROUTER_TOKEN` | PAT that can read `bitdefender/locale-router`; the default Actions token cannot read another private repo |
| `SLACK_WEBHOOK_URL` | incoming webhook for the notification Slack app. Optional — without it the refresh still runs and only logs a warning |

The workflow also needs **Settings → Actions → General → Workflow permissions → "Allow
GitHub Actions to create and approve pull requests"** to be enabled.

## Slack notifications

A refresh PR is useless until someone merges it, so the channel is told twice: once when the
PR appears or is updated, and then once a day for as long as it sits unmerged.

Both messages are posted by the workflow itself, through a Bitdefender-owned Slack app with
the `incoming-webhook` scope. The GitHub Slack app is deliberately **not** used — it cannot
say "waiting three days", and it can only mention people who have each linked their GitHub
account to Slack.

| Knob | Where | Purpose |
| --- | --- | --- |
| `SLACK_WEBHOOK_URL` | repo secret | the incoming webhook. One webhook posts to one fixed channel, chosen when it was created |
| `SLACK_MENTIONS` | workflow `env` | mention string pasted verbatim into the payload |
| `NAG_HOUR` | workflow `env` | UTC hour the daily reminder fires (default `09`) |

### `SLACK_MENTIONS` has to use IDs, not names

A plain `@someone` in an API payload renders as grey text and notifies nobody. Only these forms
produce a real ping:

| Form | Meaning |
| --- | --- |
| `<@U01ABCDEF>` | one person. Slack profile -> ⋮ -> Copy member ID |
| `<!subteam^S01ABCDEF>` | a user group |
| `<!here>` | everyone currently active in the channel — needs no IDs, and survives team changes |

Several can be space-separated. Leaving it empty is valid: the messages still post, they just
ping nobody.

### How the two messages work

- **PR opened or updated** — sent from the generate job once the PR exists, carrying the change
  summary and a link.
- **Daily reminder** — sent from the *detect* job, which runs hourly whether or not anything
  changed, so it is the natural place to surface a forgotten PR. It fires only when the UTC
  hour matches `NAG_HOUR`, which makes it daily without storing any state, and only once the PR
  is at least a day old.

### Failure behaviour

Notifications are a nicety and are wired so they can never cost a three-hour regeneration:

- a missing `SLACK_WEBHOOK_URL` logs a warning and the run continues
- a failed POST logs a warning; the PR is already open by then
- in the reminder, a `gh` outage or an unparseable PR timestamp exits quietly. An unguarded
  `NaN` here would be a fatal bash error and would take down the job that gates the whole
  refresh.

The payload is built with `jq`, because the change summary contains backticks and newlines that
would otherwise need hand-escaping into JSON.

### What the label and reviewers are still for

The `sitemap` label and `SITEMAP_REVIEWERS` predate this and no longer drive Slack. They are
kept because they are independently useful: the label makes these PRs filterable, and the review
request is how the PR shows up in a reviewer's GitHub queue.
