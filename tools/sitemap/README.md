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
