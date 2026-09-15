/**
 * Comprehensive SEO upgrade script for Kabira The International School
 * Run with: node scripts/seo-update.mjs
 *
 * Targets queries:
 * - "school", "best school"
 * - "pre school", "preschool", "best pre schools"
 * - "kabira school", "kabira international school"
 * - "best playway", "playway school", "play school"
 * - Local intent (Zirakpur, Patiala Road, Chandigarh, Mohali, Panchkula)
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

// ── Shared school schema block ────────────────────────────────────────────────
const SCHOOL_SCHEMA = {
  '@type': ['School', 'Preschool', 'ChildCare'],
  '@id': 'https://www.kabirainternational.com/#school',
  name: 'Kabira The International School',
  alternateName: [
    'Kabira International School',
    'Kabira School',
    'Kabira School Zirakpur',
    'Kabira Preschool Zirakpur',
    'Kabira Pre School',
    'Kabira Playway School',
    'Kabira Play School Zirakpur',
    'Kabira The International School Patiala Road',
    'Best Preschool in Zirakpur',
    'Best Playway in Zirakpur',
    'Best School in Zirakpur',
  ],
  description:
    'Kabira The International School — ranked among the best pre schools, playway and daycare centres in Zirakpur, Punjab, near Chandigarh and Mohali. Pre-Nursery, Playway, Nursery, LKG, UKG and daycare from 8:30 AM to 6:30 PM.',
  url: 'https://www.kabirainternational.com/',
  logo: 'https://www.kabirainternational.com/assets/kabira-crest.png',
  image: 'https://www.kabirainternational.com/assets/kabira-campus.jpg',
  telephone: '+91-91151-04300',
  email: 'info@kabirainternational.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road',
    addressLocality: 'Zirakpur',
    addressRegion: 'Punjab',
    postalCode: '140603',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: '30.6461', longitude: '76.8197' },
  hasMap: 'https://maps.google.com/?q=Kabira+The+International+School+Zirakpur+Punjab',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '18:30',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Zirakpur' },
    { '@type': 'City', name: 'Mohali' },
    { '@type': 'City', name: 'Chandigarh' },
    { '@type': 'City', name: 'Panchkula' },
    { '@type': 'City', name: 'Dera Bassi' },
    { '@type': 'AdministrativeArea', name: 'Patiala Road Zirakpur' },
    { '@type': 'AdministrativeArea', name: 'VIP Road Zirakpur' },
    { '@type': 'AdministrativeArea', name: 'Dhakoli' },
    { '@type': 'AdministrativeArea', name: 'Baltana' },
    { '@type': 'State', name: 'Punjab' },
  ],
  parentOrganization: { '@type': 'Organization', name: 'Bhattacharya Educational Trust' },
  foundingDate: '2025',
  priceRange: '₹₹',
};

const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  name: 'Kabira The International School',
  url: 'https://www.kabirainternational.com/',
};

// ── Geo meta tags (same on every page) ───────────────────────────────────────
const GEO_METAS = [
  '<meta name="geo.region" content="IN-PB">',
  '<meta name="geo.placename" content="Zirakpur, Punjab, India">',
  '<meta name="geo.position" content="30.6461;76.8197">',
  '<meta name="ICBM" content="30.6461, 76.8197">',
].join('');

const KEYWORDS_META = '<meta name="keywords" content="kabira school, kabira international school, best pre schools, best preschool in zirakpur, best playway in zirakpur, playway school, play school, best school in zirakpur, preschool patiala road, daycare zirakpur, preschool near chandigarh">';

// ── Per-page config ───────────────────────────────────────────────────────────
const PAGES = {
  'index.html': {
    title: 'Kabira The International School | Best Preschool, Playway & Daycare in Zirakpur',
    desc: 'Kabira The International School — Ranked among the best pre schools, playway and daycare centres in Zirakpur (Patiala Road near Chandigarh). Pre-Nursery (Playway), Nursery, LKG, UKG. Admissions open 2026–27.',
    ogTitle: 'Kabira The International School | Best Preschool, Playway & Daycare in Zirakpur',
    ogDesc: 'Leading preschool, playway and daycare in Zirakpur, Punjab near Chandigarh. Pre-Nursery (Playway), Nursery, LKG, UKG. Patiala Road. Admissions open 2026–27.',
    ogUrl: 'https://www.kabirainternational.com/',
    extraSchema: [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which is the best preschool and playway school in Zirakpur?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kabira The International School is widely recognised as one of the best pre schools and playway centres in Zirakpur, Punjab. Located on Patiala Road near Chandigarh, Kabira offers nurturing early education for Pre-Nursery (Playway), Nursery, LKG, UKG and daycare under the leadership of Dr. Rita Rattan.',
            },
          },
          {
            '@type': 'Question',
            name: 'What age groups are admitted at Kabira School Zirakpur?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kabira School admits children starting from 2 years old in Playway / Pre-Nursery, 3 years in Nursery, 4 years in LKG, and 5 years in UKG, alongside extended daycare from 8:30 AM to 6:30 PM.',
            },
          },
          {
            '@type': 'Question',
            name: 'What makes Kabira one of the best schools for early childhood in Zirakpur?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kabira School combines small class sizes (around 20 children per class), activity and play-based learning, experienced leadership with nearly 28 years of educational expertise, safe campus infrastructure, and a focus on Indian values and holistic child development.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Kabira International School near Chandigarh and Mohali?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Kabira The International School is conveniently located on Patiala Road (#1105 Dashmesh Colony, behind Pearlwood Hotel) in Zirakpur, making it easily accessible for families from Zirakpur, Chandigarh, Mohali, and Panchkula.',
            },
          },
        ],
      },
    ],
    breadcrumb: null,
  },
  'about.html': {
    title: 'About Kabira School | Best Preschool & Daycare in Zirakpur',
    desc: 'About Kabira The International School — leading preschool, playway and daycare in Zirakpur, Punjab, near Chandigarh. Led by Dr. Rita Rattan with nearly 28 years of educational leadership.',
    ogTitle: 'About Kabira School | Best Preschool & Daycare in Zirakpur',
    ogDesc: 'Our story, values and educational leadership behind Kabira International School, Patiala Road, Zirakpur, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/about.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'About Kabira', item: 'https://www.kabirainternational.com/about.html' },
    ],
  },
  'experience.html': {
    title: 'Learning at Kabira | Our Educational Approach, Zirakpur',
    desc: 'How Kabira The International School in Zirakpur, Punjab combines play, activity and age-appropriate academics — a world-class preschool approach, near Chandigarh and Mohali.',
    ogTitle: 'Learning at Kabira | Preschool Approach, Zirakpur, Punjab',
    ogDesc: 'How Kabira combines play, activity and age-appropriate academics to support whole-child development. Preschool in Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/experience.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Learning at Kabira', item: 'https://www.kabirainternational.com/experience.html' },
    ],
  },
  'programmes.html': {
    title: 'School Programmes: Playway to UKG | Kabira, Zirakpur',
    desc: 'Explore Playway (Pre-Nursery 2+), Nursery (3+), LKG (4+) and UKG (5+) at Kabira International School — Patiala Road, Zirakpur, Punjab, near Chandigarh and Mohali. Admissions open.',
    ogTitle: 'School Programmes: Playway to UKG | Kabira, Zirakpur',
    ogDesc: 'Playway, Pre-Nursery, Nursery, LKG and UKG at Kabira International School, Zirakpur, Punjab — a steady, age-appropriate journey near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/programmes.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
    ],
  },
  'pre-nursery.html': {
    title: 'Pre-Nursery & Playway School in Zirakpur | Kabira The International School',
    desc: 'Pre-Nursery and Playway at Kabira International School, Zirakpur — gentle, play-based learning for children 2+ years. One of the best playway schools near Chandigarh on Patiala Road, Punjab. Admissions open 2026–27.',
    ogTitle: 'Pre-Nursery & Playway School in Zirakpur | Kabira The International School',
    ogDesc: 'A gentle first step into school life for children 2+ years. Play-based Pre-Nursery and Playway school near Chandigarh, Patiala Road, Zirakpur, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/pre-nursery.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
      { pos: 3, name: 'Pre-Nursery', item: 'https://www.kabirainternational.com/pre-nursery.html' },
    ],
  },
  'nursery.html': {
    title: 'Nursery School in Zirakpur | Kabira The International School',
    desc: 'Nursery school at Kabira International School, Zirakpur — for children 3+ years. Language, early numeracy and creativity. Near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'Nursery School in Zirakpur | Kabira The International School',
    ogDesc: 'For children 3+ years. Building language, early numeracy and creativity at Kabira International, Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/nursery.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
      { pos: 3, name: 'Nursery', item: 'https://www.kabirainternational.com/nursery.html' },
    ],
  },
  'lkg.html': {
    title: 'LKG School in Zirakpur | Kabira The International School',
    desc: 'LKG kindergarten at Kabira International School, Zirakpur — for children 4+ years. Phonics, reading, numeracy and school readiness near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'LKG School in Zirakpur | Kabira The International School',
    ogDesc: 'For children 4+ years. Phonics, reading, number concepts and confident independence at Kabira International, Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/lkg.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
      { pos: 3, name: 'LKG', item: 'https://www.kabirainternational.com/lkg.html' },
    ],
  },
  'ukg.html': {
    title: 'UKG School in Zirakpur | Kabira The International School',
    desc: 'UKG kindergarten at Kabira International School, Zirakpur — for children 5+ years. School-readiness, literacy and mathematics near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'UKG School in Zirakpur | Kabira The International School',
    ogDesc: 'For children 5+ years. Building reading readiness, mathematics and independence at Kabira International, Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/ukg.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
      { pos: 3, name: 'UKG', item: 'https://www.kabirainternational.com/ukg.html' },
    ],
  },
  'enrichment.html': {
    title: 'Enrichment at Kabira | Dance, Music & Abacus, Zirakpur',
    desc: 'Enrichment classes at Kabira International School, Zirakpur — dance, music and abacus, plus weekly special activities. Best preschool enrichment near Chandigarh, Punjab.',
    ogTitle: 'Enrichment at Kabira | Dance, Music & Abacus, Zirakpur',
    ogDesc: 'Regular dance, music and abacus enrichment at Kabira International School, Zirakpur — near Chandigarh, Patiala Road, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/enrichment.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Enrichment', item: 'https://www.kabirainternational.com/enrichment.html' },
    ],
  },
  'daycare.html': {
    title: 'Best Daycare in Zirakpur | Kabira The International School',
    desc: 'Best daycare at Kabira International School, Zirakpur — 8:30 AM to 6:30 PM. Safe, nurturing care for working families near Chandigarh, Patiala Road, Punjab.',
    ogTitle: 'Best Daycare in Zirakpur | Kabira The International School',
    ogDesc: 'A calm, secure and homely daycare for working families. 8:30 AM–6:30 PM at Kabira International School, Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/daycare.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Daycare', item: 'https://www.kabirainternational.com/daycare.html' },
    ],
  },
  'inclusive-learning.html': {
    title: 'Inclusive Learning Support | Kabira The International School',
    desc: 'Inclusive learning support at Kabira International School, Zirakpur — a thoughtful, family-centred approach for children with additional needs. Near Chandigarh, Punjab.',
    ogTitle: 'Inclusive Learning Support | Kabira The International School',
    ogDesc: 'How Kabira approaches children with additional learning needs — through conversation with families. Preschool in Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/inclusive-learning.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Inclusive Learning', item: 'https://www.kabirainternational.com/inclusive-learning.html' },
    ],
  },
  'admissions.html': {
    title: 'School Admissions 2026–27 | Kabira International School, Zirakpur',
    desc: 'Admissions open for Playway, Pre-Nursery, Nursery, LKG, UKG & Daycare at Kabira School, Zirakpur. Enrol your child in one of the best pre schools near Chandigarh, Patiala Road, Punjab.',
    ogTitle: 'School Admissions Zirakpur 2026–27 | Kabira International School',
    ogDesc: 'Admissions open for Playway, Pre-Nursery, Nursery, LKG, UKG and Daycare at Kabira International School, Zirakpur, Punjab. Send an enquiry or arrange a visit.',
    ogUrl: 'https://www.kabirainternational.com/admissions.html',
    extraSchema: [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which programmes are available at Kabira International School Zirakpur?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kabira The International School offers Playway (Pre-Nursery 2+ years), Nursery (3+), LKG (4+), UKG (5+) and Daycare from 8:30 AM to 6:30 PM. The school is located on Patiala Road, Zirakpur, Punjab.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the school timings at Kabira International School Zirakpur?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Regular preschool hours are 9:00 AM to 12:30 PM. Daycare is available from 8:30 AM to 6:30 PM, Monday to Saturday.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can families visit Kabira International School before admission?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Families are encouraged to visit the campus before registration. Kabira The International School is located at #1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road, Zirakpur, Punjab — near Chandigarh and Mohali.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Kabira International School near Chandigarh?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Kabira The International School is located in Zirakpur, Punjab, on Patiala Road — just a short distance from Chandigarh and Mohali, making it convenient for families in these areas.',
            },
          },
          {
            '@type': 'Question',
            name: 'What age groups does Kabira International School admit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kabira International School admits children from 2 years of age in Playway / Pre-Nursery, 3+ years in Nursery, 4+ years in LKG, and 5+ years in UKG.',
            },
          },
        ],
      },
    ],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Admissions', item: 'https://www.kabirainternational.com/admissions.html' },
    ],
  },
};

// ── Build schema JSON-LD block ────────────────────────────────────────────────
function buildSchema(pageKey) {
  const cfg = PAGES[pageKey];
  const graph = [SCHOOL_SCHEMA, WEBSITE_SCHEMA, ...cfg.extraSchema];
  if (cfg.breadcrumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: cfg.breadcrumb.map(b => ({
        '@type': 'ListItem',
        position: b.pos,
        name: b.name,
        item: b.item,
      })),
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

// ── Update each HTML file ─────────────────────────────────────────────────────
let updated = 0;
for (const [file, cfg] of Object.entries(PAGES)) {
  const filePath = path.join(dist, file);
  let html = await readFile(filePath, 'utf8');

  // 1. Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${cfg.title}</title>`);

  // 2. Meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${cfg.desc}">`,
  );

  // 3. Keywords meta tag
  if (html.includes('<meta name="keywords"')) {
    html = html.replace(/<meta name="keywords"[^>]*>/, KEYWORDS_META);
  } else {
    html = html.replace('<meta property="og:type"', `${KEYWORDS_META}\n  <meta property="og:type"`);
  }

  // 4. OG tags
  html = html.replace(
    /<meta property="og:type"[^>]*>(<meta property="og:[^>]*>)*(<meta name="twitter:[^>]*>)*/,
    `<meta property="og:type" content="website"><meta property="og:title" content="${cfg.ogTitle}"><meta property="og:description" content="${cfg.ogDesc}"><meta property="og:image" content="https://www.kabirainternational.com/assets/kabira-campus.jpg"><meta property="og:url" content="${cfg.ogUrl}"><meta name="twitter:card" content="summary_large_image">`,
  );

  // 5. Geo meta tags — add after viewport if not already present
  if (!html.includes('geo.region')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      `<meta name="viewport" content="width=device-width, initial-scale=1">${GEO_METAS}`,
    );
  }

  // 6. JSON-LD schema — replace existing block
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, buildSchema(file));

  await writeFile(filePath, html, 'utf8');
  updated++;
  console.log(`✓ ${file}`);
}

// ── Update sitemap.xml with lastmod dates ─────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const sitemapPath = path.join(dist, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
sitemap = sitemap.replace(
  /<lastmod>[^<]+<\/lastmod>/g,
  `<lastmod>${today}</lastmod>`,
);
await writeFile(sitemapPath, sitemap, 'utf8');
console.log(`✓ sitemap.xml`);

console.log(`\nSEO update complete — ${updated} pages + sitemap updated.`);
