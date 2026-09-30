import lighthouse from 'lighthouse';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {startPreview} from './preview.mjs';
const out='.sites-runtime/full-audit';await mkdir(out+'/chrome-profile',{recursive:true});
const server=await startPreview(4179);
const chrome=await chromium.launch({channel:process.env.QA_BROWSER||'msedge',headless:true,args:['--remote-debugging-port=9223']});
const rows=[];
try{for(const file of (await readdir('dist')).filter(f=>f.endsWith('.html')&&!['404.html','experience.html'].includes(f)&&(!process.env.QA_FILES||process.env.QA_FILES.split(',').includes(f)))){
 const result=await lighthouse('http://127.0.0.1:4179/'+(file==='index.html'?'':file),{port:9223,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
 const lhr=result.lhr;const row={page:file,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),lcp:Math.round(lhr.audits['largest-contentful-paint'].numericValue),cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,failed:Object.entries(lhr.audits).filter(([k,v])=>v.score!==null&&v.score<.9).map(([id,v])=>({id,title:v.title,score:v.score,display:v.displayValue}))};
 rows.push(row);await writeFile(out+'/'+file+'-lighthouse.json',JSON.stringify(lhr));console.log(JSON.stringify({page:row.page,scores:row.scores,lcp:row.lcp,cls:row.cls}));
}}finally{await writeFile(out+'/performance.json',JSON.stringify(rows,null,2));await chrome.close();await new Promise(r=>server.close(r));}
