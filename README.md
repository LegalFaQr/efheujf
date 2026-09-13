# Kabira The International School

Responsive, dependency-free multi-page website for Kabira The International School (Zirakpur), hosted through the existing Sites project. The site source lives in `dist/`; there is no frontend framework or bundler.

## Project structure
- `dist/` — the 12 site pages plus `styles.css` / `admissions.css` / `app.js` / `admissions.js` and static `assets/`. This is hand-authored source, not a build artifact.
- `worker/index.js` — the single-file Cloudflare Worker: serves `dist/` pages/assets, and powers the admissions API (`/api/admissions`) and the admin Excel export (`/api/admissions/export`).
- `db/schema.ts`, `drizzle/`, `drizzle.config.ts` — the D1 admissions database schema and its SQL migration.
- `scripts/build-worker.mjs` — bundles `dist/*` (base64-encoded) with `worker/index.js` into `dist/server/index.js` for deployment. No other build step exists.
- `tests/admissions.test.mjs` — Node's built-in test runner against the Worker, using an in-memory SQLite database as a D1 stand-in.
- `validate-site.py` — structural/content checks over `dist/` (unique IDs, one `<h1>` per page, working internal links, image alt/dimensions, protected CSS baseline, contact-info guards).

## Preview locally
```
python -m http.server 4173 --directory dist
```
Then open `http://127.0.0.1:4173`.

## Common commands
```
npm test              # run the Worker/admissions test suite
npm run build          # bundle dist/ + worker/index.js into dist/server/index.js
npm run db:generate     # regenerate a Drizzle migration after editing db/schema.ts
python validate-site.py
```

## Admissions backend
Submissions to the admissions form are saved to the D1 `admissions` table (rate-limited per phone number) and trigger a best-effort notification email via [FormSubmit.co](https://formsubmit.co) to a fixed, server-side address — no API key or paid service required. The notification destination is hardcoded in `worker/index.js` and is never read from the request, so it cannot be changed from the browser.

All saved admissions can be downloaded as a real `.xlsx` workbook from:
```
/api/admissions/export?key=<EXPORT_KEY>
```
`EXPORT_KEY` is a constant defined at the top of `worker/index.js`. Requests with a missing or incorrect key get an identical 404, so the endpoint can't be probed.

## Deploy to your own Cloudflare account
This repo includes `wrangler.toml`, so it can also be deployed independently of the Sites project, on Cloudflare's free tier.

1. `npm install -D wrangler` — installs the Cloudflare CLI as a dev dependency.
2. `npx wrangler login` — opens a browser to connect your (free) Cloudflare account.
3. `npx wrangler d1 create kabira-admissions` — creates the database and prints a `database_id`. Paste that ID into `wrangler.toml` in place of `REPLACE_WITH_THE_ID_PRINTED_BY_WRANGLER_D1_CREATE`.
4. `npm run db:migrate:remote` — applies `drizzle/0000_glorious_karnak.sql` to the new remote database.
5. `npm run deploy` — builds `dist/server/index.js` and runs `wrangler deploy`.

Wrangler prints a live `*.workers.dev` URL when it finishes — that's your working site, admissions form included. A custom domain can be attached afterwards from the Cloudflare dashboard if you have one.

## Folders you can ignore
`node_modules/`, `.asset-sources/`, `.sites-runtime/`, `dist/server/` and `dist/.openai/` are all git-ignored — regenerated or platform-managed, not part of the tracked repository.

- Report updates: Bhattacharya Educational Trust, Grow · Learn · Bloom, and conditional long-term expansion towards Class X.
- Phone numbers, email addresses, messaging links, internal finances and staffing plans are excluded. Higher classes are not advertised as currently available.

## Files
`dist/index.html` contains the school content.
`dist/styles.css` contains the layout, responsive rules and motion.
`dist/app.js` contains programme data and interactions.
`validate-site.py` checks markup, anchors, image sources and contact exclusions.
Original images are retained locally in `.asset-sources/`; published JPEG assets are in `dist/assets/`.

## Image provenance
Generated using the built-in image-generation tool with Logo.jpg and the supplied uniform reference. The four prompts requested Indian preschool block play (hero), seedling planting (nature), a reading corner (story) and a four-child summer/winter uniform collection. All used the navy/green/white palette with visible left-chest crest and KABIRA embroidery, natural lighting, realistic proportions and full compositions. Embroidery is an illustrative approximation, not a pixel-identical reproduction. These are not actual campus photographs and are labelled illustrative.

## Verification
JavaScript syntax, internal anchors, unique IDs, image metadata and responsive sources, programme-tab structure, contact-detail exclusions and absence of cropping rules checked for this revision. Hero and uniform asset compositions visually inspected. Browser-based visual and interaction re-testing could not run because the Codex browser checker failed during Windows sandbox startup; do not interpret the source checks as a full browser test.

## Two-page organisation
Home keeps the original welcome, leadership, admissions, FAQs and visit sections. experience.html contains the original programmes, learning experience, daycare, uniforms, story and future plans. Typography, spacing, imagery and component styles are preserved. Only the green palette is slightly darker. Old homepage section links redirect to their new location. Run python validate-site.py to validate both pages and cross-page anchors.


## Admissions service
The website has a native Kabira-branded admission enquiry form. Enquiries are saved privately in the site's D1 admissions table; no public read/list endpoint is exposed and no email notifications are configured. Authorized school owners can inspect records through Sites database tools. Only parent-provided enquiry details are collected with consent; raw identity documents are not requested.
The supplied Director and Principal portrait is compressed as WebP without alteration. Leadership claim provenance is recorded in LEADERSHIP_SOURCE_NOTES.md. The embedded map and directions button use the school location supplied by the user.
Build: node scripts/build-worker.mjs. Generate schema changes: node node_modules/drizzle-kit/bin.cjs generate. Tests: node --test tests/admissions.test.mjs. HTML and links: python validate-site.py. Authored static files remain in dist; the build embeds them in the dependency-free Worker for deployment.

