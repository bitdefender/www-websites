# AGENTS.md

Edge Delivery Services, diverged from aem-boilerplate. Read a block first. Omissions are in the repo or known. Where a skill or general EDS advice conflicts with this file, this file wins.

## Avoid
- Code lives in `src/` (`blocks`, `scripts`, `styles`), not at the repo root.
- `_src/` is generated from `src/` by `npm run build` (`vite.config.mjs`) and is what gets served, at the same paths. Never edit it; on a merge conflict inside it, take either side, rebuild, commit. The pre-commit hook rebuilds it; CI fails if it doesn't match a rebuild.
- `src/scripts/lib-franklin.js` is our fork of `aem.js`. Every page loads it; edit only on purpose.
- Content is authored in SharePoint Word docs (`fstab.yaml`, still in use). Ignore skills for Document Authoring (da.live), Universal Editor and page import.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- Authors omit and add cells. Decorate defensively.
- No import map. The build compiles each `src/` module to the same path in `_src/` (plain JS stays plain JS; CSS and assets are copied as-is), bundles the `dependencies` it imports into `_src/vendor/`, and rewrites those imports to relative paths.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- Blocks don't import each other. Shared code goes in `src/scripts/` (usually `utils/utils.js`).

## Remember
- `npm run dev`: builds, rebuilds `_src/` as `src/` changes, and runs `aem up` (global `@adobe/aem-cli`) on `localhost:3000` with local code and previewed content. `aem up` flags go after a second `--` (`npm run dev -- -- --port 3001`); Claude Code's preview (`.claude/launch.json`) runs it that way on 3001. Restart it after adding a file: the watcher doesn't see new ones.
- CI runs `npm run lint` and `npm test` (vitest, `src/tests/`) on PRs to `main`.
- Merging `main` ships code; content publishes separately.
- A PR without a `https://{branch}--www-websites--bitdefender.aem.page/{path}` link is rejected. Writing `<branch>` in the description works; a workflow fills it in.
- All committed files are served unless `.hlxignore` excludes them.
- Skills: Claude Code uses the `aem-edge-delivery-services@adobe-skills` plugin (incl. `docs-search`). `.claude/settings.json` enables it but doesn't install it. If its skills are missing, have the user run `claude plugin install aem-edge-delivery-services@adobe-skills --scope project` once per clone, then restart the session.
- Web platform guides: read `.agents/skills/modern-web-guidance/guides/` directly; don't run its `npx …@latest`. Claude Code: `web-guidance` skill. `npx skills update` also links `.claude/skills/modern-web-guidance`; delete it.
