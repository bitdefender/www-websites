# Schema Layer For AI-Driven EDS Page Generation

This folder contains the schema and manifest layer used to generate EDS-compatible page JSON and DOCX structures from this repository.

## Files

`_src/blocks/<block>/manifest.json`

- Source of truth for each documented block contract.
- Lives next to the block implementation so block code and manifest can evolve together.
- Uses the same component object shape that is later bundled into the aggregate schema manifest.

`component-manifest.json`

- Generated aggregate manifest assembled from the per-block manifests under `_src/blocks/*/manifest.json`.
- This is the stable machine-readable entrypoint for AI tooling, validation, and downstream DOCX/page generation flows.
- The aggregate currently contains `55` documented block entries.
- Rebuild it with `npm run build:component-manifest`.

`page-schema.json`

- Strict JSON Schema for generated page JSON.
- Validates:
  - page version
  - metadata
  - import references
  - recursive section/block/element/text nodes
  - section and block metadata
  - element attrs
  - rich text children
- Block-specific semantic validation is intentionally left to the manifest and a later validator layer.
- The schema describes page JSON only. DOCX-specific separators such as `---`, per-block `Section Metadata` tables, and end-of-document page `Metadata` are rendering rules derived from the manifest and sidekick docs, not from the JSON schema itself.

`README.md`

- Human-readable operating notes for agents using this schema layer.

## Intended Pipeline

Use the files in this order:

1. User brief
2. Keep per-block source manifests updated under `_src/blocks/<block>/manifest.json`
3. Rebuild `schemas/component-manifest.json` from those per-block manifests
4. Load `schemas/component-manifest.json`
5. Load `schemas/page-schema.json`
6. Retrieve relevant usage docs for the selected block identifiers
7. Retrieve project examples that use those identifiers
8. Generate page JSON
9. Validate the JSON against `page-schema.json`
10. Validate chosen blocks against `component-manifest.json`
11. Render an EDS-compatible DOCX from the validated page JSON

In short:

`user brief -> update per-block manifests -> build aggregate manifest -> load manifest/schema -> retrieve relevant usage docs -> retrieve project examples -> generate page JSON -> validate -> render EDS-compatible DOCX`

## Current Coverage

The aggregate manifest is no longer limited to the original hand-curated preview set. It now bundles `55` block manifests sourced from `_src/blocks/<block>/manifest.json`, with many of those entries tightened from sidekick documentation and public previews.

This means the schema layer now covers:

- stable content blocks such as `hero`, `cards`, `columns`, `accordion`, `questions-answers`, `quote`, `video`, `embed`, `ribbon`, and `new-prod-boxes`
- additional sidekick-documented blocks such as `awards`, `awards-search`, `barchart`, `big-teaser-section`, `blog-news`, `compare-as-table`, `creators-block`, `dropdown-box`, `faq-tabs`, `image-carousel`, `logos`, `lp-teaser-block`, `stats`, and many others
- blocks whose authored table structure is documented enough in sidekick to support conservative AI generation, even if their runtime behavior is richer in production

The current aggregate is intended to be broad enough for block selection and first-pass page generation, but not every entry has the same depth of contract precision. Some blocks are still represented as conservative docs-backed content shapes rather than exact row-by-row authoring specs.

## What Counts As Safe

Included blocks are blocks whose author-facing structure is visible enough in sidekick, project code, or public previews to define a conservative contract without inventing hidden state.

Still excluded or intentionally underspecified are mostly:

- runtime-heavy widgets
- blocks driven by APIs or store state
- personalization or experimentation blocks
- campaign-specific or product-specific blocks whose contract depends on hidden section datasets
- blocks where the repo code reveals styling behavior but not a stable authoring shape

## Manifest Authoring Workflow

- Edit block contracts in `_src/blocks/<block>/manifest.json`.
- Treat `schemas/component-manifest.json` as generated output, not the primary editing surface.
- Rebuild the aggregate manifest with `npm run build:component-manifest`.
- Use `identifier` as the canonical block key in manifests and downstream JSON. Human-readable `name` is descriptive only.
- Use `npm run split:component-manifest` only as a migration or recovery tool when you need to fan the aggregate manifest back out into per-block files.
- When block authoring behavior is better documented in sidekick than in local source, prefer the sidekick contract and examples.

## Important Assumptions

- This is a first-pass generation contract, not a full authoring spec.
- When the repo exposes a row-and-column authoring pattern but not named props, the manifest normalizes that shape into machine-friendly field names such as `items`, `rows`, `header`, or `content`.
- Those normalized names are for AI generation and validation only. They are not claimed to be official author-facing field names.
- For EDS-specific configuration such as `new-prod-boxes` pricing inputs, the manifest now uses `sectionMetadata` and `requiredSectionMetadata` instead of `props`. These are author-authored metadata keys that Franklin later exposes on the DOM as `data-*` attributes and `section.dataset.*` values.
- In `page-schema.json`, `metadata` is used for page/section/block authoring data, while `attrs` is used only for low-level HTML element attributes such as `href`, `src`, `alt`, or `classNames`.
- Rich text and plain HTML-like content are modeled by `element` and `text` nodes in `page-schema.json`, not as separate repo blocks.
- Variants listed here are only included when they are directly visible in JS or strongly implied by CSS selectors. Styling-only variants may still need later manual verification.
- DOCX output rules learned from sidekick examples matter during rendering:
  - separate sections with `---`
  - use exact block titles, including variant syntax like `new-prod-boxes(smallerbuttons)`
  - keep page `Metadata` at the end of the document
  - use a separate `Section Metadata` table for each block section that needs it

## Current Ambiguities

- `hero` has a usable base content contract, but a large amount of real behavior is controlled by section dataset values and theme classes. This layer intentionally excludes those hidden controls.
- `columns` is an important public block, but the repo extends it heavily with tabs, carousel behavior, dynamic links, and background handling. Only the plain row/column contract is captured.
- `image-columns` supports themed video substitution and multiple styling modes. Only the plain image/text contract is considered safe here.
- `new-prod-boxes` is included because pricing preview needs it, but the visible authored card rows and the hidden store-backed section configuration are separate concerns. This first layer documents the card structure and explicitly leaves pricing resolution as an external step.
- `new-prod-boxes` now includes explicit public pricing metadata keys such as `products`, `family-products`, `monthly-products`, `third-radio-button-products`, `add-on-products`, `add-on-monthly-products`, `add-on-product-name`, and `save-text`. The tuple format is `product-id/devices/years`, for example `us_i_m/5/1`.
- `quote` expects a very specific authored pattern for stars, quote text, and author text. The manifest normalizes that shape, but downstream examples should confirm the exact preferred source markup.
- `ribbon` can promote a second-row image into a background. That behavior is code-backed, but the authoring contract is not formally documented in-repo.

## Recommended Next Refinements

- Tighten the newer sidekick-imported block manifests from generic docs-backed shapes into exact row-by-row authoring contracts.
- Add example-backed contracts for each included block by scanning real pages in this project.
- Add a dedicated JSON Schema fragment for `new-prod-boxes` section metadata, especially conditional rules like:
  - `products` required always
  - `monthly-products` required when 2 radio buttons exist
  - `third-radio-button-products` required when 3 radio buttons exist
- Add a second validator that checks block-specific required content beyond generic JSON Schema validation.
- Add a rendering mapping from manifest block identifiers to DOCX layout fragments.
- Split manifest entries more explicitly into:
  - stable/base contract
  - theme-specific extensions
  - forbidden/internal section datasets
- Revisit currently excluded or underspecified blocks once better sidekick docs or example pages are available.
