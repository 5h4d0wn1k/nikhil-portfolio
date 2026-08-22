# Nikhil Nagpure — Portfolio

An interactive, responsive portfolio focused on product systems, security engineering, AI automation, and applied hardware research.

**Live:** https://cynik-operator.pages.dev/

## Stack

- React 19 + Vite (static SPA with client-side routing)
- Zero runtime dependencies beyond React; no CSS framework
- Deployed on Cloudflare Pages via Wrangler direct upload

## Run locally

```bash
npm install
npm run dev
```

Create a deployment bundle with:

```bash
npm run build
```

The static production output is generated in `dist/`.

## Deploy to Cloudflare Pages

```bash
npm run build && npx wrangler pages deploy dist --project-name cynik-operator
```

## SEO & discoverability

- Open Graph / Twitter card metadata + 1200×630 OG image (`public/og-image.png`, regenerate with `node scripts/generate-og.mjs`)
- JSON-LD `Person` + `WebSite` structured data in `index.html`
- `public/robots.txt`, `public/sitemap.xml`, and `public/llms.txt` for crawlers and AI agents

## Accessibility floor

- Skip-to-content link, visible `:focus-visible` rings, styled `::selection`
- All motion disabled under `prefers-reduced-motion: reduce`
- Semantic landmarks and labelled interactive elements

## Publish a journal entry

The Signal Journal is deliberately source-controlled: its posts live in [`src/content.js`](./src/content.js) and the notes in `src/experience.jsx`. Add an object with a unique `id`, title, summary (`dek`), paragraphs (`body`), and tags. Rebuild + redeploy to publish.

For quality, each note should answer: *what changed, why was it difficult, what decision was made, and what did you learn?* Never publish sensitive client material, credentials, exploitation details, or unapproved research artifacts.

## Content integrity

All claims are verified against Nikhil's own evidence records. Do not add metrics, ranks, or affiliations that are not independently verifiable.
