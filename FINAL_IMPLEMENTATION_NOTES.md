# Kabira Final Implementation Notes

## Build

The final website is generated with:

```powershell
node scripts\build-release.mjs
```

The command creates exactly three public pages in `dist`:

- `index.html`
- `experience.html`
- `admissions.html`

Validation:

```powershell
node scripts\validate-final.mjs
node --check dist\app.js
```

## User-facing changes

- The design combines the modern editorial direction with the previous version’s fuller storytelling and stronger visual continuity.
- Percentage-based arch masks were removed from images and portraits. Images now keep their native aspect ratios within consistent rectangular frames.
- Body copy and supporting text are larger on desktop and mobile.
- Programs, daycare, campus, philosophy, and the Director & Principal message are consolidated into The Kabira Experience.
- Admission steps, documents, FAQ, visit planner, address, and map are consolidated into Admissions & Visit.
- Every reference uses **Dr. Rita Rattan, Director & Principal**.

## Mobile experience

- The header remains compact and keeps Admissions visible.
- The menu contains only the three primary destinations.
- A fixed bottom action dock provides direct access to Programs and Plan a Visit.
- Program cards use horizontal snap scrolling on small screens.
- Images use their full composition on mobile without forced cropping.

## Performance and accessibility

The site uses static HTML, one stylesheet, and one small progressive-enhancement script. It does not ship a framework, web-font request, or icon library. Images include responsive local sources, explicit dimensions, and lazy loading below the fold. Motion uses transforms and opacity through a single IntersectionObserver and stops when reduced motion is requested.

The final validator checks all three routes, local links and anchors, image metadata, structured data, sitemap count, leadership naming, contact-detail exclusions, and absence of arch-shaped image masks.

## Contact constraint

No school phone number, email address, `tel:` link, `mailto:` link, or WhatsApp destination appears in the site. The visit planner stays in the browser and does not transmit or store personal details.
