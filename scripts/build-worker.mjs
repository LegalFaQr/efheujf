import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
const stage = path.resolve(root, '.sites-runtime/public');
if (path.dirname(stage) !== path.resolve(root, '.sites-runtime')) throw Error('Invalid staging path');
await rm(stage, {recursive:true, force:true});
await mkdir(path.join(stage, 'assets'), {recursive:true});
const files = (await readdir(dist,{withFileTypes:true})).filter(f=>f.isFile()).map(f=>f.name);
for (const file of await readdir(path.join(dist, 'assets'))) files.push(`assets/${file}`);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const bytes = new Map();
const hash = data => createHash('sha256').update(data).digest('hex').slice(0,24);
for (const file of files) {
 let data = await readFile(path.join(dist,file));
 const ext=path.extname(file);
 if(['.css','.js'].includes(ext)) data=Buffer.from((await transform(data.toString(),{loader:ext.slice(1),minify:true,target:'es2020',legalComments:'none'})).code);
 bytes.set(file,data);
}
const assets={};
for (const [file,original] of bytes) {
 let data=original;
 if(file.endsWith('.html')) data=Buffer.from(data.toString().replace(/(href|src)="((?:\.\/)?[^"?:/]+\.(?:css|js))(?:\?[^" ]*)?"/g,(all,attr,url)=>{const target=bytes.get(url.replace(/^\.\//,''));return target?`${attr}="${url}?v=${hash(target)}"`:all}));
 await writeFile(path.join(stage,file),data);
 assets[`/${file}`]={body:data.toString('base64'),type:types[path.extname(file)]||'application/octet-stream',etag:`"${hash(data)}"`};
}
await writeFile(path.join(stage,'.nojekyll'),'');
await mkdir(path.join(dist,'server'),{recursive:true});
await writeFile(path.join(dist,'server/index.js'),`const PUBLIC_ASSETS = ${JSON.stringify(assets)};\n${await readFile(path.join(root,'worker/index.js'),'utf8')}`);
console.log(`Built ${files.length} minified/versioned public assets in .sites-runtime/public and the Cloudflare Worker.`);
