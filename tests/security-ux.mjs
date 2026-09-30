import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreview} from '../scripts/preview.mjs';
const server=await startPreview(4180);const browser=await chromium.launch({...(process.env.QA_BROWSER==='chromium'?{}:{channel:process.env.QA_BROWSER||'msedge'}),headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4180/about.html');
 const reading=page.locator('#directors-message .reading-details');assert.equal(await reading.getAttribute('open'),null);await reading.locator('summary').click();assert.equal(await reading.locator('.reading-body').isVisible(),true);
 await page.setViewportSize({width:1440,height:1000});assert.equal(await reading.evaluate(e=>e.open),true);
 await page.goto('http://127.0.0.1:4180/admissions.html');
 for(const phone of ['9115104300','91151 04300','+91 9115104300','919115104300','91151-04300']){await page.locator('[name=contactNumber]').fill(phone);assert.equal(await page.locator('[name=contactNumber]').evaluate(e=>e.validity.valid),true,phone);}
 const response=await page.goto('http://127.0.0.1:4180/');const policy=response.headers()['content-security-policy'];assert.ok(policy.includes("object-src 'none'"));assert.ok(!policy.split('style-src')[0].includes('unsafe-inline'));assert.ok(policy.includes("frame-ancestors 'none'"));
 await page.evaluate(()=>{const s=document.createElement('script');s.textContent='window.untrustedInlineRan=true';document.body.append(s)});assert.equal(await page.evaluate(()=>Boolean(window.untrustedInlineRan)),false);
 assert.deepEqual(errors,[]);
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto('http://127.0.0.1:4180/about.html');await nojs.locator('#directors-message .reading-details summary').click();assert.equal(await nojs.locator('#directors-message .reading-body').isVisible(),true);
 const zoom=await browser.newPage({viewport:{width:320,height:900}});for(const route of ['/','about.html','programmes.html','admissions.html']){await zoom.goto('http://127.0.0.1:4180'+(route==='/'?route:'/'+route));assert.ok(await zoom.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route);}
 console.log('PASS: strict CSP blocks untrusted scripts; native reading works without JS; desktop expands reading; common phone formats work; 320px layouts fit.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
