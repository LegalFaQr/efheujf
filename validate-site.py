from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

root = Path(__file__).resolve().parent
if root.name == '.sites-runtime':
    root = root.parent
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
assert set(texts) == {'index.html', 'experience.html'}, 'Expected exactly two pages'
pages = {name: Page(text) for name, text in texts.items()}
for name, page in pages.items():
    assert len(page.ids) == len(set(page.ids)), f'Duplicate ID on {name}'
    assert page.h1s == 1, f'Expected one primary heading on {name}'
    for link in page.links:
        parts = urlsplit(link)
        if parts.scheme or parts.netloc:
            continue
        target = parts.path or name
        assert target in pages, f'Missing route: {name} -> {link}'
        assert not parts.fragment or unquote(parts.fragment) in pages[target].ids, f'Missing anchor: {name} -> {link}'
    for asset in page.assets:
        if not urlsplit(asset).scheme:
            assert (dist / asset).is_file(), f'Missing asset: {asset}'
    assert all('alt' in a and 'width' in a and 'height' in a for a in page.images)
    assert not re.search(r'mailto:|tel:|wa\.me|9988369035|@gmail', texts[name], re.I)
    assert '<link rel="canonical"' in texts[name]
assert not pages['index.html'].tabs
assert len(pages['experience.html'].tabs) == 4
assert sum(t.get('aria-selected') == 'true' for t in pages['experience.html'].tabs) == 1
assert all(t['aria-controls'] in pages['experience.html'].ids for t in pages['experience.html'].tabs)
assert 'uniform-dialog' not in pages['index.html'].ids
assert 'uniform-dialog' in pages['experience.html'].ids
assert 'Dr. Rita Rattan' in texts['index.html'] and 'Director & Principal' in texts['index.html']

# Only the green palette and selectors giving the new semantic h1 its original h2
# appearance may differ from the design the user approved.
baseline_css = subprocess.check_output(['git', 'show', 'fc291d4218d44a85713a223c47c08028f5d2908b:dist/styles.css'], cwd=root).decode('utf-8')
expected_css = baseline_css.replace('--green:#416a32', '--green:#355e2c').replace('--lime:#bfdb86', '--lime:#94b862')
expected_css = expected_css.replace('.button-green:hover{background:#d2e6a9}', '.button-green:hover{background:#aecb84}')
expected_css = expected_css.replace('.hero h1 em{color:#c9e39d}', '.hero h1 em{color:var(--lime)}')
expected_css = expected_css.replace('}h2{', '}h2,.page-title{').replace('h2 em,h3 em{', 'h2 em,h3 em,.page-title em{')
css = (dist / 'styles.css').read_text(encoding='utf-8')
assert css == expected_css, 'An unexpected visual style changed'
assert css.count('{') == css.count('}')
assert 'object-fit:cover' not in css
assert 'prefers-reduced-motion' in css
print(json.dumps({'pages': 2, 'cross_page_links': 'pass', 'assets': 'pass', 'programmes_and_uniforms': 'pass', 'contact_exclusions': 'pass', 'original_visual_styles': 'preserved except approved green palette', 'primary_headings': 'one per page'}))
