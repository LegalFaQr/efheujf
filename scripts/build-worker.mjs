import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
const files = ['index.html', 'about.html', 'experience.html', 'programmes.html', 'pre-nursery.html', 'nursery.html', 'lkg.html', 'ukg.html', 'daycare.html', 'enrichment.html', 'inclusive-learning.html', 'admissions.html', 'sitemap.xml', 'robots.txt', 'styles.css', 'app.js', 'admissions.css', 'admissions.js'];
for (const file of await readdir(path.join(dist, 'assets'))) files.push(`assets/${file}`);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const assets = {};
for (const file of files) {
  const data = await readFile(path.join(dist, file));
  assets[`/${file}`] = { body: data.toString('base64'), type: types[path.extname(file)] || 'application/octet-stream', etag: `"${createHash('sha256').update(data).digest('hex').slice(0,24)}"` };
}
await mkdir(path.join(dist, 'server'), { recursive: true });
await mkdir(path.join(dist, '.openai'), { recursive: true });
await writeFile(path.join(dist, 'server/index.js'), `const PUBLIC_ASSETS = ${JSON.stringify(assets)};\n${await readFile(path.join(root, 'worker/index.js'), 'utf8')}`);
await cp(path.join(root, '.openai/hosting.json'), path.join(dist, '.openai/hosting.json'));
await cp(path.join(root, 'drizzle'), path.join(dist, '.openai/drizzle'), { recursive: true });
console.log(`Built a dependency-free Worker with ${files.length} public assets and the admissions database migration.`);
