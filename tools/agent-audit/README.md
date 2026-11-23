# Agent CTA audit (DEX-29318)

Loads every page of a locale the way an AI browsing agent does and checks that its purchase CTAs (Buy now, Try free, Get started, Download, …) can be found, understood and activated. It reads the page like an accessibility tree, hit-tests every CTA and never clicks one, so it never opens checkout.

## Setup

Uses the installed Google Chrome, so no browser download.

```sh
cd tools/agent-audit
npm install
```

## Run

```sh
node audit.js                                   # every en-us page, main branch on aem.page
node audit.js --base https://DEX-29318--www-websites--bitdefender.aem.page   # once the branch is pushed
node audit.js --base http://localhost:3000 --paths /en-us/consumer/,/en-us/consumer/total-security
node audit.js --paths-file saved-query-index.json --locale de-de
```

| Option | Default | |
| --- | --- | --- |
| `--base` | `https://main--www-websites--bitdefender.aem.page` | where pages load from |
| `--index` | same | where `/{locale}/query-index.json` is read from |
| `--locale` | `en-us` | |
| `--paths`, `--paths-file` | | a comma list, or a saved query index or one path per line |
| `--exclude` | `/webview/,/experiment` | path parts to skip |
| `--concurrency` | `1` | pages at a time |
| `--slow-ms` | `5000` | buy links still `#buylink` after this are reported |

It writes `reports/<host>-<time>/` (gitignored): `report.md`, `report.json`, and `snapshots/*.yml`, the Playwright ARIA snapshot of each page's `main`, which is close to what an agent reads. The exit code is 1 when any page has an issue.

The EU consent dialog covers the page, so the audit dismisses it with Deny first, as an agent would.

An aem.page host for a branch that isn't pushed serves the pages but no code, so the audit checks `/_src/scripts/scripts.js` first and stops if it's missing, and fails any page whose scripts didn't run.

## Don't run it hard against production

www.bitdefender.com sits behind a Cloudflare rate limit. 116 pages, four at a time, got the whole IP HTTP 429 with a `Retry-After` of about a day, and the store's prices come from `www.bitdefender.com/p-api` even on aem.page and localhost, so nothing priced works from that network until it lifts. The audit stops at the first 429. Run whole locales against aem.page, and production only for a few pages.

## Issues

| Code | Meaning |
| --- | --- |
| `not-exposed` | looks like a CTA but is not a link or button (an `<a>` without `href`, a styled `div`) |
| `no-destination` | link with no `href`, `#` or `#buylink` |
| `not-focusable` | removed from the tab order |
| `disabled` | `disabled`, `aria-disabled` or `pointer-events: none` |
| `covered` | something else is on top of its center, so a click lands there |
| `ambiguous-name` | same name as CTAs that go to other plans or pages |
| `ambiguous-radio` | a plan option ("Yearly") whose name and group label repeat in another group |
| `slow-resolve` | store buy links still placeholders after `--slow-ms` |

Names are approximated from `aria-labelledby`, `aria-label` and text, across open shadow roots. Some agents (Claude in Chrome among them) read `aria-label` but not `aria-labelledby`, so label CTAs with `aria-label` (`labelWithPlan` in `src/scripts/utils/utils.js`).
