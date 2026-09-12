import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

await import('./build-site.mjs');

const dist = path.join(process.cwd(), 'dist');
const htmlFiles = ['index.html', 'about.html', 'programs.html', 'daycare.html', 'admissions.html', 'campus.html', 'principal.html', 'contact.html'];

for (const file of htmlFiles) {
  const filePath = path.join(dist, file);
  let html = await readFile(filePath, 'utf8');
  html = html.replace(
    /(<img src="assets\/(?:nature-v2|story-v2)\.jpg"[^>]*?)width="1536" height="1024"/g,
    '$1width="1448" height="1086"',
  );
  html = html.replace(
    '  <link rel="stylesheet" href="styles.css">',
    '  <script>document.documentElement.classList.add(\'js\')</script>\n  <link rel="stylesheet" href="styles.css">',
  );
  html = html.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
  await writeFile(filePath, html, 'utf8');
}

console.log('Finalized responsive image dimensions and generated markup.');
