import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4186';
const server=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','pages','dev','.sites-runtime/cloudflare-pages','--ip','127.0.0.1','--port','4186'],{env:{...process.env,WRANGLER_LOG_PATH:'.sites-runtime/wrangler-logs'},stdio:['ignore','pipe','pipe']});
let output='';server.stdout.on('data',data=>{output+=data});server.stderr.on('data',data=>{output+=data});
let browser;
try{
 let ready=false;
 for(let i=0;i<100;i++){
  try{if((await fetch(base,{signal:AbortSignal.timeout(500)})).status===200){ready=true;break}}catch{}
  if(server.exitCode!==null)throw Error('Pages runtime exited: '+output);
  await new Promise(r=>setTimeout(r,200));
 }
 assert.ok(ready,'Pages runtime did not start: '+output);
 const files=(await readdir('.sites-runtime/public')).filter(f=>f.endsWith('.html'));
 for(const file of files){
  const response=await fetch(`${base}/${file}?preserve=query`,{redirect:'manual'});
  assert.equal(response.status,200,file+' must keep its existing .html URL');
  assert.equal(response.headers.get('location'),null,file);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('.sites-runtime/public/'+file),file+' content changed');
 }
 const root=await fetch(base);assert.deepEqual(Buffer.from(await root.arrayBuffer()),await readFile('.sites-runtime/public/index.html'));
 const missing=await fetch(base+'/migration-test-missing');assert.equal(missing.status,404);assert.match(await missing.text(),/Kabira/);
 const head=await fetch(base+'/about.html',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 assert.equal((await fetch(base+'/about.html',{method:'POST'})).status,405);
 browser=await chromium.launch({...(process.env.QA_BROWSER==='chromium'?{}:{channel:process.env.QA_BROWSER||'msedge'}),headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/admissions.html?programme=Nursery');assert.equal(await page.locator('[name=programme]').inputValue(),'Nursery');
 await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.equal(await page.locator('#contact-alt .icon-arrow').count(),2);assert.deepEqual(errors,[]);
 console.log(`PASS: ${files.length} unchanged HTML documents, .html URLs, query parameters, root, 404, HEAD, methods and mobile controls on the real Pages runtime.`);
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
