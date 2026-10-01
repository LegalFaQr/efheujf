# Cloudflare hosting migration

Started 1 October 2026, from the approved release `f6f59bf41ee7fbfa8e2466a371c74cb28d4c6d8e`.

The school’s design, content, navigation, fonts, images, `.html` page addresses, canonical metadata and admissions API destination are preserved. The Pages build copies the existing public bundle unchanged, then adds only hosting-specific routing files. The original public deployment and all 22 GoDaddy DNS records were recorded locally before any domain change.

The frontend and admissions backend remain separate. `wrangler.toml` configures the Pages frontend. `wrangler.api.toml` contains the previous Worker configuration, with the existing D1 database and rate limiter. The backend is not redeployed or migrated as part of the frontend switch.

Cloudflare Pages is connected to the GitHub repository’s `main` branch. Its build command validates the site, runs the offline backend tests and prepares the Pages bundle. GitHub also runs browser, accessibility and responsive checks, plus a real Pages-runtime test. Temporary Pages preview hosts are noindex; browser admission tests intercept API requests.

Release sequence: validate a separate Pages deployment, preserve email/verification DNS records while configuring the domain, verify HTTPS and production behaviour, drain DNS caches with the old deployment available, then retire GitHub Pages and make the source repository private. The migration is complete only after these external checks pass.

Rollback before retiring GitHub Pages: restore the recorded website DNS targets while retaining all mail and verification records. The original public bundle and release commit remain available. After retirement, Cloudflare deployment rollback is the primary recovery path; restoring GitHub hosting also requires enabling Pages and a compatible repository visibility/plan.

Verification evidence and final external status are recorded under `.sites-runtime/migration/` and in the task’s completion response.
