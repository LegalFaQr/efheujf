# Kabira production release — 16 September 2026

## A. UI/UX

Preserved the navy/green/lime identity, Playfair Display and DM Sans, genuine campus photographs and supplied leadership portrait. Rebuilt programme cards with relevant images, age guidance, short descriptions and complete clickable links. Constrained class photos to landscape proportions. Consolidated conflicting CSS, repaired mobile SVG sizing and the clipped learning-cycle label, clarified admissions form order and keyboard controls, and corrected headings, captions and contrast. Corrected the mobile leadership quotation overlap found through screenshot review after automated checks.

## B. Mobile overflow

Baseline About at 390 px scrolled to 411 px (and at 360 px to 410 px); the navigation caused all public pages to scroll to roughly 885 px at 768 px; Inclusive Learning also reached 1107 px at 1024 px. Fixed the actual navigation, minimum-width and grid causes without hiding body overflow. Final full audit: 110 renders across 11 pages and 10 widths, zero failing page-width, missing-image, JavaScript or axe checks. Desktop/mobile screenshots were reviewed, including all lower sections. The quotation and diagram were visually rechecked after correction.

## C. Images

Eight distinct illustrative scenes: Pre-Nursery, Nursery, LKG, UKG, inclusive learning, dance, music and abacus. All eight were revised using the official Kabira crest reference to add embroidered badges to visible uniform chests. Generated embroidery is an illustrative rendering of the supplied mark. Original PNGs and revised PNGs are retained locally; 480/800/1200 WebP variants are published. Crest derivatives use lossless WebP. Real campus and leadership photography is retained. Class cards intentionally reuse their own programme's scene as navigation; related homepage teasers reuse the matching destination image. Hero, daycare and weekly nature activity retain their established appropriate imagery, with responsive WebP conversion. See image-provenance.json and image-inventory.json.

## D. Performance

Self-hosted licensed fonts, font preloads, minified CSS/JS, content-versioned asset references, responsive images, explicit dimensions, lazy secondary imagery and optimized logo delivery. Worker HTML revalidates, versioned assets cache immutably, and unversioned assets retain bounded caching. GitHub Pages controls its own HTTP cache headers.

| Mobile page | Performance score before → after | LCP before → after | Final CLS |
|---|---|---|---|
| admissions.html | 97 → 93 | 2.49 → 3.02 s | 0.0002 |
| daycare.html | 99 → 97 | 1.88 → 2.51 s | 0.0000 |
| index.html | 80 → 93 | 3.86 → 3.04 s | 0.0000 |
| pre-nursery.html | 98 → 97 | 1.88 → 2.49 s | 0.0000 |

Final correctly configured desktop Lighthouse scores are 100 performance/accessibility/best practices/SEO on all four sampled pages. Final mobile accessibility, best practices and SEO scores are 100 on all four. These are single local lab runs; some mobile results regressed, particularly Admissions. They do not establish field Core Web Vitals or real-user INP. Historical runs labelled desktop used an ineffective preset flag; they are excluded from before/after comparisons. Raw reports are retained locally in .sites-runtime/before and .sites-runtime/final-v2. See performance-summary.json for complete metrics.

## E. SEO and search intent

Mapped 11 canonical pages to distinct Zirakpur parent intents: preschool/play school, age-stage comparisons, each class, individual learning support, activities, daycare and admissions visits. Updated unique titles/descriptions, OG/Twitter metadata, breadcrumbs and internal links. Removed keyword stuffing, unsupported superlatives and unverified geography/schema fields. SAS Nagar is used as the district context for Zirakpur. NAP and official telephone/WhatsApp details are consistent. See seo-query-map.md and page-inventory.json.

## F. Structured data

Preschool, WebSite, WebPage/AboutPage/ContactPage, BreadcrumbList, PostalAddress, ImageObject and About-page Person. Preschool is the specific school type; no fabricated ratings, awards, coordinates, founding date or price range. JSON syntax, entity links, required site metadata and canonical URLs are locally validated. Schema.org type documentation was consulted. No authenticated Google rich-result/indexing status is claimed; external validator acceptance was not obtained.

## G. Sitemap and robots

Sitemap contains exactly 11 canonical production URLs under https://www.kabirainternational.com/. Robots allows public crawling, excludes /api/, and points to the sitemap. Public canonical pages have no accidental noindex. Legacy experience.html is excluded and marked noindex with the new canonical. Worker redirects index.html and experience.html with 301. On GitHub Pages the legacy experience URL uses the existing client/meta redirect; index.html relies on the root canonical. Branded 404 is noindex and returns 404 for unknown routes.

## H–J. Google actions actually performed

| Action | Outcome |
|---|---|
| Search-intent research and on-site readiness | Completed |
| GSC property, coverage, manual actions and field CWV audit | Not performed: no connected authenticated GSC access |
| GSC sitemap submission | Not submitted |
| URL inspections and indexing requests | None submitted |
| Google Business Profile ownership, category/hours/profile audit | Not performed: no connected authenticated GBP access |
| GBP edits or publication | None |

A connector option was surfaced during the task. No sign-in, ownership verification, Google submission or ranking success is inferred from that suggestion.

## K. External limits

GSC and GBP require connected owner access. Google controls crawling, indexing and ranking. GitHub Pages has limited server redirect/cache control. Embedded Google Maps did not render during local screenshot checks; the separate directions link remains available. No school enquiry was submitted to production by release tests.

## L. Tests, build and deployment

- Structural/content validator: pass (11 canonical, one utility, one legacy route).
- Admissions backend: 12 offline tests pass, including validation, consent, rate caps, idempotency, failure handling, Excel export, secret configuration and HTML escaping.
- Browser interactions: nine checks pass, including consent, failed-request preservation, same-ID retry, success receipt, uniform dialog keyboard behavior, HTTP routes and caching.
- Responsive/axe audit: 110 renders pass, with additional targeted overlap regression checks.
- Production build: staged public assets and Worker generated successfully; GitHub workflow now validates/tests/builds before publishing.
- Admissions export security fix was deployed separately and the previously exposed credential was verified to return 404. Replacement credential is a Cloudflare secret and the owner link remains in ignored local .asset-sources/admissions-owner-access.txt.
- Final publishing and live verification results are recorded in the task completion message and local .sites-runtime/live-verification.json. Existing D1 schema/records are preserved.

Safety checkpoint branch: release-checkpoint-2026-09-15 at 070a6b2abe58c945861a8310f3092467b9e1e583. Rolling back the frontend must not restore the old hardcoded export credential.
