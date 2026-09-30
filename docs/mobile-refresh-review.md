# Mobile content and design refresh — 30 September 2026

Kabira is a preschool and daycare in Zirakpur, run by Bhattacharya Educational Trust. The website invites parents to understand the school, choose an age-appropriate programme, meet its leadership and enquire or arrange a visit. Its message is personal attention, play-based learning, Indian values and a caring beginning: Grow · Learn · Bloom.

The existing navy/green palette, DM Sans, Playfair Display, school crest, authentic campus and leadership photographs, and clearly labelled illustrative learning images are retained.

## Changes

- Added the school-supplied messages: a limited-time admission-fee waiver, no annual charges, well-trained experienced English-fluent staff, leadership by Dr. Rita Rattan with 28 years of teaching and school experience, an NEP 2020 approved syllabus, and one higher class added each year.
- Added visual commitment panels to Home and Admissions and a curriculum/growth section to Programmes; included fee and curriculum answers in the admissions FAQ.
- Shortened programme and other page introductions; moved each programme's learning image into its introduction; the oversized campus image was removed from the About introduction after review.
- Made mobile programme and trust cards compact grids, improved spacing and typography, and provided expandable secondary reading. The full Director's message remains available, and desktop reading is expanded.
- Kept these overrides in mobile-refresh.css, loaded after the existing stylesheets.
- Corrected the visual audit to exclude hidden images that browsers deliberately defer loading.

## Verification

- Static validation passes for all 11 canonical pages, metadata, structured data, links, images and sitemap.
- All 12 admission API tests pass.
- Admissions browser tests pass, including consent, retry, error recovery, programme selection and uniform dialog. No production enquiries were submitted.
- Visual audit: 110 renders across 10 widths, from 360 to 1920 pixels; zero failing checks. Accessibility checks run at 390 and 1440 pixels.
- Desktop and mobile screenshots were inspected locally.

## Review and subsequent release

This refresh was initially shown in a local preview before publication. The subsequent audit and publication were explicitly authorized by the owner. The current local preview is http://127.0.0.1:4181. See full-audit-2026-09-30.md for security, backend, SEO and release details.
