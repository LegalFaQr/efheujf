

## Source and build

- `dist/` contains hand-authored HTML, CSS, JavaScript and public assets: 11 canonical pages, one legacy redirect and a branded 404.
- `worker/index.js` implements the admissions API, private Excel export and redirects public web traffic to the official frontend.
- `npm run build` minifies CSS/JS, versions their references, stages only public files in `.sites-runtime/public`, and embeds those same bytes in `dist/server/index.js` for the local preview.
- `npm run build:pages` additionally copies the same public bytes to `.sites-runtime/cloudflare-pages` and adds a small Pages routing adapter to preserve the existing `.html` addresses. `wrangler.toml` configures only this public frontend; `wrangler.api.toml` preserves the separate admissions Worker, database and rate limiter.
- `.github/workflows/deploy-pages.yml` validates, tests, builds and publishes the staged public directory to GitHub Pages on a push to `main`.
- `npm run deploy` independently deploys the lightweight API from `worker/index.js` with Wrangler. Existing D1 schema and records are preserved; no migration is needed for this release. The configured admissions rate limiter adds a generous 30-request/minute ceiling per connecting IP in addition to the persistent three-enquiry/hour phone limit.

## Verify and preview

Use Node 24 and Python 3. Install with `npm ci`, then run:

```sh
python validate-site.py
npm test
npm run build
node tests/release-ui.mjs
node tests/visual-audit.mjs
node tests/security-ux.mjs
node tests/pages-hosting.mjs
node scripts/audit-performance.mjs
node scripts/preview.mjs
```

Browser tests use installed Microsoft Edge by default. `QA_BROWSER` selects another installed Playwright browser channel. The preview serves the packaged Worker at http://127.0.0.1:4173. Form interaction tests intercept requests and never submit production enquiries. Visual checks cover 11 pages at 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390 and 360 pixels, with axe checks at 1440 and 390.

## Admissions

The browser submits to the existing school Cloudflare Worker. Enquiries are validated, saved with consent to D1 and limited per telephone number. An unchanged retry reuses its request ID. A new saved record triggers a best-effort Resend notification; notification failure does not discard the record. Parent input is escaped in notification HTML.

`RESEND_API_KEY` and `ADMISSIONS_EXPORT_KEY` are Cloudflare secrets. Export requires the configured secret and returns 404 if missing or incorrect. No credential belongs in this repository. The previously hardcoded export key was rotated for this release. Exports now require an `Authorization: Bearer` header. URL query credentials are rejected to keep the key out of browser history and access URLs. Set `ADMISSIONS_EXPORT_KEY` only in your local environment, then run `node scripts/download-admissions.mjs`; the private workbook is saved under ignored `.asset-sources/`. Do not share the old owner link.

## Images and evidence

Generated scenes are explicitly illustrative. Real campus and leadership photography remain authentic. The eight new scenes use the official crest as the reference for uniform embroidery; `docs/image-provenance.json` records the edit prompt and project paths. Full-size original and branded sources are local under ignored `.asset-sources/`. Responsive WebP variants are tracked under `dist/assets/`.

`docs/release-report.md` records release findings and external Google access limitations. Detailed screenshots, audit JSON and Lighthouse reports are local under ignored `.sites-runtime/`.

The build prepares native expandable reading and per-page script-hash Content Security Policies before packaging assets. GitHub Pages receives the CSP meta tags; Worker delivery additionally sets response security headers. The two deployments remain independent. See `docs/full-audit-2026-09-30.md` for findings and publication status.

## Cloudflare hosting migration

The Cloudflare Pages Git integration uses `main`, Node 24, build command `python3 validate-site.py && npm test && npm run build:pages`, and output `.sites-runtime/cloudflare-pages`. The existing GitHub Pages workflow is retained during migration as a fallback. The Pages runtime test verifies the unchanged HTML documents, original URLs, query strings, 404 handling and mobile controls. The public Pages frontend has no D1 or admissions-secret binding.

Preview hosts on `pages.dev` are sent a noindex header. Admissions requests there are mocked for review; production submissions continue to require the official school domain. DNS and repository privacy are changed only after the new deployment is verified. Private rollback evidence and the original DNS records are stored under ignored `.sites-runtime/migration/`.
