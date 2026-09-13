# Kabira The International School

Premium three-page preschool and daycare website for Kabira in Zirakpur, Punjab.

## Pages

- Home: `dist/index.html`
- The Kabira Experience: `dist/experience.html`
- Admissions & Visit: `dist/admissions.html`

## Build and validation

```powershell
node scripts\build-release.mjs
node scripts\validate-final.mjs
node --check dist\app.js
```

Local preview:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173/index.html`.

## Design

The final design combines modern editorial hierarchy with the previous site’s richer visual rhythm. Deep navy, growth green, warm cream, and restrained gold form one consistent system. Fine weave lines reference Sant Kabir’s association with thread and simplicity without overlapping content.

Images use natural aspect ratios inside rectangular frames, with responsive mobile sources and no arch-shaped masks. Generated school scenes are labelled as illustrative. Dr. Rita Rattan appears as Director & Principal using an identity-preserving professional portrait derived from the supplied photographs.

## Content and privacy

Current programs are Pre-Nursery, Nursery, LKG, UKG, and Daycare. The long-term class expansion plan is described conditionally. No school phone number, email address, messaging link, internal financial information, or unsupported campus claim is published.

The visit planner works locally in the browser. It does not submit or store personal data.
