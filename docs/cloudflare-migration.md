# Cloudflare hosting migration

Started 1 October 2026, from the approved release `f6f59bf41ee7fbfa8e2466a371c74cb28d4c6d8e`.

The school’s design, content, navigation, fonts, images, `.html` page addresses, canonical metadata and admissions API destination are preserved. The Pages build copies the existing public bundle unchanged, then adds only hosting-specific routing files. The original public deployment and all 22 GoDaddy DNS records were recorded locally before any domain change.

The frontend and admissions backend remain separate. `wrangler.toml` configures the Pages frontend. `wrangler.api.toml` contains the previous Worker configuration, with the existing D1 database and rate limiter. The backend is not redeployed or migrated as part of the frontend switch.

Cloudflare Pages is connected to the GitHub repository’s `main` branch. Its build command validates the site, runs the offline backend tests and prepares the Pages bundle. GitHub also runs browser, accessibility and responsive checks, plus a real Pages-runtime test. Temporary Pages preview hosts are noindex; browser admission tests intercept API requests.

Release sequence: validate a separate Pages deployment, preserve email/verification DNS records while configuring the domain, verify HTTPS and production behaviour, drain DNS caches with the old deployment available, then retire GitHub Pages and make the source repository private. The migration is complete only after these external checks pass.

Rollback before retiring GitHub Pages: restore the recorded website DNS targets while retaining all mail and verification records. The original public bundle and release commit remain available. After retirement, Cloudflare deployment rollback is the primary recovery path; restoring GitHub hosting also requires enabling Pages and a compatible repository visibility/plan.

Verification evidence and final external status are recorded under `.sites-runtime/migration/` and in the task’s completion response.

## Domain cutover verified on 1 October 2026

The user approved the domain switch and subsequent repository privacy change. GoDaddy now delegates to `alexia.ns.cloudflare.com` and `miles.ns.cloudflare.com`; domain registration remains at GoDaddy. Both the apex and `www` Pages hostnames have active HTTPS. The apex permanently redirects to the existing canonical `www` address while preserving paths and query strings. HTTP redirects to HTTPS.

All 14 non-website DNS records were retained, including school mail, Resend mail authentication, Google verification and autodiscovery. Cloudflare's automatic email-address obfuscation was disabled because it rewrote the existing email links and injected a script incompatible with the site's strict CSP. No application source, admissions data, Worker deployment or backend secret was changed.

The GitHub-connected deployment at `475ff3d` succeeded. All 85 public files on the Cloudflare endpoint matched the approved GitHub release byte for byte, including all HTML, styles, scripts, photographs and fonts. Production checks explicitly bypassed stale DNS using a verified Cloudflare address while retaining normal TLS certificate validation. Browser checks passed 33 production renders at desktop, tablet and mobile sizes. Admissions interaction tests used intercepted responses and sent no production enquiries.

Repository privacy remains pending while DNS caches expire. Direct queries to the retired GoDaddy nameservers still return the GitHub hosting records, and GoDaddy rejects record edits after delegation moves away. Do not retire GitHub Pages or make this Free-plan repository private prematurely. The conservative earliest completion time is **3 October 2026, 05:45 UTC (11:15 India time)**, allowing 48 hours for nameserver propagation plus the old one-hour `www` cache duration. Recheck both custom domains, public DNS, file integrity and the unchanged admissions API before retiring the fallback. Then change the GitHub workflow to validation only, make the repository private, push a documentation-only commit and confirm the GitHub-connected Cloudflare deployment succeeds from the private repository.
