# Kabira International

A responsive, dependency-free school website. The authored site is in `dist/` and can be served by any static web host. Sites configuration is in `.openai/hosting.json`.

## Preview

Run `python -m http.server 4173 --directory dist` and open `http://localhost:4173`.

## Content and updates

- `dist/index.html`: school content, navigation, programme cards, FAQ and visit information.
- `dist/styles.css`: navy, green and white theme and responsive layouts.
- `dist/app.js`: programme details, accessible dialogs and mobile navigation.
- Add future classes to both the programme cards and the `programmes` object, and update the FAQ and admissions list when classes actually open.
- School telephone numbers and email addresses are deliberately excluded, including contact links. The visit section provides directions. There is no online booking backend or collection of personal information.
- No invented parent testimonials or real-campus claims are included.

## Assets

The logo and uniform designs were supplied by the school. The classroom image is an AI-generated illustrative scene, not a photograph of the school or its pupils. The site labels it accordingly. Replace it with authorised real campus photography when available.

Built-in image-generation prompt: Photorealistic premium editorial preschool hero; fictional contemporary Indian classroom, three Indian children aged 3–5 and an Indian woman teacher playing with wooden blocks, navy/green/white uniforms, natural wood and daylight, greenery outside, subjects middle/right with quieter left background; no text, logos, watermark or UI.

## Validation

JavaScript syntax checked. Desktop and 390px mobile layouts inspected. Programme dialog, Escape dismissal, mobile navigation, FAQ expansion and uniform gallery verified in-browser. Internal anchors and loaded images checked; no mobile horizontal overflow found. Phone, email and messaging links excluded.
