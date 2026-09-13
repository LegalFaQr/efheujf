from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

root = Path(__file__).resolve().parent
dist = root / 'dist'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.assets, self.images, self.tabs = [], [], [], [], []
        self.h1s = 0
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'h1':
            self.h1s += 1
        if tag == 'a':
            self.links.append(a.get('href', ''))
        if tag == 'img':
            self.images.append(a)
            self.assets.append(a['src'])
            for part in a.get('srcset', '').split(','):
                if part.strip():
                    self.assets.append(part.strip().split()[0])
        if tag == 'script' and a.get('src'):
            self.assets.append(a['src'])
        if tag == 'link' and a.get('rel') == 'stylesheet':
            self.assets.append(a['href'])
        if a.get('role') == 'tab':
            self.tabs.append(a)

texts = {p.name: p.read_text(encoding='utf-8') for p in dist.glob('*.html')}
expected_pages = {'index.html', 'about.html', 'experience.html', 'programmes.html', 'pre-nursery.html', 'nursery.html', 'lkg.html', 'ukg.html', 'daycare.html', 'enrichment.html', 'inclusive-learning.html', 'admissions.html'}
assert set(texts) == expected_pages, 'Expected the full multi-page site'
pages = {name: Page(text) for name, text in texts.items()}
banned_phrases = ['the same one you', 'our gate on patiala road', 'step through our gates', "where your child's journey begins"]
for name, page in pages.items():
    assert len(page.ids) == len(set(page.ids)), f'Duplicate ID on {name}'
    assert page.h1s == 1, f'Expected one primary heading on {name}'
    for link in page.links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc:
            continue
        target = parts.path or name
        if target == '/':
            target = 'index.html'
        assert target in pages, f'Missing route: {name} -> {link}'
        assert not parts.fragment or unquote(parts.fragment) in pages[target].ids, f'Missing anchor: {name} -> {link}'
    for asset in page.assets:
        if not urlsplit(asset).scheme:
            assert (dist / asset).is_file(), f'Missing asset: {asset}'
    assert all('alt' in a and 'width' in a and 'height' in a for a in page.images)
    assert not re.search(r'9988369035|@gmail', texts[name], re.I)
    for email in re.findall(r'mailto:([^"\'>]+)', texts[name]):
        assert email == 'info@kabirainternational.com', f'Unexpected email on {name}: {email}'
    for tel in re.findall(r'tel:([^"\'>]+)', texts[name]):
        assert tel == '+919115104300', f'Unexpected phone number on {name}: {tel}'
    for wa in re.findall(r'wa\.me/(\d+)', texts[name]):
        assert wa == '919115104300', f'Unexpected WhatsApp number on {name}: {wa}'
    assert '<link rel="canonical"' in texts[name]
    lowered = texts[name].lower()
    for phrase in banned_phrases:
        assert phrase not in lowered, f'Invented campus narrative found on {name}: {phrase!r}'
assert not any(page.tabs for page in pages.values()), 'Programme tabs should be replaced by dedicated programme pages'
assert 'uniform-dialog' not in pages['index.html'].ids and 'uniform-dialog' not in pages['experience.html'].ids
assert 'uniform-dialog' in pages['admissions.html'].ids
assert 'Dr. Rita Rattan' in texts['index.html'] and 'Director & Principal' in texts['index.html']
assert 'Dr. Rita Rattan' in texts['about.html'] and 'Director & Principal' in texts['about.html']


# Only the green palette and selectors giving the new semantic h1 its original h2
# appearance may differ from the design the user approved.
baseline_css = subprocess.check_output(['git', 'show', 'fc291d4218d44a85713a223c47c08028f5d2908b:dist/styles.css'], cwd=root).decode('utf-8')
expected_css = baseline_css.replace('--green:#416a32', '--green:#355e2c').replace('--lime:#bfdb86', '--lime:#94b862')
expected_css = expected_css.replace('.button-green:hover{background:#d2e6a9}', '.button-green:hover{background:#aecb84}')
expected_css = expected_css.replace('.hero h1 em{color:#c9e39d}', '.hero h1 em{color:var(--lime)}')
expected_css = expected_css.replace('}h2{', '}h2,.page-title{').replace('h2 em,h3 em{', 'h2 em,h3 em,.page-title em{')
# Phase 3: tighter desktop section rhythm (mobile tiers left untouched).
expected_css = expected_css.replace('.section{padding:94px 7%;max-width:1700px;margin:auto}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:9%;margin-bottom:40px}', '.section{padding:72px 7%;max-width:1700px;margin:auto}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:9%;margin-bottom:32px}')
expected_css = expected_css.replace('.about{padding-top:45px}', '.about{padding-top:28px}')
expected_css = expected_css.replace('.section{padding:75px 6%}', '.section{padding:60px 6%}')
# Phase 4: cap section-heading's own measure so title+intro pairs don't stretch into a dead gap on wide screens.
expected_css = expected_css.replace('.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:9%;margin-bottom:32px}', '.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:6%;margin-bottom:32px;max-width:1180px}')
# Phase 5: tighten the wordmark/subtitle gap.
expected_css = expected_css.replace('.brand small{display:block;font-size:10px;letter-spacing:.09em;text-align:center;margin-top:5px;color:var(--green)}', '.brand small{display:block;font-size:10px;letter-spacing:.09em;text-align:center;margin-top:1px;color:var(--green)}')
expected_css = expected_css.replace('.brand img{width:42px;height:46px}.brand strong{font-size:24px;letter-spacing:.12em}.brand small{font-size:7px;letter-spacing:.06em;margin-top:3px}', '.brand img{width:42px;height:46px}.brand strong{font-size:24px;letter-spacing:.12em}.brand small{font-size:7px;letter-spacing:.06em;margin-top:1px}')
css = (dist / 'styles.css').read_text(encoding='utf-8')
assert css == expected_css, 'An unexpected visual style changed'
assert css.count('{') == css.count('}')
assert 'object-fit:cover' not in css
assert 'prefers-reduced-motion' in css
print(json.dumps({'pages': len(pages), 'cross_page_links': 'pass', 'assets': 'pass', 'contact_exclusions': 'pass', 'campus_image_policy': 'pass', 'original_visual_styles': 'preserved except approved green palette', 'primary_headings': 'one per page'}))
