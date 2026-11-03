# RealCheck Checker

The hero of the RealCheck product page (DEX-29094): the visitor pastes a public video link
and gets a free deepfake check. The block shows four screens: the form, the progress, the
result, and a failed screen.

It calls the RealCheck API through a proxy that adds the API key, which the browser must
never see. The proxy's address is `ENDPOINT` in `realcheck-checker.js`.
A page can point elsewhere with the section metadata `realcheck-endpoint`.

A visible Cloudflare Turnstile widget sits under the field, as in booking-form
(`renderTurnstile` in `scripts/utils/utils.js`). Analyze waits for its token and sends it as
`token` in the JSON body. The proxy must check it with `TURNSTILE_SECRET_KEY`, the same way
locale-router's `/form` does, and strip it before calling the API. A token is good for one request,
so the widget resets after each submit. `?realcheck-mock` skips the widget.

## Authoring

One block. The first row is the intro, in one cell: the eyebrow (any line before the h1),
the h1, then the description.

Every other row is `key | content`. These rows take content the block can't write itself:

| Key | Content |
|---|---|
| `Note` | The line under the field (supported platforms) |
| `Terms` | The terms line, with its links (they open in a new tab) |
| `App` | The app link for phones, e.g. `Try RealCheck Free`. `https://#os-dynamic-link` uses the section's `iosLink` / `androidLink` / `defaultLink` |
| `QR` | The QR code picture, shown on desktop |
| `Report` | The blurred report picture, the same for every result |

Any text below can be replaced, for a translation, by a `key | text` row. The English is the
default:

| Key | Default |
|---|---|
| `placeholder` | Paste a public video link |
| `analyze` | Analyze |
| `paste` | Paste from clipboard |
| `error empty` / `error invalid` / `error unsupported` | The link errors under the field |
| `error turnstile` | Please complete the security check. |
| `stage queued` / `downloading` / `analyzing` / `intent` | The caption on the progress screen |
| `step queued` / `downloading` / `analyzing` / `intent` | The four step names |
| `step done` / `step active` / `step waiting` | done / in progress / waiting |
| `verdict 0` / `verdict 1` / `verdict 2` | Likely authentic / Possibly altered / Likely altered |
| `risk high` / `risk medium` / `risk low` / `risk none` | The line under the verdict |
| `report title`, `report text`, `report text mobile` | The app offer over the report |
| `qr open`, `qr hint`, `close` | The QR code's larger view |
| `failed title`, `failed text`, `try again` | The failed screen; `failed text` when there is no better reason |
| `error <code>` | The reason for an API error code, e.g. `error no_speech` |

Section metadata: `signature` (`Trusted. Always.`) is shown at the bottom of the card.

## How it works

- The link is checked first, as the API would: https only (added when missing), no
  user/password, no IP address, at most 2048 characters, and one of TikTok, YouTube,
  Instagram, Facebook or X.
- One check at a time. It polls every `Retry-After` seconds (2 by default) and gives up after
  5 minutes with the failed screen.
- Colours: verdict 0 is blue whatever the risk. Otherwise high is red, medium orange, low or
  benign grey; no risk is grey with no risk line.
- A failed check shows `error <code>` if authored, else the API's message (in English).
  A refused platform or link goes back to the form with the link error.
- The video title is shown as text. The thumbnail shows only once it has loaded, since the
  platform's address can expire or refuse our page.
- The pictures join the page with the first result. The page waits for the first image in
  `main` before it shows anything, and it mustn't be the hidden report.

## Trying it without the API

`?realcheck-mock=<scenario>` swaps the API for `realcheck-checker-mock.js`:

- `2-high`, `1-medium`, `1-low`, `0-high`, `2-none`: a verdict and a risk
- `failed-no_speech`, `failed-content_private`, …: a failed check with that code
- `http-422-platform_not_supported`, `http-500-internal_error`, …: a refused request
- `slow`: never finishes (gives up after 5 minutes)
