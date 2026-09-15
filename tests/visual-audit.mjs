import {chromium} from 'playwright';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {startPreview} from '../scripts/preview.mjs';
const out=process.env.QA_OUT||'.sites-runtime/after';await mkdir(out,{recursive:true});
const server=await startPreview(4174);const browser=await chromium.launch({channel:process.env.QA_BROWSER||'msedge',headless:true});
const files=(await readdir('dist')).filter(n=>n.endsWith('.html')&&!['experience.html','404.html'].includes(n)&&(!process.env.QA_FILES||process.env.QA_FILES.split(',').includes(n)));
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const widths=[1920,1600,1440,1366,1280,1024,768,430,390,360];const rows=[];
try{for(const file of files){for(const width of widths){
const page=await browser.newPage({viewport:{width,height:width===1920?1080:width===1366||width===1024?768:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto('http://127.0.0.1:4174/'+(file==='index.html'?'':file));await page.evaluate(()=>document.fonts.ready);
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}scrollTo(0,0)});await page.waitForTimeout(150);
const result=await page.evaluate(()=>{
const selector=e=>e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'?'.'+e.className.split(' ').join('.'):'');
return {width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(e=>!e.closest('.skip-link,.form-trap,dialog')).map(e=>{let r=e.getBoundingClientRect();return {selector:selector(e),right:r.right,left:r.left,width:r.width}}).filter(r=>r.width>0&&(r.right>innerWidth+1||r.left < -1)),brokenImages:[...document.images].filter(i=>!i.closest('dialog')&&(!i.complete||i.naturalWidth===0)).map(i=>i.src),stageImages:[...document.querySelectorAll('.stage-learning-img img')].map(i=>({width:i.width,height:i.height})),headings:[...document.querySelectorAll('h1,h2,h3,h4')].map(e=>({level:e.tagName,text:e.textContent.trim()}))};});
const layoutDefects=await page.evaluate(()=>[...document.querySelectorAll('.leadership-profile,.whole-child-visual')].filter(e=>[...e.children].some(c=>c.getBoundingClientRect().bottom>e.getBoundingClientRect().bottom+2)).map(e=>'Content extends below '+e.className));errors.push(...layoutDefects);
if(width<=1000){await page.locator('.menu-toggle').click();const menuWidth=await page.evaluate(()=>document.documentElement.scrollWidth);if(menuWidth>width+1)errors.push('Open menu overflows');await page.keyboard.press('Escape');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')errors.push('Menu Escape failed');}
let violations=[];if([1440,390].includes(width)){await page.addScriptTag({content:axe});const a=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}}));violations=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));await page.screenshot({path:`${out}/${file}-${width}.png`,fullPage:true});}
rows.push({file,status:response.status(),...result,violations,errors});await page.close();}
console.log(file,JSON.stringify(rows.filter(r=>r.file===file&&(r.scroll>r.width+1||r.violations.length||r.errors.length||r.brokenImages.length)).map(r=>({width:r.width,scroll:r.scroll,offenders:r.offenders.slice(0,5),violations:r.violations,errors:r.errors,broken:r.brokenImages}))));}
}finally{await writeFile(out+'/audit.json',JSON.stringify(rows,null,2));await browser.close();await new Promise(r=>server.close(r));}
const fail=rows.filter(r=>r.status!==200||r.scroll>r.width+1||r.brokenImages.length||r.errors.length||r.violations.length);console.log(`${rows.length} renders, ${fail.length} failing checks`);if(fail.length)process.exitCode=1;
