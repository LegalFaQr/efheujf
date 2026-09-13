import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const pages = ['index.html', 'experience.html', 'admissions.html'];
const obsolete = ['about.html', 'programs.html', 'daycare.html', 'campus.html', 'principal.html', 'contact.html'];
const failures = [];
const forbidden = [/mailto:/i, /tel:/i, /wa\.me/i, /whatsapp/i, /principalkabira/i, /9988369035/, /@gmail\.com/i, /Dr\. Rita Ratan(?!n)/];

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

for (const file of obsolete) {
  if (existsSync(path.join(dist, file))) fail(file, 'obsolete route still exists');
}

for (const file of pages) {
  const filePath = path.join(dist, file);
  if (!existsSync(filePath)) {
    fail(file, 'required page is missing');
    continue;
  }

  const html = readFileSync(filePath, 'utf8');
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) fail(file, `expected one H1, found ${h1Count}`);
  if (!/<html lang="en-IN">/.test(html)) fail(file, 'missing language declaration');
  if (!/<meta name="description" content="[^"]+">/.test(html)) fail(file, 'missing description');
  if (!/<link rel="canonical" href="https:\/\//.test(html)) fail(file, 'missing canonical URL');
  if (!/<main id="main">/.test(html)) fail(file, 'missing main landmark');
  if (!/application\/ld\+json/.test(html)) fail(file, 'missing structured data');

  for (const pattern of forbidden) {
    if (pattern.test(html)) fail(file, `contains forbidden pattern ${pattern}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!/\balt="[^"]*"/.test(tag)) fail(file, 'image lacks alt text');
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) fail(file, 'image lacks explicit dimensions');
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(?:https?:|#|data:|javascript:)/i.test(raw)) continue;
    const [target, fragment] = raw.split('#');
    const resolved = path.resolve(dist, path.dirname(file), target || file);
    if (!existsSync(resolved)) {
      fail(file, `broken local reference ${raw}`);
      continue;
    }
    if (fragment && resolved.endsWith('.html')) {
      const targetHtml = readFileSync(resolved, 'utf8');
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid="${escaped}"`).test(targetHtml)) fail(file, `missing anchor target ${raw}`);
    }
  }
}

for (const asset of ['styles.css', 'app.js', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'assets/kabira-mark.jpg', 'assets/dr-rita-ratan.jpg', 'assets/dr-rita-ratan-small.jpg']) {
  if (!existsSync(path.join(dist, asset))) fail('dist', `missing ${asset}`);
}

const css = readFileSync(path.join(dist, 'styles.css'), 'utf8');
if (!/prefers-reduced-motion/.test(css)) fail('styles.css', 'missing reduced-motion support');
if (/\.(?:visual|portrait)[^{]*\{[^}]*border-radius:\s*\d+%/s.test(css)) fail('styles.css', 'contains an arch-shaped image radius');
if (/fonts\.googleapis|@import\s+url/i.test(css)) fail('styles.css', 'contains an external font request');

const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urlCount = (sitemap.match(/<url>/g) || []).length;
if (urlCount !== 3) fail('sitemap.xml', `expected 3 URLs, found ${urlCount}`);

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Validated 3 pages, local links, image dimensions, metadata, naming, contact constraints, and shape rules.');
