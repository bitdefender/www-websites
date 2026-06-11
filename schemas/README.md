# Schema Layer For AI-Driven EDS Page Generation

This folder contains a conservative first schema layer for generating EDS-compatible page JSON from this repository.

## Files

`component-manifest.json`

- Machine-readable inventory of public generation-safe blocks inferred from real repo code.
- Captures a normalized public contract for each included block:
  - block identifier
  - source file
  - role
  - description
  - normalized fields
  - required fields
  - variants and enum values only when they are visible in code or CSS
  - content model
  - usage and ambiguity notes

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

`README.md`

- Human-readable operating notes for agents using this schema layer.

## Intended Pipeline

Use the files in this order:

1. User brief
2. Load `schemas/component-manifest.json`
3. Load `schemas/page-schema.json`
4. Retrieve relevant usage docs for the selected block identifiers
5. Retrieve project examples that use those identifiers
6. Generate page JSON
7. Validate the JSON against `page-schema.json`
8. Validate chosen blocks against `component-manifest.json`
9. Render an EDS-compatible DOCX from the validated page JSON

In short:

`user brief -> load manifest/schema -> retrieve relevant usage docs -> retrieve project examples -> generate page JSON -> validate -> render EDS-compatible DOCX`

## What Counts As Safe In This First Version

Included blocks are blocks whose author-facing structure is visible enough in code to infer a conservative contract without inventing hidden state.

The current preview set includes:

- `hero`
- `cards`
- `columns`
- `accordion`
- `questions-answers`
- `image-columns`
- `quote`
- `video`
- `embed`
- `new-prod-boxes`
- `teaser-logos`
- `ribbon`

Excluded blocks are mostly:

- runtime-heavy widgets
- blocks driven by APIs or store state
- personalization or experimentation blocks
- campaign-specific or product-specific blocks whose contract depends on hidden section datasets
- blocks where the repo code reveals styling behavior but not a stable authoring shape

## Important Assumptions

- This is a first-pass generation contract, not a full authoring spec.
- When the repo exposes a row-and-column authoring pattern but not named props, the manifest normalizes that shape into machine-friendly field names such as `items`, `rows`, `header`, or `content`.
- Those normalized names are for AI generation and validation only. They are not claimed to be official author-facing field names.
- For EDS-specific configuration such as `new-prod-boxes` pricing inputs, the manifest now uses `sectionMetadata` and `requiredSectionMetadata` instead of `props`. These are author-authored metadata keys that Franklin later exposes on the DOM as `data-*` attributes and `section.dataset.*` values.
- In `page-schema.json`, `metadata` is used for page/section/block authoring data, while `attrs` is used only for low-level HTML element attributes such as `href`, `src`, `alt`, or `classNames`.
- Rich text and plain HTML-like content are modeled by `element` and `text` nodes in `page-schema.json`, not as separate repo blocks.
- Variants listed here are only included when they are directly visible in JS or strongly implied by CSS selectors. Styling-only variants may still need later manual verification.

## Current Ambiguities

- `hero` has a usable base content contract, but a large amount of real behavior is controlled by section dataset values and theme classes. This layer intentionally excludes those hidden controls.
- `columns` is an important public block, but the repo extends it heavily with tabs, carousel behavior, dynamic links, and background handling. Only the plain row/column contract is captured.
- `image-columns` supports themed video substitution and multiple styling modes. Only the plain image/text contract is considered safe here.
- `new-prod-boxes` is included because pricing preview needs it, but the visible authored card rows and the hidden store-backed section configuration are separate concerns. This first layer documents the card structure and explicitly leaves pricing resolution as an external step.
- `new-prod-boxes` now includes explicit public pricing metadata keys such as `products`, `family-products`, `monthly-products`, `third-radio-button-products`, `add-on-products`, `add-on-monthly-products`, `add-on-product-name`, and `save-text`. The tuple format is `product-id/devices/years`, for example `us_i_m/5/1`.
- `quote` expects a very specific authored pattern for stars, quote text, and author text. The manifest normalizes that shape, but downstream examples should confirm the exact preferred source markup.
- `ribbon` can promote a second-row image into a background. That behavior is code-backed, but the authoring contract is not formally documented in-repo.

## Recommended Next Refinements

- Add example-backed contracts for each included block by scanning real pages in this project.
- Add a dedicated JSON Schema fragment for `new-prod-boxes` section metadata, especially conditional rules like:
  - `products` required always
  - `monthly-products` required when 2 radio buttons exist
  - `third-radio-button-products` required when 3 radio buttons exist
- Add a second validator that checks block-specific required content beyond generic JSON Schema validation.
- Add a rendering mapping from manifest block identifiers to DOCX layout fragments.
- Split manifest entries into:
  - stable/base contract
  - theme-specific extensions
  - forbidden/internal section datasets
- Revisit currently excluded blocks once usage docs or example pages are available.
