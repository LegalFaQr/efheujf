import { writeFile } from 'node:fs/promises';
import path from 'node:path';

await import('./build-final.mjs');

const dist = path.join(process.cwd(), 'dist');
const siteUrl = 'https://kabira-international-zirakpur.ritarattan17.chatgpt.site';
const routes = ['', 'experience.html', 'admissions.html'];

await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}/${route}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({
  name: 'Kabira The International School',
  short_name: 'Kabira',
  start_url: './index.html',
  display: 'standalone',
  background_color: '#f5eee2',
  theme_color: '#082654',
  icons: [{ src: 'assets/kabira-mark.jpg', sizes: '512x512', type: 'image/jpeg' }],
}, null, 2), 'utf8');

console.log('Updated the three-page sitemap, crawler rules, and web manifest.');
