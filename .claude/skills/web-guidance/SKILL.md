---
name: web-guidance
description: Look up best-practice guides before building or substantially changing front-end code in a block — layout, CSS, forms, dialogs and popovers, images and LCP/INP performance, accessibility, view or scroll transitions. Reads guides committed in the repo; no network. Skip for small tweaks, tests, tooling, CI or git work.
---

# Web guidance (local)

Wrapper around the vendored `GoogleChrome/modern-web-guidance` skill in `.agents/skills/modern-web-guidance/`. Its SKILL.md runs `npx modern-web-guidance@latest`; don't. Read the guides committed in the repo instead. `npx skills update` refreshes them.

## Find a guide

Guides live in `.agents/skills/modern-web-guidance/guides/<topic>/<guide>.md`. File names describe the use case.

1. List candidates: `ls .agents/skills/modern-web-guidance/guides/*/`
2. Narrow by feature or API: `grep -ril "<keyword>" .agents/skills/modern-web-guidance/guides`
3. Read the one to three most relevant guides in full. Broad references: `css/css.md`, `css/css-layout.md`, `html/html.md`, `forms/forms.md`, `performance/performance.md`, `accessibility/accessibility.md`.

If nothing matches, say so and carry on. Don't invent a guide.

## Apply it

- Guides are framework-agnostic. Adapt them to AGENTS.md: vanilla JS, no build step, CSS scoped to the block in `_src/blocks/`.
- Baseline Widely available features need no fallback. For anything newer, follow the guide's fallback advice.
- Prefer a platform feature from a guide over adding a dependency.
