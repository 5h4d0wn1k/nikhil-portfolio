# Nikhil Nagpure — Portfolio

Security engineer & systems builder. An interactive portfolio covering product systems, security engineering, AI automation, and applied hardware research — built as a fast, dependency-light React SPA with build-time prerendering for SEO and AI discoverability.

[![CI](https://github.com/5h4d0wn1k/nikhil-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/5h4d0wn1k/nikhil-portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Live site](https://img.shields.io/badge/live-cynik--operator.pages.dev-brightgreen)](https://cynik-operator.pages.dev)

**Live:** **https://cynik-operator.pages.dev/**

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/work` | Work — case studies |
| `/work/naavis` | NAAVIS case study |
| `/projects` | Projects archive |
| `/experience` | Work experience |
| `/achievements` | Achievements & certifications |
| `/publications` | Publications & IP |
| `/journal` | Signal Journal — blog |
| `/about` | Profile |
| `/now` | Now |
| `/contact` | Contact |

## Stack

- [React 19](https://react.dev) + [Vite 6](https://vite.dev)
- Zero UI-framework dependencies — no component library, no CSS framework
- Client-routed SPA with build-time prerendering of per-route HTML
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com), deployed via Wrangler direct upload

## Run locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production bundle → dist/
npm test         # smoke test: boots every route in jsdom and asserts real content mounts
```

## Deploy

Manual deployment to Cloudflare Pages:

```bash
npm run build && npx wrangler pages deploy dist --project-name cynik-operator
```

### CI/CD

Pushing to `main` auto-deploys to production **once** the repo owner has configured:

1. A Cloudflare API token scoped to **Account → Cloudflare Pages → Edit**
2. The token and account ID as repository secrets:
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID
   ```
3. A deploy toggle variable:
   ```bash
   gh variable set CF_DEPLOY_ENABLED --body true
   ```

Pushes to non-`main` branches produce Cloudflare Pages preview deployments.

## SEO & AI discoverability

- Per-route prerendered HTML so crawlers and AI agents see real content without executing JS
- JSON-LD structured data (`Person` + `WebSite`) in `index.html`
- Open Graph / Twitter card metadata plus a 1200×630 OG image (`public/og-image.png`, regenerate with `node scripts/generate-og.mjs`)
- `sitemap.xml`, `robots.txt` (AI-crawler friendly), and `llms.txt`
- RSS feed at [`/feed.xml`](https://cynik-operator.pages.dev/feed.xml)
- Security headers via `_headers`

## Publish a journal entry

Signal Journal posts live in source control at [`src/content.js`](./src/content.js). Add an object:

```js
{ id, type, date, read, title, dek, body, tags }
```

Then rebuild and redeploy — the entry publishes and the RSS feed regenerates automatically.

For quality, each note should answer: *what changed, why was it difficult, what decision was made, and what did you learn?*

## Content integrity

All claims are verified against Nikhil's own evidence records. Never publish sensitive client material, credentials, or exploitation details, and do not add metrics, ranks, or affiliations that are not independently verifiable.
