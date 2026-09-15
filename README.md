# Kabira The International School

Public website: https://www.kabirainternational.com/

## Source and build

- `dist/` contains hand-authored HTML, CSS, JavaScript and public assets: 11 canonical pages, one legacy redirect and a branded 404.
- `worker/index.js` implements the admissions API, private Excel export and an alternate static delivery path.
- `npm run build` minifies CSS/JS, versions their references, stages only public files in `.sites-runtime/public`, and embeds those same bytes in `dist/server/index.js`.
- `.github/workflows/deploy-pages.yml` validates, tests, builds and publishes the staged public directory to GitHub Pages on a push to `main`.
- `npm run deploy` independently deploys the Worker with Wrangler. Existing D1 schema and records are preserved; no migration is needed for this release.

## Verify and preview

Use Node 24 and Python 3. Install with `npm ci`, then run:

```sh
python validate-site.py
npm test
npm run build
node tests/release-ui.mjs
node tests/visual-audit.mjs
node scripts/preview.mjs
```

Browser tests use installed Microsoft Edge by default. `QA_BROWSER` selects another installed Playwright browser channel. The preview serves the packaged Worker at http://127.0.0.1:4173. Form interaction tests intercept requests and never submit production enquiries. Visual checks cover 11 pages at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390 and 360 pixels, with axe checks at 1440 and 390.

## Admissions

The browser submits to the existing school Cloudflare Worker. Enquiries are validated, saved with consent to D1 and limited per telephone number. An unchanged retry reuses its request ID. A new saved record triggers a best-effort Resend notification; notification failure does not discard the record. Parent input is escaped in notification HTML.

`RESEND_API_KEY` and `ADMISSIONS_EXPORT_KEY` are Cloudflare secrets. Export requires the configured secret and returns 404 if missing or incorrect. No credential belongs in this repository. The previously hardcoded export key was rotated for this release. The owner access link is stored locally in ignored `.asset-sources/admissions-owner-access.txt`.

## Images and evidence

Generated scenes are explicitly illustrative. Real campus and leadership photography remain authentic. The eight new scenes use the official crest as the reference for uniform embroidery; `docs/image-provenance.json` records the edit prompt and project paths. Full-size original and branded sources are local under ignored `.asset-sources/`. Responsive WebP variants are tracked under `dist/assets/`.

`docs/release-report.md` records release findings and external Google access limitations. Detailed screenshots, audit JSON and Lighthouse reports are local under ignored `.sites-runtime/`.
