/** Deterministic page metadata, structured data and sitemap. No unverified claims. */
import {readFile,writeFile} from 'node:fs/promises';
import {load} from 'cheerio';
export const origin='https://www.kabirainternational.com';
export const pages=[
['index.html','Home','Preschool & Daycare in Zirakpur | Kabira The International School','Discover Kabira on Patiala Road, Zirakpur: Pre-Nursery, Nursery, LKG, UKG and daycare. Small classes, individual attention and a warm start. Arrange a visit.','hero-v2-1200.webp','preschool in Zirakpur; play school in Zirakpur'],
['about.html','About Kabira','About Kabira | Preschool Leadership & Values, Zirakpur','Meet Dr. Rita Ratan, Director-cum-Principal of Kabira The International School in Zirakpur. Explore our approach to early learning, kindness and confidence.','dr-rita-rattan.webp','Kabira The International School; preschool philosophy Zirakpur'],
['inclusive-learning.html','Inclusive Learning','Inclusive Preschool Learning in Zirakpur | Kabira','How Kabira in Zirakpur supports different learning paces through individual attention, classroom support and open conversations with families.','inclusive-learning-1200.webp','inclusive preschool Zirakpur; additional classroom support'],
['programmes.html','Programmes','Preschool Programmes in Zirakpur | Kabira','Compare Pre-Nursery (2+), Nursery (3+), LKG (4+) and UKG (5+) at Kabira, Zirakpur. See the learning focus at each stage and find your child’s next step.','pre-nursery-learning-1200.webp','preschool programmes Zirakpur; early years age guide'],
['pre-nursery.html','Pre-Nursery','Pre-Nursery in Zirakpur | Kabira The International School','A gentle first school experience for children 2+ at Kabira, Zirakpur. Explore sensory play, stories, settling-in support and Pre-Nursery admissions.','pre-nursery-learning-1200.webp','Pre-Nursery in Zirakpur; playway admission Zirakpur'],
['nursery.html','Nursery','Nursery School in Zirakpur | Kabira','Nursery for children 3+ at Kabira, Zirakpur: sorting, shapes, language and creative discovery. Learn about the programme and enquire for admission.','nursery-learning-1200.webp','Nursery school in Zirakpur; Nursery admission'],
['lkg.html','LKG','LKG in Zirakpur | Early Literacy & Numeracy at Kabira','Explore LKG for children 4+ at Kabira, Zirakpur. Play-based phonics, patterns and early numeracy develop communication, confidence and classroom readiness.','lkg-learning-1200.webp','LKG school Zirakpur; LKG admission'],
['ukg.html','UKG','UKG in Zirakpur | School Readiness at Kabira','UKG for children 5+ at Kabira, Zirakpur builds reading readiness, writing, reasoning and independence. Explore a playful transition towards primary school.','ukg-learning-1200.webp','UKG school Zirakpur; kindergarten readiness'],
['enrichment.html','Enrichment','Preschool Activities in Zirakpur | Kabira Enrichment','Dance, music, age-appropriate abacus and weekly special activities at Kabira, Zirakpur. Discover how enrichment supports expression and confidence.','music-learning-1200.webp','preschool activities Zirakpur; dance music abacus'],
['daycare.html','Daycare','Daycare in Zirakpur | Kabira The International School','Daycare at Kabira on Patiala Road, Zirakpur, from 8:30 AM to 6:30 PM. Explore a calm rhythm of supervised play, rest and reassurance for working families.','story-v2-1200.webp','daycare in Zirakpur; daycare for working parents'],
['admissions.html','Admissions','Preschool Admissions in Zirakpur | Kabira','Enquire for Pre-Nursery, Nursery, LKG, UKG or daycare at Kabira, Zirakpur. Find age guidance, visit information and the admission enquiry form.','kabira-campus-1200.webp','preschool admission Zirakpur; school visit; daycare enquiry']
];
const school={ '@type':'Preschool','@id':origin+'/#school',name:'Kabira The International School',url:origin+'/',description:'Preschool and daycare on Patiala Road, Zirakpur, Punjab, offering Pre-Nursery, Nursery, LKG and UKG.',logo:origin+'/assets/kabira-crest.png',image:origin+'/assets/kabira-campus-1200.webp',telephone:'+919115104300',email:'info@kabirainternational.com',address:{'@type':'PostalAddress',streetAddress:'#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road',addressLocality:'Zirakpur',addressRegion:'Punjab',addressCountry:'IN'},parentOrganization:{'@type':'Organization',name:'Bhattacharya Educational Trust'}};
const stageFiles=['pre-nursery.html','nursery.html','lkg.html','ukg.html'];
for(const [file,label,title,description,image] of pages){
const $=load(await readFile('dist/'+file,'utf8'));const canonical=origin+'/'+(file==='index.html'?'':file);
$('title').text(title);$('meta[name=description]').attr('content',description);
$('meta[name=keywords],meta[name="geo.position"],meta[name=ICBM],script[type="application/ld+json"],meta[name=robots]').remove();
$('link[rel=canonical]').attr('href',canonical);
const meta=(key,value,property=false)=>{const attr=property?'property':'name';const found=$(`meta[${attr}="${key}"]`);if(found.length)found.attr('content',value);else $('head').append($('<meta>').attr({[attr]:key,content:value}));};
meta('og:title',title,true);meta('og:description',description,true);meta('og:url',canonical,true);meta('og:image',origin+'/assets/'+image,true);meta('og:site_name','Kabira The International School',true);meta('og:locale','en_IN',true);meta('og:image:alt',image.includes('learning')?'Illustrative learning scene':label==='About Kabira'?'Dr. Rita Ratan, Director-cum-Principal':image.includes('campus')?'Kabira The International School in Zirakpur':'Illustrative preschool learning scene',true);
meta('twitter:title',title);meta('twitter:description',description);meta('twitter:image',origin+'/assets/'+image);meta('twitter:card','summary_large_image');
let crumbs=[{name:'Home',item:origin+'/'}];if(stageFiles.includes(file))crumbs.push({name:'Programmes',item:origin+'/programmes.html'});if(file!=='index.html')crumbs.push({name:label,item:canonical});
const webPage={'@type':file==='about.html'?'AboutPage':file==='admissions.html'?'ContactPage':'WebPage','@id':canonical+'#page',url:canonical,name:title,description,inLanguage:'en-IN',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#school'},primaryImageOfPage:{'@type':'ImageObject',url:origin+'/assets/'+image}};
const graph=[school,{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Kabira The International School',publisher:{'@id':origin+'/#school'},inLanguage:'en-IN'},webPage];
if(file!=='index.html'){
graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumbs',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});webPage.breadcrumb={'@id':canonical+'#breadcrumbs'};
$('.breadcrumbs').remove();$('main>section').first().prepend(`<nav class="breadcrumbs" aria-label="Breadcrumb">${crumbs.map((c,i)=>i===crumbs.length-1?`<span aria-current="page">${c.name}</span>`:`<a href="${c.item===origin+'/'?'/':c.item.replace(origin+'/','')}">${c.name}</a><span aria-hidden="true">/</span>`).join('')}</nav>`);
}
if(file==='about.html')graph.push({'@type':'Person','@id':origin+'/#leadership',name:'Dr. Rita Ratan',jobTitle:'Director-cum-Principal',worksFor:{'@id':origin+'/#school'},image:origin+'/assets/dr-rita-rattan.webp'});
$('head').append(`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`);
await writeFile('dist/'+file,$.html());
}
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(([file])=>`  <url><loc>${origin}/${file==='index.html'?'':file}</loc></url>`).join('\n')+'\n</urlset>\n');
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Updated ${pages.length} canonical pages, verified-fact schema and sitemap`);
