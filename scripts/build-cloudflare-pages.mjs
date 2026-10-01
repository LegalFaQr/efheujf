import './build-worker.mjs';
import {cp,readFile,readdir,mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const source=resolve('.sites-runtime/public');
const output=resolve('.sites-runtime/cloudflare-pages');
if(dirname(output)!==resolve('.sites-runtime'))throw Error('Invalid Pages staging path');
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
await cp(source,output,{recursive:true});
const files=(await readdir(source,{withFileTypes:true})).filter(x=>x.isFile()).map(x=>x.name);
const pages=files.filter(f=>f.endsWith('.html')).map(f=>'/'+f);
const worker=await readFile('hosting/cloudflare-pages-worker.mjs','utf8');
// Inline the page list at build time; no database or API secret is bound to this frontend.
await writeFile(output+'/_worker.js',worker.replace('env.HTML_PAGES.has(url.pathname)',`new Set(${JSON.stringify(pages)}).has(url.pathname)`));
await writeFile(output+'/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:['/assets/*',...files.filter(f=>!f.endsWith('.html')).map(f=>'/'+f)]},null,2));
console.log('Prepared Cloudflare Pages with unchanged public assets and compatible HTML routing.');
