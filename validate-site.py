from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, re, xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent
dist=root/'dist'
origin='https://www.kabirainternational.com'
public={'index.html','about.html','inclusive-learning.html','programmes.html','pre-nursery.html','nursery.html','lkg.html','ukg.html','enrichment.html','daycare.html','admissions.html'}
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(); self.ids=[];self.links=[];self.assets=[];self.images=[];self.h1s=0;self.canon=[];self.meta={};self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1s+=1
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
        if tag in ['img','script'] and a.get('src'):self.assets.append(a['src'])
        if tag=='link' and a.get('rel') in ['stylesheet','icon','apple-touch-icon','manifest']:self.assets.append(a['href'])
        if tag=='img':
            self.images.append(a)
            self.assets.extend(part.strip().split()[0] for part in a.get('srcset','').split(',') if part.strip())
texts={p.name:p.read_text(encoding='utf-8') for p in dist.glob('*.html')}
assert set(texts)==public|{'experience.html','404.html'},'Unexpected public route inventory'
pages={name:Page(text) for name,text in texts.items()}
titles=[];descriptions=[]
for name,page in pages.items():
    assert len(page.ids)==len(set(page.ids)),f'Duplicate IDs: {name}'
    assert page.h1s==1,f'Expected one H1: {name}'
    for link in page.links:
        parts=urlsplit(link)
        if parts.scheme or parts.netloc:continue
        target=parts.path.lstrip('/') or ('index.html' if parts.path=='/' else name)
        assert target in pages,f'Missing route {name} -> {link}'
        assert not parts.fragment or unquote(parts.fragment) in pages[target].ids,f'Missing anchor {name} -> {link}'
    for asset in page.assets:
        if not urlsplit(asset).scheme:assert (dist/urlsplit(asset).path.lstrip('/')).is_file(),f'Missing asset {name}: {asset}'
    assert all('alt' in a and 'width' in a and 'height' in a for a in page.images),f'Image metadata {name}'
    for tel in re.findall(r'tel:([^"\'>]+)',texts[name]):assert tel=='+919115104300',f'Wrong phone {name}'
    for wa in re.findall(r'wa\.me/(\d+)',texts[name]):assert wa=='919115104300',f'Wrong WhatsApp {name}'
    if name not in public:continue
    expected=origin+'/'+('' if name=='index.html' else name)
    assert page.canon==[expected],f'Canonical {name}'
    assert 'noindex' not in page.meta.get('robots',''),f'Noindex {name}'
    for key in ['description','og:title','og:description','og:image','og:url','twitter:card']:assert page.meta.get(key),f'Missing {key}: {name}'
    assert page.meta['og:url']==expected
    titles.append(re.search(r'<title>(.*?)</title>',texts[name],re.S).group(1));descriptions.append(page.meta['description'])
    assert not re.search(r'ranked among|best pre.?school|best playway|priceRange|aggregateRating|foundingDate',texts[name],re.I),f'Unverified claim {name}'
    assert 'experience.html' not in page.links,f'Legacy link {name}'
    schemas=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',texts[name],re.S)]
    assert len(schemas)==1
    graph=schemas[0]['@graph'];assert any(x['@type']=='Preschool' for x in graph)
    assert any(x['@type']=='WebSite' for x in graph)
    if name!='index.html':assert any(x['@type']=='BreadcrumbList' for x in graph)
assert len(set(titles))==len(public),'Duplicate title'
assert len(set(descriptions))==len(public),'Duplicate meta description'
urls={e.text for e in ET.parse(dist/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
assert urls=={origin+'/'+('' if x=='index.html' else x) for x in public},'Sitemap mismatch'
assert f'Sitemap: {origin}/sitemap.xml' in (dist/'robots.txt').read_text()
assert 'Disallow: /\n' not in (dist/'robots.txt').read_text()
for file in ['styles.css','admissions.css','fonts.css']:
    css=(dist/file).read_text(encoding='utf-8');assert css.count('{')==css.count('}'),f'CSS braces {file}'
    assert not re.search(r'(?:body|html)\s*\{[^}]*overflow-x\s*:\s*(?:hidden|clip)',css),f'Page overflow masking {file}'
assert 'prefers-reduced-motion' in (dist/'styles.css').read_text()
for p in ['pre-nursery','nursery','lkg','ukg']:
    assert f'assets/{p}-learning-' in texts[p+'.html'],f'Missing unique class image {p}'
assert 'Dr. Rita Ratan' in texts['about.html'] and 'Director-cum-Principal' in texts['about.html']
assert 'uniform-dialog' in pages['admissions.html'].ids
print(json.dumps({'indexable_pages':len(public),'utility_pages':1,'legacy_redirect_pages':1,'metadata':'pass','schema_json':'pass','sitemap':'pass','links_and_assets':'pass','brand_and_contact_guards':'pass'}))
