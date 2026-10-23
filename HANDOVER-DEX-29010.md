# Handover: DEX-29010 homepage (Splitter), Phase B in www-websites

Delete this file before you commit; it is a session note, not project documentation.

## Goal
- Build the EDS blocks for the new homepage on top of the new design system,
  `@repobit/dex-system-design`.
- Content is already authored and previewing at
  https://main--www-websites--bitdefender.aem.page/en-us/
  (`/en-us/index.plain.html` shows the raw block markup).
- Today the page's blocks render as nothing, because none of them exist yet.
- Done means:
  - every section renders and matches Figma at 390, 768 and 1440;
  - `npm run lint` and `npm test` are green;
  - a PR is open, with a branch preview link to `/en-us/`.

References:
- Jira: story [DEX-29010](https://bitdefender.atlassian.net/browse/DEX-29010); dev subtask DEX-29014. The branch is `DEX-29010`.
- Figma: `FsW2JZxiPMVbfOb223prmu` (2026_splitter), page `v6`.
  - Frames: desktop `976:6825`, tablet `976:7580`, mobile `976:7296`.
  - The AI-assistant section in frame `1260:7096` is out of scope.
  - The Figma MCP seat hits its tool-call limit quickly. Use `get_screenshot` per section; avoid `get_metadata` on the whole page.

## What already exists (Phase A, done)
- `@repobit/dex-system-design@2.3.0` is published on npm and holds every component this page needs.
- Each component's Storybook story documents its API. Run in dex-core:

  ```bash
  npm run storybook --workspace @repobit/dex-system-design
  ```

| Export | Elements | Used by |
|---|---|---|
| `./hero` | `bd-hero` (eyebrow, heading, lead; slots `media`, `cards`) | brand-hero |
| `./motion-art` | `bd-motion-art object="brand-surface \| mesh-globe \| layer-stack \| geo-core"` | brand-hero, bento-cards |
| `./audience-card` | `bd-audience-card` (eyebrow, heading, description, href, label; slot `icon`) | brand-hero |
| `./icons` | `bd-home-icon`, `bd-small-business-icon`, `bd-enterprise-icon` | brand-hero |
| `./logo-marquee` | `bd-logo-marquee` (label, duration, gap; slotted logos) | logo-marquee |
| `./section-header` | `bd-section-header` (eyebrow, heading, as, layout `stacked \| split \| centered`; slot `lead`) | every section with a heading |
| `./bento-grid` | `bd-bento-grid`, `bd-bento-item tone="brand"` (title, body, badge, as; slot `media`; CTA in default slot) | bento-cards |
| `./stat` | `bd-stat-highlight` (value, label), `bd-stat-tile` (value, caption, label) | stat-tiles |
| `./awards-spotlight` | `bd-awards-spotlight` (`.awards = [{logo, logoAlt, logoWidth, logoHeight, title, body}]`, autoplay, label) | awards-spotlight |
| `./partner-banner` | `bd-partner-banner` (heading, quote, attribution, lead; slots `photo`, `lockup`, `actions`) | partner-banner |
| `./post-card` | `bd-post-card` (href, heading, badge, image, image-alt, read-more) | post-feed |
| `./grid`, `./link`, `./paragraph`, `./button` | `bd-grid`, `bd-link arrow variant="bold"`, `bd-p`, `bd-button-link` | link-columns, CTAs |

## First steps
1. Work on the existing branch `DEX-29010`. It is already on origin, so run `git fetch origin && git checkout DEX-29010`; don't create a new one. Its branch preview is https://dex-29010--www-websites--bitdefender.aem.page/en-us/, and the PR description needs that link.
2. In `package.json`, set `"@repobit/dex-system-design": "^2.3.0"`, then run `npm install`. The husky hook regenerates the import map in `head.html` and `404.html`; don't edit those by hand.
3. In `_src/scripts/utils/utils.js`, update `DSN_FALLBACK`, which still pins `esm.sh/@repobit/dex-system-design@2.2.2/`. Move it to `@2.3.0`.

## Block pattern to follow
- Copy `_src/blocks/four-cards/four-cards.js` and `_src/blocks/spotlight-section/spotlight-section.js`:
  - `const base = getDsnBase();`
  - `try { await import(`${base}hero`) } catch (e) { console.warn(...) }`
  - read the cells defensively;
  - create the `bd-*` elements;
  - `block.replaceChildren(...)`.
- Read `AGENTS.md`:
  - blocks don't import each other; shared code goes in `utils.js`;
  - check the backend markup with `curl localhost:3001/en-us/index.plain.html`.
- Local server: `.claude/launch.json` has a `www-websites` config, `aem up` on port 3001.

## The section header: no block, lift default content
- Decision: there is no `section-header` block. A section's heading is plain default content above its block (eyebrow paragraph, H2, lead paragraph, optional button links).
- Each big block calls one shared helper that turns `section > .default-content-wrapper` into a `<bd-section-header>`.
- Precedent: `_src/blocks/accordion/accordion.js:7` and `_src/blocks/barchart/barchart.js:78` already lift `:scope > .default-content-wrapper`.

Helper, `liftSectionHeader(block, { layout })` in `utils.js`:
- Find `block.closest('.section')`, then its `:scope > .default-content-wrapper`.
  - Never use `section.querySelector('h2')`: it finds headings inside other blocks.
- Claim the wrapper once per section with `data-header-lifted`. Section 5 has two blocks after one header.
- Map the content:
  - the `p` before the H1–H3 → `eyebrow`;
  - the heading text → `heading`;
  - the heading's tag → `as`;
  - the first non-button `p` after the heading → appended with `slot="lead"`, which keeps inline links;
  - layout comes from `section.dataset.header` (Section Metadata `Header | split` / `centered`), default `stacked`.
- Button links (`p.button-container`) stay under the header.
  - `bd-section-header` has no actions slot; centre them with block CSS for Proven.
  - The clean alternative is an `actions` slot in dex-core, which needs a release.
- Decorate the header first in each block and keep the wrapper's margins, to limit the layout shift.

## The authored page today (from `/en-us/index.plain.html`)
Content has to change in two places before the helper can work:
- **Sections 3 and 4** still have a `section-header (split)` **block** table. Ask the author to turn it into default content plus Section Metadata `Header | split`. Until then, the helper can also accept a `.section-header` block in the same section as a fallback; remove that once the content is converted.
- **Sections 5, 7 and 8** already have default content, but no Section Metadata yet.
  - Section 5 needs `Header | centered`.
  - Section 8 needs `Header | split`.
  - Section 7 is `stacked`, the default, so it needs nothing.

| # | Block class | Cells, as authored |
|---|---|---|
| 1 | `brand-hero` | Row 1: eyebrow `p`, `h1`, lead `p`. Rows 2–4 (one per audience card): cell 1 `:home: For home` (EDS turns `:home:` into `span.icon.icon-home`), cell 2 `h3`, description `p`, link (its text is the arrow's accessible name). The background is `<bd-motion-art slot="media" object="brand-surface">`; there is no image row. Cards go in slot `cards` inside `bd-grid cols="1" cols-sm="1" cols-md="1" cols-lg="3" gap="md"` |
| 2 | `logo-marquee` | Row 1: "**#1** most awarded" (text item; compose `bd-display variant="md"` + `bd-p variant="small"` as in the marquee story). Then one row per logo (`picture`, keep alt). Default: `duration="18" gap="48"`. Variant `awards` (section 5): `duration="10" gap="24"` |
| 3 | `bento-cards` | One row per card. Cell 1: badge `p`, `h3`, body `p`, CTA link (→ `bd-button-link variant="outline-white" size="lg"`). Cell 2: the art name (`mesh-globe` / `layer-stack` / `geo-core`), then its labels split on `\|`. They map to `badges=` (mesh-globe), `labels=` (layer-stack) or `label=` (geo-core) on `bd-motion-art slot="media"`. Grid: `bd-bento-grid wide-share="0.5" min-card-width="440"`; an odd last card gets `priority="featured"` |
| 4 | `stat-tiles` | Row 1: the highlight. Cell 1 is the value plus an italic line → `bd-stat-highlight value label`. Cell 2 is a paragraph plus a bold link → primary `bd-button-link`. Rows 2–7: tiles, cell 1 value (+ optional italic label), cell 2 caption → `bd-stat-tile`. Layout: `bd-grid cols="1" cols-lg="2"`, the tiles in a nested `bd-grid cols="1" cols-sm="2" cols-md="2" cols-lg="2" gap="md"` (see the "Why-trust row" story) |
| 5 | `awards-spotlight` | One row per award: cell 1 `picture` (logo), cell 2 `h3` + body `p`. Build the `.awards` array; take logoWidth and logoHeight from the img attributes; `autoplay` on |
| 5 | `logo-marquee awards` | 11 award marks, one per row |
| 6 | `partner-banner` | Row 1: photo `picture` → slot `photo`. Row 2, cell 1: lockup `picture` (→ slot `lockup`) + `h2` → `heading`. Cell 2: quote `p` → `quote`, italic `p` → `attribution`, `p` → `lead`, links → slot `actions` (bold → `variant="white"`, plain → `variant="outline-white"`) |
| 7 | `post-feed` | One row per post: cell 1 `picture` (→ slot `image`), cell 2 category `p` → `badge`, `h3 > a` → `heading` + `href`. Lay out in `bd-grid cols="1" cols-sm="1" cols-md="1" cols-lg="3" gap="md"` |
| 8 | `link-columns` | One row per column: link + description `p` → `bd-link variant="bold" arrow` + `bd-p variant="small"` in `bd-grid cols="1" cols-md="2" cols-lg="4"` |

## Tests and checks
- One vitest file per block, in `_src/tests/blocks/<block>/<block>.test.js`. Reference: `_src/tests/blocks/webview-churn-offer/webview-churn-offer.test.js`.
  - Build the section markup in `document.body`.
  - Mock the dynamic DS imports.
  - Assert the generated `bd-*` tree and attributes.
- Run `npm run lint` (eslint airbnb with `.js` extensions, stylelint BEM-ish class pattern) and `npm test`.
- In the browser pane, check every section at 390, 768 and 1440 against the Figma frames, and check the console for DS import failures.

## Open items (not blocking, flag on the ticket)
- **Images:** the Ferrari photo, the lockup and the three post covers in the document are low-res crops from the Figma render. Replace them with real assets.
- **Links:** every URL in the document is a placeholder on a bitdefender.com path. Comments in the Word document mark them.
- **Design decisions** (Figma decisions are recorded in dex-core `packages/dex-system-design/plans/reports/homepage-component-map.md`):
  - Proven's two buttons are links, not a switcher.
  - The Ferrari card fade starts at 75% (for contrast).
  - "Read more" casing.
