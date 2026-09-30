import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
const arrowPaths={
  '↗':'M7 17 17 7M7 7h10v10',
  '→':'M5 12h14M12 5l7 7-7 7',
  '↑':'M12 19V5M5 12l7-7 7 7',
  '⟳':'M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7'
};
function replaceTextArrows($){
  // SVG strokes avoid the coloured emoji glyphs used by some mobile fonts.
  $('body *').contents().filter((_,node)=>node.type==='text'&&/[↗→↑⟳]/u.test(node.data)&&!$(node).parents('script,style,textarea').length).each((_,node)=>{
    const replacement=[];
    for(const part of node.data.split(/([↗→↑⟳][\uFE0E\uFE0F]?)/u)){
      if(!part)continue;
      const path=arrowPaths[part[0]];
      const content=path?$(`<svg class="icon-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${path}"></path></svg>`):$('<span>').text(part).contents();
      replacement.push(...content.toArray());
    }
    $(node).replaceWith(replacement);
  });
}
export function contentSecurityPolicy(html) {
  const hashes=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].filter(m=>m[1].trim()).map(m=>`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  return `default-src 'self'; script-src 'self' ${[...new Set(hashes)].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://kabira-international-school.kabiraswebsite.workers.dev; frame-src https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'none'; form-action 'self'`;
}
export async function preparePages() {
  for(const file of (await readdir('dist')).filter(f=>f.endsWith('.html'))) {
    const original=await readFile('dist/'+file,'utf8');const $=load(original);
    replaceTextArrows($);
    // Native details preserve the text and its order even without JavaScript.
    $('.about-lead-copy,.leadership-copy,.daycare-copy,.img-split-text').each((_,element)=>{
      const container=$(element);if(container.find('.reading-details').length)return;
      const paragraphs=container.children('p').filter((_,p)=>!$(p).hasClass('eyebrow')&&!$(p).hasClass('daycare-time'));
      if(paragraphs.length<2)return;
      const consecutive=[];let next=paragraphs.first().next();
      while(next.is('p')&&!next.hasClass('daycare-time')){consecutive.push(next);next=next.next();}
      if(!consecutive.length)return;
      const label=container.closest('#directors-message').length?'Read the Director’s full message':'Read more about our approach';
      const details=$(`<details class="reading-details"><summary>${label}<span aria-hidden="true">+</span></summary><div class="reading-body"></div></details>`);
      consecutive[0].before(details);for(const p of consecutive)details.find('.reading-body').append(p);
    });
    $('meta[http-equiv="Content-Security-Policy"],meta[name="referrer"]').remove();
    $('meta[charset]').after($('<meta>').attr({'http-equiv':'Content-Security-Policy',content:contentSecurityPolicy($.html())}));
    $('head').append('<meta name="referrer" content="strict-origin-when-cross-origin">');
    await writeFile('dist/'+file,$.html().replace(/^[\t ]+$/gm,''));
  }
}
