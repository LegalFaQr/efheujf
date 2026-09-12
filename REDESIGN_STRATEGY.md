# Kabira International Website Redesign Strategy

## Business objective

Turn the website into a clear admissions journey for parents comparing preschools and daycare options in Zirakpur. Every page should answer one parent question, build confidence, and offer a direct next step: explore a programme, understand admissions, or plan a school visit.

## Positioning

**A beautiful beginning, thoughtfully led.** Kabira combines a nurturing early-years environment, modern learning, and Indian values under the leadership of Dr. Rita Ratan, an educator with nearly 28 years of experience.

Primary audience: parents of children aged 2–5 in Zirakpur and nearby areas seeking Pre-Nursery, Nursery, LKG, UKG, or dependable full-day care.

Primary conversion: plan a school visit. Secondary conversions: explore programmes and review the admission process.

## Visual system: The Woven Beginning

The design uses the school’s deep navy and growth green on warm ivory, with a restrained marigold accent. Fine thread lines, small knots, and interlaced borders reference Sant Kabir’s association with weaving and wisdom. They remain abstract, quiet, and editorial.

- Navy establishes trust and contrast.
- Green signals growth and care.
- Ivory makes the experience warm and calm.
- Serif display type gives the school a timeless voice; a system sans-serif keeps information fast and legible.
- Photography carries the emotion. Cards and iconography support it without turning the site into a generic, colourful preschool template.

## Sitemap and page roles

1. **Home** — concise sales page: promise, trust, leadership, programme fit, environment, emotional story, parent assurance, and visit CTA.
2. **About** — philosophy, values, the meaning of Kabira, educational approach, and planned growth.
3. **Programs** — decision guide for Pre-Nursery, Nursery, LKG, and UKG with age, focus, outcomes, and a simple comparison.
4. **Daycare** — routine, care principles, hours, rest/play rhythm, and parent assurance.
5. **Admissions** — 2026–27 availability, five-step journey, documents, FAQs, and visit planning.
6. **Campus & Facilities** — child-scale design principles, planned spaces, health, hygiene, and safeguarding approach.
7. **Principal’s Message** — Dr. Rita Ratan’s portrait, experience, educational conviction, and full message.
8. **Contact** — address, map/directions, visit planner, and admission links. Phone numbers, email addresses, and WhatsApp links are intentionally omitted.

## Homepage conversion sequence

1. **Hero:** local, specific promise with “Plan a School Visit” and “Explore Programs”.
2. **Trust strip:** Pre-Nursery–UKG, Daycare 7 AM–7 PM, nearly 28 years of leadership, Zirakpur.
3. **Why parents choose Kabira:** four concise proof-led reasons.
4. **Leadership:** Dr. Rita Ratan as the strongest human trust signal.
5. **Programmes:** four age-led cards with one-line outcomes; full detail stays on Programs.
6. **Campus preview:** safe, calm, child-scale environment with honest language for planned spaces.
7. **Emotional story:** a short “woven beginnings” passage connecting learning, values, and belonging.
8. **Parent assurance:** concrete expectations in place of invented testimonials.
9. **Final CTA:** admissions 2026–27 and a short route to plan a visit.

## Page-level conversion copy

- Hero: **“A confident beginning starts with feeling at home.”**
- Supporting line: “Preschool and daycare in Zirakpur where curious minds grow through joyful learning, thoughtful care, and Indian values.”
- Leadership: **“Nearly 28 years in education. One deeply personal promise.”**
- Programme lead: **“The right challenge, at the right age.”**
- Campus lead: **“Designed at a child’s height.”**
- Emotional story: **“Every strong future begins with a few careful threads.”**
- Final CTA: **“Come see how your child could begin at Kabira.”**

## Mobile and accessibility decisions

- Compact 64–72 px sticky header with a visible “Visit” action and a bottom mobile action dock.
- Full-screen menu groups the eight destinations and surfaces Admissions first.
- Fluid type with conservative `clamp()` ranges prevents oversized mobile headings and undersized desktop body copy.
- Images use responsive aspect ratios, `object-position`, `srcset`, lazy loading, and explicit dimensions to avoid cut-off faces and layout shift.
- Semantic landmarks, keyboard-visible focus states, descriptive alt text, labelled forms, 44 px touch targets, and reduced-motion support.

## Performance and motion

- Static multi-page HTML, one shared stylesheet, and one small progressive-enhancement script.
- System fonts remove font downloads. Responsive compressed images keep the hero prioritised and defer lower-page media.
- Motion uses CSS transforms and opacity, coordinated by one IntersectionObserver. Thread lines draw in, cards rise slightly, and the hero image drifts by a few pixels. Effects stop for `prefers-reduced-motion` and are reduced on small screens.

## Local SEO

Each page gets a unique title and description mentioning its specific service and Zirakpur where natural. The site uses one clear H1 per page, consistent school/address data, descriptive links, Open Graph metadata, and School/Preschool JSON-LD without publishing phone or email details.
