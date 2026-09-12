# Kabira The International School

Responsive school website in `dist/`, privately hosted through the existing Sites project.

## Preview
Run `python -m http.server 4173 --directory dist` and open `http://127.0.0.1:4173`.

## September redesign
- Parent journey: admissions and age groups, learning experience, leadership and care, school identity and values, future growth, admissions process and visit information.
- Compact 64px mobile header, explicit admissions link and persistent bottom parent actions.
- Keyboard-accessible programme tabs, responsive uniform dialog, mobile navigation and FAQs.
- Entry animations, scroll reveals, staggered content and interaction transitions. Reduced-motion preference is respected.
- New supplied high-resolution Logo.jpg copied without altering the artwork.
- Four regenerated illustrative assets with Kabira uniform branding, including a full-length uniform collection. Intrinsic proportions and contain sizing prevent cropping.
- Optimised JPEG exports and 768px responsive sources reduce mobile transfer size.
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
