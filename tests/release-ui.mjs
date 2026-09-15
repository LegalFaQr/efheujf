import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreview} from '../scripts/preview.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const server=await startPreview(4176);
const browser=await chromium.launch({channel:process.env.QA_BROWSER||'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const requests=[];let succeed=false;
await page.route('https://kabira-international-school.kabiraswebsite.workers.dev/api/admissions',async route=>{requests.push(route.request().postDataJSON());await new Promise(r=>setTimeout(r,250));await route.fulfill({status:succeed?201:503,contentType:'application/json',body:JSON.stringify(succeed?{ok:true,reference:requests.at(-1).requestId}:{error:'Please retry your enquiry.'})})});
const checks=[];
try{
await page.goto('http://127.0.0.1:4176/admissions.html?programme=Nursery');
assert.equal(await page.locator('[name=programme]').inputValue(),'Nursery');checks.push('Programme query preselection');
await page.locator('[name=parentName]').fill('Release Test Parent');await page.locator('[name=childFirstName]').fill('Test');await page.locator('[name=childAge]').selectOption('3');await page.locator('[name=contactNumber]').fill('9999999999');
await page.locator('button[type=submit]').click();assert.equal(requests.length,0);checks.push('Consent is required before submission');
await page.locator('[name=consent]').check();await page.locator('button[type=submit]').click();assert.equal(await page.locator('button[type=submit]').isDisabled(),true);
await page.locator('.form-status[data-state=error]').waitFor();assert.equal(await page.locator('[name=parentName]').inputValue(),'Release Test Parent');assert.equal(requests.length,1);checks.push('Failure preserves input and pending button prevents double submission');
succeed=true;await page.locator('button[type=submit]').click();await page.locator('.form-status[data-state=success]').waitFor();assert.equal(requests[0].requestId,requests[1].requestId);assert.equal(await page.locator('[name=parentName]').inputValue(),'');checks.push('Retry reuses request ID and success clears form with receipt');
await page.locator('#view-uniform').click();assert.equal(await page.locator('#uniform-dialog').evaluate(e=>e.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#uniform-dialog').evaluate(e=>e.open),false);checks.push('Uniform dialog opens and closes with Escape');
for(const route of ['/', 'about.html','inclusive-learning.html','programmes.html','pre-nursery.html','nursery.html','lkg.html','ukg.html','enrichment.html','daycare.html','admissions.html','robots.txt','sitemap.xml']){const r=await fetch('http://127.0.0.1:4176/'+route.replace(/^\//,''));assert.equal(r.status,200)}checks.push('All canonical pages, sitemap and robots return 200');
for(const [route,location] of [['index.html','/'],['experience.html','/inclusive-learning.html']]){const r=await fetch('http://127.0.0.1:4176/'+route,{redirect:'manual'});assert.equal(r.status,301);assert.equal(new URL(r.headers.get('location')).pathname,location)}checks.push('Worker legacy redirects return 301');
const missing=await fetch('http://127.0.0.1:4176/does-not-exist');assert.equal(missing.status,404);assert.match(await missing.text(),/Kabira/);checks.push('Branded missing-page response is 404');
const home=await(await fetch('http://127.0.0.1:4176/')).text();const css=home.match(/href="([^"]+\.css\?v=[^"]+)"/)[1];const asset=await fetch('http://127.0.0.1:4176/'+css);assert.match(asset.headers.get('cache-control'),/immutable/);const conditional=await fetch('http://127.0.0.1:4176/'+css,{headers:{'if-none-match':asset.headers.get('etag')}});assert.equal(conditional.status,304);const head=await fetch('http://127.0.0.1:4176/',{method:'HEAD'});assert.equal(await head.text(),'');checks.push('Versioned assets cache correctly; ETag and HEAD work');
console.log(JSON.stringify({checks,productionSubmissions:0},null,2));await mkdir('.sites-runtime/after',{recursive:true});await writeFile('.sites-runtime/after/interactions.json',JSON.stringify({checks,productionSubmissions:0},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r))}
