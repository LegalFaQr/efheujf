/**
 * SEO upgrade script for Kabira The International School
 * Run with: node scripts/seo-update.mjs
 *
 * What it does:
 * - Adds geo meta tags to every page
 * - Upgrades Schema.org to Preschool + ChildCare with geo, hours, areaServed
 * - Adds FAQPage schema to admissions.html (earns rich results)
 * - Adds BreadcrumbList schema to every inner page
 * - Optimises every title tag for local search
 * - Optimises every meta description with location keywords
 * - Adds lastmod dates to sitemap.xml
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

// ── Shared school schema block ────────────────────────────────────────────────
const SCHOOL_SCHEMA = {
  '@type': ['Preschool', 'ChildCare'],
  '@id': 'https://www.kabirainternational.com/#school',
  name: 'Kabira The International School',
  alternateName: [
    'Kabira International School Zirakpur',
    'Kabira School Zirakpur',
    'Kabira Preschool Zirakpur',
    'Kabira The International School Patiala Road',
  ],
  description:
    'Kabira The International School — a nurturing preschool, kindergarten and daycare in Zirakpur, Punjab, near Chandigarh and Mohali. Pre-Nursery (2+), Nursery (3+), LKG (4+), UKG (5+) and daycare from 8:30 AM to 6:30 PM.',
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
    { '@type': 'City', name: 'Dera Bassi' },
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

// ── Per-page config ───────────────────────────────────────────────────────────
const PAGES = {
  'index.html': {
    title: 'Best Preschool in Zirakpur, Punjab | Kabira The International School',
    desc: 'Kabira The International School — Zirakpur\'s nurturing preschool and daycare, near Chandigarh. Pre-Nursery (2+), Nursery, LKG, UKG. Patiala Road, Punjab. Admissions open 2026–27.',
    ogTitle: 'Best Preschool in Zirakpur, Punjab | Kabira The International School',
    ogDesc: 'Nurturing preschool and daycare in Zirakpur, Punjab near Chandigarh. Pre-Nursery, Nursery, LKG, UKG. Patiala Road. Admissions open 2026–27.',
    ogUrl: 'https://www.kabirainternational.com/',
    extraSchema: [],
    breadcrumb: null,
  },
  'about.html': {
    title: 'About Kabira | International Preschool Near Chandigarh, Zirakpur, Punjab',
    desc: 'About Kabira The International School — a preschool and daycare in Zirakpur, Punjab, near Chandigarh. Led by Dr. Rita Rattan with nearly 28 years of educational leadership.',
    ogTitle: 'About Kabira | Preschool Near Chandigarh, Zirakpur Punjab',
    ogDesc: 'Our story, values and educational leadership behind Kabira International School, Patiala Road, Zirakpur, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/about.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'About Kabira', item: 'https://www.kabirainternational.com/about.html' },
    ],
  },
  'experience.html': {
    title: 'Learning Approach | Preschool in Zirakpur Near Chandigarh | Kabira International',
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
    title: 'Pre-Nursery to UKG Programmes | Preschool Zirakpur, Punjab | Kabira International',
    desc: 'Pre-Nursery (2+), Nursery (3+), LKG (4+) and UKG (5+) at Kabira International School — Patiala Road, Zirakpur, Punjab, near Chandigarh and Mohali. Admissions open.',
    ogTitle: 'Pre-Nursery to UKG | Preschool Programmes Zirakpur, Punjab',
    ogDesc: 'Pre-Nursery, Nursery, LKG and UKG at Kabira International School, Zirakpur, Punjab — a steady, age-appropriate journey near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/programmes.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
    ],
  },
  'pre-nursery.html': {
    title: 'Pre-Nursery School in Zirakpur | 2+ Years | Kabira International School, Punjab',
    desc: 'Pre-Nursery at Kabira International School, Zirakpur — a gentle, play-based start for children 2+ years. Near Chandigarh on Patiala Road, Punjab. Admissions open 2026–27.',
    ogTitle: 'Pre-Nursery School in Zirakpur | Kabira International School',
    ogDesc: 'A gentle first step into school life for children 2+ years. Play-based Pre-Nursery near Chandigarh, Patiala Road, Zirakpur, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/pre-nursery.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Programmes', item: 'https://www.kabirainternational.com/programmes.html' },
      { pos: 3, name: 'Pre-Nursery', item: 'https://www.kabirainternational.com/pre-nursery.html' },
    ],
  },
  'nursery.html': {
    title: 'Nursery School in Zirakpur | 3+ Years | Kabira International School, Punjab',
    desc: 'Nursery school at Kabira International School, Zirakpur — for children 3+ years. Language, early numeracy and creativity. Near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'Nursery School in Zirakpur | Kabira International School, Punjab',
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
    title: 'LKG School in Zirakpur, Punjab | Lower Kindergarten Near Chandigarh | Kabira',
    desc: 'LKG at Kabira International School, Zirakpur — for children 4+ years. Phonics, reading, numeracy and confidence. Near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'LKG School in Zirakpur, Punjab | Kabira International School',
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
    title: 'UKG School in Zirakpur, Punjab | Upper Kindergarten Near Chandigarh | Kabira',
    desc: 'UKG at Kabira International School, Zirakpur — for children 5+ years. School-readiness, literacy and mathematics. Near Chandigarh on Patiala Road, Punjab. Admissions open.',
    ogTitle: 'UKG School in Zirakpur, Punjab | Kabira International School',
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
    title: 'Dance, Music & Abacus | Preschool Enrichment Zirakpur, Punjab | Kabira International',
    desc: 'Enrichment classes at Kabira International School, Zirakpur — dance, music and abacus, plus weekly special activities. Best preschool enrichment near Chandigarh, Punjab.',
    ogTitle: 'Enrichment at Kabira | Dance, Music & Abacus, Zirakpur Punjab',
    ogDesc: 'Regular dance, music and abacus enrichment at Kabira International School, Zirakpur — near Chandigarh, Patiala Road, Punjab.',
    ogUrl: 'https://www.kabirainternational.com/enrichment.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Enrichment', item: 'https://www.kabirainternational.com/enrichment.html' },
    ],
  },
  'daycare.html': {
    title: 'Best Daycare in Zirakpur, Punjab | 8:30 AM–6:30 PM | Kabira International School',
    desc: 'Daycare at Kabira International School, Zirakpur — 8:30 AM to 6:30 PM. Safe, nurturing care for working families near Chandigarh, Patiala Road, Punjab.',
    ogTitle: 'Daycare in Zirakpur, Punjab | Kabira International School',
    ogDesc: 'A calm, secure and homely daycare for working families. 8:30 AM–6:30 PM at Kabira International School, Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/daycare.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Daycare', item: 'https://www.kabirainternational.com/daycare.html' },
    ],
  },
  'inclusive-learning.html': {
    title: 'Inclusive Learning Support | Kabira International School Zirakpur, Punjab',
    desc: 'Inclusive learning support at Kabira International School, Zirakpur — a thoughtful, family-centred approach for children with additional needs. Near Chandigarh, Punjab.',
    ogTitle: 'Inclusive Learning Support | Kabira International School Zirakpur',
    ogDesc: 'How Kabira approaches children with additional learning needs — through conversation with families. Preschool in Zirakpur near Chandigarh.',
    ogUrl: 'https://www.kabirainternational.com/inclusive-learning.html',
    extraSchema: [],
    breadcrumb: [
      { pos: 1, name: 'Home', item: 'https://www.kabirainternational.com/' },
      { pos: 2, name: 'Inclusive Learning', item: 'https://www.kabirainternational.com/inclusive-learning.html' },
    ],
  },
  'admissions.html': {
    title: 'Preschool Admissions Zirakpur 2026–27 | Kabira International School, Punjab',
    desc: 'Enrol your child at Kabira International School, Zirakpur. Pre-Nursery, Nursery, LKG, UKG & Daycare admissions open 2026–27. Near Chandigarh, Patiala Road, Punjab.',
    ogTitle: 'Preschool Admissions Zirakpur 2026–27 | Kabira International School',
    ogDesc: 'Admissions open for Pre-Nursery, Nursery, LKG, UKG and Daycare at Kabira International School, Zirakpur, Punjab. Send an enquiry or arrange a visit.',
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
              text: 'Kabira The International School offers Pre-Nursery (2+ years), Nursery (3+), LKG (4+), UKG (5+) and Daycare from 8:30 AM to 6:30 PM. The school is located on Patiala Road, Zirakpur, Punjab.',
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
              text: 'Kabira International School admits children from 2 years of age. Pre-Nursery is for 2+ years, Nursery for 3+ years, LKG for 4+ years, and UKG for 5+ years.',
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

// ── Geo meta tag string ───────────────────────────────────────────────────────
const geoBlock = '<meta name="geo.region" content="IN-PB"><meta name="geo.placename" content="Zirakpur, Punjab, India"><meta name="geo.position" content="30.6461;76.8197"><meta name="ICBM" content="30.6461, 76.8197">';

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

  // 3. OG tags (replace the whole og block on line 7)
  html = html.replace(
    /<meta property="og:type"[^>]*>(<meta property="og:[^>]*>)*(<meta name="twitter:[^>]*>)*/,
    `<meta property="og:type" content="website"><meta property="og:title" content="${cfg.ogTitle}"><meta property="og:description" content="${cfg.ogDesc}"><meta property="og:image" content="https://www.kabirainternational.com/assets/kabira-campus.jpg"><meta property="og:url" content="${cfg.ogUrl}"><meta name="twitter:card" content="summary_large_image">`,
  );

  // 4. Geo meta tags — add after viewport if not already present
  if (!html.includes('geo.region')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      `<meta name="viewport" content="width=device-width, initial-scale=1">${geoBlock}`,
    );
  }

  // 5. JSON-LD schema — replace existing block
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, buildSchema(file));

  await writeFile(filePath, html, 'utf8');
  updated++;
  console.log(`✓ ${file}`);
}

// ── Update sitemap.xml with lastmod dates ─────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const sitemapPath = path.join(dist, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
// Add lastmod to each URL entry
sitemap = sitemap.replace(
  /(<loc>[^<]+<\/loc>)(<changefreq>)/g,
  `$1<lastmod>${today}</lastmod>$2`,
);
await writeFile(sitemapPath, sitemap, 'utf8');
console.log(`✓ sitemap.xml`);

console.log(`\nSEO update complete — ${updated} pages + sitemap updated.`);
