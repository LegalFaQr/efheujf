# Kabira Website Implementation Notes

## Architecture

The redesign is a framework-free static site with eight HTML pages, one shared stylesheet, and one small JavaScript file. The source templates live in `scripts/build-site.mjs`; `scripts/build.mjs` creates the final files in `dist` and normalizes generated markup.

Build:

```powershell
node scripts\build.mjs
```

Validate:

```powershell
node scripts\validate-redesign.mjs
node --check dist\app.js
```

## Conversion design

- The homepage follows a parent decision sequence: emotional promise → fast facts → reasons to trust → experienced leadership → age fit → campus intent → values → open visit invitation → final admissions action.
- Detailed content moved to dedicated Programs, Daycare, Admissions, Campus, About, Principal, and Contact pages, keeping the homepage concise.
- “Plan a school visit” is the primary action. “Explore programs” and “View admissions” support parents who need more information first.
- Mobile users always see Admissions in the header and Programs / Plan a Visit in the bottom action dock.
- The trust section uses concrete expectations rather than fabricated parent testimonials. Real quotations can be added later with permission.

## Contact constraint

No school phone number, email address, `tel:` link, `mailto:` link, or WhatsApp destination appears in the website. The Contact page contains a browser-only visit planner that does not transmit or store personal information. It is ready to be connected to an approved enquiry backend later.

## Visual and image decisions

- The “Woven Beginning” visual system combines deep navy, growth green, warm ivory, and a restrained marigold accent.
- Fine lines, knots, and interlaced patterns reference Sant Kabir’s association with weaving without using literal devotional imagery.
- A compact 512 px brand mark is derived from the supplied high-resolution logo. The original high-resolution logo remains available in `dist/assets/kabira-logo-hd.jpg`.
- The supplied photos of Dr. Rita Ratan informed an identity-preserving professional portrait. Full and mobile JPEG variants are stored at `dist/assets/dr-rita-ratan.jpg` and `dist/assets/dr-rita-ratan-small.jpg`.
- Generated school scenes are labelled as illustrative visuals. Their layout uses native aspect ratios and `object-fit: contain` on mobile to prevent cut-off faces or uniforms.

## Performance

- No framework, runtime package, icon library, or web-font request is shipped.
- The hero image is responsive and preloaded; lower-page images lazy-load and decode asynchronously.
- Explicit image dimensions reduce layout shift.
- The responsive portrait is approximately 250 KB full-size and 53 KB on mobile.
- The mobile navigation and visit planner use progressive enhancement and remain small enough for a single shared script.

## Motion and accessibility

- One IntersectionObserver coordinates reveal motion; CSS handles transforms and opacity.
- Thread lines draw once, cards lift slightly, and image scale is restrained.
- `prefers-reduced-motion` removes movement and smooth scrolling.
- The site uses semantic landmarks, one H1 per page, labelled controls, clear focus states, 44 px minimum touch targets, descriptive alt text, and high-contrast body copy.

## SEO

- Every page has a unique title, description, canonical URL, Open Graph data, and local Zirakpur language.
- Preschool/educational-organization structured data includes the verified school identity, trust, address, and service area without contact details.
- Admissions FAQ structured data mirrors the visible FAQ content.
- `robots.txt`, `sitemap.xml`, and a web app manifest are included.
