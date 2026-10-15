# AGENTS.md

Edge Delivery Services, diverged from aem-boilerplate. Read a block first. Omissions are in the repo or known. Where a skill or general EDS advice conflicts with this file, this file wins.

## Avoid
- Code lives in `_src/` (`blocks`, `scripts`, `styles`), not at the repo root.
- `_src/scripts/lib-franklin.js` is our fork of `aem.js`. Every page loads it; edit only on purpose.
- Content is authored in SharePoint Word docs (`fstab.yaml`, still in use). Ignore skills for Document Authoring (da.live), Universal Editor and page import.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- Authors omit and add cells. Decorate defensively.
- No build step. `dependencies` load from esm.sh via the import map in `head.html` and `404.html`; the pre-commit hook regenerates it. Never edit the map by hand.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- Blocks don't import each other. Shared code goes in `_src/scripts/` (usually `utils/utils.js`).

## Remember
- `npx -y @adobe/aem-cli up`: local code, previewed content, on `localhost:3000`. Claude Code's preview (`.claude/launch.json`) runs it on 3001.
- CI runs `npm run lint` and `npm test` (vitest, `_src/tests/`) on PRs to `main`.
- Merging `main` ships code; content publishes separately.
- A PR without a `https://{branch}--www-websites--bitdefender.aem.page/{path}` link is rejected. Writing `<branch>` in the description works; a workflow fills it in.
- All committed files are served unless `.hlxignore` excludes them.
- Skills: Claude Code uses the `aem-edge-delivery-services@adobe-skills` plugin (incl. `docs-search`). `.claude/settings.json` enables it but doesn't install it. If its skills are missing, have the user run `claude plugin install aem-edge-delivery-services@adobe-skills --scope project` once per clone, then restart the session.
- Web platform guides: read `.agents/skills/modern-web-guidance/guides/` directly; don't run its `npx …@latest`. Claude Code: `web-guidance` skill. `npx skills update` also links `.claude/skills/modern-web-guidance`; delete it.
