# Kabira security, backend, responsiveness, UX and SEO audit

Audit date: 30 September 2026. Scope: all 11 canonical pages, utility/legacy routes, public assets, admissions JavaScript, Worker/API, SQLite schema, build scripts, dependencies and GitHub publishing workflow. Findings were reported in chat before repairs.

## Findings and repairs

| Finding | Priority | Repair / disposition |
|---|---|---|
| Changed data with a reused request ID could be reported as saved | High correctness | Compare all saved enquiry fields; return 409 for conflicting replays; unchanged retries remain idempotent. |
| Export key in URL query could enter history and access URLs | High privacy | Require Authorization: Bearer; reject query keys; provide a private local download script. Existing export secret is preserved. |
| Per-phone rate limit did not constrain clients rotating submitted phone numbers | Medium | Add a Cloudflare 30-request/minute per-IP ceiling before parsing/storage, retaining the persistent three/hour phone limit. Shared-IP and regional/eventual consistency limitations apply; this is abuse mitigation, not bot-proof identity. |
| Deployment dependencies had one high and six moderate advisories | High / development tooling | Upgrade deployment tooling and resolve esbuild consistently; final npm audit reports zero known advisories. Drizzle tooling loads successfully. These dependencies are not shipped as browser JavaScript. |
| Missing CSP on live GitHub Pages and incomplete Worker response protection | Medium | Generate strict script-hash CSP meta tags for every HTML page; Worker adds CSP headers, frame denial, nosniff, permissions policy and HTTPS HSTS. API/error responses are private and noindex. GitHub Pages cannot apply custom HTTP response headers, including frame-ancestors; the Worker protections require its independent deployment. |
| Notification error logs could include upstream response detail; no timeout | Medium | Log status/error name only, bound requests to ten seconds, and skip notifications without a configured secret. Enquiry storage still succeeds independently of notification delivery. |
| Mutable GitHub action tags | Medium / supply chain | Pin official action revisions and add browser security/UX/responsive tests to the deployment workflow. |
| Phone browser validation was stricter than server normalisation | UX | Accept common local, country-code, spaced and hyphenated formats. |
| Long-reading enhancement depended on JS and moved separated paragraphs | UX | Generate native details around consecutive secondary paragraphs; preserve order; open them on desktop. Full Director letter remains available without JS. |
| SVG height="auto" is invalid | Low | Remove invalid attributes; CSS controls responsive height. |
| Programme card accessible names omitted visible card text | Accessibility | Let the full link contents supply the accessible name; hide decorative uniform-button arrow from the spoken label. |
| Mobile cards/portrait/uniform requested oversized images | Performance | Correct responsive sizes and add a 224px portrait and responsive WebP uniform variants. |
| Play school/playway intent was weak on the home page; search map was undefined | SEO | Rewrite distinct page titles, descriptions and social metadata across 11 pages; clarify visible local copy and internal links; rebuild a valid intent map. |
| Parents lacked school-comparison answers on Home | SEO / UX | Add useful questions on choosing a playschool, location, playway versus nursery, and daycare. No unsupported best-school, review, rating or award claims. |
| Sitemap had no modification dates | SEO | Add truthful 30 September modification dates for the 11 updated canonical pages. |

The Worker production entry now contains only the API (6.53 KB compressed), instead of embedding a 4.5 MB compressed duplicate website. Local previews retain the full packaged public site. Public Worker page requests redirect to the official www domain.

Latest review corrections: the unstructured campus image was removed from the About introduction. The admission-fee waiver is explicitly a limited-time offer in visible panels, FAQs and search/social metadata; no expiry date was invented.

## Backend checks

Bound SQL parameters, consent validation, input limits, honeypot, CORS origin restrictions, limited public methods, privacy of exports, XML/notification escaping, idempotency, phone rate limiting and storage-error handling were reviewed. No production enquiry or private admission record was fetched. Existing D1 schema and records require no migration.

Browser CORS is not authentication and can be forged by non-browser clients. Layered rate limiting helps but cannot eliminate distributed spam. No clinical, ranking or government endorsement claims were invented.

## Live checks before publication

The live www domain returned 200 from GitHub Pages; HTTP and the apex domain redirected to HTTPS/www with 301. Robots and sitemap returned 200 and allowed public crawling. The missing route returned 404. Public unauthenticated backend export returned 404. GitHub Pages serves index.html and experience.html with 200, relying on root canonical and the existing legacy meta redirect; true legacy HTTP redirects require server-level hosting control.

## Verification

- Static validation passes for 11 canonical pages, metadata, structured-data JSON, sitemap, local links/assets, unique H1s and contact consistency.
- 17 offline backend tests pass, including conflicting replays, header-only exports, rate-limit failure behaviour and streamed oversized input.
- Admissions browser tests pass with mocked API responses; zero production submissions.
- Security/UX browser checks pass with CSP enforced: injected inline script blocked, normal app functionality retained, native reading without JS, desktop reading, phone formats and 320px pages.
- Responsive/axe checks cover 110 page/width combinations (360–1920px), with accessibility injection explicitly bypassing CSP only in the audit harness; security is tested separately without that bypass.
- Mobile Lighthouse runs cover all 11 pages. They are local lab results, not field Core Web Vitals or ranking evidence. Raw reports remain in ignored .sites-runtime/full-audit/. The public summary is in docs/audit-performance-2026-09-30.json: performance 94�97, accessibility/best-practices/SEO 100, CLS 0 on all 11 pages.
- Tracked-source credential scan returned no real credential-pattern matches. Secrets were never printed, embedded in source or fetched from admissions exports.

## Search visibility and external limits

The GSC Wizard connection rejected authenticated access because its subscription/trial is inactive. No Google indexing verdict, sitemap submission or indexing request is claimed. Public search-result absence is not proof of non-indexing. Google Business Profile ownership and profile data are not available; consistency and a verified school profile still matter for local search.

Google determines indexing and rankings. Technical SEO scores cannot establish appearance for best playschool, preschool or near-me queries. Use a verified Search Console property to submit the sitemap and inspect canonical URLs after publication, and confirm the school’s official Google Business Profile category, address, hours, website and telephone.

Primary references: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Title links](https://developers.google.com/search/docs/appearance/title-link), [Recrawl requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [esbuild advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99).

## Publication status

The owner completed the Cloudflare device login. The existing school Worker was published as version 75e40968-3bb5-437f-98b9-ef55407ed6f5, with the existing D1 database and secrets preserved. A read-only schema check confirmed zero records read or written. Frontend publication uses the existing GitHub Pages workflow on main; its completion and live verification are recorded in the final task response.
